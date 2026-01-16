<div align="center">

# 🚀 Getting Started with AI Progress Controls

### **React, Next.js, or Web Components - Your choice!**

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-22c55e?style=flat-square)](https://webcomponents.org)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-f59e0b?style=flat-square)](https://bundlephobia.com)

</div>

---

## 🎯 What You'll Build

AI Progress Controls provides **7 production-ready components** for AI/ML workflows:

<table>
<tr>
<td width="50%">

### 🎨 **UI Components**

1. 🌊 **StreamProgress** - Token streaming with cost tracking
2. 📥 **ModelLoader** - Multi-stage model loading
3. 🎛️ **ParameterSlider** - LLM parameter controls
4. 🎚️ **ParameterPanel** - Multi-parameter configuration
5. ⏳ **QueueProgress** - Queue position tracking
6. 🔄 **RetryProgress** - Exponential backoff retry
7. 📊 **BatchProgress** - Batch processing progress

</td>
<td width="50%">

### ⚡ **Key Features**

✓ **Single import** - Drop in and use immediately  
✓ **ANY framework** - React, Vue, Angular, Svelte, etc.  
✓ **Zero dependencies** - lightweight and fast  
✓ **TypeScript first** - complete type definitions  
✓ **Accessibility** - WCAG AA compliant  
✓ **4 visual variants** - default, minimal, gradient, glassmorphic  
✓ **4 animations** - none, striped, pulse, glow  
✓ **Themeable** - CSS variables, dark mode

</td>
</tr>
</table>

---

## 📦 Installation

### ⚛️ **React (Recommended)**

```bash
npm install ai-progress-controls @ai-progress-controls/react
```

See [⚛️ React Adapter Documentation](../adapters/react/README.md) for complete guide.

---

### ▲ **Next.js (Recommended)**

```bash
npm install ai-progress-controls @ai-progress-controls/next
```

See [▲ Next.js Adapter Documentation](../adapters/next/README.md) for complete guide.

---

### 🌐 **Web Components (Universal)**

Works with Vue, Angular, Svelte, or plain JavaScript.

#### **Option 1: Local Development (Current)**

```bash
# Clone repository
git clone https://github.com/Maneesh-Relanto/ai-progress-controls.git
cd ai-progress-controls

# Install dependencies
npm install

# Start dev server
npm run dev  # Opens http://localhost:5173

# Build for production
npm run build
```

### **Option 2: NPM (Coming Soon)**

```bash
# Once published to npm:
npm install ai-progress-controls
# yarn add ai-progress-controls
# pnpm add ai-progress-controls
```

### **Option 3: CDN (Coming Soon)**

```html
<!-- Will be available after npm publish: -->
<script type="module">
  import { StreamProgress } from 'https://cdn.jsdelivr.net/npm/ai-progress-controls/+esm';
</script>
```

---

## ⚡ Quick Start

<div align="center">

### **Choose your framework:**

</div>

### 1️⃣ **React**

```tsx
import { StreamProgress } from '@ai-progress-controls/react';
import { useState } from 'react';

function App() {
  const [tokens, setTokens] = useState(0);

  return <StreamProgress maxTokens={2000} tokensGenerated={tokens} showCost={true} />;
}
```

[📖 Full React Guide](../adapters/react/README.md)

---

### 2️⃣ **Next.js**

```tsx
// app/page.tsx (App Router)
import { StreamProgress } from '@ai-progress-controls/next';

export default function Page() {
  return <StreamProgress maxTokens={2000} model="gpt-4" showRate={true} />;
}
```

[📖 Full Next.js Guide](../adapters/next/README.md)

---

### 3️⃣ **Web Components (Vanilla JavaScript)**

Here's the complete 3-line setup with optional configuration:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My AI App</title>
  </head>
  <body>
    <div id="app"></div>

    <script type="module">
      import { StreamProgress } from 'ai-progress-controls';

      // THE 3 STEPS:
      // Step 1: Import (done above)
      // Step 2: Create
      const progress = new StreamProgress({
        maxTokens: 2000,
        costPerToken: 0.00002,
        showRate: true,
        showCost: true,
      });

      // Step 3: Append to DOM
      document.getElementById('app').appendChild(progress);

      // DONE! Component is ready.
      // Now use it:
      progress.start('Generating response...');

      // Update progress (you'd get this from your AI API)
      let tokens = 0;
      const interval = setInterval(() => {
        tokens += 25;
        progress.update({
          tokensGenerated: tokens,
          tokensPerSecond: 25,
        });

        if (tokens >= 500) {
          clearInterval(interval);
          progress.complete();
        }
      }, 100);

      // Listen to events
      progress.addEventListener('streamcomplete', (e) => {
        console.log('Stream completed!', e.detail);
      });
    </script>
  </body>
</html>
```

### 2️⃣ **With OpenAI Streaming (Real-World Example)**

Here's a complete example integrating with OpenAI's API - **just import, create, and append!**

```javascript
import { StreamProgress } from 'ai-progress-controls';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For client-side only
});

