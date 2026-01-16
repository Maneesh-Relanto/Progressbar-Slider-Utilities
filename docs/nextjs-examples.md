# ▲ Next.js Examples

Complete examples for using AI Progress Controls in Next.js applications with full SSR support.

## 📦 Installation

```bash
npm install ai-progress-controls @ai-progress-controls/next
```

---

## 🏗️ App Router (Recommended)

All examples use Next.js 13+ App Router with Server and Client Components.

---

## 🌊 StreamProgress - Token Streaming

### Client Component with State

```tsx
// app/components/StreamingChat.tsx
'use client';

import { StreamProgress } from '@ai-progress-controls/next';
import { useState } from 'react';

export function StreamingChat() {
  const [tokens, setTokens] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async () => {
    setIsStreaming(true);
    setTokens(0);

    // Call your API route
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello!' }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const text = decoder.decode(value);
      setTokens((prev) => prev + text.split(' ').length);
    }

    setIsStreaming(false);
  };

  return (
    <div>
      <StreamProgress
        maxTokens={2000}
        tokensGenerated={tokens}
        model="gpt-4"
        showRate={true}
        showCost={true}
      />

      {!isStreaming && <button onClick={startStreaming}>Start Chat</button>}
    </div>
  );
}
```

### Server Component Page

```tsx
// app/page.tsx
import { StreamingChat } from './components/StreamingChat';

export default function HomePage() {
  return (
    <main>
      <h1>AI Chat Interface</h1>
      <StreamingChat />
    </main>
  );
}
```

---

## 📥 ModelLoader - Model Loading

### Dynamic Import with Loading State

```tsx
// app/components/ModelLoadingExample.tsx
'use client';

import { ModelLoader } from '@ai-progress-controls/next';
import { useState, useEffect } from 'react';

export function ModelLoadingExample() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'download' | 'initialize' | 'ready'>('download');

  useEffect(() => {
    // Simulate model loading
    const loadModel = async () => {
      setStage('download');
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);

        if (i === 40) setStage('initialize');
        if (i === 70) setStage('ready');

        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      setIsLoading(false);
    };

    loadModel();
  }, []);

  return (
    <ModelLoader
      isLoading={isLoading}
      progress={progress}
      modelName="Llama 3.1 70B"
      stage={stage}
    />
  );
}
```

---

## 🎛️ Parameter Controls

### Server Action Integration

```tsx
// app/actions.ts
'use server';

export async function updateLLMParameters(params: {
  temperature: number;
  topP: number;
  maxTokens: number;
}) {
  // Save to database or update session
  console.log('Parameters updated:', params);
  return { success: true };
}
```

```tsx
// app/components/ParameterConfig.tsx
'use client';

import { ParameterPanel } from '@ai-progress-controls/next';
import { useState } from 'react';
import { updateLLMParameters } from '../actions';

export function ParameterConfig() {
  const [params, setParams] = useState({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000,
  });

  const handleParameterChange = async (name: string, value: number) => {
    const newParams = { ...params, [name]: value };
    setParams(newParams);

    // Update server-side
    await updateLLMParameters(newParams);
  };

  return (
    <ParameterPanel
      parameters={params}
      onParameterChange={handleParameterChange}
      preset="balanced"
      showPresets={true}
    />
  );
}
```

---

## 📊 Batch Processing with API Routes

### API Route Handler

```tsx
// app/api/batch/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { items } = await request.json();

  // Process items
  const results = await Promise.all(
    items.map(async (item: any) => {
      // Your processing logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...item, status: 'completed' };
    })
  );

  return NextResponse.json({ results });
}
```

### Client Component

```tsx
// app/components/BatchProcessor.tsx
'use client';

import { BatchProgress } from '@ai-progress-controls/next';
import { useState } from 'react';

export function BatchProcessor() {
  const [items, setItems] = useState([
    { id: '1', label: 'Document 1', status: 'pending' },
    { id: '2', label: 'Document 2', status: 'pending' },
    { id: '3', label: 'Document 3', status: 'pending' },
  ]);

  const processBatch = async () => {
    // Update items one by one
    for (const item of items) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i)));

      await fetch('/api/batch', {
        method: 'POST',
        body: JSON.stringify({ items: [item] }),
      });

      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'completed' } : i)));
    }
  };

  return (
    <div>
      <BatchProgress items={items} label="Processing Documents" />
      <button onClick={processBatch}>Start Processing</button>
    </div>
  );
}
```

---

## 🔄 Streaming with Server Actions

### Server Action

```tsx
// app/actions.ts
'use server';

export async function* streamResponse(prompt: string) {
  const words = prompt.split(' ');

  for (const word of words) {
    yield { token: word, count: 1 };
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
```

### Client Component

```tsx
// app/components/StreamingWithAction.tsx
'use client';

import { StreamProgress } from '@ai-progress-controls/next';
import { useState } from 'react';
import { streamResponse } from '../actions';

export function StreamingWithAction() {
  const [tokens, setTokens] = useState(0);

  const handleStream = async () => {
    setTokens(0);

    for await (const chunk of streamResponse('Hello world from AI')) {
      setTokens((prev) => prev + chunk.count);
    }
  };

  return (
    <div>
      <StreamProgress tokensGenerated={tokens} maxTokens={100} />
      <button onClick={handleStream}>Start Streaming</button>
    </div>
  );
}
```

---

## 🎨 Theming with CSS Variables

### Global Theme Configuration

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Progress Controls Demo',
  description: 'Next.js + AI Progress Controls',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark-theme">{children}</body>
    </html>
  );
}
```

```css
/* app/globals.css */
.dark-theme {
  --progress-bg: #1a1a1a;
  --progress-fill: #3b82f6;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
}
```

---

## 🔒 Protected Routes with Progress

```tsx
// app/dashboard/page.tsx
import { StreamProgress } from '@ai-progress-controls/next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <StreamProgress model={session.preferences.model} maxTokens={session.preferences.maxTokens} />
    </div>
  );
}
```

---

## 📱 Responsive Design

All components are responsive by default, but you can customize:

```tsx
'use client';

import { StreamProgress } from '@ai-progress-controls/next';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ResponsiveProgress() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <StreamProgress
      size={isMobile ? 'compact' : 'default'}
      showRate={!isMobile}
      showCost={!isMobile}
    />
  );
}
```

---

## ⚡ Performance Optimization

### Memoization

```tsx
'use client';

import { StreamProgress } from '@ai-progress-controls/next';
import { memo } from 'react';

export const MemoizedProgress = memo(StreamProgress);
```

### Dynamic Import

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const StreamProgress = dynamic(
  () => import('@ai-progress-controls/next').then((mod) => mod.StreamProgress),
  { ssr: false }
);

export default function Page() {
  return <StreamProgress maxTokens={2000} />;
}
```

---

## 🔗 Resources

- [▲ Next.js Adapter Documentation](../adapters/next/README.md)
- [⚛️ React Examples](./react-examples.md)
- [📚 API Documentation](./api/)
- [🌐 Web Components Guide](./getting-started.md)
