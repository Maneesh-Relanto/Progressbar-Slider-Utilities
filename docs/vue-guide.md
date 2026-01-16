# 🖖 Vue 3 Integration Guide

## Quick Start

Vue 3 has **excellent native support** for Web Components. No adapter needed!

### Installation

```bash
npm install ai-progress-controls
```

### Basic Usage

```vue
<template>
  <div>
    <stream-progress
      :tokens-generated="tokens"
      :max-tokens="2000"
      :show-rate="true"
      :show-cost="true"
      :cost-per-token="0.00003"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineCustomElements } from 'ai-progress-controls';
import 'ai-progress-controls/dist/style.css';

// Register components once
onMounted(() => {
  defineCustomElements();
});

const tokens = ref(0);
</script>
```

### Complete Example - AI Chat Interface

```vue
<template>
  <div class="ai-chat">
    <h1>AI Chat with Vue 3</h1>

    <!-- Model Loading -->
    <model-loader
      :is-loading="isLoading"
      :progress="modelProgress"
      model-name="GPT-4"
      :stage="modelStage"
    />

    <!-- Parameter Controls -->
    <parameter-slider
      :value="temperature"
      :min="0"
      :max="2"
      :step="0.1"
      label="Temperature"
      description="Controls randomness"
      @change="handleTempChange"
    />

    <!-- Token Streaming -->
    <stream-progress
      :tokens-generated="tokens"
      :max-tokens="maxTokens"
      :show-rate="true"
      :show-cost="true"
      :cost-per-token="0.00003"
      theme="openai"
      variant="gradient"
    />

    <!-- Queue Status -->
    <queue-progress
      v-if="queuePosition > 0"
      :position="queuePosition"
      :total-in-queue="5"
      :estimated-wait-time="queuePosition * 1000"
    />

    <!-- Chat Input -->
    <form @submit.prevent="sendMessage">
      <input v-model="message" placeholder="Type a message..." />
      <button type="submit" :disabled="isStreaming">Send</button>
    </form>

    <!-- Response -->
    <div v-if="response" class="response">{{ response }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineCustomElements } from 'ai-progress-controls';
import 'ai-progress-controls/dist/style.css';

onMounted(() => {
  defineCustomElements();
});

// State
const tokens = ref(0);
const maxTokens = ref(2000);
const temperature = ref(0.7);
const isLoading = ref(false);
const modelProgress = ref(0);
const modelStage = ref<'download' | 'initialize' | 'ready'>('download');
const queuePosition = ref(0);
const isStreaming = ref(false);
const message = ref('');
const response = ref('');

// Load model on mount
onMounted(async () => {
  await loadModel();
});

async function loadModel() {
  isLoading.value = true;
  modelProgress.value = 0;

  // Simulate download
  modelStage.value = 'download';
  for (let i = 0; i <= 100; i += 10) {
    modelProgress.value = i;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Simulate initialization
  modelStage.value = 'initialize';
  modelProgress.value = 0;
  for (let i = 0; i <= 100; i += 20) {
    modelProgress.value = i;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  modelStage.value = 'ready';
  isLoading.value = false;
}

async function sendMessage() {
  if (!message.value.trim()) return;

  isStreaming.value = true;
  tokens.value = 0;
  response.value = '';

  // Simulate queue
  queuePosition.value = Math.floor(Math.random() * 3);
  while (queuePosition.value > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    queuePosition.value--;
  }

  // Simulate streaming
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.value,
        temperature: temperature.value,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      response.value += chunk;
      tokens.value++;
    }
  } catch (error) {
    console.error('Streaming error:', error);
  } finally {
    isStreaming.value = false;
    message.value = '';
  }
}

function handleTempChange(event: Event) {
  const customEvent = event as CustomEvent;
  temperature.value = customEvent.detail.value;
}
</script>

<style scoped>
.ai-chat {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

form {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
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

.response {
  margin-top: 2rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
}
</style>
```

## TypeScript Support

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue that custom elements are external
          isCustomElement: (tag) =>
            tag.startsWith('stream-') ||
            tag.startsWith('model-') ||
            tag.startsWith('parameter-') ||
            tag.startsWith('queue-') ||
            tag.startsWith('retry-') ||
            tag.startsWith('batch-'),
        },
      },
    }),
  ],
});
```

## Event Handling

Vue automatically handles custom events from Web Components:

```vue
<template>
  <!-- Vue automatically converts @change to addEventListener -->
  <parameter-slider :value="temperature" @change="handleChange" />
</template>

