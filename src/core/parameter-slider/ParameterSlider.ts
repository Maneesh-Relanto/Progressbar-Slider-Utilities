import { AIControl } from '../base/AIControl';
import { clamp } from '../base/utils';
import type {
  ParameterSliderConfig,
  ParameterSliderState,
  PresetValue,
  ValueChangeEvent,
  PresetSelectEvent,
} from './types';
import { styles } from './styles';

/**
 * ParameterSlider Component
 *
 * Interactive slider for AI parameter configuration (temperature, top-p, penalties, etc.).
 * Supports presets, manual input, keyboard navigation, and accessibility.
 *
 * @example
 * ```typescript
 * // Create temperature slider
 * const slider = new ParameterSlider({
 *   label: 'Temperature',
 *   min: 0,
 *   max: 2,
 *   value: 0.7,
 *   step: 0.1,
 *   description: 'Controls randomness in responses',
 *   presets: [
 *     { value: 0, label: 'Focused' },
 *     { value: 0.7, label: 'Balanced' },
 *     { value: 1.5, label: 'Creative' }
 *   ]
 * });
 *
 * document.body.appendChild(slider);
 *
 * // Listen to value changes
 * slider.addEventListener('valuechange', (e) => {
 *   console.log('New value:', e.detail.value);
 * });
 *
 * // Get current value
 * const value = slider.getValue();
 *
 * // Set value programmatically
 * slider.setValue(1.2);
 * ```
 *
 * @fires valuechange - Fired when value changes
 * @fires presetselect - Fired when preset is selected
 */
export class ParameterSlider extends AIControl {
  protected override config: Required<ParameterSliderConfig>;
  private readonly state: ParameterSliderState;
  private sliderTrack: HTMLElement | null = null;
  private sliderThumb: HTMLElement | null = null;

  static get observedAttributes() {
    return ['label', 'min', 'max', 'value', 'disabled', 'size', 'variant', 'animation'];
  }

  constructor(config: ParameterSliderConfig = {}) {
    super({
      debug: config.debug ?? false,
      className: config.className,
      ariaLabel: config.ariaLabel ?? `${config.label ?? 'Parameter'} Slider`,
    });

    // Set default configuration
    this.config = {
      label: config.label ?? 'Parameter',
      min: config.min ?? 0,
      max: config.max ?? 1,
      value: config.value ?? 0.5,
      defaultValue: config.defaultValue ?? config.value ?? 0.5,
      step: config.step ?? 0.01,
      decimals: config.decimals ?? 2,
      description: config.description ?? '',
      showPresets: config.showPresets ?? true,
      presets: config.presets ?? [],
      showInput: config.showInput ?? true,
      showReset: config.showReset ?? true,
      showRangeLabels: config.showRangeLabels ?? true,
      unit: config.unit ?? '',
      cursorFeedback: config.cursorFeedback ?? true,
      disabled: config.disabled ?? false,
      debug: config.debug ?? false,
      className: config.className ?? '',
      ariaLabel: config.ariaLabel ?? `${config.label ?? 'Parameter'} Slider`,
      size: config.size ?? 'default',
      variant: config.variant ?? 'default',
      animation: config.animation ?? 'none',
    };

    // Initialize state
    this.state = {
      currentValue: clamp(this.config.value, this.config.min, this.config.max),
      isDragging: false,
      isFocused: false,
    };

    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.render();
    this.attachEventListeners();
    this.log('ParameterSlider mounted');
  }

  override disconnectedCallback(): void {
    this.removeEventListeners();
    super.disconnectedCallback();
  }

  protected override getDefaultRole(): string {
    return 'slider';
  }

  protected override handleAttributeChange(
    name: string,
    _oldValue: string,
    newValue: string
  ): void {
    switch (name) {
      case 'label':
        this.config.label = newValue || 'Parameter';
        this.render();
        break;
      case 'min':
        this.config.min = Number.parseFloat(newValue) || 0;
        this.render();
        break;
      case 'max':
        this.config.max = Number.parseFloat(newValue) || 1;
        this.render();
        break;
      case 'value':
        this.setValue(Number.parseFloat(newValue) || 0.5);
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        this.render();
        break;
      case 'size':
        this.config.size = newValue as any;
        this.render();
        break;
      case 'variant':
        this.config.variant = newValue as any;
        this.render();
        break;
      case 'animation':
        this.config.animation = newValue as any;
        this.render();
        break;
    }
  }

