# 🅰️ Angular Integration Guide

## Quick Start

Angular has **native support** for Web Components using `CUSTOM_ELEMENTS_SCHEMA`. No adapter needed!

### Installation

```bash
npm install ai-progress-controls
```

### Basic Setup

**Step 1: Enable Custom Elements**

```typescript
// app.config.ts (Angular 17+ standalone)
import { ApplicationConfig, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // your providers
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
};
```

Or for module-based apps:

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**Step 2: Register Components**

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from 'ai-progress-controls';
import 'ai-progress-controls/dist/style.css';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

defineCustomElements();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

**Step 3: Use in Templates**

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>AI Progress Controls</h1>

      <stream-progress
        [attr.tokens-generated]="tokens"
        [attr.max-tokens]="2000"
        [attr.show-rate]="true"
        [attr.show-cost]="true"
        [attr.cost-per-token]="0.00003"
      ></stream-progress>

      <button (click)="startStreaming()">Start Stream</button>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
    `,
  ],
})
export class AppComponent {
  tokens = 0;

  async startStreaming() {
    this.tokens = 0;
    for (let i = 0; i <= 2000; i += 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.tokens = i;
    }
  }
}
```

---

## Complete Example - AI Chat Application

```typescript
// ai-chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-chat">
      <h1>AI Chat Interface</h1>

      <!-- Model Loading -->
      <section class="section">
        <h2>Model Status</h2>
        <model-loader
          [attr.is-loading]="isLoading"
          [attr.progress]="modelProgress"
          [attr.model-name]="'GPT-4'"
          [attr.stage]="modelStage"
        ></model-loader>
        <button (click)="loadModel()" [disabled]="isLoading">
          {{ isLoading ? 'Loading...' : 'Load Model' }}
        </button>
      </section>

      <!-- Parameter Controls -->
      <section class="section">
        <h2>Configuration</h2>
        <parameter-slider
          [attr.value]="temperature"
          [attr.min]="0"
          [attr.max]="2"
          [attr.step]="0.1"
          [attr.label]="'Temperature'"
          [attr.description]="'Controls randomness in responses'"
          (change)="onTemperatureChange($event)"
        ></parameter-slider>
        <p>Current temperature: {{ temperature }}</p>

        <parameter-slider
          [attr.value]="topP"
          [attr.min]="0"
          [attr.max]="1"
          [attr.step]="0.1"
          [attr.label]="'Top P'"
          [attr.description]="'Nucleus sampling threshold'"
          (change)="onTopPChange($event)"
        ></parameter-slider>
      </section>

      <!-- Queue Status -->
      <section class="section" *ngIf="queuePosition > 0">
        <h2>Queue Status</h2>
        <queue-progress
          [attr.position]="queuePosition"
          [attr.total-in-queue]="5"
          [attr.estimated-wait-time]="queuePosition * 1000"
        ></queue-progress>
      </section>

      <!-- Token Streaming -->
      <section class="section">
        <h2>Token Streaming</h2>
        <stream-progress
          [attr.tokens-generated]="tokens"
          [attr.max-tokens]="maxTokens"
          [attr.show-rate]="true"
          [attr.show-cost]="true"
          [attr.cost-per-token]="0.00003"
          [attr.theme]="'openai'"
          [attr.variant]="'gradient'"
        ></stream-progress>
      </section>

      <!-- Batch Processing -->
      <section class="section" *ngIf="batchItems.length > 0">
        <h2>Batch Processing</h2>
        <batch-progress
          [attr.items]="batchItemsJson"
          [attr.total-items]="batchItems.length"
          [attr.concurrency]="2"
          [attr.show-individual-progress]="true"
        ></batch-progress>
      </section>

      <!-- Chat Interface -->
      <section class="section">
        <h2>Chat</h2>
        <form (ngSubmit)="sendMessage()" class="chat-form">
          <input
            type="text"
            [(ngModel)]="message"
            name="message"
            placeholder="Type your message..."
            [disabled]="isStreaming"
          />
          <button type="submit" [disabled]="isStreaming || !message.trim()">
            {{ isStreaming ? 'Streaming...' : 'Send' }}
          </button>
        </form>

        <div *ngIf="response" class="response">
          <h3>Response:</h3>
          <p>{{ response }}</p>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .ai-chat {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
      }

      .section {
        margin: 2rem 0;
        padding: 1.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #f9fafb;
      }

      .section h2 {
        margin-top: 0;
        font-size: 1.25rem;
        color: #1f2937;
      }

      button {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 1rem;
      }

      button:hover:not(:disabled) {
        background: #2563eb;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .chat-form {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
      }

      .chat-form input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 1rem;
      }

      .response {
        margin-top: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }

      .response h3 {
        margin-top: 0;
        font-size: 1rem;
        color: #6b7280;
      }

      .response p {
        margin: 0;
        line-height: 1.6;
      }
    `,
  ],
})
export class AIChatComponent implements OnInit, OnDestroy {
  // Model state
  isLoading = false;
  modelProgress = 0;
  modelStage: 'download' | 'initialize' | 'ready' = 'download';

