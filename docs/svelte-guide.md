# 🔥 Svelte Integration Guide

## Quick Start

Svelte has **good support** for Web Components with some minor considerations. No adapter needed!

### Installation

```bash
npm install ai-progress-controls
```

### Basic Usage

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import 'ai-progress-controls/dist/style.css';

  let tokens = 0;

  onMount(async () => {
    const { defineCustomElements } = await import('ai-progress-controls');
    defineCustomElements();
  });

  async function startStreaming() {
    tokens = 0;
    for (let i = 0; i <= 2000; i += 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      tokens = i;
    }
  }
</script>

<div>
  <stream-progress
    tokens-generated={tokens}
    max-tokens={2000}
    show-rate={true}
    show-cost={true}
    cost-per-token={0.00003}
  />

  <button on:click={startStreaming}>Start Streaming</button>
</div>
```

---

## Complete Example - AI Chat Application

```svelte
<!-- src/routes/+page.svelte (SvelteKit) -->
<script lang="ts">
  import { onMount } from 'svelte';
  import 'ai-progress-controls/dist/style.css';

  // Model state
  let isLoading = false;
  let modelProgress = 0;
  let modelStage: 'download' | 'initialize' | 'ready' = 'download';

  // Parameters
  let temperature = 0.7;
  let topP = 0.9;

  // Streaming state
  let tokens = 0;
  let maxTokens = 2000;
  let isStreaming = false;
  let queuePosition = 0;

  // Chat state
  let message = '';
  let response = '';

  // Batch state
  let batchItems = [
    { id: '1', status: 'pending', progress: 0 },
    { id: '2', status: 'pending', progress: 0 },
    { id: '3', status: 'pending', progress: 0 }
  ];

  onMount(async () => {
    const { defineCustomElements } = await import('ai-progress-controls');
    defineCustomElements();
    await loadModel();
  });

  async function loadModel() {
    isLoading = true;
    modelProgress = 0;
    modelStage = 'download';

    // Simulate download
    for (let i = 0; i <= 100; i += 10) {
      modelProgress = i;
      await delay(100);
    }

    // Simulate initialization
    modelStage = 'initialize';
    modelProgress = 0;
    for (let i = 0; i <= 100; i += 20) {
      modelProgress = i;
      await delay(50);
    }

    modelStage = 'ready';
    isLoading = false;
  }

  async function sendMessage() {
    if (!message.trim()) return;

    isStreaming = true;
    tokens = 0;
    response = '';

    // Simulate queue
    queuePosition = Math.floor(Math.random() * 3) + 1;
    while (queuePosition > 0) {
      await delay(1000);
      queuePosition--;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, temperature, topP })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        response += chunk;
        tokens++;
      }
    } catch (error) {
      console.error('Streaming error:', error);
      // Demo fallback
      for (let i = 0; i < 50; i++) {
        response += 'Token ';
        tokens++;
        await delay(50);
      }
    } finally {
      isStreaming = false;
      message = '';
    }
  }

  function handleTempChange(event: CustomEvent) {
    temperature = event.detail.value;
  }

  function handleTopPChange(event: CustomEvent) {
    topP = event.detail.value;
  }

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
</script>

