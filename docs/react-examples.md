# ⚛️ React Examples

Complete examples for using AI Progress Controls in React applications.

## 📦 Installation

```bash
npm install ai-progress-controls ai-progress-controls-react
```

---

## 🌊 StreamProgress - Token Streaming

Perfect for ChatGPT-style streaming responses.

```tsx
import { StreamProgress } from 'ai-progress-controls-react';
import { useState } from 'react';

function StreamingChat() {
  const [tokens, setTokens] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async () => {
    setIsStreaming(true);
    setTokens(0);

    // Simulate streaming
    const interval = setInterval(() => {
      setTokens((prev) => {
        if (prev >= 2000) {
          clearInterval(interval);
          setIsStreaming(false);
          return prev;
        }
        return prev + 25;
      });
    }, 100);
  };

  return (
    <div>
      <StreamProgress
        maxTokens={2000}
        tokensGenerated={tokens}
        model="gpt-4"
        showRate={true}
        showCost={true}
        costPerToken={0.00003}
      />

      {!isStreaming && <button onClick={startStreaming}>Start Streaming</button>}
    </div>
  );
}
```

---

## 📥 ModelLoader - Model Loading

Display multi-stage model loading progress.

```tsx
import { ModelLoader } from 'ai-progress-controls-react';
import { useState, useEffect } from 'react';

function ModelLoadingExample() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'download' | 'initialize' | 'ready'>('download');

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;

        // Change stages based on progress
        if (next > 30 && next <= 60) {
          setStage('initialize');
        } else if (next > 60) {
          setStage('ready');
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <ModelLoader
      isLoading={isLoading}
      progress={progress}
      modelName="Llama 3.1 70B"
      stage={stage}
      memoryUsage={4.2}
    />
  );
}
```

---

## 🎛️ ParameterSlider - Single Parameter Control

Control individual LLM parameters like temperature.

```tsx
import { ParameterSlider } from 'ai-progress-controls-react';
import { useState } from 'react';

function TemperatureControl() {
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div>
      <ParameterSlider
        name="temperature"
        label="Temperature"
        value={temperature}
        min={0}
        max={2}
        step={0.1}
        onChange={(value) => setTemperature(value)}
        description="Controls randomness. Lower = focused, Higher = creative"
      />

      <p>Current value: {temperature}</p>
    </div>
  );
}
```

---

## 🎚️ ParameterPanel - Multiple Parameters

Unified panel for all LLM parameters with presets.

```tsx
import { ParameterPanel } from 'ai-progress-controls-react';
import { useState } from 'react';

function LLMConfiguration() {
  const [params, setParams] = useState({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  return (
    <ParameterPanel
      parameters={params}
      onParameterChange={(name, value) => {
        setParams((prev) => ({ ...prev, [name]: value }));
      }}
      preset="balanced"
      showPresets={true}
    />
  );
}
```

---

## 📊 BatchProgress - Batch Processing

Track multiple concurrent operations.

```tsx
import { BatchProgress } from 'ai-progress-controls-react';
import { useState } from 'react';

function BatchProcessing() {
  const [items, setItems] = useState([
    { id: '1', label: 'Process document 1', status: 'pending' },
    { id: '2', label: 'Process document 2', status: 'pending' },
    { id: '3', label: 'Process document 3', status: 'pending' },
  ]);

  const startBatch = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i))
        );

        setTimeout(() => {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: 'completed' } : i))
          );
        }, 2000);
      }, index * 1000);
    });
  };

  return (
    <div>
      <BatchProgress items={items} label="Document Processing" showStats={true} />

      <button onClick={startBatch}>Start Batch</button>
    </div>
  );
}
```

---

## ⏳ QueueProgress - Queue Position

Show position in processing queue with ETA.

```tsx
import { QueueProgress } from 'ai-progress-controls-react';
import { useState, useEffect } from 'react';

function QueueExample() {
  const [position, setPosition] = useState(5);
  const [total, setTotal] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => Math.max(0, prev - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <QueueProgress
      position={position}
      total={total}
      estimatedWaitTime={position * 30}
      label="Processing Queue"
    />
  );
}
```

---

## 🔄 RetryProgress - Exponential Backoff

Visualize retry logic with exponential backoff.

```tsx
import { RetryProgress } from 'ai-progress-controls-react';
import { useState } from 'react';

function RetryExample() {
  const [attempt, setAttempt] = useState(0);
  const [maxAttempts] = useState(5);
  const [isRetrying, setIsRetrying] = useState(false);

  const simulateRetry = () => {
    setIsRetrying(true);
    setAttempt(0);

    const retry = (current: number) => {
      if (current >= maxAttempts) {
        setIsRetrying(false);
        return;
      }

      setAttempt(current + 1);

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.pow(2, current) * 1000;
      setTimeout(() => retry(current + 1), delay);
    };

    retry(0);
  };

  return (
    <div>
      <RetryProgress
        attempt={attempt}
        maxAttempts={maxAttempts}
        strategy="exponential"
        nextRetryIn={Math.pow(2, attempt) * 1000}
      />

      {!isRetrying && <button onClick={simulateRetry}>Simulate Retry</button>}
    </div>
  );
}
```

---

## 🎨 Visual Variants

All components support visual variants:

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

function VariantsExample() {
  return (
    <>
      {/* Default */}
      <StreamProgress variant="default" />

      {/* Minimal */}
      <StreamProgress variant="minimal" />

      {/* Gradient */}
      <StreamProgress variant="gradient" animation="pulse" />

      {/* Glassmorphic */}
      <StreamProgress variant="glassmorphic" animation="glow" />
    </>
  );
}
```

---

## 📏 Sizes

Choose from 3 sizes:

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

function SizesExample() {
  return (
    <>
      <StreamProgress size="compact" />
      <StreamProgress size="default" />
      <StreamProgress size="large" />
    </>
  );
}
```

---

## 🎨 Theming

Apply brand themes:

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

function ThemingExample() {
  return (
    <>
      <StreamProgress theme="openai" />
      <StreamProgress theme="anthropic" />
      <StreamProgress theme="google-ai" />
      <StreamProgress theme="cohere" />
      <StreamProgress theme="dark" />
    </>
  );
}
```

---

## 🔗 Resources

- [⚛️ React Adapter Documentation](../adapters/react/README.md)
- [📚 API Documentation](./api/)
- [🎮 Live Examples](../examples/)
- [🚀 Quick Start](./QUICK_START.md)
- [📦 Installation Guide](./installation-guide.md)
