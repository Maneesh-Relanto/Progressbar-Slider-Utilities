# ModelLoader API Documentation

## Overview

`ModelLoader` is a Web Component that displays multi-stage progress for AI model loading operations. It tracks download progress, initialization stages, memory usage, and provides ETA calculations for each stage.

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
import { ModelLoader } from 'ai-progress-controls';
```

---

## Constructor

### `new ModelLoader(config?: ModelLoaderConfig)`

Creates a new ModelLoader component instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `ModelLoaderConfig` | Optional configuration object |

**Returns:** `ModelLoader` instance

**Example:**

```javascript
const loader = new ModelLoader({
  modelName: 'GPT-4 Vision',
  showBytes: true,
  showMemoryUsage: true,
  showETA: true,
});
```

---

## Configuration

### ModelLoaderConfig

Configuration object passed to the constructor.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `stages` | `ModelStage[]` | `['download', 'load', 'initialize', 'ready']` | Stages to display |
| `modelName` | `string` | `'AI Model'` | Model name to display |
| `showBytes` | `boolean` | `true` | Show bytes downloaded/total |
| `showMemoryUsage` | `boolean` | `true` | Show memory usage in MB |
| `showETA` | `boolean` | `true` | Show estimated time remaining |
| `showRetryButton` | `boolean` | `true` | Show retry button on error |
| `smoothProgress` | `boolean` | `true` | Enable smooth animations |
| `updateThrottle` | `number` | `100` | Update throttle (ms) |
| `retryLabel` | `string` | `'Retry'` | Retry button label |
| `debug` | `boolean` | `false` | Enable debug logging |
| `className` | `string` | `''` | Custom CSS class |
| `ariaLabel` | `string` | `'Model Loading Progress'` | ARIA label |

### ModelStage Type

Available stages for model loading:

```typescript
type ModelStage = 'download' | 'load' | 'initialize' | 'ready';
```

**Example:**

```javascript
const config = {
  modelName: 'Llama-3-70B',
  stages: ['download', 'load', 'initialize'],
  showBytes: true,
  showMemoryUsage: true,
  showETA: true,
  retryLabel: 'Try Again',
  debug: true,
};

const loader = new ModelLoader(config);
```

---

## Methods

### `start(initialMessage?: string): void`

Start the loading process and initialize the first stage.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialMessage` | `string` | Optional message for the first stage |

**Example:**

```javascript
loader.start('Starting model download...');
```

**Fires:** `loadstart` event

---

### `updateStage(stage: ModelStage, update: StageUpdate): void`

Update the progress of a specific stage.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stage` | `ModelStage` | ✅ Yes | Stage to update (`'download'`, `'load'`, etc.) |
| `update.progress` | `number` | ❌ No | Progress percentage (0-100) |
| `update.bytesLoaded` | `number` | ❌ No | Bytes downloaded |
| `update.totalBytes` | `number` | ❌ No | Total bytes to download |
| `update.message` | `string` | ❌ No | Status message |
| `update.memoryUsage` | `number` | ❌ No | Memory usage in MB |

**Example:**

```javascript
// Update with bytes
loader.updateStage('download', {
  bytesLoaded: 50000000,
  totalBytes: 100000000,
  message: 'Downloading model weights...'
});

// Update with progress percentage
loader.updateStage('load', {
  progress: 75,
  memoryUsage: 1500,
  message: 'Loading layers...'
});
```

**Fires:** `stageupdate` event

---

### `setStage(stage: ModelStage, options?: { message?: string; progress?: number }): void`

Move to a specific stage. Automatically marks the previous stage as completed.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `stage` | `ModelStage` | Stage to move to |
| `options.message` | `string` | Initial message for the stage |
| `options.progress` | `number` | Initial progress (0-100) |

**Example:**

```javascript
// Move to load stage
loader.setStage('load', { 
  message: 'Loading into memory...',
  progress: 0 
});

