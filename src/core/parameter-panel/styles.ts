export const styles = `
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --panel-bg: #ffffff;
    --panel-border: #e5e7eb;
    --panel-text: #1f2937;
    --panel-text-secondary: #6b7280;
    --panel-header-bg: #f9fafb;
    --panel-primary: #2563eb;
    --panel-primary-hover: #1d4ed8;
    --panel-danger: #dc2626;
    --panel-danger-hover: #b91c1c;
    --panel-success: #16a34a;
    --panel-radius: 12px;
    --panel-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .container {
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    border-radius: var(--panel-radius);
    box-shadow: var(--panel-shadow);
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--panel-header-bg);
    border-bottom: 1px solid var(--panel-border);
  }

  .header.collapsible {
    cursor: pointer;
    user-select: none;
  }

  .header.collapsible:hover {
    background: #f3f4f6;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: var(--panel-text);
    margin: 0;
  }

  .dirty-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 8px;
    height: 8px;
    background: var(--panel-primary);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .dirty-indicator.show {
    opacity: 1;
  }

  .collapse-icon {
    font-size: 20px;
    color: var(--panel-text-secondary);
    transition: transform 0.2s;
  }

  .collapse-icon.collapsed {
    transform: rotate(-90deg);
  }

  .content {
    max-height: 2000px;
    overflow: hidden;
    transition: max-height 0.3s ease-out, padding 0.3s ease-out;
  }

  .content.collapsed {
    max-height: 0;
    padding: 0 !important;
  }

  .presets-section {
    padding: 16px 20px;
    border-bottom: 1px solid var(--panel-border);
    background: var(--panel-header-bg);
  }

  .presets-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--panel-text-secondary);
    margin-bottom: 10px;
  }

  .presets-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .preset-btn {
    padding: 8px 16px;
    background: white;
    border: 1px solid var(--panel-border);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--panel-text);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .preset-btn:hover {
    border-color: var(--panel-primary);
    background: #eff6ff;
  }

  .preset-btn.active {
    background: var(--panel-primary);
    color: white;
    border-color: var(--panel-primary);
  }

  .preset-btn .icon {
    font-size: 16px;
  }

  .preset-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .parameters-section {
    padding: 20px;
  }

  .parameters-grid {
    display: grid;
    gap: 20px;
  }

  .parameters-grid.layout-grid {
    grid-template-columns: repeat(var(--grid-columns, 2), 1fr);
  }

  .parameters-grid.layout-vertical {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    .parameters-grid.layout-grid {
      grid-template-columns: 1fr;
    }
  }

  .parameter-wrapper {
    display: block;
  }

  .actions-section {
    padding: 16px 20px;
    border-top: 1px solid var(--panel-border);
    background: var(--panel-header-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .actions-left,
  .actions-right {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 8px 16px;
    background: white;
    border: 1px solid var(--panel-border);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--panel-text);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .action-btn:hover {
    background: #f9fafb;
    border-color: var(--panel-primary);
  }

  .action-btn.primary {
    background: var(--panel-primary);
    color: white;
    border-color: var(--panel-primary);
  }

  .action-btn.primary:hover {
    background: var(--panel-primary-hover);
  }

  .action-btn.danger {
    color: var(--panel-danger);
  }

  .action-btn.danger:hover {
    background: #fef2f2;
    border-color: var(--panel-danger);
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .validation-errors {
    padding: 12px 20px;
    background: #fef2f2;
    border-bottom: 1px solid #fecaca;
    display: none;
  }

  .validation-errors.show {
    display: block;
  }

  .error-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--panel-danger);
    font-size: 13px;
    margin: 4px 0;
  }

  .error-icon {
    font-size: 16px;
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: var(--panel-text-secondary);
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-state-text {
    font-size: 14px;
  }

  /* Dark mode support */
  :host([theme="dark"]) {
    --panel-bg: #1f2937;
    --panel-border: #374151;
    --panel-text: #f9fafb;
    --panel-text-secondary: #9ca3af;
    --panel-header-bg: #111827;
    --panel-primary: #3b82f6;
    --panel-primary-hover: #2563eb;
    --panel-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  /* Loading state */
  .loading {
    position: relative;
    pointer-events: none;
    opacity: 0.6;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    margin: -12px 0 0 -12px;
    border: 3px solid var(--panel-border);
    border-top-color: var(--panel-primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Disabled state */
  :host([disabled]) .container {
    opacity: 0.6;
    pointer-events: none;
  }
`;
