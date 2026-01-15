# Test React App for AI Progress Controls

This is a comprehensive test application for the **AI Progress Controls** library, designed to validate all 7 components in a real React environment.

## 🎯 Purpose

Testing all 7 components in production-like scenarios:

1. **Batch Progress** - Multi-item batch processing with status tracking
2. **Model Loader** - AI model loading states with progress indicators
3. **Parameter Panel** - Multi-parameter configuration interface
4. **Parameter Slider** - Individual parameter control with live updates
5. **Queue Progress** - Queue position tracking and visualization
6. **Retry Progress** - Retry mechanism display with attempt counting
7. **Stream Progress** - Streaming response progress with token tracking

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`

## 🧪 Testing Each Component

Navigate through the tabs to test each component individually. Each section includes:

- **Live component demonstration** - Real-time rendering of the component
- **Interactive controls** - Buttons to trigger simulations and state changes
- **State information display** - Current values and component state
- **Simulation buttons** - Automated testing of animations and transitions

## 📋 Test Scenarios

### Batch Progress

- Start batch simulation to see progress through multiple items
- Observe status changes (pending → in-progress → completed)
- Test progress bar updates

### Model Loader

- Simulate model download and initialization phases
- Watch progress indicators and stage transitions
- Test loading states and completion

### Parameter Panel

- Adjust multiple parameters simultaneously
- Test value constraints (min/max)
- Observe real-time updates
- View JSON output of parameter values

### Parameter Slider

- Use preset buttons for quick value changes
- Drag slider for granular control
- Test step increments
- Verify value display and descriptions

### Queue Progress

- Simulate queue progression
- Watch position updates
- Test manual position changes
- See estimated wait information

### Retry Progress

- Simulate retry attempts
- Track attempt counting
- Test max retry limits
- Observe retry indicators

### Stream Progress

- Watch streaming progress simulation
- Monitor token generation
- Test progress percentage updates
- Verify smooth animations

## 🎨 Features

- **Tab-based navigation** - Easy switching between component tests
- **Simulation controls** - Automated testing without manual intervention
- **Real-time state monitoring** - Live display of component state
- **Responsive design** - Works on desktop and mobile devices
- **Dark mode support** - Respects system color scheme preferences
- **Clean UI** - Focus on component testing without distractions

## 🛠️ Technical Details

- Built with **React 18** and **TypeScript**
- Uses **Vite** for fast development and building
- Imports library components directly from source
- Includes comprehensive styling for test scenarios
- Hot module replacement (HMR) for instant updates

## 📖 Component Import

Components are imported directly from the source code:

```typescript
import { BatchProgress } from '../../src/core/batch-progress';
import { ModelLoader } from '../../src/core/model-loader';
// ... etc
```

This allows testing the latest source code without needing to rebuild the library package.

## 🔍 Validation

This test app validates:

- ✅ Component rendering in React environment
- ✅ Props handling and type safety
- ✅ State management and updates
- ✅ Event handlers and callbacks
- ✅ Animations and transitions
- ✅ Responsive behavior
- ✅ Accessibility features
- ✅ Dark mode compatibility

## 📝 Notes

- All components are tested with realistic use cases
- Simulations auto-reset for repeated testing
- State displays help verify component behavior
- Each component can be tested independently
  {
  files: ['**/*.{ts,tsx}'],
  extends: [
  // Other configs...

        // Remove tseslint.configs.recommended and replace with this
        tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        tseslint.configs.stylisticTypeChecked,

        // Other configs...
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },

  },
  ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