<script setup lang="ts">
function handleChange(event: Event) {
  const customEvent = event as CustomEvent;
  console.log('New value:', customEvent.detail.value);
}
</script>
```

## v-model Support

```vue
<template>
  <!-- Two-way binding works! -->
  <parameter-slider v-model="temperature" :min="0" :max="2" />

  <p>Current temperature: {{ temperature }}</p>
</template>
```

## Composables Pattern

```typescript
// composables/useStreamProgress.ts
import { ref, onUnmounted } from 'vue';

export function useStreamProgress(maxTokens: number = 2000) {
  const tokens = ref(0);
  const isStreaming = ref(false);
  const rate = ref(0);
  let intervalId: number | null = null;

  async function startStream(apiEndpoint: string, payload: any) {
    isStreaming.value = true;
    tokens.value = 0;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const startTime = Date.now();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        tokens.value += chunk.split(' ').length;

        // Calculate rate
        const elapsed = (Date.now() - startTime) / 1000;
        rate.value = Math.round(tokens.value / elapsed);
      }
    } finally {
      isStreaming.value = false;
    }
  }

  function stopStream() {
    isStreaming.value = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  onUnmounted(() => {
    stopStream();
  });

  return {
    tokens,
    isStreaming,
    rate,
    startStream,
    stopStream,
  };
}
```

Usage:

```vue
<script setup lang="ts">
import { useStreamProgress } from '@/composables/useStreamProgress';

const { tokens, isStreaming, startStream } = useStreamProgress(2000);

async function handleSubmit() {
  await startStream('/api/chat', { message: 'Hello' });
}
</script>

<template>
  <stream-progress :tokens-generated="tokens" :max-tokens="2000" />
  <button @click="handleSubmit" :disabled="isStreaming">Send</button>
</template>
```

## Pinia Store Integration

```typescript
// stores/aiChat.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAIChatStore = defineStore('aiChat', () => {
  const tokens = ref(0);
  const temperature = ref(0.7);
  const topP = ref(0.9);
  const isLoading = ref(false);
  const modelProgress = ref(0);

  async function loadModel() {
    isLoading.value = true;
    modelProgress.value = 0;

    for (let i = 0; i <= 100; i += 10) {
      modelProgress.value = i;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    isLoading.value = false;
  }

  async function streamChat(message: string) {
    tokens.value = 0;

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        temperature: temperature.value,
        topP: topP.value,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      tokens.value++;
    }
  }

  return {
    tokens,
    temperature,
    topP,
    isLoading,
    modelProgress,
    loadModel,
    streamChat,
  };
});
```

## Nuxt 3 Usage

```vue
<!-- pages/chat.vue -->
<template>
  <div>
    <ClientOnly>
      <stream-progress :tokens-generated="tokens" :max-tokens="2000" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const tokens = ref(0);

onMounted(async () => {
  // Import only on client-side
  const { defineCustomElements } = await import('ai-progress-controls');
  await import('ai-progress-controls/dist/style.css');
  defineCustomElements();
});
</script>
```

## Best Practices

### 1. Register Once, Use Everywhere

```typescript
// main.ts
import { createApp } from 'vue';
import { defineCustomElements } from 'ai-progress-controls';
import 'ai-progress-controls/dist/style.css';
import App from './App.vue';

defineCustomElements();

createApp(App).mount('#app');
```

### 2. Type Safety

```typescript
// types/web-components.d.ts
declare global {
  namespace JSX {
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
      // Add other components...
    }
  }
}

export {};
```

### 3. Reactive Props

```vue
<template>
  <!-- Vue's reactivity works seamlessly -->
  <stream-progress :tokens-generated="computedTokens" :max-tokens="maxTokens" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tokens = ref(0);
const maxTokens = ref(2000);

// Computed properties work too
const computedTokens = computed(() => Math.min(tokens.value, maxTokens.value));
</script>
```

## Why No Vue Adapter Needed

Vue 3's Web Components support is **excellent** because:

✅ **Native custom elements support** - Just works  
✅ **Event handling** - `@event` syntax works perfectly  
✅ **Props binding** - `:prop` syntax handles attributes  
✅ **Two-way binding** - `v-model` supported  
✅ **TypeScript** - Can be typed with declarations  
✅ **SSR ready** - Works with Nuxt 3 out of the box

**You don't need an adapter. The Web Components API is Vue-friendly by design.**

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
- [🅰️ Angular Guide](./angular-guide.md) - Angular integration
- [🔥 Svelte Guide](./svelte-guide.md) - Svelte integration
