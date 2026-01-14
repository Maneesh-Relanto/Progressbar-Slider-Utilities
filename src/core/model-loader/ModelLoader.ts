import { AIControl } from '../base/AIControl';
import { throttle, formatBytes } from '../base/utils';
import type {
  ModelLoaderConfig,
  ModelLoaderState,
  ModelStage,
  StageState,
  StageStatus,
  StageUpdate,
  StageChangeEvent,
  LoadCompleteEvent,
  LoadErrorEvent,
} from './types';
import { styles } from './styles';

/**
 * ModelLoader Component
 *
 * Displays multi-stage progress for AI model loading operations.
 * Shows download progress, initialization stages, memory usage, and ETA.
 *
 * @example
 * ```typescript
 * // Create the component
 * const loader = new ModelLoader({
 *   modelName: 'GPT-4 Vision',
 *   stages: ['download', 'load', 'initialize', 'ready'],
 *   showBytes: true,
 *   showMemoryUsage: true,
 *   showETA: true,
 * });
 *
 * document.body.appendChild(loader);
 *
 * // Start loading
 * loader.start();
 *
 * // Update download stage
 * loader.updateStage('download', {
 *   bytesLoaded: 50000000,
 *   totalBytes: 100000000,
 *   message: 'Downloading model weights...'
 * });
 *
 * // Move to next stage
 * loader.setStage('load', { message: 'Loading into memory...' });
 *
 * // Complete
 * loader.complete();
 *
 * // Listen to events
 * loader.addEventListener('stagechange', (e) => {
 *   console.log('Stage changed', e.detail);
 * });
 * ```
 *
 * @fires loadstart - Fired when loading starts
 * @fires stagechange - Fired when stage changes
 * @fires stageupdate - Fired when stage progress updates
 * @fires loadcomplete - Fired when loading completes
 * @fires loaderror - Fired when an error occurs
 */
export class ModelLoader extends AIControl {
  protected override config: Required<ModelLoaderConfig>;
  private state: ModelLoaderState;
  private readonly updateThrottled: (update: StageUpdate) => void;

  static get observedAttributes() {
    return ['model-name', 'disabled'];
  }

  constructor(config: ModelLoaderConfig = {}) {
    super({
      debug: config.debug ?? false,
      className: config.className,
      ariaLabel: config.ariaLabel ?? 'Model Loading Progress',
      cursorFeedback: config.cursorFeedback ?? true,
    });

    // Set default configuration
    this.config = {
      stages: config.stages ?? ['download', 'load', 'initialize', 'ready'],
      modelName: config.modelName ?? 'AI Model',
      showBytes: config.showBytes ?? true,
      showMemoryUsage: config.showMemoryUsage ?? true,
      showETA: config.showETA ?? true,
      showRetryButton: config.showRetryButton ?? true,
      smoothProgress: config.smoothProgress ?? true,
      updateThrottle: config.updateThrottle ?? 100,
      retryLabel: config.retryLabel ?? 'Retry',
      cursorFeedback: config.cursorFeedback ?? true,
      debug: config.debug ?? false,
      className: config.className ?? '',
      ariaLabel: config.ariaLabel ?? 'Model Loading Progress',
    };

    // Initialize state
    const initialStages: Record<ModelStage, StageState> = {
      download: { status: 'pending', progress: 0 },
      load: { status: 'pending', progress: 0 },
      initialize: { status: 'pending', progress: 0 },
      ready: { status: 'pending', progress: 0 },
    };

    this.state = {
      currentStage: this.config.stages[0]!,
      stages: initialStages,
      isLoading: false,
      hasError: false,
      startTime: 0,
    };

    // Create throttled update function
    this.updateThrottled = throttle(
      this._updateStageInternal.bind(this),
      this.config.updateThrottle
    );

    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.log('ModelLoader mounted');
  }

  protected override getDefaultRole(): string {
    return 'progressbar';
  }

  /**
   * Update cursor based on component state
   */
  private updateCursor(): void {
    if (!this.config.cursorFeedback) return;

    if (this.state.isLoading) {
      this.style.cursor = 'progress';
    } else if (this.state.hasError) {
      this.style.cursor = 'not-allowed';
    } else {
      this.style.cursor = 'default';
    }
  }

