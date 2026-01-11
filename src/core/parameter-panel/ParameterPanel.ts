import { AIControl } from '../base/AIControl';
import { ParameterSlider } from '../parameter-slider/ParameterSlider';
import type {
  ParameterPanelConfig,
  ParameterPanelState,
  ParameterDefinition,
  PanelChangeEvent,
  PresetLoadEvent,
  ConfigExportEvent,
  ConfigImportEvent,
  PanelResetEvent,
  ValidationErrorEvent,
  ExportedConfig,
} from './types';
import { styles } from './styles';

/**
 * ParameterPanel Component
 * 
 * Manages multiple AI parameters as a coordinated group with presets, validation, and export/import.
 * Automatically creates and manages child ParameterSlider instances.
 * 
 * @example
 * ```typescript
 * // Create LLM configuration panel
 * const panel = new ParameterPanel({
 *   title: 'Model Configuration',
 *   parameters: [
 *     { id: 'temperature', label: 'Temperature', min: 0, max: 2, value: 0.7, step: 0.1 },
 *     { id: 'topP', label: 'Top-P', min: 0, max: 1, value: 0.9, step: 0.05 },
 *     { id: 'maxTokens', label: 'Max Tokens', min: 100, max: 4000, value: 2000, step: 100 }
 *   ],
 *   presets: {
 *     chatgpt: {
 *       name: 'ChatGPT',
 *       description: 'Balanced configuration',
 *       values: { temperature: 0.7, topP: 0.9, maxTokens: 2000 }
 *     },
 *     code: {
 *       name: 'Code Generation',
 *       description: 'More focused for code',
 *       values: { temperature: 0.2, topP: 0.8, maxTokens: 1000 }
 *     }
 *   }
 * });
 * 
 * document.body.appendChild(panel);
 * 
 * // Get all values
 * const config = panel.getAllValues();
 * // { temperature: 0.7, topP: 0.9, maxTokens: 2000 }
 * 
 * // Load preset
 * panel.loadPreset('code');
 * 
 * // Listen to changes
 * panel.addEventListener('panelchange', (e) => {
 *   console.log('Changed parameter:', e.detail.parameterId);
 *   console.log('All values:', e.detail.allValues);
 * });
 * ```
 * 
 * @fires panelchange - Fired when any parameter changes
 * @fires presetload - Fired when preset is loaded
 * @fires configexport - Fired when configuration is exported
 * @fires configimport - Fired when configuration is imported
 * @fires panelreset - Fired when panel is reset
 * @fires validationerror - Fired when validation fails
 */
export class ParameterPanel extends AIControl {
  private state: ParameterPanelState;
  private parameters: Map<string, ParameterSlider> = new Map();
  private parameterDefinitions: Map<string, ParameterDefinition> = new Map();
  private presets: Map<string, { name: string; description?: string; values: Record<string, number>; isBuiltIn: boolean }>;
  private panelConfig: ParameterPanelConfig;

  constructor(config: ParameterPanelConfig) {
    super({ debug: config.debug, disabled: config.disabled });
    
    this.panelConfig = config;
    
    if (!config.parameters || config.parameters.length === 0) {
      throw new Error('ParameterPanel requires at least one parameter');
    }

    // Store parameter definitions
    config.parameters.forEach(param => {
      this.parameterDefinitions.set(param.id, param);
    });

    // Initialize presets
    this.presets = new Map();
    if (config.presets) {
      Object.entries(config.presets).forEach(([id, preset]) => {
        this.presets.set(id, { ...preset, isBuiltIn: preset.isBuiltIn ?? false });
      });
    }

    // Initialize state
    const initialValues: Record<string, number> = {};
    config.parameters.forEach(param => {
      initialValues[param.id] = param.value;
    });

    this.state = {
      values: initialValues,
      activePreset: null,
      isCollapsed: this.panelConfig.collapsible && this.panelConfig.startCollapsed ? true : false,
      errors: {},
      isDirty: false,
    };

    this.attachShadow({ mode: 'open' });
    
    // Load persisted values if enabled
    if (this.panelConfig.persistValues) {
      this.loadFromStorage();
    }
    
    // Load persisted presets if enabled
    if (this.panelConfig.persistPresets) {
      this.loadPresetsFromStorage();
    }
  }