  /**
   * Get current value
   */
  public getValue(): number {
    return this.state.currentValue;
  }

  /**
   * Set value programmatically
   */
  public setValue(value: number, source: 'slider' | 'input' | 'preset' | 'reset' = 'slider'): void {
    const previousValue = this.state.currentValue;
    const clampedValue = clamp(value, this.config.min, this.config.max);

    // Round to step
    const steppedValue = Math.round(clampedValue / this.config.step) * this.config.step;
    const finalValue = Number.parseFloat(steppedValue.toFixed(this.config.decimals));

    if (finalValue === this.state.currentValue) return;

    this.state.currentValue = finalValue;
    this.updateSliderPosition();

    const event: ValueChangeEvent = {
      value: finalValue,
      previousValue,
      source,
      timestamp: Date.now(),
    };

    this.emit('valuechange', event);
    this.log('Value changed', event);
  }

  /**
   * Reset to default value
   */
  public reset(): void {
    this.setValue(this.config.defaultValue, 'reset');
  }

  /**
   * Select a preset value
   */
  public selectPreset(preset: PresetValue): void {
    const previousValue = this.state.currentValue;
    this.setValue(preset.value, 'preset');

    const event: PresetSelectEvent = {
      preset,
      previousValue,
      timestamp: Date.now(),
    };

    this.emit('presetselect', event);
    this.log('Preset selected', event);
  }

