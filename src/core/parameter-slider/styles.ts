export const styles = `
  <style>
    :host {
      display: block;
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
