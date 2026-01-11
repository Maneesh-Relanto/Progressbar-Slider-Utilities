# QueueProgress API Documentation

## Overview

`QueueProgress` is a Web Component for visualizing queue position and estimated wait time for rate-limited AI APIs. Perfect for showing users their position in processing queues with live updates, processing rates, and estimated wait times.

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
import { QueueProgress } from 'ai-progress-controls';
```

---

## Constructor

### `new QueueProgress(config?: QueueProgressConfig)`

Creates a new QueueProgress component instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `QueueProgressConfig` | Optional configuration object |

**Returns:** `QueueProgress` instance

**Example:**

```javascript
const queue = new QueueProgress({
  position: 47,
  queueSize: 120,
  estimatedWait: 180,
  processingRate: 3.5,
  showProgressBar: true
});
```

---

## Configuration

### QueueProgressConfig

Configuration object passed to the constructor.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `position` | `number` | `0` | Initial position in queue |
| `queueSize` | `number` | `0` | Total queue size |
| `estimatedWait` | `number` | `0` | Estimated wait time in seconds |
| `processingRate` | `number` | `1` | Processing rate (items/second) |
| `showPosition` | `boolean` | `true` | Display position counter |
| `showWaitTime` | `boolean` | `true` | Show estimated wait time |
| `showRate` | `boolean` | `true` | Show processing rate |
| `showQueueSize` | `boolean` | `true` | Display total queue size |
| `showProgressBar` | `boolean` | `true` | Show visual progress bar |
| `message` | `string` | `'You are in the queue'` | Custom status message |
| `animate` | `boolean` | `true` | Enable animations |
| `updateThrottle` | `number` | `100` | Update throttle in milliseconds |
| `debug` | `boolean` | `false` | Enable debug logging |
| `className` | `string` | `''` | Custom CSS class |
| `ariaLabel` | `string` | `'Queue Progress'` | ARIA label |

### QueueStatus Type

```typescript
type QueueStatus = 'waiting' | 'processing' | 'completed' | 'cancelled' | 'error';
```

---

## Methods

### `start(message?: string): void`

Start queue tracking.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Optional status message |

**Example:**

```javascript
queue.start('Waiting in API queue...');
```

---

### `update(update: QueueUpdate): void`

Update queue position and metrics.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `update` | `QueueUpdate` | Update data object |

**QueueUpdate Interface:**

```typescript
interface QueueUpdate {
  position?: number;           // New position in queue
  queueSize?: number;          // Updated queue size
  estimatedWait?: number;      // Updated wait time (seconds)
  processingRate?: number;     // Updated processing rate
  message?: string;            // Status message
}
```

**Example:**

```javascript
queue.update({
  position: 25,
  estimatedWait: 90,
  processingRate: 3.2
});
```

---

### `complete(message?: string): void`

Mark queue processing as complete (user reached front).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Optional completion message |

**Example:**

```javascript
queue.complete('Processing started!');
```

---

### `error(message: string): void`

Mark queue as errored.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Error message |

**Example:**

```javascript
queue.error('Queue service unavailable');
```

---

### `cancel(reason?: string): void`

Cancel queue tracking.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `reason` | `string` | Optional cancellation reason |

**Example:**

```javascript
queue.cancel('User cancelled operation');
```

---

### `reset(): void`

Reset to initial state.

**Example:**

```javascript
queue.reset();
```

---

### `getPosition(): number`

Get current position in queue.

**Returns:** Current position

**Example:**

```javascript
const position = queue.getPosition();
console.log(`Position: ${position}`);
```

---

### `getEstimatedWait(): number`

Get estimated wait time in seconds.

**Returns:** Estimated wait time

**Example:**

```javascript
const wait = queue.getEstimatedWait();
console.log(`Wait time: ${wait} seconds`);
```

---

### `getStatus(): QueueStatus`

Get current queue status.

**Returns:** Current status

**Example:**

```javascript
const status = queue.getStatus();
if (status === 'waiting') {
  console.log('Still in queue');
}
```

---

## Events

### `queuestart`

Dispatched when queue tracking starts.

**Event Detail:**

```typescript
{
  position: number;        // Starting position
  queueSize: number;       // Total queue size
  estimatedWait: number;   // Initial wait estimate (seconds)
  timestamp: number;       // Event timestamp
}
```

**Example:**

```javascript
queue.addEventListener('queuestart', (e) => {
  console.log(`Started at position ${e.detail.position}`);
  console.log(`Queue size: ${e.detail.queueSize}`);
});
```

---

### `positionchange`

Dispatched when queue position updates.

**Event Detail:**

```typescript
{
  previousPosition: number;  // Previous position
  currentPosition: number;   // New position
  queueSize: number;         // Current queue size
  estimatedWait: number;     // Updated wait estimate (seconds)
  timestamp: number;         // Event timestamp
}
```

**Example:**

```javascript
queue.addEventListener('positionchange', (e) => {
  const moved = e.detail.previousPosition - e.detail.currentPosition;
  console.log(`Moved forward ${moved} positions`);
  console.log(`New position: ${e.detail.currentPosition}`);
  console.log(`Estimated wait: ${e.detail.estimatedWait}s`);
});
```

---

### `queuecomplete`

Dispatched when user reaches front of queue.

**Event Detail:**

```typescript
{
  totalWaitTime: number;     // Total time waited (seconds)
  startPosition: number;     // Initial position
  message?: string;          // Completion message
  timestamp: number;         // Event timestamp
}
```

**Example:**

```javascript
queue.addEventListener('queuecomplete', (e) => {
  console.log(`Processing started after ${e.detail.totalWaitTime}s`);
  console.log(`Started at position ${e.detail.startPosition}`);
});
```

---

### `queueerror`

Dispatched when queue encounters an error.

**Event Detail:**

```typescript
{
  message: string;           // Error message
  position: number;          // Position when error occurred
  timestamp: number;         // Event timestamp
}
```

**Example:**

```javascript
queue.addEventListener('queueerror', (e) => {
  console.error(`Queue error: ${e.detail.message}`);
  console.log(`Was at position ${e.detail.position}`);
});
```

---

### `queuecancel`

Dispatched when queue tracking is cancelled.

**Event Detail:**

```typescript
{
  reason?: string;           // Cancellation reason
  position: number;          // Position when cancelled
  timestamp: number;         // Event timestamp
}
```

**Example:**

```javascript
queue.addEventListener('queuecancel', (e) => {
  console.log(`Cancelled: ${e.detail.reason || 'User action'}`);
});
```

---

## Properties

### Observable Attributes

These properties can be set via HTML attributes:

```html
<queue-progress 
  position="47"
  queue-size="120"
  disabled>