  // Parameters
  temperature = 0.7;
  topP = 0.9;

  // Streaming state
  tokens = 0;
  maxTokens = 2000;
  isStreaming = false;
  queuePosition = 0;

  // Chat state
  message = '';
  response = '';

  // Batch state
  batchItems: any[] = [];
  batchItemsJson = '[]';

  ngOnInit() {
    this.loadModel();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadModel() {
    this.isLoading = true;
    this.modelProgress = 0;
    this.modelStage = 'download';

    // Simulate download phase
    for (let i = 0; i <= 100; i += 10) {
      this.modelProgress = i;
      await this.delay(100);
    }

    // Simulate initialization phase
    this.modelStage = 'initialize';
    this.modelProgress = 0;
    for (let i = 0; i <= 100; i += 20) {
      this.modelProgress = i;
      await this.delay(50);
    }

    this.modelStage = 'ready';
    this.isLoading = false;
  }

  async sendMessage() {
    if (!this.message.trim()) return;

    this.isStreaming = true;
    this.tokens = 0;
    this.response = '';

    // Simulate queue
    this.queuePosition = Math.floor(Math.random() * 3) + 1;
    while (this.queuePosition > 0) {
      await this.delay(1000);
      this.queuePosition--;
    }

    try {
      // Simulate API call
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: this.message,
          temperature: this.temperature,
          topP: this.topP,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        this.response += chunk;
        this.tokens++;
      }
    } catch (error) {
      console.error('Streaming error:', error);
      // Simulate streaming for demo
      for (let i = 0; i < 50; i++) {
        this.response += 'Token ';
        this.tokens++;
        await this.delay(50);
      }
    } finally {
      this.isStreaming = false;
      this.message = '';
    }
  }

  onTemperatureChange(event: Event) {
    const customEvent = event as CustomEvent;
    this.temperature = customEvent.detail.value;
  }

