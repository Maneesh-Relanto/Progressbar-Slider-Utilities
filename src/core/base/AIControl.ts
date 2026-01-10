import type { AIControlConfig, ThemeConfig } from './types';

/**
 * Base class for all AI Progress Controls
 * Provides common functionality for Web Components including:
 * - Theme management
 * - Event handling
 * - Accessibility features
 * - Debug logging
 * 
 * @example
 * ```typescript
 * class MyControl extends AIControl {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *   }
 * 
 *   protected render() {
 *     // Your rendering logic
 *   }
 * }
 * ```
 */
export abstract class AIControl extends HTMLElement {
  protected config: AIControlConfig;
  protected _disabled: boolean = false;
  protected startTime: number = 0;

  constructor(config: AIControlConfig = {}) {
    super();
    this.config = {
      debug: false,
      disabled: false,
      ...config,
    };
    this._disabled = this.config.disabled ?? false;
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback(): void {
    this.log('Component connected to DOM');
    this.applyTheme();
    this.setupAccessibility();
    this.render();
  }

  /**
   * Called when the element is disconnected from the DOM
   */
  disconnectedCallback(): void {
    this.log('Component disconnected from DOM');
    this.cleanup();
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    this.handleAttributeChange(name, oldValue, newValue);
  }

  /**
   * Apply theme using CSS custom properties
   */
  protected applyTheme(theme?: ThemeConfig): void {
    if (!theme) return;

    const root = this.shadowRoot?.host as HTMLElement;
    if (!root) return;

    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = `--ai-${key.replaceAll(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }

  /**
   * Set up accessibility features (ARIA attributes, keyboard navigation)
   */
  protected setupAccessibility(): void {
    // Set role if not already set
    if (!this.getAttribute('role')) {
      this.setAttribute('role', this.getDefaultRole());
    }

    // Set aria-label if configured
    if (this.config.ariaLabel) {
      this.setAttribute('aria-label', this.config.ariaLabel);
    }

    // Set disabled state
    if (this._disabled) {
      this.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * Emit a custom event
   */
  protected emit<T>(eventName: string, detail?: T): void {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
    this.log(`Event emitted: ${eventName}`, detail);
  }

  /**
   * Log debug messages (only if debug mode is enabled)
   */
  protected log(message: string, ...args: unknown[]): void {
    if (this.config.debug) {
      console.log(`[${this.constructor.name}] ${message}`, ...args);
    }
  }

  /**
   * Log errors (always logged)
   */
  protected logError(message: string, error?: Error): void {
    console.error(`[${this.constructor.name}] ERROR: ${message}`, error);
  }

  /**
   * Start timing an operation
   */
  protected startTimer(): void {
    this.startTime = Date.now();
  }

  /**
   * Get elapsed time since timer started
   */
  protected getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Format numbers for display (e.g., 1234 -> "1.2K")
   */
  protected formatNumber(num: number): string {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  }

  /**
   * Format duration in milliseconds to human-readable string
   */
  protected formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  /**
   * Calculate percentage safely
   */
  protected calculatePercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.min(100, Math.max(0, (current / total) * 100));
  }

  /**
   * Get/Set disabled state
   */
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    if (value) {
      this.setAttribute('aria-disabled', 'true');
      this.setAttribute('disabled', '');
    } else {
      this.setAttribute('aria-disabled', 'false');
      this.removeAttribute('disabled');
    }
    this.render();
  }

  /**
   * Abstract method to render the component
   * Must be implemented by subclasses
   */
  protected abstract render(): void;

  /**
   * Get the default ARIA role for this component
   * Can be overridden by subclasses
   */
  protected getDefaultRole(): string {
    return 'region';
  }

  /**
   * Handle attribute changes
   * Can be overridden by subclasses to handle specific attributes
   */
  protected handleAttributeChange(_name: string, _oldValue: string, _newValue: string): void {
    // Override in subclasses
  }

  /**
   * Cleanup resources when component is destroyed
   * Can be overridden by subclasses
   */
  protected cleanup(): void {
    // Override in subclasses
  }
}
