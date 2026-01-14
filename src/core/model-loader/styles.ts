export const styles = `
<style>
:host {
  /* CSS variables inherit from document root with fallback defaults */
  display: block;
  font-family: var(--ai-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  font-size: var(--ai-font-size, 14px);
}

:host([style*="cursor: progress"]) .model-loader {
  cursor: progress;
}

:host([style*="cursor: not-allowed"]) .model-loader {
  cursor: not-allowed;
}

:host([style*="cursor: default"]) .model-loader {
  cursor: default;
}

.model-loader {
  background: var(--ai-background-color, #ffffff);
  border: 1px solid var(--ai-border-color, #e5e7eb);
  border-radius: var(--ai-border-radius, 8px);
  padding: var(--ai-spacing, 12px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.model-loader.loading {
  border-color: var(--ai-primary-color, #3b82f6);
}

.model-loader.error {
  border-color: #ef4444;
}

.model-loader.completed {
  border-color: var(--ai-secondary-color, #10b981);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ai-spacing, 12px);
}

.model-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--ai-text-color, #1f2937);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.loading {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.error {
  background: #fee2e2;
  color: #991b1b;
}

.stages {
  display: flex;
  flex-direction: column;
  gap: var(--ai-spacing, 12px);
  margin-bottom: var(--ai-spacing, 12px);
}

.stage {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stage-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.stage-icon.pending {
  background: #f3f4f6;
  color: #9ca3af;
}

.stage-icon.in-progress {
  background: #dbeafe;
  color: #1e40af;
  animation: pulse 2s ease-in-out infinite;
}

.stage-icon.completed {
  background: #d1fae5;
  color: #065f46;
}

.stage-icon.error {
  background: #fee2e2;
  color: #991b1b;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.stage-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ai-text-color, #1f2937);
  text-transform: capitalize;
}

.stage-progress-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.stage-message {
  font-size: 12px;
  color: #6b7280;
  padding-left: 32px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-left: 32px;
  width: calc(100% - 32px);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ai-primary-color, #3b82f6), var(--ai-secondary-color, #10b981));
  transition: width 0.3s ease;
  border-radius: 3px;
}

.progress-fill.error {
  background: #ef4444;
}

.stage.in-progress .progress-fill {
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--ai-spacing, 12px);
  padding-top: var(--ai-spacing, 12px);
  border-top: 1px solid var(--ai-border-color, #e5e7eb);
  margin-top: var(--ai-spacing, 12px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-value {
  font-size: 15px;
  color: var(--ai-text-color, #1f2937);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  margin-top: var(--ai-spacing, 12px);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.error-icon {
  color: #dc2626;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-text {
  color: #991b1b;
  font-size: 13px;
  line-height: 1.5;
}

.retry-button {
  width: 100%;
  padding: 10px 16px;
  background: var(--ai-primary-color, #3b82f6);
  color: white;
  border: none;
  border-radius: calc(var(--ai-border-radius, 8px) * 0.75);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: inherit;
  margin-top: var(--ai-spacing, 12px);
}

.retry-button:hover {
  background: #2563eb;
}

.retry-button:active {
  transform: translateY(1px);
}

.retry-button:focus-visible {
  outline: 2px solid var(--ai-primary-color, #3b82f6);
  outline-offset: 2px;
}

/* Dark mode support - variables can be overridden at document level */
@media (prefers-color-scheme: dark) {
  .progress-bar {
    background: #374151;
  }
  
  .stat-label,
  .stage-message,
  .stage-progress-text {
    color: #9ca3af;
  }
  
  .error-message {
    background: #450a0a;
    border-color: #7f1d1d;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .stage-icon.in-progress,
  .stage.in-progress .progress-fill {
    animation: none;
    transition: none;
  }
  
  .retry-button {
    transition: none;
  }
}

/* Size variants */
:host([size="compact"]) .model-loader {
  padding: 8px;
  font-size: 12px;
}

:host([size="compact"]) .progress-bar {
  height: 6px;
}

:host([size="compact"]) .model-name {
  font-size: 13px;
}

:host([size="compact"]) .status-badge {
  padding: 3px 8px;
  font-size: 10px;
}

:host([size="compact"]) .stage-name {
  font-size: 11px;
}

:host([size="compact"]) .stat-value {
  font-size: 14px;
}

:host([size="large"]) .model-loader {
  padding: 16px;
  font-size: 16px;
}

:host([size="large"]) .progress-bar {
  height: 10px;
}

:host([size="large"]) .model-name {
  font-size: 17px;
}

:host([size="large"]) .status-badge {
  padding: 5px 12px;
  font-size: 12px;
}

:host([size="large"]) .stage-name {
  font-size: 15px;
}

:host([size="large"]) .stat-value {
  font-size: 18px;
}

/* Responsive design */
@media (max-width: 640px) {
  .stats {
    grid-template-columns: 1fr;
  }
}

/* Disabled state */
:host([disabled]) .model-loader {
  opacity: 0.5;
  pointer-events: none;
}
</style>
`;