</queue-progress>
```

**Attributes:**

- `position` - Current position in queue
- `queue-size` - Total queue size
- `disabled` - Disable the component

---

## Styling

### CSS Custom Properties

Customize the appearance using CSS variables:

```css
queue-progress {
  --queue-primary-color: #8b5cf6;
  --queue-bg-color: #1f2937;
  --queue-text-color: #f1f5f9;
  --queue-border-color: #374155;
  --queue-success-color: #10b981;
  --queue-error-color: #ef4444;
  --queue-font-family: 'Inter', sans-serif;
}
```

### Custom Classes

Add custom CSS classes for additional styling:

```javascript
const queue = new QueueProgress({
  className: 'my-custom-queue'
});
```

```css
.my-custom-queue {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
```

---

## Examples

### Example 1: Basic Queue Tracking

```javascript
import { QueueProgress } from 'ai-progress-controls';

const queue = new QueueProgress({
  position: 73,
  queueSize: 150,
  estimatedWait: 220,
  processingRate: 3.5,
  message: 'Waiting for API processing...'
});

document.body.appendChild(queue);

// Start tracking
queue.start();

// Simulate position updates
let position = 73;
const interval = setInterval(() => {
  position -= Math.floor(Math.random() * 5) + 2;
  
  if (position <= 0) {
    clearInterval(interval);
    queue.complete('Processing started!');
    return;
  }
  
  const wait = Math.max(15, position * 3);
  const rate = 3.0 + (Math.random() * 1.5);
  
  queue.update({
    position,
    estimatedWait: wait,
    processingRate: rate
  });
}, 1500);
```

---

### Example 2: Rate-Limited API Queue

```javascript
const apiQueue = new QueueProgress({
  position: 0,
  queueSize: 0,
  showProgressBar: true,
  message: 'Checking queue status...'
});

async function submitToAPI(data) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (response.status === 429) {
      // Rate limited - get queue info
      const queueInfo = await response.json();
      
      apiQueue.start('Rate limit active - entering queue');
      apiQueue.update({
        position: queueInfo.position,
        queueSize: queueInfo.total,
        estimatedWait: queueInfo.estimatedSeconds,
        processingRate: queueInfo.rate
      });
      
      // Poll for updates
      const pollInterval = setInterval(async () => {
        const status = await fetch('/api/queue-status');
        const data = await status.json();
        
        if (data.ready) {
          clearInterval(pollInterval);
          apiQueue.complete();
          // Retry submission
          submitToAPI(data);
        } else {
          apiQueue.update({
            position: data.position,
            estimatedWait: data.estimatedSeconds
          });
        }
      }, 2000);
    } else {
      // Success
      const result = await response.json();
      return result;
    }
  } catch (error) {
    apiQueue.error('Failed to connect to API');
  }
}

