import type { PresetValue } from '../parameter-slider/types';

/**
 * Parameter definition for a single slider in the panel
 */
export interface ParameterDefinition {
  /** Unique parameter ID */
  id: string;

  /** Display label */
  label: string;

  /** Minimum value */
  min: number;

  /** Maximum value */
  max: number;

  /** Current/default value */
  value: number;

  /** Step size for slider */
  step?: number;

  /** Number of decimal places to display */
  decimals?: number;

  /** Parameter description/help text */
  description?: string;

  /** Unit suffix (e.g., '%', 'tokens') */
  unit?: string;

  /** Preset values for this parameter */
  presets?: PresetValue[];

  /** Show manual input field */
  showInput?: boolean;

  /** Show reset button */
  showReset?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Validation function */
  validate?: (value: number, allValues: Record<string, number>) => boolean | string;
}

/**
 * Preset configuration containing values for all parameters
 */
export interface PresetConfiguration {
  /** Preset name (display) */
  name: string;

  /** Preset description */
  description?: string;

  /** Parameter values */
  values: Record<string, number>;

  /** Optional icon/emoji */
  icon?: string;

  /** Is this a built-in preset? */
  isBuiltIn?: boolean;
}

/**
 * Configuration options for ParameterPanel
 */
export interface ParameterPanelConfig {
  /** Array of parameter definitions */
  parameters: ParameterDefinition[];

  /** Built-in and custom presets */
  presets?: Record<string, PresetConfiguration>;

  /** Default preset to load on initialization */
  defaultPreset?: string;

  /** Layout style: grid or vertical */
  layout?: 'grid' | 'vertical';

  /** Number of columns for grid layout */
  columns?: number;

  /** Panel title */
  title?: string;

  /** Show preset selector buttons */
  showPresets?: boolean;

  /** Show reset all button */
  showResetAll?: boolean;

  /** Show export/import buttons */
  showExportImport?: boolean;

  /** Enable value persistence to localStorage */
  persistValues?: boolean;

  /** Enable preset persistence to localStorage */
  persistPresets?: boolean;

  /** LocalStorage key for persistence */
  storageKey?: string;

  /** Make panel collapsible */
  collapsible?: boolean;

  /** Start collapsed */
  startCollapsed?: boolean;

  /** Validate parameters on change */
  validateOnChange?: boolean;

  /** Emit change events */
  emitChangeEvents?: boolean;

  /** Disabled state for entire panel */
  disabled?: boolean;

  /** Enable debug logging */
  debug?: boolean;

  /** Additional CSS class */
  className?: string;

  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Internal state of the ParameterPanel
 */
export interface ParameterPanelState {
  /** Current values for all parameters */
  values: Record<string, number>;

  /** Currently active preset name */
  activePreset: string | null;

  /** Is panel collapsed */
  isCollapsed: boolean;

  /** Validation errors by parameter ID */
  errors: Record<string, string>;

  /** Are any parameters being modified */
  isDirty: boolean;
}

/**
 * Event detail when any parameter changes
 */
export interface PanelChangeEvent {
  /** Changed parameter ID */
  parameterId: string;

  /** New value */
  value: number;

  /** Previous value */
  previousValue: number;

  /** All current values */
  allValues: Record<string, number>;

  /** Source of change */
  source: 'slider' | 'input' | 'preset' | 'reset' | 'import';

  /** Timestamp */
  timestamp: number;
}

/**
 * Event detail when preset is loaded
 */
export interface PresetLoadEvent {
  /** Preset name/ID */
  presetId: string;

  /** Preset configuration */
  preset: PresetConfiguration;

  /** Previous values before preset load */
  previousValues: Record<string, number>;

  /** Timestamp */
  timestamp: number;
}

/**
 * Event detail when configuration is exported
 */
export interface ConfigExportEvent {
  /** Exported configuration */
  config: ExportedConfig;

  /** Export format */
  format: 'json' | 'url';

  /** Timestamp */
  timestamp: number;
}

/**
 * Event detail when configuration is imported
 */
export interface ConfigImportEvent {
  /** Imported configuration */
  config: ExportedConfig;

  /** Previous values */
  previousValues: Record<string, number>;

  /** Timestamp */
  timestamp: number;
}

/**
 * Event detail when panel is reset
 */
export interface PanelResetEvent {
  /** Previous values before reset */
  previousValues: Record<string, number>;

  /** New values after reset */
  newValues: Record<string, number>;

  /** Timestamp */
  timestamp: number;
}

/**
 * Event detail when validation fails
 */
export interface ValidationErrorEvent {
  /** Parameter ID with error */
  parameterId: string;

  /** Error message */
  error: string;

  /** Current value */
  value: number;

  /** Timestamp */
  timestamp: number;
}

/**
 * Exported configuration format
 */
export interface ExportedConfig {
  /** Format version */
  version: string;

  /** Preset name if applicable */
  preset?: string;

  /** Parameter values */
  parameters: Record<string, number>;

  /** Metadata */
  metadata?: {
    /** Creation timestamp */
    created: string;

    /** Configuration name */
    name?: string;

    /** Description */
    description?: string;
  };
}
