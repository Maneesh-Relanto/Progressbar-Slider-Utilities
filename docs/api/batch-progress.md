# BatchProgress API Documentation

## Overview

`BatchProgress` is a Web Component that displays progress for batch operations processing multiple items. Perfect for processing multiple AI requests, documents, or images in parallel with concurrency control and detailed item tracking.

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
import { BatchProgress } from 'ai-progress-controls';
```

---

## Constructor

### `new BatchProgress(config?: BatchProgressConfig)`

Creates a new BatchProgress component instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `BatchProgressConfig` | Optional configuration object |

**Returns:** `BatchProgress` instance

**Example:**

```javascript
const batch = new BatchProgress({
  totalItems: 50,
  concurrency: 5,
  showItems: true,
  showStats: true,
});
```

---

## Configuration

### BatchProgressConfig

Configuration object passed to the constructor.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `totalItems` | `number` | `0` | Total number of items in batch |
| `concurrency` | `number` | `5` | Maximum concurrent operations |
| `showItems` | `boolean` | `true` | Show individual item progress |
| `maxDisplayItems` | `number` | `100` | Maximum items to display |
| `showProgressBar` | `boolean` | `true` | Show overall progress bar |
| `showStats` | `boolean` | `true` | Show statistics (success/fail counts) |
| `showTime` | `boolean` | `true` | Show elapsed time |
| `showRate` | `boolean` | `true` | Show processing rate (items/sec) |
| `allowCancel` | `boolean` | `true` | Allow cancellation |
| `cancelLabel` | `string` | `'Cancel Batch'` | Cancel button label |
| `collapseCompleted` | `boolean` | `false` | Automatically collapse completed items |
| `message` | `string` | `'Processing batch...'` | Status message |
| `disabled` | `boolean` | `false` | Disabled state |
| `debug` | `boolean` | `false` | Enable debug logging |
| `className` | `string` | `''` | Custom CSS class |
| `ariaLabel` | `string` | `'Batch Progress'` | ARIA label |

**Example:**

```javascript
const config = {
  totalItems: 100,
  concurrency: 10,
  showItems: true,
  showStats: true,
  showRate: true,
  allowCancel: true,
  cancelLabel: 'Stop Processing',
  collapseCompleted: true,
  message: 'Processing images...',
  debug: true,
};

const batch = new BatchProgress(config);
```

---

## Methods

### `start(message?: string): void`

Start batch processing and initialize the progress display.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Optional status message to display |

**Example:**

```javascript
batch.start('Starting batch process...');
```

**Fires:** `batchstart` event

---

### `addItem(itemId: string, label?: string): void`

Add an item to the batch.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `itemId` | `string` | ✅ Yes | Unique identifier for the item |
| `label` | `string` | ❌ No | Display label (defaults to itemId) |

**Example:**

```javascript
batch.addItem('doc-001', 'Document 1.pdf');
batch.addItem('doc-002', 'Document 2.pdf');
batch.addItem('doc-003'); // Label defaults to 'doc-003'
```

---

### `updateItem(update: BatchProgressUpdate): void`

Update the status or progress of a batch item.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `update.itemId` | `string` | ✅ Yes | Item identifier |
| `update.status` | `BatchItemStatus` | ❌ No | New status |
| `update.progress` | `number` | ❌ No | Progress percentage (0-100) |
| `update.error` | `string` | ❌ No | Error message |
| `update.result` | `any` | ❌ No | Result data |
| `update.label` | `string` | ❌ No | Updated label |

**BatchItemStatus Values:**
- `'pending'` - Item is waiting to be processed
- `'processing'` - Item is currently being processed
- `'completed'` - Item completed successfully
- `'failed'` - Item failed with error
- `'cancelled'` - Item was cancelled

**Example:**

```javascript
// Start processing an item
batch.updateItem({
  itemId: 'doc-001',
  status: 'processing',
  progress: 0
});

// Update progress
batch.updateItem({
  itemId: 'doc-001',
  progress: 50
});

