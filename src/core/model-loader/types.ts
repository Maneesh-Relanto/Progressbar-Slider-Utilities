/**
 * Loading stages for model initialization
 */
export type ModelStage = 'download' | 'load' | 'initialize' | 'ready';

/**
 * Status of each stage
 */
export type StageStatus = 'pending' | 'in-progress' | 'completed' | 'error';

/**
 * Configuration for ModelLoader component
 */
export interface ModelLoaderConfig {
  /** Stages to show (default: all) */
  stages?: ModelStage[];

  /** Model name to display */
  modelName?: string;

  /** Show bytes downloaded/total */
  showBytes?: boolean;

  /** Show memory usage */
  showMemoryUsage?: boolean;

  /** Show estimated time remaining */
  showETA?: boolean;

  /** Show retry button on error */
  showRetryButton?: boolean;

  /** Enable smooth progress animation */
  smoothProgress?: boolean;

  /** Update throttle in milliseconds */
  updateThrottle?: number;

  /** Custom retry button label */
  retryLabel?: string;

  /** Debug mode */
  debug?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Aria label */
  ariaLabel?: string;
}

/**
 * State for each stage
 */
export interface StageState {
  status: StageStatus;
  progress: number; // 0-100
  message?: string;
  bytesLoaded?: number;
  totalBytes?: number;
  startTime?: number;
  endTime?: number;
}

/**
 * Overall ModelLoader state
 */
export interface ModelLoaderState {
  currentStage: ModelStage;
  stages: Record<ModelStage, StageState>;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  memoryUsage?: number; // in MB
  startTime: number;
}

/**
 * Update data for a stage
 */
export interface StageUpdate {
  stage: ModelStage;
  progress?: number; // 0-100
  bytesLoaded?: number;
  totalBytes?: number;
  message?: string;
  memoryUsage?: number;
}

/**
 * Event data for stage change
 */
export interface StageChangeEvent {
  previousStage: ModelStage;
  currentStage: ModelStage;
  timestamp: number;
}

/**
 * Event data for completion
 */
export interface LoadCompleteEvent {
  duration: number;
  memoryUsage?: number;
  stages: Record<ModelStage, StageState>;
}

/**
 * Event data for error
 */
export interface LoadErrorEvent {
  stage: ModelStage;
  message: string;
  timestamp: number;
}
