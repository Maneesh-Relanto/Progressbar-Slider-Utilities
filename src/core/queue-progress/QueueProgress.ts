import { AIControl } from '../base/AIControl';
import { throttle, formatTime } from '../base/utils';
import type {
  QueueProgressConfig,
  QueueProgressState,
  QueueStatus,
  QueueUpdate,
  PositionChangeEvent,
  QueueStartEvent,
  QueueCompleteEvent,
  QueueErrorEvent,
} from './types';
import { styles } from './styles';

/**
 * QueueProgress Component
 * 
 * Displays queue position and estimated wait time for rate-limited AI APIs.
 * Shows position updates, processing rate, and estimated wait time.
 * 
 * @example
 * ```typescript
 * // Create the component
 * const queue = new QueueProgress({
 *   position: 47,
 *   queueSize: 120,
 *   estimatedWait: 180, // 3 minutes
 *   processingRate: 3, // 3 requests per second
 * });
 * 
 * document.body.appendChild(queue);
 * 
 * // Start tracking
 * queue.start();
 * 
 * // Update position
 * queue.update({
 *   position: 25,
 *   estimatedWait: 90
 * });
 * 
 * // Complete
 * queue.complete();
 * 
 * // Listen to events
 * queue.addEventListener('positionchange', (e) => {
 *   console.log('Position changed', e.detail);
 * });
 * ```
 * 
 * @fires queuestart - Fired when queue tracking starts
 * @fires positionchange - Fired when position updates
 * @fires queuecomplete - Fired when processing begins
 * @fires queueerror - Fired when an error occurs
 */
export class QueueProgress extends AIControl {
  protected override config: Required<QueueProgressConfig>;
  private state: QueueProgressState;
  private readonly updateThrottled: (update: QueueUpdate) => void;
  private timerInterval: ReturnType<typeof setInterval> | undefined;
  private initialPosition: number = 0;

  static get observedAttributes() {
    return ['position', 'queue-size', 'disabled'];
  }

  constructor(config: QueueProgressConfig = {}) {
    super({
      debug: config.debug ?? false,
      className: config.className,
      ariaLabel: config.ariaLabel ?? 'Queue Progress',
    });

    // Set default configuration
    this.config = {
      position: config.position ?? 0,
      queueSize: config.queueSize ?? 0,
      estimatedWait: config.estimatedWait ?? 0,
      processingRate: config.processingRate ?? 1,
      showPosition: config.showPosition ?? true,
      showWaitTime: config.showWaitTime ?? true,
      showRate: config.showRate ?? true,
      showQueueSize: config.showQueueSize ?? true,
      showProgressBar: config.showProgressBar ?? true,
      message: config.message ?? 'You are in the queue',
      animate: config.animate ?? true,
      updateThrottle: config.updateThrottle ?? 100,
      debug: config.debug ?? false,
      className: config.className ?? '',
      ariaLabel: config.ariaLabel ?? 'Queue Progress',
    };

    // Initialize state
    this.state = {
      status: 'waiting',
      position: this.config.position,
      queueSize: this.config.queueSize,
      estimatedWait: this.config.estimatedWait,
      processingRate: this.config.processingRate,
      startTime: 0,
      message: this.config.message,
      elapsedTime: 0,
    };

    this.initialPosition = this.config.position;

    // Create throttled update function
    this.updateThrottled = throttle(
      this._updateInternal.bind(this),
      this.config.updateThrottle
    );

    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.log('QueueProgress mounted');
  }

  override disconnectedCallback(): void {
    this.stopTimer();
    super.disconnectedCallback();
  }

  protected override getDefaultRole(): string {
    return 'status';
  }

  protected override handleAttributeChange(name: string, _oldValue: string, newValue: string): void {
    switch (name) {
      case 'position':
        this.update({ position: Number.parseInt(newValue, 10) || 0 });
        break;
      case 'queue-size':
        this.update({ queueSize: Number.parseInt(newValue, 10) || 0 });
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        this.render();
        break;
    }
  }

