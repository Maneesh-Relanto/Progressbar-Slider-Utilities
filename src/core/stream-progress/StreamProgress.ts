import { AIControl } from '../base/AIControl';
import { throttle, formatCurrency } from '../base/utils';
import type {
  StreamProgressConfig,
  StreamProgressState,
  StreamProgressUpdate,
  StreamCompleteEvent,
  StreamCancelEvent,
} from './types';
import { styles } from './styles';

/**
 * StreamProgress Component
 *
 * Displays real-time progress for streaming AI responses (e.g., LLM token generation).
 * Shows token count, generation rate, cost estimation, and provides cancel functionality.
 *
 * @example
 * ```typescript
 * // Create the component
 * const progress = new StreamProgress({
 *   maxTokens: 2000,
 *   costPerToken: 0.00002,
 *   showRate: true,
 *   showCost: true,
 * });
 *
 * document.body.appendChild(progress);
 *
 * // Start streaming
 * progress.start();
 *
 * // Update as tokens stream in
 * progress.update({
 *   tokensGenerated: 150,
 *   tokensPerSecond: 25,
 *   message: 'Generating response...'
 * });
 *
 * // Complete the stream
 * progress.complete();
 *
 * // Listen to events
 * progress.addEventListener('cancel', (e) => {
 *   console.log('Stream cancelled', e.detail);
 * });
 * ```
 *
 * @fires streamstart - Fired when streaming starts
 * @fires streamupdate - Fired when progress is updated
 * @fires streamcomplete - Fired when streaming completes
 * @fires streamcancel - Fired when streaming is cancelled
 */
export class StreamProgress extends AIControl {
  protected override config: Required<StreamProgressConfig>;
  private state: StreamProgressState;
  private readonly updateThrottled: (update: StreamProgressUpdate) => void;
  private animationFrame: number = 0;
  private displayTokens: number = 0;

  static get observedAttributes() {
    return ['max-tokens', 'cost-per-token', 'disabled', 'size', 'variant', 'animation'];
  }

  constructor(config: StreamProgressConfig = {}) {
    super({
      debug: config.debug ?? false,
      className: config.className,
      ariaLabel: config.ariaLabel ?? 'AI Stream Progress',
    });

    // Set default configuration
    this.config = {
      maxTokens: config.maxTokens ?? 4000,
      costPerToken: config.costPerToken ?? 0.00002,
      currency: config.currency ?? '$',
      showRate: config.showRate ?? true,
      showCost: config.showCost ?? true,
      showProgressBar: config.showProgressBar ?? true,
      showCancelButton: config.showCancelButton ?? true,
      smoothProgress: config.smoothProgress ?? true,
      updateThrottle: config.updateThrottle ?? 100,
      cancelLabel: config.cancelLabel ?? 'Cancel',
      debug: config.debug ?? false,
      className: config.className ?? '',
      ariaLabel: config.ariaLabel ?? 'AI Stream Progress',
      cursorFeedback: config.cursorFeedback ?? true,
      size: config.size ?? 'default',
      variant: config.variant ?? 'default',
      animation: config.animation ?? 'none',
    };

    // Initialize state
    this.state = {
      tokensGenerated: 0,
      tokensPerSecond: 0,
      totalCost: 0,
      isStreaming: false,
      isPaused: false,
      isCancelled: false,
      startTime: 0,
      lastUpdateTime: 0,
    };

    // Create throttled update function
    this.updateThrottled = throttle(this._updateInternal.bind(this), this.config.updateThrottle);

    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.log('StreamProgress mounted');
  }

  override disconnectedCallback(): void {
    this.cleanup();
    super.disconnectedCallback();
  }

