export const styles = `
  :host {
    /* CSS variables inherit from document root with fallback defaults */
    display: block;
    font-family: var(--ai-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--ai-font-size, 14px);
    color: var(--ai-text-color, #1f2937);
  }

  :host([style*="cursor: progress"]) .container {
    cursor: progress;
  }

  :host([style*="cursor: not-allowed"]) .container {
    cursor: not-allowed;
  }

  :host([style*="cursor: default"]) .container {
    cursor: default;
  }

  .container {
    background: var(--ai-background-color, #ffffff);
    border: 1px solid var(--ai-border-color, #e5e7eb);
    border-radius: var(--ai-border-radius, 8px);
    padding: var(--ai-spacing, 12px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--ai-spacing, 12px);
  }

  .status-message {
    font-weight: 600;
    color: var(--ai-text-color, #1f2937);
    font-size: 14px;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.processing {
    background: #dbeafe;
    color: #1e40af;
  }

  .status-badge.completed {
    background: #d1fae5;
    color: #065f46;
  }

  .status-badge.cancelled {
    background: #fee2e2;
    color: #991b1b;
  }

  .stats {
    display: flex;
    gap: 16px;
    margin-bottom: var(--ai-spacing, 12px);
    padding: 8px;
    background: #f9fafb;
    border-radius: 6px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-label {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--ai-text-color, #1f2937);
  }

  .stat-value.success {
    color: var(--ai-secondary-color, #10b981);
  }

  .stat-value.error {
    color: #ef4444;
  }

  .stat-value.rate {
    color: var(--ai-primary-color, #3b82f6);
  }

  .overall-progress {
    margin-bottom: var(--ai-spacing, 12px);
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 12px;
    color: #6b7280;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--ai-primary-color, #3b82f6), var(--ai-secondary-color, #10b981));
    transition: width 0.3s ease;
    border-radius: 4px;
  }

  .items-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--ai-border-color, #e5e7eb);
    border-radius: 6px;
    background: white;
  }

  .batch-item {
    padding: 10px 12px;
    border-bottom: 1px solid var(--ai-border-color, #e5e7eb);
    transition: background 0.2s;
  }

  .batch-item:last-child {
    border-bottom: none;
  }

  .batch-item.processing {
    background: #eff6ff;
  }

  .batch-item.completed {
    background: #f0fdf4;
  }

  .batch-item.failed {
    background: #fef2f2;
  }

  .batch-item.collapsed {
    opacity: 0.6;
    max-height: 0;
    padding: 0 12px;
    overflow: hidden;
    transition: max-height 0.3s, padding 0.3s, opacity 0.3s;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .item-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--ai-text-color, #1f2937);
    flex: 1;
  }

  .item-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
  }

  .item-status.pending {
    color: #6b7280;
  }

  .item-status.processing {
    color: var(--ai-primary-color, #3b82f6);
  }

  .item-status.completed {
    color: var(--ai-secondary-color, #10b981);
  }

  .item-status.failed {
    color: #ef4444;
  }

  .item-status-icon {
    font-size: 14px;
  }

  .item-progress-bar {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;
  }

  .item-progress-fill {
    height: 100%;
    background: var(--ai-primary-color, #3b82f6);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .item-error {
    margin-top: 4px;
    padding: 6px 8px;
    background: #fee2e2;
    border-left: 3px solid #ef4444;
    border-radius: 4px;
    font-size: 12px;
    color: #991b1b;
  }

  .controls {
    margin-top: var(--ai-spacing, 12px);
    display: flex;
    justify-content: flex-end;
  }

  .cancel-btn {
    padding: 8px 16px;
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .cancel-btn:hover:not(:disabled) {
    background: #fecaca;
  }

  .cancel-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #9ca3af;
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  /* Size variants */
  :host([size="compact"]) .container {
    padding: 8px;
    font-size: 12px;
  }

  :host([size="compact"]) .progress-bar {
    height: 6px;
  }

  :host([size="compact"]) .status-message {
    font-size: 12px;
  }

  :host([size="compact"]) .status-badge {
    padding: 3px 8px;
    font-size: 10px;
  }

  :host([size="compact"]) .stat-value {
    font-size: 16px;
  }

  :host([size="compact"]) .stat-label {
    font-size: 10px;
  }

  :host([size="large"]) .container {
    padding: 16px;
    font-size: 16px;
  }

  :host([size="large"]) .progress-bar {
    height: 10px;
  }

  :host([size="large"]) .status-message {
    font-size: 16px;
  }

  :host([size="large"]) .status-badge {
    padding: 5px 12px;
    font-size: 13px;
  }

  :host([size="large"]) .stat-value {
    font-size: 20px;
  }

  :host([size="large"]) .stat-label {
    font-size: 12px;
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .progress-fill,
    .item-progress-fill,
    .spinner {
      animation: none;
      transition: none;
    }
  }

  /* Scrollbar styling */
  .items-container::-webkit-scrollbar {
    width: 8px;
  }

  .items-container::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }

  .items-container::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }

  .items-container::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;
