# StreamProgress API Documentation

## Overview

`StreamProgress` is a Web Component that displays real-time progress for streaming AI responses, such as LLM token generation. It shows token count, generation rate, cost estimation, and provides user controls.

## Table of Contents

- [Installation](#installation)
- [Constructor](#constructor)
- [Configuration](#configuration)
- [Methods](#methods)
- [Events](#events)
- [Properties](#properties)
- [Styling](#styling)
- [Examples](#examples)

---

## Installation

```bash
npm install ai-progress-controls
```

```javascript
import { StreamProgress } from 'ai-progress-controls';
```

---

## Constructor

### `new StreamProgress(config?: StreamProgressConfig)`

Creates a new StreamProgress component instance.

**Parameters:**

| Parameter | Type                   | Description                   |
| --------- | ---------------------- | ----------------------------- |
| `config`  | `StreamProgressConfig` | Optional configuration object |

**Returns:** `StreamProgress` instance

**Example:**

```javascript
const progress = new StreamProgress({
  maxTokens: 2000,
  costPerToken: 0.00002,
  showRate: true,
  showCost: true,
});
```

---

## Configuration

### StreamProgressConfig

Configuration object passed to the constructor.

| Property           | Type      | Default                | Description                   |
| ------------------ | --------- | ---------------------- | ----------------------------- |
| `maxTokens`        | `number`  | `4000`                 | Maximum tokens allowed        |
| `costPerToken`     | `number`  | `0.00002`              | Cost per token for estimation |
| `currency`         | `string`  | `'$'`                  | Currency symbol               |
| `showRate`         | `boolean` | `true`                 | Show tokens per second        |
| `showCost`         | `boolean` | `true`                 | Show cost estimation          |
| `showProgressBar`  | `boolean` | `true`                 | Show progress bar             |
| `showCancelButton` | `boolean` | `true`                 | Show cancel button            |
| `smoothProgress`   | `boolean` | `true`                 | Enable smooth animations      |
| `updateThrottle`   | `number`  | `100`                  | Update throttle (ms)          |
| `cancelLabel`      | `string`  | `'Cancel'`             | Cancel button label           |
| `debug`            | `boolean` | `false`                | Enable debug logging          |
| `className`        | `string`  | `''`                   | Custom CSS class              |
| `ariaLabel`        | `string`  | `'AI Stream Progress'` | ARIA label                    |

**Example:**

```javascript
const config = {
  maxTokens: 8000,
  costPerToken: 0.00003, // GPT-4 pricing
  showRate: true,
  showCost: true,
  showCancelButton: true,
  cancelLabel: 'Stop Generation',
  debug: true,
};

const progress = new StreamProgress(config);
```

---

## Methods

### `start(message?: string): void`

Start streaming and initialize the progress display.

**Parameters:**

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `message` | `string` | Optional status message to display |

**Example:**

```javascript
progress.start('Generating response...');
```

**Fires:** `streamstart` event

---

### `update(update: StreamProgressUpdate): void`

Update the progress with new token count and rate.

**Parameters:**

| Parameter                | Type     | Required | Description                                  |
| ------------------------ | -------- | -------- | -------------------------------------------- |
| `update.tokensGenerated` | `number` | ✅ Yes   | Current token count                          |
| `update.tokensPerSecond` | `number` | ❌ No    | Generation rate (auto-calculated if omitted) |
| `update.message`         | `string` | ❌ No    | Status message to display                    |

**Example:**

```javascript
progress.update({
  tokensGenerated: 150,
  tokensPerSecond: 25,
  message: 'Processing...',
});
```

**Fires:** `streamupdate` event

---

### `complete(): void`

Mark the stream as completed.

**Example:**

```javascript
progress.complete();
```

**Fires:** `streamcomplete` event

---

### `cancel(reason?: 'user' | 'error' | 'timeout'): void`

Cancel the stream.

**Parameters:**

| Parameter | Type                             | Default  | Description         |
| --------- | -------------------------------- | -------- | ------------------- |
| `reason`  | `'user' \| 'error' \| 'timeout'` | `'user'` | Cancellation reason |

**Example:**

```javascript
// User clicked cancel
progress.cancel('user');

// Error occurred
progress.cancel('error');

// Timeout
progress.cancel('timeout');
```

**Fires:** `streamcancel` event

---

### `reset(): void`

Reset the component to initial state.

**Example:**

```javascript
progress.reset();
```

---

### `getState(): Readonly<StreamProgressState>`

Get the current state (for debugging/inspection).

**Returns:** `StreamProgressState` object

**Example:**

```javascript
const state = progress.getState();
console.log('Tokens generated:', state.tokensGenerated);
console.log('Is streaming:', state.isStreaming);
console.log('Total cost:', state.totalCost);
```

---

### `getConfig(): Readonly<StreamProgressConfig>`

Get the current configuration.

**Returns:** `StreamProgressConfig` object

**Example:**

```javascript
const config = progress.getConfig();
console.log('Max tokens:', config.maxTokens);
console.log('Cost per token:', config.costPerToken);
```

---

## Events

All events are `CustomEvent` instances with a `detail` property containing event-specific data.

### `streamstart`

Fired when streaming starts.

**Detail:**

```typescript
{
  startTime: number;  // Timestamp
  message?: string;   // Optional message
}
```

**Example:**

```javascript
progress.addEventListener('streamstart', (e) => {
  console.log('Stream started at', new Date(e.detail.startTime));
});
```

---

### `streamupdate`

Fired when progress is updated (throttled).

**Detail:**

```typescript
{
  tokensGenerated: number;    // Current token count
  tokensPerSecond: number;    // Generation rate
  totalCost: number;          // Total cost so far
  isStreaming: boolean;       // Streaming status
  message?: string;           // Status message
}
```

**Example:**

```javascript
progress.addEventListener('streamupdate', (e) => {
  console.log(`${e.detail.tokensGenerated} tokens at ${e.detail.tokensPerSecond} t/s`);
  console.log(`Cost: $${e.detail.totalCost.toFixed(4)}`);
});
```

---

### `streamcomplete`

Fired when streaming completes successfully.

**Detail:**

```typescript
{
  tokensGenerated: number; // Total tokens generated
  duration: number; // Duration in milliseconds
  totalCost: number; // Total cost
  averageRate: number; // Average tokens per second
}
```

**Example:**

```javascript
progress.addEventListener('streamcomplete', (e) => {
  console.log(`Generated ${e.detail.tokensGenerated} tokens in ${e.detail.duration}ms`);
  console.log(`Average rate: ${e.detail.averageRate.toFixed(1)} tokens/s`);
  console.log(`Total cost: $${e.detail.totalCost.toFixed(4)}`);
});
```

---

### `streamcancel`

Fired when streaming is cancelled.

**Detail:**

```typescript
{
  tokensGenerated: number; // Tokens generated before cancellation
  duration: number; // Duration in milliseconds
  reason: 'user' | 'error' | 'timeout'; // Cancellation reason
}
```

**Example:**

```javascript
progress.addEventListener('streamcancel', (e) => {
  console.log(`Stream cancelled (${e.detail.reason})`);
  console.log(`Generated ${e.detail.tokensGenerated} tokens before cancellation`);
});
```

---

## Properties

### `disabled: boolean`

Get or set the disabled state.

**Example:**

```javascript
// Disable the component
progress.disabled = true;

// Check if disabled
if (progress.disabled) {
  console.log('Component is disabled');
}
```

---

## Styling

Components use CSS custom properties (CSS variables) for theming.

### CSS Custom Properties

| Property                | Default           | Description            |
| ----------------------- | ----------------- | ---------------------- |
| `--ai-primary-color`    | `#3b82f6`         | Primary accent color   |
| `--ai-secondary-color`  | `#10b981`         | Secondary accent color |
| `--ai-background-color` | `#ffffff`         | Background color       |
| `--ai-text-color`       | `#1f2937`         | Text color             |
| `--ai-border-color`     | `#e5e7eb`         | Border color           |
| `--ai-border-radius`    | `8px`             | Border radius          |
| `--ai-font-family`      | System font stack | Font family            |
| `--ai-font-size`        | `14px`            | Base font size         |
| `--ai-spacing`          | `12px`            | Base spacing unit      |

### Custom Styling Example

```css
/* Custom theme */
stream-progress {
  --ai-primary-color: #8b5cf6;
  --ai-secondary-color: #ec4899;
  --ai-border-radius: 12px;
  --ai-font-size: 16px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  stream-progress {
    --ai-background-color: #1f2937;
    --ai-text-color: #f9fafb;
    --ai-border-color: #374151;
  }
}

/* Custom class */
stream-progress.compact {
  --ai-spacing: 8px;
  --ai-font-size: 12px;
}
```

---

## Examples

### Basic Example

```javascript
import { StreamProgress } from 'ai-progress-controls';

const progress = new StreamProgress({
  maxTokens: 1000,
  costPerToken: 0.00002,
});

document.body.appendChild(progress);

progress.start();

let tokens = 0;
const interval = setInterval(() => {
  tokens += 25;
  progress.update({ tokensGenerated: tokens, tokensPerSecond: 25 });

  if (tokens >= 500) {
    clearInterval(interval);
    progress.complete();
  }
}, 100);
```

### OpenAI Integration

```javascript
import { StreamProgress } from 'ai-progress-controls';
import OpenAI from 'openai';

async function streamWithProgress(prompt) {
  const progress = new StreamProgress({
    maxTokens: 2000,
    costPerToken: 0.00003, // GPT-4
    showRate: true,
    showCost: true,
  });

  document.body.appendChild(progress);
  progress.start('Connecting to OpenAI...');

  const openai = new OpenAI({ apiKey: 'your-api-key' });
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  let tokens = 0;
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      tokens++;
      progress.update({ tokensGenerated: tokens });
    }

    if (chunk.choices[0]?.finish_reason) {
      progress.complete();
    }
  }
}
```

### Anthropic Integration

```javascript
import { StreamProgress } from 'ai-progress-controls';
import Anthropic from '@anthropic-ai/sdk';

async function streamClaude(prompt) {
  const progress = new StreamProgress({
    maxTokens: 4000,
    costPerToken: 0.000024, // Claude pricing
  });

  document.body.appendChild(progress);
  progress.start('Connecting to Anthropic...');

  const anthropic = new Anthropic({ apiKey: 'your-api-key' });
  const stream = await anthropic.messages.stream({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  let tokens = 0;
  stream.on('text', (text) => {
    tokens += text.length / 4; // Rough token estimation
    progress.update({ tokensGenerated: Math.floor(tokens) });
  });

  stream.on('message', () => {
    progress.complete();
  });
}
```

---

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import {
  StreamProgress,
  StreamProgressConfig,
  StreamProgressUpdate,
  StreamCompleteEvent,
  StreamCancelEvent,
} from 'ai-progress-controls';

const config: StreamProgressConfig = {
  maxTokens: 2000,
  costPerToken: 0.00002,
  showRate: true,
};

const progress = new StreamProgress(config);

progress.addEventListener('streamcomplete', (e: CustomEvent<StreamCompleteEvent>) => {
  const { tokensGenerated, duration, averageRate } = e.detail;
  console.log(`Generated ${tokensGenerated} tokens in ${duration}ms`);
});
```

---

## Accessibility

StreamProgress is built with accessibility in mind:

- **ARIA Attributes**: `role="progressbar"`, `aria-valuenow`, `aria-valuemax`, `aria-label`
- **Keyboard Navigation**: Cancel button is keyboard accessible
- **Screen Readers**: Updates are announced
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Works with high contrast modes

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires support for:

- Web Components (Custom Elements v1)
- Shadow DOM
- ES2020 features

---

## Performance

- **Bundle Size**: ~8KB gzipped
- **Update Throttling**: Configurable (default 100ms)
- **Smooth Animations**: RequestAnimationFrame-based
- **Memory**: Minimal overhead

---

## Best Practices

1. **Always call `start()` before `update()`**
2. **Call `complete()` or `cancel()` when done**
3. **Use `reset()` to reuse the same instance**
4. **Throttle updates** for optimal performance (default: 100ms)
5. **Listen to events** for state management
6. **Set appropriate `maxTokens`** for your use case
7. **Use `debug: true`** during development

---

## Troubleshooting

### Progress not showing

- Ensure you've added the component to the DOM: `document.body.appendChild(progress)`
- Call `start()` before `update()`

### Updates not appearing

- Check that update throttle isn't too high
- Verify `tokensGenerated` is increasing

### Cancel button not working

- Ensure `showCancelButton: true` in config
- Listen to `streamcancel` event to handle cancellation in your code

---

## Related

- [Getting Started Guide](../getting-started.md)
- [Examples](../../examples/vanilla/stream-progress.html)
- [GitHub Repository](https://github.com/Maneesh-Relanto/ai-progress-controls)
