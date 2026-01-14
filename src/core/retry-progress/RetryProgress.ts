import { AIControl } from '../base/AIControl';
import { formatTime } from '../base/utils';
import type {
  RetryProgressConfig,
  RetryProgressState,
  RetryAttemptUpdate,
  RetryStatus,
} from './types';
import { styles } from './styles';

/**
 * RetryProgress Component
 *
 * Displays retry progress with exponential backoff, attempt tracking, and error handling.
 * Perfect for handling transient failures in API calls, network requests, or AI operations.
 *
 * @example
 * ```typescript
 * // Create the component
 * const retry = new RetryProgress({
 *   maxAttempts: 5,
 *   initialDelay: 1000,
 *   strategy: 'exponential',
 *   allowManualRetry: true,
 * });
 *
 * document.body.appendChild(retry);
 *
 * // Start first attempt
 * retry.attempt('Connecting to API...');
 *
 * // If it fails, start waiting for retry
 * retry.waitForRetry({
 *   attempt: 2,
 *   error: new Error('Connection timeout'),
 * });
 *
 * // On success
 * retry.success('Connected successfully!');
 *
 * // Listen to events
 * retry.addEventListener('retryattempt', (e) => {
 *   console.log('Attempting:', e.detail);
 * });
 * ```
 *
 * @fires retryattempt - Fired when a retry attempt starts
 * @fires retrywaiting - Fired when waiting for next retry
 * @fires retrysuccess - Fired when operation succeeds
 * @fires retryfailure - Fired when max attempts reached
 * @fires retrycancel - Fired when retry is cancelled
 * @fires manualretry - Fired when user manually triggers retry
 */
export class RetryProgress extends AIControl {
  protected override config: Required<RetryProgressConfig>;
  private state: RetryProgressState;
  private waitTimer?: ReturnType<typeof setTimeout>;
  private elapsedTimer?: ReturnType<typeof setInterval>;
  private progressTimer?: ReturnType<typeof setInterval>;

  constructor(config: RetryProgressConfig = {}) {
    super(config);

    this.config = {
      attempt: config.attempt ?? 1,
      maxAttempts: config.maxAttempts ?? 3,
      initialDelay: config.initialDelay ?? 1000,
      maxDelay: config.maxDelay ?? 30000,
      backoffMultiplier: config.backoffMultiplier ?? 2,
      strategy: config.strategy ?? 'exponential',
      message: config.message ?? 'Retrying operation...',
      showAttemptCount: config.showAttemptCount ?? true,
      showNextRetry: config.showNextRetry ?? true,
      showProgressBar: config.showProgressBar ?? true,
      showElapsedTime: config.showElapsedTime ?? true,
      allowManualRetry: config.allowManualRetry ?? false,
      allowCancel: config.allowCancel ?? true,
      animate: config.animate ?? true,
      className: config.className ?? '',
      ariaLabel: config.ariaLabel ?? 'Retry Progress',
      cursorFeedback: config.cursorFeedback ?? true,
      debug: config.debug ?? false,
      disabled: config.disabled ?? false,
      size: config.size ?? 'default',
      variant: config.variant ?? 'default',
      animation: config.animation ?? 'none',
    };

    this.state = {
      status: 'idle',
      attempt: this.config.attempt,
      maxAttempts: this.config.maxAttempts,
      currentDelay: this.config.initialDelay,
      nextRetryTime: 0,
      startTime: 0,
      elapsedTime: 0,
      message: this.config.message,
    };

    this.attachShadow({ mode: 'open' });
  }

  /**
   * Read max-attempts attribute
   */
  private _readMaxAttemptsAttribute(): void {
    if (!this.hasAttribute('max-attempts')) return;

    const val = Number.parseInt(this.getAttribute('max-attempts') || '', 10);
    if (!Number.isNaN(val)) {
      this.config.maxAttempts = val;
      this.state.maxAttempts = val;
    }
  }

  /**
   * Read initial-delay attribute
   */
  private _readInitialDelayAttribute(): void {
    if (!this.hasAttribute('initial-delay')) return;

    const val = Number.parseInt(this.getAttribute('initial-delay') || '', 10);
    if (!Number.isNaN(val)) {
      this.config.initialDelay = val;
    }
  }

