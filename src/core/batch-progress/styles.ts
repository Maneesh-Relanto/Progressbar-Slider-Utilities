export const styles = `
  :host {
    display: block;
    font-family: var(--ai-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--ai-font-size, 14px);
    color: var(--ai-text-color, #1f2937);
    --ai-primary-color: #3b82f6;
    --ai-success-color: #10b981;
    --ai-error-color: #ef4444;
    --ai-warning-color: #f59e0b;
    --ai-background-color: #ffffff;
    --ai-border-color: #e5e7eb;
    --ai-border-radius: 8px;
    --ai-spacing: 12px;
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
    background: var(--ai-background-color);
    border: 1px solid var(--ai-border-color);
    border-radius: var(--ai-border-radius);
    padding: var(--ai-spacing);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--ai-spacing);
  }

  .status-message {
    font-weight: 600;
    color: var(--ai-text-color);
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
    margin-bottom: var(--ai-spacing);
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
    color: var(--ai-text-color);
  }

  .stat-value.success {
    color: var(--ai-success-color);
  }

  .stat-value.error {
    color: var(--ai-error-color);
  }

  .stat-value.rate {
    color: var(--ai-primary-color);
  }

  .overall-progress {
    margin-bottom: var(--ai-spacing);
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
    background: linear-gradient(90deg, var(--ai-primary-color), var(--ai-success-color));
    transition: width 0.3s ease;
    border-radius: 4px;
  }

  .items-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--ai-border-color);
    border-radius: 6px;
    background: white;
  }

  .batch-item {
    padding: 10px 12px;
    border-bottom: 1px solid var(--ai-border-color);
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
    color: var(--ai-text-color);
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
    color: var(--ai-primary-color);
  }

  .item-status.completed {
    color: var(--ai-success-color);
  }

  .item-status.failed {
    color: var(--ai-error-color);
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
    background: var(--ai-primary-color);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .item-error {
    margin-top: 4px;
    padding: 6px 8px;
    background: #fee2e2;
    border-left: 3px solid var(--ai-error-color);
    border-radius: 4px;
    font-size: 12px;
    color: #991b1b;
  }

  .controls {
    margin-top: var(--ai-spacing);
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
