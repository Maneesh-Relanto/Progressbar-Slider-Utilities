# Changelog - ai-progress-controls-react

All notable changes to the React adapter will be documented in this file.

## [0.1.0] - 2026-01-16

### 🎉 Initial Release

React adapter for AI Progress Controls - bringing idiomatic React patterns to Web Components.

### ✨ Features

#### All 7 Components Available

- `<BatchProgress />` - Batch processing with item tracking
- `<ModelLoader />` - Model loading progress with stages
- `<ParameterPanel />` - Multi-parameter configuration panel
- `<ParameterSlider />` - Individual parameter controls
- `<QueueProgress />` - Queue position tracking
- `<RetryProgress />` - Retry attempt visualization
- `<StreamProgress />` - Token streaming progress

#### React-Friendly API

- ✅ **Props-based** - No DOM manipulation required
- ✅ **React lifecycle** - Automatic cleanup and updates
- ✅ **Event callbacks** - React functions instead of addEventListener
- ✅ **TypeScript support** - Full type definitions included
- ✅ **No feedback loops** - Smart state management prevents infinite re-renders
- ✅ **No refs needed** - Simple component API

#### Compatibility

- React 18+ and React 19+ support
- Works with Create React App, Vite, and other bundlers
- Full TypeScript support
- Zero additional dependencies (only peer deps)

### 📦 Installation

```bash
npm install ai-progress-controls ai-progress-controls-react
```

### 📚 Documentation

- Complete component API reference in README
- TypeScript type definitions included
- React-specific examples and patterns
- Integration guides for common use cases

### 🔗 Links

- [React Adapter Documentation](https://github.com/Maneesh-Relanto/ai-progress-controls/tree/main/adapters/react)
- [React Examples](https://github.com/Maneesh-Relanto/ai-progress-controls/blob/main/docs/react-examples.md)
- [Main Repository](https://github.com/Maneesh-Relanto/ai-progress-controls)

---

## Dependencies

- `ai-progress-controls`: ^0.1.0 (peer dependency)
- `react`: ^18.0.0 || ^19.0.0 (peer dependency)
- `react-dom`: ^18.0.0 || ^19.0.0 (peer dependency)
