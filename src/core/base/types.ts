/**
 * Base configuration for all AI Progress Controls
 */
export interface AIControlConfig {
  /** Enable/disable console logging for debugging */
  debug?: boolean;
  /** Custom CSS class names to apply */
  className?: string;
  /** Whether the control is disabled */
  disabled?: boolean;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Theme configuration using CSS custom properties
 */
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
}

/**
 * Event detail for progress updates
 */
export interface ProgressUpdateEvent {
  current: number;
  total?: number;
  percentage?: number;
  message?: string;
}

/**
 * Event detail for errors
 */
export interface ErrorEvent {
  message: string;
  code?: string;
  timestamp: number;
}

/**
 * Event detail for completion
 */
export interface CompleteEvent {
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}
