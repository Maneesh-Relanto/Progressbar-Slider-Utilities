# ParameterPanel API Documentation

## Overview

`ParameterPanel` is a comprehensive Web Component for grouped AI parameter controls. It combines multiple sliders with preset management, validation, import/export capabilities, and persistence. Perfect for LLM configuration panels, audio settings, model fine-tuning, and any scenario requiring coordinated parameter control.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Constructor](#constructor)
- [Configuration](#configuration)
- [Methods](#methods)
- [Events](#events)
- [Properties](#properties)
- [Styling](#styling)
- [Examples](#examples)
- [TypeScript](#typescript)
- [Best Practices](#best-practices)

---

## Installation

```bash
npm install ai-progress-controls
```

```javascript
import { ParameterPanel } from 'ai-progress-controls';
```

---

## Quick Start

```javascript
// Create a simple LLM configuration panel
const panel = new ParameterPanel({
  title: 'LLM Configuration',
  parameters: [
    {
      id: 'temperature',
      label: 'Temperature',
      min: 0,
      max: 2,
      value: 0.7,
      step: 0.1,
      description: 'Controls randomness'
    },
    {
      id: 'topP',
      label: 'Top-P',
      min: 0,
      max: 1,
      value: 0.9,
      step: 0.05,
      description: 'Nucleus sampling threshold'
    }
  ],
  presets: {
    chatgpt: {
      name: 'ChatGPT',
      description: 'Balanced for chat',
      values: { temperature: 0.7, topP: 0.9 }
    },
    creative: {
      name: 'Creative',
      description: 'More diverse outputs',
      values: { temperature: 1.2, topP: 0.95 }
    }
  },
  showPresets: true,
  showResetAll: true
});

document.body.appendChild(panel);

// Listen to changes
panel.addEventListener('panelchange', (e) => {
  console.log(`${e.detail.parameterId} changed to ${e.detail.value}`);
  console.log('All values:', e.detail.allValues);
});
```

---

## Constructor

### `new ParameterPanel(config: ParameterPanelConfig)`

Creates a new ParameterPanel component instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `ParameterPanelConfig` | Configuration object (required) |

**Returns:** `ParameterPanel` instance

**Throws:** Error if `parameters` array is empty

**Example:**

```javascript
const panel = new ParameterPanel({
  title: 'Audio Settings',
  parameters: [
    { id: 'volume', label: 'Volume', min: 0, max: 100, value: 75 },
    { id: 'pitch', label: 'Pitch', min: -12, max: 12, value: 0 }
  ],
  layout: 'grid',
  columns: 2
});
```

---

## Configuration

### ParameterPanelConfig

Main configuration object for the panel.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `parameters` | `ParameterDefinition[]` | *Required* | Array of parameter definitions |
| `presets` | `Record<string, PresetConfiguration>` | `{}` | Built-in and custom presets |
| `defaultPreset` | `string` | `undefined` | Preset to load on initialization |
| `layout` | `'grid' \| 'vertical'` | `'vertical'` | Parameter layout style |
| `columns` | `number` | `1` | Columns in grid layout |
| `title` | `string` | `'Parameters'` | Panel title |
| `showPresets` | `boolean` | `false` | Show preset selector buttons |
| `showResetAll` | `boolean` | `false` | Show reset all button |
| `showExportImport` | `boolean` | `false` | Show export/import buttons |
| `persistValues` | `boolean` | `false` | Save values to localStorage |
| `persistPresets` | `boolean` | `false` | Save presets to localStorage |
| `storageKey` | `string` | `'parameter-panel'` | localStorage key |
| `collapsible` | `boolean` | `false` | Make panel collapsible |
| `startCollapsed` | `boolean` | `false` | Start in collapsed state |
| `validateOnChange` | `boolean` | `false` | Validate on every change |
| `emitChangeEvents` | `boolean` | `false` | Emit panelchange events |
| `disabled` | `boolean` | `false` | Disable entire panel |
| `debug` | `boolean` | `false` | Enable debug logging |
| `className` | `string` | `''` | Additional CSS class |
| `ariaLabel` | `string` | `'{title} Panel'` | ARIA label |

### ParameterDefinition

Configuration for a single parameter slider.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | *Required* | Unique parameter identifier |
| `label` | `string` | *Required* | Display label |
| `min` | `number` | *Required* | Minimum value |
| `max` | `number` | *Required* | Maximum value |
| `value` | `number` | *Required* | Initial/default value |
| `step` | `number` | `0.01` | Slider step size |
| `decimals` | `number` | `2` | Decimal places to display |
| `description` | `string` | `''` | Help text/tooltip |
| `unit` | `string` | `''` | Unit suffix (e.g., '%', 'tokens') |
| `presets` | `PresetValue[]` | `[]` | Quick preset values for this parameter |
| `showInput` | `boolean` | `true` | Show manual input field |
| `showReset` | `boolean` | `true` | Show individual reset button |
| `disabled` | `boolean` | `false` | Disable this parameter |
| `validate` | `(value, allValues) => boolean \| string` | `undefined` | Validation function |

**Example:**

```javascript
{
  id: 'temperature',
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  step: 0.1,
  decimals: 1,
  description: 'Controls randomness in responses. Higher = more creative.',
  unit: '',
  validate: (value) => {
    if (value > 1.5) return 'High temperatures may produce incoherent results';
    return true;
  }
}
```

### PresetConfiguration

Configuration for a panel preset (sets multiple parameters).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | *Required* | Display name |
| `description` | `string` | `''` | Preset description |
| `values` | `Record<string, number>` | *Required* | Parameter values (id → value) |
| `icon` | `string` | `''` | Optional icon/emoji |
| `isBuiltIn` | `boolean` | `false` | Cannot be deleted if true |

**Example:**

```javascript
presets: {
  chatgpt: {
    name: 'ChatGPT',
    description: 'Balanced configuration',
    icon: '💬',
    values: {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048
    },
    isBuiltIn: true
  }
}
```

---

## Methods

### getValue(parameterId: string): number

Get current value of a parameter.

**Parameters:**
- `parameterId` - Parameter ID

**Returns:** Current numeric value

**Throws:** Error if parameter doesn't exist

```javascript
const temp = panel.getValue('temperature');
console.log('Current temperature:', temp); // 0.7
```

### setValue(parameterId: string, value: number): void

Set value of a parameter programmatically.

**Parameters:**
- `parameterId` - Parameter ID
- `value` - New value (will be clamped to min/max)

**Emits:** `panelchange` event (if `emitChangeEvents` is true)

```javascript
panel.setValue('temperature', 1.0);
panel.setValue('topP', 0.95);
```

### getAllValues(): Record<string, number>

Get all current parameter values.

**Returns:** Object mapping parameter IDs to values

```javascript
const values = panel.getAllValues();
// { temperature: 0.7, topP: 0.9, maxTokens: 2048 }
```

### resetParameter(parameterId: string): void

Reset a single parameter to its default value.

**Parameters:**
- `parameterId` - Parameter ID to reset

```javascript
panel.resetParameter('temperature');
```

### resetAll(): void

Reset all parameters to their default values.

**Emits:** `panelreset` event

```javascript
panel.resetAll();
```

### loadPreset(presetId: string): void

Load a preset configuration.

**Parameters:**
- `presetId` - Preset identifier

**Emits:** `presetload` event

**Throws:** Error if preset doesn't exist

```javascript
panel.loadPreset('chatgpt');
panel.loadPreset('creative');
```

### addPreset(id: string, name: string, values: Record<string, number>, description?: string): void

Add a custom preset dynamically.

**Parameters:**
- `id` - Unique preset identifier
- `name` - Display name
- `values` - Parameter values
- `description` - Optional description

```javascript
panel.addPreset('custom', 'My Config', {
  temperature: 0.8,
  topP: 0.92,
  maxTokens: 3000
}, 'Custom configuration for coding tasks');
```

### removePreset(presetId: string): void

Remove a custom preset.

**Parameters:**
- `presetId` - Preset to remove

**Note:** Cannot remove built-in presets (`isBuiltIn: true`)

```javascript
panel.removePreset('custom');
```

### exportConfig(): ExportedConfig

Export current configuration as JSON object.

**Returns:** Configuration object with values and metadata

**Emits:** `configexport` event

```javascript
const config = panel.exportConfig();
console.log(JSON.stringify(config, null, 2));
// {
//   "version": "1.0",
//   "preset": "chatgpt",
//   "parameters": { "temperature": 0.7, "topP": 0.9 },
//   "metadata": { "created": "2026-01-11T...", "name": "Parameters" }
// }

// Save to file
const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'config.json';
a.click();
```

### importConfig(config: ExportedConfig | string): void

Import configuration from JSON object or string.

**Parameters:**
- `config` - Configuration object or JSON string

**Emits:** `configimport` event

**Throws:** Error if configuration is invalid

```javascript
// From object
panel.importConfig({
  version: '1.0',
  parameters: { temperature: 0.8, topP: 0.95 }
});

// From JSON string
const json = '{"version":"1.0","parameters":{"temperature":0.8}}';
panel.importConfig(json);

// From file upload
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const text = await file.text();
  panel.importConfig(text);
});
```

### toggleCollapse(): void

Toggle panel collapse state (if `collapsible: true`).

```javascript
panel.toggleCollapse();
```

### validateAll(): boolean

Validate all parameters.

**Returns:** `true` if all parameters are valid

**Emits:** `validationerror` events for each invalid parameter

```javascript
if (panel.validateAll()) {
  console.log('All parameters valid!');
} else {
  console.log('Validation errors found');
}
```

### getValidationErrors(): Record<string, string>

Get current validation errors.

**Returns:** Object mapping parameter IDs to error messages

```javascript
const errors = panel.getValidationErrors();
// { temperature: 'Value too high', topP: 'Must be between 0 and 1' }

Object.entries(errors).forEach(([param, error]) => {
  console.error(`${param}: ${error}`);
});
```

### clearValidationErrors(): void

Clear all validation errors.

```javascript
panel.clearValidationErrors();
```

---

## Events

All events are instances of `CustomEvent` with typed `detail` property.

### panelchange

Fired when any parameter value changes (requires `emitChangeEvents: true`).

**Event Detail:**

```typescript
{
  parameterId: string;      // Changed parameter ID
  value: number;            // New value
  previousValue: number;    // Previous value
  allValues: Record<string, number>;  // All current values
  source: 'slider' | 'input' | 'preset' | 'reset' | 'import';
  timestamp: number;
}
```

**Example:**

```javascript
panel.addEventListener('panelchange', (e) => {
  console.log(`${e.detail.parameterId}: ${e.detail.previousValue} → ${e.detail.value}`);
  console.log('Source:', e.detail.source);
  console.log('All values:', e.detail.allValues);
  
  // Send to API
  if (e.detail.source === 'slider' || e.detail.source === 'input') {
    updateAIModel(e.detail.allValues);
  }
});
```

### presetload

Fired when a preset is loaded.

**Event Detail:**

```typescript
{
  presetId: string;         // Preset identifier
  preset: PresetConfiguration;  // Full preset config
  previousValues: Record<string, number>;  // Values before load
  timestamp: number;
}
```

**Example:**

```javascript
panel.addEventListener('presetload', (e) => {
  console.log(`Loaded preset: ${e.detail.preset.name}`);
  console.log('New values:', e.detail.preset.values);
  console.log('Previous values:', e.detail.previousValues);
  
  // Track analytics
  analytics.track('preset_loaded', {
    preset: e.detail.presetId,
    values: e.detail.preset.values
  });
});
```

### panelreset

Fired when panel is reset.

**Event Detail:**

```typescript
{
  previousValues: Record<string, number>;  // Values before reset
  newValues: Record<string, number>;       // Values after reset
  timestamp: number;
}
```

**Example:**

```javascript
panel.addEventListener('panelreset', (e) => {
  console.log('Panel reset');
  console.log('Previous:', e.detail.previousValues);
  console.log('New:', e.detail.newValues);
});
```

### configexport

Fired when configuration is exported.

**Event Detail:**

```typescript
{
  config: ExportedConfig;   // Exported configuration
  format: 'json' | 'url';   // Export format
  timestamp: number;
}
```

**Example:**

```javascript
panel.addEventListener('configexport', (e) => {
  console.log('Configuration exported:', e.detail.config);
  
  // Auto-save to cloud
  saveToCloud(e.detail.config);
});
```

### configimport

Fired when configuration is imported.

**Event Detail:**

```typescript
{
  config: ExportedConfig;   // Imported configuration
  previousValues: Record<string, number>;  // Values before import
  timestamp: number;
}
```

**Example:**

```javascript
panel.addEventListener('configimport', (e) => {
  console.log('Configuration imported');
  console.log('New config:', e.detail.config);
  
  // Show success message
  showNotification('Configuration loaded successfully!');
});
```

### validationerror

Fired when validation fails (requires `validateOnChange: true`).

**Event Detail:**

```typescript
{
  parameterId: string;      // Parameter with error
  error: string;            // Error message
  value: number;            // Current value
  timestamp: number;
}
```

**Example:**

```javascript
panel.addEventListener('validationerror', (e) => {
  console.error(`Validation error on ${e.detail.parameterId}`);
  console.error(`Error: ${e.detail.error}`);
  console.error(`Value: ${e.detail.value}`);
  
  // Show error notification
  showError(`${e.detail.parameterId}: ${e.detail.error}`);
});
```

---

## Properties

### Read-Only Properties

| Property | Type | Description |
|----------|------|-------------|
| `parameters` | `ParameterDefinition[]` | Parameter definitions |
| `presets` | `Record<string, PresetConfiguration>` | Available presets |
| `isDirty` | `boolean` | Has panel been modified from defaults |
| `isCollapsed` | `boolean` | Is panel currently collapsed |
| `activePreset` | `string \| null` | Currently active preset ID |

**Example:**

```javascript
console.log('Parameters:', panel.parameters);
console.log('Presets:', panel.presets);
console.log('Is dirty?', panel.isDirty);
console.log('Is collapsed?', panel.isCollapsed);
console.log('Active preset:', panel.activePreset);

// Check if modified
if (panel.isDirty) {
  if (confirm('You have unsaved changes. Continue?')) {
    panel.resetAll();
  }
}
```

---

## Styling

### CSS Custom Properties

Customize the panel appearance using CSS variables:

```css
ai-parameter-panel {
  /* Colors */
  --panel-bg: #ffffff;
  --panel-border: #e5e7eb;
  --panel-text: #1f2937;
  --panel-accent: #2563eb;
  --panel-accent-hover: #1d4ed8;
  
  /* Spacing */
  --panel-padding: 24px;
  --panel-gap: 20px;
  --panel-border-radius: 12px;
  
  /* Typography */
  --panel-title-size: 20px;
  --panel-title-weight: 700;
  
  /* Buttons */
  --button-bg: #2563eb;
  --button-bg-hover: #1d4ed8;
  --button-text: #ffffff;
  --button-padding: 10px 20px;
  --button-border-radius: 8px;
  
  /* Preset buttons */
  --preset-bg: #f3f4f6;
  --preset-bg-active: #2563eb;
  --preset-text: #374151;
  --preset-text-active: #ffffff;
  
  /* Validation */
  --error-color: #dc2626;
  --error-bg: #fee2e2;
}
```

### Example: Custom Theme

```css
/* Dark theme */
ai-parameter-panel.dark-theme {
  --panel-bg: #1f2937;
  --panel-border: #374151;
  --panel-text: #f9fafb;
  --panel-accent: #3b82f6;
  --panel-accent-hover: #2563eb;
  
  --button-bg: #3b82f6;
  --button-bg-hover: #2563eb;
  
  --preset-bg: #374151;
  --preset-bg-active: #3b82f6;
  --preset-text: #e5e7eb;
  --preset-text-active: #ffffff;
}

/* Compact layout */
ai-parameter-panel.compact {
  --panel-padding: 16px;
  --panel-gap: 12px;
  --panel-title-size: 16px;
  --button-padding: 8px 16px;
}

/* Purple theme */
ai-parameter-panel.purple-theme {
  --panel-accent: #7c3aed;
  --panel-accent-hover: #6d28d9;
  --button-bg: #7c3aed;
  --button-bg-hover: #6d28d9;
  --preset-bg-active: #7c3aed;
}
```

---

## Examples

### Example 1: LLM Configuration Panel

```javascript
const llmPanel = new ParameterPanel({
  title: 'LLM Configuration',
  parameters: [
    {
      id: 'temperature',
      label: 'Temperature',
      min: 0,
      max: 2,
      value: 0.7,
      step: 0.1,
      description: 'Controls randomness in responses'
    },
    {
      id: 'topP',
      label: 'Top-P',
      min: 0,
      max: 1,
      value: 0.9,
      step: 0.05,
      description: 'Nucleus sampling threshold'
    },
    {
      id: 'maxTokens',
      label: 'Max Tokens',
      min: 100,
      max: 8000,
      value: 2000,
      step: 100,
      unit: 'tokens',
      description: 'Maximum response length'
    },
    {
      id: 'frequencyPenalty',
      label: 'Frequency Penalty',
      min: -2,
      max: 2,
      value: 0,
      step: 0.1,
      description: 'Reduces repetition'
    }
  ],
  presets: {
    chatgpt: {
      name: 'ChatGPT',
      description: 'Balanced for conversation',
      values: { temperature: 0.7, topP: 0.9, maxTokens: 2048, frequencyPenalty: 0 }
    },
    creative: {
      name: 'Creative',
      description: 'Diverse and creative outputs',
      values: { temperature: 1.2, topP: 0.95, maxTokens: 4096, frequencyPenalty: 0.5 }
    },
    code: {
      name: 'Code',
      description: 'Focused and deterministic',
      values: { temperature: 0.2, topP: 0.8, maxTokens: 3000, frequencyPenalty: 0 }
    }
  },
  layout: 'grid',
  columns: 2,
  showPresets: true,
  showResetAll: true,
  showExportImport: true,
  emitChangeEvents: true,
  persistValues: true,
  storageKey: 'llm-config'
});

document.getElementById('config').appendChild(llmPanel);

// Listen to changes
llmPanel.addEventListener('panelchange', (e) => {
  updateLLMConfig(e.detail.allValues);
});
```

### Example 2: Audio Settings with Validation

```javascript
const audioPanel = new ParameterPanel({
  title: 'Audio Settings',
  parameters: [
    {
      id: 'volume',
      label: 'Volume',
      min: 0,
      max: 100,
      value: 75,
      unit: '%',
      validate: (value) => {
        if (value > 90) return 'High volume may damage speakers';
        return true;
      }
    },
    {
      id: 'pitch',
      label: 'Pitch Shift',
      min: -12,
      max: 12,
      value: 0,
      unit: 'semitones',
      description: 'Adjust pitch up or down'
    },
    {
      id: 'speed',
      label: 'Playback Speed',
      min: 0.5,
      max: 2.0,
      value: 1.0,
      step: 0.1,
      decimals: 1,
      unit: 'x',
      validate: (value) => {
        if (value < 0.7 || value > 1.5) {
          return 'Extreme speeds may affect quality';
        }
        return true;
      }
    }
  ],
  presets: {
    normal: {
      name: 'Normal',
      values: { volume: 75, pitch: 0, speed: 1.0 }
    },
    loud: {
      name: 'Loud',
      values: { volume: 90, pitch: 0, speed: 1.0 }
    },
    fast: {
      name: 'Fast',
      values: { volume: 75, pitch: 0, speed: 1.5 }
    }
  },
  showPresets: true,
  validateOnChange: true,
  collapsible: true
});

audioPanel.addEventListener('validationerror', (e) => {
  console.warn(`${e.detail.parameterId}: ${e.detail.error}`);
  showWarning(e.detail.error);
});
```

### Example 3: Import/Export Workflow

```javascript
const panel = new ParameterPanel({
  title: 'Model Settings',
  parameters: [
    { id: 'param1', label: 'Param 1', min: 0, max: 1, value: 0.5 },
    { id: 'param2', label: 'Param 2', min: 0, max: 1, value: 0.5 }
  ],
  showExportImport: true
});

// Export to file
document.getElementById('save-btn').addEventListener('click', () => {
  const config = panel.exportConfig();
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `config-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// Import from file
document.getElementById('load-btn').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    const text = await file.text();
    try {
      panel.importConfig(text);
      showSuccess('Configuration loaded!');
    } catch (error) {
      showError('Invalid configuration file');
    }
  };
  input.click();
});

// Auto-save to localStorage
let saveTimeout;
panel.addEventListener('panelchange', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const config = panel.exportConfig();
    localStorage.setItem('auto-save', JSON.stringify(config));
    console.log('Auto-saved');
  }, 1000);
});

// Load from localStorage on startup
const saved = localStorage.getItem('auto-save');
if (saved) {
  panel.importConfig(saved);
}
```

### Example 4: Dynamic Preset Management

```javascript
const panel = new ParameterPanel({
  title: 'Custom Configurations',
  parameters: [
    { id: 'a', label: 'Parameter A', min: 0, max: 10, value: 5 },
    { id: 'b', label: 'Parameter B', min: 0, max: 10, value: 5 }
  ],
  showPresets: true,
  persistPresets: true
});

// Add custom preset from current values
document.getElementById('save-preset').addEventListener('click', () => {
  const name = prompt('Enter preset name:');
  if (name) {
    const values = panel.getAllValues();
    const id = name.toLowerCase().replace(/\s+/g, '-');
    panel.addPreset(id, name, values);
    showSuccess(`Preset "${name}" saved!`);
  }
});

// Delete selected preset
document.getElementById('delete-preset').addEventListener('click', () => {
  const presetId = panel.activePreset;
  if (presetId) {
    if (confirm(`Delete preset "${presetId}"?`)) {
      panel.removePreset(presetId);
      showSuccess('Preset deleted');
    }
  } else {
    showError('No preset selected');
  }
});

// List all presets
document.getElementById('list-presets').addEventListener('click', () => {
  const presets = panel.presets;
  console.log('Available presets:');
  Object.entries(presets).forEach(([id, preset]) => {
    console.log(`- ${preset.name} (${id})`, preset.values);
  });
});
```

---

## TypeScript

Full TypeScript support with comprehensive type definitions:

```typescript
import {
  ParameterPanel,
  ParameterPanelConfig,
  ParameterDefinition,
  PresetConfiguration,
  PanelChangeEvent,
  PresetLoadEvent,
  ConfigExportEvent,
  ConfigImportEvent,
  PanelResetEvent,
  ValidationErrorEvent,
  ExportedConfig
} from 'ai-progress-controls';

// Typed configuration
const config: ParameterPanelConfig = {
  title: 'LLM Config',
  parameters: [
    {
      id: 'temperature',
      label: 'Temperature',
      min: 0,
      max: 2,
      value: 0.7,
      validate: (value: number): boolean | string => {
        if (value > 1.5) return 'Too high!';
        return true;
      }
    }
  ],
  presets: {
    default: {
      name: 'Default',
      values: { temperature: 0.7 }
    }
  },
  emitChangeEvents: true
};

const panel = new ParameterPanel(config);

// Typed event handlers
panel.addEventListener('panelchange', (e: Event) => {
  const event = e as CustomEvent<PanelChangeEvent>;
  console.log(event.detail.parameterId);  // Type: string
  console.log(event.detail.value);        // Type: number
  console.log(event.detail.allValues);    // Type: Record<string, number>
});

panel.addEventListener('presetload', (e: Event) => {
  const event = e as CustomEvent<PresetLoadEvent>;
  console.log(event.detail.preset.name);  // Type: string
  console.log(event.detail.preset.values); // Type: Record<string, number>
});

// Typed methods
const values: Record<string, number> = panel.getAllValues();
const temp: number = panel.getValue('temperature');
panel.setValue('temperature', 0.8);

const exported: ExportedConfig = panel.exportConfig();
panel.importConfig(exported);
```

---

## Best Practices

### 1. Parameter Organization

```javascript
// ✅ Good: Group related parameters
const panel = new ParameterPanel({
  title: 'LLM Settings',
  parameters: [
    // Sampling parameters
    { id: 'temperature', label: 'Temperature', min: 0, max: 2, value: 0.7 },
    { id: 'topP', label: 'Top-P', min: 0, max: 1, value: 0.9 },
    
    // Output control
    { id: 'maxTokens', label: 'Max Tokens', min: 100, max: 8000, value: 2000 },
    
    // Penalties
    { id: 'frequencyPenalty', label: 'Frequency Penalty', min: -2, max: 2, value: 0 }
  ],
  layout: 'grid',
  columns: 2  // Group in pairs
});

// ❌ Bad: Mixed, unorganized parameters
```

### 2. Meaningful Presets

```javascript
// ✅ Good: Clear, descriptive presets
presets: {
  chatgpt: {
    name: 'ChatGPT',
    description: 'Balanced for natural conversation',
    values: { temperature: 0.7, topP: 0.9, maxTokens: 2048 }
  },
  creative: {
    name: 'Creative Writing',
    description: 'Diverse and imaginative outputs',
    values: { temperature: 1.2, topP: 0.95, maxTokens: 4096 }
  }
}

// ❌ Bad: Vague names, no descriptions
presets: {
  preset1: { name: 'P1', values: { temperature: 0.7 } },
  preset2: { name: 'P2', values: { temperature: 0.9 } }
}
```

### 3. Validation

```javascript
// ✅ Good: Helpful validation messages
{
  id: 'temperature',
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  validate: (value, allValues) => {
    if (value > 1.5) {
      return 'Temperatures above 1.5 may produce incoherent results';
    }
    if (value < 0.3 && allValues.topP > 0.9) {
      return 'Low temperature with high Top-P may limit diversity';
    }
    return true;
  }
}

// ❌ Bad: Cryptic or missing validation
validate: (value) => value <= 1.5 || 'Invalid'
```

### 4. Event Handling

```javascript
// ✅ Good: Debounced updates for expensive operations
let updateTimeout;
panel.addEventListener('panelchange', (e) => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateAIModel(e.detail.allValues);
  }, 500);  // Wait 500ms after last change
});