async function streamChatCompletion(prompt) {
  // SETUP IN 3 STEPS:
  // Step 1: Import (done above)
  // Step 2: Create instance
  const progress = new StreamProgress({
    maxTokens: 2000,
    costPerToken: 0.00003, // GPT-4 pricing
    showRate: true,
    showCost: true,
  });

  // Step 3: Append to DOM
  document.body.appendChild(progress);

  // DONE! Now use it with OpenAI:
  try {
    progress.start('Connecting to OpenAI...');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: 2000,
    });

    let tokens = 0;
    let lastUpdate = Date.now();
    let content = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        content += delta;
        tokens++;

        // Update every 100ms for smooth progress
        const now = Date.now();
        if (now - lastUpdate > 100) {
          const rate = 1000 / (now - lastUpdate);
          progress.update({
            tokensGenerated: tokens,
            tokensPerSecond: rate,
            message: 'Generating...',
          });
          lastUpdate = now;
        }
      }

      if (chunk.choices[0]?.finish_reason) {
        progress.complete();
        break;
      }
    }

    return content;
  } catch (error) {
    progress.cancel('error');
    console.error('Error:', error);
  }
}

// Usage
streamChatCompletion('Explain quantum computing in simple terms');
```

---

## 🎨 Framework Integration - Same Pattern Everywhere!

<div align="center">

### **The pattern is always the same: Import → Create → Append**

</div>

```tsx
import { useEffect, useRef } from 'react';
import { StreamProgress } from 'ai-progress-controls';

function ChatInterface() {
  const progressRef = useRef<StreamProgress | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create component
    const progress = new StreamProgress({
      maxTokens: 2000,
      costPerToken: 0.00002,
      showRate: true,
      showCost: true,
    });

    // Add to DOM
    if (containerRef.current) {
      containerRef.current.appendChild(progress);
    }

    // Listen to events
    progress.addEventListener('streamcomplete', (e) => {
      console.log('Completed:', e.detail);
    });

    progressRef.current = progress;

    // Cleanup
    return () => {
      if (containerRef.current && progress.parentNode) {
        containerRef.current.removeChild(progress);
      }
    };
  }, []);

  const handleStartStream = () => {
    if (progressRef.current) {
      progressRef.current.start('Starting generation...');

      // Simulate streaming
      let tokens = 0;
      const interval = setInterval(() => {
        tokens += 30;
        progressRef.current?.update({
          tokensGenerated: tokens,
          tokensPerSecond: 30,
        });

        if (tokens >= 500) {
          clearInterval(interval);
          progressRef.current?.complete();
        }
      }, 100);
    }
  };

  return (
    <div>
      <div ref={containerRef}></div>
      <button onClick={handleStartStream}>Start Streaming</button>
    </div>
  );
}

export default ChatInterface;
```

### 4. With Vue 3

```vue
<template>
  <div>
    <div ref="progressContainer"></div>
    <button @click="startStream">Start Streaming</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { StreamProgress } from 'ai-progress-controls';

const progressContainer = ref<HTMLDivElement>();
let progress: StreamProgress | null = null;

