export const styles = `
  :host {
    display: block;
    font-family: var(--queue-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
    font-size: var(--queue-font-size, 14px);
    color: var(--queue-text, #e4e4e7);
    --transition-speed: 0.3s;
  }

  .queue-container {
    background: var(--queue-background, #1a1a2e);
    border: 1px solid var(--queue-border, #27273a);
    border-radius: var(--queue-border-radius, 12px);
    padding: var(--queue-padding, 24px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .queue-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .queue-icon {
    font-size: 32px;
    line-height: 1;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .queue-title {
    flex: 1;
  }

  .queue-status {
    font-size: 16px;
    font-weight: 600;
    color: var(--queue-text, #e4e4e7);
    margin: 0 0 4px 0;
  }

  .queue-message {
    font-size: 13px;
    color: var(--queue-text-secondary, #a1a1aa);
    margin: 0;
  }

  .queue-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .queue-badge.waiting {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
  }

  .queue-badge.processing {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  .queue-badge.completed {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  .queue-badge.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .queue-position {
    text-align: center;
    margin: 24px 0;
  }

  .position-number {
    font-size: 64px;
    font-weight: 700;
    color: var(--queue-primary, #667eea);
    line-height: 1;
    margin: 0 0 8px 0;
    font-variant-numeric: tabular-nums;
    transition: all var(--transition-speed) ease;
  }

  .position-label {
    font-size: 14px;
    color: var(--queue-text-secondary, #a1a1aa);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .queue-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin: 20px 0;
  }

  .metric {
    background: var(--queue-metric-bg, #16162a);
    border: 1px solid var(--queue-border, #27273a);
    border-radius: 8px;
    padding: 12px 16px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--queue-text, #e4e4e7);
    margin: 0 0 4px 0;
    font-variant-numeric: tabular-nums;
  }

  .metric-label {
    font-size: 12px;
    color: var(--queue-text-secondary, #a1a1aa);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .progress-container {
    margin: 20px 0;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--queue-progress-bg, #27273a);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width var(--transition-speed) ease;
    position: relative;
    overflow: hidden;
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

  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    color: var(--queue-text-secondary, #a1a1aa);
  }

  .queue-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: var(--queue-info-bg, rgba(102, 126, 234, 0.05));
    border: 1px solid var(--queue-primary, #667eea);
    border-radius: 8px;
    margin-top: 16px;
  }

  .info-icon {
    font-size: 18px;
  }

  .info-text {
    font-size: 13px;
    color: var(--queue-text, #e4e4e7);
    margin: 0;
  }

  .queue-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .queue-button {
    flex: 1;
    padding: 10px 16px;
    background: var(--queue-button-bg, #667eea);
    color: var(--queue-button-text, #ffffff);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-speed) ease;
  }

  .queue-button:hover:not(:disabled) {
    background: var(--queue-button-hover, #5568d3);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  .queue-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .queue-button.secondary {
    background: var(--queue-button-secondary, #27273a);
    color: var(--queue-text, #e4e4e7);
  }

  .queue-button.secondary:hover:not(:disabled) {
    background: var(--queue-button-secondary-hover, #333348);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 8px;
    color: #ef4444;
    margin-top: 16px;
  }

  .error-icon {
    font-size: 20px;
  }

  .error-text {
    font-size: 13px;
    margin: 0;
  }

  /* Animation for position change */
  @keyframes positionChange {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); color: var(--queue-success, #10b981); }
    100% { transform: scale(1); }
  }

  .position-number.changing {
    animation: positionChange 0.5s ease;
  }

  /* Responsive design */
  @media (max-width: 480px) {
    .queue-container {
      padding: 16px;
    }

    .position-number {
      font-size: 48px;
    }

    .queue-metrics {
      grid-template-columns: 1fr;
    }
  }

  /* Dark mode adjustments (default) */
  :host {
    color-scheme: dark;
  }

  /* Accessibility */
  .queue-button:focus-visible {
    outline: 2px solid var(--queue-primary, #667eea);
    outline-offset: 2px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
