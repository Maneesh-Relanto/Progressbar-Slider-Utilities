# 📦 npm Usage Examples

## Real-World Integration Patterns

### Table of Contents

- [Installation Scenarios](#installation-scenarios)
- [Framework Integration](#framework-integration)
- [Common Patterns](#common-patterns)
- [Production Examples](#production-examples)
- [Best Practices](#best-practices)

---

## 🚀 Installation Scenarios

### Scenario 1: New React Project

```bash
# Create fresh React app
npm create vite@latest my-chatbot -- --template react-ts
cd my-chatbot

# Install dependencies
npm install

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-react

# Start coding immediately
```

**Usage:**

```tsx
// src/App.tsx
import { StreamProgress } from 'ai-progress-controls-react';
import { useState } from 'react';

function App() {
  const [tokens, setTokens] = useState(0);

  return (
    <div>
      <h1>My Chatbot</h1>
      <StreamProgress
        tokensGenerated={tokens}
        maxTokens={2000}
        showRate={true}
        showCost={true}
        costPerToken={0.00003}
      />
    </div>
  );
}

export default App;
```

---

### Scenario 2: Existing Next.js Application

```bash
# Navigate to your Next.js project
cd my-existing-nextjs-app

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-next

# Use in your pages/components
```

**Usage:**

```tsx
// app/chat/page.tsx
'use client';

import { StreamProgress } from 'ai-progress-controls-next';
import { useState } from 'react';

export default function ChatPage() {
  const [tokens, setTokens] = useState(0);

  const handleChat = async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const reader = response.body?.getReader();
    let accumulated = 0;

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      accumulated += value.length;
      setTokens(Math.floor(accumulated / 4)); // Rough estimate
    }
  };

  return (
    <div>
      <StreamProgress tokensGenerated={tokens} maxTokens={2000} />
      <button onClick={handleChat}>Send Message</button>
    </div>
  );
}
```

---

### Scenario 3: Vue 3 Project

```bash
# In your Vue project
npm install ai-progress-controls
```

**Usage:**

```vue
<!-- src/components/AIProgress.vue -->
<template>
  <div>
    <stream-progress
      :tokens-generated="tokens"
      :max-tokens="2000"
      :show-rate="true"
    ></stream-progress>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineCustomElements } from 'ai-progress-controls';
import 'ai-progress-controls/dist/style.css';

onMounted(() => {
  defineCustomElements();
});

const tokens = ref(0);
</script>
```

---

## 🛠️ Framework Integration

### React with TypeScript

```tsx
import {
  StreamProgress,
  ModelLoader,
  ParameterSlider,
  type StreamProgressProps,
  type ModelLoaderProps,
} from 'ai-progress-controls-react';

// Type-safe props
interface ChatUIProps {
  apiKey: string;
  model: string;
}

export function ChatUI({ apiKey, model }: ChatUIProps) {
  const [tokens, setTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [temperature, setTemperature] = useState(0.7);

  const loadModel = async () => {
    setIsLoading(true);
    // Simulate model loading
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setIsLoading(false);
  };

  const startChat = async () => {
    setTokens(0);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature }),
    });

    // Stream tokens
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const text = decoder.decode(value);
      setTokens((prev) => prev + text.split(' ').length);
    }
  };

  return (
    <div className="chat-ui">
      {/* Model Loading */}
      <ModelLoader
        isLoading={isLoading}
        progress={progress}
        modelName={model}
        stage={progress < 50 ? 'download' : 'initialize'}
      />

      {/* Parameter Control */}
      <ParameterSlider
        value={temperature}
        min={0}
        max={2}
        step={0.1}
        label="Temperature"
        onChange={setTemperature}
      />

      {/* Token Streaming */}
      <StreamProgress
        tokensGenerated={tokens}
        maxTokens={4096}
        showRate={true}
        showCost={true}
        costPerToken={0.00003}
      />

      <button onClick={loadModel} disabled={isLoading}>
        Load Model
      </button>
      <button onClick={startChat}>Start Chat</button>
    </div>
  );
}
```

---

### Next.js with Server Actions

```tsx
// app/actions.ts
'use server';

export async function streamResponse(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  return response.body;
}
```

```tsx
// app/chat/page.tsx
'use client';

import { useState } from 'react';
import { StreamProgress } from 'ai-progress-controls-next';
import { streamResponse } from '../actions';

export default function ChatPage() {
  const [tokens, setTokens] = useState(0);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokens(0);
    setResponse('');

    const stream = await streamResponse('Hello, world!');
    const reader = stream?.getReader();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      setResponse((prev) => prev + text);
      setTokens((prev) => prev + text.split(' ').length);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>

      <StreamProgress
        tokensGenerated={tokens}
        maxTokens={4096}
        showRate={true}
        showCost={true}
        costPerToken={0.00003}
      />

      <div className="response">{response}</div>
    </div>
  );
}
```

---

### Angular Integration

```bash
npm install ai-progress-controls
```

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { defineCustomElements } from 'ai-progress-controls';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <stream-progress
        [attr.tokens-generated]="tokens"
        [attr.max-tokens]="2000"
        [attr.show-rate]="true"
      ></stream-progress>
      <button (click)="startStream()">Start</button>
    </div>
  `,
})
export class AppComponent implements OnInit {
  tokens = 0;

  ngOnInit() {
    defineCustomElements();
  }

  async startStream() {
    for (let i = 0; i <= 2000; i += 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.tokens = i;
    }
  }
}
```

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}
```

---

## 🎯 Common Patterns

### Pattern 1: OpenAI Integration

```tsx
import { StreamProgress } from 'ai-progress-controls-react';
import OpenAI from 'openai';
import { useState } from 'react';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for demo
});

export function OpenAIChat() {
  const [tokens, setTokens] = useState(0);
  const [message, setMessage] = useState('');

  const handleChat = async () => {
    setTokens(0);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      setMessage((prev) => prev + content);
      setTokens((prev) => prev + 1);
    }
  };

  return (
    <div>
      <StreamProgress
        tokensGenerated={tokens}
        maxTokens={4096}
        showRate={true}
        showCost={true}
        costPerToken={0.00003}
        theme="openai"
      />
      <button onClick={handleChat}>Send</button>
      <p>{message}</p>
    </div>
  );
}
```

---

### Pattern 2: Anthropic Claude Integration

```tsx
import { StreamProgress } from 'ai-progress-controls-react';
import Anthropic from '@anthropic-ai/sdk';
import { useState } from 'react';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function ClaudeChat() {
  const [tokens, setTokens] = useState(0);

  const handleChat = async () => {
    setTokens(0);

    const stream = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        setTokens((prev) => prev + 1);
      }
    }
  };

  return (
    <div>
      <StreamProgress
        tokensGenerated={tokens}
        maxTokens={1024}
        showRate={true}
        showCost={true}
        costPerToken={0.000015}
        theme="anthropic"
      />
      <button onClick={handleChat}>Send to Claude</button>
    </div>
  );
}
```

---

### Pattern 3: Batch Processing

```tsx
import { BatchProgress } from 'ai-progress-controls-react';
import { useState } from 'react';