  /**
   * Get all parameter values
   */
  getAllValues(): Record<string, number> {
    return { ...this.state.values };
  }

  /**
   * Get specific parameter value
   */
  getValue(parameterId: string): number | undefined {
    return this.state.values[parameterId];
  }

  /**
   * Set specific parameter value
   */
  setValue(parameterId: string, value: number, source: 'slider' | 'input' | 'preset' | 'reset' | 'import' = 'slider'): void {
    const paramDef = this.parameterDefinitions.get(parameterId);
    if (!paramDef) {
      this.log(`Parameter ${parameterId} not found`, 'warn');
      return;
    }

    // Clamp value to range
    value = Math.max(paramDef.min, Math.min(paramDef.max, value));

    // Validate if enabled (but not during reset/import)
    if (this.panelConfig.validateOnChange && paramDef.validate && source !== 'reset' && source !== 'import') {
      const validationResult = paramDef.validate(value, this.state.values);
      if (validationResult !== true) {
        this.state.errors[parameterId] = typeof validationResult === 'string' ? validationResult : 'Validation failed';
        this.dispatchValidationError(parameterId, this.state.errors[parameterId]);
        this.render();
        return;
      }
    }

    // Clear error for this parameter
    delete this.state.errors[parameterId];

    // Update value
    const oldValue = this.state.values[parameterId];
    this.state.values[parameterId] = value;
    
    // Only mark dirty and clear preset for non-reset/import sources
    if (source !== 'reset' && source !== 'import' && source !== 'preset') {
      this.state.isDirty = true;
      this.state.activePreset = null; // Clear active preset when manually changed
    }

    // Update child component if it exists
    const slider = this.parameters.get(parameterId);
    if (slider && oldValue !== value) {
      // Map 'import' to 'reset' since ParameterSlider doesn't support 'import'
      const sliderSource = source === 'import' ? 'reset' : source;
      slider.setValue(value, sliderSource);
    }

    // Persist if enabled
    if (this.panelConfig.persistValues) {
      this.saveToStorage();
    }

    // Emit change event (only if called programmatically, not from child slider)
    if (this.panelConfig.emitChangeEvents && oldValue !== value) {
      this.dispatchPanelChange(parameterId, value, oldValue ?? paramDef.min, source);
    }

    // Re-render to update UI
    this.render();
  }

  /**
   * Load preset values
   */
  loadPreset(presetId: string): void {
    const preset = this.presets.get(presetId);
    if (!preset) {
      this.log(`Preset ${presetId} not found`, 'warn');
      return;
    }

    const previousValues = { ...this.state.values };

    // Apply all preset values
    Object.entries(preset.values).forEach(([parameterId, value]) => {
      if (this.parameterDefinitions.has(parameterId)) {
        this.setValue(parameterId, value, 'preset');
      }
    });

    this.state.activePreset = presetId;
    this.state.isDirty = false;

    // Emit preset load event
    this.dispatchPresetLoad(presetId, preset, previousValues);

    this.render();
  }

  /**
   * Reset all parameters to default values
   */
  resetAll(): void {
    this.parameterDefinitions.forEach((paramDef, parameterId) => {
      const defaultValue = paramDef.value;
      this.setValue(parameterId, defaultValue, 'reset');
    });

    this.state.activePreset = null;
    this.state.isDirty = false;
    this.state.errors = {};

    // Emit reset event
    this.dispatchPanelReset();

    this.render();
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): ExportedConfig {
    const parameters: Record<string, number> = {};

    this.parameterDefinitions.forEach((_, parameterId) => {
      parameters[parameterId] = this.state.values[parameterId] ?? 0;
    });

    const config: ExportedConfig = {
      version: '1.0',
      parameters,
    };

    if (this.state.activePreset) {
      config.preset = this.state.activePreset;
    }

    config.metadata = {
      created: new Date().toISOString(),
      name: (this.config as any).title || 'Parameters',
    };

    // Emit export event
    this.dispatchConfigExport(config);

    return config;
  }

