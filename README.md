<div align="center">

# 🤖 AI Progress Controls

### **Production-ready UI components for AI/ML workflows**

### **React • Next.js • Web Components • Drop in with one import**

[![npm version](https://img.shields.io/npm/v/ai-progress-controls?style=for-the-badge&logo=npm&label=Core)](https://www.npmjs.com/package/ai-progress-controls)
[![npm version](https://img.shields.io/npm/v/ai-progress-controls-react?style=for-the-badge&logo=react&label=React)](https://www.npmjs.com/package/ai-progress-controls-react)
[![npm version](https://img.shields.io/npm/v/ai-progress-controls-next?style=for-the-badge&logo=next.js&label=Next.js&logoColor=white)](https://www.npmjs.com/package/ai-progress-controls-next)

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![Bundle Size](https://img.shields.io/badge/Size-~28KB_gzipped-8b5cf6?style=for-the-badge)](https://bundlephobia.com)

[![Tests](https://img.shields.io/badge/Tests-292_passing-22c55e?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-91.34%25-22c55e?style=for-the-badge&logo=codecov&logoColor=white)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-AA_Compliant-22c55e?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)

<p align="center">
  <strong>🎯 7 Components • 📦 10 Examples • 📖 Complete Docs • ✅ Published on npm</strong>
</p>

</div>

---

## 🚀 Why AI Progress Controls?

Stop rebuilding the same AI UI components for every project. Get production-ready components that work with **ANY** framework:

<table>
<tr>
<td width="50%">

### ✨ **Developer Experience**

⚛️ **React & Next.js Ready** - Native adapters with hooks & SSR  
🎯 **One Import Away** - Single import, drop in JSX, done  
🔌 **Web Components** - Works everywhere (Vue, Angular, Svelte, plain HTML)  
📦 **Zero Dependencies** - Lightweight and fast (~28KB gzipped)  
🎨 **Fully Themeable** - CSS variables, dark mode ready  
📘 **TypeScript First** - Complete type definitions included

</td>
<td width="50%">

### 🤖 **AI-Aware Features**

⚡ **Token Streaming** - Real-time visualization with rate tracking  
💰 **Cost Estimation** - Built-in pricing calculations  
🔄 **Retry Logic** - Exponential backoff strategies  
📊 **Queue Management** - Position tracking with ETA  
🎯 **Batch Processing** - Concurrency control & item tracking  
🎛️ **Parameter Controls** - Unified LLM configuration panels

### 🎨 **Visual Customization**

✅ **4 Visual Variants** - default, minimal, gradient, glassmorphic  
✅ **4 Animation Effects** - none, striped, pulse, glow  
✅ **3 Size Variants** - compact, default, large  
✅ **5 Brand Themes** - OpenAI, Anthropic, Google AI, Cohere, Dark  
✅ **Cursor Feedback** - Automatic state indication  
✅ **Smooth Animations** - Hardware-accelerated transitions

</td>
</tr>
</table>

<div align="center">

### 🎯 **Production Stats**

| **7** Components | **10** Examples  | **292** Tests | **91.34%** Coverage |  **0** Errors   |
| :--------------: | :--------------: | :-----------: | :-----------------: | :-------------: |
| Fully documented | Copy-paste ready | 100% passing  | Exceeds 80% target  | SonarQube clean |

</div>

---

## ⚡ Quick Start - Choose Your Framework

> **[🎯 2-Minute Quick Start Guide](./docs/QUICK_START.md)** - Get running in 30 seconds!

<table>
<tr>
<td width="50%">

### ⚛️ **React / Next.js** (Recommended)

```bash
npm install ai-progress-controls ai-progress-controls-react
```

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

function App() {
  return <StreamProgress maxTokens={2000} />;
}
```

**That's it!** Props sync automatically, no refs needed.

[📖 React Guide](./adapters/react/README.md) • [📖 Next.js Guide](./adapters/next/README.md)

</td>
<td width="50%">

### 🌐 **Web Components** (Universal)

Works in Vue, Angular, Svelte, or plain JavaScript:

```javascript
import { StreamProgress } from 'ai-progress-controls';

const progress = new StreamProgress({ maxTokens: 2000 });
document.body.appendChild(progress);
```

**That's it!** Import, create, append - works in any framework.

[📖 Getting Started](./docs/getting-started.md) • [🎮 Examples](./examples/index.html)

</td>
</tr>
</table>

<div align="center">

### 📚 **Documentation**

**Getting Started:**  
[📦 Installation Guide](./docs/installation-guide.md) • [💻 npm Usage Examples](./docs/npm-usage-examples.md) • [🚀 Getting Started](./docs/getting-started.md)

**Framework Guides:**  
[⚛️ React Adapter](./adapters/react/README.md) • [▲ Next.js Adapter](./adapters/next/README.md) • [🌐 Web Components](./docs/getting-started.md)

**Code Examples:**  
[⚛️ React Examples](./docs/react-examples.md) • [▲ Next.js Examples](./docs/nextjs-examples.md) • [🎮 Vanilla JS Examples](./examples/index.html)

**Reference:**  
[📚 API Docs](./docs/api/) • [🎨 Theming](./docs/theming.md) • [🎭 Visual Variants](./docs/visual-variants.md)

</div>

---

## 📦 Framework Integration

<div align="center">

### Choose the best package for your stack

</div>

<table>
<tr>
<td width="33%">

### ⚛️ **React**

```bash
npm install ai-progress-controls-react
```

**Features:**

- ✅ Hooks-based API
- ✅ Props sync automatically
- ✅ TypeScript support
- ✅ React 18+ compatible

[📖 React Documentation](./adapters/react/README.md)

</td>
<td width="33%">

### ▲ **Next.js**

```bash
npm install ai-progress-controls-next
```

**Features:**

- ✅ Full SSR support
- ✅ App Router ready
- ✅ No hydration errors
- ✅ Auto client components

[📖 Next.js Documentation](./adapters/next/README.md)

</td>
<td width="33%">

### 🌐 **Web Components**

```bash
npm install ai-progress-controls
```

**Features:**

- ✅ Framework-agnostic
- ✅ Vue, Angular, Svelte
- ✅ Plain JavaScript
- ✅ Zero dependencies

[📖 Web Components Guide](./docs/getting-started.md)

</td>
</tr>
</table>

---

## 🎮 Live Demo

```bash
git clone https://github.com/Maneesh-Relanto/ai-progress-controls.git
cd ai-progress-controls
npm install
npm run dev
```

<div align="center">

### 🌐 **Open http://localhost:5173**

|                      🏠 Homepage                      |               📚 Examples Gallery               |
| :---------------------------------------------------: | :---------------------------------------------: |
| [Interactive demos of all 7 components](./index.html) | [10 copy-paste examples](./examples/index.html) |

</div>

> **💡 Pro Tip:** Open [index.html](./index.html) directly in your browser to see all components in action!

---

## 📦 What's Included

<div align="center">

### 🎯 **7 Production-Ready Components**

</div>

<table>
<tr>
<td width="33%">

#### 🌊 **StreamProgress**

Real-time token streaming visualization

✓ Rate tracking (tokens/sec)  
✓ Cost estimation  
✓ Live progress updates

[📖 Docs](./docs/api/stream-progress.md) • [🎮 Demo](./examples/vanilla/stream-progress.html)

</td>
<td width="33%">

#### 📥 **ModelLoader**

Multi-stage model loading

✓ Download progress  
✓ Memory usage tracking  
✓ Per-stage ETA

[📖 Docs](./docs/api/model-loader.md) • [🎮 Demo](./examples/vanilla/model-loader.html)

</td>
<td width="33%">

#### 🎛️ **ParameterSlider**

Single LLM parameter control

✓ Temperature, top-p, etc.  
✓ Preset configurations  
✓ Manual input support

[📖 Docs](./docs/api/parameter-slider.md) • [🎮 Demo](./examples/vanilla/parameter-slider.html)

</td>
</tr>
<tr>
<td width="33%">

#### 🎚️ **ParameterPanel** 🆕

Multi-parameter configuration

✓ Grouped controls  
✓ Preset management  
✓ Export/import configs  
✓ Custom validation

[📖 Docs](./docs/api/parameter-panel.md) • [🎮 Demo](./examples/vanilla/parameter-panel.html)

</td>
<td width="33%">

#### ⏳ **QueueProgress**

Queue position tracking

✓ Live position updates  
✓ ETA calculation  
✓ Processing rate

[📖 Docs](./docs/api/queue-progress.md) • [🎮 Demo](./examples/vanilla/queue-progress.html)

</td>
<td width="33%">

#### 🔄 **RetryProgress**

Exponential backoff retry

✓ 4 retry strategies  
✓ Automatic retry logic  
✓ Error handling

[📖 Docs](./docs/api/retry-progress.md) • [🎮 Demo](./examples/vanilla/retry-progress.html)

</td>
</tr>
<tr>
<td width="33%">

#### 📊 **BatchProgress**

Batch processing progress

✓ Multiple items  
✓ Concurrency control  
✓ Individual tracking

[📖 Docs](./docs/api/batch-progress.md) • [🎮 Demo](./examples/vanilla/batch-progress.html)

</td>
<td colspan="2">

</td>
</tr>
</table>

<div align="center">

### 📚 **Complete Documentation**

|               📖 Getting Started               |              🎮 28+ Examples               |         📘 API Reference         | 🎨 Theming Guide |
| :--------------------------------------------: | :----------------------------------------: | :------------------------------: | :--------------: |
| [Quick setup guide](./docs/getting-started.md) | [4-6 per component](./examples/index.html) | [1,100+ lines each](./docs/api/) |  CSS variables   |

</div>

---

## 🎯 Problem & Solution

<table>
<tr>
<td width="50%">

### ❌ **The Problem**

Developers building AI apps face repetitive UI challenges:

- 🔴 **Generic progress bars** don't show AI context (tokens, costs, queues)
- 🔴 **Manual implementation** of LLM controls = inconsistent UX
- 🔴 **No standard components** for AI operations
- 🔴 **Framework lock-in** forces rebuilding for React/Vue/Angular
- 🔴 **Poor DX** integrating with streaming AI APIs

</td>
<td width="50%">

### ✅ **Our Solution**

Specialized UI components built FOR AI workflows:

- 🟢 **AI-aware components** with token tracking, cost estimation
- 🟢 **Production-ready** - just import and use
- 🟢 **Works everywhere** - framework-agnostic Web Components
- 🟢 **Zero dependencies** - lightweight and fast
- 🟢 **TypeScript first** - complete type safety

</td>
</tr>
</table>

---

## 👥 Target Audience

<div align="center">

**Frontend & Fullstack developers building AI-powered applications**

</div>

<table>
<tr>
<td width="50%">

### 🎯 **Primary Users**

- 🤖 Developers integrating OpenAI/Anthropic/other LLM APIs
- 🏢 Teams building internal AI tools and dashboards
- 💼 Indie hackers creating AI SaaS products
- 🔬 ML engineers adding UIs to inference pipelines
- 🛠️ Developer tool creators building AI-enhanced IDEs

</td>
<td width="50%">

### 💡 **Use Cases**

- 💬 Chatbot interfaces with streaming responses
- 🖼️ Image generation tools (Stable Diffusion, DALL-E)
- 📄 Batch document processing systems
- ✍️ AI content creation platforms
- 🎛️ Model fine-tuning dashboards
- 🎤 Voice/audio transcription services

</td>
</tr>
</table>

---

## 📊 Project Status

<div align="center">

### 🚀 **v0.1.0 - Production Ready**

[![Status](https://img.shields.io/badge/Status-Production_Ready-22c55e?style=for-the-badge)](https://github.com)
[![Components](https://img.shields.io/badge/Components-6/6_Complete-3b82f6?style=for-the-badge)](./docs/api/)
[![Examples](https://img.shields.io/badge/Examples-24_Interactive-8b5cf6?style=for-the-badge)](./examples/)
[![Docs](https://img.shields.io/badge/Documentation-Complete-f59e0b?style=for-the-badge)](./docs/)

</div>

### ✅ **Completed**

<table>
<tr>
<td width="50%">

#### 🎯 **Components (7/7)**

- ✅ StreamProgress - Token streaming
- ✅ ModelLoader - Multi-stage loading
- ✅ ParameterSlider - LLM controls
- ✅ QueueProgress - Queue tracking
- ✅ RetryProgress - Retry logic
- ✅ BatchProgress - Batch processing

</td>
<td width="50%">

#### 📚 **Documentation**

- ✅ 10 interactive examples (visual variants, theming, cursor states)
- ✅ Complete API docs (400+ lines each)
- ✅ Getting started guide
- ✅ TypeScript definitions
- ✅ Visual variants guide

</td>
</tr>
</table>

### ✅ **Testing & Quality Assurance**

<div align="center">

[![Tests](https://img.shields.io/badge/Tests-292_Passing-22c55e?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Components-7/7_Tested-3b82f6?style=for-the-badge)](./src/core/)
[![Framework](https://img.shields.io/badge/Vitest-1.6.1-729B1B?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

**292 tests • 100% pass rate • ~7.2s execution time**

</div>

<table>
<tr>
<td width="50%">

#### 📊 **Test Coverage by Component**

| Component          |  Tests  |   Status    |
| ------------------ | :-----: | :---------: |
| 🎛️ ParameterPanel  |   55    |     ✅      |
| 🌊 StreamProgress  |   49    |     ✅      |
| 📊 BatchProgress   |   46    |     ✅      |
| 🔄 RetryProgress   |   40    |     ✅      |
| ⏳ QueueProgress   |   36    |     ✅      |
| 🎛️ ParameterSlider |   34    |     ✅      |
| 📥 ModelLoader     |   32    |     ✅      |
| **TOTAL**          | **292** | **✅ 100%** |

</td>
<td width="50%">

#### 🧪 **What's Tested**

✅ **Lifecycle Methods** - start, update, complete, cancel, reset  
✅ **Event Emission** - All custom events verified  
✅ **State Management** - State transitions & accuracy  
✅ **Properties** - Getters, setters, disabled states  
✅ **Rendering** - Shadow DOM & dynamic updates  
✅ **Accessibility** - ARIA attributes & roles  
✅ **Edge Cases** - Boundary values, rapid operations  
✅ **Validation** - Custom validation functions  
✅ **Persistence** - localStorage save/load

</td>
</tr>
</table>

<div align="center">

**🔬 Test Framework:** Vitest with jsdom • **⚡ Fast:** ~7.2s for 292 tests • **🎯 Comprehensive:** Every public API + visual variants tested

[Run Tests: `npm test`](./package.json)

</div>

### 🚧 **Next Steps**

| Priority  | Task                                  | Status  |
| :-------: | ------------------------------------- | :-----: |
|  🔴 High  | npm package publishing                |  Ready  |
| 🟡 Medium | Documentation website (GitHub Pages)  | Planned |
| 🟡 Medium | E2E tests                             | Planned |
|  🟢 Low   | Additional components (6+ identified) | Roadmap |

---

## 🔥 Framework Support - Works Everywhere!

<div align="center">

### **One component. Any framework. Zero configuration.**

</div>

<table>
<tr>
<td width="33%">

#### ⚛️ **React / Next.js**

```tsx
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress();
containerRef.current.appendChild(progress);
```

</td>
<td width="33%">

#### 💚 **Vue / Nuxt**

```vue
import { StreamProgress } from 'ai-progress-controls'; const progress = new StreamProgress();
container.value.appendChild(progress);
```

</td>
<td width="33%">

#### 🅰️ **Angular**

```typescript
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress();
this.container.nativeElement.appendChild(progress);
```

</td>
</tr>
<tr>
<td width="33%">

#### 🧡 **Svelte / SvelteKit**

```svelte
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress();
container.appendChild(progress);
```

</td>
<td width="33%">

#### 🟦 **SolidJS**

```tsx
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress();
container?.appendChild(progress);
```

</td>
<td width="33%">

#### ⚡ **Vanilla JS**

```javascript
import { StreamProgress } from 'ai-progress-controls';
const progress = new StreamProgress();
document.body.appendChild(progress);
```

</td>
</tr>
</table>

<div align="center">

**Also works with:** Preact • Lit • Astro • Qwik • Ember • And any other JavaScript framework!

[📖 See full framework examples](./docs/getting-started.md#framework-integration)

</div>

---

## 🎨 Features

<table>
<tr>
<td width="50%">

### 🏗️ **Architecture**

✅ Web Components (native browser standard)  
✅ Shadow DOM encapsulation  
✅ Zero dependencies  
✅ ~28KB gzipped (all 7 components)  
✅ TypeScript strict mode

### 🎯 **AI-Specific**

✅ Token counting & rate tracking  
✅ Cost estimation ($/token)  
✅ Queue position & ETA  
✅ Retry strategies (4 types)  
✅ Batch concurrency control

</td>
<td width="50%">

### ♿ **Accessibility**

✅ WCAG AA compliant (4.5:1 contrast)  
✅ ARIA attributes & roles  
✅ Keyboard navigation support  
✅ Screen reader optimized  
✅ Focus management

### 🎨 **Theming**

✅ CSS custom properties  
✅ Dark mode ready  
✅ Reduced motion support  
✅ High contrast mode  
✅ Fully customizable

</td>
</tr>
</table>

---

## 🛣️ Roadmap

<table>
<tr>
<td width="25%">

### ✅ **Phase 1**

**Core Architecture**

✅ Web Components  
✅ TypeScript setup  
✅ Build pipeline  
✅ Dev environment

</td>
<td width="25%">

### ✅ **Phase 2**

**Components**

✅ StreamProgress  
✅ ModelLoader  
✅ ParameterSlider  
✅ QueueProgress  
✅ RetryProgress  
✅ BatchProgress  
✅ ParameterPanel 🆕

</td>
<td width="25%">

### ✅ **Phase 3**

**Visual Variants & Animations** 🎨

✅ 4 Visual Variants (default, minimal, gradient, glassmorphic)  
✅ 4 Animation Effects (none, striped, pulse, glow)  
✅ 3 Size Variants (compact, default, large)  
✅ Cursor States (auto-updating based on component state)  
✅ 48 additional tests (292 total)

</td>
<td width="25%">

### ✅ **Phase 4**

**Documentation & Examples** 📚

✅ **10 Examples** - Interactive demos  
✅ **7 API Docs** - Complete references  
✅ **Visual Variants Guide** - Customization  
✅ **Theming Guide** - CSS variables  
✅ **Getting Started** - Quick setup

</td>
</tr>
</table>

### 🔮 **Future Components**

- 🔄 **WorkflowProgress** - Multi-step AI pipeline visualization
- 📊 **ConfidenceThreshold** - Adjustable confidence sliders with previews
- 🎯 **ModelComparison** - Side-by-side model performance comparison
- 📈 **MetricsDisplay** - Real-time metrics dashboard for AI operations
- 📤 **FileUploadProgress** - Drag-drop file uploads for AI processing
- 🎵 **TranscriptionProgress** - Real-time audio transcription visualization

---

## �️ Quality & Testing

We maintain enterprise-grade quality standards with multiple layers of automated validation:

<div align="center">

|      Validation      |       Tool       | Status |        Metric         |
| :------------------: | :--------------: | :----: | :-------------------: |
|  🧪 **Unit Tests**   |      Vitest      |   ✅   |   292 tests passing   |
|   📊 **Coverage**    |      Vitest      |   ✅   | 91.34% (target: 80%)  |
|  🔒 **Type Safety**  |    TypeScript    |   ✅   | Strict mode, 0 errors |
| ✨ **Code Quality**  |    SonarQube     |   ✅   |   0 critical issues   |
|  🎨 **Formatting**   |     Prettier     |   ✅   |    Auto-formatted     |
|  ⚡ **Performance**  |    Lighthouse    |   ✅   |      95+ scores       |
| ♿ **Accessibility** | Axe + Lighthouse |   ✅   |      WCAG 2.1 AA      |
|   🔐 **Security**    |    npm audit     |   ✅   |   0 vulnerabilities   |

**[📖 View Full Quality Guide](./docs/quality.md)**

</div>

---

## 📖 Documentation

<div align="center">

|        Resource        | Description                      |                      Link                       |
| :--------------------: | -------------------------------- | :---------------------------------------------: |
| 📘 **Getting Started** | Setup guide for all frameworks   |        [View](./docs/getting-started.md)        |
|  📚 **API Reference**  | Complete API docs (7 components) |               [View](./docs/api/)               |
|    🎮 **Examples**     | 10 interactive examples          |               [View](./examples/)               |
| 🎨 **Visual Variants** | Customization & animations       |        [View](./docs/visual-variants.md)        |
|  🖌️ **Theming Guide**  | CSS variables & brand themes     |            [View](./docs/theming.md)            |
|  ♿ **Accessibility**  | WCAG compliance details          | [View](./docs/getting-started.md#accessibility) |

</div>

---

## 🤝 Contributing

Contributions welcome! This is an open-source project aimed at improving DX for AI application developers.

<div align="center">

**[Report Issues](https://github.com/Maneesh-Relanto/ai-progress-controls/issues)** •
**[Suggest Features](https://github.com/Maneesh-Relanto/ai-progress-controls/discussions)** •
**[Submit PRs](https://github.com/Maneesh-Relanto/ai-progress-controls/pulls)**

</div>

---

## 📄 License

<div align="center">

**MIT License** - See [LICENSE](LICENSE) file for details

Copyright © 2026 Maneesh Thakur

</div>

---

<div align="center">

### **Built with ❤️ for the AI developer community**

⭐ **Star this repo** if you find it useful! ⭐

[![GitHub stars](https://img.shields.io/github/stars/Maneesh-Relanto/ai-progress-controls?style=social)](https://github.com/Maneesh-Relanto/ai-progress-controls)
[![Follow](https://img.shields.io/github/followers/Maneesh-Relanto?style=social)](https://github.com/Maneesh-Relanto)

</div>