onMounted(() => {
  progress = new StreamProgress({
    maxTokens: 2000,
    costPerToken: 0.00002,
    showRate: true,
    showCost: true,
  });

  if (progressContainer.value) {
    progressContainer.value.appendChild(progress);
  }

  progress.addEventListener('streamcomplete', (e: any) => {
    console.log('Completed:', e.detail);
  });
});

onUnmounted(() => {
  if (progress && progressContainer.value) {
    progressContainer.value.removeChild(progress);
  }
});

function startStream() {
  if (!progress) return;

  progress.start('Starting generation...');

  let tokens = 0;
  const interval = setInterval(() => {
    tokens += 30;
    progress?.update({
      tokensGenerated: tokens,
      tokensPerSecond: 30,
    });

    if (tokens >= 500) {
      clearInterval(interval);
      progress?.complete();
    }
  }, 100);
}
</script>
```

### 5. With Angular

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { StreamProgress } from 'ai-progress-controls';

@Component({
  selector: 'app-chat',
  template: `
    <div>
      <div #progressContainer></div>
      <button (click)="startStream()">Start Streaming</button>
    </div>
  `,
})
export class ChatComponent implements AfterViewInit, OnDestroy {
  @ViewChild('progressContainer') container!: ElementRef;
  private progress: StreamProgress | null = null;

  ngAfterViewInit() {
    // Import, create, append:
    this.progress = new StreamProgress({
      maxTokens: 2000,
      costPerToken: 0.00002,
      showRate: true,
      showCost: true,
    });

    this.container.nativeElement.appendChild(this.progress);

    this.progress.addEventListener('streamcomplete', (e: any) => {
      console.log('Completed:', e.detail);
    });
  }

  ngOnDestroy() {
    if (this.progress && this.container) {
      this.container.nativeElement.removeChild(this.progress);
    }
  }

  startStream() {
    if (!this.progress) return;

    this.progress.start('Starting generation...');

    let tokens = 0;
    const interval = setInterval(() => {
      tokens += 30;
      this.progress?.update({
        tokensGenerated: tokens,
        tokensPerSecond: 30,
      });

      if (tokens >= 500) {
        clearInterval(interval);
        this.progress?.complete();
      }
    }, 100);
  }
}
```

### 6. With Next.js (React)

```tsx
'use client'; // For Next.js 13+ App Router

import { useEffect, useRef } from 'react';
import { StreamProgress } from 'ai-progress-controls';

export default function ChatPage() {
  const progressRef = useRef<StreamProgress | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Import, create, append:
    const progress = new StreamProgress({
      maxTokens: 2000,
      costPerToken: 0.00002,
    });

    if (containerRef.current) {
      containerRef.current.appendChild(progress);
    }

    progressRef.current = progress;

    return () => {
      if (containerRef.current && progress.parentNode) {
        containerRef.current.removeChild(progress);
      }
    };
  }, []);

  const handleStartStream = async () => {
    if (!progressRef.current) return;

    progressRef.current.start('Generating...');

    // Call your Next.js API route
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Hello!' }),
    });

    const reader = response.body?.getReader();
    // Handle streaming...
  };

  return (
    <div>
      <div ref={containerRef}></div>
      <button onClick={handleStartStream}>Start</button>
    </div>
  );
}
```

### 7. With Svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { StreamProgress } from 'ai-progress-controls';

  let container: HTMLDivElement;
  let progress: StreamProgress;

  onMount(() => {
    // Import, create, append:
    progress = new StreamProgress({
      maxTokens: 2000,
      costPerToken: 0.00002,
    });

    container.appendChild(progress);

    progress.addEventListener('streamcomplete', (e) => {
      console.log('Completed:', e.detail);
    });
  });

  function startStream() {
    if (!progress) return;

    progress.start('Starting generation...');

    let tokens = 0;
    const interval = setInterval(() => {
      tokens += 30;
      progress?.update({
        tokensGenerated: tokens,
        tokensPerSecond: 30
      });

      if (tokens >= 500) {
        clearInterval(interval);
        progress?.complete();
      }
    }, 100);
  }
</script>

<div>
  <div bind:this={container}></div>
  <button on:click={startStream}>Start Streaming</button>