  /**
   * Start queue tracking
   */
  public start(message?: string): void {
    this.state = {
      ...this.state,
      status: 'waiting',
      startTime: Date.now(),
      elapsedTime: 0,
      message: message || this.config.message,
    };

    this.initialPosition = this.state.position;
    this.startTimer();
    this.render();
    this.emit('queuestart', {
      position: this.state.position,
      queueSize: this.state.queueSize,
      estimatedWait: this.state.estimatedWait,
      timestamp: Date.now(),
    } as QueueStartEvent);
    this.log('Queue tracking started', this.state);
  }

  /**
   * Update queue position
   */
  public update(update: QueueUpdate): void {
    if (this.state.status === 'completed' || this.state.status === 'error') {
      return;
    }

    this.updateThrottled(update);
  }

  private _updateInternal(update: QueueUpdate): void {
    const previousPosition = this.state.position;

    this.state = {
      ...this.state,
      position: update.position ?? this.state.position,
      queueSize: update.queueSize ?? this.state.queueSize,
      estimatedWait: update.estimatedWait ?? this.state.estimatedWait,
      processingRate: update.processingRate ?? this.state.processingRate,
      message: update.message ?? this.state.message,
    };

    // Animate position number if changed
    if (update.position !== undefined && update.position !== previousPosition) {
      const positionEl = this.shadowRoot?.querySelector('.position-number');
      if (positionEl && this.config.animate) {
        positionEl.classList.add('changing');
        setTimeout(() => positionEl.classList.remove('changing'), 500);
      }

      this.emit('positionchange', {
        previousPosition,
        currentPosition: this.state.position,
        queueSize: this.state.queueSize,
        estimatedWait: this.state.estimatedWait,
        timestamp: Date.now(),
      } as PositionChangeEvent);
    }

    this.render();
    this.log('Position updated', this.state);
  }

  /**
   * Mark as processing (reached front of queue)
   */
  public complete(): void {
    this.state = {
      ...this.state,
      status: 'completed',
      position: 0,
    };

    this.stopTimer();
    this.render();

    const totalWaitTime = this.state.startTime > 0 ? Date.now() - this.state.startTime : 0;

    this.emit('queuecomplete', {
      totalWaitTime,
      startPosition: this.initialPosition,
      timestamp: Date.now(),
    } as QueueCompleteEvent);

    this.log('Queue completed', { totalWaitTime });
  }

  /**
   * Cancel queue
   */
  public cancel(reason: string = 'Cancelled by user'): void {
    this.state = {
      ...this.state,
      status: 'cancelled',
      message: reason,
    };

    this.stopTimer();
    this.render();
    this.log('Queue cancelled', reason);
  }

  /**
   * Handle error
   */
  public error(errorMessage: string): void {
    this.state = {
      ...this.state,
      status: 'error',
      message: errorMessage,
    };

    this.stopTimer();
    this.render();

    this.emit('queueerror', {
      message: errorMessage,
      position: this.state.position,
      timestamp: Date.now(),
    } as QueueErrorEvent);

    this.logError('Queue error', new Error(errorMessage));
  }

  /**
   * Reset to initial state
   */
  public reset(): void {
    this.stopTimer();
    
    this.state = {
      status: 'waiting',
      position: this.config.position,
      queueSize: this.config.queueSize,
      estimatedWait: this.config.estimatedWait,
      processingRate: this.config.processingRate,
      startTime: 0,
      message: this.config.message,
      elapsedTime: 0,
    };

    this.initialPosition = this.config.position;
    this.render();
    this.log('Queue reset');
  }

  /**
   * Get current position
   */
  public getPosition(): number {
    return this.state.position;
  }

  /**
   * Get current status
   */
  public getStatus(): QueueStatus {
    return this.state.status;
  }

  /**
   * Start elapsed time timer
   */
  protected override startTimer(): void {
    this.stopTimer();
    this.timerInterval = globalThis.setInterval(() => {
      if (this.state.startTime > 0) {
        this.state.elapsedTime = Date.now() - this.state.startTime;
        this.render();
      }
    }, 1000);
  }