  onTopPChange(event: Event) {
    const customEvent = event as CustomEvent;
    this.topP = customEvent.detail.value;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

---

## Service Integration

```typescript
// services/ai.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AIState {
  tokens: number;
  isStreaming: boolean;
  modelLoaded: boolean;
  temperature: number;
  topP: number;
}

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private state = new BehaviorSubject<AIState>({
    tokens: 0,
    isStreaming: false,
    modelLoaded: false,
    temperature: 0.7,
    topP: 0.9,
  });

  state$: Observable<AIState> = this.state.asObservable();

  async streamChat(message: string): Promise<void> {
    this.updateState({ isStreaming: true, tokens: 0 });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          temperature: this.state.value.temperature,
          topP: this.state.value.topP,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        this.updateState({
          tokens: this.state.value.tokens + chunk.split(' ').length,
        });
      }
    } finally {
      this.updateState({ isStreaming: false });
    }
  }

  setTemperature(value: number): void {
    this.updateState({ temperature: value });
  }

  setTopP(value: number): void {
    this.updateState({ topP: value });
  }

  private updateState(partial: Partial<AIState>): void {
    this.state.next({ ...this.state.value, ...partial });
  }
}
```

Usage in component:

```typescript
import { Component, OnInit } from '@angular/core';
import { AIService } from './services/ai.service';

@Component({
  selector: 'app-chat',
  template: `
    <stream-progress
      [attr.tokens-generated]="(aiService.state$ | async)?.tokens"
      [attr.max-tokens]="2000"
    ></stream-progress>
  `,
})
export class ChatComponent {
  constructor(public aiService: AIService) {}
}
```

---

## TypeScript Types

```typescript
// types/web-components.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'stream-progress': {
      'tokens-generated'?: number;
      'max-tokens'?: number;
      'show-rate'?: boolean;
      'show-cost'?: boolean;
      'cost-per-token'?: number;
      theme?: string;
      variant?: string;
      size?: string;
      animation?: string;
    };
    'model-loader': {
      'is-loading'?: boolean;
      progress?: number;
      'model-name'?: string;
      stage?: 'download' | 'extract' | 'initialize' | 'ready';
      'show-size'?: boolean;
      'model-size'?: number;
    };
    'parameter-slider': {
      value?: number;
      min?: number;
      max?: number;
      step?: number;
      label?: string;
      description?: string;
      disabled?: boolean;
    };
    'parameter-panel': {
      parameters?: string; // JSON string
      layout?: 'vertical' | 'horizontal';
      'show-presets'?: boolean;
    };
    'queue-progress': {
      position?: number;
      'total-in-queue'?: number;
      'estimated-wait-time'?: number;
      'show-eta'?: boolean;
    };
    'retry-progress': {
      attempt?: number;
      'max-attempts'?: number;
      'next-retry-in'?: number;
      strategy?: 'linear' | 'exponential';
    };
    'batch-progress': {
      items?: string; // JSON string
      'total-items'?: number;
      concurrency?: number;
      'show-individual-progress'?: boolean;
    };
  }
}
```

---

## RxJS Integration

```typescript
// components/stream-progress.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject, takeUntil, scan } from 'rxjs';

@Component({
  selector: 'app-stream-progress',
  template: `
    <stream-progress
      [attr.tokens-generated]="tokens"
      [attr.max-tokens]="2000"
      [attr.show-rate]="true"
    ></stream-progress>
  `,
})
export class StreamProgressComponent implements OnInit, OnDestroy {
  tokens = 0;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Simulate token streaming with RxJS
    interval(100)
      .pipe(
        takeUntil(this.destroy$),
        scan((acc) => acc + 50, 0)
      )
      .subscribe((tokens) => {
        if (tokens <= 2000) {
          this.tokens = tokens;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Angular Universal (SSR)

```typescript
// app.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isBrowser">
      <stream-progress [attr.tokens-generated]="tokens" [attr.max-tokens]="2000"></stream-progress>
    </div>
  `,
})
export class AppComponent implements OnInit {
  isBrowser: boolean;
  tokens = 0;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Only import and define custom elements in browser
      import('ai-progress-controls').then((module) => {
        module.defineCustomElements();
      });
    }
  }
}
```

---

## Testing

```typescript
// app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements in tests
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should update tokens', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.tokens = 500;
    fixture.detectChanges();

    expect(app.tokens).toBe(500);
  });
});
```

---

## Best Practices

### 1. Use Property Binding with `attr.`

```html
<!-- ✅ Correct: Use [attr.] for custom element properties -->
<stream-progress [attr.tokens-generated]="tokens" [attr.max-tokens]="2000"></stream-progress>

<!-- ❌ Wrong: Direct property binding doesn't work -->
<stream-progress [tokens-generated]="tokens" [max-tokens]="2000"></stream-progress>
```

### 2. Handle Custom Events

```typescript
@Component({
  template: `
    <parameter-slider [attr.value]="temperature" (change)="handleChange($event)"></parameter-slider>
  `,
})
export class MyComponent {
  temperature = 0.7;

  handleChange(event: Event) {
    const customEvent = event as CustomEvent;
    this.temperature = customEvent.detail.value;
  }
}
```

### 3. JSON Serialization for Complex Props

```typescript
@Component({
  template: ` <batch-progress [attr.items]="batchItemsJson"></batch-progress> `,
})
export class MyComponent {
  batchItems = [
    { id: '1', status: 'pending', progress: 0 },
    { id: '2', status: 'processing', progress: 50 },
  ];

  get batchItemsJson(): string {
    return JSON.stringify(this.batchItems);
  }
}
```

### 4. Lazy Load for Better Performance

```typescript
// Only load when needed
async loadAIComponents() {
  const { defineCustomElements } = await import('ai-progress-controls');
  await import('ai-progress-controls/dist/style.css');
  defineCustomElements();
}
```

---

## Why No Angular Adapter Needed

Angular's Web Components support is **solid** because:

✅ **CUSTOM_ELEMENTS_SCHEMA** - Official support  
✅ **Property binding** - Works with `[attr.]` prefix  
✅ **Event handling** - Standard `(event)` syntax  
✅ **TypeScript** - Easily typeable with declarations  
✅ **SSR compatible** - Works with Angular Universal  
✅ **Testing support** - Works in Jasmine/Karma tests

**Angular treats Web Components as first-class citizens.**

---

## Common Patterns

### Loading States

```typescript
@Component({
  template: `
    <model-loader
      *ngIf="isLoading"
      [attr.is-loading]="true"
      [attr.progress]="progress"
    ></model-loader>

    <div *ngIf="!isLoading">
      <!-- Your content -->
    </div>
  `,
})
export class LoadingComponent {
  isLoading = true;
  progress = 0;
}
```

### Form Integration

```typescript
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="aiForm">
      <parameter-slider
        [attr.value]="aiForm.get('temperature')?.value"
        (change)="onTempChange($event)"
      ></parameter-slider>
    </form>
  `,
})
export class AIFormComponent {
  aiForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.aiForm = this.fb.group({
      temperature: [0.7],
      topP: [0.9],
    });
  }

  onTempChange(event: Event) {
    const value = (event as CustomEvent).detail.value;
    this.aiForm.patchValue({ temperature: value });
  }
}
```

---

## Need Help?

- 📖 [Main Documentation](../README.md)
- 🚀 [Getting Started](./getting-started.md)
- 📦 [npm Package](https://www.npmjs.com/package/ai-progress-controls)
- 💬 [GitHub Issues](https://github.com/Maneesh-Relanto/ai-progress-controls/issues)
