import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BatchProgress } from './BatchProgress';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('BatchProgress Component', () => {
  let progress: BatchProgress;

  beforeEach(() => {
    progress = new BatchProgress();
    document.body.appendChild(progress);
  });

  afterEach(() => {
    if (progress.parentNode) {
      progress.parentNode.removeChild(progress);
    }
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with default config', () => {
      expect(progress).toBeInstanceOf(BatchProgress);
      expect(progress.tagName.toLowerCase()).toBe('batch-progress');
    });

    it('should accept custom configuration', () => {
      const customProgress = new BatchProgress({
        totalItems: 100,
        showRate: true,
        showETA: true,
      });

      expect(customProgress['config'].totalItems).toBe(100);
      expect(customProgress['config'].showRate).toBe(true);
      customProgress.remove();
    });

    it('should have shadow root', async () => {
      await waitForElement(progress);
      expect(progress.shadowRoot).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with idle state', () => {
      expect(progress['state'].status).toBe('idle');
      expect(progress['state'].items.size).toBe(0);
    });

    it('should track batch items', () => {
      progress.start();
      progress.addItem('item1', 'Task 1');

      expect(progress['state'].items.size).toBe(1);
    });

    it('should track completed items', () => {
      progress.start();
      progress.addItem('item1', 'Task 1');
      progress.completeItem('item1');

      expect(progress['state'].completedCount).toBe(1);
    });
  });

  describe('Methods', () => {
    describe('start()', () => {
      it('should start batch processing', () => {
        progress.start();

        expect(progress['state'].status).toBe('processing');
        expect(progress['state'].totalItems).toBeGreaterThanOrEqual(0);
      });

      it('should emit batchstart event', async () => {
        const spy = vi.fn();
        progress.addEventListener('batchstart', spy);

        progress.start();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('addItem()', () => {
      beforeEach(() => {
        progress.start();
      });

      it('should add item to batch', () => {
        progress.addItem('item1', 'Task 1');

        expect(progress['state'].items.size).toBe(1);
        expect(progress['state'].items.get('item1')?.id).toBe('item1');
      });

      it('should not emit itemupdate on add', async () => {
        const spy = vi.fn();
        progress.addEventListener('itemupdate', spy);

        progress.addItem('item1', 'Task 1');
        await waitForNextTick();

        // addItem doesn't trigger itemupdate, only updateItem does
        expect(spy).not.toHaveBeenCalled();
      });

      it('should handle multiple items', () => {
        progress.addItem('item1', 'Task 1');
        progress.addItem('item2', 'Task 2');
        progress.addItem('item3', 'Task 3');

        expect(progress['state'].items.size).toBe(3);
      });
    });

    describe('updateItem()', () => {
      beforeEach(() => {
        progress.start();
        progress.addItem('item1', 'Task 1');
      });

      it('should update item progress', () => {
        progress.updateItem({ itemId: 'item1', progress: 50 });

        const item = progress['state'].items.get('item1');
        expect(item?.progress).toBe(50);
      });

      it('should emit itemupdate event', async () => {
        const spy = vi.fn();
        progress.addEventListener('itemupdate', spy);

        progress.updateItem({ itemId: 'item1', progress: 75 });
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('completeItem()', () => {
      beforeEach(() => {
        progress.start();
        progress.addItem('item1', 'Task 1');
      });

      it('should mark item as complete', () => {
        progress.completeItem('item1');

        const item = progress['state'].items.get('item1');
        expect(item?.status).toBe('completed');
        expect(progress['state'].completedCount).toBe(1);
      });

      it('should emit itemcomplete event', async () => {
        const spy = vi.fn();
        progress.addEventListener('itemcomplete', spy);

        progress.completeItem('item1');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('failItem()', () => {
      beforeEach(() => {
        progress.start();
        progress.addItem('item1', 'Task 1');
      });

      it('should mark item as failed', () => {
        progress.failItem('item1', 'Error occurred');

        const item = progress['state'].items.get('item1');
        expect(item?.status).toBe('failed');
        expect(progress['state'].failedCount).toBe(1);
      });

      it('should emit itemfail event', async () => {
        const spy = vi.fn();
        progress.addEventListener('itemfailed', spy);

        progress.failItem('item1', 'Test error');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('complete()', () => {
      beforeEach(() => {
        progress.start();
        progress.addItem('item1', 'Task 1');
        progress.addItem('item2', 'Task 2');
        progress.completeItem('item1');
        progress.completeItem('item2');
      });

      it('should complete batch', () => {
        progress.complete();
        expect(progress['state'].status).toBe('completed');
      });

      it('should emit batchcomplete event', async () => {
        const spy = vi.fn();
        progress.addEventListener('batchcomplete', spy);

        progress.complete();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('cancel()', () => {
      beforeEach(() => {
        progress.start();
      });

      it('should cancel batch', () => {
        progress.cancel();
        expect(progress['state'].status).toBe('cancelled');
      });

      it('should emit batchcancel event', async () => {
        const spy = vi.fn();
        progress.addEventListener('batchcancel', spy);

        progress.cancel();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('reset()', () => {
      it('should reset to initial state', () => {
        progress.start();
        progress.addItem('item1', 'Task 1');
        progress.completeItem('item1');
        progress.reset();

        expect(progress['state'].status).toBe('idle');
        expect(progress['state'].items.size).toBe(0);
        expect(progress['state'].completedCount).toBe(0);
      });
    });

    describe('getOverallProgress()', () => {
      it('should calculate overall progress', () => {
        progress.start();
        progress.addItem('item1', 'Task 1');
        progress.addItem('item2', 'Task 2');
        progress.completeItem('item1');

        const overallProgress = progress.getOverallProgress();
        expect(overallProgress).toBeGreaterThan(0);
        expect(overallProgress).toBeLessThanOrEqual(100);
      });

      it('should return 0 for no items', () => {
        progress.start();
        expect(progress.getOverallProgress()).toBe(0);
      });

      it('should return 100 when all complete', () => {
        progress.start();
        progress.addItem('item1', 'Task 1');
        progress.addItem('item2', 'Task 2');
        progress.completeItem('item1');
        progress.completeItem('item2');

        expect(progress.getOverallProgress()).toBe(100);
      });
    });

    describe('getRate()', () => {
      it('should calculate processing rate', () => {
        progress.start();
        progress.addItem('item1', 'Task 1');
        progress.completeItem('item1');

        const rate = progress.getRate();
        expect(rate).toBeGreaterThanOrEqual(0);
      });
    });

    describe('getStats()', () => {
      it('should return batch statistics', () => {
        progress.start();
        progress.addItem('item1', 'Task 1');
        progress.addItem('item2', 'Task 2');
        progress.completeItem('item1');
        progress.failItem('item2', 'Error');

        const stats = progress.getStats();
        expect(stats.total).toBe(2); // Actual added items
        expect(stats.completed).toBe(2); // completedCount includes both success and failed
        expect(stats.failed).toBe(1);
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
      expect(progress.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should update display on item changes', async () => {
      progress.start();
      await waitForElement(progress);

      progress.addItem('item1', 'Task 1');
      await waitForNextTick();

      const container = progress.shadowRoot?.querySelector('.container');
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

  describe('Edge Cases', () => {
    it('should handle zero total items', () => {
      progress.start();
      expect(progress['state'].totalItems).toBeGreaterThanOrEqual(0);
    });

    it('should handle duplicate item IDs', () => {
      progress.start();
      progress.addItem('item1', 'Task 1');
      progress.addItem('item1', 'Task 1 Duplicate');

      // Map overwrites duplicate keys
      expect(progress['state'].items.has('item1')).toBe(true);
      expect(progress['state'].items.size).toBe(1);
    });

    it('should handle rapid item operations', async () => {
      progress.start();

      for (let i = 0; i < 10; i++) {
        progress.addItem(`item${i}`, `Task ${i}`);
        await waitForNextTick();
        progress.updateItem({ itemId: `item${i}`, progress: 50 });
        await waitForNextTick();
        progress.completeItem(`item${i}`);
        await waitForNextTick();
      }

      expect(progress['state'].completedCount).toBe(10);
    });
  });
});