  protected override handleAttributeChange(
    name: string,
    _oldValue: string,
    newValue: string
  ): void {
    switch (name) {
      case 'model-name':
        this.config.modelName = newValue || 'AI Model';
        this.render();
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        this.render();
        break;
    }
  }

  /**
   * Start loading
   */
  public start(initialMessage?: string): void {
    if (this.state.isLoading) {
      this.log('Already loading');
      return;
    }

    // Reset all stages
    const resetStages: Record<ModelStage, StageState> = {
      download: { status: 'pending', progress: 0 },
      load: { status: 'pending', progress: 0 },
      initialize: { status: 'pending', progress: 0 },
      ready: { status: 'pending', progress: 0 },
    };

    // Set first stage to in-progress
    const firstStage = this.config.stages[0]!;
    resetStages[firstStage] = {
      status: 'in-progress',
      progress: 0,
      message: initialMessage,
      startTime: Date.now(),
    };

    this.state = {
      currentStage: firstStage,
      stages: resetStages,
      isLoading: true,
      hasError: false,
      startTime: Date.now(),
    };

    this.startTimer();
    this.render();
    this.updateCursor();
    this.emit('loadstart', { stage: firstStage, timestamp: Date.now() });
    this.log('Loading started', this.state);
  }

  /**
   * Update current stage progress
   */
  public updateStage(stage: ModelStage, update: Omit<StageUpdate, 'stage'>): void {
    if (!this.state.isLoading || this.state.hasError) {
      return;
    }

    this.updateThrottled({ stage, ...update });
  }

  private _updateStageInternal(update: StageUpdate): void {
    const { stage, progress, bytesLoaded, totalBytes, message, memoryUsage } = update;

    if (!this.state.stages[stage]) {
      this.logError(`Invalid stage: ${stage}`);
      return;
    }

    // Calculate progress if bytes are provided
    let calculatedProgress = progress;
    if (calculatedProgress === undefined && bytesLoaded !== undefined && totalBytes !== undefined) {
      calculatedProgress = this.calculatePercentage(bytesLoaded, totalBytes);
    }

    // Update stage state
    const currentStageState = this.state.stages[stage];
    const updatedStage: StageState = {
      ...currentStageState,
      progress: calculatedProgress ?? currentStageState.progress,
      message,
      bytesLoaded,
      totalBytes,
    };

    this.state = {
      ...this.state,
      stages: {
        ...this.state.stages,
        [stage]: updatedStage,
      },
      memoryUsage: memoryUsage ?? this.state.memoryUsage,
    };

    this.render();
    this.emit('stageupdate', { stage, ...updatedStage });
    this.log('Stage updated', stage, updatedStage);
  }

  /**
   * Move to a specific stage
   */
  public setStage(stage: ModelStage, options: { message?: string; progress?: number } = {}): void {
    if (!this.state.isLoading || this.state.hasError) {
      return;
    }

    if (!this.config.stages.includes(stage)) {
      this.logError(`Stage ${stage} not in configured stages`);
      return;
    }

    const previousStage = this.state.currentStage;

    // Mark previous stage as completed
    const prevStageState = this.state.stages[previousStage];
    this.state.stages[previousStage] = {
      ...prevStageState,
      status: 'completed',
      progress: 100,
      endTime: Date.now(),
    };

    // Set new stage as in-progress
    const newStageState = this.state.stages[stage];
    this.state.stages[stage] = {
      ...newStageState,
      status: 'in-progress',
      progress: options.progress ?? 0,
      message: options.message,
      startTime: Date.now(),
    };

    this.state = {
      ...this.state,
      currentStage: stage,
    };

    this.render();

    const event: StageChangeEvent = {
      previousStage,
      currentStage: stage,
      timestamp: Date.now(),
    };

    this.emit('stagechange', event);
    this.log('Stage changed', event);
  }

  /**
   * Mark current stage as completed and move to next
   */
  public completeStage(nextMessage?: string): void {
    const currentStageIndex = this.config.stages.indexOf(this.state.currentStage);
    const nextStage = this.config.stages[currentStageIndex + 1];

    if (!nextStage) {
      // No more stages, complete loading
      this.complete();
      return;
    }

    this.setStage(nextStage, { message: nextMessage });
  }