  /**
   * Read max-delay attribute
   */
  private _readMaxDelayAttribute(): void {
    if (!this.hasAttribute('max-delay')) return;

    const val = Number.parseInt(this.getAttribute('max-delay') || '', 10);
    if (!Number.isNaN(val)) {
      this.config.maxDelay = val;
    }
  }

  /**
   * Read backoff-multiplier attribute
   */
  private _readBackoffMultiplierAttribute(): void {
    if (!this.hasAttribute('backoff-multiplier')) return;

    const val = Number.parseFloat(this.getAttribute('backoff-multiplier') || '');
    if (!Number.isNaN(val)) {
      this.config.backoffMultiplier = val;
    }
  }

  /**
   * Read strategy attribute
   */
  private _readStrategyAttribute(): void {
    if (!this.hasAttribute('strategy')) return;

    const strategy = this.getAttribute('strategy') as RetryStatus;
    if (['exponential', 'linear', 'fixed', 'fibonacci'].includes(strategy)) {
      this.config.strategy = strategy as any;
    }
  }

  /**
   * Read boolean attributes
   */
  private _readBooleanAttributes(): void {
    if (this.hasAttribute('allow-manual-retry')) {
      this.config.allowManualRetry = this.getAttribute('allow-manual-retry') === 'true';
    }
    if (this.hasAttribute('allow-cancel')) {
      this.config.allowCancel = this.getAttribute('allow-cancel') === 'true';
    }
    if (this.hasAttribute('show-attempt-count')) {
      this.config.showAttemptCount = this.getAttribute('show-attempt-count') === 'true';
    }
    if (this.hasAttribute('show-progress-bar')) {
      this.config.showProgressBar = this.getAttribute('show-progress-bar') === 'true';
    }
  }

  /**
   * Connected callback - read initial attributes
   */
  override connectedCallback(): void {
    super.connectedCallback();

    this._readMaxAttemptsAttribute();
    this._readInitialDelayAttribute();
    this._readMaxDelayAttribute();
    this._readBackoffMultiplierAttribute();
    this._readStrategyAttribute();
    this._readBooleanAttributes();

    this.render();
  }

  /**
   * Calculate delay for retry attempt based on strategy
   */
  private calculateDelay(attempt: number): number {
    const { strategy, initialDelay, backoffMultiplier, maxDelay } = this.config;

    let delay: number;

    switch (strategy) {
      case 'exponential':
        delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
        break;

      case 'linear':
        delay = initialDelay * attempt;
        break;

      case 'fibonacci':
        delay = initialDelay * this.fibonacci(attempt);
        break;

      case 'fixed':
      default:
        delay = initialDelay;
        break;
    }

    return Math.min(delay, maxDelay);
  }