  /**
   * Attach event listeners to slider elements
   */
  private attachEventListeners(): void {
    if (!this.shadowRoot) return;

    // Slider track and thumb
    this.sliderTrack = this.shadowRoot.querySelector('.slider-track');
    this.sliderThumb = this.shadowRoot.querySelector('.slider-thumb');

    if (this.sliderTrack) {
      this.sliderTrack.addEventListener('click', this.handleTrackClick.bind(this));
    }

    if (this.sliderThumb) {
      this.sliderThumb.addEventListener('mousedown', this.handleThumbMouseDown.bind(this));
      this.sliderThumb.addEventListener('touchstart', this.handleThumbTouchStart.bind(this), {
        passive: false,
      });
      this.sliderThumb.addEventListener('keydown', this.handleThumbKeyDown.bind(this));
    }

    // Value input
    const input = this.shadowRoot.querySelector('.value-input') as HTMLInputElement;
    if (input) {
      input.addEventListener('change', this.handleInputChange.bind(this));
      input.addEventListener('blur', this.handleInputBlur.bind(this));
    }

    // Reset button
    const resetBtn = this.shadowRoot.querySelector('.reset-button');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Preset buttons
    const presetButtons = this.shadowRoot.querySelectorAll('.preset-button');
    presetButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const preset = this.config.presets[index];
        if (preset) this.selectPreset(preset);
      });
    });
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.handleThumbMouseMove);
    document.removeEventListener('mouseup', this.handleThumbMouseUp);
    document.removeEventListener('touchmove', this.handleThumbTouchMove);
    document.removeEventListener('touchend', this.handleThumbTouchEnd);
  }

  /**
   * Handle track click
   */
  private handleTrackClick(e: MouseEvent): void {
    if (!this.sliderTrack || this.config.disabled) return;

    const rect = this.sliderTrack.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const value = this.config.min + percent * (this.config.max - this.config.min);

    this.setValue(value, 'slider');
  }

  /**
   * Handle thumb mouse down
   */
  private handleThumbMouseDown(e: MouseEvent): void {
    if (this.config.disabled) return;

    e.preventDefault();
    this.state.isDragging = true;
    this.sliderThumb?.classList.add('dragging');

    document.addEventListener('mousemove', this.handleThumbMouseMove);
    document.addEventListener('mouseup', this.handleThumbMouseUp);
  }

  /**
   * Handle thumb mouse move
   */
  private readonly handleThumbMouseMove = (e: MouseEvent): void => {
    if (!this.state.isDragging || !this.sliderTrack) return;

    const rect = this.sliderTrack.getBoundingClientRect();
    const percent = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const value = this.config.min + percent * (this.config.max - this.config.min);

    this.setValue(value, 'slider');
  };

  /**
   * Handle thumb mouse up
   */
  private readonly handleThumbMouseUp = (): void => {
    this.state.isDragging = false;
    this.sliderThumb?.classList.remove('dragging');

    document.removeEventListener('mousemove', this.handleThumbMouseMove);
    document.removeEventListener('mouseup', this.handleThumbMouseUp);
  };

  /**
   * Handle thumb touch start
   */
  private handleThumbTouchStart(e: TouchEvent): void {
    if (this.config.disabled) return;

    e.preventDefault();
    this.state.isDragging = true;
    this.sliderThumb?.classList.add('dragging');

    document.addEventListener('touchmove', this.handleThumbTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleThumbTouchEnd);
  }

  /**
   * Handle thumb touch move
   */
  private readonly handleThumbTouchMove = (e: TouchEvent): void => {
    if (!this.state.isDragging || !this.sliderTrack) return;

    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    const rect = this.sliderTrack.getBoundingClientRect();
    const percent = clamp((touch.clientX - rect.left) / rect.width, 0, 1);
    const value = this.config.min + percent * (this.config.max - this.config.min);

    this.setValue(value, 'slider');
  };

  /**
   * Handle thumb touch end
   */
  private readonly handleThumbTouchEnd = (): void => {
    this.state.isDragging = false;
    this.sliderThumb?.classList.remove('dragging');

    document.removeEventListener('touchmove', this.handleThumbTouchMove);
    document.removeEventListener('touchend', this.handleThumbTouchEnd);
  };

  /**
   * Handle keyboard navigation
   */
  private handleThumbKeyDown(e: KeyboardEvent): void {
    if (this.config.disabled) return;

    let delta = 0;
    const largeStep = this.config.step * 10;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = this.config.step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -this.config.step;
        break;
      case 'PageUp':
        delta = largeStep;
        break;
      case 'PageDown':
        delta = -largeStep;
        break;
      case 'Home':
        this.setValue(this.config.min, 'slider');
        e.preventDefault();
        return;
      case 'End':
        this.setValue(this.config.max, 'slider');
        e.preventDefault();
        return;
      default:
        return;
    }

    e.preventDefault();
    this.setValue(this.state.currentValue + delta, 'slider');
  }

  /**
   * Handle input field change
   */
  private handleInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = Number.parseFloat(input.value);

    if (!Number.isNaN(value)) {
      this.setValue(value, 'input');
    }
  }

  /**
   * Handle input field blur (validate)
   */
  private handleInputBlur(e: Event): void {
    const input = e.target as HTMLInputElement;
    input.value = this.state.currentValue.toFixed(this.config.decimals);
  }

  /**
   * Update slider thumb position based on current value
   */
  private updateSliderPosition(): void {
    if (!this.sliderThumb || !this.shadowRoot) return;

    const percent =
      ((this.state.currentValue - this.config.min) / (this.config.max - this.config.min)) * 100;
    this.sliderThumb.style.left = `${percent}%`;

    const fill = this.shadowRoot.querySelector('.slider-fill') as HTMLElement;
    if (fill) {
      fill.style.width = `${percent}%`;
    }

    // Update value display
    const valueDisplay = this.shadowRoot.querySelector('.current-value');
    if (valueDisplay) {
      valueDisplay.textContent = this.state.currentValue.toFixed(this.config.decimals);
    }

    // Update input field
    const input = this.shadowRoot.querySelector('.value-input') as HTMLInputElement;
    if (input && document.activeElement !== input) {
      input.value = this.state.currentValue.toFixed(this.config.decimals);
    }

    // Update active preset
    this.updateActivePreset();
    this.updateCursor();
  }

  /**
   * Update cursor based on slider state
   */
  private updateCursor(): void {
    if (!this.config.cursorFeedback || !this.sliderThumb) return;

    if (this.config.disabled) {
      this.sliderThumb.style.cursor = 'not-allowed';
    } else if (this.state.isDragging) {
      this.sliderThumb.style.cursor = 'grabbing';
    } else {
      this.sliderThumb.style.cursor = 'grab';
    }
  }

  /**
   * Update active preset button
   */
  private updateActivePreset(): void {
    if (!this.shadowRoot) return;

    const presetButtons = this.shadowRoot.querySelectorAll('.preset-button');
    presetButtons.forEach((btn, index) => {
      const preset = this.config.presets[index];
      if (preset && Math.abs(preset.value - this.state.currentValue) < this.config.step / 2) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Render input controls section
   */
  private renderInputControls(): string {
    if (!this.config.showInput && !this.config.showReset) return '';

    const disabledAttr = this.config.disabled ? 'disabled' : '';
    let controlsHtml = '';

    if (this.config.showInput) {
      controlsHtml += `
        <span class="input-label">Value:</span>
        <input 
          type="number" 
          class="value-input"
          value="${this.state.currentValue.toFixed(this.config.decimals)}"
          min="${this.config.min}"
          max="${this.config.max}"
          step="${this.config.step}"
          ${disabledAttr}
        />
      `;
    }

    if (this.config.showReset) {
      controlsHtml += `
        <button class="reset-button" type="button" ${disabledAttr}>
          Reset
        </button>
      `;
    }

    return `
      <div class="input-container">
        ${controlsHtml}
      </div>
    `;
  }

  /**
   * Render the component
   */
  protected render(): void {
    if (!this.shadowRoot) return;

    // Sync attributes to host element for CSS selectors
    if (this.config.size && this.getAttribute('size') !== this.config.size) {
      this.setAttribute('size', this.config.size);
    }
    if (this.config.variant && this.getAttribute('variant') !== this.config.variant) {
      this.setAttribute('variant', this.config.variant);
    }
    if (this.config.animation && this.getAttribute('animation') !== this.config.animation) {
      this.setAttribute('animation', this.config.animation);
    }

    const disabledClass = this.config.disabled ? 'disabled' : '';

    // Header with label and current value
    const headerHtml = `
      <div class="header">
        <div class="label-section">
          <label class="label">${this.config.label}</label>
          ${this.config.description ? `<div class="description">${this.config.description}</div>` : ''}
        </div>
        <div class="value-display">
          <span class="current-value">${this.state.currentValue.toFixed(this.config.decimals)}</span>
          ${this.config.unit ? `<span class="unit">${this.config.unit}</span>` : ''}
        </div>
      </div>
    `;

    // Slider
    const percent =
      ((this.state.currentValue - this.config.min) / (this.config.max - this.config.min)) * 100;
    const sliderHtml = `
      <div class="slider-container">
        <div class="slider-track" role="presentation">
          <div class="slider-fill" style="width: ${percent}%"></div>
          <div 
            class="slider-thumb" 
            style="left: ${percent}%"
            role="slider"
            tabindex="${this.config.disabled ? -1 : 0}"
            aria-valuemin="${this.config.min}"
            aria-valuemax="${this.config.max}"
            aria-valuenow="${this.state.currentValue}"
            aria-label="${this.config.ariaLabel}"
          ></div>
        </div>
        ${
          this.config.showRangeLabels
            ? `
          <div class="range-labels">
            <span class="range-label">${this.config.min.toFixed(this.config.decimals)}</span>
            <span class="range-label">${this.config.max.toFixed(this.config.decimals)}</span>
          </div>
        `
            : ''
        }
      </div>
    `;

    // Presets
    const presetsHtml =
      this.config.showPresets && this.config.presets.length > 0
        ? `
      <div class="presets">
        ${this.config.presets
          .map(
            (preset) => `
          <button class="preset-button" type="button">
            <span class="preset-value">${preset.value}</span>
            <span class="preset-label">${preset.label}</span>
          </button>
        `
          )
          .join('')}
      </div>
    `
        : '';

    // Input and reset
    const inputHtml = this.renderInputControls();

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="parameter-slider ${disabledClass} ${this.config.className}">
        ${headerHtml}
        ${sliderHtml}
        ${presetsHtml}
        ${inputHtml}
      </div>
    `;

    // Store references after render
    this.sliderTrack = this.shadowRoot.querySelector('.slider-track');
    this.sliderThumb = this.shadowRoot.querySelector('.slider-thumb');

    // Reattach event listeners
    this.attachEventListeners();
  }

  /**
   * Get current state (for debugging)
   */
  public getState(): Readonly<ParameterSliderState> {
    return { ...this.state };
  }

  /**
   * Get current configuration
   */
  public getConfig(): Readonly<Required<ParameterSliderConfig>> {
    return { ...this.config };
  }
}

// Register the custom element
if (!customElements.get('parameter-slider')) {
  customElements.define('parameter-slider', ParameterSlider);
}
