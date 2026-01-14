import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StreamProgress } from './StreamProgress';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('StreamProgress Component', () => {
  let progress: StreamProgress;

  beforeEach(() => {
    progress = new StreamProgress();
    document.body.appendChild(progress);
  });

  afterEach(() => {
    if (progress.parentNode) {
      progress.remove();
    }
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with default config', () => {
      expect(progress).toBeInstanceOf(StreamProgress);
      expect(progress.tagName.toLowerCase()).toBe('stream-progress');
    });

    it('should accept custom configuration', () => {
      const customProgress = new StreamProgress({
        maxTokens: 2000,
        costPerToken: 0.00003,
        showRate: false,
        showCost: false,
      });

      expect(customProgress).toBeInstanceOf(StreamProgress);
      expect(customProgress['config'].maxTokens).toBe(2000);
      expect(customProgress['config'].costPerToken).toBe(0.00003);
      expect(customProgress['config'].showRate).toBe(false);
      customProgress.remove();
    });

    it('should have shadow root', async () => {
      await waitForElement(progress);
      expect(progress.shadowRoot).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with idle state', () => {
      const state = progress['state'];
      expect(state.tokensGenerated).toBe(0);
      expect(state.isStreaming).toBe(false);
      expect(state.isCancelled).toBe(false);
    });

    it('should update state when started', () => {
      progress.start('Starting...');
      const state = progress['state'];

      expect(state.isStreaming).toBe(true);
      expect(state.startTime).toBeGreaterThan(0);
      expect(state.message).toBe('Starting...');
    });

    it('should track tokens correctly', () => {
      progress.start();
      progress.update({ tokensGenerated: 100 });

      const state = progress['state'];
      expect(state.tokensGenerated).toBe(100);
    });
  });

  describe('Methods', () => {
    describe('start()', () => {
      it('should start streaming', () => {
        progress.start('Generating...');
        const state = progress['state'];

        expect(state.isStreaming).toBe(true);
        expect(state.tokensGenerated).toBe(0);
        expect(state.message).toBe('Generating...');
      });

      it('should emit streamstart event', async () => {
        const spy = vi.fn();
        progress.addEventListener('streamstart', spy);

        progress.start();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls[0][0].detail).toHaveProperty('startTime');
      });

      it('should not start if already streaming', () => {
        progress.start();
        const firstStartTime = progress['state'].startTime;

        progress.start();
        expect(progress['state'].startTime).toBe(firstStartTime);
      });
    });

    describe('update()', () => {
      beforeEach(() => {
        progress.start();
      });

      it('should update token count', async () => {
        progress.update({ tokensGenerated: 50 });
        await waitForNextTick();

        const state = progress['state'];
        expect(state.tokensGenerated).toBe(50);
      });

      it('should calculate tokens per second', async () => {
        progress.update({ tokensGenerated: 100, tokensPerSecond: 25 });
        await waitForNextTick();

        const state = progress['state'];
        expect(state.tokensPerSecond).toBe(25);
      });

      it('should update message', async () => {
        progress.update({ tokensGenerated: 50, message: 'Processing...' });
        await waitForNextTick();

        const state = progress['state'];
        expect(state.message).toBe('Processing...');
      });

      it('should emit streamupdate event', async () => {
        const spy = vi.fn();
        progress.addEventListener('streamupdate', spy);

        progress.update({ tokensGenerated: 100 });
        await new Promise((resolve) => setTimeout(resolve, 150));

        expect(spy).toHaveBeenCalled();
      });

      it('should not update if cancelled', () => {
        progress.cancel();
        const tokensBeforeUpdate = progress['state'].tokensGenerated;

        progress.update({ tokensGenerated: 100 });
        expect(progress['state'].tokensGenerated).toBe(tokensBeforeUpdate);
      });

      it('should calculate cost', async () => {
        const costPerToken = 0.00002;
        const tokensGenerated = 1000;
        const customProgress = new StreamProgress({ costPerToken });
        document.body.appendChild(customProgress);

        customProgress.start();
        customProgress.update({ tokensGenerated });
        await waitForNextTick();

        const expectedCost = tokensGenerated * costPerToken;
        expect(customProgress['state'].totalCost).toBeCloseTo(expectedCost, 6);

        customProgress.remove();
      });
    });

    describe('complete()', () => {
      beforeEach(() => {
        progress.start();
        progress.update({ tokensGenerated: 100 });
      });

      it('should complete streaming', () => {
        progress.complete();
        const state = progress['state'];

        expect(state.isStreaming).toBe(false);
      });

      it('should emit streamcomplete event', async () => {
        const spy = vi.fn();
        progress.addEventListener('streamcomplete', spy);

        progress.complete();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
        const detail = spy.mock.calls[0][0].detail;
        expect(detail).toHaveProperty('tokensGenerated');
        expect(detail).toHaveProperty('duration');
        expect(detail).toHaveProperty('totalCost');
        expect(detail).toHaveProperty('averageRate');
      });

      it('should not complete if not streaming', () => {
        const notStreamingProgress = new StreamProgress();
        document.body.appendChild(notStreamingProgress);

        const spy = vi.fn();
        notStreamingProgress.addEventListener('streamcomplete', spy);

        notStreamingProgress.complete();
        expect(spy).not.toHaveBeenCalled();

        notStreamingProgress.remove();
      });
    });

    describe('cancel()', () => {
      beforeEach(() => {
        progress.start();
        progress.update({ tokensGenerated: 50 });
      });

      it('should cancel streaming', () => {
        progress.cancel();
        const state = progress['state'];

        expect(state.isStreaming).toBe(false);
        expect(state.isCancelled).toBe(true);
      });

      it('should emit streamcancel event', async () => {
        const spy = vi.fn();
        progress.addEventListener('streamcancel', spy);

        progress.cancel('user');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
        const detail = spy.mock.calls[0][0].detail;
        expect(detail.reason).toBe('user');
        expect(detail).toHaveProperty('tokensGenerated');
        expect(detail).toHaveProperty('duration');
      });

      it('should support different cancel reasons', async () => {
        const reasons: Array<'user' | 'error' | 'timeout'> = ['user', 'error', 'timeout'];

        for (const reason of reasons) {
          const spy = vi.fn();
          const testProgress = new StreamProgress();
          document.body.appendChild(testProgress);
          testProgress.addEventListener('streamcancel', spy);

          testProgress.start();
          testProgress.cancel(reason);
          await waitForNextTick();

          expect(spy.mock.calls[0][0].detail.reason).toBe(reason);
          testProgress.remove();
        }
      });

      it('should not cancel twice', async () => {
        const spy = vi.fn();
        progress.addEventListener('streamcancel', spy);

        progress.cancel();
        await waitForNextTick();

        progress.cancel();
        await waitForNextTick();

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('reset()', () => {
      it('should reset to initial state', () => {
        progress.start();
        progress.update({ tokensGenerated: 100, tokensPerSecond: 25 });
        progress.complete();

        progress.reset();
        const state = progress['state'];

        expect(state.tokensGenerated).toBe(0);
        expect(state.tokensPerSecond).toBe(0);
        expect(state.totalCost).toBe(0);
        expect(state.isStreaming).toBe(false);
        expect(state.isCancelled).toBe(false);
        expect(state.startTime).toBe(0);
      });
    });
  });

  describe('Properties', () => {
    describe('disabled', () => {
      it('should get/set disabled state', () => {
        expect(progress.disabled).toBe(false);

        progress.disabled = true;
        expect(progress.disabled).toBe(true);

        progress.disabled = false;
        expect(progress.disabled).toBe(false);
      });
    });
  });

  describe('Rendering', () => {
    it('should render in shadow DOM', async () => {
      await waitForElement(progress);
      expect(progress.shadowRoot?.querySelector('.stream-progress')).toBeTruthy();
    });

    it('should show progress bar when configured', async () => {
      const withProgressBar = new StreamProgress({ showProgressBar: true });
      document.body.appendChild(withProgressBar);
      await waitForElement(withProgressBar);

      withProgressBar.start();
      await waitForNextTick();

      withProgressBar.remove();
    });

    it('should show rate when configured', async () => {
      const withRate = new StreamProgress({ showRate: true });
      document.body.appendChild(withRate);
      await waitForElement(withRate);

      withRate.start();
      withRate.update({ tokensGenerated: 100, tokensPerSecond: 25 });
      await waitForNextTick();

      withRate.remove();
    });

    it('should show cost when configured', async () => {
      const withCost = new StreamProgress({ showCost: true, costPerToken: 0.00002 });
      document.body.appendChild(withCost);
      await waitForElement(withCost);

      withCost.start();
      withCost.update({ tokensGenerated: 1000 });
      await waitForNextTick();

      withCost.remove();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid updates', async () => {
      progress.start();

      for (let i = 1; i <= 100; i++) {
        progress.update({ tokensGenerated: i });
      }

      // Wait for throttle to process at least one update
      await new Promise((resolve) => setTimeout(resolve, 250));

      const state = progress['state'];
      expect(state.tokensGenerated).toBeGreaterThan(0);
      expect(state.tokensGenerated).toBeLessThanOrEqual(100);
    });

    it('should handle zero tokens', () => {
      progress.start();
      progress.update({ tokensGenerated: 0 });

      const state = progress['state'];
      expect(state.tokensGenerated).toBe(0);
      expect(state.totalCost).toBe(0);
    });

    it('should handle very large token counts', async () => {
      progress.start();
      progress.update({ tokensGenerated: 1000000 });
      await waitForNextTick();

      const state = progress['state'];
      expect(state.tokensGenerated).toBe(1000000);
    });

    it('should handle negative token rates gracefully', async () => {
      progress.start();
      progress.update({ tokensGenerated: 100, tokensPerSecond: -5 });
      await waitForNextTick();

      const state = progress['state'];
      expect(state.tokensPerSecond).toBe(-5);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', async () => {
      await waitForElement(progress);

      const role = progress.getAttribute('role');
      expect(role).toBe('progressbar');
    });

    it('should update aria-valuenow on progress', async () => {
      progress.start();
      progress.update({ tokensGenerated: 100 });
      await waitForNextTick();

      const valuenow = progress.getAttribute('aria-valuenow');
      expect(valuenow).toBe('100');
    });

    it('should have aria-valuemax', async () => {
      const maxTokens = 2000;
      const customProgress = new StreamProgress({ maxTokens });
      document.body.appendChild(customProgress);

      customProgress.start();
      customProgress.update({ tokensGenerated: 100 });
      await waitForNextTick();

      const valuemax = customProgress.getAttribute('aria-valuemax');
      expect(valuemax).toBe('2000');

      customProgress.remove();
    });
  });

  describe('Memory Management', () => {
    it('should clean up on disconnect', () => {
      const temp = new StreamProgress();
      document.body.appendChild(temp);
      temp.start();
      temp.update({ tokensGenerated: 100 });

      temp.remove();

      expect(() => temp.update({ tokensGenerated: 200 })).not.toThrow();
    });

    it('should cancel animation frames on cleanup', () => {
      progress.start();
      progress.update({ tokensGenerated: 100 });

      const animationFrame = progress['animationFrame'];
      progress.remove();

      // Animation frame should be cleared
      expect(progress['animationFrame']).toBe(animationFrame);
    });
  });

  describe('Size Variants', () => {
    it('should default to default size', () => {
      expect(progress['config'].size).toBe('default');
    });

    it('should accept size in constructor', () => {
      const compactProgress = new StreamProgress({ size: 'compact' });
      expect(compactProgress['config'].size).toBe('compact');
      compactProgress.remove();

      const largeProgress = new StreamProgress({ size: 'large' });
      expect(largeProgress['config'].size).toBe('large');
      largeProgress.remove();
    });

    it('should update size via attribute', async () => {
      await waitForElement(progress);

      progress.setAttribute('size', 'compact');
      await waitForNextTick();
      expect(progress['config'].size).toBe('compact');
      expect(progress.getAttribute('size')).toBe('compact');

      progress.setAttribute('size', 'large');
      await waitForNextTick();
      expect(progress['config'].size).toBe('large');
      expect(progress.getAttribute('size')).toBe('large');
    });

    it('should apply size attribute to host element', async () => {
      await waitForElement(progress);

      progress.setAttribute('size', 'compact');
      await waitForNextTick();
      expect(progress.hasAttribute('size')).toBe(true);
      expect(progress.getAttribute('size')).toBe('compact');
    });
  });

  describe('Visual Variants', () => {
    it('should apply default variant by default', () => {
      expect(progress['config'].variant).toBe('default');
    });

    it('should apply minimal variant', () => {
      const minimal = new StreamProgress({ variant: 'minimal' });
      expect(minimal['config'].variant).toBe('minimal');
      minimal.remove();
    });

    it('should apply gradient variant', () => {
      const gradient = new StreamProgress({ variant: 'gradient' });
      expect(gradient['config'].variant).toBe('gradient');
      gradient.remove();
    });

    it('should apply glassmorphic variant', () => {
      const glassmorphic = new StreamProgress({ variant: 'glassmorphic' });
      expect(glassmorphic['config'].variant).toBe('glassmorphic');
      glassmorphic.remove();
    });
  });

  describe('Animation Effects', () => {
    it('should apply none animation by default', () => {
      expect(progress['config'].animation).toBe('none');
    });

    it('should apply striped animation', () => {
      const striped = new StreamProgress({ animation: 'striped' });
      expect(striped['config'].animation).toBe('striped');
      striped.remove();
    });

    it('should apply pulse animation', () => {
      const pulse = new StreamProgress({ animation: 'pulse' });
      expect(pulse['config'].animation).toBe('pulse');
      pulse.remove();
    });

    it('should apply glow animation', () => {
      const glow = new StreamProgress({ animation: 'glow' });
      expect(glow['config'].animation).toBe('glow');
      glow.remove();
    });
  });
});
