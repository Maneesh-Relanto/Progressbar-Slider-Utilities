# RetryProgress API Documentation

## Overview

`RetryProgress` is a Web Component for visualizing retry operations with exponential backoff strategies. Perfect for handling API failures, network timeouts, rate limiting, and other transient errors with automatic or manual retry mechanisms.

## Table of Contents

- [Installation](#installation)
- [Constructor](#constructor)
- [Configuration](#configuration)
- [Methods](#methods)
- [Events](#events)
- [Retry Strategies](#retry-strategies)
- [Properties](#properties)
- [Styling](#styling)
- [Examples](#examples)

---

## Installation

```bash
npm install ai-progress-controls
```

```javascript
import { RetryProgress } from 'ai-progress-controls';
```

---

## Constructor

### `new RetryProgress(config?: RetryProgressConfig)`

Creates a new RetryProgress component instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `RetryProgressConfig` | Optional configuration object |

**Returns:** `RetryProgress` instance

**Example:**

```javascript
const retry = new RetryProgress({
  maxAttempts: 5,
  initialDelay: 1000,
  backoffMultiplier: 2,
  strategy: 'exponential',
  allowManualRetry: true
});
```

---

## Configuration

### RetryProgressConfig

Configuration object passed to the constructor.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `attempt` | `number` | `0` | Current attempt number |
| `maxAttempts` | `number` | `3` | Maximum retry attempts |
| `initialDelay` | `number` | `1000` | Initial delay in milliseconds |
| `maxDelay` | `number` | `30000` | Maximum delay cap (30s) |
| `backoffMultiplier` | `number` | `2` | Multiplier for exponential backoff |
| `strategy` | `RetryStrategy` | `'exponential'` | Backoff strategy (see below) |
| `message` | `string` | `''` | Current status message |
| `showAttemptCount` | `boolean` | `true` | Display attempt counter |
| `showNextRetry` | `boolean` | `true` | Show next retry time |
| `showProgressBar` | `boolean` | `true` | Display progress bar during wait |
| `showElapsedTime` | `boolean` | `true` | Show elapsed time |
| `allowManualRetry` | `boolean` | `false` | Enable manual retry button |
| `allowCancel` | `boolean` | `true` | Enable cancel button |
| `animate` | `boolean` | `true` | Enable animations |
| `className` | `string` | `''` | Custom CSS class |
| `ariaLabel` | `string` | `'Retry Progress'` | ARIA label |
| `debug` | `boolean` | `false` | Enable debug logging |
| `disabled` | `boolean` | `false` | Disabled state |

### RetryStatus Type

```typescript
type RetryStatus = 'idle' | 'attempting' | 'waiting' | 'success' | 'failed' | 'cancelled';
```

### RetryStrategy Type

```typescript
type RetryStrategy = 'exponential' | 'linear' | 'fixed' | 'fibonacci';
```

---

## Methods

### `attempt(message?: string): void`

Start a new retry attempt.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Optional status message |

**Example:**

```javascript
retry.attempt('Calling API endpoint...');
```

---

### `waitForRetry(update?: RetryAttemptUpdate): void`

Transition to waiting state with automatic retry after calculated delay.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `update` | `RetryAttemptUpdate` | Optional update configuration |

**RetryAttemptUpdate Interface:**

```typescript
interface RetryAttemptUpdate {
  attempt?: number;        // Override attempt number
  error?: Error;          // Error that caused retry
  delay?: number;         // Override calculated delay
  message?: string;       // Status message
}
```

**Example:**

```javascript
retry.waitForRetry({
  error: new Error('Connection timeout'),
  message: 'Retrying after backoff...'
});
```

---

### `success(message?: string): void`

Mark the operation as successful.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Optional success message |

**Example:**

```javascript
retry.success('API call completed successfully!');
```

---

### `failure(error?: Error): void`

Mark the operation as failed (max attempts reached).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `error` | `Error` | Optional error object |

**Example:**

```javascript
retry.failure(new Error('Max retries exceeded'));
```

---

### `cancel(reason?: string): void`

Cancel the retry operation.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `reason` | `string` | Optional cancellation reason |

**Example:**

```javascript
retry.cancel('User cancelled operation');
```

---

### `reset(): void`

Reset to initial idle state.

**Example:**

```javascript
retry.reset();
```

---

### `getAttempt(): number`

Get the current attempt number.

**Returns:** Current attempt number

**Example:**

```javascript
const currentAttempt = retry.getAttempt();
console.log(`Attempt: ${currentAttempt}`);
```

---

### `getStatus(): RetryStatus`

Get the current status.

**Returns:** Current retry status

**Example:**

```javascript
const status = retry.getStatus();
if (status === 'waiting') {
  console.log('Waiting for next retry...');
}
```

---

### `getTimeUntilRetry(): number`

Get milliseconds until next retry attempt.

**Returns:** Time in milliseconds (0 if not waiting)

**Example:**

```javascript
const timeLeft = retry.getTimeUntilRetry();
console.log(`Next retry in ${timeLeft}ms`);
```

---

## Events

### `retryattempt`

Dispatched when a retry attempt starts.

**Event Detail:**

```typescript
{
  attempt: number;        // Current attempt number
  maxAttempts: number;    // Maximum attempts allowed
  message: string;        // Status message
  timestamp: number;      // Event timestamp
}
```

**Example:**

```javascript
retry.addEventListener('retryattempt', (e) => {
  console.log(`Attempt ${e.detail.attempt}/${e.detail.maxAttempts}`);
});
```

---

### `retrywaiting`

Dispatched when entering waiting state before next retry.

**Event Detail:**

```typescript
{
  attempt: number;        // Next attempt number
  delay: number;          // Wait delay in milliseconds
  nextRetryTime: number;  // Timestamp of next retry
  strategy: string;       // Backoff strategy used
  timestamp: number;      // Event timestamp
}
```

**Example:**

```javascript
retry.addEventListener('retrywaiting', (e) => {
  console.log(`Waiting ${e.detail.delay}ms before attempt ${e.detail.attempt}`);
  console.log(`Strategy: ${e.detail.strategy}`);
});
```

---

### `retrysuccess`

Dispatched when operation succeeds.

**Event Detail:**

```typescript
{
  attempt: number;        // Final attempt number
  totalAttempts: number;  // Total attempts made
  elapsedTime: number;    // Total elapsed time in ms
  message: string;        // Success message
  timestamp: number;      // Event timestamp
}
```

**Example:**

```javascript
retry.addEventListener('retrysuccess', (e) => {
  console.log(`Success after ${e.detail.totalAttempts} attempts`);
  console.log(`Total time: ${e.detail.elapsedTime}ms`);
});
```

---

### `retryfailure`

Dispatched when max attempts reached.

**Event Detail:**

```typescript
{
  totalAttempts: number;  // Total attempts made
  lastError?: Error;      // Last error encountered
  elapsedTime: number;    // Total elapsed time in ms
  timestamp: number;      // Event timestamp
}
```

**Example:**

```javascript
retry.addEventListener('retryfailure', (e) => {
  console.error(`Failed after ${e.detail.totalAttempts} attempts`);
  console.error(`Error: ${e.detail.lastError?.message}`);
});
```

---

### `retrycancel`

Dispatched when operation is cancelled.

**Event Detail:**

```typescript
{
  attempt: number;        // Attempt when cancelled
  reason?: string;        // Cancellation reason
  timestamp: number;      // Event timestamp
}
```

**Example:**

```javascript
retry.addEventListener('retrycancel', (e) => {
  console.log(`Cancelled: ${e.detail.reason}`);
});
```

---

### `manualretry`

Dispatched when user triggers manual retry.

**Event Detail:**

```typescript
{
  attempt: number;        // Current attempt
  timestamp: number;      // Event timestamp
}
```

**Example:**

```javascript
retry.addEventListener('manualretry', (e) => {
  console.log('User triggered manual retry');
  // Restart operation logic
  retry.attempt('Retrying operation...');
});
```

---

## Retry Strategies

### Exponential Backoff (default)

Delay increases exponentially with each attempt.

**Formula:** `delay = initialDelay × (multiplier ^ (attempt - 1))`

**Example delays (initial=1000ms, multiplier=2):**
- Attempt 1: 1000ms
- Attempt 2: 2000ms
- Attempt 3: 4000ms
- Attempt 4: 8000ms
- Attempt 5: 16000ms

**Use case:** Most API errors, general retry scenarios

```javascript
const retry = new RetryProgress({
  strategy: 'exponential',
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 30000
});
```

---

### Linear Backoff

Delay increases linearly with each attempt.

**Formula:** `delay = initialDelay × attempt`

**Example delays (initial=2000ms):**
- Attempt 1: 2000ms
- Attempt 2: 4000ms
- Attempt 3: 6000ms
- Attempt 4: 8000ms
- Attempt 5: 10000ms

**Use case:** Timeout errors, predictable scaling

```javascript
const retry = new RetryProgress({
  strategy: 'linear',
  initialDelay: 2000
});
```

---

### Fixed Delay

Constant delay between retries.

**Formula:** `delay = initialDelay`

**Example delays (initial=3000ms):**
- All attempts: 3000ms

**Use case:** Simple polling, consistent retry intervals

```javascript
const retry = new RetryProgress({
  strategy: 'fixed',
  initialDelay: 3000
});
```

---

### Fibonacci Backoff

Delay follows Fibonacci sequence pattern.

**Formula:** `delay = initialDelay × fibonacci(attempt)`

**Example delays (initial=1000ms):**
- Attempt 1: 1000ms (fib 1)
- Attempt 2: 1000ms (fib 1)
- Attempt 3: 2000ms (fib 2)
- Attempt 4: 3000ms (fib 3)
- Attempt 5: 5000ms (fib 5)
- Attempt 6: 8000ms (fib 8)

**Use case:** Rate-limited APIs, gradual backoff

```javascript
const retry = new RetryProgress({
  strategy: 'fibonacci',
  initialDelay: 1000,
  maxAttempts: 6
});
```

---

## Properties

### Observable Attributes

These properties can be set via HTML attributes and will trigger re-renders:

```html
<retry-progress 
  attempt="2"
  max-attempts="5"
  disabled>
</retry-progress>
```

**Attributes:**

- `attempt` - Current attempt number
- `max-attempts` - Maximum retry attempts
- `disabled` - Disable the component

---

## Styling

### CSS Custom Properties

Customize the appearance using CSS variables:

```css
retry-progress {
  --retry-primary-color: #f59e0b;
  --retry-bg-color: #1f2937;
  --retry-text-color: #f1f5f9;
  --retry-border-color: #374155;
  --retry-error-color: #ef4444;
  --retry-success-color: #10b981;
  --retry-font-family: 'Inter', sans-serif;
}
```

### Custom Classes

Add custom CSS classes for additional styling:

```javascript
const retry = new RetryProgress({
  className: 'my-custom-retry'
});
```

```css
.my-custom-retry {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
```

---

## Examples

### Example 1: Basic Exponential Backoff

```javascript
import { RetryProgress } from 'ai-progress-controls';

const retry = new RetryProgress({
  maxAttempts: 5,
  initialDelay: 1000,
  strategy: 'exponential'
});

document.body.appendChild(retry);

// Simulate API call
async function callAPI() {
  retry.attempt('Calling API...');
  
  try {
    const response = await fetch('/api/endpoint');
    if (!response.ok) throw new Error('API Error');
    retry.success('API call successful!');
  } catch (error) {
    if (retry.getAttempt() < 5) {
      retry.waitForRetry({ error });
    } else {
      retry.failure(error);
    }
  }
}

// Listen for automatic retry
retry.addEventListener('retryattempt', () => {
  callAPI();
});

callAPI();
```

---

### Example 2: Rate Limiting with Fibonacci

```javascript
const retry = new RetryProgress({
  maxAttempts: 7,
  initialDelay: 500,
  strategy: 'fibonacci',
  message: 'Handling rate limits'
});

async function rateLimitedRequest() {
  retry.attempt('Making request...');
  
  try {
    const response = await fetch('/api/limited');
    
    if (response.status === 429) {
      // Rate limited
      const retryAfter = response.headers.get('Retry-After');
      retry.waitForRetry({
        error: new Error('Rate limited'),
        delay: retryAfter ? parseInt(retryAfter) * 1000 : undefined
      });
    } else if (response.ok) {
      retry.success('Request completed');
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    retry.failure(error);
  }
}

retry.addEventListener('retryattempt', rateLimitedRequest);
rateLimitedRequest();
```

---

### Example 3: Manual Retry Control

```javascript
const retry = new RetryProgress({
  maxAttempts: 10,
  initialDelay: 3000,
  strategy: 'fixed',
  allowManualRetry: true,
  allowCancel: true
});

let downloadTask = null;

function startDownload() {
  retry.attempt('Downloading file...');
  
  downloadTask = new Promise((resolve, reject) => {
    // Simulate download
    const random = Math.random();
    setTimeout(() => {
      if (random > 0.7) {
        resolve('Download complete');
      } else {
        reject(new Error('Network error'));
      }
    }, 2000);
  });
  
  downloadTask
    .then(() => retry.success('Download successful!'))
    .catch((error) => {
      if (retry.getAttempt() < retry.config.maxAttempts) {
        retry.waitForRetry({ error });
      } else {
        retry.failure(error);
      }
    });
}

// Handle manual retry button
retry.addEventListener('manualretry', () => {
  startDownload();
});

// Handle cancel
retry.addEventListener('retrycancel', () => {
  // Abort ongoing download
  if (downloadTask) {
    console.log('Download cancelled');
  }
});

startDownload();
```

---

### Example 4: Event Logging

```javascript
const retry = new RetryProgress({
  maxAttempts: 4,
  initialDelay: 1000,
  strategy: 'exponential',
  debug: true
});

// Log all events
retry.addEventListener('retryattempt', (e) => {
  console.log('ATTEMPT:', {
    attempt: e.detail.attempt,
    maxAttempts: e.detail.maxAttempts,
    message: e.detail.message
  });
});

retry.addEventListener('retrywaiting', (e) => {
  console.log('WAITING:', {
    delay: e.detail.delay,
    nextAttempt: e.detail.attempt,
    strategy: e.detail.strategy
  });
});

retry.addEventListener('retrysuccess', (e) => {
  console.log('SUCCESS:', {
    totalAttempts: e.detail.totalAttempts,
    elapsedTime: e.detail.elapsedTime
  });
});

retry.addEventListener('retryfailure', (e) => {
  console.error('FAILED:', {
    totalAttempts: e.detail.totalAttempts,
    error: e.detail.lastError?.message
  });
});
```

---

### Example 5: TypeScript Integration

```typescript
import { 
  RetryProgress, 
  RetryProgressConfig,
  RetryStatus,
  RetryStrategy 
} from 'ai-progress-controls';

interface APIResponse {
  data: any;
  status: number;
}

class APIClient {
  private retry: RetryProgress;
  
  constructor() {
    const config: RetryProgressConfig = {
      maxAttempts: 5,
      initialDelay: 1000,
      backoffMultiplier: 2,
      strategy: 'exponential' as RetryStrategy,
      allowManualRetry: false,
      showProgressBar: true
    };
    
    this.retry = new RetryProgress(config);
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.retry.addEventListener('retryattempt', () => {
      this.makeRequest();
    });
    
    this.retry.addEventListener('retryfailure', (e: CustomEvent) => {
      console.error('Max retries reached', e.detail);
    });
  }
  
  private async makeRequest(): Promise<APIResponse | null> {
    try {
      this.retry.attempt('Fetching data...');
      
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      this.retry.success('Data fetched successfully');
      
      return { data, status: response.status };
    } catch (error) {
      const currentAttempt = this.retry.getAttempt();
      const maxAttempts = this.retry.config.maxAttempts;
      
      if (currentAttempt < maxAttempts) {
        this.retry.waitForRetry({
          error: error as Error,
          message: 'Retrying request...'
        });
      } else {
        this.retry.failure(error as Error);
      }
      
      return null;
    }
  }
  
  public async fetchData(): Promise<APIResponse | null> {
    return this.makeRequest();
  }
  
  public getStatus(): RetryStatus {
    return this.retry.getStatus();
  }
  
  public getRetryComponent(): RetryProgress {
    return this.retry;
  }
}

// Usage
const client = new APIClient();
const data = await client.fetchData();

// Display retry component in UI
document.body.appendChild(client.getRetryComponent());
```

---

### Example 6: HTML Attributes

```html
<!DOCTYPE html>
<html>
<head>
  <title>Retry Progress Demo</title>
  <script type="module">
    import { RetryProgress } from './dist/index.js';
  </script>
</head>
<body>
  <retry-progress 
    id="myRetry"
    max-attempts="5"
    initial-delay="1000"
    strategy="exponential"
    allow-manual-retry="true"
    show-progress-bar="true">
  </retry-progress>
  
  <script type="module">
    const retry = document.getElementById('myRetry');
    
    document.getElementById('startBtn').addEventListener('click', () => {
      retry.attempt('Starting operation...');
    });
  </script>
</body>
</html>
```

---

## Accessibility

RetryProgress is built with accessibility in mind:

- **ARIA Labels:** Properly labeled for screen readers
- **Keyboard Navigation:** Action buttons are keyboard accessible
- **Status Announcements:** Status changes are announced
- **High Contrast:** Supports high contrast modes
- **Reduced Motion:** Respects `prefers-reduced-motion`
- **Focus Management:** Clear focus indicators

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  RetryProgressConfig,
  RetryProgressState,
  RetryStatus,
  RetryStrategy,
  RetryAttemptUpdate,
  RetryAttemptEvent,
  RetryWaitingEvent,
  RetrySuccessEvent,
  RetryFailureEvent,
  RetryCancelEvent,
  ManualRetryEvent
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
- [QueueProgress](./queue-progress.md) - Queue position tracking

---

**Version:** 1.0.0  
**Last Updated:** January 11, 2026