// ❌ Bad: Update on every change (expensive!)
panel.addEventListener('panelchange', (e) => {
  updateAIModel(e.detail.allValues);  // Called on every slider move
});
```

### 5. Persistence Strategy

```javascript
// ✅ Good: Smart persistence with versioning
const panel = new ParameterPanel({
  // ... config
  persistValues: true,
  storageKey: 'app-v2-llm-config'  // Version in key
});

// Migrate old configs
const oldConfig = localStorage.getItem('app-v1-llm-config');
if (oldConfig && !localStorage.getItem('app-v2-llm-config')) {
  const migrated = migrateConfig(oldConfig);
  panel.importConfig(migrated);
}

// ❌ Bad: No versioning, potential conflicts
persistValues: true,
storageKey: 'config'  // Too generic
```

### 6. Accessibility

```javascript
// ✅ Good: Proper labels and descriptions
const panel = new ParameterPanel({
  title: 'Model Configuration',
  ariaLabel: 'AI Model Configuration Panel',
  parameters: [
    {
      id: 'temperature',
      label: 'Temperature',
      description: 'Controls randomness. 0 = deterministic, 2 = very random',
      ariaLabel: 'Model Temperature Slider'
    }
  ]
});

// ❌ Bad: Missing descriptions
parameters: [
  { id: 'temp', label: 'T', min: 0, max: 2, value: 0.7 }  // Unclear
]
```

### 7. Error Handling

```javascript
// ✅ Good: Graceful error handling
panel.addEventListener('validationerror', (e) => {
  showNotification({
    type: 'warning',
    message: `${e.detail.parameterId}: ${e.detail.error}`,
    duration: 5000
  });
});

try {
  panel.importConfig(userConfig);
  showSuccess('Configuration loaded successfully');
} catch (error) {
  console.error('Import failed:', error);
  showError('Failed to load configuration. Using defaults.');
}

// ❌ Bad: Silent failures
panel.importConfig(userConfig);  // May fail silently
```

### 8. Performance

```javascript
// ✅ Good: Batch updates
const updates = {
  temperature: 0.8,
  topP: 0.95,
  maxTokens: 3000
};

// Import as config for single render
panel.importConfig({
  version: '1.0',
  parameters: updates
});

// ❌ Bad: Multiple individual updates (multiple renders)
panel.setValue('temperature', 0.8);
panel.setValue('topP', 0.95);
panel.setValue('maxTokens', 3000);
```

---

## Related Components

- [ParameterSlider](./parameter-slider.md) - Single parameter control (used internally)
- [ModelLoader](./model-loader.md) - Model loading progress
- [BatchProgress](./batch-progress.md) - Batch operation progress

---

## License

MIT License - see LICENSE file for details
