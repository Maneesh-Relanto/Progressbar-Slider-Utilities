# @ai-progress-controls/react

React adapters for [AI Progress Controls](https://github.com/Maneesh-Relanto/ai-progress-controls) - Production-ready UI components for AI/ML workflows.

[![npm version](https://img.shields.io/npm/v/@ai-progress-controls/react.svg)](https://www.npmjs.com/package/@ai-progress-controls/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B%20%7C%2019%2B-61dafb?logo=react)](https://reactjs.org/)

## 📖 Complete Examples

**See [⚛️ React Examples](../../docs/react-examples.md) for full, copy-paste ready code examples!**

---

## 🎯 Why This Package?

The core `ai-progress-controls` library is built with Web Components for maximum compatibility. This package provides **idiomatic React wrappers** that make the components feel native to React:

✅ **React-friendly API** - Props instead of DOM manipulation  
✅ **TypeScript support** - Full type definitions included  
✅ **React lifecycle** - Automatic cleanup and updates  
✅ **Event handling** - React callbacks instead of DOM events  
✅ **No feedback loops** - Smart state management built-in

## 📦 Installation

```bash
npm install ai-progress-controls @ai-progress-controls/react
```

**Note:** Both packages are required. The core package contains the Web Components, while this package provides the React wrappers.

## 🚀 Quick Start

```tsx
import { StreamProgress } from '@ai-progress-controls/react';

function App() {
  const [tokens, setTokens] = useState(0);
  const [progress, setProgress] = useState(0);

  return <StreamProgress tokensGenerated={tokens} progress={progress} maxTokens={2000} />;
}
```

That's it! No manual DOM manipulation, no useEffect, no refs to manage.

## 📚 Components

All 7 components from the core library are available:

### 1. BatchProgress

Track batch processing with multiple items:

```tsx
import { BatchProgress } from '@ai-progress-controls/react';

function MyComponent() {
  const items = [
    { id: 1, label: 'Task 1', status: 'completed' },
    { id: 2, label: 'Task 2', status: 'processing' },
    { id: 3, label: 'Task 3', status: 'pending' },
  ];

  return <BatchProgress items={items} progress={65} label="Processing batch" />;
}
```

**Props:**

- `items: BatchItem[]` - Array of batch items with id, label, and status
- `progress: number` - Overall progress percentage (0-100)
- `label?: string` - Optional label for the batch

---

### 2. ModelLoader

Display model loading progress with stages:

```tsx
import { ModelLoader } from '@ai-progress-controls/react';

function MyComponent() {
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

**Props:**

- `isLoading: boolean` - Whether the model is currently loading
- `progress: number` - Loading progress (0-100)
- `modelName: string` - Name of the model
- `stage?: ModelStage` - Current stage: 'download', 'initialize', 'ready'

---

### 3. ParameterPanel

Unified panel for multiple AI parameters:

```tsx
import { ParameterPanel } from '@ai-progress-controls/react';

function MyComponent() {
  const [params, setParams] = useState({
    temperature: { value: 0.7, min: 0, max: 2, step: 0.1, label: 'Temperature' },
    maxTokens: { value: 2048, min: 1, max: 4096, step: 1, label: 'Max Tokens' },
    topP: { value: 0.9, min: 0, max: 1, step: 0.05, label: 'Top P' },
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

**Props:**

- `parameters: Record<string, ParameterConfig>` - Parameter configurations
- `onChange: (key: string, value: number) => void` - Change callback
- `title?: string` - Optional panel title

**Note:** The wrapper automatically prevents feedback loops during slider dragging.

---

### 4. ParameterSlider

Individual parameter slider:

```tsx
import { ParameterSlider } from '@ai-progress-controls/react';

function MyComponent() {
  const [temperature, setTemperature] = useState(0.7);

  return (
    <ParameterSlider
      value={temperature}
      min={0}
      max={2}
      step={0.1}
      label="Temperature"
      description="Controls randomness in responses"
      onChange={setTemperature}
    />
  );
}
```

**Props:**

- `value: number` - Current value
- `min: number` - Minimum value
- `max: number` - Maximum value
- `step: number` - Step increment
- `label: string` - Parameter label
- `description?: string` - Optional description
- `onChange: (value: number) => void` - Change callback

---

### 5. QueueProgress

Display queue position with ETA:

```tsx
import { QueueProgress } from '@ai-progress-controls/react';

function MyComponent() {
  const [position, setPosition] = useState(5);

  return <QueueProgress position={position} queueSize={20} />;
}
```

**Props:**

- `position: number` - Current position in queue
- `queueSize: number` - Total queue size
- `label?: string` - Optional label

---

### 6. RetryProgress

Track retry attempts with backoff:

```tsx
import { RetryProgress } from '@ai-progress-controls/react';

function MyComponent() {
  const [attempt, setAttempt] = useState(1);

  return <RetryProgress attempt={attempt} maxAttempts={5} />;
}
```

**Props:**

- `attempt: number` - Current retry attempt
- `maxAttempts: number` - Maximum attempts allowed
- `label?: string` - Optional label

---

### 7. StreamProgress

Visualize token streaming:

```tsx
import { StreamProgress } from '@ai-progress-controls/react';

function MyComponent() {
  const [tokens, setTokens] = useState(0);
  const [progress, setProgress] = useState(0);

  return <StreamProgress tokensGenerated={tokens} progress={progress} maxTokens={2000} />;
}
```

**Props:**

- `tokensGenerated: number` - Number of tokens generated
- `progress: number` - Progress percentage (0-100)
- `maxTokens?: number` - Expected maximum tokens
- `label?: string` - Optional label

---

## 🎨 Styling & Theming

The components inherit all styling capabilities from the core library:

```tsx
import { StreamProgress } from '@ai-progress-controls/react';

// Use CSS variables for theming
<div
  style={{
    '--progress-primary': '#646cff',
    '--progress-bg': '#1a1a1a',
    '--progress-text': '#ffffff',
  }}
>
  <StreamProgress tokensGenerated={50} progress={25} />
</div>;
```

See the [core library documentation](https://github.com/Maneesh-Relanto/ai-progress-controls) for all available CSS variables and theming options.

## 🔧 TypeScript

Full TypeScript support is included. All props are strongly typed:

```tsx
import { ParameterPanelProps, ParameterConfig } from '@ai-progress-controls/react';

// Types are automatically inferred
const config: ParameterConfig = {
  value: 0.7,
  min: 0,
  max: 2,
  step: 0.1,
  label: 'Temperature',
};

// Or explicitly type your props
const MyComponent: React.FC<ParameterPanelProps> = ({ parameters, onChange }) => {
  // ...
};
```

## 🎯 Best Practices

### 1. **State Management**

Keep component state in React, not in the Web Component:

```tsx
// ✅ Good - React manages state
function MyComponent() {
  const [progress, setProgress] = useState(0);
  return <StreamProgress progress={progress} tokensGenerated={100} />;
}

// ❌ Avoid - Don't try to read state from the component
function MyComponent() {
  const ref = useRef();
  // Don't do this - use React state instead
  const progress = ref.current?.getProgress();
}
```

### 2. **Cleanup**

The wrappers handle cleanup automatically. No need for manual cleanup in most cases.

### 3. **Updates**

Components re-render efficiently when props change. No need for manual optimization in most cases.

## 🚨 Common Issues

### Issue: Slider jumps when dragging

**Cause:** Updating state too frequently during drag  
**Solution:** Already handled by the wrapper! The adapter prevents feedback loops automatically.

### Issue: TypeScript errors with props

**Cause:** Missing or incorrect prop types  
**Solution:** Import the type interfaces:

```tsx
import { StreamProgressProps } from '@ai-progress-controls/react';
```

## 📖 Examples

Check out the [examples directory](../../test-apps/react) in the main repository for complete working examples.

## 🤝 Relationship to Core Library

This package depends on `ai-progress-controls` and provides thin React wrappers around the Web Components. The components share:

- ✅ Same visual appearance
- ✅ Same behavior and features
- ✅ Same CSS variables and theming
- ✅ Same accessibility features

The wrappers add:

- 🎯 React-friendly prop-based API
- 🎯 Automatic lifecycle management
- 🎯 TypeScript support for JSX
- 🎯 Event handling via callbacks

## 🐛 Issues & Support

For issues specific to the React wrappers, please open an issue on the [main repository](https://github.com/Maneesh-Relanto/ai-progress-controls/issues) with the `react-adapter` label.

## 📄 License

MIT © Maneesh Thakur

## 🔗 Links

- [Core Library](https://github.com/Maneesh-Relanto/ai-progress-controls)
- [Documentation](https://github.com/Maneesh-Relanto/ai-progress-controls#readme)
- [Examples](../../test-apps/react)
- [Next.js Adapter](../@ai-progress-controls/next)