  /**
   * Import configuration from JSON
   */
  importConfig(config: ExportedConfig): void {
    if (!config.parameters) {
      this.log('Invalid config: missing parameters', 'warn');
      return;
    }

    // Apply imported values
    Object.entries(config.parameters).forEach(([parameterId, value]) => {
      if (this.parameterDefinitions.has(parameterId)) {
        this.setValue(parameterId, value, 'import');
      }
    });

    // Load active preset if specified
    if (config.preset && this.presets.has(config.preset)) {
      this.state.activePreset = config.preset;
    } else {
      this.state.activePreset = null;
    }

    this.state.isDirty = false;

    // Emit import event
    this.dispatchConfigImport(config);

    this.render();
  }

  /**
   * Toggle collapsed state
   */
  toggleCollapse(): void {
    if (!this.panelConfig.collapsible) return;
    
    this.state.isCollapsed = !this.state.isCollapsed;
    this.render();
  }

  /**
   * Validate all parameters
   */
  validateAll(): boolean {
    let isValid = true;
    this.state.errors = {};

    this.parameterDefinitions.forEach((paramDef, parameterId) => {
      if (paramDef.validate) {
        const value = this.state.values[parameterId] ?? paramDef.min;
        const validationResult = paramDef.validate(value, this.state.values);
        if (validationResult !== true) {
          isValid = false;
          this.state.errors[parameterId] = typeof validationResult === 'string' ? validationResult : 'Validation failed';
          this.dispatchValidationError(parameterId, this.state.errors[parameterId]);
        }
      }
    });

    if (!isValid) {
      this.render();
    }

    return isValid;
  }

  /**
   * Add custom preset
   */
  addPreset(id: string, name: string, values: Record<string, number>, description?: string): void {
    this.presets.set(id, { name, description, values, isBuiltIn: false });
    
    if (this.panelConfig.persistPresets) {
      this.savePresetsToStorage();
    }

    this.render();
  }

  /**
   * Remove custom preset
   */
  removePreset(id: string): void {
    const preset = this.presets.get(id);
    if (preset && !preset.isBuiltIn) {
      this.presets.delete(id);
      
      if (this.state.activePreset === id) {
        this.state.activePreset = null;
      }

      if (this.panelConfig.persistPresets) {
        this.savePresetsToStorage();
      }

      this.render();
    }
  }

