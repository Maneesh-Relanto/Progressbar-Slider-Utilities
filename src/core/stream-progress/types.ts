/**
 * Configuration for StreamProgress component
 */
export interface StreamProgressConfig {
  /** Maximum tokens allowed */
  maxTokens?: number;
  /** Cost per token (for cost estimation) */
  costPerToken?: number;
  /** Currency symbol */
  currency?: string;
  /** Show tokens per second */
  showRate?: boolean;
  /** Show cost estimation */
  showCost?: boolean;
  /** Show progress bar */
  showProgressBar?: boolean;
  /** Show cancel button */
  showCancelButton?: boolean;
  /** Enable smooth progress animation */
  smoothProgress?: boolean;
  /** Update throttle in milliseconds */
  updateThrottle?: number;
  /** Custom cancel button label */
  cancelLabel?: string;
  /** Enable automatic cursor state changes based on component state */
  cursorFeedback?: boolean;
  /** Component size variant */
  size?: 'compact' | 'default' | 'large';
  /** Debug mode */
  debug?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Aria label */
  ariaLabel?: string;
}

/**
 * State for StreamProgress
 */
export interface StreamProgressState {
  tokensGenerated: number;
  tokensPerSecond: number;
  totalCost: number;
  isStreaming: boolean;
  isPaused: boolean;
  isCancelled: boolean;
  startTime: number;
  lastUpdateTime: number;
  message?: string;
}

/**
 * Event data for progress updates
 */
export interface StreamProgressUpdate {
  tokensGenerated: number;
  tokensPerSecond?: number;
  message?: string;
}

/**
 * Event data for stream completion
 */
export interface StreamCompleteEvent {
  tokensGenerated: number;
  duration: number;
  totalCost: number;
  averageRate: number;
}

/**
 * Event data for stream cancellation
 */
export interface StreamCancelEvent {
  tokensGenerated: number;
  duration: number;
  reason: 'user' | 'error' | 'timeout';
}
