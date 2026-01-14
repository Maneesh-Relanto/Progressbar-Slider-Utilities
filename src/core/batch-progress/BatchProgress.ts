import { AIControl } from '../base/AIControl';
import type {
  BatchProgressConfig,
  BatchProgressState,
  BatchProgressUpdate,
  BatchItem,
  BatchItemStatus,
  BatchStartEvent,
  BatchItemUpdateEvent,
  BatchCompleteEvent,
  BatchCancelEvent,
  BatchItemCompleteEvent,
  BatchItemFailedEvent,
} from './types';
import { styles } from './styles';

/**
 * BatchProgress Component
 *
 * Displays progress for batch operations processing multiple items.
 * Perfect for processing multiple AI requests, documents, or images in parallel.
 *
 * @example
 * ```typescript
 * // Create batch progress
 * const batch = new BatchProgress({
 *   totalItems: 50,
 *   concurrency: 5,
 *   showItems: true,
 *   showStats: true
 * });
 *
 * document.body.appendChild(batch);
 *
 * // Start batch
 * batch.start();
 *
 * // Add items
 * for (let i = 0; i < 50; i++) {
 *   batch.addItem(`item-${i}`, `Process item ${i}`);
 * }
 *
 * // Update item progress
 * batch.updateItem({
 *   itemId: 'item-0',
 *   status: 'processing',
 *   progress: 50
 * });
 *
 * // Complete item
 * batch.completeItem('item-0', { result: 'success' });
 *
 * // Listen to events
 * batch.addEventListener('batchcomplete', (e) => {
 *   console.log(`Completed ${e.detail.successCount}/${e.detail.totalItems}`);
 * });
 * ```
 *
 * @fires batchstart - Fired when batch processing starts
 * @fires itemupdate - Fired when batch item is updated
 * @fires itemcomplete - Fired when batch item completes
 * @fires itemfailed - Fired when batch item fails
 * @fires batchcomplete - Fired when all items are processed
 * @fires batchcancel - Fired when batch is cancelled
 */
export class BatchProgress extends AIControl {
  protected override config: Required<BatchProgressConfig>;
  private readonly state: BatchProgressState;
  private updateThrottleTimer: ReturnType<typeof setTimeout> | null = null;

  static get observedAttributes() {
    return ['total-items', 'disabled'];
  }