document.body.appendChild(apiQueue);
```

---

### Example 3: OpenAI Queue Integration

```javascript
import { QueueProgress } from 'ai-progress-controls';
import OpenAI from 'openai';

const queue = new QueueProgress({
  showRate: true,
  showQueueSize: true,
  message: 'Connecting to OpenAI...'
});

async function generateWithQueue(prompt) {
  const client = new OpenAI();
  
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });
    
    return response;
  } catch (error) {
    if (error.status === 429) {
      // Rate limited
      const retryAfter = error.headers['retry-after'];
      const queuePosition = error.headers['x-ratelimit-remaining'];
      
      queue.start('Rate limited - waiting...');
      queue.update({
        position: parseInt(queuePosition || '10'),
        estimatedWait: parseInt(retryAfter || '60'),
        message: 'OpenAI rate limit active'
      });
      
      // Wait and retry
      await new Promise(resolve => 
        setTimeout(resolve, parseInt(retryAfter || '60') * 1000)
      );
      
      queue.complete();
      return generateWithQueue(prompt);
    }
    
    queue.error(error.message);
    throw error;
  }
}

document.body.appendChild(queue);

// Usage
generateWithQueue('Tell me a story').then(response => {
  console.log(response.choices[0].message.content);
});
```

---

### Example 4: Event-Driven Updates

```javascript
const queue = new QueueProgress({
  position: 100,
  queueSize: 200,
  processingRate: 2.5
});

// Log all events
queue.addEventListener('queuestart', (e) => {
  console.log('QUEUE START:', {
    position: e.detail.position,
    queueSize: e.detail.queueSize,
    estimatedWait: `${e.detail.estimatedWait}s`
  });
});

queue.addEventListener('positionchange', (e) => {
  const progress = ((e.detail.previousPosition - e.detail.currentPosition) / 
                    e.detail.previousPosition * 100).toFixed(1);
  console.log('POSITION CHANGE:', {
    from: e.detail.previousPosition,
    to: e.detail.currentPosition,
    progress: `${progress}%`,
    remaining: `${e.detail.estimatedWait}s`
  });
});

queue.addEventListener('queuecomplete', (e) => {
  console.log('QUEUE COMPLETE:', {
    totalWaitTime: `${e.detail.totalWaitTime}s`,
    startPosition: e.detail.startPosition,
    message: e.detail.message
  });
});

queue.addEventListener('queueerror', (e) => {
  console.error('QUEUE ERROR:', e.detail.message);
});

document.body.appendChild(queue);
queue.start();
```

---

### Example 5: TypeScript Integration

```typescript
import { 
  QueueProgress, 
  QueueProgressConfig,
  QueueStatus,
  QueueUpdate 
} from 'ai-progress-controls';

interface QueueManager {
  queue: QueueProgress;
  start(): void;
  updatePosition(update: QueueUpdate): void;
  getStatus(): QueueStatus;
}

