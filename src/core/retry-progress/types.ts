/**
 * Types for RetryProgress component
 */

/**
 * Retry status
 */
export type RetryStatus = 'idle' | 'attempting' | 'waiting' | 'success' | 'failed' | 'cancelled';

/**
 * Retry strategy for backoff calculation
 */
export type RetryStrategy = 'exponential' | 'linear' | 'fixed' | 'fibonacci';

/**
 * Configuration for RetryProgress component
 */
export interface RetryProgressConfig {
  /** Current attempt number (1-indexed) */
  attempt?: number;

  /** Maximum number of retry attempts */
  maxAttempts?: number;

  /** Initial delay in milliseconds */
  initialDelay?: number;

  /** Maximum delay in milliseconds */
  maxDelay?: number;

  /** Backoff multiplier for exponential strategy */
  backoffMultiplier?: number;

  /** Retry strategy */
  strategy?: RetryStrategy;

  /** Operation message */
  message?: string;

  /** Show attempt count */
  showAttemptCount?: boolean;

  /** Show next retry time */
  showNextRetry?: boolean;

  /** Show progress bar for wait time */
  showProgressBar?: boolean;

  /** Show elapsed time */
  showElapsedTime?: boolean;

  /** Enable manual retry button */
  allowManualRetry?: boolean;

  /** Enable cancel button */
  allowCancel?: boolean;

  /** Enable animations */
  animate?: boolean;

  /** Custom CSS class */
  className?: string;

  /** ARIA label for accessibility */
  ariaLabel?: string;

  /** Debug mode */
  debug?: boolean;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Internal state for RetryProgress
 */
export interface RetryProgressState {
  status: RetryStatus;
  attempt: number;
  maxAttempts: number;
  currentDelay: number;
  nextRetryTime: number;
  startTime: number;
  elapsedTime: number;
  message: string;
  errorMessage?: string;
  lastError?: Error;
}

/**
 * Data for retry attempt updates
 */
export interface RetryAttemptUpdate {
  /** New attempt number */
  attempt?: number;

  /** Operation message */
  message?: string;

  /** Error from last attempt */
  error?: Error;

  /** Override calculated delay (ms) */
  delay?: number;
}

/**
 * Event detail for retry attempt start
 */
export interface RetryAttemptEvent {
  attempt: number;
  maxAttempts: number;
  message: string;
  timestamp: number;
}

/**
 * Event detail for retry waiting period
 */
export interface RetryWaitingEvent {
  attempt: number;
  delay: number;
  nextRetryTime: number;
  strategy: RetryStrategy;
  timestamp: number;
}

/**
 * Event detail for retry success
 */
export interface RetrySuccessEvent {
  attempt: number;
  totalAttempts: number;
  elapsedTime: number;
  message: string;
  timestamp: number;
}

/**
 * Event detail for retry failure (max attempts reached)
 */
export interface RetryFailureEvent {
  totalAttempts: number;
  lastError?: Error;
  elapsedTime: number;
  timestamp: number;
}

/**
 * Event detail for retry cancellation
 */
export interface RetryCancelEvent {
  attempt: number;
  reason?: string;
  timestamp: number;
}

/**
 * Event detail for manual retry trigger
 */
export interface ManualRetryEvent {
  attempt: number;
  timestamp: number;
}