  constructor(config: BatchProgressConfig = {}) {
    super({
      debug: config.debug ?? false,
      className: config.className,
      ariaLabel: config.ariaLabel ?? 'Batch Progress',
    });

    this.config = {
      totalItems: config.totalItems ?? 0,
      concurrency: config.concurrency ?? 5,
      showItems: config.showItems ?? true,
      maxDisplayItems: config.maxDisplayItems ?? 100,
      showProgressBar: config.showProgressBar ?? true,
      showStats: config.showStats ?? true,
      showTime: config.showTime ?? true,
      showRate: config.showRate ?? true,
      allowCancel: config.allowCancel ?? true,
      cancelLabel: config.cancelLabel ?? 'Cancel Batch',
      collapseCompleted: config.collapseCompleted ?? false,
      message: config.message ?? 'Processing batch...',
      disabled: config.disabled ?? false,
      debug: config.debug ?? false,
      className: config.className ?? '',
      ariaLabel: config.ariaLabel ?? 'Batch Progress',
    };

    this.state = {
      status: 'idle',
      items: new Map(),
      totalItems: this.config.totalItems,
      completedCount: 0,
      failedCount: 0,
      successCount: 0,
      currentConcurrency: 0,
      startTime: null,
      endTime: null,
      message: this.config.message,
    };

    this.attachShadow({ mode: 'open' });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.render();
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'total-items':
        this.state.totalItems = Number.parseInt(newValue || '0', 10);
        this.render();
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        this.render();
        break;
    }
  }

  /**
   * Start batch processing
   */
  public start(message?: string): void {
    if (this.config.disabled) return;

    this.state.status = 'processing';
    this.state.startTime = Date.now();
    this.state.message = message || this.config.message;
    this.state.completedCount = 0;
    this.state.failedCount = 0;
    this.state.successCount = 0;

    this.render();

    const event: BatchStartEvent = {
      totalItems: this.state.totalItems,
      startTime: this.state.startTime,
    };

    this.dispatchEvent(
      new CustomEvent('batchstart', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );

    this.log('Batch started', event);
  }

  /**
   * Add item to batch
   */
  public addItem(itemId: string, label?: string): void {
    const item: BatchItem = {
      id: itemId,
      label: label || itemId,
      status: 'pending',
      progress: 0,
    };

    this.state.items.set(itemId, item);
    this.state.totalItems = this.state.items.size;
    this.render();

    this.log('Item added', item);
  }

  /**
   * Update batch item
   */
  public updateItem(update: BatchProgressUpdate): void {
    const item = this.state.items.get(update.itemId);
    if (!item) {
      this.log(`Item not found: ${update.itemId}`);
      return;
    }

    if (update.status) item.status = update.status;
    if (update.progress !== undefined) item.progress = update.progress;
    if (update.error) item.error = update.error;
    if (update.result !== undefined) item.result = update.result;
    if (update.label) item.label = update.label;

    // Track status changes
    if (update.status === 'completed') {
      item.endTime = Date.now();
      this.state.completedCount++;
      if (!item.error) this.state.successCount++;
    } else if (update.status === 'failed') {
      item.endTime = Date.now();
      this.state.completedCount++;
      this.state.failedCount++;
    }

    this.throttledRender();

    const overallProgress = this.getOverallProgress();

    const event: BatchItemUpdateEvent = {
      ...item,
      totalCompleted: this.state.completedCount,
      totalFailed: this.state.failedCount,
      overallProgress,
    };

    this.dispatchEvent(
      new CustomEvent('itemupdate', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );

    // Check if batch is complete
    if (this.state.completedCount === this.state.totalItems && this.state.status === 'processing') {
      this.complete();
    }
  }

  /**
   * Complete a batch item
   */
  public completeItem(itemId: string, result?: any): void {
    this.updateItem({
      itemId,
      status: 'completed',
      progress: 100,
      result,
    });

    const item = this.state.items.get(itemId);
    if (!item) return;

    const event: BatchItemCompleteEvent = {
      item,
      totalCompleted: this.state.completedCount,
      remainingItems: this.state.totalItems - this.state.completedCount,
    };

    this.dispatchEvent(
      new CustomEvent('itemcomplete', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Fail a batch item
   */
  public failItem(itemId: string, error: string): void {
    this.updateItem({
      itemId,
      status: 'failed',
      error,
    });

    const item = this.state.items.get(itemId);
    if (!item) return;

    const event: BatchItemFailedEvent = {
      item,
      error,
      totalFailed: this.state.failedCount,
    };

    this.dispatchEvent(
      new CustomEvent('itemfailed', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Complete batch processing
   */
  public complete(): void {
    this.state.status = 'completed';
    this.state.endTime = Date.now();

    this.render();

    const duration = this.state.endTime - (this.state.startTime || 0);
    const averageRate = this.state.totalItems / (duration / 1000);

    const event: BatchCompleteEvent = {
      totalItems: this.state.totalItems,
      successCount: this.state.successCount,
      failedCount: this.state.failedCount,
      duration,
      averageRate,
      startTime: this.state.startTime!,
      endTime: this.state.endTime,
    };

    this.dispatchEvent(
      new CustomEvent('batchcomplete', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );

    this.log('Batch completed', event);
  }

  /**
   * Cancel batch processing
   */
  public cancel(reason?: string): void {
    this.state.status = 'cancelled';
    this.state.endTime = Date.now();

    // Cancel all pending items
    let cancelledCount = 0;
    this.state.items.forEach((item) => {
      if (item.status === 'pending' || item.status === 'processing') {
        item.status = 'cancelled';
        cancelledCount++;
      }
    });

    this.render();

    const event: BatchCancelEvent = {
      completedCount: this.state.completedCount,
      failedCount: this.state.failedCount,
      cancelledCount,
      reason,
    };

    this.dispatchEvent(
      new CustomEvent('batchcancel', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );

    this.log('Batch cancelled', event);
  }

  /**
   * Reset batch to initial state
   */
  public reset(): void {
    this.state.status = 'idle';
    this.state.items.clear();
    this.state.totalItems = this.config.totalItems;
    this.state.completedCount = 0;
    this.state.failedCount = 0;
    this.state.successCount = 0;
    this.state.currentConcurrency = 0;
    this.state.startTime = null;
    this.state.endTime = null;
    this.state.message = this.config.message;

    this.render();
    this.log('Batch reset');
  }

  /**
   * Get overall progress percentage
   */
  public getOverallProgress(): number {
    if (this.state.totalItems === 0) return 0;
    return (this.state.completedCount / this.state.totalItems) * 100;
  }

  /**
   * Get processing rate (items/second)
   */
  public getRate(): number {
    if (!this.state.startTime || this.state.completedCount === 0) return 0;
    const elapsed = (Date.now() - this.state.startTime) / 1000;
    return this.state.completedCount / elapsed;
  }

  /**
   * Get batch statistics
   */
  public getStats() {
    return {
      total: this.state.totalItems,
      completed: this.state.completedCount,
      success: this.state.successCount,
      failed: this.state.failedCount,
      pending: this.state.totalItems - this.state.completedCount,
      progress: this.getOverallProgress(),
      rate: this.getRate(),
      duration: this.state.endTime
        ? this.state.endTime - (this.state.startTime || 0)
        : this.state.startTime
          ? Date.now() - this.state.startTime
          : 0,
    };
  }

  /**
   * Throttled render to avoid excessive updates
   */
  private throttledRender(): void {
    if (this.updateThrottleTimer) return;

    this.updateThrottleTimer = globalThis.setTimeout(() => {
      this.render();
      this.updateThrottleTimer = null;
    }, 100);
  }

  /**
   * Render the component
   */
  protected render(): void {
    if (!this.shadowRoot) return;

    const overallProgress = this.getOverallProgress();
    const rate = this.getRate();
    const stats = this.getStats();

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case 'processing':
          return 'processing';
        case 'completed':
          return 'completed';
        case 'cancelled':
          return 'cancelled';
        default:
          return '';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'idle':
          return 'Ready';
        case 'processing':
          return 'Processing';
        case 'completed':
          return 'Completed';
        case 'cancelled':
          return 'Cancelled';
        default:
          return '';
      }
    };

    const statusBadgeClass = getStatusBadgeClass(this.state.status);
    const statusText = getStatusText(this.state.status);

    const statsHtml = this.config.showStats
      ? `
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">${stats.total}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Success</span>
            <span class="stat-value success">${stats.success}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Failed</span>
            <span class="stat-value error">${stats.failed}</span>
          </div>
          ${
            this.config.showRate
              ? `
            <div class="stat-item">
              <span class="stat-label">Rate</span>
              <span class="stat-value rate">${rate.toFixed(1)}/s</span>
            </div>
          `
              : ''
          }
        </div>
      `
      : '';

    const progressHtml = this.config.showProgressBar
      ? `
        <div class="overall-progress">
          <div class="progress-header">
            <span>Overall Progress</span>
            <span>${stats.completed} / ${stats.total} (${overallProgress.toFixed(0)}%)</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${overallProgress}%"></div>
          </div>
        </div>
      `
      : '';

    const itemsHtml = this.config.showItems ? this.renderItems() : '';

    const controlsHtml =
      this.config.allowCancel && this.state.status === 'processing'
        ? `
        <div class="controls">
          <button class="cancel-btn" id="cancel-btn" ${this.config.disabled ? 'disabled' : ''}>
            ${this.config.cancelLabel}
          </button>
        </div>
      `
        : '';

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="container">
        <div class="header">
          <div class="status-message">${this.state.message}</div>
          ${statusBadgeClass ? `<span class="status-badge ${statusBadgeClass}">${statusText}</span>` : ''}
        </div>
        ${statsHtml}
        ${progressHtml}
        ${itemsHtml}
        ${controlsHtml}
      </div>
    `;

    // Attach event listeners
    if (this.config.allowCancel) {
      const cancelBtn = this.shadowRoot.getElementById('cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => this.cancel('User cancelled'));
      }
    }
  }

  /**
   * Render batch items
   */
  private renderItems(): string {
    if (this.state.items.size === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div>No items in batch</div>
        </div>
      `;
    }

    const items = Array.from(this.state.items.values());
    const displayItems = items.slice(0, this.config.maxDisplayItems);

    const itemsHtml = displayItems
      .map((item) => {
        const statusIcon = this.getStatusIcon(item.status);
        const collapsed =
          this.config.collapseCompleted && item.status === 'completed' ? 'collapsed' : '';

        const progressBarHtml =
          item.status === 'processing' && item.progress !== undefined
            ? `
            <div class="item-progress-bar">
              <div class="item-progress-fill" style="width: ${item.progress}%"></div>
            </div>
          `
            : '';

        const errorHtml = item.error
          ? `
            <div class="item-error">
              ${item.error}
            </div>
          `
          : '';

        return `
          <div class="batch-item ${item.status} ${collapsed}">
            <div class="item-header">
              <span class="item-label">${item.label || item.id}</span>
              <span class="item-status ${item.status}">
                <span class="item-status-icon">${statusIcon}</span>
                ${item.status}
              </span>
            </div>
            ${progressBarHtml}
            ${errorHtml}
          </div>
        `;
      })
      .join('');

    return `
      <div class="items-container">
        ${itemsHtml}
      </div>
    `;
  }

  /**
   * Get status icon
   */
  private getStatusIcon(status: BatchItemStatus): string {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '<span class="spinner"></span>';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '⛔';
      default:
        return '';
    }
  }

  /**
   * Get/set disabled state
   */
  override get disabled(): boolean {
    return this.config.disabled;
  }

  override set disabled(value: boolean) {
    this.config.disabled = value;
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
    this.render();
  }
}

// Define custom element
if (!customElements.get('batch-progress')) {
  customElements.define('batch-progress', BatchProgress);
}