// Mark as completed
batch.updateItem({
  itemId: 'doc-001',
  status: 'completed',
  progress: 100,
  result: { processed: true, pages: 5 }
});

// Mark as failed
batch.updateItem({
  itemId: 'doc-002',
  status: 'failed',
  error: 'File not found'
});
```

**Fires:** `itemupdate` event

---

### `completeItem(itemId: string, result?: any): void`

Mark a batch item as completed successfully.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `string` | Item identifier |
| `result` | `any` | Optional result data |

**Example:**

```javascript
batch.completeItem('doc-001', { 
  processed: true, 
  pages: 5,
  duration: 1523 
});
```

**Fires:** `itemcomplete` event

---

### `failItem(itemId: string, error: string): void`

Mark a batch item as failed with an error.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `string` | Item identifier |
| `error` | `string` | Error message |

**Example:**

```javascript
batch.failItem('doc-002', 'Invalid file format');
```

**Fires:** `itemfailed` event

---

### `complete(): void`

Mark the entire batch as completed.

**Example:**

```javascript
batch.complete();
```

**Fires:** `batchcomplete` event

**Note:** Automatically called when all items are completed.

---

### `cancel(reason?: string): void`

Cancel batch processing and mark all pending/processing items as cancelled.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `reason` | `string` | Optional cancellation reason |

**Example:**

```javascript
// User cancelled
batch.cancel('User requested cancellation');

// System error
batch.cancel('System error occurred');

