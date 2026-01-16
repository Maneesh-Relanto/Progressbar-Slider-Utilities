# 🎯 Quick Reference - 2 Minute Guide

## Install & Use in 30 Seconds

### ⚛️ React

```bash
npm install ai-progress-controls ai-progress-controls-react
```

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

<StreamProgress tokensGenerated={500} maxTokens={2000} showRate />;
```

### ▲ Next.js

```bash
npm install ai-progress-controls ai-progress-controls-next
```

```tsx
'use client';
import { StreamProgress } from 'ai-progress-controls-next';

<StreamProgress tokensGenerated={500} maxTokens={2000} />;
```

---

## 📦 All 7 Components

| Component           | Use Case                        | Key Props                                              |
| ------------------- | ------------------------------- | ------------------------------------------------------ |
| **StreamProgress**  | Token streaming, LLM generation | `tokensGenerated`, `maxTokens`, `showRate`, `showCost` |
| **ModelLoader**     | Model download/initialization   | `isLoading`, `progress`, `modelName`, `stage`          |
| **ParameterSlider** | Single LLM parameter            | `value`, `min`, `max`, `label`, `onChange`             |
| **ParameterPanel**  | Multiple parameters             | `parameters[]`, `onChange`                             |
| **QueueProgress**   | Queue position tracking         | `position`, `totalInQueue`, `estimatedWaitTime`        |
| **RetryProgress**   | Retry with backoff              | `attempt`, `maxAttempts`, `nextRetryIn`                |
| **BatchProgress**   | Batch processing                | `items[]`, `totalItems`, `concurrency`                 |

---

## 🎨 Quick Customization

### Themes

```tsx
<StreamProgress theme="openai" />
<StreamProgress theme="anthropic" />
<StreamProgress theme="google-ai" />
<StreamProgress theme="dark" />
```

### Variants

```tsx
<StreamProgress variant="minimal" />
<StreamProgress variant="gradient" />
<StreamProgress variant="glassmorphic" />
```

### Sizes

```tsx
<StreamProgress size="compact" />
<StreamProgress size="default" />
<StreamProgress size="large" />
```

### Animations

```tsx
<StreamProgress animation="none" />
<StreamProgress animation="striped" />
<StreamProgress animation="pulse" />
<StreamProgress animation="glow" />
```

---

## 💡 Common Patterns

### OpenAI Streaming

```tsx
import { StreamProgress } from 'ai-progress-controls-react';
import OpenAI from 'openai';

const [tokens, setTokens] = useState(0);

const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  stream: true
});

for await (const chunk of stream) {
  setTokens(prev => prev + 1);
}

return <StreamProgress tokensGenerated={tokens} maxTokens={4096} />;
```

### Model Loading

```tsx
import { ModelLoader } from 'ai-progress-controls-react';

const [progress, setProgress] = useState(0);
const [stage, setStage] = useState('download');

return (
  <ModelLoader isLoading={progress < 100} progress={progress} modelName="GPT-4" stage={stage} />
);
```

### Parameter Control

```tsx
import { ParameterSlider } from 'ai-progress-controls-react';

const [temp, setTemp] = useState(0.7);

return (
  <ParameterSlider value={temp} min={0} max={2} step={0.1} label="Temperature" onChange={setTemp} />
);
```

---

## 🔧 TypeScript Support

```tsx
import { StreamProgress, type StreamProgressProps } from 'ai-progress-controls-react';

const config: StreamProgressProps = {
  tokensGenerated: 500,
  maxTokens: 2000,
  showRate: true,
};

<StreamProgress {...config} />;
```

---

## 📚 Learn More

- **[Installation Guide](./installation-guide.md)** - Complete setup instructions
- **[npm Usage Examples](./npm-usage-examples.md)** - Real-world patterns
- **[React Examples](./react-examples.md)** - 7 ready-to-use examples
- **[API Reference](./api/)** - Complete prop documentation

---

## 🆘 Troubleshooting

**Types not working?**

```tsx
// ✅ Use adapter package
import { StreamProgress } from 'ai-progress-controls-react';

// ❌ Not the core package
import { StreamProgress } from 'ai-progress-controls';
```

**Next.js not rendering?**

```tsx
// Add 'use client' directive
'use client';
import { StreamProgress } from 'ai-progress-controls-next';
```

**Styles missing (Web Components)?**

```typescript
import 'ai-progress-controls/dist/style.css';
```

---

## 📦 Packages

- **Core**: `ai-progress-controls` (Web Components)
- **React**: `ai-progress-controls-react` (React 18+)
- **Next.js**: `ai-progress-controls-next` (Next.js 13+ App Router)

All include TypeScript types automatically.
