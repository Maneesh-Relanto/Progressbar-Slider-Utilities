# Changelog - ai-progress-controls-next

All notable changes to the Next.js adapter will be documented in this file.

## [0.1.0] - 2026-01-16

### 🎉 Initial Release

Next.js adapter for AI Progress Controls - SSR-safe components for modern Next.js applications.

### ✨ Features

#### All 7 Components Available

- `<BatchProgress />` - Batch processing with item tracking
- `<ModelLoader />` - Model loading progress with stages
- `<ParameterPanel />` - Multi-parameter configuration panel
- `<ParameterSlider />` - Individual parameter controls
- `<QueueProgress />` - Queue position tracking
- `<RetryProgress />` - Retry attempt visualization
- `<StreamProgress />` - Token streaming progress

#### Next.js Optimized

- ✅ **SSR-safe** - Works with server-side rendering
- ✅ **'use client' directive** - Properly marked as client components
- ✅ **No hydration errors** - Clean server/client boundary
- ✅ **App Router ready** - Full Next.js 13+ App Router support
- ✅ **Pages Router support** - Works with traditional Next.js routing
- ✅ **Zero configuration** - No dynamic imports needed

#### React-Friendly API

- Props-based interface (no DOM manipulation)
- React lifecycle integration with automatic cleanup
- Event callbacks instead of addEventListener
- Full TypeScript support with type definitions
- No feedback loops or infinite re-renders

#### Compatibility

- Next.js 14, 15, and 16+ support
- React 18+ and React 19+ compatible
- Works with both App Router and Pages Router
- Full TypeScript support

### 📦 Installation

```bash
npm install ai-progress-controls ai-progress-controls-next
```

### 📚 Documentation

- Complete component API reference in README
- TypeScript type definitions included
- Next.js-specific examples (App Router, Pages Router)
- SSR patterns and best practices
- Server Actions integration examples
- API route streaming examples

### 🔗 Links

- [Next.js Adapter Documentation](https://github.com/Maneesh-Relanto/ai-progress-controls/tree/main/adapters/next)
- [Next.js Examples](https://github.com/Maneesh-Relanto/ai-progress-controls/blob/main/docs/nextjs-examples.md)
- [Main Repository](https://github.com/Maneesh-Relanto/ai-progress-controls)

---

## Dependencies

- `ai-progress-controls`: ^0.1.0 (peer dependency)
- `react`: ^18.0.0 || ^19.0.0 (peer dependency)
- `react-dom`: ^18.0.0 || ^19.0.0 (peer dependency)
- `next`: ^14.0.0 || ^15.0.0 || ^16.0.0 (peer dependency)