<div class="ai-chat">
  <h1>AI Chat with Svelte</h1>

  <!-- Model Loading -->
  <section class="section">
    <h2>Model Status</h2>
    <model-loader
      is-loading={isLoading}
      progress={modelProgress}
      model-name="GPT-4"
      stage={modelStage}
    />
    <button on:click={loadModel} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Reload Model'}
    </button>
  </section>

  <!-- Parameter Controls -->
  <section class="section">
    <h2>Configuration</h2>
    <parameter-slider
      value={temperature}
      min={0}
      max={2}
      step={0.1}
      label="Temperature"
      description="Controls randomness in responses"
      on:change={handleTempChange}
    />
    <p>Current: {temperature.toFixed(1)}</p>

    <parameter-slider
      value={topP}
      min={0}
      max={1}
      step={0.1}
      label="Top P"
      description="Nucleus sampling threshold"
      on:change={handleTopPChange}
    />
    <p>Current: {topP.toFixed(1)}</p>
  </section>

  <!-- Queue Status -->
  {#if queuePosition > 0}
    <section class="section">
      <h2>Queue Status</h2>
      <queue-progress
        position={queuePosition}
        total-in-queue={5}
        estimated-wait-time={queuePosition * 1000}
      />
    </section>
  {/if}

  <!-- Token Streaming -->
  <section class="section">
    <h2>Token Streaming</h2>
    <stream-progress
      tokens-generated={tokens}
      max-tokens={maxTokens}
      show-rate={true}
      show-cost={true}
      cost-per-token={0.00003}
      theme="openai"
      variant="gradient"
    />
  </section>

  <!-- Batch Processing -->
  {#if batchItems.length > 0}
    <section class="section">
      <h2>Batch Processing</h2>
      <batch-progress
        items={JSON.stringify(batchItems)}
        total-items={batchItems.length}
        concurrency={2}
        show-individual-progress={true}
      />
    </section>
  {/if}

  <!-- Chat Interface -->
  <section class="section">
    <h2>Chat</h2>
    <form on:submit|preventDefault={sendMessage}>
      <input
        type="text"
        bind:value={message}
        placeholder="Type your message..."
        disabled={isStreaming}
      />
      <button type="submit" disabled={isStreaming || !message.trim()}>
        {isStreaming ? 'Streaming...' : 'Send'}
      </button>
    </form>

    {#if response}
      <div class="response">
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    {/if}
  </section>
</div>

<style>
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

  form {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  input {
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
</style>
```

---

## Stores Integration

```typescript
// src/lib/stores/ai.ts
import { writable, derived } from 'svelte/store';

interface AIState {
  tokens: number;
  isStreaming: boolean;
  temperature: number;
  topP: number;
  maxTokens: number;
}

function createAIStore() {
  const { subscribe, set, update } = writable<AIState>({
    tokens: 0,
    isStreaming: false,
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000,
  });

  return {
    subscribe,
    setTokens: (tokens: number) => update((state) => ({ ...state, tokens })),
    setTemperature: (temperature: number) => update((state) => ({ ...state, temperature })),
    setTopP: (topP: number) => update((state) => ({ ...state, topP })),
    startStreaming: () => update((state) => ({ ...state, isStreaming: true, tokens: 0 })),
    stopStreaming: () => update((state) => ({ ...state, isStreaming: false })),
    reset: () =>
      set({
        tokens: 0,
        isStreaming: false,
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2000,
      }),
  };
}

export const aiStore = createAIStore();

// Derived stores
export const tokensPercentage = derived(aiStore, ($ai) => ($ai.tokens / $ai.maxTokens) * 100);
```

Usage:

```svelte
<script lang="ts">
  import { aiStore, tokensPercentage } from '$lib/stores/ai';

  function handleChange(event: CustomEvent) {
    aiStore.setTemperature(event.detail.value);
  }
</script>

<stream-progress
  tokens-generated={$aiStore.tokens}
  max-tokens={$aiStore.maxTokens}
/>

<parameter-slider
  value={$aiStore.temperature}
  on:change={handleChange}
/>

<p>Progress: {$tokensPercentage.toFixed(1)}%</p>
```

---

## SvelteKit (SSR)

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let tokens = 0;
  let componentsLoaded = false;

  onMount(async () => {
    if (browser) {
      const { defineCustomElements } = await import('ai-progress-controls');
      await import('ai-progress-controls/dist/style.css');
      defineCustomElements();
      componentsLoaded = true;
    }
  });
</script>

{#if componentsLoaded}
  <stream-progress
    tokens-generated={tokens}
    max-tokens={2000}
  />
{:else}
  <div>Loading AI components...</div>
{/if}
```

---

## TypeScript Support

```typescript
// src/app.d.ts
declare namespace svelteHTML {
  interface IntrinsicElements {
    'stream-progress': {
      'tokens-generated'?: number;
      'max-tokens'?: number;
      'show-rate'?: boolean;
      'show-cost'?: boolean;
      'cost-per-token'?: number;
      theme?: string;
      variant?: string;
    };
    'model-loader': {
      'is-loading'?: boolean;
      progress?: number;
      'model-name'?: string;
      stage?: string;
    };
    'parameter-slider': {
      value?: number;
      min?: number;
      max?: number;
      step?: number;
      label?: string;
      description?: string;
    };
    'parameter-panel': {
      parameters?: string;
      layout?: string;
    };
    'queue-progress': {
      position?: number;
      'total-in-queue'?: number;
      'estimated-wait-time'?: number;
    };
    'retry-progress': {
      attempt?: number;
      'max-attempts'?: number;
      'next-retry-in'?: number;
    };
    'batch-progress': {
      items?: string;
      'total-items'?: number;
      concurrency?: number;
    };
  }
}
```

---

## Actions (Custom Directives)

```typescript
// src/lib/actions/aiProgress.ts
export function streamProgress(
  node: HTMLElement,
  options: {
    onComplete?: () => void;
    maxTokens: number;
  }
) {
  function handleComplete(event: CustomEvent) {
    if (event.detail.tokens >= options.maxTokens) {
      options.onComplete?.();
    }
  }

  node.addEventListener('progress', handleComplete as EventListener);

  return {
    update(newOptions: typeof options) {
      options = newOptions;
    },
    destroy() {
      node.removeEventListener('progress', handleComplete as EventListener);
    },
  };
}
```

Usage:

```svelte
<script lang="ts">
  import { streamProgress } from '$lib/actions/aiProgress';

  function handleComplete() {
    console.log('Streaming complete!');
  }
</script>

<stream-progress
  use:streamProgress={{ onComplete: handleComplete, maxTokens: 2000 }}
  tokens-generated={tokens}
  max-tokens={2000}
/>
```

---

## Reactive Statements

```svelte
<script lang="ts">
  let tokens = 0;
  let maxTokens = 2000;

  // Reactive declaration
  $: percentage = (tokens / maxTokens) * 100;
  $: isComplete = tokens >= maxTokens;
  $: statusMessage = isComplete ? 'Complete!' : 'Streaming...';

  // Reactive block
  $: {
    if (isComplete) {
      console.log('Streaming finished!');
    }
  }
</script>

<stream-progress
  tokens-generated={tokens}
  max-tokens={maxTokens}
/>

<p>{statusMessage} ({percentage.toFixed(1)}%)</p>
```

---

## Component Composition

```svelte
<!-- src/lib/components/AIStreamCard.svelte -->
<script lang="ts">
  export let title: string;
  export let tokens: number = 0;
  export let maxTokens: number = 2000;
  export let onStart: () => void;
  export let isStreaming: boolean = false;
</script>

<div class="card">
  <h3>{title}</h3>

  <stream-progress
    tokens-generated={tokens}
    max-tokens={maxTokens}
    show-rate={true}
    show-cost={true}
  />

  <button on:click={onStart} disabled={isStreaming}>
    {isStreaming ? 'Streaming...' : 'Start'}
  </button>

  <slot />
</div>

<style>
  .card {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
  }

  h3 {
    margin-top: 0;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

Usage:

```svelte
<script lang="ts">
  import AIStreamCard from '$lib/components/AIStreamCard.svelte';

  let tokens = 0;
  let isStreaming = false;

  async function startStream() {
    isStreaming = true;
    tokens = 0;

    for (let i = 0; i <= 2000; i += 50) {
      await new Promise(r => setTimeout(r, 100));
      tokens = i;
    }

    isStreaming = false;
  }
</script>

<AIStreamCard
  title="OpenAI GPT-4"
  {tokens}
  {isStreaming}
  onStart={startStream}
>
  <p>Custom content here</p>
</AIStreamCard>
```

---

## Best Practices

### 1. Load Components Client-Side Only

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let ready = false;

  onMount(async () => {
    if (browser) {
      const { defineCustomElements } = await import('ai-progress-controls');
      defineCustomElements();
      ready = true;
    }
  });
</script>

{#if ready}
  <stream-progress tokens-generated={500} />
{/if}
```

### 2. Handle Events Properly

```svelte
<script lang="ts">
  function handleChange(event: Event) {
    const customEvent = event as CustomEvent;
    console.log('New value:', customEvent.detail.value);
  }
</script>

<parameter-slider
  value={0.7}
  on:change={handleChange}
/>
```

### 3. Use Kebab-Case for Attributes

```svelte
<!-- ✅ Correct: kebab-case -->
<stream-progress
  tokens-generated={500}
  max-tokens={2000}
  show-rate={true}
/>

<!-- ❌ Wrong: camelCase doesn't work -->
<stream-progress
  tokensGenerated={500}
  maxTokens={2000}
/>
```

### 4. JSON Stringify Complex Props

```svelte
<script lang="ts">
  let items = [
    { id: '1', status: 'pending', progress: 0 },
    { id: '2', status: 'processing', progress: 50 }
  ];
</script>

<batch-progress
  items={JSON.stringify(items)}
  total-items={items.length}
/>
```

---

## Why No Svelte Adapter Needed

Svelte's Web Components support is **good** because:

✅ **Native support** - Works out of the box  
✅ **Event handling** - `on:event` syntax works  
✅ **Reactive bindings** - Props update automatically  
✅ **TypeScript** - Can be typed with declarations  
✅ **SSR compatible** - Works with SvelteKit  
⚠️ **Minor quirks** - Some binding edge cases (but rare)

**Svelte handles Web Components well without needing an adapter.**

---

## Common Patterns

### Loading Pattern

```svelte
<script lang="ts">
  let isLoading = $state(true);
  let progress = $state(0);

  onMount(async () => {
    for (let i = 0; i <= 100; i += 10) {
      progress = i;
      await new Promise(r => setTimeout(r, 100));
    }
    isLoading = false;
  });
</script>

{#if isLoading}
  <model-loader
    is-loading={true}
    progress={progress}
  />
{:else}
  <p>Ready!</p>
{/if}
```

### Streaming Pattern

```svelte
<script lang="ts">
  let tokens = $state(0);
  let streaming = $state(false);

  async function stream() {
    streaming = true;
    tokens = 0;

    const response = await fetch('/api/chat');
    const reader = response.body?.getReader();

    while (reader) {
      const { done } = await reader.read();
      if (done) break;
      tokens++;
    }

    streaming = false;
  }
</script>

<stream-progress
  tokens-generated={tokens}
  max-tokens={2000}
/>
```

---

## Need Help?

- 📖 [Main Documentation](../README.md)
- 🚀 [Quick Start](./QUICK_START.md)
- 📦 [npm Package](https://www.npmjs.com/package/ai-progress-controls)
- 💬 [GitHub Issues](https://github.com/Maneesh-Relanto/ai-progress-controls/issues)

---

## 📚 Related Documentation

- [🏠 Main README](../README.md) - Project overview
- [🎯 Quick Start](./QUICK_START.md) - 2-minute guide
- [📦 Installation Guide](./installation-guide.md) - Complete setup
- [⚛️ React Examples](./react-examples.md) - React integration
- [▲ Next.js Examples](./nextjs-examples.md) - Next.js integration
- [🖖 Vue Guide](./vue-guide.md) - Vue integration
- [🅰️ Angular Guide](./angular-guide.md) - Angular integration