  protected override cleanup(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  /**
   * Update cursor based on component state
   */
  private updateCursor(): void {
    if (!this.config.cursorFeedback) return;

    if (this.state.isStreaming && !this.state.isPaused) {
      this.style.cursor = 'progress';
    } else if (this.state.isCancelled) {
      this.style.cursor = 'not-allowed';
    } else {
      this.style.cursor = 'default';
    }
  }

  protected override getDefaultRole(): string {
    return 'progressbar';
  }

  protected override handleAttributeChange(
    name: string,
    _oldValue: string,
    newValue: string
  ): void {
    switch (name) {
      case 'max-tokens':
        this.config.maxTokens = Number.parseInt(newValue, 10) || 4000;
        this.render();
        break;
      case 'cost-per-token':
        this.config.costPerToken = Number.parseFloat(newValue) || 0.00002;
        this.render();
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        this.render();
        break;
      case 'size':
        this.config.size = newValue as any;
        this.render();
        break;
      case 'variant':
        this.config.variant = newValue as any;
        this.render();
        break;
      case 'animation':
        this.config.animation = newValue as any;
        this.render();
        break;
    }
  }

  /**
   * Start streaming
   */
  public start(message?: string): void {
    if (this.state.isStreaming) {
      this.log('Already streaming');
      return;
    }

    this.state = {
      ...this.state,
      isStreaming: true,
      isPaused: false,
      isCancelled: false,
      tokensGenerated: 0,
      tokensPerSecond: 0,
      totalCost: 0,
      startTime: Date.now(),
      lastUpdateTime: Date.now(),
      message,
    };

    this.displayTokens = 0;
    this.startTimer();
    this.render();
    this.updateCursor();
    this.emit('streamstart', { startTime: this.state.startTime, message });
    this.log('Stream started', this.state);
  }

  /**
   * Update progress
   */
  public update(update: StreamProgressUpdate): void {
    if (!this.state.isStreaming || this.state.isCancelled) {
      return;
    }

    this.updateThrottled(update);
  }

  private _updateInternal(update: StreamProgressUpdate): void {
    const now = Date.now();
    const tokensGenerated = update.tokensGenerated;

    // Calculate rate if not provided
    let tokensPerSecond = update.tokensPerSecond ?? 0;
    if (!tokensPerSecond && this.state.lastUpdateTime) {
      const timeDiff = (now - this.state.lastUpdateTime) / 1000;
      const tokenDiff = tokensGenerated - this.state.tokensGenerated;
      tokensPerSecond = timeDiff > 0 ? tokenDiff / timeDiff : 0;
    }

    // Calculate cost
    const totalCost = tokensGenerated * this.config.costPerToken;

    // Update state
    this.state = {
      ...this.state,
      tokensGenerated,
      tokensPerSecond,
      totalCost,
      lastUpdateTime: now,
      message: update.message ?? this.state.message,
    };

    // Smooth animation
    if (this.config.smoothProgress) {
      this.animateProgress();
    } else {
      this.displayTokens = tokensGenerated;
      this.render();
    }

    // Update ARIA attributes
    this.setAttribute('aria-valuenow', tokensGenerated.toString());
    this.setAttribute('aria-valuemax', this.config.maxTokens.toString());

    this.emit('streamupdate', this.state);
    this.log('Progress updated', this.state);
  }

  /**
   * Smooth animation for progress
   */
  private animateProgress(): void {
    const animate = () => {
      const diff = this.state.tokensGenerated - this.displayTokens;
      if (Math.abs(diff) < 0.1) {
        this.displayTokens = this.state.tokensGenerated;
        this.render();
        return;
      }

      this.displayTokens += diff * 0.2;
      this.render();
      this.animationFrame = requestAnimationFrame(animate);
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * Complete streaming
   */
  public complete(): void {
    if (!this.state.isStreaming) {
      return;
    }

    const duration = this.getElapsedTime();
    const averageRate = this.state.tokensGenerated / (duration / 1000);

    const event: StreamCompleteEvent = {
      tokensGenerated: this.state.tokensGenerated,
      duration,
      totalCost: this.state.totalCost,
      averageRate,
    };

    this.state = {
      ...this.state,
      isStreaming: false,
    };

    this.render();
    this.updateCursor();
    this.emit('streamcomplete', event);
    this.log('Stream completed', event);
  }

  /**
   * Cancel streaming
   */
  public cancel(reason: 'user' | 'error' | 'timeout' = 'user'): void {
    if (!this.state.isStreaming || this.state.isCancelled) {
      return;
    }

    const duration = this.getElapsedTime();

    const event: StreamCancelEvent = {
      tokensGenerated: this.state.tokensGenerated,
      duration,
      reason,
    };

    this.state = {
      ...this.state,
      isStreaming: false,
      isCancelled: true,
    };

    this.render();
    this.updateCursor();
    this.emit('streamcancel', event);
    this.log('Stream cancelled', event);
  }

  /**
   * Reset the component
   */
  public reset(): void {
    this.state = {
      tokensGenerated: 0,
      tokensPerSecond: 0,
      totalCost: 0,
      isStreaming: false,
      isPaused: false,
      isCancelled: false,
      startTime: 0,
      lastUpdateTime: 0,
    };

    this.displayTokens = 0;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.render();
    this.updateCursor();
    this.log('Component reset');
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
   * Get progress bar HTML
   */
  private _getProgressBarHtml(percentage: number): string {
    if (!this.config.showProgressBar) {
      return '';
    }
    return `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
      `;
  }

  /**
   * Get stats HTML
   */
  private _getStatsHtml(tokensDisplay: number, rateDisplay: number, costDisplay: string): string {
    const rateHtml = this.config.showRate
      ? `
          <div class="stat-item">
            <span class="stat-label">Rate:</span>
            <span class="stat-value">${rateDisplay} tokens/s</span>
          </div>
        `
      : '';

    const costHtml = this.config.showCost
      ? `
          <div class="stat-item">
            <span class="stat-label">Cost:</span>
            <span class="stat-value">${costDisplay}</span>
          </div>
        `
      : '';

    return `
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Tokens:</span>
          <span class="stat-value">${tokensDisplay} / ${this.config.maxTokens}</span>
        </div>
        ${rateHtml}
        ${costHtml}
      </div>
    `;
  }

  /**
   * Get cancel button HTML
   */
  private _getCancelButtonHtml(): string {
    if (!this.config.showCancelButton || !this.state.isStreaming) {
      return '';
    }
    return `
        <button class="cancel-button" aria-label="Cancel streaming">
          ${this.config.cancelLabel}
        </button>
      `;
  }

  /**
   * Get status CSS class
   */
  private _getStatusClass(): string {
    if (this.state.isCancelled) return 'cancelled';
    if (this.state.isStreaming) return 'streaming';
    return 'idle';
  }

  /**
   * Attach event listeners to rendered elements
   */
  private _attachEventListeners(): void {
    if (!this.config.showCancelButton) return;

    const cancelBtn = this.shadowRoot?.querySelector('.cancel-button');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancel('user'));
    }
  }

  /**
   * Render the component
   */
  protected render(): void {
    if (!this.shadowRoot) return;

    this._syncAttributes();

    const percentage = this.calculatePercentage(this.displayTokens, this.config.maxTokens);
    const tokensDisplay = Math.round(this.displayTokens);
    const rateDisplay = Math.round(this.state.tokensPerSecond);
    const costDisplay = formatCurrency(this.state.totalCost);

    const progressBarHtml = this._getProgressBarHtml(percentage);
    const statsHtml = this._getStatsHtml(tokensDisplay, rateDisplay, costDisplay);
    const messageHtml = this.state.message
      ? `<div class="message">${this.state.message}</div>`
      : '';
    const cancelButtonHtml = this._getCancelButtonHtml();
    const statusClass = this._getStatusClass();

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="stream-progress ${statusClass} ${this.config.className}">
        ${messageHtml}
        ${progressBarHtml}
        ${statsHtml}
        ${cancelButtonHtml}
      </div>
    `;

    this._attachEventListeners();
  }

  /**
   * Get current state (for debugging/inspection)
   */
  public getState(): Readonly<StreamProgressState> {
    return { ...this.state };
  }

  /**
   * Get current configuration
   */
  public getConfig(): Readonly<Required<StreamProgressConfig>> {
    return { ...this.config };
  }
}

// Register the custom element
if (!customElements.get('stream-progress')) {
  customElements.define('stream-progress', StreamProgress);
}
