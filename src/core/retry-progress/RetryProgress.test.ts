import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RetryProgress } from './RetryProgress';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('RetryProgress Component', () => {
  let progress: RetryProgress;

  beforeEach(() => {
    progress = new RetryProgress();
    document.body.appendChild(progress);
  });

  afterEach(() => {
    if (progress.parentNode) {
      progress.parentNode.removeChild(progress);
    }
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with default config', () => {
      expect(progress).toBeInstanceOf(RetryProgress);
      expect(progress.tagName.toLowerCase()).toBe('retry-progress');
    });

    it('should accept custom configuration', () => {
      const customProgress = new RetryProgress({
        maxAttempts: 5,
        strategy: 'exponential',
        baseDelay: 1000,
      });

      expect(customProgress['config'].maxAttempts).toBe(5);
      expect(customProgress['config'].strategy).toBe('exponential');
      customProgress.remove();
    });

    it('should have shadow root', async () => {
      await waitForElement(progress);
      expect(progress.shadowRoot).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with idle status', () => {
      const status = progress.getStatus();
      expect(status).toBe('idle');
    });

    it('should track attempt number', () => {
      progress.attempt('Operation 1');
      expect(progress.getAttempt()).toBe(1);
    });

    it('should track retry timing', () => {
      progress.attempt('Operation 1');
      progress.waitForRetry(1000);
      
      const timeUntilRetry = progress.getTimeUntilRetry();
      expect(timeUntilRetry).toBeGreaterThan(0);
    });
  });

  describe('Methods', () => {
    describe('attempt()', () => {
      it('should start new attempt', () => {
        progress.attempt('Test operation');
        
        expect(progress.getStatus()).toBe('attempting');
        expect(progress.getAttempt()).toBe(1);
      });

      it('should emit retryattempt event', async () => {
        const spy = vi.fn();
        progress.addEventListener('retryattempt', spy);

        progress.attempt('Test');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });

      it('should not auto-increment on each call', () => {
        progress.attempt('Test 1');
        expect(progress.getAttempt()).toBe(1);

        // attempt() doesn't increment, waitForRetry() does
        progress.attempt('Test 2');
        expect(progress.getAttempt()).toBe(1);
      });
    });

    describe('waitForRetry()', () => {
      beforeEach(() => {
        progress.attempt('Test operation');
      });

      it('should set retry wait state', () => {
        progress.waitForRetry(1000);
        
        expect(progress.getStatus()).toBe('waiting');
        expect(progress.getTimeUntilRetry()).toBeGreaterThan(0);
      });

      it('should emit retrywaiting event', async () => {
        const spy = vi.fn();
        progress.addEventListener('retrywaiting', spy);

        progress.waitForRetry({ delay: 500 });
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });

      it('should countdown retry timer', async () => {
        progress.waitForRetry(100);
        const initialTime = progress.getTimeUntilRetry();
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const laterTime = progress.getTimeUntilRetry();
        expect(laterTime).toBeLessThan(initialTime);
      });
    });

    describe('success()', () => {
      beforeEach(() => {
        progress.attempt('Test operation');
      });

      it('should mark operation as successful', () => {
        progress.success();
        expect(progress.getStatus()).toBe('success');
      });

      it('should emit retrysuccess event', async () => {
        const spy = vi.fn();
        progress.addEventListener('retrysuccess', spy);

        progress.success();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('failure()', () => {
      beforeEach(() => {
        progress.attempt('Test operation');
      });

      it('should handle failure', () => {
        progress.failure('Operation failed');
        expect(progress.getStatus()).toBe('failed');
      });

      it('should emit retryfailure event', async () => {
        const spy = vi.fn();
        progress.addEventListener('retryfailure', spy);

        progress.failure('Test error');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });

      it('should track max attempts reached', () => {
        const maxAttempts = progress['config'].maxAttempts || 3;
        
        // First attempt
        progress.attempt(`Attempt 1`);
        expect(progress.getAttempt()).toBe(1);
        
        // Subsequent attempts via waitForRetry which increments
        for (let i = 2; i <= maxAttempts; i++) {
          progress.waitForRetry({ attempt: i });
        }

        expect(progress.getAttempt()).toBe(maxAttempts);
      });
    });

    describe('cancel()', () => {
      beforeEach(() => {
        progress.attempt('Test operation');
      });

      it('should cancel retry process', () => {
        progress.cancel();
        expect(progress.getStatus()).toBe('cancelled');
      });

      it('should emit retrycancel event', async () => {
        const spy = vi.fn();
        progress.addEventListener('retrycancel', spy);

        progress.cancel();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('reset()', () => {
      it('should reset to initial state', () => {
        progress.attempt('Test 1');
        progress.waitForRetry({ attempt: 2, delay: 1000 });
        progress.reset();

        expect(progress.getStatus()).toBe('idle');
        expect(progress.getAttempt()).toBe(1); // Reset to initial attempt
        expect(progress.getTimeUntilRetry()).toBe(0);
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
      expect(progress.shadowRoot?.querySelector('.retry-container')).toBeTruthy();
    });

    it('should update display on attempt', async () => {
      progress.attempt('Test operation');
      await waitForElement(progress);

      const container = progress.shadowRoot?.querySelector('.retry-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', async () => {
      await waitForElement(progress);
      const role = progress.getAttribute('role');
      expect(role).toBe('region');
    });
  });

  describe('Retry Strategies', () => {
    it('should handle constant delay strategy', () => {
      const constantProgress = new RetryProgress({
        strategy: 'constant',
        baseDelay: 1000,
      });
      document.body.appendChild(constantProgress);

      constantProgress.attempt('Test');
      constantProgress.waitForRetry();

      expect(constantProgress.getTimeUntilRetry()).toBeCloseTo(1000, -2);
      constantProgress.remove();
    });

    it('should handle exponential backoff strategy', () => {
      const expProgress = new RetryProgress({
        strategy: 'exponential',
        baseDelay: 100,
      });
      document.body.appendChild(expProgress);

      expProgress.attempt('Test 1');
      const delay1 = expProgress['calculateDelay'](1);
      
      expProgress.attempt('Test 2');
      const delay2 = expProgress['calculateDelay'](2);

      expect(delay2).toBeGreaterThan(delay1);
      expProgress.remove();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero max attempts', () => {
      const zeroProgress = new RetryProgress({ maxAttempts: 0 });
      document.body.appendChild(zeroProgress);

      zeroProgress.attempt('Test');
      expect(zeroProgress.getAttempt()).toBe(1);
      
      zeroProgress.remove();
    });

    it('should handle rapid attempt cycles', async () => {
      let currentAttempt = 1;
      for (let i = 0; i < 5; i++) {
        progress.attempt(`Attempt ${i}`);
        await waitForNextTick();
        progress.failure('Failed');
        await waitForNextTick();
        // Would need to call waitForRetry to actually increment for next cycle
        if (i < 4) {
          currentAttempt++;
          progress.waitForRetry({ attempt: currentAttempt });
          await waitForNextTick();
        }
      }

      expect(progress.getAttempt()).toBeGreaterThan(0);
    });
  });
});
