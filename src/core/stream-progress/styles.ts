export const styles = `
<style>
:host {
  /* CSS variables inherit from document root with fallback defaults */
  
  display: block;
  font-family: var(--ai-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  font-size: var(--ai-font-size, 14px);
}

:host([style*="cursor: progress"]) .stream-progress {
  cursor: progress;
}

:host([style*="cursor: not-allowed"]) .stream-progress {
  cursor: not-allowed;
}

:host([style*="cursor: default"]) .stream-progress {
  cursor: default;
}

.stream-progress {
  background: var(--ai-background-color, #ffffff);
  border: 1px solid var(--ai-border-color, #e5e7eb);
  border-radius: var(--ai-border-radius, 8px);
  padding: var(--ai-spacing, 12px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stream-progress.streaming {
  border-color: var(--ai-primary-color, #3b82f6);
}

.stream-progress.cancelled {
  border-color: #ef4444;
  opacity: 0.7;
}

.message {
  color: var(--ai-text-color, #1f2937);
  font-weight: 500;
  margin-bottom: calc(var(--ai-spacing, 12px) * 0.75);
  font-size: 13px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--ai-spacing, 12px);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ai-primary-color, #3b82f6), var(--ai-secondary-color, #10b981));
  transition: width 0.3s ease;
  border-radius: 4px;
}

.streaming .progress-fill {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: calc(var(--ai-spacing, 12px) * 0.75);
  margin-bottom: var(--ai-spacing, 12px);
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
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-value {
  font-size: 16px;
  color: var(--ai-text-color, #1f2937);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.cancel-button {
  width: 100%;
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: calc(var(--ai-border-radius, 8px) * 0.75);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: inherit;
}

.cancel-button:hover {
  background: #dc2626;
}

.cancel-button:active {
  transform: translateY(1px);
}

.cancel-button:focus-visible {
  outline: 2px solid var(--ai-primary-color, #3b82f6);
  outline-offset: 2px;
}

/* Size variants */
:host([size="compact"]) .stream-progress {
  padding: 8px;
  font-size: 12px;
}

:host([size="compact"]) .progress-bar {
  height: 6px;
}

:host([size="compact"]) .message {
  font-size: 11px;
  margin-bottom: 6px;
}

:host([size="compact"]) .stat-label {
  font-size: 10px;
}

:host([size="compact"]) .stat-value {
  font-size: 14px;
}

:host([size="compact"]) .cancel-button {
  padding: 6px 12px;
  font-size: 11px;
}

:host([size="large"]) .stream-progress {
  padding: 16px;
  font-size: 16px;
}

:host([size="large"]) .progress-bar {
  height: 10px;
}

:host([size="large"]) .message {
  font-size: 15px;
  margin-bottom: 12px;
}

:host([size="large"]) .stat-label {
  font-size: 12px;
}

:host([size="large"]) .stat-value {
  font-size: 18px;
}

:host([size="large"]) .cancel-button {
  padding: 10px 20px;
  font-size: 15px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :host {
    --ai-background-color: #1f2937;
    --ai-text-color: #f9fafb;
    --ai-border-color: #374151;
  }
  
  .progress-bar {
    background: #374151;
  }
  
  .stat-label {
    color: #9ca3af;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .progress-fill {
    transition: none;
  }
  
  .streaming .progress-fill {
    animation: none;
  }
  
  .cancel-button {
    transition: none;
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .stats {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stat-item {
    width: 100%;
  }
}

/* Disabled state */
:host([disabled]) .stream-progress {
  opacity: 0.5;
  pointer-events: none;
}
</style>
`;
