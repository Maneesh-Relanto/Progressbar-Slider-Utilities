# @ai-progress-controls/next

Next.js adapters for [AI Progress Controls](https://github.com/Maneesh-Relanto/ai-progress-controls) - Production-ready UI components for AI/ML workflows with full SSR support.

[![npm version](https://img.shields.io/npm/v/@ai-progress-controls/next.svg)](https://www.npmjs.com/package/@ai-progress-controls/next)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B%20%7C%2015%2B%20%7C%2016%2B-000000?logo=next.js)](https://nextjs.org/)

## 🎯 Why This Package?

The core `ai-progress-controls` library is built with Web Components. This package provides **Next.js-optimized wrappers** with full SSR support:

✅ **SSR-safe** - Works with Next.js App Router and Pages Router  
✅ **'use client' directive** - Properly marked as client components  
✅ **No hydration errors** - Clean server/client boundary  
✅ **TypeScript support** - Full type definitions included  
✅ **Zero configuration** - No dynamic imports needed

## 📦 Installation

```bash
npm install ai-progress-controls @ai-progress-controls/next
```

**Note:** Both packages are required. The core package contains the Web Components, while this package provides the Next.js wrappers.

## 🚀 Quick Start

### App Router (Recommended)

```tsx
import { StreamProgress } from '@ai-progress-controls/next';

export default function Page() {
  const [tokens, setTokens] = useState(0);
  const [progress, setProgress] = useState(0);

  return <StreamProgress tokensGenerated={tokens} progress={progress} maxTokens={2000} />;
}
```

That's it! No `'use client'` needed in your page - the adapter handles it.

### Pages Router

```tsx
import { StreamProgress } from '@ai-progress-controls/next';

export default function HomePage() {
  const [tokens, setTokens] = useState(0);
  const [progress, setProgress] = useState(0);

  return <StreamProgress tokensGenerated={tokens} progress={progress} maxTokens={2000} />;
}
```

## 📚 Components

All 7 components from the core library are available with SSR support:

### 1. BatchProgress

```tsx
import { BatchProgress } from '@ai-progress-controls/next';

export default function MyComponent() {
  const items = [
    { id: '1', label: 'Task 1', status: 'completed' },
    { id: '2', label: 'Task 2', status: 'processing' },
    { id: '3', label: 'Task 3', status: 'pending' },
  ];

  return <BatchProgress items={items} progress={65} label="Processing batch" />;
}
```

### 2. ModelLoader

```tsx
import { ModelLoader } from '@ai-progress-controls/next';

export default function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <ModelLoader
      isLoading={loading}
      progress={progress}
      modelName="GPT-4"
      stage={progress < 50 ? 'download' : 'initialize'}
    />
  );
}
```

### 3. ParameterPanel

```tsx
import { ParameterPanel } from '@ai-progress-controls/next';

export default function MyComponent() {
  const [params, setParams] = useState({
    temperature: { value: 0.7, min: 0, max: 2, step: 0.1, label: 'Temperature' },
    maxTokens: { value: 2048, min: 1, max: 4096, step: 1, label: 'Max Tokens' },
  });

  const handleChange = (key: string, value: number) => {
    setParams((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  return <ParameterPanel parameters={params} onChange={handleChange} />;
}
```

### 4. ParameterSlider

```tsx
import { ParameterSlider } from '@ai-progress-controls/next';

export default function MyComponent() {
  const [temperature, setTemperature] = useState(0.7);

  return (
    <ParameterSlider
      value={temperature}
      min={0}
      max={2}
      step={0.1}
      label="Temperature"
      onChange={setTemperature}
    />
  );
}
```

### 5. QueueProgress

```tsx
import { QueueProgress } from '@ai-progress-controls/next';

export default function MyComponent() {
  const [position, setPosition] = useState(5);
  return <QueueProgress position={position} queueSize={20} />;
}
```

### 6. RetryProgress

```tsx
import { RetryProgress } from '@ai-progress-controls/next';

export default function MyComponent() {
  const [attempt, setAttempt] = useState(1);
  return <RetryProgress attempt={attempt} maxAttempts={5} />;
}
```

### 7. StreamProgress

```tsx
import { StreamProgress } from '@ai-progress-controls/next';

export default function MyComponent() {
  const [tokens, setTokens] = useState(0);
  const [progress, setProgress] = useState(0);

  return <StreamProgress tokensGenerated={tokens} progress={progress} maxTokens={2000} />;
}
```

## 🎨 Styling & Theming

The components inherit all styling capabilities from the core library:

```tsx
import { StreamProgress } from '@ai-progress-controls/next';

export default function ThemedComponent() {
  return (
    <div
      style={{
        '--progress-primary': '#646cff',
        '--progress-bg': '#1a1a1a',
        '--progress-text': '#ffffff',
      }}
    >
      <StreamProgress tokensGenerated={50} progress={25} />
    </div>
  );
}
```

## 🔧 SSR & Hydration

This package handles SSR automatically. No special configuration needed!

**What happens:**

1. Server renders a placeholder `<div>`
2. Client hydrates and mounts the Web Component
3. Zero hydration errors

**No need for:**

- ❌ `dynamic` imports with `ssr: false`
- ❌ `useEffect` checks for `window`
- ❌ Conditional rendering

## 🎯 Best Practices

### 1. **State Management**

Keep state in React, not in the Web Component:

```tsx
// ✅ Good
export default function MyComponent() {
  const [progress, setProgress] = useState(0);
  return <StreamProgress progress={progress} tokensGenerated={100} />;
}
```

### 2. **App Router vs Pages Router**

Both work identically! The adapter uses `'use client'` internally.

### 3. **TypeScript**

Full TypeScript support included:

```tsx
import type { StreamProgressProps } from '@ai-progress-controls/next';

const props: StreamProgressProps = {
  tokensGenerated: 100,
  progress: 50,
  maxTokens: 2000,
};
```

## 🚨 Common Issues

### Issue: "Hydration failed" error

**Cause:** Usually not from this package  
**Solution:** Check your page/component for other SSR issues

### Issue: Components don't appear

**Cause:** Web Components not registered  
**Solution:** Ensure `ai-progress-controls` is installed

## 📖 Examples

Check out the [examples directory](../../test-apps/next) in the main repository for complete working examples.

## 🤝 Relationship to Core Library

This package depends on `ai-progress-controls` and provides thin Next.js wrappers. Same features as the React adapter, plus:

- 🎯 SSR-safe rendering
- 🎯 Automatic client boundary with `'use client'`
- 🎯 Next.js 14, 15, 16 support

## 🐛 Issues & Support

For issues specific to the Next.js adapter, please open an issue on the [main repository](https://github.com/Maneesh-Relanto/ai-progress-controls/issues) with the `next-adapter` label.

## 📄 License

MIT © Maneesh Thakur

## 🔗 Links

- [Core Library](https://github.com/Maneesh-Relanto/ai-progress-controls)
- [Documentation](https://github.com/Maneesh-Relanto/ai-progress-controls#readme)
- [Examples](../../test-apps/next)
- [React Adapter](../@ai-progress-controls/react)