// Move to initialize stage
loader.setStage('initialize', {
  message: 'Initializing model...'
});
```

**Fires:** `stagechange` event

---

### `complete(): void`

Mark the loading process as completed. Sets all stages to completed state.

**Example:**

```javascript
loader.complete();
```

**Fires:** `loadcomplete` event

---

### `error(errorMessage: string): void`

Mark the loading process as failed with an error message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `errorMessage` | `string` | Error message to display |

**Example:**

```javascript
loader.error('Failed to download model: Network error');
```

**Fires:** `loaderror` event

---

### `retry(): void`

Retry the loading process after an error. Resets all stages and restarts from the beginning.

**Example:**

```javascript
loader.retry();
```

**Fires:** `loadstart` event

---

### `reset(): void`

Reset the component to its initial state. Clears all progress and stages.

**Example:**

```javascript
loader.reset();
```

---

### `getStageProgress(stage: ModelStage): number`

Get the current progress of a specific stage.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `stage` | `ModelStage` | Stage to query |

**Returns:** `number` - Progress percentage (0-100)

**Example:**

```javascript
const downloadProgress = loader.getStageProgress('download');
console.log(`Download: ${downloadProgress}%`);
```

---

### `getCurrentStage(): ModelStage`

Get the currently active stage.

**Returns:** `ModelStage` - Current stage name

**Example:**

```javascript
const current = loader.getCurrentStage();
console.log('Current stage:', current); // 'download', 'load', etc.
```

---

### `isLoading(): boolean`

Check if the loader is currently loading.

**Returns:** `boolean` - True if loading

**Example:**

```javascript
if (loader.isLoading()) {
  console.log('Loading in progress...');
}
```

---

## Events

### `loadstart`

Fired when loading starts.

**Event Detail:**

```typescript
{
  stage: ModelStage;      // Initial stage
  timestamp: number;       // Start timestamp
}
```

**Example:**

```javascript
loader.addEventListener('loadstart', (e) => {
  console.log('Loading started:', e.detail.stage);
});
```

---

### `stagechange`

Fired when the active stage changes.

**Event Detail:**

```typescript
{
  previousStage: ModelStage;  // Previous stage
  currentStage: ModelStage;   // New current stage
  timestamp: number;           // Change timestamp
}
```

**Example:**

```javascript
loader.addEventListener('stagechange', (e) => {
  console.log(`Stage: ${e.detail.previousStage} → ${e.detail.currentStage}`);
});
```

---

### `stageupdate`

Fired when stage progress updates.

**Event Detail:**

```typescript
{
  stage: ModelStage;       // Updated stage
  status: StageStatus;     // 'pending' | 'in-progress' | 'completed' | 'error'
  progress: number;        // Progress (0-100)
  message?: string;        // Status message
  bytesLoaded?: number;    // Bytes downloaded
  totalBytes?: number;     // Total bytes
}
```

**Example:**

```javascript
loader.addEventListener('stageupdate', (e) => {
  console.log(`${e.detail.stage}: ${e.detail.progress}%`);
  if (e.detail.bytesLoaded) {
    console.log(`Downloaded: ${e.detail.bytesLoaded} / ${e.detail.totalBytes}`);
  }
});
```

---

### `loadcomplete`

Fired when loading completes successfully.

**Event Detail:**

```typescript
{
  totalDuration: number;   // Total load time in ms
  stages: StageState[];    // All stage states
  timestamp: number;       // Completion timestamp
}
```

**Example:**

```javascript
loader.addEventListener('loadcomplete', (e) => {
  console.log(`Model loaded in ${e.detail.totalDuration}ms`);
});
```

---

### `loaderror`

Fired when an error occurs.

**Event Detail:**

```typescript
{
  stage: ModelStage;       // Stage where error occurred
  message: string;         // Error message
  timestamp: number;       // Error timestamp
}
```

**Example:**

```javascript
loader.addEventListener('loaderror', (e) => {
  console.error(`Error in ${e.detail.stage}: ${e.detail.message}`);
});
```

---

## Properties

### `modelName: string`

Get or set the model name displayed.

**Example:**

```javascript
loader.modelName = 'GPT-4 Turbo';
console.log(loader.modelName); // 'GPT-4 Turbo'
```

---

### `disabled: boolean`

Get or set the disabled state.

**Example:**

```javascript
loader.disabled = true; // Disable the loader
```

---

## Styling

### CSS Custom Properties

Customize the appearance using CSS variables:

```css
model-loader {
  /* Colors */
  --loader-background: #1a1a2e;
  --loader-text: #e4e4e7;
  --loader-primary: #667eea;
  --loader-success: #10b981;
  --loader-error: #ef4444;
  --loader-border: #27273a;
  
  /* Spacing */
  --loader-padding: 24px;
  --loader-border-radius: 12px;
  
  /* Typography */
  --loader-font-family: 'Inter', system-ui, sans-serif;
  --loader-font-size: 14px;
  
  /* Stage colors */
  --stage-pending: #52525b;
  --stage-active: #667eea;
  --stage-complete: #10b981;
  --stage-error: #ef4444;
  
  /* Progress bar */
  --progress-height: 6px;
  --progress-background: #27273a;
  --progress-fill: #667eea;
}
```

### Custom Classes

Add custom styling with the `className` config option:

```javascript
const loader = new ModelLoader({
  className: 'my-custom-loader'
});
```

```css
.my-custom-loader {
  --loader-primary: #ff6b6b;
  border: 2px solid #ff6b6b;
}
```

---

## Examples

### Basic Usage

```javascript
import { ModelLoader } from 'ai-progress-controls';

const loader = new ModelLoader({
  modelName: 'GPT-4',
  showBytes: true,
  showETA: true,
});

document.body.appendChild(loader);

loader.start('Starting download...');

// Simulate download progress
let downloaded = 0;
const total = 100000000; // 100 MB

