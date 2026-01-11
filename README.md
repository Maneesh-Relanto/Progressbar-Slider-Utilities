# AI Progress Controls

**Framework-agnostic UI controls for AI/ML workflows - Works everywhere in just 3 lines of code**

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Web Components](https://img.shields.io/badge/Web_Components-Native-orange.svg)](https://www.webcomponents.org/)

## 🚀 Why AI Progress Controls?

Stop rebuilding the same AI UI components for every project. Get production-ready components that work with **ANY** framework:

✅ **3 Lines of Code** - Seriously, that's all you need  
✅ **Works Everywhere** - React, Vue, Angular, Svelte, Next.js, plain HTML  
✅ **Zero Dependencies** - Lightweight and fast  
✅ **AI-Aware** - Built-in token counting, cost tracking, queue management, retry logic  
✅ **Production Ready** - 5 complete components, 20 examples, full docs  
✅ **Fully Typed** - Complete TypeScript support  

## ⚡ Quick Start

```javascript
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress({ maxTokens: 2000 });
document.body.appendChild(progress);
```

**That's it!** Works in React, Vue, Angular, Svelte, and plain JavaScript.

[📖 Full Getting Started Guide](./docs/getting-started.md)

## 🎮 Live Demo

```bash
git clone https://github.com/yourusername/ai-progress-controls.git
cd ai-progress-controls
npm install
npm run dev
```

Open http://localhost:5173 to see:
- 🏠 **[Homepage with Live Demos](./index.html)** - Interactive demos of all 5 components
- 📚 **[Examples Gallery](./examples/index.html)** - 20 interactive examples (4 per component)
- 📖 **[Complete API Documentation](./docs/api/)** - Full reference for all components

> **💡 Pro Tip:** Open [index.html](./index.html) directly to see all components in action!

## 📦 What's Included

### 6 Production-Ready Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **StreamProgress** | Token streaming visualization | Rate tracking, cost estimation, real-time updates |
| **ModelLoader** | Multi-stage model loading | Download progress, memory usage, per-stage ETA |
| **ParameterSlider** | LLM parameter controls | Presets, manual input, temperature/top-p/etc. |
| **QueueProgress** | Queue position tracking | Live position updates, ETA, processing rate |
| **RetryProgress** | Exponential backoff retry | 4 strategies, automatic retry, error handling |
| **BatchProgress** | Batch processing progress | Multiple items, concurrency, individual tracking |

### 24 Interactive Examples

Each component has 4 real-world examples:
- Basic usage
- Advanced features
- Error handling
- Framework integration

### Complete Documentation

- **[Getting Started](./docs/getting-started.md)** - Quick setup for all frameworks
- **[API Docs](./docs/api/)** - Full reference for all 5 components
- **[Examples](./examples/index.html)** - 20 copy-paste ready examples
- **[TypeScript Support](./docs/getting-started.md#typescript)** - Full type definitions

## Problem Statement

Developers building AI-powered applications face common UI challenges:

- **Generic progress bars** don't convey AI-specific context (token streaming, model loading stages, queue position)
- **Manual implementation** of LLM parameter controls leads to inconsistent UX and poor accessibility
- **No standard components** exist for visualizing AI operations (batch processing, confidence thresholds, cost tracking)
- **Framework lock-in** forces rebuilding the same controls for React, Vue, Svelte, etc.
- **Poor developer experience** when integrating progress indicators with streaming AI APIs

Current solutions require developers to either:
1. Build custom controls from scratch for every project
2. Use generic progress bars that don't communicate AI operation nuances
3. Cobble together multiple libraries with inconsistent APIs

## Our Solution

**AI Progress Controls** provides a library of specialized UI components designed specifically for AI/ML workflows:

### ✅ Production-Ready Components (v0.1.0)

1. **StreamProgress** - Real-time token streaming visualization with rate tracking and cost estimation
2. **ModelLoader** - Multi-stage progress for model download, loading, and initialization
3. **ParameterSlider** - Intuitive controls for temperature, top-p, max tokens, and other LLM parameters
4. **QueueProgress** - Show user's position in processing queue with live updates and ETA
5. **RetryProgress** - Exponential backoff retry mechanism with multiple strategies for handling API failures
6. **BatchProgress** - Process multiple items in parallel with individual progress tracking and concurrency control

**🎉 24 Interactive Examples** - 4 examples per component showing real-world usage

**📚 Complete Documentation** - Full API docs for all 6 components with TypeScript support

### Planned Components (Roadmap)
7. **WorkflowProgress** - Multi-step AI pipeline visualization
7. **BatchProgress** - Handle multiple concurrent AI operations
8. **ConfidenceThreshold** - Adjustable sliders with live result previews

### Key Features

- ✅ **Framework Agnostic** - Works with ANY framework in just 3 lines of code!
  - Vanilla JS/HTML
  - React / Next.js
  - Vue / Nuxt
  - Angular
  - Svelte / SvelteKit
  - SolidJS
  - Preact
  - Lit
  - Astro
  - And literally any other JavaScript framework!
- ✅ **Zero Dependencies** - Lightweight and fast
- ✅ **AI-Aware** - Built-in token counting, cost estimation, streaming support
- ✅ **Accessible** - ARIA attributes, keyboard navigation, screen reader support, focus management
- ✅ **Themeable** - CSS variables, dark mode, multiple presets
- ✅ **TypeScript** - Full type definitions included
- ✅ **Ready to Use** - 3 components complete, 12 interactive examples, full documentation

## Target Audience

**Primary:** Frontend/Fullstack developers building AI-powered applications

**Specific Personas:**
- Developers integrating OpenAI, Anthropic, or other LLM APIs
- Teams building internal AI tools and dashboards
- Indie hackers creating AI SaaS products
- ML engineers adding UIs to model inference pipelines
- Developer tool creators building AI-enhanced IDEs/editors

**Use Cases:**
- Chatbot interfaces with streaming responses
- Image generation tools (Stable Diffusion, DALL-E)
- Batch document processing systems
- AI content creation platforms
- Model fine-tuning dashboards
- Voice/audio transcription services

## Project Status

🚀 **v0.1.0 - Production Ready** - 5 core components complete with full documentation

**Available Now:**
- ✅ **6 Production-Ready Components**
  - StreamProgress - Token streaming with cost tracking
  - ModelLoader - Multi-stage model loading
  - ParameterSlider - AI parameter controls (temperature, top-p, etc.)
  - QueueProgress - Queue position tracking with ETA
  - RetryProgress - Exponential backoff retry mechanism
  - BatchProgress - Batch processing with concurrency control
- ✅ **24 Interactive Examples** - 4 examples per component
- ✅ **Complete API Documentation** - Full docs for all 6nt
- ✅ **Complete API Documentation** - Full docs for all 5 components
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Framework Agnostic** - Works with React, Vue, Angular, Svelte, and any framework

**Next Steps:**
- 📦 npm package publishing
- 🧪 Unit test coverage
- 🚧 Additional components (WorkflowProgress, BatchProgress)
- 🌐 Documentation website with live playground

## Quick Start - Just 3 Lines of Code!

```bash
# Coming soon to npm
# npm install ai-progress-controls

# For now, clone and run locally:
git clone https://github.com/yourusername/ai-progress-controls.git
cd ai-progress-controls
npm install
npm run dev  # Opens http://localhost:5173
```

### Vanilla JavaScript

```javascript
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress({ maxTokens: 2000 });
document.body.appendChild(progress);
```

### React / Next.js

```tsx
import { useEffect, useRef } from 'react';
import { StreamProgress } from 'ai-progress-controls';

export default function Chat() {
  const ref = useRef(null);
  
  useEffect(() => {
    const progress = new StreamProgress({ maxTokens: 2000 });
    ref.current.appendChild(progress);
    return () => progress.remove();
  }, []);
  
  return <div ref={ref} />;
}
```

### Vue / Nuxt

```vue
<template><div ref="container"></div></template>

<script setup>
import { ref, onMounted } from 'vue';
import { StreamProgress } from 'ai-progress-controls';

const container = ref(null);

onMounted(() => {
  const progress = new StreamProgress({ maxTokens: 2000 });
  container.value.appendChild(progress);
});
</script>
```

### Svelte / SvelteKit

```svelte
<script>
  import { onMount } from 'svelte';
  import { StreamProgress } from 'ai-progress-controls';
  
  let container;
  
  onMount(() => {
    const progress = new StreamProgress({ maxTokens: 2000 });
    container.appendChild(progress);
  });
</script>

<div bind:this={container}></div>
```

**Works with ANY framework** - Angular, Solid, Preact, Lit, Astro, and more!

[📖 See Full Framework Examples](./GETTING_STARTED.md#framework-integration)

## Development Roadmap

- ✅ **Phase 1**: Core component architecture (Web Components) - **COMPLETE**
- ✅ **Phase 2**: Essential AI controls - **5 COMPONENTS COMPLETE**
  - ✅ StreamProgress - Token streaming with rate tracking
  - ✅ ModelLoader - Multi-stage loading
  - ✅ ParameterSlider - LLM parameter controls
  - ✅ QueueProgress - Queue position tracking
  - ✅ RetryProgress - Exponential backoff retry
- ✅ **Phase 3**: Web Components Foundation - **COMPLETE** 
  - Native browser support, works with all frameworks
  - No framework wrappers needed (Web Components standard)
- ✅ **Phase 4**: Documentation - **COMPLETE**
  - ✅ 20 interactive examples (4 per component)
  - ✅ Complete API documentation for all 5 components
  - ✅ Getting started guide
  - ✅ Framework usage examples
- 🚧 **Phase 5**: Testing & Quality
  - Unit tests with Vitest
  - E2E tests
  - CI/CD pipeline
- 🚧 **Phase 6**: npm publishing and distribution
- 🚧 **Phase 7**: Documentation site and interactive playground

## Contributing

Contributions welcome! This is an open-source project aimed at improving DX for AI application developers.

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ for the AI developer community**