  // Event dispatchers
  private dispatchPanelChange(parameterId: string, value: number, oldValue: number, source: 'slider' | 'input' | 'preset' | 'reset' | 'import'): void {
    const event = new CustomEvent<PanelChangeEvent>('panelchange', {
      detail: {
        parameterId,
        value,
        previousValue: oldValue,
        allValues: this.getAllValues(),
        source,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private dispatchPresetLoad(presetId: string, preset: { name: string; description?: string; values: Record<string, number> }, previousValues: Record<string, number>): void {
    const event = new CustomEvent<PresetLoadEvent>('presetload', {
      detail: {
        presetId,
        preset: {
          name: preset.name,
          description: preset.description,
          values: preset.values,
        },
        previousValues,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private dispatchConfigExport(config: ExportedConfig): void {
    const event = new CustomEvent<ConfigExportEvent>('configexport', {
      detail: {
        config,
        format: 'json',
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private dispatchConfigImport(config: ExportedConfig): void {
    const previousValues = { ...this.state.values };
    const event = new CustomEvent<ConfigImportEvent>('configimport', {
      detail: {
        config,
        previousValues,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private dispatchPanelReset(): void {
    const previousValues = { ...this.state.values };
    const newValues: Record<string, number> = {};
    this.parameterDefinitions.forEach((param, id) => {
      newValues[id] = param.value;
    });
    
    const event = new CustomEvent<PanelResetEvent>('panelreset', {
      detail: {
        previousValues,
        newValues,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private dispatchValidationError(parameterId: string, message: string): void {
    const event = new CustomEvent<ValidationErrorEvent>('validationerror', {
      detail: {
        parameterId,
        error: message,
        value: this.state.values[parameterId] || 0,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // Storage methods
  private saveToStorage(): void {
    try {
      const data = {
        values: this.state.values,
        activePreset: this.state.activePreset,
      };
      localStorage.setItem(this.panelConfig.storageKey as string, JSON.stringify(data));
    } catch (error) {
      this.log('Failed to save to storage', 'error', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.panelConfig.storageKey as string);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.values) {
          Object.entries(parsed.values).forEach(([parameterId, value]) => {
            if (this.parameterDefinitions.has(parameterId)) {
              this.state.values[parameterId] = value as number;
            }
          });
        }
        if (parsed.activePreset && this.presets.has(parsed.activePreset)) {
          this.state.activePreset = parsed.activePreset;
        }
      }
    } catch (error) {
      this.log('Failed to load from storage', 'error', error);
    }
  }

  private savePresetsToStorage(): void {
    try {
      const customPresets = Array.from(this.presets.entries())
        .filter(([_, preset]) => !preset.isBuiltIn)
        .reduce((acc, [id, preset]) => {
          acc[id] = { name: preset.name, description: preset.description, values: preset.values };
          return acc;
        }, {} as Record<string, any>);
      
      localStorage.setItem(`${this.panelConfig.storageKey}-presets`, JSON.stringify(customPresets));
    } catch (error) {
      this.log('Failed to save presets', 'error', error);
    }
  }

  private loadPresetsFromStorage(): void {
    try {
      const data = localStorage.getItem(`${this.panelConfig.storageKey}-presets`);
      if (data) {
        const customPresets = JSON.parse(data);
        Object.entries(customPresets).forEach(([id, preset]: [string, any]) => {
          this.presets.set(id, { ...preset, isBuiltIn: false });
        });
      }
    } catch (error) {
      this.log('Failed to load presets', 'error', error);
    }
  }

  // Rendering
  protected render(): void {
    if (!this.shadowRoot) return;

    const hasErrors = Object.keys(this.state.errors).length > 0;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="container" style="--grid-columns: ${this.panelConfig.columns}">
        ${this.renderHeader()}
        <div class="content ${this.state.isCollapsed ? 'collapsed' : ''}">
          ${hasErrors ? this.renderErrors() : ''}
          ${this.panelConfig.showPresets && this.presets.size > 0 ? this.renderPresets() : ''}
          ${this.renderParameters()}
          ${this.panelConfig.showResetAll || this.panelConfig.showExportImport ? this.renderActions() : ''}
        </div>
      </div>
    `;

    // Attach event listeners
    this.attachEventListeners();

    // Create and attach parameter sliders
    this.createParameterSliders();
  }

  private renderHeader(): string {
    return `
      <div class="header ${this.panelConfig.collapsible ? 'collapsible' : ''}" id="header">
        <div class="title-section">
          <h3 class="title">${this.panelConfig.title}</h3>
          <span class="dirty-indicator ${this.state.isDirty ? 'show' : ''}"></span>
        </div>
        ${this.panelConfig.collapsible ? `
          <span class="collapse-icon ${this.state.isCollapsed ? 'collapsed' : ''}">▼</span>
        ` : ''}
      </div>
    `;
  }

  private renderErrors(): string {
    const errorEntries = Object.entries(this.state.errors);
    if (errorEntries.length === 0) return '';

    return `
      <div class="validation-errors show">
        ${errorEntries.map(([parameterId, message]) => `
          <div class="error-item">
            <span class="error-icon">⚠</span>
            <span>${this.parameterDefinitions.get(parameterId)?.label || parameterId}: ${message}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderPresets(): string {
    return `
      <div class="presets-section">
        <div class="presets-label">Presets</div>
        <div class="presets-buttons">
          ${Array.from(this.presets.entries()).map(([id, preset]) => `
            <button 
              class="preset-btn ${this.state.activePreset === id ? 'active' : ''}" 
              data-preset-id="${id}"
              title="${preset.description || preset.name}"
            >
              ${preset.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderParameters(): string {
    return `
      <div class="parameters-section">
        <div class="parameters-grid layout-${this.panelConfig.layout}">
          ${Array.from(this.parameterDefinitions.keys()).map(id => `
            <div class="parameter-wrapper" data-parameter-id="${id}"></div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderActions(): string {
    return `
      <div class="actions-section">
        <div class="actions-left">
          ${this.panelConfig.showResetAll ? `
            <button class="action-btn danger" id="reset-btn">
              <span>↻</span>
              <span>Reset All</span>
            </button>
          ` : ''}
        </div>
        <div class="actions-right">
          ${this.panelConfig.showExportImport ? `
            <button class="action-btn" id="import-btn">
              <span>📥</span>
              <span>Import</span>
            </button>
            <button class="action-btn primary" id="export-btn">
              <span>📤</span>
              <span>Export</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    if (!this.shadowRoot) return;

    // Header click for collapse
    if (this.panelConfig.collapsible) {
      const header = this.shadowRoot.getElementById('header');
      header?.addEventListener('click', () => this.toggleCollapse());
    }

    // Preset buttons
    const presetButtons = this.shadowRoot.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = (btn as HTMLElement).dataset.presetId;
        if (presetId) this.loadPreset(presetId);
      });
    });

    // Reset button
    const resetBtn = this.shadowRoot.getElementById('reset-btn');
    resetBtn?.addEventListener('click', () => this.resetAll());

    // Export button
    const exportBtn = this.shadowRoot.getElementById('export-btn');
    exportBtn?.addEventListener('click', () => this.handleExport());

    // Import button
    const importBtn = this.shadowRoot.getElementById('import-btn');
    importBtn?.addEventListener('click', () => this.handleImport());
  }

  private createParameterSliders(): void {
    if (!this.shadowRoot) return;

    // Clear existing sliders
    this.parameters.clear();

    // Create slider for each parameter
    this.parameterDefinitions.forEach((paramDef, parameterId) => {
      const wrapper = this.shadowRoot!.querySelector(`[data-parameter-id="${parameterId}"]`);
      if (!wrapper) return;

      // Create ParameterSlider instance
      const slider = new ParameterSlider({
        label: paramDef.label,
        min: paramDef.min,
        max: paramDef.max,
        value: this.state.values[parameterId],
        step: paramDef.step,
        unit: paramDef.unit,
        description: paramDef.description,
        presets: paramDef.presets,
        showInput: paramDef.showInput,
        disabled: paramDef.disabled || this._disabled,
      });

      // Listen to value changes from child slider (user interaction only)
      slider.addEventListener('valuechange', ((e: CustomEvent) => {
        // Stop propagation to prevent event bubbling
        e.stopPropagation();
        
        // Update our state and emit our own event
        const paramDef = this.parameterDefinitions.get(parameterId);
        if (!paramDef) return;

        const value = e.detail.value;
        const source = e.detail.source;
        
        // Clamp value to range
        const clampedValue = Math.max(paramDef.min, Math.min(paramDef.max, value));
        
        // Validate if enabled
        if (this.panelConfig.validateOnChange && paramDef.validate) {
          const validationResult = paramDef.validate(clampedValue, this.state.values);
          if (validationResult !== true) {
            this.state.errors[parameterId] = typeof validationResult === 'string' ? validationResult : 'Validation failed';
            this.dispatchValidationError(parameterId, this.state.errors[parameterId]);
            this.render();
            return;
          }
        }

        // Clear error
        delete this.state.errors[parameterId];

        // Update value
        const oldValue = this.state.values[parameterId];
        this.state.values[parameterId] = clampedValue;
        
        // Mark dirty and clear preset for user changes
        if (source !== 'reset' && source !== 'import' && source !== 'preset') {
          this.state.isDirty = true;
          this.state.activePreset = null;
        }

        // Persist if enabled
        if (this.panelConfig.persistValues) {
          this.saveToStorage();
        }

        // Emit change event
        if (this.panelConfig.emitChangeEvents && oldValue !== clampedValue) {
          this.dispatchPanelChange(parameterId, clampedValue, oldValue ?? paramDef.min, source);
        }

        // Re-render to update UI
        this.render();
      }) as EventListener);

      // Append to wrapper
      wrapper.appendChild(slider);

      // Store reference
      this.parameters.set(parameterId, slider);
    });
  }

  private handleExport(): void {
    const config = this.exportConfig();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.panelConfig.title}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private handleImport(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target?.result as string);
          this.importConfig(config);
        } catch (error) {
          this.log('Failed to parse config file', 'error', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  /**
   * Clean up when component is removed
   */
  override disconnectedCallback(): void {
    this.parameters.clear();
  }
}

// Register custom element
if (!customElements.get('ai-parameter-panel')) {
  customElements.define('ai-parameter-panel', ParameterPanel);
}