  /**
   * Stop timer
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  /**
   * Calculate progress percentage
   */
  private getProgressPercentage(): number {
    if (this.state.queueSize === 0 || this.initialPosition === 0) return 0;
    const processed = this.initialPosition - this.state.position;
    return Math.min(100, Math.max(0, (processed / this.initialPosition) * 100));
  }

  /**
   * Render metrics section
   */
  private renderMetrics(): string {
    if (this.state.status !== 'waiting') return '';
    
    let metricsHtml = '';
    
    if (this.config.showQueueSize) {
      metricsHtml += `
        <div class="metric">
          <div class="metric-value">${this.state.queueSize}</div>
          <div class="metric-label">Queue Size</div>
        </div>
      `;
    }
    
    if (this.config.showWaitTime) {
      metricsHtml += `
        <div class="metric">
          <div class="metric-value">${formatTime(Math.round(this.state.estimatedWait))}</div>
          <div class="metric-label">Est. Wait</div>
        </div>
      `;
    }
    
    if (this.config.showRate) {
      metricsHtml += `
        <div class="metric">
          <div class="metric-value">${this.state.processingRate.toFixed(1)}/s</div>
          <div class="metric-label">Processing Rate</div>
        </div>
      `;
    }
    
    return metricsHtml ? `
      <div class="queue-metrics">
        ${metricsHtml}
      </div>
    ` : '';
  }

  /**
   * Render component
   */
  protected override render(): void {
    if (!this.shadowRoot) return;

    const progress = this.getProgressPercentage();
    const statusClass = this.state.status;
    const statusText = this.getStatusText();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="queue-container">
        <div class="queue-header">
          <div class="queue-icon">${this.getStatusIcon()}</div>
          <div class="queue-title">
            <h3 class="queue-status">${statusText}</h3>
            <p class="queue-message">${this.state.message || ''}</p>
          </div>
          <span class="queue-badge ${statusClass}">${this.state.status}</span>
        </div>

        ${this.config.showPosition && this.state.status === 'waiting' ? `
          <div class="queue-position">
            <div class="position-number">${this.state.position}</div>
            <div class="position-label">Position in Queue</div>
          </div>
        ` : ''}

        ${this.renderMetrics()}

        ${this.config.showProgressBar && this.state.status === 'waiting' && this.initialPosition > 0 ? `
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-label">
              <span>${Math.round(progress)}% through queue</span>
              <span>${formatTime(Math.round(this.state.elapsedTime / 1000))} elapsed</span>
            </div>
          </div>
        ` : ''}

        ${this.state.status === 'waiting' && this.state.position <= 5 ? `
          <div class="queue-info">
            <span class="info-icon">🎯</span>
            <p class="info-text">You're almost there! Processing will begin shortly.</p>
          </div>
        ` : ''}

        ${this.state.status === 'completed' ? `
          <div class="queue-info">
            <span class="info-icon">✅</span>
            <p class="info-text">Your request is now being processed!</p>
          </div>
        ` : ''}

        ${this.state.status === 'error' ? `
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <p class="error-text">${this.state.message}</p>
          </div>
        ` : ''}
      </div>
    `;

    // Update ARIA attributes
    this.setAttribute('aria-valuenow', this.state.position.toString());
    this.setAttribute('aria-valuetext', `Position ${this.state.position} in queue`);
  }

  private getStatusIcon(): string {
    switch (this.state.status) {
      case 'waiting': return '⏳';
      case 'processing': return '⚙️';
      case 'completed': return '✅';
      case 'cancelled': return '🚫';
      case 'error': return '❌';
      default: return '⏳';
    }
  }

  private getStatusText(): string {
    switch (this.state.status) {
      case 'waiting': return 'Waiting in Queue';
      case 'processing': return 'Processing Your Request';
      case 'completed': return 'Processing Started';
      case 'cancelled': return 'Queue Cancelled';
      case 'error': return 'Queue Error';
      default: return 'Queue Status';
    }
  }
}

// Register the custom element
if (!customElements.get('queue-progress')) {
  customElements.define('queue-progress', QueueProgress);
}
