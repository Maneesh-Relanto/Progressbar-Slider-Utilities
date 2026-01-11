import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ParameterPanel } from './ParameterPanel';
import type { ParameterPanelConfig, ExportedConfig } from './types';
import { waitForElement, waitForNextTick } from '../../__tests__/setup';

describe('ParameterPanel Component', () => {
  let panel: ParameterPanel;
  const defaultConfig: ParameterPanelConfig = {
    title: 'Test Panel',
    showPresets: true,
    parameters: [
      { id: 'temperature', label: 'Temperature', min: 0, max: 2, value: 0.7, step: 0.1 },
      { id: 'topP', label: 'Top-P', min: 0, max: 1, value: 0.9, step: 0.05 },
    ],
  };

  beforeEach(() => {
    panel = new ParameterPanel(defaultConfig);
    document.body.appendChild(panel);
  });

  afterEach(() => {
    if (panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
    localStorage.clear();
  });

  describe('Constructor & Configuration', () => {
    it('should create instance with required config', () => {
      expect(panel).toBeInstanceOf(ParameterPanel);
      expect(panel.tagName.toLowerCase()).toBe('ai-parameter-panel');
    });

    it('should throw error without parameters', () => {
      expect(() => new ParameterPanel({ parameters: [] } as ParameterPanelConfig)).toThrow();
    });

    it('should have shadow root', async () => {
      await waitForElement(panel);
      expect(panel.shadowRoot).toBeTruthy();
    });

    it('should accept custom title', () => {
      const customPanel = new ParameterPanel({
        title: 'Custom Title',
        parameters: [{ id: 'test', label: 'Test', min: 0, max: 1, value: 0.5 }],
      });
      document.body.appendChild(customPanel);
      
      expect(customPanel.shadowRoot?.textContent).toContain('Custom Title');
      customPanel.remove();
    });

    it('should accept layout configuration', () => {
      const gridPanel = new ParameterPanel({
        ...defaultConfig,
        layout: 'grid',
        columns: 3,
      });
      document.body.appendChild(gridPanel);
      
      expect(gridPanel.shadowRoot?.querySelector('.parameters-grid.layout-grid')).toBeTruthy();
      gridPanel.remove();
    });
  });

  describe('State Management', () => {
    it('should initialize with parameter values', () => {
      const values = panel.getAllValues();
      expect(values.temperature).toBe(0.7);
      expect(values.topP).toBe(0.9);
    });

    it('should track isDirty state', async () => {
      await waitForElement(panel);
      
      // Initially not dirty
      expect(panel.shadowRoot?.querySelector('.dirty-indicator.show')).toBeFalsy();
      
      // Set value makes it dirty
      panel.setValue('temperature', 1.0);
      await waitForNextTick();
      expect(panel.shadowRoot?.querySelector('.dirty-indicator.show')).toBeTruthy();
    });

    it('should clear isDirty when loading preset', async () => {
      const panelWithPreset = new ParameterPanel({
        ...defaultConfig,
        presets: {
          test: { name: 'Test', values: { temperature: 0.5, topP: 0.8 } },
        },
      });
      document.body.appendChild(panelWithPreset);
      await waitForElement(panelWithPreset);

      panelWithPreset.setValue('temperature', 1.0);
      await waitForNextTick();
      expect(panelWithPreset.shadowRoot?.querySelector('.dirty-indicator.show')).toBeTruthy();

      panelWithPreset.loadPreset('test');
      await waitForNextTick();
      expect(panelWithPreset.shadowRoot?.querySelector('.dirty-indicator.show')).toBeFalsy();

      panelWithPreset.remove();
    });
  });

  describe('Methods', () => {
    describe('getAllValues()', () => {
      it('should return all parameter values', () => {
        const values = panel.getAllValues();
        expect(Object.keys(values)).toHaveLength(2);
        expect(values.temperature).toBeDefined();
        expect(values.topP).toBeDefined();
      });

      it('should return copy of values', () => {
        const values1 = panel.getAllValues();
        const values2 = panel.getAllValues();
        expect(values1).toEqual(values2);
        expect(values1).not.toBe(values2); // Different objects
      });
    });

    describe('getValue()', () => {
      it('should return specific parameter value', () => {
        expect(panel.getValue('temperature')).toBe(0.7);
        expect(panel.getValue('topP')).toBe(0.9);
      });

      it('should return undefined for non-existent parameter', () => {
        expect(panel.getValue('nonexistent')).toBeUndefined();
      });
    });

    describe('setValue()', () => {
      it('should update parameter value', () => {
        panel.setValue('temperature', 1.5);
        expect(panel.getValue('temperature')).toBe(1.5);
      });

      it('should clamp value to min/max range', () => {
        panel.setValue('temperature', 5.0); // max is 2
        expect(panel.getValue('temperature')).toBe(2.0);

        panel.setValue('temperature', -1.0); // min is 0
        expect(panel.getValue('temperature')).toBe(0.0);
      });

      it('should emit panelchange event', async () => {
        const changeHandler = vi.fn();
        const emitPanel = new ParameterPanel({
          ...defaultConfig,
          emitChangeEvents: true,
        });
        document.body.appendChild(emitPanel);
        emitPanel.addEventListener('panelchange', changeHandler);

        emitPanel.setValue('temperature', 1.0);
        await waitForNextTick();

        expect(changeHandler).toHaveBeenCalled();
        const event = changeHandler.mock.calls[0][0];
        expect(event.detail.parameterId).toBe('temperature');
        expect(event.detail.value).toBe(1.0);
        expect(event.detail.allValues).toEqual({ temperature: 1.0, topP: 0.9 });
        emitPanel.remove();
      });

      it('should track value source', async () => {
        const changeHandler = vi.fn();
        const emitPanel = new ParameterPanel({
          ...defaultConfig,
          emitChangeEvents: true,
        });
        document.body.appendChild(emitPanel);
        emitPanel.addEventListener('panelchange', changeHandler);

        emitPanel.setValue('temperature', 1.0, 'slider');
        await waitForNextTick();

        expect(changeHandler.mock.calls[0][0].detail.source).toBe('slider');
        emitPanel.remove();
      });

      it('should clear active preset when manually changed', async () => {
        const panelWithPreset = new ParameterPanel({
          ...defaultConfig,
          showPresets: true,
          presets: {
            test: { name: 'Test', values: { temperature: 0.5, topP: 0.8 } },
          },
        });
        document.body.appendChild(panelWithPreset);
        await waitForElement(panelWithPreset);

        panelWithPreset.loadPreset('test');
        await waitForNextTick();
        expect(panelWithPreset.shadowRoot?.querySelector('.preset-btn.active')).toBeTruthy();

        panelWithPreset.setValue('temperature', 1.0);
        await waitForNextTick();
        expect(panelWithPreset.shadowRoot?.querySelector('.preset-btn.active')).toBeFalsy();

        panelWithPreset.remove();
      });
    });

    describe('loadPreset()', () => {
      let panelWithPresets: ParameterPanel;

      beforeEach(() => {
        panelWithPresets = new ParameterPanel({
          ...defaultConfig,
          showPresets: true,
          presets: {
            chatgpt: {
              name: 'ChatGPT',
              description: 'Balanced',
              values: { temperature: 0.7, topP: 0.9 },
            },
            code: {
              name: 'Code',
              description: 'Focused',
              values: { temperature: 0.2, topP: 0.8 },
            },
          },
        });
        document.body.appendChild(panelWithPresets);
      });

      afterEach(() => {
        panelWithPresets.remove();
      });

      it('should load preset values', async () => {
        panelWithPresets.loadPreset('code');
        await waitForNextTick();

        expect(panelWithPresets.getValue('temperature')).toBe(0.2);
        expect(panelWithPresets.getValue('topP')).toBe(0.8);
      });

      it('should set active preset', async () => {
        await waitForElement(panelWithPresets);
        
        panelWithPresets.loadPreset('chatgpt');
        await waitForNextTick();

        const activeBtn = panelWithPresets.shadowRoot?.querySelector('.preset-btn.active');
        expect(activeBtn?.textContent?.trim()).toBe('ChatGPT');
      });

      it('should emit presetload event', async () => {
        const loadHandler = vi.fn();
        panelWithPresets.addEventListener('presetload', loadHandler);

        panelWithPresets.loadPreset('code');
        await waitForNextTick();

        expect(loadHandler).toHaveBeenCalled();
        const event = loadHandler.mock.calls[0][0];
        expect(event.detail.presetId).toBe('code');
        expect(event.detail.preset.name).toBe('Code');
        expect(event.detail.preset.values).toEqual({ temperature: 0.2, topP: 0.8 });
        expect(event.detail.previousValues).toBeDefined();
      });

      it('should ignore non-existent preset', () => {
        const values = panelWithPresets.getAllValues();
        panelWithPresets.loadPreset('nonexistent');
        
        // Values should remain unchanged
        expect(panelWithPresets.getAllValues()).toEqual(values);
      });
    });

    describe('resetAll()', () => {
      it('should reset all parameters to defaults', () => {
        panel.setValue('temperature', 1.5);
        panel.setValue('topP', 0.5);

        panel.resetAll();

        expect(panel.getValue('temperature')).toBe(0.7);
        expect(panel.getValue('topP')).toBe(0.9);
      });

      it('should clear active preset', async () => {
        const panelWithPreset = new ParameterPanel({
          ...defaultConfig,          showPresets: true,          presets: {
            test: { name: 'Test', values: { temperature: 0.5, topP: 0.8 } },
          },
        });
        document.body.appendChild(panelWithPreset);
        await waitForElement(panelWithPreset);

        panelWithPreset.loadPreset('test');
        await waitForNextTick();

        panelWithPreset.resetAll();
        await waitForNextTick();

        expect(panelWithPreset.shadowRoot?.querySelector('.preset-btn.active')).toBeFalsy();
        panelWithPreset.remove();
      });

      it('should emit panelreset event', async () => {
        const resetHandler = vi.fn();
        panel.addEventListener('panelreset', resetHandler);

        panel.resetAll();
        await waitForNextTick();

        expect(resetHandler).toHaveBeenCalled();
        expect(resetHandler.mock.calls[0][0].detail.previousValues).toBeDefined();
        expect(resetHandler.mock.calls[0][0].detail.newValues).toEqual({ temperature: 0.7, topP: 0.9 });
      });

      it('should clear isDirty flag', async () => {
        await waitForElement(panel);
        
        panel.setValue('temperature', 1.0);
        await waitForNextTick();
        expect(panel.shadowRoot?.querySelector('.dirty-indicator.show')).toBeTruthy();

        panel.resetAll();
        await waitForNextTick();
        expect(panel.shadowRoot?.querySelector('.dirty-indicator.show')).toBeFalsy();
      });
    });

    describe('exportConfig()', () => {
      it('should export configuration as JSON', () => {
        const config = panel.exportConfig();
        
        expect(config.version).toBe('1.0');
        expect(config.parameters).toBeDefined();
        expect(config.parameters.temperature).toBe(0.7);
        expect(config.parameters.topP).toBe(0.9);
      });

      it('should include active preset in export', () => {
        const panelWithPreset = new ParameterPanel({
          ...defaultConfig,
          presets: {
            test: { name: 'Test', values: { temperature: 0.5, topP: 0.8 } },
          },
        });
        document.body.appendChild(panelWithPreset);

        panelWithPreset.loadPreset('test');
        const config = panelWithPreset.exportConfig();

        expect(config.preset).toBe('test');
        panelWithPreset.remove();
      });

      it('should include metadata', () => {
        const config = panel.exportConfig();
        
        expect(config.metadata).toBeDefined();
        expect(config.metadata?.created).toBeDefined();
        expect(config.metadata?.name).toBe('Parameters');
      });

      it('should emit configexport event', async () => {
        const exportHandler = vi.fn();
        panel.addEventListener('configexport', exportHandler);

        panel.exportConfig();
        await waitForNextTick();

        expect(exportHandler).toHaveBeenCalled();
        expect(exportHandler.mock.calls[0][0].detail.format).toBe('json');
      });
    });

    describe('importConfig()', () => {
      it('should import configuration from JSON', () => {
        const config: ExportedConfig = {
          version: '1.0',
          parameters: {
            temperature: 1.5,
            topP: 0.5,
          },
        };

        panel.importConfig(config);

        expect(panel.getValue('temperature')).toBe(1.5);
        expect(panel.getValue('topP')).toBe(0.5);
      });

      it('should load active preset from import', async () => {
        const panelWithPreset = new ParameterPanel({
          ...defaultConfig,
          showPresets: true,
          presets: {
            test: { name: 'Test', values: { temperature: 0.5, topP: 0.8 } },
          },
        });
        document.body.appendChild(panelWithPreset);
        await waitForElement(panelWithPreset);

        const config: ExportedConfig = {
          version: '1.0',
          preset: 'test',
          parameters: {
            temperature: 0.5,
            topP: 0.8,
          },
        };

        panelWithPreset.importConfig(config);
        await waitForNextTick();

        expect(panelWithPreset.shadowRoot?.querySelector('.preset-btn.active')).toBeTruthy();
        panelWithPreset.remove();
      });

      it('should emit configimport event', async () => {
        const importHandler = vi.fn();
        panel.addEventListener('configimport', importHandler);

        const config: ExportedConfig = {
          version: '1.0',
          parameters: {
            temperature: 1.0,
          },
        };

        panel.importConfig(config);
        await waitForNextTick();

        expect(importHandler).toHaveBeenCalled();
        expect(importHandler.mock.calls[0][0].detail.config).toBeDefined();
        expect(importHandler.mock.calls[0][0].detail.previousValues).toBeDefined();
      });

      it('should ignore invalid config', () => {
        const values = panel.getAllValues();
        panel.importConfig({} as ExportedConfig);
        
        // Values should remain unchanged
        expect(panel.getAllValues()).toEqual(values);
      });
    });

    describe('toggleCollapse()', () => {
      it('should toggle collapsed state', async () => {
        const collapsiblePanel = new ParameterPanel({
          ...defaultConfig,
          collapsible: true,
        });
        document.body.appendChild(collapsiblePanel);
        await waitForElement(collapsiblePanel);

        expect(collapsiblePanel.shadowRoot?.querySelector('.content.collapsed')).toBeFalsy();

        collapsiblePanel.toggleCollapse();
        await waitForNextTick();

        expect(collapsiblePanel.shadowRoot?.querySelector('.content.collapsed')).toBeTruthy();

        collapsiblePanel.remove();
      });

      it('should not toggle if not collapsible', async () => {
        await waitForElement(panel);
        const content = panel.shadowRoot?.querySelector('.content');
        
        panel.toggleCollapse();
        await waitForNextTick();

        expect(content?.classList.contains('collapsed')).toBeFalsy();
      });
    });

    describe('validateAll()', () => {
      it('should validate all parameters', () => {
        const panelWithValidation = new ParameterPanel({
          parameters: [
            {
              id: 'value1',
              label: 'Value 1',
              min: 0,
              max: 10,
              value: 5,
              validate: (val) => val > 0 || 'Must be positive',
            },
            {
              id: 'value2',
              label: 'Value 2',
              min: 0,
              max: 10,
              value: 5,
              validate: (val) => val < 8 || 'Must be less than 8',
            },
          ],
          validateOnChange: false, // Disable validation on change so setValue succeeds
        });
        document.body.appendChild(panelWithValidation);

        expect(panelWithValidation.validateAll()).toBe(true);

        panelWithValidation.setValue('value2', 9);
        expect(panelWithValidation.validateAll()).toBe(false);

        panelWithValidation.remove();
      });

      it('should display validation errors', async () => {
        const panelWithValidation = new ParameterPanel({
          parameters: [
            {
              id: 'value1',
              label: 'Value 1',
              min: 0,
              max: 10,
              value: 5,
              validate: (val) => val > 0 || 'Must be positive',
            },
          ],
        });
        document.body.appendChild(panelWithValidation);
        await waitForElement(panelWithValidation);

        panelWithValidation.setValue('value1', 0);
        panelWithValidation.validateAll();
        await waitForNextTick();

        expect(panelWithValidation.shadowRoot?.querySelector('.validation-errors.show')).toBeTruthy();
        expect(panelWithValidation.shadowRoot?.textContent).toContain('Must be positive');

        panelWithValidation.remove();
      });
    });

    describe('addPreset() / removePreset()', () => {
      it('should add custom preset', async () => {
        await waitForElement(panel);

        panel.addPreset('custom', 'Custom', { temperature: 1.0, topP: 0.7 });
        await waitForNextTick();

        const presetBtn = Array.from(panel.shadowRoot?.querySelectorAll('.preset-btn') || [])
          .find(btn => btn.textContent?.trim() === 'Custom');
        
        expect(presetBtn).toBeTruthy();
      });

      it('should remove custom preset', async () => {
        await waitForElement(panel);

        panel.addPreset('custom', 'Custom', { temperature: 1.0, topP: 0.7 });
        await waitForNextTick();

        panel.removePreset('custom');
        await waitForNextTick();

        const presetBtn = Array.from(panel.shadowRoot?.querySelectorAll('.preset-btn') || [])
          .find(btn => btn.textContent?.trim() === 'Custom');
        
        expect(presetBtn).toBeFalsy();
      });

      it('should not remove built-in preset', async () => {
        const panelWithBuiltIn = new ParameterPanel({
          ...defaultConfig,
          showPresets: true,
          presets: {
            builtin: { name: 'Built-in', values: { temperature: 0.5, topP: 0.8 }, isBuiltIn: true },
          },
        });
        document.body.appendChild(panelWithBuiltIn);
        await waitForElement(panelWithBuiltIn);

        panelWithBuiltIn.removePreset('builtin');
        await waitForNextTick();

        const presetBtn = Array.from(panelWithBuiltIn.shadowRoot?.querySelectorAll('.preset-btn') || [])
          .find(btn => btn.textContent?.trim() === 'Built-in');
        
        expect(presetBtn).toBeTruthy();
        panelWithBuiltIn.remove();
      });
    });
  });

  describe('Persistence', () => {
    it('should save values to localStorage when enabled', () => {
      const persistPanel = new ParameterPanel({
        ...defaultConfig,
        persistValues: true,
        storageKey: 'test-panel',
      });
      document.body.appendChild(persistPanel);

      persistPanel.setValue('temperature', 1.5);

      const stored = localStorage.getItem('test-panel');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.values.temperature).toBe(1.5);

      persistPanel.remove();
    });

    it('should load values from localStorage when enabled', () => {
      localStorage.setItem('test-panel-load', JSON.stringify({
        values: { temperature: 1.2, topP: 0.6 },
      }));

      const persistPanel = new ParameterPanel({
        ...defaultConfig,
        persistValues: true,
        storageKey: 'test-panel-load',
      });
      document.body.appendChild(persistPanel);

      expect(persistPanel.getValue('temperature')).toBe(1.2);
      expect(persistPanel.getValue('topP')).toBe(0.6);

      persistPanel.remove();
    });
  });

  describe('Events', () => {
    it('should emit panelchange event with correct details', async () => {
      const changeHandler = vi.fn();
      const emitPanel = new ParameterPanel({
        ...defaultConfig,
        emitChangeEvents: true,
      });
      document.body.appendChild(emitPanel);
      emitPanel.addEventListener('panelchange', changeHandler);

      emitPanel.setValue('temperature', 1.5);
      await waitForNextTick();

      expect(changeHandler).toHaveBeenCalledTimes(1);
      const event = changeHandler.mock.calls[0][0];
      expect(event.detail.parameterId).toBe('temperature');
      expect(event.detail.value).toBe(1.5);
      expect(event.detail.previousValue).toBe(0.7);
      expect(event.detail.allValues).toEqual({ temperature: 1.5, topP: 0.9 });
      expect(event.detail.source).toBe('slider');
      emitPanel.remove();
    });

    it('should emit validationerror event when validation fails', async () => {
      const errorHandler = vi.fn();
      const panelWithValidation = new ParameterPanel({
        parameters: [
          {
            id: 'value1',
            label: 'Value 1',
            min: 0,
            max: 10,
            value: 5,
            validate: (val) => val > 0 || 'Must be positive',
          },
        ],
        validateOnChange: true,
      });
      document.body.appendChild(panelWithValidation);
      panelWithValidation.addEventListener('validationerror', errorHandler);

      panelWithValidation.setValue('value1', 0);
      await waitForNextTick();

      expect(errorHandler).toHaveBeenCalled();
      const event = errorHandler.mock.calls[0][0];
      expect(event.detail.parameterId).toBe('value1');
      expect(event.detail.error).toBe('Must be positive');

      panelWithValidation.remove();
    });
  });

  describe('Rendering', () => {
    it('should render all parameters', async () => {
      await waitForElement(panel);
      
      const wrappers = panel.shadowRoot?.querySelectorAll('.parameter-wrapper');
      expect(wrappers?.length).toBe(2);
    });

    it('should render preset buttons', async () => {
      const panelWithPresets = new ParameterPanel({
        ...defaultConfig,
        showPresets: true,
        presets: {
          preset1: { name: 'Preset 1', values: { temperature: 0.5, topP: 0.8 } },
          preset2: { name: 'Preset 2', values: { temperature: 1.0, topP: 0.9 } },
        },
      });
      document.body.appendChild(panelWithPresets);
      await waitForElement(panelWithPresets);

      const presetButtons = panelWithPresets.shadowRoot?.querySelectorAll('.preset-btn');
      expect(presetButtons?.length).toBe(2);

      panelWithPresets.remove();
    });

    it('should hide presets section when showPresets is false', async () => {
      const panelNoPresets = new ParameterPanel({
        ...defaultConfig,
        showPresets: false,
        presets: {
          test: { name: 'Test', values: { temperature: 0.5, topP: 0.8 } },
        },
      });
      document.body.appendChild(panelNoPresets);
      await waitForElement(panelNoPresets);

      expect(panelNoPresets.shadowRoot?.querySelector('.presets-section')).toBeFalsy();

      panelNoPresets.remove();
    });

    it('should render action buttons', async () => {
      const actionPanel = new ParameterPanel({
        ...defaultConfig,
        showResetAll: true,
        showExportImport: true,
      });
      document.body.appendChild(actionPanel);
      await waitForElement(actionPanel);
      
      expect(actionPanel.shadowRoot?.querySelector('#reset-btn')).toBeTruthy();
      expect(actionPanel.shadowRoot?.querySelector('#export-btn')).toBeTruthy();
      expect(actionPanel.shadowRoot?.querySelector('#import-btn')).toBeTruthy();
      actionPanel.remove();
    });

    it('should apply grid layout', async () => {
      const gridPanel = new ParameterPanel({
        ...defaultConfig,
        layout: 'grid',
        columns: 2,
      });
      document.body.appendChild(gridPanel);
      await waitForElement(gridPanel);

      const grid = gridPanel.shadowRoot?.querySelector('.parameters-grid.layout-grid');
      expect(grid).toBeTruthy();

      gridPanel.remove();
    });

    it('should apply vertical layout', async () => {
      const verticalPanel = new ParameterPanel({
        ...defaultConfig,
        layout: 'vertical',
      });
      document.body.appendChild(verticalPanel);
      await waitForElement(verticalPanel);

      const vertical = verticalPanel.shadowRoot?.querySelector('.parameters-grid.layout-vertical');
      expect(vertical).toBeTruthy();

      verticalPanel.remove();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      await waitForElement(panel);
      
      const presetBtn = panel.shadowRoot?.querySelector('.preset-btn') as HTMLElement;
      expect(presetBtn?.tabIndex).not.toBe(-1);
    });

    it('should have proper ARIA labels', async () => {
      const ariaPanel = new ParameterPanel({
        ...defaultConfig,
        showResetAll: true,
      });
      document.body.appendChild(ariaPanel);
      await waitForElement(ariaPanel);
      
      const resetBtn = ariaPanel.shadowRoot?.querySelector('#reset-btn');
      expect(resetBtn?.textContent).toContain('Reset');
      ariaPanel.remove();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty preset values', () => {
      const panelWithEmptyPreset = new ParameterPanel({
        ...defaultConfig,
        presets: {
          empty: { name: 'Empty', values: {} },
        },
      });
      document.body.appendChild(panelWithEmptyPreset);

      const values = panelWithEmptyPreset.getAllValues();
      panelWithEmptyPreset.loadPreset('empty');
      
      // Values should remain unchanged
      expect(panelWithEmptyPreset.getAllValues()).toEqual(values);

      panelWithEmptyPreset.remove();
    });

    it('should handle parameter with no default value', () => {
      const panelNoDefault = new ParameterPanel({
        parameters: [
          { id: 'test', label: 'Test', min: 0, max: 10, value: 5 },
        ],
      });
      document.body.appendChild(panelNoDefault);

      // Should use the value property
      expect(panelNoDefault.getValue('test')).toBe(5);

      panelNoDefault.remove();
    });

    it('should handle rapid value changes', async () => {
      const changeHandler = vi.fn();
      const rapidPanel = new ParameterPanel({
        ...defaultConfig,
        emitChangeEvents: true,
      });
      document.body.appendChild(rapidPanel);
      rapidPanel.addEventListener('panelchange', changeHandler);

      rapidPanel.setValue('temperature', 0.5);
      rapidPanel.setValue('temperature', 0.8);
      rapidPanel.setValue('temperature', 1.2);
      await waitForNextTick();

      expect(changeHandler).toHaveBeenCalledTimes(3);
      expect(rapidPanel.getValue('temperature')).toBe(1.2);
      rapidPanel.remove();
    });
  });
});
