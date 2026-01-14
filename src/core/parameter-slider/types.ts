/**
 * Preset configuration for common values
 */
export interface PresetValue {
  value: number;
  label: string;
  description?: string;
}

/**
 * Configuration options for ParameterSlider
 */
export interface ParameterSliderConfig {
  /** Parameter label */
  label?: string;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Current value */
  value?: number;

  /** Default value to reset to */
  defaultValue?: number;

  /** Step size for slider */
  step?: number;

  /** Number of decimal places to display */
  decimals?: number;

  /** Parameter description/help text */
  description?: string;

  /** Show preset value buttons */
  showPresets?: boolean;

  /** Preset values with labels */
  presets?: PresetValue[];

  /** Show manual input field */
  showInput?: boolean;

  /** Show reset button */
  showReset?: boolean;

  /** Show range labels (min/max) */
  showRangeLabels?: boolean;

  /** Unit suffix (e.g., '%', 'tokens') */
  unit?: string;

  /** Enable automatic cursor state changes based on component state */
  cursorFeedback?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Enable debug logging */
  debug?: boolean;

  /** Additional CSS class */
  className?: string;

  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Internal state of the ParameterSlider
 */
export interface ParameterSliderState {
  currentValue: number;
  isDragging: boolean;
  isFocused: boolean;
}

/**
 * Event detail for value change
 */
export interface ValueChangeEvent {
  value: number;
  previousValue: number;
  source: 'slider' | 'input' | 'preset' | 'reset';
  timestamp: number;
}

/**
 * Event detail for preset selection
 */
export interface PresetSelectEvent {
  preset: PresetValue;
  previousValue: number;
  timestamp: number;
}