const interval = setInterval(() => {
  downloaded += 5000000; // 5 MB chunks
  
  loader.updateStage('download', {
    bytesLoaded: downloaded,
    totalBytes: total,
  });
  
  if (downloaded >= total) {
    clearInterval(interval);
    loader.setStage('load');
    setTimeout(() => loader.complete(), 1000);
  }
}, 100);
```

---

### Multi-Stage Loading

```javascript
async function loadModel() {
  const loader = new ModelLoader({
    modelName: 'Stable Diffusion XL',
    stages: ['download', 'load', 'initialize'],
  });
  
  document.body.appendChild(loader);
  
  // Start download
  loader.start('Downloading model...');
  await simulateDownload(loader);
  
  // Load into memory
  loader.setStage('load', { message: 'Loading into memory...' });
  await simulateLoad(loader);
  
  // Initialize
  loader.setStage('initialize', { message: 'Initializing model...' });
  await simulateInitialize(loader);
  
  loader.complete();
}

async function simulateDownload(loader) {
  return new Promise(resolve => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      loader.updateStage('download', {
        progress,
        bytesLoaded: progress * 1000000,
        totalBytes: 100000000
      });
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}
```

---

### Error Handling

```javascript
const loader = new ModelLoader({
  modelName: 'Custom Model',
  showRetryButton: true,
});

document.body.appendChild(loader);

loader.addEventListener('loaderror', (e) => {
  console.error('Load failed:', e.detail.message);
});

async function loadWithErrorHandling() {
  try {
    loader.start('Downloading...');
    
    const response = await fetch('/api/download-model');
    if (!response.ok) throw new Error('Download failed');
    
    // Process download...
    loader.complete();
    
  } catch (error) {
    loader.error(error.message);
  }
}

// Retry button click
loader.addEventListener('retry', () => {
  loadWithErrorHandling();
});
```

---

### With Hugging Face Models

```javascript
import { ModelLoader } from 'ai-progress-controls';

async function downloadHuggingFaceModel(modelId) {
  const loader = new ModelLoader({
    modelName: modelId,
    showBytes: true,
    showMemoryUsage: true,
  });
  
  document.body.appendChild(loader);
  loader.start('Fetching model info...');
  
  try {
    // Download model files
    loader.setStage('download');
    const files = await fetchModelFiles(modelId);
    
    let totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    let loadedBytes = 0;
    
    for (const file of files) {
      const response = await fetch(file.url);
      const reader = response.body.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        loadedBytes += value.length;
        loader.updateStage('download', {
          bytesLoaded: loadedBytes,
          totalBytes: totalBytes
        });
      }
    }
    
    // Load into memory
    loader.setStage('load', { message: 'Loading model...' });
    loader.updateStage('load', { memoryUsage: 2048 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    loader.complete();
    
  } catch (error) {
    loader.error(`Failed to load ${modelId}: ${error.message}`);
  }
}
```

---

### Memory Tracking

```javascript
const loader = new ModelLoader({
  modelName: 'Large Language Model',
  showMemoryUsage: true,
});

document.body.appendChild(loader);

loader.start();

// Track memory usage during loading
async function loadWithMemoryTracking() {
  loader.setStage('download');
  
  // Monitor memory periodically
  const memoryInterval = setInterval(() => {
    if (performance.memory) {
      const usedMB = performance.memory.usedJSHeapSize / 1048576;
      loader.updateStage('load', {
        memoryUsage: Math.round(usedMB)
      });
    }
  }, 500);
  
  // Simulate loading stages
  await loadStage('download');
  loader.setStage('load');
  await loadStage('load');
  loader.setStage('initialize');
  await loadStage('initialize');
  
  clearInterval(memoryInterval);
  loader.complete();
}
```

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { 
  ModelLoader, 
  ModelLoaderConfig,
  ModelStage,
  StageUpdate,
  LoadCompleteEvent 
} from 'ai-progress-controls';

const config: ModelLoaderConfig = {
  modelName: 'My Model',
  stages: ['download', 'load', 'initialize'],
  showBytes: true,
  showMemoryUsage: true,
};

const loader = new ModelLoader(config);

loader.addEventListener('loadcomplete', (e: CustomEvent<LoadCompleteEvent>) => {
  console.log('Duration:', e.detail.totalDuration);
});
```

---

## Accessibility

`ModelLoader` is fully accessible:

- ✅ **ARIA Attributes**: Proper `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- ✅ **Screen Reader Support**: All stages and progress announced
- ✅ **Keyboard Navigation**: Retry button is keyboard accessible
- ✅ **Live Regions**: Progress updates announced via `aria-live="polite"`
- ✅ **High Contrast**: Works with high contrast modes
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

Requires ES2020 support and Web Components (Custom Elements v1).

---

## Related Components

- **[StreamProgress](./stream-progress.md)** - Token streaming progress
- **[ParameterSlider](./parameter-slider.md)** - AI parameter controls

---

## License

MIT License - See LICENSE file for details
