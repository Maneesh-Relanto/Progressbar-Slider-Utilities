import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ModelLoader } from './ModelLoader';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('ModelLoader Component', () => {
  let loader: ModelLoader;

  beforeEach(() => {
    loader = new ModelLoader();
    document.body.appendChild(loader);
  });

  afterEach(() => {
    if (loader.parentNode) {
      loader.remove();
    }
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with default config', () => {
      expect(loader).toBeInstanceOf(ModelLoader);
      expect(loader.tagName.toLowerCase()).toBe('model-loader');
    });

    it('should accept custom configuration', () => {
      const customLoader = new ModelLoader({
        modelName: 'Custom Model',
        showBytes: true,
        showMemoryUsage: true,
      });

      const config = customLoader.getConfig();
      expect(config.modelName).toBe('Custom Model');
      expect(config.showBytes).toBe(true);
      customLoader.remove();
    });

    it('should have shadow root', async () => {
      await waitForElement(loader);
      expect(loader.shadowRoot).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with idle state', () => {
      const state = loader.getState();
      expect(state.isLoading).toBe(false);
      expect(state.currentStage).toBe('download'); // First stage by default
    });

    it('should update state when started', () => {
      loader.start('Loading model...');
      const state = loader.getState();

      expect(state.isLoading).toBe(true);
      expect(state.currentStage).toBe('download');
    });
  });

  describe('Methods', () => {
    describe('start()', () => {
      it('should start loading process', () => {
        loader.start('Loading...');
        const state = loader.getState();

        expect(state.isLoading).toBe(true);
        expect(state.currentStage).toBe('download');
      });

      it('should emit loadstart event', async () => {
        const spy = vi.fn();
        loader.addEventListener('loadstart', spy);

        loader.start();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('updateStage()', () => {
      beforeEach(() => {
        loader.start();
      });

      it('should update stage progress', () => {
        loader.updateStage('download', { progress: 50 });
        const state = loader.getState();

        expect(state.stages.download.progress).toBe(50);
      });

      it('should emit stageupdate event', async () => {
        const spy = vi.fn();
        loader.addEventListener('stageupdate', spy);

        loader.updateStage('download', { progress: 75 });
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('setStage()', () => {
      beforeEach(() => {
        loader.start();
      });

      it('should change current stage', () => {
        loader.setStage('load');
        const state = loader.getState();

        expect(state.currentStage).toBe('load');
      });
    });

    describe('completeStage()', () => {
      beforeEach(() => {
        loader.start();
      });

      it('should mark current stage as complete', () => {
        loader.setStage('download');
        loader.updateStage('download', { progress: 100 });
        loader.completeStage();

        const state = loader.getState();
        expect(state.stages.download.status).toBe('completed');
      });

      it('should advance to next stage', () => {
        loader.setStage('download');
        loader.completeStage();

        const state = loader.getState();
        expect(state.currentStage).toBe('load');
      });
    });

    describe('complete()', () => {
      beforeEach(() => {
        loader.start();
      });

      it('should complete loading process', () => {
        loader.complete();
        const state = loader.getState();

        expect(state.isLoading).toBe(false);
        expect(state.currentStage).toBe('ready');
      });

      it('should emit loadcomplete event', async () => {
        const spy = vi.fn();
        loader.addEventListener('loadcomplete', spy);

        loader.complete();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('error()', () => {
      beforeEach(() => {
        loader.start();
      });

      it('should handle error', () => {
        loader.error('Failed to load');
        const state = loader.getState();

        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(true);
      });

      it('should emit loaderror event', async () => {
        const spy = vi.fn();
        loader.addEventListener('loaderror', spy);

        loader.error('Test error');
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('reset()', () => {
      it('should reset to initial state', () => {
        loader.start();
        loader.updateStage('download', { progress: 50 });
        loader.reset();

        const state = loader.getState();
        expect(state.isLoading).toBe(false);
        expect(state.currentStage).toBe('download');
      });
    });
  });

  describe('Properties', () => {
    it('should get/set disabled state', () => {
      expect(loader.disabled).toBe(false);

      loader.disabled = true;
      expect(loader.disabled).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should render in shadow DOM', async () => {
      await waitForElement(loader);
      expect(loader.shadowRoot?.querySelector('.model-loader')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', async () => {
      await waitForElement(loader);
      const role = loader.getAttribute('role');
      expect(role).toBe('progressbar');
    });
  });

  describe('Size Variants', () => {
    it('should default to default size', () => {
      expect(loader['config'].size).toBe('default');
    });

    it('should accept size in constructor', () => {
      const compact = new ModelLoader({ size: 'compact' });
      expect(compact['config'].size).toBe('compact');
      compact.remove();

      const large = new ModelLoader({ size: 'large' });
      expect(large['config'].size).toBe('large');
      large.remove();
    });

    it('should update size via attribute', async () => {
      await waitForElement(loader);

      loader.setAttribute('size', 'compact');
      await waitForNextTick();
      expect(loader['config'].size).toBe('compact');
      expect(loader.getAttribute('size')).toBe('compact');

      loader.setAttribute('size', 'large');
      await waitForNextTick();
      expect(loader['config'].size).toBe('large');
      expect(loader.getAttribute('size')).toBe('large');
    });

    it('should apply size attribute to host element', async () => {
      await waitForElement(loader);

      loader.setAttribute('size', 'compact');
      await waitForNextTick();
      expect(loader.hasAttribute('size')).toBe(true);
      expect(loader.getAttribute('size')).toBe('compact');
    });
  });
});
