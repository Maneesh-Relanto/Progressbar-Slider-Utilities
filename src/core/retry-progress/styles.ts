/**
 * Styles for RetryProgress component
 */

export const styles = `
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --retry-primary: #f59e0b;
    --retry-success: #10b981;
    --retry-error: #ef4444;
    --retry-background: #1f2937;
    --retry-text: #f3f4f6;
    --retry-text-secondary: #9ca3af;
    --retry-border: #374151;
  }

  :host([style*="cursor: progress"]) .retry-container {
    cursor: progress;
  }

  :host([style*="cursor: wait"]) .retry-container {
    cursor: wait;
  }

  :host([style*="cursor: not-allowed"]) .retry-container {
    cursor: not-allowed;
  }

  :host([style*="cursor: default"]) .retry-container {
    cursor: default;
  }

  .retry-container {
    background: var(--retry-background);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--retry-border);
  }

  .retry-container.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Header */
  .retry-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .retry-icon {
    font-size: 32px;
    animation: rotate 2s linear infinite;
  }

  .retry-icon.success {
    animation: none;
  }

  .retry-icon.failed {
    animation: shake 0.5s ease;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .retry-info {
    flex: 1;
  }

  .retry-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--retry-text);
    margin: 0 0 4px 0;
  }

  .retry-message {
    font-size: 14px;
    color: var(--retry-text-secondary);
    margin: 0;
  }

  /* Status Badge */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.idle {
    background: #4b5563;
    color: #d1d5db;
  }

  .status-badge.attempting {
    background: #3b82f6;
    color: white;
    animation: pulse 2s infinite;
  }

  .status-badge.waiting {
    background: var(--retry-primary);
    color: white;
  }

  .status-badge.success {
    background: var(--retry-success);
    color: white;
  }

  .status-badge.failed {
    background: var(--retry-error);
    color: white;
  }

  .status-badge.cancelled {
    background: #6b7280;
    color: white;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Attempt Counter */
  .attempt-counter {
    text-align: center;
    margin: 16px 0;
  }

  .attempt-number {
    font-size: 48px;
    font-weight: 700;
    color: var(--retry-primary);
    line-height: 1;
    margin-bottom: 8px;
  }

  .attempt-number.success {
    color: var(--retry-success);
  }

  .attempt-number.failed {
    color: var(--retry-error);
  }

  .attempt-label {
    font-size: 14px;
    color: var(--retry-text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin: 16px 0;
  }

  .metric {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .metric-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--retry-text);
    margin-bottom: 4px;
  }

  .metric-label {
    font-size: 11px;
    color: var(--retry-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Progress Bar */
  .progress-bar-container {
    margin: 16px 0;
  }

  .progress-label {
    font-size: 12px;
    color: var(--retry-text-secondary);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .progress-bar {
    height: 8px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--retry-primary), #fbbf24);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Error Display */
  .error-display {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--retry-error);
    border-radius: 8px;
    padding: 12px;
    margin: 16px 0;
  }

  .error-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--retry-error);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .error-message {
    font-size: 13px;
    color: #fca5a5;
    font-family: 'Monaco', 'Courier New', monospace;
    word-break: break-word;
  }

  /* Action Buttons */
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .retry-button,
  .cancel-button {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-button {
    background: linear-gradient(135deg, var(--retry-primary), #fbbf24);
    color: white;
  }

  .retry-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }

  .retry-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cancel-button {
    background: #4b5563;
    color: white;
  }

  .cancel-button:hover:not(:disabled) {
    background: #6b7280;
  }

  .cancel-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Success State */
  .success-message {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid var(--retry-success);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    text-align: center;
  }

  .success-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  .success-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--retry-success);
    margin-bottom: 4px;
  }

  .success-details {
    font-size: 13px;
    color: var(--retry-text-secondary);
  }

  /* Responsive */
  @media (max-width: 480px) {
    .retry-container {
      padding: 16px;
    }

    .attempt-number {
      font-size: 36px;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .actions {
      flex-direction: column;
    }
  }

  /* Accessibility */
  .retry-button:focus-visible,
  .cancel-button:focus-visible {
    outline: 2px solid var(--retry-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .retry-icon,
    .progress-fill::after {
      animation: none;
    }
  }
`;