// Timeout
batch.cancel('Batch timeout exceeded');
```

**Fires:** `batchcancel` event

---

### `reset(): void`

Reset the batch to initial state, clearing all items and statistics.

**Example:**

```javascript
batch.reset();
```

---

### `getOverallProgress(): number`

Get the overall progress percentage of the batch.

**Returns:** `number` - Progress percentage (0-100)

**Example:**

```javascript
const progress = batch.getOverallProgress();
console.log(`Overall progress: ${progress.toFixed(1)}%`);
```

---

### `getRate(): number`

Get the current processing rate in items per second.

**Returns:** `number` - Items processed per second

**Example:**

```javascript
const rate = batch.getRate();
console.log(`Processing rate: ${rate.toFixed(2)} items/sec`);
```

---

### `getStats(): BatchStats`

Get comprehensive batch statistics.

**Returns:** Object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `total` | `number` | Total items in batch |
| `completed` | `number` | Total completed items |
| `success` | `number` | Successfully completed items |
| `failed` | `number` | Failed items |
| `pending` | `number` | Pending items |
| `progress` | `number` | Overall progress percentage |
| `rate` | `number` | Items per second |
| `duration` | `number` | Duration in milliseconds |

**Example:**

```javascript
const stats = batch.getStats();
console.log(`${stats.completed}/${stats.total} items completed`);
console.log(`Success: ${stats.success}, Failed: ${stats.failed}`);
console.log(`Progress: ${stats.progress.toFixed(1)}%`);
console.log(`Rate: ${stats.rate.toFixed(2)} items/sec`);
console.log(`Duration: ${(stats.duration / 1000).toFixed(1)}s`);
```

---

## Events

All events are `CustomEvent` instances with a `detail` property containing event-specific data.

### `batchstart`

Fired when batch processing starts.

**Detail:**

```typescript
{
  totalItems: number;   // Total items in batch
  startTime: number;    // Timestamp
}
```

**Example:**

```javascript
batch.addEventListener('batchstart', (e) => {
  console.log(`Batch started with ${e.detail.totalItems} items`);
  console.log(`Start time: ${new Date(e.detail.startTime)}`);
});
```

---

### `itemupdate`

Fired when a batch item is updated.

**Detail:**

```typescript
{
  id: string;               // Item ID
  label: string;            // Item label
  status: BatchItemStatus;  // Current status
  progress: number;         // Progress percentage
  error?: string;           // Error message (if any)
  result?: any;            // Result data (if any)
  startTime?: number;      // Start timestamp
  endTime?: number;        // End timestamp
  totalCompleted: number;  // Total completed items
  totalFailed: number;     // Total failed items
  overallProgress: number; // Overall batch progress
}
```

**Example:**

```javascript
batch.addEventListener('itemupdate', (e) => {
  console.log(`Item ${e.detail.id}: ${e.detail.status}`);
  console.log(`Progress: ${e.detail.progress}%`);
  console.log(`Overall: ${e.detail.overallProgress.toFixed(1)}%`);
});
```

---

### `itemcomplete`

Fired when a batch item completes successfully.

**Detail:**

```typescript
{
  item: BatchItem;        // Complete item data
  totalCompleted: number; // Total completed items
  remainingItems: number; // Items remaining
}
```

**Example:**

```javascript
batch.addEventListener('itemcomplete', (e) => {
  console.log(`Item ${e.detail.item.id} completed`);
  console.log(`${e.detail.remainingItems} items remaining`);
  if (e.detail.item.result) {
    console.log('Result:', e.detail.item.result);
  }
});
```

---

### `itemfailed`

Fired when a batch item fails.

**Detail:**

```typescript
{
  item: BatchItem;      // Complete item data
  error: string;        // Error message
  totalFailed: number;  // Total failed items
}
```

**Example:**

```javascript
batch.addEventListener('itemfailed', (e) => {
  console.error(`Item ${e.detail.item.id} failed: ${e.detail.error}`);
  console.log(`Total failures: ${e.detail.totalFailed}`);
});
```

---

### `batchcomplete`

Fired when all batch items are processed.

**Detail:**

```typescript
{
  totalItems: number;   // Total items processed
  successCount: number; // Successfully completed items
  failedCount: number;  // Failed items
  duration: number;     // Total duration in milliseconds
  averageRate: number;  // Average processing rate (items/sec)
  startTime: number;    // Start timestamp
  endTime: number;      // End timestamp
}
```

**Example:**

```javascript
batch.addEventListener('batchcomplete', (e) => {
  const { successCount, failedCount, totalItems, duration, averageRate } = e.detail;
  console.log(`Batch completed: ${successCount}/${totalItems} successful`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Duration: ${(duration / 1000).toFixed(1)}s`);
  console.log(`Average rate: ${averageRate.toFixed(2)} items/sec`);
});
```

---

### `batchcancel`

Fired when batch processing is cancelled.

**Detail:**

```typescript
{
  completedCount: number;  // Items completed before cancellation
  failedCount: number;     // Items failed before cancellation
  cancelledCount: number;  // Items cancelled
  reason?: string;         // Cancellation reason
}
```

**Example:**

```javascript
batch.addEventListener('batchcancel', (e) => {
  console.log(`Batch cancelled: ${e.detail.reason}`);
  console.log(`Completed: ${e.detail.completedCount}`);
  console.log(`Cancelled: ${e.detail.cancelledCount}`);
});
```

---

## Properties

### `disabled: boolean`

Get or set the disabled state.

**Example:**

```javascript
// Disable the component
batch.disabled = true;

// Check if disabled
if (batch.disabled) {
  console.log('Batch processing is disabled');
}
```

---

## Styling

Components use CSS custom properties (CSS variables) for theming.

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--ai-primary-color` | `#3b82f6` | Primary accent color |
| `--ai-success-color` | `#10b981` | Success color |
| `--ai-error-color` | `#ef4444` | Error color |
| `--ai-warning-color` | `#f59e0b` | Warning color |
| `--ai-background-color` | `#ffffff` | Background color |
| `--ai-text-color` | `#1f2937` | Text color |
| `--ai-border-color` | `#e5e7eb` | Border color |
| `--ai-border-radius` | `8px` | Border radius |
| `--ai-font-family` | System font stack | Font family |
| `--ai-font-size` | `14px` | Base font size |
| `--ai-spacing` | `12px` | Base spacing unit |

### Custom Styling Example

```css
/* Custom theme */
batch-progress {
  --ai-primary-color: #8b5cf6;
  --ai-success-color: #059669;
  --ai-error-color: #dc2626;
  --ai-border-radius: 12px;
  --ai-font-size: 16px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  batch-progress {
    --ai-background-color: #1f2937;
    --ai-text-color: #f9fafb;
    --ai-border-color: #374151;
  }
}

/* Compact layout */
batch-progress.compact {
  --ai-spacing: 8px;
  --ai-font-size: 12px;
  --ai-border-radius: 6px;
}
```

---

## Examples

### Basic Example

```javascript
import { BatchProgress } from 'ai-progress-controls';

const batch = new BatchProgress({
  totalItems: 10,
  concurrency: 3,
  showItems: true,
  showStats: true,
});

document.body.appendChild(batch);

// Start batch
batch.start('Processing files...');

// Add items
for (let i = 1; i <= 10; i++) {
  batch.addItem(`file-${i}`, `File ${i}.pdf`);
}

// Simulate processing
let completed = 0;
const processNext = () => {
  if (completed >= 10) return;
  
  const itemId = `file-${++completed}`;
  
  // Start processing
  batch.updateItem({ itemId, status: 'processing' });
  
  // Simulate progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 10;
    batch.updateItem({ itemId, progress });
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      batch.completeItem(itemId, { success: true });
      processNext();
    }
  }, 100);
};

// Start first batch
for (let i = 0; i < 3; i++) {
  processNext();
}
```

### AI Document Processing

```javascript
import { BatchProgress } from 'ai-progress-controls';
import OpenAI from 'openai';

async function processDocuments(documents) {
  const batch = new BatchProgress({
    totalItems: documents.length,
    concurrency: 5,
    showItems: true,
    showStats: true,
    message: 'Processing documents with AI...',
  });

  document.body.appendChild(batch);
  batch.start();

  // Add all documents
  documents.forEach((doc) => {
    batch.addItem(doc.id, doc.name);
  });

  const openai = new OpenAI({ apiKey: 'your-api-key' });
  const processing = new Set();

  // Process with concurrency control
  for (const doc of documents) {
    while (processing.size >= 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    processing.add(doc.id);
    batch.updateItem({ itemId: doc.id, status: 'processing' });

    processDocument(doc, openai, batch)
      .then(() => processing.delete(doc.id))
      .catch(() => processing.delete(doc.id));
  }

  // Wait for all to complete
  while (processing.size > 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function processDocument(doc, openai, batch) {
  try {
    batch.updateItem({ itemId: doc.id, progress: 25 });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Summarize: ${doc.content}` }],
    });

    batch.updateItem({ itemId: doc.id, progress: 75 });

    const summary = response.choices[0].message.content;
    
    batch.completeItem(doc.id, { summary });
  } catch (error) {
    batch.failItem(doc.id, error.message);
  }
}
```

### Image Processing Batch

```javascript
import { BatchProgress } from 'ai-progress-controls';

