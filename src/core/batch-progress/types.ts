/**
 * Status of a batch item
 */
export type BatchItemStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Individual batch item
 */
export interface BatchItem {
  id: string;
  label?: string;
  status: BatchItemStatus;
  progress?: number; // 0-100
  error?: string;
  result?: any;
  startTime?: number;
  endTime?: number;
}

/**
 * Configuration options for BatchProgress
 */
export interface BatchProgressConfig {
  /** Total number of items in batch */
  totalItems?: number;

  /** Maximum concurrent operations */
  concurrency?: number;

  /** Show individual item progress */
  showItems?: boolean;

  /** Maximum items to display */
  maxDisplayItems?: number;

  /** Show overall progress bar */
  showProgressBar?: boolean;

  /** Show statistics (success/fail counts) */
  showStats?: boolean;

  /** Show elapsed time */
  showTime?: boolean;

  /** Show processing rate (items/sec) */
  showRate?: boolean;

  /** Allow cancellation */
  allowCancel?: boolean;

  /** Cancel button label */
  cancelLabel?: string;

  /** Automatically collapse completed items */
  collapseCompleted?: boolean;

  /** Status message */
  message?: string;

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
 * Internal state of the BatchProgress
 */
export interface BatchProgressState {
  status: 'idle' | 'processing' | 'completed' | 'paused' | 'cancelled';
  items: Map<string, BatchItem>;
  totalItems: number;
  completedCount: number;
  failedCount: number;
  successCount: number;
  currentConcurrency: number;
  startTime: number | null;
  endTime: number | null;
  message: string;
}

/**
 * Update parameters for batch progress
 */
export interface BatchProgressUpdate {
  itemId: string;
  status?: BatchItemStatus;
  progress?: number;
  error?: string;
  result?: any;
  label?: string;
}

/**
 * Event detail for batch start
 */
export interface BatchStartEvent {
  totalItems: number;
  startTime: number;
}

/**
 * Event detail for batch item update
 */
export interface BatchItemUpdateEvent extends BatchItem {
  totalCompleted: number;
  totalFailed: number;
  overallProgress: number;
}

/**
 * Event detail for batch complete
 */
export interface BatchCompleteEvent {
  totalItems: number;
  successCount: number;
  failedCount: number;
  duration: number;
  averageRate: number;
  startTime: number;
  endTime: number;
}

/**
 * Event detail for batch cancel
 */
export interface BatchCancelEvent {
  completedCount: number;
  failedCount: number;
  cancelledCount: number;
  reason?: string;
}

/**
 * Event detail for batch item complete
 */
export interface BatchItemCompleteEvent {
  item: BatchItem;
  totalCompleted: number;
  remainingItems: number;
}

/**
 * Event detail for batch item failed
 */
export interface BatchItemFailedEvent {
  item: BatchItem;
  error: string;
  totalFailed: number;
}
