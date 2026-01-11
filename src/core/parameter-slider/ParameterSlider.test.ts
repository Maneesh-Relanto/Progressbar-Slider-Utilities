import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ParameterSlider } from './ParameterSlider';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('ParameterSlider Component', () => {
  let slider: ParameterSlider;

  beforeEach(() => {
    slider = new ParameterSlider();
    document.body.appendChild(slider);
  });

  afterEach(() => {
    if (slider.parentNode) {
      slider.remove();
    }
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with default config', () => {
      expect(slider).toBeInstanceOf(ParameterSlider);
      expect(slider.tagName.toLowerCase()).toBe('parameter-slider');
    });

    it('should accept custom configuration', () => {
      const customSlider = new ParameterSlider({
        label: 'Temperature',
        min: 0,
        max: 2,
        value: 0.7,
        step: 0.1,
      });

      const config = customSlider.getConfig();
      expect(config.label).toBe('Temperature');
      expect(config.min).toBe(0);
      expect(config.max).toBe(2);
      customSlider.remove();
    });

    it('should have shadow root', async () => {
      await waitForElement(slider);
      expect(slider.shadowRoot).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with default value', () => {
      const state = slider.getState();
      expect(state.currentValue).toBeDefined();
      expect(typeof state.currentValue).toBe('number');
    });

    it('should track value changes', () => {
      const initialValue = slider.getValue();
      slider.setValue(0.8);
      
      expect(slider.getValue()).toBe(0.8);
      expect(slider.getValue()).not.toBe(initialValue);
    });
  });

  describe('Methods', () => {
    describe('getValue()', () => {
      it('should return current value', () => {
        const value = slider.getValue();
        expect(typeof value).toBe('number');
      });

      it('should return updated value after setValue', () => {
        slider.setValue(0.5);
        expect(slider.getValue()).toBe(0.5);
      });
    });

    describe('setValue()', () => {
      it('should update slider value', () => {
        slider.setValue(0.9);
        expect(slider.getValue()).toBe(0.9);
      });

      it('should emit valuechange event', async () => {
        const spy = vi.fn();
        slider.addEventListener('valuechange', spy);

        slider.setValue(0.6);
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });

      it('should clamp value to min/max', () => {
        const config = slider.getConfig();
        
        slider.setValue(config.max + 1);
        expect(slider.getValue()).toBeLessThanOrEqual(config.max);

        slider.setValue(config.min - 1);
        expect(slider.getValue()).toBeGreaterThanOrEqual(config.min);
      });
    });

    describe('reset()', () => {
      it('should reset to default value', () => {
        const config = slider.getConfig();
        const defaultValue = config.defaultValue;
        
        slider.setValue(0.9);
        slider.reset();

        expect(slider.getValue()).toBe(defaultValue);
      });

      it('should emit valuechange event on reset', async () => {
        const spy = vi.fn();
        slider.addEventListener('valuechange', spy);

        slider.setValue(0.9);
        slider.reset();
        await waitForNextTick();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('selectPreset()', () => {
      it('should select preset if available', () => {
        const customSlider = new ParameterSlider({
          label: 'Temperature',
          presets: [
            { value: 0.3, label: 'Conservative' },
            { value: 0.7, label: 'Balanced' },
          ],
        });
        document.body.appendChild(customSlider);

        customSlider.selectPreset({ value: 0.3, label: 'Conservative' });
        expect(customSlider.getValue()).toBe(0.3);

        customSlider.remove();
      });
    });
  });

  describe('Properties', () => {
    it('should get/set disabled state', () => {
      expect(slider.disabled).toBe(false);

      slider.disabled = true;
      expect(slider.disabled).toBe(true);
    });

    it('should get/set value property', () => {
      slider.value = 0.75;
      expect(slider.value).toBe(0.75);
    });
  });

  describe('Rendering', () => {
    it('should render in shadow DOM', async () => {
      await waitForElement(slider);
      expect(slider.shadowRoot?.querySelector('.parameter-slider')).toBeTruthy();
    });

    it('should render slider controls', async () => {
      await waitForElement(slider);
      const track = slider.shadowRoot?.querySelector('.slider-track');
      expect(track).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      await waitForElement(slider);
      const thumb = slider.shadowRoot?.querySelector('.slider-thumb');
      
      expect(thumb?.getAttribute('role')).toBe('slider');
      expect(thumb?.hasAttribute('tabindex')).toBe(true);
    });

    it('should be keyboard accessible', async () => {
      await waitForElement(slider);
      const thumb = slider.shadowRoot?.querySelector('.slider-thumb') as HTMLElement;
      
      expect(thumb.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero value', () => {
      slider.setValue(0);
      expect(slider.getValue()).toBe(0);
    });

    it('should handle max value', () => {
      const config = slider.getConfig();
      slider.setValue(config.max);
      expect(slider.getValue()).toBe(config.max);
    });

    it('should handle rapid value changes', async () => {
      const values = [0.1, 0.2, 0.3, 0.4, 0.5];
      
      for (const val of values) {
        slider.setValue(val);
        await waitForNextTick();
      }

      expect(slider.getValue()).toBe(0.5);
    });
  });
});
