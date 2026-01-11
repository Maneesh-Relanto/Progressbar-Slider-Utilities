/**
 * Test setup file for Vitest
 * Configures jsdom environment and utilities for Web Components testing
 */

import { beforeAll, afterEach, vi } from 'vitest';

// Mock window.customElements if not available
beforeAll(() => {
  if (!window.customElements) {
    // @ts-ignore - Mock for testing
    window.customElements = {
      define: vi.fn(),
      get: vi.fn(),
      upgrade: vi.fn(),
      whenDefined: vi.fn(() => Promise.resolve()),
    };
  }
});

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Polyfill for Custom Elements if needed
if (!window.customElements) {
  class CustomElementRegistry {
    private definitions = new Map<string, CustomElementConstructor>();

    define(name: string, constructor: CustomElementConstructor) {
      this.definitions.set(name, constructor);
    }

    get(name: string) {
      return this.definitions.get(name);
    }

    whenDefined(name: string): Promise<CustomElementConstructor> {
      return Promise.resolve(this.definitions.get(name)!);
    }

    upgrade(root: Node) {
      // No-op for testing
    }
  }

  // @ts-ignore
  window.customElements = new CustomElementRegistry();
}

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Helper to wait for custom element to be defined
export async function waitForElement(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (element.shadowRoot) {
      resolve();
    } else {
      setTimeout(resolve, 0);
    }
  });
}

// Helper to wait for async operations
export function waitForNextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Helper to wait for multiple ticks
export function waitForTicks(count: number): Promise<void> {
  return new Promise((resolve) => {
    let ticks = 0;
    const tick = () => {
      ticks++;
      if (ticks >= count) {
        resolve();
      } else {
        setTimeout(tick, 0);
      }
    };
    tick();
  });
}
