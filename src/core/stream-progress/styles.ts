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
  /* Default pulse animation - will be overridden by animation attribute */
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

/* Visual Variants */

/* Minimal variant - clean, no shadows */
:host([variant="minimal"]) .stream-progress {
  box-shadow: none;
  border: 1px solid var(--ai-border-color, #e5e7eb);
}

:host([variant="minimal"]) .progress-bar {
  background: transparent;
  border: 1px solid var(--ai-border-color, #e5e7eb);
}

/* Gradient variant - colorful gradients */
:host([variant="gradient"]) .progress-fill {
  background: linear-gradient(
    90deg,
    var(--ai-primary-color, #3b82f6),
    var(--ai-secondary-color, #10b981),
    var(--ai-primary-color, #3b82f6)
  );
  background-size: 200% 100%;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Override gradient animation when custom animation is set */
:host([animation]:not([animation="none"])[variant="gradient"]) .progress-fill {
  animation: none !important;
}

/* Glassmorphic variant - frosted glass effect */
:host([variant="glassmorphic"]) .stream-progress {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

:host([variant="glassmorphic"]) .progress-bar {
  background: rgba(0, 0, 0, 0.1);
}

:host([variant="glassmorphic"]) .progress-fill {
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.8),
    rgba(16, 185, 129, 0.8)
  );
}

/* Animation Effects */

/* Striped animation - layer stripes on top of existing background */
:host([animation="striped"]) .streaming .progress-fill,
:host([animation="striped"]) .progress-fill {
  background-image: 
    linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    ),
    linear-gradient(to right, var(--ai-primary-color, #3b82f6), var(--ai-primary-color, #3b82f6)) !important;
  background-size: 2rem 2rem, 100% 100% !important;
  animation: progress-stripes 3s linear infinite !important;
}

@keyframes progress-stripes {
  0% { background-position: 0 0, 0 0; }
  100% { background-position: 2rem 0, 0 0; }
}

/* Pulse animation */
:host([animation="pulse"]) .streaming .progress-fill,
:host([animation="pulse"]) .progress-fill {
  animation: progress-pulse 4s ease-in-out infinite !important;
}

@keyframes progress-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Glow animation */
:host([animation="glow"]) .streaming .progress-fill,
:host([animation="glow"]) .progress-fill {
  animation: progress-glow 4s ease-in-out infinite !important;
}

@keyframes progress-glow {
  0%, 100% { 
    box-shadow: 0 0 5px var(--ai-primary-color, #3b82f6),
                0 0 10px var(--ai-primary-color, #3b82f6);
  }
  50% { 
    box-shadow: 0 0 20px var(--ai-primary-color, #3b82f6), 
                0 0 35px var(--ai-primary-color, #3b82f6),
                0 0 50px var(--ai-primary-color, #3b82f6);
  }
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
