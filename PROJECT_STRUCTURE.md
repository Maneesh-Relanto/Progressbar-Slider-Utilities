# Project Structure

```
ai-progress-controls/
│
├── src/                          # Source code
│   ├── core/                     # Core Web Components (framework-agnostic)
│   │   ├── base/                 # Base classes and utilities
│   │   │   ├── AIControl.ts      # Base class for all controls
│   │   │   ├── theme.ts          # Theme system
│   │   │   └── utils.ts          # Helper functions
│   │   │
│   │   ├── stream-progress/      # Token streaming progress
│   │   │   ├── StreamProgress.ts
│   │   │   ├── stream-progress.css
│   │   │   └── index.ts
│   │   │
│   │   ├── model-loader/         # Model loading progress
│   │   │   ├── ModelLoader.ts
│   │   │   ├── model-loader.css
│   │   │   └── index.ts
│   │   │
│   │   ├── batch-progress/       # Batch operation progress
│   │   │   ├── BatchProgress.ts
│   │   │   ├── batch-progress.css
│   │   │   └── index.ts
│   │   │
│   │   ├── queue-position/       # Queue position indicator
│   │   │   ├── QueuePosition.ts
│   │   │   ├── queue-position.css
│   │   │   └── index.ts
│   │   │
│   │   ├── param-slider/         # LLM parameter sliders
│   │   │   ├── ParamSlider.ts
│   │   │   ├── param-slider.css
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts              # Core exports
│   │
│   ├── adapters/                 # Framework adapters
│   │   ├── react/
│   │   │   ├── StreamProgress.tsx
│   │   │   ├── ModelLoader.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── vue/
│   │   │   ├── StreamProgress.vue
│   │   │   ├── ModelLoader.vue
│   │   │   └── index.ts
│   │   │
│   │   └── svelte/
│   │       ├── StreamProgress.svelte
│   │       ├── ModelLoader.svelte
│   │       └── index.ts
│   │
│   ├── themes/                   # Pre-built themes
│   │   ├── default.css
│   │   ├── dark.css
│   │   ├── glassmorphism.css
│   │   └── minimal.css
│   │
│   └── index.ts                  # Main entry point
│
├── examples/                     # Integration examples
│   ├── vanilla/                  # Plain JavaScript examples
│   │   ├── openai-streaming.html
│   │   ├── batch-processing.html
│   │   └── model-loading.html
│   │
│   ├── react/                    # React examples
│   │   ├── ChatInterface.tsx
│   │   └── ImageGenerator.tsx
│   │
│   ├── vue/                      # Vue examples
│   │   └── AIAssistant.vue
│   │
│   └── integrations/             # API integration examples
│       ├── openai/
│       ├── anthropic/
│       └── huggingface/
│
├── docs/                         # Documentation
│   ├── getting-started.md
│   ├── api/
│   │   ├── stream-progress.md
│   │   ├── model-loader.md
│   │   └── param-slider.md
│   ├── guides/
│   │   ├── theming.md
│   │   ├── accessibility.md
│   │   └── custom-styling.md
│   └── examples/
│
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── confidential/                 # Private files (gitignored)
│   ├── api-keys.txt
│   ├── dev-notes.md
│   └── client-configs/
│
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md          # This file
├── package.json
├── tsconfig.json
├── LICENSE
└── CHANGELOG.md
```

## Directory Purposes

### `/src/core/`
Pure Web Components written in TypeScript. No framework dependencies. These are the foundation of the library.

**Design Principles:**
- Extend `HTMLElement` for native web component behavior
- Use Shadow DOM for style encapsulation
- Emit custom events for interactivity
- Accept configuration via attributes and properties
- Fully typed with TypeScript

### `/src/adapters/`
Thin wrappers around core components for popular frameworks. These make the components feel native to each framework.

**Purpose:**
- Provide idiomatic APIs for React, Vue, Svelte
- Handle framework-specific reactivity
- Maintain type safety
- Keep bundle size minimal

### `/src/themes/`
CSS files providing complete visual themes. Users can import one or create their own.

**Includes:**
- Color schemes (CSS custom properties)
- Typography
- Spacing and sizing
- Animation curves
- Dark/light mode variants

### `/examples/`
Working, copy-paste-ready code examples showing real-world usage.

**Focus on:**
- Common use cases (chatbots, image gen, batch processing)
- Integration with popular AI APIs
- Best practices
- Accessibility considerations

### `/docs/`
Comprehensive documentation for developers using the library.

**Sections:**
- API reference for each component
- Integration guides
- Theming and customization
- Accessibility guidelines
- Migration guides

### `/confidential/`
**Gitignored** - Store sensitive data here:
- API keys for testing
- Client-specific configurations
- Private development notes
- Credentials and secrets

## Component Architecture

Each core component follows this pattern:

```
component-name/
├── ComponentName.ts       # Main component class
├── component-name.css     # Component styles
├── types.ts              # TypeScript interfaces
└── index.ts              # Public exports
```

## Build Output Structure

When built, the library generates:

```
dist/
├── core/                 # Vanilla JS/Web Components
│   ├── stream-progress.js
│   ├── model-loader.js
│   └── ...
├── react/                # React adapter
├── vue/                  # Vue adapter
├── svelte/               # Svelte adapter
├── themes/               # CSS files
└── types/                # TypeScript definitions
```

## Key Design Decisions

1. **Web Components First** - Universal compatibility, future-proof
2. **TypeScript** - Type safety for better DX
3. **CSS Variables** - Easy theming without JavaScript
4. **Minimal Dependencies** - Keep bundle size small
5. **Progressive Enhancement** - Works without JavaScript (where possible)
6. **Accessibility Built-in** - Not an afterthought

## Next Steps

1. ✅ Create project structure
2. ✅ Define problem statement and solution
3. ⏳ Set up build tooling (TypeScript, bundler)
4. ⏳ Create base component class
5. ⏳ Implement first component (StreamProgress)
6. ⏳ Write tests and documentation
