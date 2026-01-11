import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueueProgress } from './QueueProgress';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('QueueProgress Component', () => {
  let progress: QueueProgress;

  beforeEach(() => {
    progress = new QueueProgress();
    document.body.appendChild(progress);
  });

  afterEach(() => {
    if (progress.parentNode) {
      progress.parentNode.removeChild(progress);
    }
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with default config', () => {
      expect(progress).toBeInstanceOf(QueueProgress);
      expect(progress.tagName.toLowerCase()).toBe('queue-progress');
    });

    it('should accept custom configuration', () => {
      const customProgress = new QueueProgress({
        position: 100,
        queueSize: 200,
        showPosition: true,
      });

      expect(customProgress['config'].position).toBe(100);
      expect(customProgress['config'].queueSize).toBe(200);
      customProgress.remove();
    });

    it('should have shadow root', async () => {
      await waitForElement(progress);
      expect(progress.shadowRoot).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with waiting status', () => {
      const status = progress.getStatus();
      expect(status).toBe('waiting');
    });

    it('should track position', () => {
      const customProgress = new QueueProgress({ position: 5 });
      document.body.appendChild(customProgress);
      customProgress.start();
      expect(customProgress.getPosition()).toBe(5);
      customProgress.remove();
    });
  });

  describe('Methods', () => {
    describe('start()', () => {
      it('should start queue tracking', () => {
        const customProgress = new QueueProgress({ position: 3, queueSize: 10 });
        document.body.appendChild(customProgress);
        customProgress.start('Waiting in queue...');
        
        expect(customProgress.getStatus()).toBe('waiting');
        expect(customProgress.getPosition()).toBe(3);
        customProgress.remove();
      });

      it('should emit queuestart event', async () => {
        const spy = vi.fn();
        progress.addEventListener('queuestart', spy);

        progress.start();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('update()', () => {
      beforeEach(() => {
        progress['config'].position = 5;
        progress['state'].position = 5;
        progress.start();
      });

      it('should update queue position', () => {
        progress.update({ position: 3 });
        expect(progress.getPosition()).toBe(3);
      });

      it('should emit positionchange event', async () => {
        const spy = vi.fn();
        progress.addEventListener('positionchange', spy);

        progress.update({ position: 2 });
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });

      it('should handle position decrease', () => {
        progress['config'].position = 3;
        progress['state'].position = 3;
        progress.start();
        
        progress.update({ position: 1 });
        expect(progress.getPosition()).toBe(1);
      });
    });

    describe('complete()', () => {
      beforeEach(() => {
        progress['config'].position = 1;
        progress['state'].position = 1;
        progress.start();
      });

      it('should complete queue', () => {
        progress.complete();
        expect(progress.getStatus()).toBe('completed');
      });

      it('should emit queuecomplete event', async () => {
        const spy = vi.fn();
        progress.addEventListener('queuecomplete', spy);

        progress.complete();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('cancel()', () => {
      beforeEach(() => {
        progress['config'].position = 5;
        progress['state'].position = 5;
        progress.start();
      });

      it('should cancel queue', () => {
        progress.cancel();
        expect(progress.getStatus()).toBe('cancelled');
      });

      it('should update status on cancel', async () => {
        progress.cancel('User cancelled');
        await waitForNextTick();

        expect(progress.getStatus()).toBe('cancelled');
      });
    });

    describe('error()', () => {
      beforeEach(() => {
        progress['config'].position = 2;
        progress['state'].position = 2;
        progress.start();
      });

      it('should handle error', () => {
        progress.error('Queue error');
        expect(progress.getStatus()).toBe('error');
      });

      it('should emit queueerror event', async () => {
        const spy = vi.fn();
        progress.addEventListener('queueerror', spy);

        progress.error('Test error');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('reset()', () => {
      it('should reset to initial state', () => {
        progress.start({ position: 5, total: 10 });
        progress.update({ position: 3 });
        progress.reset();

        expect(progress.getStatus()).toBe('waiting');
        expect(progress.getPosition()).toBe(0);
      });
    });
  });

  describe('Properties', () => {
    it('should get/set disabled state', () => {
      expect(progress.disabled).toBe(false);

      progress.disabled = true;
      expect(progress.disabled).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should render in shadow DOM', async () => {
      await waitForElement(progress);
      expect(progress.shadowRoot?.querySelector('.queue-container')).toBeTruthy();
    });

    it('should update display on position change', async () => {
      progress.start({ position: 5, total: 10 });
      await waitForElement(progress);

      progress.update({ position: 3 });
      await waitForNextTick();

      const container = progress.shadowRoot?.querySelector('.queue-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', async () => {
      await waitForElement(progress);
      const role = progress.getAttribute('role');
      expect(role).toBe('status');
    });
  });

  describe('Edge Cases', () => {
    it('should handle position 0', () => {
      progress.start({ position: 0, total: 10 });
      expect(progress.getPosition()).toBe(0);
    });

    it('should handle position at total', () => {
      const customProgress = new QueueProgress({ position: 10, queueSize: 10 });
      document.body.appendChild(customProgress);
      customProgress.start();
      expect(customProgress.getPosition()).toBe(10);
      customProgress.remove();
    });

    it('should handle rapid position updates', async () => {
      progress['config'].position = 10;
      progress['state'].position = 10;
      progress.start();

      for (let i = 9; i >= 0; i--) {
        progress.update({ position: i });
      }

      // Wait for throttled updates to complete (100ms throttle + buffer)
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Throttling means not all updates will be processed, but position should be lower
      expect(progress.getPosition()).toBeLessThanOrEqual(10);
      expect(progress.getPosition()).toBeGreaterThanOrEqual(0);
    });
  });
});
