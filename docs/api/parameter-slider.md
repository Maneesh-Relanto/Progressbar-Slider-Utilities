# ParameterSlider API Documentation

## Overview

`ParameterSlider` is a Web Component for interactive AI parameter configuration. Perfect for controlling temperature, top-p, penalties, max tokens, and other LLM parameters with preset values, manual input, and full accessibility support.

## Table of Contents

- [Installation](#installation)
- [Constructor](#constructor)
- [Configuration](#configuration)
- [Methods](#methods)
- [Events](#events)
- [Properties](#properties)
- [Styling](#styling)
- [Examples](#examples)

---

## Installation

```bash
npm install ai-progress-controls
```

```javascript
import { ParameterSlider } from 'ai-progress-controls';
```

---

## Constructor

### `new ParameterSlider(config?: ParameterSliderConfig)`

Creates a new ParameterSlider component instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `ParameterSliderConfig` | Optional configuration object |

**Returns:** `ParameterSlider` instance

**Example:**

```javascript
const slider = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  step: 0.1,
  description: 'Controls randomness in responses'
});
```

---

## Configuration

### ParameterSliderConfig

Configuration object passed to the constructor.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `'Parameter'` | Parameter label |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `1` | Maximum value |
| `value` | `number` | `0.5` | Initial value |
| `defaultValue` | `number` | `value` | Default value for reset |
| `step` | `number` | `0.01` | Step size for slider |
| `decimals` | `number` | `2` | Decimal places to display |
| `description` | `string` | `''` | Help text description |
| `showPresets` | `boolean` | `true` | Show preset buttons |
| `presets` | `PresetValue[]` | `[]` | Preset value configurations |
| `showInput` | `boolean` | `true` | Show manual input field |
| `showReset` | `boolean` | `true` | Show reset button |
| `showRangeLabels` | `boolean` | `true` | Show min/max labels |
| `unit` | `string` | `''` | Unit suffix (e.g., '%', 'tokens') |
| `disabled` | `boolean` | `false` | Disabled state |
| `debug` | `boolean` | `false` | Enable debug logging |
| `className` | `string` | `''` | Custom CSS class |
| `ariaLabel` | `string` | `'{label} Slider'` | ARIA label |

### PresetValue Interface

Define preset values with labels:

```typescript
interface PresetValue {
  value: number;           // Preset value
  label: string;           // Display label
  description?: string;    // Optional tooltip/description
}
```

**Example:**

```javascript
const config = {
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  defaultValue: 0.7,
  step: 0.1,
  decimals: 1,
  description: 'Controls randomness. Lower = focused, Higher = creative',
  showPresets: true,
  presets: [
    { value: 0, label: 'Precise', description: 'Deterministic outputs' },
    { value: 0.7, label: 'Balanced', description: 'Good balance' },
    { value: 1.5, label: 'Creative', description: 'More random' }
  ],
  showInput: true,
  showReset: true,
  unit: '',
};

const slider = new ParameterSlider(config);
```

---

## Methods

### `getValue(): number`

Get the current slider value.

**Returns:** `number` - Current value

**Example:**

```javascript
const currentValue = slider.getValue();
console.log('Temperature:', currentValue); // 0.7
```

---

### `setValue(value: number, source?: string): void`

Set the slider value programmatically.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | - | New value to set |
| `source` | `'slider' \| 'input' \| 'preset' \| 'reset'` | `'slider'` | Source of change |

**Example:**

```javascript
// Set value
slider.setValue(1.2);

// Set value with source tracking
slider.setValue(0.5, 'preset');
```

**Fires:** `valuechange` event

---

### `reset(): void`

Reset the slider to its default value.

**Example:**

```javascript
slider.reset();
```

**Fires:** `valuechange` event with `source: 'reset'`

---

### `selectPreset(index: number): void`
### `selectPreset(preset: PresetValue): void`

Select a preset value by index or preset object.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | `number` | Index of preset in presets array |
| `preset` | `PresetValue` | Preset object to select |

**Example:**

```javascript
// Select by index
slider.selectPreset(0); // Select first preset

// Select by preset object
const balancedPreset = { value: 0.7, label: 'Balanced' };
slider.selectPreset(balancedPreset);
```

**Fires:** `valuechange` and `presetselect` events

---

### `enable(): void`

Enable the slider (remove disabled state).

**Example:**

```javascript
slider.enable();
```

---

### `disable(): void`

Disable the slider (prevent interactions).

**Example:**

```javascript
slider.disable();
```

---

### `updateConfig(config: Partial<ParameterSliderConfig>): void`

Update configuration options after initialization.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `Partial<ParameterSliderConfig>` | Configuration properties to update |

**Example:**

```javascript
slider.updateConfig({
  min: 0,
  max: 1.5,
  step: 0.05,
  presets: [
    { value: 0.3, label: 'Low' },
    { value: 0.9, label: 'High' }
  ]
});
```

---

## Events

### `valuechange`

Fired when the slider value changes.

**Event Detail:**

```typescript
{
  value: number;           // New value
  previousValue: number;   // Previous value
  source: 'slider' | 'input' | 'preset' | 'reset';  // Change source
  timestamp: number;       // Change timestamp
}
```

**Example:**

```javascript
slider.addEventListener('valuechange', (e) => {
  console.log('Value changed:', e.detail.value);
  console.log('Source:', e.detail.source);
  console.log('Previous:', e.detail.previousValue);
});
```

---

### `presetselect`

Fired when a preset is selected.

**Event Detail:**

```typescript
{
  preset: PresetValue;     // Selected preset
  previousValue: number;   // Previous value
  timestamp: number;       // Selection timestamp
}
```

**Example:**

```javascript
slider.addEventListener('presetselect', (e) => {
  console.log('Preset selected:', e.detail.preset.label);
  console.log('New value:', e.detail.preset.value);
});
```

---

## Properties

### `value: number`

Get or set the current value.

**Example:**

```javascript
// Get value
console.log(slider.value); // 0.7

// Set value
slider.value = 1.2;
```

---

### `disabled: boolean`

Get or set the disabled state.

**Example:**

```javascript
// Check if disabled
if (slider.disabled) {
  console.log('Slider is disabled');
}

// Disable slider
slider.disabled = true;
```

---

### `label: string`

Get or set the label text.

**Example:**

```javascript
slider.label = 'Top-P Sampling';
```

---

## Styling

### CSS Custom Properties

Customize the appearance using CSS variables:

```css
parameter-slider {
  /* Colors */
  --slider-background: #1a1a2e;
  --slider-text: #e4e4e7;
  --slider-text-secondary: #a1a1aa;
  --slider-primary: #667eea;
  --slider-primary-hover: #5568d3;
  --slider-border: #27273a;
  --slider-track: #27273a;
  --slider-fill: #667eea;
  --slider-thumb: #ffffff;
  --slider-thumb-hover: #f4f4f5;
  
  /* Spacing */
  --slider-padding: 20px;
  --slider-border-radius: 12px;
  --slider-track-height: 8px;
  --slider-thumb-size: 20px;
  
  /* Typography */
  --slider-font-family: 'Inter', system-ui, sans-serif;
  --slider-font-size: 14px;
  --slider-label-size: 15px;
  --slider-label-weight: 600;
  
  /* Presets */
  --preset-padding: 8px 16px;
  --preset-background: #27273a;
  --preset-background-hover: #333348;
  --preset-background-active: #667eea;
  --preset-text: #e4e4e7;
  --preset-text-active: #ffffff;
  
  /* Input */
  --input-background: #27273a;
  --input-border: #3f3f46;
  --input-text: #e4e4e7;
  
  /* Transitions */
  --transition-speed: 0.2s;
}
```

### Custom Classes

Add custom styling with the `className` config option:

```javascript
const slider = new ParameterSlider({
  className: 'custom-temperature-slider'
});
```

```css
.custom-temperature-slider {
  --slider-primary: #ff6b6b;
  --slider-fill: #ff6b6b;
  --preset-background-active: #ff6b6b;
}
```

### Dark Mode Support

Built-in dark mode (default theme):

```css
parameter-slider {
  color-scheme: dark;
}
```

For light mode override:

```css
parameter-slider.light-mode {
  --slider-background: #ffffff;
  --slider-text: #18181b;
  --slider-text-secondary: #71717a;
  --slider-border: #e4e4e7;
  --slider-track: #e4e4e7;
}
```

---

## Examples

### Basic Temperature Slider

```javascript
import { ParameterSlider } from 'ai-progress-controls';

const tempSlider = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  step: 0.1,
  description: 'Controls randomness in generation'
});

document.body.appendChild(tempSlider);

tempSlider.addEventListener('valuechange', (e) => {
  console.log('Temperature:', e.detail.value);
});
```

---

### Top-P Slider with Presets

```javascript
const topPSlider = new ParameterSlider({
  label: 'Top-P',
  min: 0,
  max: 1,
  value: 0.9,
  step: 0.05,
  decimals: 2,
  description: 'Nucleus sampling threshold',
  presets: [
    { value: 0, label: 'Off', description: 'Disable sampling' },
    { value: 0.5, label: 'Low', description: 'Conservative sampling' },
    { value: 0.9, label: 'Default', description: 'Recommended value' },
    { value: 1, label: 'Max', description: 'Full sampling' }
  ]
});

document.body.appendChild(topPSlider);
```

---

### Max Tokens with Cost Display

```javascript
const tokensSlider = new ParameterSlider({
  label: 'Max Tokens',
  min: 1,
  max: 4000,
  value: 2000,
  step: 1,
  decimals: 0,
  unit: ' tokens',
  description: 'Maximum response length',
  presets: [
    { value: 100, label: 'Short', description: 'Quick responses' },
    { value: 500, label: 'Medium', description: 'Standard length' },
    { value: 2000, label: 'Long', description: 'Detailed responses' },
    { value: 4000, label: 'Max', description: 'Maximum length' }
  ]
});

document.body.appendChild(tokensSlider);

// Show cost calculation
tokensSlider.addEventListener('valuechange', (e) => {
  const cost = e.detail.value * 0.00002; // $0.00002 per token
  console.log(`Max cost: $${cost.toFixed(4)}`);
});
```

---

### Complete LLM Parameters Panel

```javascript
// Create multiple sliders for full LLM control
const params = {
  temperature: null,
  topP: null,
  maxTokens: null,
  frequencyPenalty: null
};

// Temperature
params.temperature = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  step: 0.1,
  presets: [
    { value: 0, label: 'Precise' },
    { value: 0.7, label: 'Balanced' },
    { value: 1.5, label: 'Creative' }
  ]
});

// Top-P
params.topP = new ParameterSlider({
  label: 'Top-P',
  min: 0,
  max: 1,
  value: 0.9,
  step: 0.05,
  presets: [
    { value: 0.5, label: 'Low' },
    { value: 0.9, label: 'Default' },
    { value: 1, label: 'Max' }
  ]
});

// Max Tokens
params.maxTokens = new ParameterSlider({
  label: 'Max Tokens',
  min: 1,
  max: 4000,
  value: 2000,
  step: 1,
  decimals: 0,
  unit: ' tokens',
  presets: [
    { value: 500, label: 'Short' },
    { value: 2000, label: 'Medium' },
    { value: 4000, label: 'Long' }
  ]
});

// Frequency Penalty
params.frequencyPenalty = new ParameterSlider({
  label: 'Frequency Penalty',
  min: 0,
  max: 2,
  value: 0,
  step: 0.1,
  description: 'Reduces repetition'
});

// Append all sliders
const container = document.getElementById('params-panel');
Object.values(params).forEach(slider => {
  container.appendChild(slider);
});

// Get all values
function getParameters() {
  return {
    temperature: params.temperature.getValue(),
    top_p: params.topP.getValue(),
    max_tokens: params.maxTokens.getValue(),
    frequency_penalty: params.frequencyPenalty.getValue()
  };
}

// Export button
document.getElementById('export-btn').addEventListener('click', () => {
  const config = getParameters();
  console.log('LLM Config:', JSON.stringify(config, null, 2));
});
```

---

### Integration with OpenAI

```javascript
import OpenAI from 'openai';
import { ParameterSlider } from 'ai-progress-controls';

// Create sliders
const tempSlider = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  step: 0.1,
});

const maxTokensSlider = new ParameterSlider({
  label: 'Max Tokens',
  min: 1,
  max: 4000,
  value: 1000,
  step: 1,
  decimals: 0,
});

document.body.appendChild(tempSlider);
document.body.appendChild(maxTokensSlider);

// Use values in API call
const openai = new OpenAI({ apiKey: 'your-key' });

async function generateResponse(prompt) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: tempSlider.getValue(),
    max_tokens: maxTokensSlider.getValue(),
  });
  
  return response.choices[0].message.content;
}
```

---

### Dynamic Presets

```javascript
const slider = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
});

// Add presets dynamically based on model
function setPresetsForModel(modelName) {
  let presets;
  
  switch (modelName) {
    case 'gpt-4':
      presets = [
        { value: 0.3, label: 'Precise' },
        { value: 0.7, label: 'Balanced' },
        { value: 1.2, label: 'Creative' }
      ];
      break;
    case 'claude-3':
      presets = [
        { value: 0, label: 'Deterministic' },
        { value: 0.5, label: 'Focused' },
        { value: 1, label: 'Balanced' }
      ];
      break;
    default:
      presets = [];
  }
  
  slider.updateConfig({ presets });
}

// Update presets when model changes
document.getElementById('model-select').addEventListener('change', (e) => {
  setPresetsForModel(e.target.value);
});
```

---

### Form Integration

```javascript
const form = document.getElementById('llm-form');

const tempSlider = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
});

form.appendChild(tempSlider);

// Get value on form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = {
    prompt: form.prompt.value,
    temperature: tempSlider.getValue(),
    // ... other fields
  };
  
  console.log('Form data:', formData);
  // Send to API...
});

// Reset form
form.addEventListener('reset', () => {
  tempSlider.reset();
});
```

---

### Percentage Display

```javascript
const confidenceSlider = new ParameterSlider({
  label: 'Confidence Threshold',
  min: 0,
  max: 1,
  value: 0.75,
  step: 0.05,
  decimals: 0,
  unit: '%',
  description: 'Minimum confidence for predictions',
  presets: [
    { value: 0.5, label: 'Low', description: 'More results' },
    { value: 0.75, label: 'Medium', description: 'Balanced' },
    { value: 0.9, label: 'High', description: 'Very confident only' }
  ]
});

// Convert to percentage for display
confidenceSlider.addEventListener('valuechange', (e) => {
  const percentage = Math.round(e.detail.value * 100);
  console.log(`Confidence: ${percentage}%`);
});
```

---

### Disabled State Management

```javascript
const slider = new ParameterSlider({
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
});

// Disable during API call
async function generateText() {
  slider.disable();
  
  try {
    const response = await callAPI({
      temperature: slider.getValue()
    });
    console.log('Response:', response);
  } finally {
    slider.enable();
  }
}
```

---

### Custom Validation

```javascript
const slider = new ParameterSlider({
  label: 'Max Tokens',
  min: 1,
  max: 4000,
  value: 2000,
  step: 1,
  decimals: 0,
});

slider.addEventListener('valuechange', (e) => {
  const value = e.detail.value;
  
  // Warn if value is too high
  if (value > 3000) {
    console.warn('High token count may increase costs');
  }
  
  // Enforce business rules
  if (value > 4000) {
    slider.setValue(4000);
    alert('Maximum tokens limited to 4000');
  }
});
```

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { 
  ParameterSlider,
  ParameterSliderConfig,
  PresetValue,
  ValueChangeEvent,
  PresetSelectEvent
} from 'ai-progress-controls';

const config: ParameterSliderConfig = {
  label: 'Temperature',
  min: 0,
  max: 2,
  value: 0.7,
  step: 0.1,
  presets: [
    { value: 0, label: 'Precise' },
    { value: 0.7, label: 'Balanced' },
    { value: 1.5, label: 'Creative' }
  ]
};

const slider = new ParameterSlider(config);

// Type-safe event listeners
slider.addEventListener('valuechange', (e: CustomEvent<ValueChangeEvent>) => {
  console.log('Value:', e.detail.value);
  console.log('Source:', e.detail.source); // 'slider' | 'input' | 'preset' | 'reset'
});

slider.addEventListener('presetselect', (e: CustomEvent<PresetSelectEvent>) => {
  console.log('Preset:', e.detail.preset.label);
});

// Type-safe methods
const currentValue: number = slider.getValue();
slider.setValue(1.2, 'preset');
```

---

## Accessibility

`ParameterSlider` is fully accessible:

- ✅ **ARIA Attributes**: Proper `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- ✅ **Keyboard Navigation**: 
  - Arrow keys (←/→) adjust value by step
  - Page Up/Down adjust by 10× step
  - Home/End jump to min/max
  - Tab navigates between controls
- ✅ **Screen Reader Support**: All values and changes announced
- ✅ **Focus Indicators**: Clear focus states for keyboard users
- ✅ **Touch Support**: Full touch/drag support for mobile
- ✅ **High Contrast**: Works with high contrast modes
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`
- ✅ **Labels**: Proper label associations

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Decrease/increase by step |
| `Page Down` / `Page Up` | Adjust by 10× step |
| `Home` | Jump to minimum |
| `End` | Jump to maximum |
| `Tab` | Navigate to next control |
| `Shift + Tab` | Navigate to previous control |
| `Enter` | Activate focused button |

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES2020 support and Web Components (Custom Elements v1).

---

## Related Components

- **[StreamProgress](./stream-progress.md)** - Token streaming progress
- **[ModelLoader](./model-loader.md)** - Model loading progress

---

## License

MIT License - See LICENSE file for details