</div>
```

### 8. With SolidJS

```tsx
import { onMount } from 'solid-js';
import { StreamProgress } from 'ai-progress-controls';

function ChatComponent() {
  let container: HTMLDivElement | undefined;
  let progress: StreamProgress;

  onMount(() => {
    // Import, create, append:
    progress = new StreamProgress({
      maxTokens: 2000,
      costPerToken: 0.00002,
    });

    container?.appendChild(progress);

    progress.addEventListener('streamcomplete', (e: any) => {
      console.log('Completed:', e.detail);
    });
  });

  const startStream = () => {
    if (!progress) return;

    progress.start('Starting generation...');

    let tokens = 0;
    const interval = setInterval(() => {
      tokens += 30;
      progress?.update({
        tokensGenerated: tokens,
        tokensPerSecond: 30,
      });

      if (tokens >= 500) {
        clearInterval(interval);
        progress?.complete();
      }
    }, 100);
  };

  return (
    <div>
      <div ref={container}></div>
      <button onClick={startStream}>Start Streaming</button>
    </div>
  );
}

export default ChatComponent;
```

### 9. With Astro

```astro
---
// src/components/ChatComponent.astro
---

<div>
  <div id="progress-container"></div>
  <button id="start-btn">Start Streaming</button>
</div>

<script>
  import { StreamProgress } from 'ai-progress-controls';

  // Import, create, append:
  const progress = new StreamProgress({
    maxTokens: 2000,
    costPerToken: 0.00002,
  });

  document.getElementById('progress-container')?.appendChild(progress);

  document.getElementById('start-btn')?.addEventListener('click', () => {
    progress.start('Starting generation...');

    let tokens = 0;
    const interval = setInterval(() => {
      tokens += 30;
      progress.update({
        tokensGenerated: tokens,
        tokensPerSecond: 30
      });

      if (tokens >= 500) {
        clearInterval(interval);
        progress.complete();
      }
    }, 100);
  });
</script>
```

## Configuration Options

### StreamProgress Configuration

```typescript
interface StreamProgressConfig {
  /** Maximum tokens allowed (default: 4000) */
  maxTokens?: number;

  /** Cost per token for cost estimation (default: 0.00002) */
  costPerToken?: number;

  /** Currency symbol (default: '$') */
  currency?: string;

  /** Show tokens per second rate (default: true) */
  showRate?: boolean;

  /** Show cost estimation (default: true) */
  showCost?: boolean;

  /** Show progress bar (default: true) */
  showProgressBar?: boolean;

  /** Show cancel button (default: true) */
  showCancelButton?: boolean;

  /** Enable smooth progress animation (default: true) */
  smoothProgress?: boolean;

  /** Update throttle in ms (default: 100) */
  updateThrottle?: number;

  /** Custom cancel button label (default: 'Cancel') */
  cancelLabel?: string;

  /** Enable debug logging (default: false) */
  debug?: boolean;

  /** Custom CSS class */
  className?: string;

  /** ARIA label for accessibility (default: 'AI Stream Progress') */
  ariaLabel?: string;
}
```

## Events

All components emit custom events that you can listen to:

### StreamProgress Events

```javascript
const progress = new StreamProgress();

// Stream started
progress.addEventListener('streamstart', (e) => {
  console.log('Started at:', e.detail.startTime);
});

// Progress updated
progress.addEventListener('streamupdate', (e) => {
  console.log('Tokens:', e.detail.tokensGenerated);
  console.log('Rate:', e.detail.tokensPerSecond);
  console.log('Cost:', e.detail.totalCost);
});

// Stream completed
progress.addEventListener('streamcomplete', (e) => {
  console.log('Total tokens:', e.detail.tokensGenerated);
  console.log('Duration:', e.detail.duration);
  console.log('Average rate:', e.detail.averageRate);
});

// Stream cancelled
progress.addEventListener('streamcancel', (e) => {
  console.log('Cancelled - Reason:', e.detail.reason);
});
```

## Theming

Components use CSS custom properties for easy theming:

```css
stream-progress {
  --ai-primary-color: #3b82f6;
  --ai-secondary-color: #10b981;
  --ai-background-color: #ffffff;
  --ai-text-color: #1f2937;
  --ai-border-color: #e5e7eb;
  --ai-border-radius: 8px;
  --ai-font-family: 'Inter', sans-serif;
  --ai-font-size: 14px;
  --ai-spacing: 12px;
}

