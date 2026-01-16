# 📦 Complete Installation & Setup Guide

## Table of Contents

- [Installation Options](#installation-options)
- [React Setup](#react-setup)
- [Next.js Setup](#nextjs-setup)
- [TypeScript Configuration](#typescript-configuration)
- [Troubleshooting](#troubleshooting)
- [Version Management](#version-management)

---

## 🚀 Installation Options

### ⚛️ React Projects

**Step 1: Install packages**

```bash
npm install ai-progress-controls ai-progress-controls-react
```

**Step 2: Import and use**

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

function App() {
  return (
    <StreamProgress
      tokensGenerated={500}
      maxTokens={2000}
      showRate={true}
      showCost={true}
      costPerToken={0.00003}
    />
  );
}
```

**That's it!** No CSS imports, no config needed. Just import and use.

---

### ▲ Next.js Projects

**Step 1: Install packages**

```bash
npm install ai-progress-controls ai-progress-controls-next
```

**Step 2: Use in App Router**

```tsx
// app/page.tsx
import { StreamProgress } from 'ai-progress-controls-next';

export default function Page() {
  return <StreamProgress tokensGenerated={500} maxTokens={2000} />;
}
```

**Step 3: For Client Components**

```tsx
'use client';

import { StreamProgress } from 'ai-progress-controls-next';
import { useState } from 'react';

export default function ClientComponent() {
  const [tokens, setTokens] = useState(0);

  return <StreamProgress tokensGenerated={tokens} />;
}
```

**SSR Support**: All components work with Server-Side Rendering out of the box.

---

### 🌐 Other Frameworks (Vue, Angular, Svelte)

**Comprehensive Guides Available:**

- [🖖 Vue 3 Complete Guide](./vue-guide.md)
- [🅰️ Angular Complete Guide](./angular-guide.md)
- [🔥 Svelte Complete Guide](./svelte-guide.md)

**Step 1: Install core package**

```bash
npm install ai-progress-controls
```

**Step 2: Import CSS**

```typescript
import 'ai-progress-controls/dist/style.css';
```

**Step 3: Register components**

```typescript
import { defineCustomElements } from 'ai-progress-controls';

defineCustomElements();
```

**Step 4: Use as custom elements**

```html
<stream-progress tokens-generated="500" max-tokens="2000" show-rate="true"></stream-progress>
```

---

## ⚛️ React Setup

### Create React App

```bash
# Create new project
npx create-react-app my-app --template typescript
cd my-app

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-react

# Start using in src/App.tsx
```

### Vite + React

```bash
# Create new project
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install dependencies
npm install

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-react

# Start dev server
npm run dev
```

### Example Component

```tsx
// src/components/AIStream.tsx
import { useState } from 'react';
import { StreamProgress } from 'ai-progress-controls-react';

export default function AIStream() {
  const [tokens, setTokens] = useState(0);

  const startStream = async () => {
    // Simulate streaming
    for (let i = 0; i <= 2000; i += 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setTokens(i);
    }
  };

  return (
    <div>
      <StreamProgress
        tokensGenerated={tokens}
        maxTokens={2000}
        showRate={true}
        showCost={true}
        costPerToken={0.00003}
      />
      <button onClick={startStream}>Start Stream</button>
    </div>
  );
}
```

---

## ▲ Next.js Setup

### Create Next.js App

```bash
# Create new project
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-next

# Start dev server
npm run dev
```

### App Router Example

```tsx
// app/ai-demo/page.tsx
'use client';

import { useState } from 'react';
import { StreamProgress, ModelLoader, ParameterSlider } from 'ai-progress-controls-next';

export default function AIDemoPage() {
  const [tokens, setTokens] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadModel = async () => {
    setIsLoading(true);
    setProgress(0);

    // Simulate model loading
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsLoading(false);
  };

  const startStream = async () => {
    setTokens(0);

    // Simulate token streaming
    for (let i = 0; i <= 2000; i += 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setTokens(i);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">AI Progress Demo</h1>

      {/* Model Loading */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Load Model</h2>
        <ModelLoader
          isLoading={isLoading}
          progress={progress}
          modelName="GPT-4"
          stage={progress < 50 ? 'download' : 'initialize'}
        />
        <button
          onClick={loadModel}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isLoading ? 'Loading...' : 'Load Model'}
        </button>
      </section>

      {/* Parameter Control */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Configure Parameters</h2>
        <ParameterSlider
          value={temperature}
          min={0}
          max={2}
          step={0.1}
          label="Temperature"
          description="Controls randomness in responses"
          onChange={setTemperature}
        />
        <p className="mt-2 text-sm">Current: {temperature}</p>
      </section>

      {/* Token Streaming */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Stream Tokens</h2>
        <StreamProgress
          tokensGenerated={tokens}
          maxTokens={2000}
          showRate={true}
          showCost={true}
          costPerToken={0.00003}
        />
        <button
          onClick={startStream}
          disabled={tokens > 0 && tokens < 2000}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          {tokens > 0 && tokens < 2000 ? 'Streaming...' : 'Start Stream'}
        </button>
      </section>
    </div>
  );
}
```

### Server Component Usage

```tsx
// app/page.tsx (Server Component)
import { ModelLoader } from 'ai-progress-controls-next';

export default function HomePage() {
  // Server component can render static UI
  return (
    <div>
      <h1>AI Dashboard</h1>
      <ModelLoader isLoading={false} progress={100} modelName="GPT-4" stage="ready" />
    </div>
  );
}
```

---

## 📘 TypeScript Configuration

### Automatic Type Definitions

TypeScript types are included automatically:

```tsx
import { StreamProgress } from 'ai-progress-controls-react';
// TypeScript will provide IntelliSense for all props
```

### Type Imports

```tsx
import { StreamProgress, type StreamProgressProps } from 'ai-progress-controls-react';

// Use prop types in your code
const config: StreamProgressProps = {
  tokensGenerated: 500,
  maxTokens: 2000,
  showRate: true,
};

return <StreamProgress {...config} />;
```

### Custom Wrapper Components

```tsx
import { StreamProgress, type StreamProgressProps } from 'ai-progress-controls-react';

interface CustomStreamProps extends Partial<StreamProgressProps> {
  apiKey: string;
  onComplete?: () => void;
}

export function CustomStream({ apiKey, onComplete, ...props }: CustomStreamProps) {
  // Your custom logic
  return <StreamProgress {...props} />;
}
```

---

## 🎨 Theming & Customization

### CSS Variables

```css
/* In your global CSS file */
:root {
  /* Progress bar colors */
  --progress-bar-height: 12px;
  --progress-fill-color: #3b82f6;
  --progress-bg-color: #e5e7eb;
  --progress-border-radius: 12px;

  /* Text colors */
  --progress-text-color: #1f2937;
  --progress-label-color: #6b7280;

  /* Dark mode */
  --progress-bg-dark: #374151;
  --progress-text-dark: #f9fafb;
}
```

### Built-in Themes

```tsx
import { StreamProgress } from 'ai-progress-controls-react';

// OpenAI Theme
<StreamProgress theme="openai" />

// Anthropic Theme
<StreamProgress theme="anthropic" />

// Google AI Theme
<StreamProgress theme="google-ai" />

// Dark Theme
<StreamProgress theme="dark" />
```

### Visual Variants

```tsx
// Minimal style
<StreamProgress variant="minimal" />

// Gradient effect
<StreamProgress variant="gradient" />

// Glassmorphic style
<StreamProgress variant="glassmorphic" />
```

---

## 🔧 Troubleshooting

### Issue: Types not working in TypeScript

**Solution**: Ensure you're importing from the correct package:

```tsx
// ✅ Correct
import { StreamProgress } from 'ai-progress-controls-react';

// ❌ Wrong
import { StreamProgress } from 'ai-progress-controls';
```

### Issue: Components not rendering in Next.js

**Solution**: Add `'use client'` directive for interactive components:

```tsx
'use client';

import { useState } from 'react';
import { StreamProgress } from 'ai-progress-controls-next';
```

### Issue: Styles not showing

**Solution (Web Components only)**:

```typescript
// Import CSS for web components
import 'ai-progress-controls/dist/style.css';
```

**React/Next.js**: Styles are included automatically, no import needed.

### Issue: Module not found

**Solution**: Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build errors in production

**Solution**: Ensure peer dependencies are installed:

```bash
npm install react react-dom --save
```

---

## 📦 Version Management

### Check Installed Version

```bash
npm list ai-progress-controls
npm list ai-progress-controls-react
npm list ai-progress-controls-next
```

### Update to Latest

```bash
# Update core package
npm update ai-progress-controls

# Update React adapter
npm update ai-progress-controls-react

# Update Next.js adapter
npm update ai-progress-controls-next
```

### Install Specific Version

```bash
npm install ai-progress-controls@0.1.0
npm install ai-progress-controls-react@0.1.0
npm install ai-progress-controls-next@0.1.0
```

### Lock to Current Version

In `package.json`:

```json
{
  "dependencies": {
    "ai-progress-controls": "0.1.0",
    "ai-progress-controls-react": "0.1.0"
  }
}
```

---

## 🚀 Complete Example Projects

### Minimal React Example

```bash
# Create project
npm create vite@latest my-ai-app -- --template react-ts
cd my-ai-app
npm install

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-react

# Replace src/App.tsx with your code
# Start dev server
npm run dev
```

### Production Next.js Setup

```bash
# Create production-ready app
npx create-next-app@latest my-ai-platform --typescript --tailwind --app
cd my-ai-platform

# Install AI Progress Controls
npm install ai-progress-controls ai-progress-controls-next

# Add environment variables
echo "OPENAI_API_KEY=your-key" > .env.local

# Start development
npm run dev
```

---

## 📚 Next Steps

- **[React Examples](./react-examples.md)** - 7 complete React examples
- **[Next.js Examples](./nextjs-examples.md)** - Server Actions, streaming patterns
- **[API Reference](./api/)** - Complete prop documentation
- **[Theming Guide](./theming.md)** - Custom themes and CSS variables
- **[Visual Variants](./visual-variants.md)** - Styling options

---

## 💡 Pro Tips

1. **Start Simple**: Begin with one component, add features gradually
2. **Use TypeScript**: Get IntelliSense and type safety automatically
3. **Leverage Hooks**: React adapter provides `useStreamProgress` and other hooks
4. **Check Examples**: Copy-paste from [examples/](../examples/) to get started faster
5. **Read Tests**: See [src/\*\*/**tests**/](../src/__tests__/) for usage patterns

---

## 🆘 Need Help?

- 📖 [Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/Maneesh-Relanto/ai-progress-controls/issues)
- 📝 [Contributing Guide](../CONTRIBUTING.md)