  /**
   * Calculate fibonacci number
   */
  private fibonacci(n: number): number {
    if (n <= 1) return 1;
    let a = 1,
      b = 1;
    for (let i = 2; i < n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  /**
   * Start a retry attempt
   */
  public attempt(message?: string): void {
    this.stopTimers();

    const attemptMessage = message || `Attempt ${this.state.attempt} of ${this.state.maxAttempts}`;

    this.setState({
      status: 'attempting',
      message: attemptMessage,
      startTime: this.state.startTime || Date.now(),
    });

    this.startElapsedTimer();

    this.dispatchEvent(
      new CustomEvent('retryattempt', {
        detail: {
          attempt: this.state.attempt,
          maxAttempts: this.state.maxAttempts,
          message: attemptMessage,
          timestamp: Date.now(),
        },
      })
    );

    this.log(`Retry attempt ${this.state.attempt}/${this.state.maxAttempts}: ${attemptMessage}`);
  }

  /**
   * Wait for next retry with optional error
   */
  public waitForRetry(update: RetryAttemptUpdate = {}): void {
    const nextAttempt = update.attempt ?? this.state.attempt + 1;

    if (nextAttempt > this.state.maxAttempts) {
      this.failure(update.error);
      return;
    }

    const delay = update.delay ?? this.calculateDelay(nextAttempt);
    const nextRetryTime = Date.now() + delay;

    this.setState({
      status: 'waiting',
      attempt: nextAttempt,
      currentDelay: delay,
      nextRetryTime,
      message: update.message || `Retrying in ${formatTime(Math.ceil(delay / 1000))}...`,
      errorMessage: update.error?.message,
      lastError: update.error,
    });

    this.startWaitTimer(delay);
    this.startProgressTimer(delay);

    this.dispatchEvent(
      new CustomEvent('retrywaiting', {
        detail: {
          attempt: nextAttempt,
          delay,
          nextRetryTime,
          strategy: this.config.strategy,
          timestamp: Date.now(),
        },
      })
    );

    this.log(`Waiting ${delay}ms before retry ${nextAttempt}/${this.state.maxAttempts}`);
  }

  /**
   * Mark operation as successful
   */
  public success(message?: string): void {
    this.stopTimers();

    const successMessage = message || 'Operation successful!';

    this.setState({
      status: 'success',
      message: successMessage,
    });

    this.dispatchEvent(
      new CustomEvent('retrysuccess', {
        detail: {
          attempt: this.state.attempt,
          totalAttempts: this.state.attempt,
          elapsedTime: this.state.elapsedTime,
          message: successMessage,
          timestamp: Date.now(),
        },
      })
    );

    this.log(`Success after ${this.state.attempt} attempts (${this.state.elapsedTime}ms)`);
  }

  /**
   * Mark operation as failed (max attempts reached)
   */
  public failure(error?: Error): void {
    this.stopTimers();

    this.setState({
      status: 'failed',
      message: 'Maximum retry attempts reached',
      errorMessage: error?.message || 'Operation failed',
      lastError: error,
    });

    this.dispatchEvent(
      new CustomEvent('retryfailure', {
        detail: {
          totalAttempts: this.state.attempt,
          lastError: error,
          elapsedTime: this.state.elapsedTime,
          timestamp: Date.now(),
        },
      })
    );

    this.logError('Retry failed', error || new Error('Maximum attempts reached'));
  }

  /**
   * Cancel retry operation
   */
  public cancel(reason?: string): void {
    this.stopTimers();

    this.setState({
      status: 'cancelled',
      message: reason || 'Operation cancelled',
    });

    this.dispatchEvent(
      new CustomEvent('retrycancel', {
        detail: {
          attempt: this.state.attempt,
          reason,
          timestamp: Date.now(),
        },
      })
    );

    this.log(`Retry cancelled: ${reason || 'User cancelled'}`);
  }

  /**
   * Reset to initial state
   */
  public reset(): void {
    this.stopTimers();

    this.state = {
      status: 'idle',
      attempt: this.config.attempt,
      maxAttempts: this.config.maxAttempts,
      currentDelay: this.config.initialDelay,
      nextRetryTime: 0,
      startTime: 0,
      elapsedTime: 0,
      message: this.config.message,
    };

    this.render();
    this.log('Reset to initial state');
  }

  /**
   * Get current attempt number
   */
  public getAttempt(): number {
    return this.state.attempt;
  }

  /**
   * Get current status
   */
  public getStatus(): RetryStatus {
    return this.state.status;
  }

  /**
   * Get time until next retry (ms)
   */
  public getTimeUntilRetry(): number {
    if (this.state.status !== 'waiting') return 0;
    return Math.max(0, this.state.nextRetryTime - Date.now());
  }

  /**
   * Start elapsed time timer
   */
  private startElapsedTimer(): void {
    this.elapsedTimer = globalThis.setInterval(() => {
      if (this.state.startTime > 0) {
        this.state.elapsedTime = Date.now() - this.state.startTime;
        this.render();
      }
    }, 1000);
  }

  /**
   * Start wait timer for automatic retry
   */
  private startWaitTimer(delay: number): void {
    this.waitTimer = globalThis.setTimeout(() => {
      if (this.state.status === 'waiting') {
        this.attempt();
      }
    }, delay);
  }

  /**
   * Start progress bar timer
   */
  private startProgressTimer(_totalDelay: number): void {
    this.progressTimer = globalThis.setInterval(() => {
      if (this.state.status === 'waiting') {
        const remaining = Math.max(0, this.state.nextRetryTime - Date.now());
        this.state.message = `Retrying in ${formatTime(Math.ceil(remaining / 1000))}...`;
        this.render();
      }
    }, 100);
  }

  /**
   * Stop all timers
   */
  private stopTimers(): void {
    if (this.waitTimer) {
      globalThis.clearTimeout(this.waitTimer);
      this.waitTimer = undefined;
    }
    if (this.elapsedTimer) {
      globalThis.clearInterval(this.elapsedTimer);
      this.elapsedTimer = undefined;
    }
    if (this.progressTimer) {
      globalThis.clearInterval(this.progressTimer);
      this.progressTimer = undefined;
    }
  }

  /**
   * Handle manual retry button click
   */
  private handleManualRetry(): void {
    if (this.state.status !== 'waiting' && this.state.status !== 'failed') return;

    this.dispatchEvent(
      new CustomEvent('manualretry', {
        detail: {
          attempt: this.state.attempt,
          timestamp: Date.now(),
        },
      })
    );

    this.attempt();
  }

  /**
   * Handle cancel button click
   */
  private handleCancel(): void {
    this.cancel('User cancelled operation');
  }

  /**
   * Update state and re-render
   */
  private setState(update: Partial<RetryProgressState>): void {
    Object.assign(this.state, update);
    this.render();
    this.updateCursor();

    // Update ARIA attributes
    const progress = ((this.state.attempt / this.state.maxAttempts) * 100).toFixed(0);
    this.setAttribute('aria-valuenow', this.state.attempt.toString());
    this.setAttribute('aria-valuemax', this.state.maxAttempts.toString());
    this.setAttribute(
      'aria-valuetext',
      `Attempt ${this.state.attempt} of ${this.state.maxAttempts}, ${progress}% complete`
    );
  }

  /**
   * Update cursor based on retry state
   */
  private updateCursor(): void {
    if (!this.config.cursorFeedback) return;

    if (this.state.status === 'attempting') {
      this.style.cursor = 'progress';
    } else if (this.state.status === 'waiting') {
      this.style.cursor = 'wait';
    } else if (this.state.status === 'failed' || this.state.status === 'cancelled') {
      this.style.cursor = 'not-allowed';
    } else {
      this.style.cursor = 'default';
    }
  }

  /**
   * Get status icon
   */
  private getStatusIcon(): string {
    switch (this.state.status) {
      case 'attempting':
        return '🔄';
      case 'waiting':
        return '⏳';
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '⏸️';
    }
  }

  /**
   * Get status text
   */
  private getStatusText(): string {
    switch (this.state.status) {
      case 'attempting':
        return 'Attempting';
      case 'waiting':
        return 'Waiting';
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Idle';
    }
  }

  /**
   * Calculate progress percentage
   */
  private getProgressPercentage(): number {
    if (this.state.status !== 'waiting') return 0;

    const elapsed = Date.now() - (this.state.nextRetryTime - this.state.currentDelay);
    return Math.min(100, (elapsed / this.state.currentDelay) * 100);
  }

  /**
   * Render success message
   */
  private renderSuccessMessage(status: RetryStatus, attempt: number): string {
    if (status !== 'success') return '';

    const attemptText = attempt > 1 ? 's' : '';
    return `
      <div class="success-message">
        <div class="success-icon">🎉</div>
        <div class="success-text">Success!</div>
        <div class="success-details">Completed in ${attempt} attempt${attemptText}</div>
      </div>
    `;
  }

  /**
   * Render action buttons
   */
  private renderActions(
    status: RetryStatus,
    allowManualRetry: boolean,
    allowCancel: boolean,
    disabled: boolean
  ): string {
    if (status === 'success' || (!allowManualRetry && !allowCancel)) return '';

    const showRetryButton = allowManualRetry && (status === 'waiting' || status === 'failed');
    const showCancelButton = allowCancel && status !== 'cancelled' && status !== 'failed';

    if (!showRetryButton && !showCancelButton) return '';

    const retryButtonText = status === 'failed' ? 'Try Again' : 'Retry Now';
    const disabledAttr = disabled ? 'disabled' : '';

    let buttonsHtml = '';
    if (showRetryButton) {
      buttonsHtml += `
        <button class="retry-button" id="manual-retry" ${disabledAttr}>
          ${retryButtonText}
        </button>
      `;
    }
    if (showCancelButton) {
      buttonsHtml += `
        <button class="cancel-button" id="cancel-btn" ${disabledAttr}>
          Cancel
        </button>
      `;
    }

    return `
      <div class="actions">
        ${buttonsHtml}
      </div>
    `;
  }

  /**
   * Sync config attributes to host element
   */
  private _syncAttributes(): void {
    if (this.config.size && this.getAttribute('size') !== this.config.size) {
      this.setAttribute('size', this.config.size);
    }
    if (this.config.variant && this.getAttribute('variant') !== this.config.variant) {
      this.setAttribute('variant', this.config.variant);
    }
    if (this.config.animation && this.getAttribute('animation') !== this.config.animation) {
      this.setAttribute('animation', this.config.animation);
    }
  }

  /**
   * Get attempt counter HTML
   */
  private _getAttemptCounterHtml(
    showAttemptCount: boolean,
    attempt: number,
    maxAttempts: number,
    status: RetryStatus
  ): string {
    if (!showAttemptCount) {
      return '';
    }
    return `
          <div class="attempt-counter">
            <div class="attempt-number ${status}">${attempt}</div>
            <div class="attempt-label">of ${maxAttempts} attempts</div>
          </div>
        `;
  }

  /**
   * Get metrics grid HTML
   */
  private _getMetricsGridHtml(
    showNextRetry: boolean,
    showElapsedTime: boolean,
    status: RetryStatus,
    remainingTime: number,
    elapsedTime: number,
    strategy: string
  ): string {
    const nextRetryHtml =
      showNextRetry && status === 'waiting'
        ? `
            <div class="metric">
              <div class="metric-value">${formatTime(Math.ceil(remainingTime / 1000))}</div>
              <div class="metric-label">Next Retry</div>
            </div>
          `
        : '';

    const elapsedHtml =
      showElapsedTime && elapsedTime > 0
        ? `
            <div class="metric">
              <div class="metric-value">${formatTime(Math.ceil(elapsedTime / 1000))}</div>
              <div class="metric-label">Elapsed</div>
            </div>
          `
        : '';

    return `
        <div class="metrics-grid">
          ${nextRetryHtml}
          ${elapsedHtml}
          <div class="metric">
            <div class="metric-value">${strategy}</div>
            <div class="metric-label">Strategy</div>
          </div>
        </div>
        `;
  }

  /**
   * Get progress bar HTML
   */
  private _getProgressBarHtml(
    showProgressBar: boolean,
    status: RetryStatus,
    progressPercentage: number
  ): string {
    if (!showProgressBar || status !== 'waiting') {
      return '';
    }
    return `
          <div class="progress-bar-container">
            <div class="progress-label">Time until next attempt</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
          </div>
        `;
  }

  /**
   * Get error display HTML
   */
  private _getErrorDisplayHtml(errorMessage: string, status: RetryStatus): string {
    if (!errorMessage || (status !== 'waiting' && status !== 'failed')) {
      return '';
    }
    return `
          <div class="error-display">
            <div class="error-title">Last Error</div>
            <div class="error-message">${errorMessage}</div>
          </div>
        `;
  }

  /**
   * Attach event listeners to rendered elements
   */
  private _attachEventListeners(allowManualRetry: boolean, allowCancel: boolean): void {
    if (allowManualRetry) {
      const retryBtn = this.shadowRoot?.getElementById('manual-retry');
      retryBtn?.addEventListener('click', () => this.handleManualRetry());
    }

    if (allowCancel) {
      const cancelBtn = this.shadowRoot?.getElementById('cancel-btn');
      cancelBtn?.addEventListener('click', () => this.handleCancel());
    }
  }

  /**
   * Render component
   */
  protected override render(): void {
    if (!this.shadowRoot) return;

    this._syncAttributes();

    const { status, attempt, maxAttempts, message, errorMessage, elapsedTime } = this.state;
    const {
      showAttemptCount,
      showNextRetry,
      showProgressBar,
      showElapsedTime,
      allowManualRetry,
      allowCancel,
      disabled,
    } = this.config;

    const remainingTime = this.getTimeUntilRetry();
    const progressPercentage = this.getProgressPercentage();

    const attemptCounterHtml = this._getAttemptCounterHtml(
      showAttemptCount,
      attempt,
      maxAttempts,
      status
    );
    const metricsGridHtml = this._getMetricsGridHtml(
      showNextRetry,
      showElapsedTime,
      status,
      remainingTime,
      elapsedTime,
      this.config.strategy
    );
    const progressBarHtml = this._getProgressBarHtml(showProgressBar, status, progressPercentage);
    const errorDisplayHtml = this._getErrorDisplayHtml(errorMessage, status);
    const successMessageHtml = this.renderSuccessMessage(status, attempt);
    const actionsHtml = this.renderActions(status, allowManualRetry, allowCancel, disabled);

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="retry-container ${disabled ? 'disabled' : ''}" role="status">
        <div class="retry-header">
          <div class="retry-icon ${status}">${this.getStatusIcon()}</div>
          <div class="retry-info">
            <h3 class="retry-title">${this.getStatusText()}</h3>
            <p class="retry-message">${message}</p>
          </div>
          <span class="status-badge ${status}">${this.getStatusText()}</span>
        </div>

        ${attemptCounterHtml}
        ${metricsGridHtml}
        ${progressBarHtml}
        ${errorDisplayHtml}
        ${successMessageHtml}
        ${actionsHtml}
      </div>
    `;

    this._attachEventListeners(allowManualRetry, allowCancel);
  }

  /**
   * Cleanup on disconnect
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopTimers();
  }

  /**
   * Observed attributes
   */
  static get observedAttributes(): string[] {
    return [
      'attempt',
      'max-attempts',
      'initial-delay',
      'max-delay',
      'backoff-multiplier',
      'strategy',
      'allow-manual-retry',
      'allow-cancel',
      'show-attempt-count',
      'show-progress-bar',
      'disabled',
      'size',
      'variant',
      'animation',
    ];
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(
    name: string,
    _oldValue: string,
    newValue: string
  ): void {
    switch (name) {
      case 'attempt': {
        this.state.attempt = Number.parseInt(newValue, 10) || 1;
        break;
      }
      case 'max-attempts': {
        const maxAttempts = Number.parseInt(newValue, 10) || 3;
        this.state.maxAttempts = maxAttempts;
        this.config.maxAttempts = maxAttempts;
        break;
      }
      case 'initial-delay': {
        const initialDelay = Number.parseInt(newValue, 10);
        if (Number.isNaN(initialDelay) === false) this.config.initialDelay = initialDelay;
        break;
      }
      case 'max-delay': {
        const maxDelay = Number.parseInt(newValue, 10);
        if (Number.isNaN(maxDelay) === false) this.config.maxDelay = maxDelay;
        break;
      }
      case 'backoff-multiplier': {
        const multiplier = Number.parseFloat(newValue);
        if (Number.isNaN(multiplier) === false) this.config.backoffMultiplier = multiplier;
        break;
      }
      case 'strategy': {
        if (['exponential', 'linear', 'fixed', 'fibonacci'].includes(newValue)) {
          this.config.strategy = newValue as any;
        }
        break;
      }
      case 'allow-manual-retry': {
        this.config.allowManualRetry = newValue === 'true';
        break;
      }
      case 'allow-cancel': {
        this.config.allowCancel = newValue === 'true';
        break;
      }
      case 'show-attempt-count':
        this.config.showAttemptCount = newValue === 'true';
        break;
      case 'show-progress-bar':
        this.config.showProgressBar = newValue === 'true';
        break;
      case 'variant':
        this.config.variant = newValue as any;
        this.render();
        break;
      case 'animation':
        this.config.animation = newValue as any;
        this.render();
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        break;
      case 'size':
        this.config.size = newValue as any;
        break;
    }
    this.render();
  }
}

// Register custom element
if (!customElements.get('retry-progress')) {
  customElements.define('retry-progress', RetryProgress);
}
