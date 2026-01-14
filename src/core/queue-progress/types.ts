/**
 * Queue status types
 */
export type QueueStatus = 'waiting' | 'processing' | 'completed' | 'cancelled' | 'error';

/**
 * Configuration for QueueProgress component
 */
export interface QueueProgressConfig {
  /** Initial position in queue */
  position?: number;

  /** Total queue size */
  queueSize?: number;

  /** Estimated wait time in seconds */
  estimatedWait?: number;

  /** Processing rate (items per second) */
  processingRate?: number;

  /** Show position counter */
  showPosition?: boolean;

  /** Show estimated wait time */
  showWaitTime?: boolean;

  /** Show processing rate */
  showRate?: boolean;

  /** Show queue size */
  showQueueSize?: boolean;

  /** Show visual progress bar */
  showProgressBar?: boolean;

  /** Custom message */
  message?: string;

  /** Enable animations */
  animate?: boolean;

  /** Update throttle in milliseconds */
  updateThrottle?: number;

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
 * QueueProgress state
 */
export interface QueueProgressState {
  status: QueueStatus;
  position: number;
  queueSize: number;
  estimatedWait: number;
  processingRate: number;
  startTime: number;
  message?: string;
  elapsedTime: number;
}

/**
 * Update data for queue position
 */
export interface QueueUpdate {
  position?: number;
  queueSize?: number;
  estimatedWait?: number;
  processingRate?: number;
  message?: string;
}

/**
 * Event data for position change
 */
export interface PositionChangeEvent {
  previousPosition: number;
  currentPosition: number;
  queueSize: number;
  estimatedWait: number;
  timestamp: number;
}

/**
 * Event data for queue start
 */
export interface QueueStartEvent {
  position: number;
  queueSize: number;
  estimatedWait: number;
  timestamp: number;
}

/**
 * Event data for queue complete
 */
export interface QueueCompleteEvent {
  totalWaitTime: number;
  startPosition: number;
  timestamp: number;
}

/**
 * Event data for queue error
 */
export interface QueueErrorEvent {
  message: string;
  position: number;
  timestamp: number;
}