async function processImages(imageFiles) {
  const batch = new BatchProgress({
    totalItems: imageFiles.length,
    concurrency: 3,
    showItems: true,
    showStats: true,
    showRate: true,
    message: 'Processing images...',
  });

  document.body.appendChild(batch);
  batch.start();

  // Track completion
  batch.addEventListener('batchcomplete', (e) => {
    console.log(`Processed ${e.detail.successCount} images in ${e.detail.duration}ms`);
    alert(`Processing complete! Success: ${e.detail.successCount}, Failed: ${e.detail.failedCount}`);
  });

  // Add all images
  imageFiles.forEach((file, index) => {
    batch.addItem(`img-${index}`, file.name);
  });

  // Process with concurrency limit
  const concurrency = 3;
  const queue = [...imageFiles.entries()];
  const active = new Set();

  async function processNext() {
    if (queue.length === 0) return;
    
    const [index, file] = queue.shift();
    const itemId = `img-${index}`;
    
    active.add(itemId);
    batch.updateItem({ itemId, status: 'processing', progress: 0 });

    try {
      // Simulate image processing
      const result = await processImage(file, (progress) => {
        batch.updateItem({ itemId, progress });
      });
      
      batch.completeItem(itemId, result);
    } catch (error) {
      batch.failItem(itemId, error.message);
    } finally {
      active.delete(itemId);
      if (queue.length > 0) {
        processNext();
      }
    }
  }

  // Start initial batch
  for (let i = 0; i < concurrency && queue.length > 0; i++) {
    processNext();
  }
}