class APIQueueManager implements QueueManager {
  public queue: QueueProgress;
  private pollInterval?: number;
  
  constructor(config: QueueProgressConfig) {
    this.queue = new QueueProgress({
      ...config,
      showProgressBar: true,
      showRate: true
    });
    
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.queue.addEventListener('queuestart', (e: CustomEvent) => {
      console.log('Queue tracking started', e.detail);
      this.startPolling();
    });
    
    this.queue.addEventListener('queuecomplete', () => {
      this.stopPolling();
      console.log('Ready to process');
    });
    
    this.queue.addEventListener('queueerror', (e: CustomEvent) => {
      this.stopPolling();
      console.error('Queue error:', e.detail.message);
    });
  }
  
  public start(): void {
    this.queue.start('Entering API queue...');
  }
  
  public updatePosition(update: QueueUpdate): void {
    this.queue.update(update);
  }
  
  public getStatus(): QueueStatus {
    return this.queue.getStatus();
  }
  
  private startPolling(): void {
    this.pollInterval = window.setInterval(() => {
      this.fetchQueueStatus();
    }, 2000);
  }
  
  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }
  }
  
  private async fetchQueueStatus(): Promise<void> {
    try {
      const response = await fetch('/api/queue-status');
      const data = await response.json();
      
      if (data.position === 0) {
        this.queue.complete('Processing started');
      } else {
        this.updatePosition({
          position: data.position,
          queueSize: data.total,
          estimatedWait: data.estimatedSeconds,
          processingRate: data.rate
        });
      }
    } catch (error) {
      this.queue.error('Failed to fetch queue status');
    }
  }
  
  public mount(container: HTMLElement): void {
    container.appendChild(this.queue);
  }
}

// Usage
const queueManager = new APIQueueManager({
  position: 45,
  queueSize: 100,
  estimatedWait: 135,
  processingRate: 3.2
});

queueManager.mount(document.body);
queueManager.start();
```

---

### Example 6: Multiple Queues

```javascript
// Track multiple API queues simultaneously
const queues = {
  gpt4: new QueueProgress({
    position: 23,
    queueSize: 50,
    message: 'GPT-4 Queue',
    className: 'gpt4-queue'
  }),
  
  dalle: new QueueProgress({
    position: 8,
    queueSize: 20,
    message: 'DALL-E Queue',
    className: 'dalle-queue'
  }),
  
  whisper: new QueueProgress({
    position: 3,
    queueSize: 10,
    message: 'Whisper Queue',
    className: 'whisper-queue'
  })
};

// Start all queues
Object.values(queues).forEach(queue => {
  queue.start();
  document.body.appendChild(queue);
});

// Update specific queue
queues.gpt4.update({
  position: 15,
  estimatedWait: 45
});

// Listen to all queue completions
Object.entries(queues).forEach(([name, queue]) => {
  queue.addEventListener('queuecomplete', () => {
    console.log(`${name} queue ready!`);
  });
});
```

---

## Accessibility

QueueProgress is built with accessibility in mind:

- **ARIA Labels:** Properly labeled for screen readers
- **Role Attributes:** Correct semantic roles
- **Status Announcements:** Position changes are announced
- **Keyboard Navigation:** Focusable when interactive
- **High Contrast:** Supports high contrast modes
- **Reduced Motion:** Respects `prefers-reduced-motion`

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  QueueProgressConfig,
  QueueProgressState,
  QueueStatus,
  QueueUpdate,
  PositionChangeEvent,
  QueueStartEvent,
  QueueCompleteEvent,
  QueueErrorEvent,
  QueueCancelEvent
} from 'ai-progress-controls';
```

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

---

## License

MIT License - See LICENSE file for details

---

## Related Components

- [StreamProgress](./stream-progress.md) - Token streaming visualization
- [ModelLoader](./model-loader.md) - Model loading progress
- [ParameterSlider](./parameter-slider.md) - AI parameter configuration
- [RetryProgress](./retry-progress.md) - Retry with exponential backoff

---

**Version:** 1.0.0  
**Last Updated:** January 11, 2026