/* Dark mode example */
@media (prefers-color-scheme: dark) {
  stream-progress {
    --ai-background-color: #1f2937;
    --ai-text-color: #f9fafb;
    --ai-border-color: #374151;
  }
}
```

## Accessibility

All components are built with accessibility in mind:

- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Semantic HTML structure
- ✅ Focus indicators

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note:** Web Components require modern browsers. For older browsers, consider using polyfills.

## 📦 Available Components

### 1. StreamProgress

Real-time token streaming visualization with rate tracking and cost estimation.

```javascript
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress({ maxTokens: 2000, costPerToken: 0.00003 });
document.body.appendChild(progress);
progress.start();
```

**[📖 API Docs](./api/stream-progress.md)** | **[🎮 Examples](../examples/vanilla/stream-progress.html)**

### 2. ModelLoader

Multi-stage progress for model download, loading, and initialization.

```javascript
import { ModelLoader } from 'ai-progress-controls';
const loader = new ModelLoader({ modelName: 'llama-3-8b', totalSize: 8000 });
document.body.appendChild(loader);
loader.start();
```

**[📖 API Docs](./api/model-loader.md)** | **[🎮 Examples](../examples/vanilla/model-loader.html)**

### 3. ParameterSlider

Intuitive controls for temperature, top-p, max tokens, and other LLM parameters.

```javascript
import { ParameterSlider } from 'ai-progress-controls';
const slider = new ParameterSlider({ parameter: 'temperature', min: 0, max: 2, value: 0.7 });
document.body.appendChild(slider);
```

**[📖 API Docs](./api/parameter-slider.md)** | **[🎮 Examples](../examples/vanilla/parameter-slider.html)**

### 4. QueueProgress

Show user's position in processing queue with live updates and ETA.

```javascript
import { QueueProgress } from 'ai-progress-controls';
const queue = new QueueProgress({ totalInQueue: 50, currentPosition: 25 });
document.body.appendChild(queue);
queue.start();
```

**[📖 API Docs](./api/queue-progress.md)** | **[🎮 Examples](../examples/vanilla/queue-progress.html)**

### 5. RetryProgress

Exponential backoff retry mechanism with multiple strategies for handling API failures.

```javascript
import { RetryProgress } from 'ai-progress-controls';
const retry = new RetryProgress({ maxAttempts: 5, strategy: 'exponential' });
document.body.appendChild(retry);
retry.start();
```

**[📖 API Docs](./api/retry-progress.md)** | **[🎮 Examples](../examples/vanilla/retry-progress.html)**

### 6. BatchProgress

Process multiple items in parallel with individual progress tracking and concurrency control.

```javascript
import { BatchProgress } from 'ai-progress-controls';
const batch = new BatchProgress({ totalItems: 50, concurrency: 5 });
document.body.appendChild(batch);
batch.start();
batch.addItem('item-1', 'Document_001.pdf');
batch.updateItem({ itemId: 'item-1', status: 'processing', progress: 50 });
batch.completeItem('item-1');
```

**[📖 API Docs](./api/batch-progress.md)** | **[🎮 Examples](../examples/vanilla/batch-progress.html)**

## Next Steps

- 🎮 **[View Live Demos](../index.html)** - See all components in action
- 📚 **[Browse Examples Gallery](../examples/index.html)** - 24 interactive examples
- 📖 **[Read API Documentation](./api/)** - Complete reference for all 6 components
- 💡 **[See Real-World Patterns](#)** - OpenAI integration, retry logic, rate limiting

## Need Help?

- 📚 [Full Documentation](./README.md)
- 💬 [GitHub Discussions](https://github.com/Maneesh-Relanto/ai-progress-controls/discussions)
- 🐛 [Report Issues](https://github.com/Maneesh-Relanto/ai-progress-controls/issues)
- 📧 [Email Support](mailto:support@example.com)