async function processImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.src = e.target.result;
        
        await img.decode();
        onProgress(50);
        
        // Apply filters/transformations
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        onProgress(75);
        
        // Get processed result
        const result = canvas.toDataURL();
        onProgress(100);
        
        resolve({ url: result, width: img.width, height: img.height });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
```

### Error Handling & Retry

```javascript
import { BatchProgress } from 'ai-progress-controls';

async function processBatchWithRetry(items) {
  const batch = new BatchProgress({
    totalItems: items.length,
    concurrency: 5,
    showItems: true,
    allowCancel: true,
  });

  document.body.appendChild(batch);
  batch.start('Processing with auto-retry...');

  // Track failed items for retry
  const failed = new Set();

  batch.addEventListener('itemfailed', (e) => {
    failed.add(e.detail.item.id);
  });

  // Add items
  items.forEach((item) => {
    batch.addItem(item.id, item.name);
  });

  // Process items
  await processItems(items, batch);

  // Retry failed items
  if (failed.size > 0) {
    console.log(`Retrying ${failed.size} failed items...`);
    const failedItems = items.filter(item => failed.has(item.id));
    
    for (const item of failedItems) {
      batch.updateItem({ itemId: item.id, status: 'processing' });
      await processItem(item, batch);
    }
  }
}

async function processItems(items, batch) {
  const concurrency = 5;
  const chunks = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }
  
  for (const chunk of chunks) {
    await Promise.all(chunk.map(item => processItem(item, batch)));
  }
}

async function processItem(item, batch) {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      batch.updateItem({ itemId: item.id, status: 'processing' });
      
      // Simulate API call
      await fetch(`/api/process/${item.id}`);
      
      batch.completeItem(item.id);
      return;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        batch.failItem(item.id, `Failed after ${maxRetries} retries: ${error.message}`);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }
}
```

### Cancel Handling

```javascript
import { BatchProgress } from 'ai-progress-controls';

async function cancellableBatch(items) {
  const batch = new BatchProgress({
    totalItems: items.length,
    concurrency: 5,
    allowCancel: true,
    cancelLabel: 'Stop Processing',
  });

  document.body.appendChild(batch);
  batch.start();

  let cancelled = false;

  // Handle cancellation
  batch.addEventListener('batchcancel', (e) => {
    cancelled = true;
    console.log(`Cancelled: ${e.detail.reason}`);
    console.log(`Completed: ${e.detail.completedCount}`);
    console.log(`Cancelled: ${e.detail.cancelledCount}`);
  });

  // Add items
  items.forEach((item) => {
    batch.addItem(item.id, item.name);
  });

  // Process items with cancellation check
  for (const item of items) {
    if (cancelled) break;
    
    batch.updateItem({ itemId: item.id, status: 'processing' });
    
    try {
      await processItemWithCancellation(item, () => cancelled);
      
      if (!cancelled) {
        batch.completeItem(item.id);
      }
    } catch (error) {
      if (!cancelled) {
        batch.failItem(item.id, error.message);
      }
    }
  }
}