  /**
   * Complete loading
   */
  public complete(): void {
    if (!this.state.isLoading) {
      return;
    }

    const duration = this.getElapsedTime();

    // Mark all stages as completed
    const completedStages: Record<ModelStage, StageState> = { ...this.state.stages };
    this.config.stages.forEach((stage) => {
      const stageState = completedStages[stage];
      completedStages[stage] = {
        ...stageState,
        status: 'completed',
        progress: 100,
        endTime: stageState.endTime ?? Date.now(),
      };
    });

    this.state = {
      ...this.state,
      stages: completedStages,
      isLoading: false,
      currentStage: 'ready',
    };

    const event: LoadCompleteEvent = {
      duration,
      memoryUsage: this.state.memoryUsage,
      stages: this.state.stages,
    };

    this.render();
    this.updateCursor();
    this.emit('loadcomplete', event);
    this.log('Loading completed', event);
  }

  /**
   * Set error state
   */
  public error(message: string, stage?: ModelStage): void {
    const errorStage = stage ?? this.state.currentStage;
    const errorStageState = this.state.stages[errorStage];

    this.state = {
      ...this.state,
      hasError: true,
      errorMessage: message,
      isLoading: false,
      stages: {
        ...this.state.stages,
        [errorStage]: {
          ...errorStageState,
          status: 'error',
        },
      },
    };

    const event: LoadErrorEvent = {
      stage: errorStage,
      message,
      timestamp: Date.now(),
    };

    this.render();
    this.updateCursor();
    this.emit('loaderror', event);
    this.logError('Loading error', new Error(message));
  }

  /**
   * Retry loading from the beginning
   */
  public retry(): void {
    this.start();
    this.emit('loadretry', { timestamp: Date.now() });
    this.log('Retrying load');
  }

  /**
   * Reset the component
   */
  public reset(): void {
    const resetStages: Record<ModelStage, StageState> = {
      download: { status: 'pending', progress: 0 },
      load: { status: 'pending', progress: 0 },
      initialize: { status: 'pending', progress: 0 },
      ready: { status: 'pending', progress: 0 },
    };

    this.state = {
      currentStage: this.config.stages[0]!,
      stages: resetStages,
      isLoading: false,
      hasError: false,
      startTime: 0,
    };

    this.render();
    this.log('Component reset');
  }

  /**
   * Get status icon for a stage
   */
  private getStageIcon(status: StageStatus): string {
    switch (status) {
      case 'pending':
        return '○';
      case 'in-progress':
        return '◐';
      case 'completed':
        return '✓';
      case 'error':
        return '✕';
      default:
        return '○';
    }
  }

  /**
   * Calculate ETA for remaining stages
   */
  private calculateETA(): string {
    if (!this.state.isLoading || this.state.hasError) {
      return '--';
    }

    const elapsed = this.getElapsedTime();
    const currentStageIndex = this.config.stages.indexOf(this.state.currentStage);
    const totalStages = this.config.stages.length;
    const completedStages = currentStageIndex;
    const currentProgress = this.state.stages[this.state.currentStage]?.progress ?? 0;

    if (completedStages === 0 && currentProgress === 0) {
      return '--';
    }

    // Estimate based on completed stages + current progress
    const effectiveProgress = (completedStages + currentProgress / 100) / totalStages;

    if (effectiveProgress === 0) {
      return '--';
    }

    const estimatedTotal = elapsed / effectiveProgress;
    const remaining = estimatedTotal - elapsed;

    return this.formatDuration(Math.max(0, remaining));
  }

  /**
   * Get overall status for rendering
   */
  private getOverallStatus(): string {
    if (this.state.hasError) return 'error';
    if (this.state.isLoading) return 'loading';
    if (!this.state.isLoading && this.state.stages.ready?.status === 'completed')
      return 'completed';
    return 'idle';
  }

  /**
   * Get status badge text
   */
  private getStatusBadgeText(overallStatus: string): string {
    if (this.state.hasError) return 'Error';
    if (this.state.isLoading) return 'Loading';
    if (overallStatus === 'completed') return 'Ready';
    return 'Idle';
  }