interface BatchItem {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

export function BatchProcessor() {
  const [items, setItems] = useState<BatchItem[]>([
    { id: '1', prompt: 'Generate image 1', status: 'pending', progress: 0 },
    { id: '2', prompt: 'Generate image 2', status: 'pending', progress: 0 },
    { id: '3', prompt: 'Generate image 3', status: 'pending', progress: 0 },
  ]);

  const processBatch = async () => {
    for (const item of items) {
      // Update to processing
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i)));

      // Simulate processing
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress } : i)));
      }

      // Mark as completed
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'completed', progress: 100 } : i))
      );
    }
  };

  return (
    <div>
      <BatchProgress
        items={items}
        totalItems={items.length}
        concurrency={2}
        showIndividualProgress={true}
      />
      <button onClick={processBatch}>Process Batch</button>
    </div>
  );
}
```

---

### Pattern 4: Model Loading with Stages

```tsx
import { ModelLoader } from 'ai-progress-controls-react';
import { useState } from 'react';

type LoadStage = 'idle' | 'download' | 'extract' | 'initialize' | 'ready';

export function ModelManager() {
  const [stage, setStage] = useState<LoadStage>('idle');
  const [progress, setProgress] = useState(0);

  const loadModel = async () => {
    // Download stage
    setStage('download');
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Extract stage
    setStage('extract');
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Initialize stage
    setStage('initialize');
    setProgress(0);
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setStage('ready');
    setProgress(100);
  };

  return (
    <div>
      <ModelLoader
        isLoading={stage !== 'idle' && stage !== 'ready'}
        progress={progress}
        modelName="GPT-4 Turbo"
        stage={stage}
      />
      <button onClick={loadModel} disabled={stage !== 'idle' && stage !== 'ready'}>
        {stage === 'ready' ? 'Loaded' : 'Load Model'}
      </button>
    </div>
  );
}
```

---

## 🏭 Production Examples

### Example 1: Complete Chat Application

```tsx
// components/ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';
import {
  StreamProgress,
  ModelLoader,
  ParameterPanel,
  QueueProgress,
} from 'ai-progress-controls-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tokens: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [queuePosition, setQueuePosition] = useState(0);
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000,
  });

  // Load model on mount
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    setIsLoading(true);
    for (let i = 0; i <= 100; i += 10) {
      setModelProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setIsLoading(false);
  };

  const sendMessage = async (content: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content, tokens: 0 }]);
    setCurrentTokens(0);

    // Check queue
    const queuePos = Math.floor(Math.random() * 5);
    setQueuePosition(queuePos);

    // Wait for queue
    for (let i = queuePos; i > 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setQueuePosition(i - 1);
    }

    // Stream response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content }],
        ...parameters,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      assistantMessage += chunk;
      setCurrentTokens((prev) => prev + 1);
    }

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: assistantMessage, tokens: currentTokens },
    ]);
  };

  return (
    <div className="chat-interface">
      {/* Model Status */}
      <ModelLoader
        isLoading={isLoading}
        progress={modelProgress}
        modelName="GPT-4"
        stage={modelProgress < 100 ? 'download' : 'ready'}
      />

      {/* Parameter Controls */}
      <ParameterPanel
        parameters={[
          {
            name: 'temperature',
            value: parameters.temperature,
            min: 0,
            max: 2,
            step: 0.1,
            label: 'Temperature',
            description: 'Controls randomness',
          },
          {
            name: 'topP',
            value: parameters.topP,
            min: 0,
            max: 1,
            step: 0.1,
            label: 'Top P',
            description: 'Nucleus sampling',
          },
        ]}
        onChange={(name, value) => {
          setParameters((prev) => ({ ...prev, [name]: value }));
        }}
      />

      {/* Queue Status */}
      {queuePosition > 0 && (
        <QueueProgress
          position={queuePosition}
          totalInQueue={5}
          estimatedWaitTime={queuePosition * 1000}
        />
      )}

      {/* Messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
            {msg.tokens > 0 && <small>{msg.tokens} tokens</small>}
          </div>
        ))}
      </div>

      {/* Current Streaming */}
      {currentTokens > 0 && (
        <StreamProgress
          tokensGenerated={currentTokens}
          maxTokens={parameters.maxTokens}
          showRate={true}
          showCost={true}
          costPerToken={0.00003}
        />
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
          sendMessage(input.value);
          input.value = '';
        }}
      >
        <input name="message" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

---

## ✅ Best Practices

### 1. Version Pinning

```json
{
  "dependencies": {
    "ai-progress-controls": "^0.1.0",
    "ai-progress-controls-react": "^0.1.0"
  }
}
```

Use `^` for minor updates, exact version for stability.

### 2. Type Safety

```tsx
import type { StreamProgressProps, ModelLoaderProps } from 'ai-progress-controls-react';

// Type-safe configurations
const config: StreamProgressProps = {
  tokensGenerated: 500,
  maxTokens: 2000,
  showRate: true,
};
```

### 3. Error Handling

```tsx
const [error, setError] = useState<string | null>(null);

try {
  const response = await fetch('/api/chat');
  if (!response.ok) throw new Error('API error');
  // Process stream...
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
}

return (
  <>
    {error && <div className="error">{error}</div>}
    <StreamProgress tokensGenerated={tokens} maxTokens={2000} />
  </>
);
```

### 4. Performance Optimization

```tsx
import { memo } from 'react';
import { StreamProgress } from 'ai-progress-controls-react';

// Memoize to prevent unnecessary re-renders
export const OptimizedProgress = memo(StreamProgress);
```

### 5. Accessibility

```tsx
<div role="region" aria-label="AI Progress">
  <StreamProgress
    tokensGenerated={tokens}
    maxTokens={2000}
    aria-label="Token generation progress"
  />
</div>
```

---

## 📚 Additional Resources

- **[Complete API Documentation](./api/)** - All props and methods
- **[React Examples](./react-examples.md)** - 7 ready-to-use examples
- **[Next.js Examples](./nextjs-examples.md)** - SSR patterns
- **[Theming Guide](./theming.md)** - Customization options
- **[GitHub Repository](https://github.com/Maneesh-Relanto/ai-progress-controls)** - Source code and issues
