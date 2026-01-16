# Test Applications

This directory contains integration test applications for the AI Progress Controls library across different frameworks. These apps serve as:

- **Integration tests** - Verify the library works correctly in real framework environments
- **Reference implementations** - Show developers how to integrate the library
- **Development testing** - Test new features and fixes in actual use cases

## 📖 **Looking for Examples?**

For copy-paste code examples, see:

- [⚛️ React Examples](../docs/react-examples.md) - Complete React code examples
- [▲ Next.js Examples](../docs/nextjs-examples.md) - Next.js with SSR examples
- [🎮 Vanilla JS Examples](../examples/index.html) - Web Components examples

## Available Test Apps

### React (`/react`)

React 19 + TypeScript + Vite integration test application.

**Setup:**

```bash
cd react
npm install
npm run dev
```

**Features tested:**

- All 7 Web Components wrapped as React components
- Event handling and state management
- Props synchronization
- User interaction handling (sliders, dropdowns)
- Simulation controls

**Access:** http://localhost:5173

---

## Adding New Test Apps

When adding test apps for other frameworks (Angular, Vue, Svelte, etc.):

1. Create a new subdirectory: `test-apps/{framework-name}/`
2. Install the library: `"ai-progress-controls": "file:../.."`
3. Create framework-specific wrappers for Web Components
4. Test all 7 components with interactive demos
5. Update this README with setup instructions

## Why These Test Apps?

While the `examples/` folder shows vanilla JavaScript usage, these test apps demonstrate:

- **Framework integration patterns** - How to wrap Web Components for each framework
- **Type safety** - TypeScript integration and type definitions
- **Build tooling** - Integration with modern build systems (Vite, Webpack, etc.)
- **Real-world usage** - Complete applications with routing, state management, etc.

These apps are committed to help developers understand best practices for using the library in their projects.