async function processItemWithCancellation(item, isCancelled) {
  for (let i = 0; i < 10; i++) {
    if (isCancelled()) {
      throw new Error('Cancelled');
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

### Real-time Statistics

```javascript
import { BatchProgress } from 'ai-progress-controls';

const batch = new BatchProgress({
  totalItems: 100,
  concurrency: 10,
  showStats: true,
  showRate: true,
});

document.body.appendChild(batch);
batch.start('Processing large batch...');

// Update statistics display
const statsDisplay = document.createElement('div');
document.body.appendChild(statsDisplay);

setInterval(() => {
  const stats = batch.getStats();
  const progress = batch.getOverallProgress();
  const rate = batch.getRate();
  
  statsDisplay.innerHTML = `
    <h3>Batch Statistics</h3>
    <p>Progress: ${progress.toFixed(1)}%</p>
    <p>Completed: ${stats.completed}/${stats.total}</p>
    <p>Success: ${stats.success}</p>
    <p>Failed: ${stats.failed}</p>
    <p>Pending: ${stats.pending}</p>
    <p>Rate: ${rate.toFixed(2)} items/sec</p>
    <p>Duration: ${(stats.duration / 1000).toFixed(1)}s</p>
  `;
}, 500);

// Add and process items
for (let i = 0; i < 100; i++) {
  batch.addItem(`item-${i}`, `Item ${i}`);
}
```

---

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { 
  BatchProgress, 
  BatchProgressConfig, 
  BatchProgressUpdate,
  BatchItem,
  BatchItemStatus,
  BatchCompleteEvent,
  BatchCancelEvent,
  BatchItemCompleteEvent,
  BatchItemFailedEvent,
} from 'ai-progress-controls';

const config: BatchProgressConfig = {
  totalItems: 50,
  concurrency: 5,
  showItems: true,
  showStats: true,
};

const batch = new BatchProgress(config);

batch.addEventListener('batchcomplete', (e: CustomEvent<BatchCompleteEvent>) => {
  const { successCount, failedCount, totalItems, duration } = e.detail;
  console.log(`Completed ${successCount}/${totalItems} in ${duration}ms`);
});

batch.addEventListener('itemfailed', (e: CustomEvent<BatchItemFailedEvent>) => {
  console.error(`Item ${e.detail.item.id} failed: ${e.detail.error}`);
});

const update: BatchProgressUpdate = {
  itemId: 'item-1',
  status: 'processing',
  progress: 50,
};

batch.updateItem(update);
```

---

## Accessibility

BatchProgress is built with accessibility in mind:

- **ARIA Attributes**: `role="progressbar"`, `aria-valuenow`, `aria-valuemax`, `aria-label`
- **Keyboard Navigation**: Cancel button is keyboard accessible
- **Screen Readers**: Progress updates are announced
- **Status Indicators**: Visual icons for all item states
- **High Contrast**: Works with high contrast modes
- **Semantic HTML**: Proper heading and list structure

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
- Map/Set

---

## Performance

- **Bundle Size**: ~12KB gzipped
- **Update Throttling**: 100ms (prevents UI thrashing)
- **Efficient Rendering**: Throttled DOM updates
- **Memory**: Minimal overhead with Map-based item storage
- **Large Batches**: Handles 1000+ items efficiently
- **Concurrency Control**: Built-in throttling

---

## Best Practices

1. **Set `totalItems` upfront** if known for accurate progress
2. **Add items before starting** for better initial display
3. **Use concurrency limits** to avoid overwhelming the system
4. **Handle `itemfailed` events** for error recovery
5. **Listen to `batchcomplete`** for final statistics
6. **Use `collapseCompleted`** for large batches
7. **Set `maxDisplayItems`** for very large batches (1000+)
8. **Call `reset()`** to reuse the same instance
9. **Use descriptive labels** for better UX
10. **Enable `debug: true`** during development

---

## Troubleshooting

### Items not showing

- Ensure you've called `start()` before or after `addItem()`
- Check that `showItems: true` in config
- Verify items were added with unique IDs

### Progress not updating

- Call `updateItem()` with progress values
- Ensure itemId matches an added item
- Check update throttling (100ms default)

### Batch not completing automatically

- All items must reach `completed`, `failed`, or `cancelled` status
- Check that you're calling `completeItem()` or `updateItem()` with final status
- Alternatively, manually call `complete()` when done

### Cancel button not working

- Ensure `allowCancel: true` in config
- Listen to `batchcancel` event to handle cancellation in your code
- Check that processing logic respects cancellation

### Performance issues with large batches

- Set `maxDisplayItems` to limit visible items (e.g., 100)
- Enable `collapseCompleted` to hide completed items
- Consider pagination for 10,000+ items

---

## Related

- [Getting Started Guide](../getting-started.md)
- [Examples](../../examples/vanilla/batch-progress.html)
- [GitHub Repository](https://github.com/yourusername/ai-progress-controls)
