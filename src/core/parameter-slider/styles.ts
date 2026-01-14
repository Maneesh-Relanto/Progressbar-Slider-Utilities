export const styles = `
  <style>
    :host {
      /* CSS variables inherit from document root with fallback defaults */
      display: block;
      width: 100%;
      font-family: var(--ai-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      font-size: var(--ai-font-size, 14px);
    }

    :host([style*="cursor: grab"]) .slider-thumb {
      cursor: grab;
    }

    :host([style*="cursor: grabbing"]) .slider-thumb {
      cursor: grabbing;
    }

    .parameter-slider {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: var(--ai-slider-bg, #1f2937);
      border-radius: 12px;
      color: var(--ai-slider-text, #f9fafb);
      position: relative;
    }

    .parameter-slider.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .label-section {
      flex: 1;
    }

    .label {
      font-size: 14px;
      font-weight: 600;
      color: var(--ai-slider-label, #f9fafb);
      margin-bottom: 4px;
      display: block;
    }

    .description {
      font-size: 12px;
      color: var(--ai-slider-description, #9ca3af);
      line-height: 1.4;
    }

    .value-display {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .current-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--ai-slider-value, #60a5fa);
      font-variant-numeric: tabular-nums;
      min-width: 60px;
      text-align: right;
    }

    .unit {
      font-size: 12px;
      color: var(--ai-slider-description, #9ca3af);
      font-weight: 500;
    }

    /* Slider Container */
    .slider-container {
      position: relative;
      padding: 8px 0;
    }

    .slider-track {
      position: relative;
      height: 6px;
      background: var(--ai-slider-track-bg, #374151);
      border-radius: 3px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .slider-track:hover {
      background: var(--ai-slider-track-hover, #4b5563);
    }

    .slider-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, 
        var(--ai-slider-fill-start, #3b82f6) 0%, 
        var(--ai-slider-fill-end, #60a5fa) 100%
      );
      border-radius: 3px;
      transition: width 0.2s ease;
    }

    .slider-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background: var(--ai-slider-thumb, #ffffff);
      border: 3px solid var(--ai-slider-thumb-border, #3b82f6);
      border-radius: 50%;
      cursor: grab;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .slider-thumb:hover {
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .slider-thumb:active,
    .slider-thumb.dragging {
      cursor: grabbing;
      transform: translate(-50%, -50%) scale(1.15);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5);
    }

    .slider-thumb:focus-visible {
      outline: 2px solid var(--ai-slider-focus, #60a5fa);
      outline-offset: 2px;
    }

    /* Range Labels */
    .range-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
    }

    .range-label {
      font-size: 11px;
      color: var(--ai-slider-description, #9ca3af);
      font-variant-numeric: tabular-nums;
    }

    /* Presets */
    .presets {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .preset-button {
      flex: 1;
      min-width: 80px;
      padding: 8px 12px;
      background: var(--ai-slider-preset-bg, #374151);
      color: var(--ai-slider-preset-text, #d1d5db);
      border: 1px solid var(--ai-slider-preset-border, #4b5563);
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .preset-button:hover {
      background: var(--ai-slider-preset-hover, #4b5563);
      border-color: var(--ai-slider-preset-hover-border, #60a5fa);
      transform: translateY(-1px);
    }

    .preset-button.active {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      color: #ffffff;
      border-color: #3b82f6;
    }

    .preset-value {
      font-size: 14px;
      font-weight: 700;
    }

    .preset-label {
      font-size: 10px;
      opacity: 0.8;
    }

    /* Input Field */
    .input-container {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .input-label {
      font-size: 12px;
      color: var(--ai-slider-description, #9ca3af);
      flex-shrink: 0;
    }

    .value-input {
      flex: 1;
      padding: 8px 12px;
      background: var(--ai-slider-input-bg, #374151);
      border: 1px solid var(--ai-slider-input-border, #4b5563);
      border-radius: 6px;
      color: var(--ai-slider-text, #f9fafb);
      font-size: 14px;
      font-family: inherit;
      font-variant-numeric: tabular-nums;
      transition: border-color 0.2s;
    }

    .value-input:hover {
      border-color: var(--ai-slider-input-hover, #6b7280);
    }

    .value-input:focus {
      outline: none;
      border-color: var(--ai-slider-focus, #60a5fa);
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }

    .reset-button {
      padding: 8px 16px;
      background: var(--ai-slider-reset-bg, #374151);
      color: var(--ai-slider-reset-text, #d1d5db);
      border: 1px solid var(--ai-slider-reset-border, #4b5563);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .reset-button:hover {
      background: var(--ai-slider-reset-hover, #4b5563);
      border-color: var(--ai-slider-reset-hover-border, #6b7280);
    }

    .reset-button:active {
      transform: scale(0.95);
    }

    /* Visual Variants */

    /* Minimal variant - clean, no shadows */
    :host([variant="minimal"]) .parameter-slider {
      box-shadow: none;
      border: 1px solid var(--ai-slider-border, #374151);
    }

    :host([variant="minimal"]) .slider-track {
      background: transparent;
      border: 1px solid var(--ai-slider-track-bg, #374151);
    }

    /* Gradient variant - colorful gradients */
    :host([variant="gradient"]) .slider-fill {
      background: linear-gradient(
        90deg,
        var(--ai-slider-fill-start, #3b82f6),
        var(--ai-slider-fill-end, #60a5fa),
        var(--ai-slider-fill-start, #3b82f6)
      );
      background-size: 200% 100%;
      animation: gradient-shift 3s ease-in-out infinite;
    }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Override default animation when animation attribute is set */
    :host([animation][variant="gradient"]) .slider-fill {
      animation: none !important;
    }

    /* Glassmorphic variant - frosted glass effect */
    :host([variant="glassmorphic"]) .parameter-slider {
      background: rgba(31, 41, 55, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    :host([variant="glassmorphic"]) .slider-track {
      background: rgba(0, 0, 0, 0.2);
    }

    :host([variant="glassmorphic"]) .slider-fill {
      background: linear-gradient(
        90deg,
        rgba(59, 130, 246, 0.8),
        rgba(96, 165, 250, 0.8)
      );
    }

    /* Animation Effects */

    /* Striped animation */
    :host([animation="striped"]) .slider-fill {
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
        linear-gradient(to right, var(--ai-slider-fill-start, #3b82f6), var(--ai-slider-fill-end, #3b82f6)) !important;
      background-size: 2rem 2rem, 100% 100% !important;
      animation: slider-stripes 3s linear infinite !important;
    }

    @keyframes slider-stripes {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 2rem 0, 0 0; }
    }

    /* Pulse animation */
    :host([animation="pulse"]) .slider-fill {
      animation: slider-pulse 4s ease-in-out infinite !important;
    }

    @keyframes slider-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Glow animation */
    :host([animation="glow"]) .slider-fill {
      animation: slider-glow 4s ease-in-out infinite !important;
    }

    @keyframes slider-glow {
      0%, 100% { 
        box-shadow: 0 0 5px var(--ai-slider-fill-start, #3b82f6),
                    0 0 10px var(--ai-slider-fill-start, #3b82f6);
      }
      50% { 
        box-shadow: 0 0 20px var(--ai-slider-fill-start, #3b82f6), 
                    0 0 35px var(--ai-slider-fill-start, #3b82f6),
                    0 0 50px var(--ai-slider-fill-start, #3b82f6);
      }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .parameter-slider {
        padding: 12px;
      }

      .header {
        flex-direction: column;
      }

      .value-display {
        align-self: flex-end;
      }

      .presets {
        flex-direction: column;
      }

      .preset-button {
        min-width: unset;
      }
    }

    /* Size variants */
    :host([size="compact"]) .parameter-slider {
      padding: 8px;
      font-size: 12px;
      gap: 8px;
    }

    :host([size="compact"]) .slider-track {
      height: 4px;
    }

    :host([size="compact"]) .slider-thumb {
      width: 16px;
      height: 16px;
    }

    :host([size="compact"]) .label {
      font-size: 12px;
    }

    :host([size="compact"]) .current-value {
      font-size: 16px;
    }

    :host([size="compact"]) .description {
      font-size: 10px;
    }

    :host([size="large"]) .parameter-slider {
      padding: 16px;
      font-size: 16px;
      gap: 16px;
    }

    :host([size="large"]) .slider-track {
      height: 8px;
    }

    :host([size="large"]) .slider-thumb {
      width: 24px;
      height: 24px;
    }

    :host([size="large"]) .label {
      font-size: 16px;
    }

    :host([size="large"]) .current-value {
      font-size: 20px;
    }

    :host([size="large"]) .description {
      font-size: 14px;
    }

    /* Dark mode overrides (already default, but can be customized) */
    @media (prefers-color-scheme: light) {
      .parameter-slider {
        background: #ffffff;
        color: #1f2937;
      }

      .label {
        color: #1f2937;
      }

      .description,
      .range-label,
      .input-label {
        color: #6b7280;
      }

      .slider-track {
        background: #e5e7eb;
      }

      .slider-track:hover {
        background: #d1d5db;
      }

      .preset-button {
        background: #f3f4f6;
        color: #374151;
        border-color: #d1d5db;
      }

      .preset-button:hover {
        background: #e5e7eb;
      }

      .value-input,
      .reset-button {
        background: #f9fafb;
        color: #1f2937;
        border-color: #d1d5db;
      }
    }
  </style>
`;
