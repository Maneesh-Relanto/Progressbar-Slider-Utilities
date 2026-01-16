# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-16

### 🎉 Initial Release

**AI Progress Controls** - Production-ready UI components for AI/ML workflows.

### ✨ Features

#### 7 Core Components

- **StreamProgress** - Real-time token streaming visualization with rate and cost tracking
- **ModelLoader** - Multi-stage model loading progress with download/initialize phases
- **ParameterSlider** - Individual LLM parameter controls with live value display
- **ParameterPanel** - Unified multi-parameter configuration interface
- **QueueProgress** - Queue position tracking with ETA and progress visualization
- **RetryProgress** - Retry attempt tracking with exponential backoff visualization
- **BatchProgress** - Batch processing progress with concurrent item tracking

#### Framework Support

- **Web Components (Core)** - Framework-agnostic, works with Vue, Angular, Svelte, plain HTML
- **React Adapter** - Native React components with hooks, props, and TypeScript support
- **Next.js Adapter** - SSR-safe components with 'use client' directive, App Router ready

#### Customization

- 4 Visual Variants: default, minimal, gradient, glassmorphic
- 4 Animation Effects: none, striped, pulse, glow
- 3 Size Variants: compact, default, large
- 5 Brand Themes: OpenAI, Anthropic, Google AI, Cohere, Dark Mode
- Full CSS variable customization
- Cursor state feedback

#### Developer Experience

- Zero runtime dependencies
- TypeScript-first with complete type definitions
- ~28KB gzipped bundle size
- 292 passing tests with 91.34% coverage
- WCAG AA accessibility compliant
- Comprehensive documentation and examples

#### Quality & Testing

- 100% TypeScript with strict mode
- Vitest unit tests across all components
- SonarQube clean code quality
- Lighthouse 95+ performance scores
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### 📦 Packages

- `ai-progress-controls` - Core Web Components library
- `ai-progress-controls-react` - React adapter
- `ai-progress-controls-next` - Next.js adapter

### 📚 Documentation

- Complete getting started guide
- API documentation for all components
- React and Next.js specific examples
- Theming and customization guides
- Visual variants showcase
- Real-world integration patterns

### 🔗 Links

- [GitHub Repository](https://github.com/Maneesh-Relanto/ai-progress-controls)
- [Documentation](https://github.com/Maneesh-Relanto/ai-progress-controls#readme)
- [Examples](https://github.com/Maneesh-Relanto/ai-progress-controls/tree/main/examples)

---

## Future Releases

See [ROADMAP.md](./confidential/ROADMAP_PUBLIC.md) for planned features and improvements.