  /**
   * Generate HTML for all stages
   */
  private generateStagesHtml(): string {
    return this.config.stages
      .map((stage) => {
        const stageState = this.state.stages[stage];
        if (!stageState) return '';

        const icon = this.getStageIcon(stageState.status);
        const progressText = `${Math.round(stageState.progress)}%`;
        const messageHtml = stageState.message
          ? `<div class="stage-message">${stageState.message}</div>`
          : '';

        return `
          <div class="stage ${stageState.status}">
            <div class="stage-header">
              <div class="stage-info">
                <div class="stage-icon ${stageState.status}">${icon}</div>
                <span class="stage-name">${stage}</span>
              </div>
              <span class="stage-progress-text">${progressText}</span>
            </div>
            ${messageHtml}
            <div class="progress-bar">
              <div class="progress-fill ${stageState.status === 'error' ? 'error' : ''}" style="width: ${stageState.progress}%"></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  /**
   * Generate HTML for stats section
   */
  private generateStatsHtml(): string {
    const statsItems = [];

    // Bytes (for download stage)
    if (this.config.showBytes && this.state.stages.download) {
      const { bytesLoaded, totalBytes } = this.state.stages.download;
      if (bytesLoaded !== undefined && totalBytes !== undefined) {
        statsItems.push(`
          <div class="stat-item">
            <span class="stat-label">Downloaded</span>
            <span class="stat-value">${formatBytes(bytesLoaded)} / ${formatBytes(totalBytes)}</span>
          </div>
        `);
      }
    }

    // Memory usage
    if (this.config.showMemoryUsage && this.state.memoryUsage !== undefined) {
      statsItems.push(`
        <div class="stat-item">
          <span class="stat-label">Memory</span>
          <span class="stat-value">${this.state.memoryUsage.toFixed(0)} MB</span>
        </div>
      `);
    }

    // ETA
    if (this.config.showETA && this.state.isLoading) {
      statsItems.push(`
        <div class="stat-item">
          <span class="stat-label">ETA</span>
          <span class="stat-value">${this.calculateETA()}</span>
        </div>
      `);
    }

    return statsItems.length > 0 ? `<div class="stats">${statsItems.join('')}</div>` : '';
  }

  /**
   * Render the component
   */
  protected render(): void {
    if (!this.shadowRoot) return;

    const overallStatus = this.getOverallStatus();
    const statusBadgeText = this.getStatusBadgeText(overallStatus);
    const stagesHtml = this.generateStagesHtml();
    const statsHtml = this.generateStatsHtml();

    // Error message
    const errorHtml = this.state.hasError
      ? `
        <div class="error-message">
          <div class="error-icon">⚠</div>
          <div class="error-text">${this.state.errorMessage}</div>
        </div>
      `
      : '';

    // Retry button
    const retryButtonHtml =
      this.config.showRetryButton && this.state.hasError
        ? `
        <button class="retry-button" aria-label="Retry loading">
          ${this.config.retryLabel}
        </button>
      `
        : '';

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="model-loader ${overallStatus} ${this.config.className}">
        <div class="header">
          <div class="model-name">${this.config.modelName}</div>
          <div class="status-badge ${overallStatus}">${statusBadgeText}</div>
        </div>
        <div class="stages">
          ${stagesHtml}
        </div>
        ${statsHtml}
        ${errorHtml}
        ${retryButtonHtml}
      </div>
    `;

    // Attach event listeners
    if (this.config.showRetryButton && this.state.hasError) {
      const retryBtn = this.shadowRoot.querySelector('.retry-button');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => this.retry());
      }
    }
  }

  /**
   * Get current state (for debugging/inspection)
   */
  public getState(): Readonly<ModelLoaderState> {
    return { ...this.state };
  }

  /**
   * Get current configuration
   */
  public getConfig(): Readonly<Required<ModelLoaderConfig>> {
    return { ...this.config };
  }
}

// Register the custom element
if (!customElements.get('model-loader')) {
  customElements.define('model-loader', ModelLoader);
}
