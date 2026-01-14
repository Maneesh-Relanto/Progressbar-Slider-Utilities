# Contributing to AI Progress Controls

Thank you for your interest in contributing! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/ai-progress-controls.git
   cd ai-progress-controls
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-new-feature
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

This will start a dev server at `http://localhost:5173` and automatically open the examples page.

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
npm run test:coverage  # With coverage report
```

### Type Checking

```bash
npm run type-check
```

### Type Checking & Formatting

```bash
npm run type-check
npm run format
```

## Project Structure

```
src/
├── core/              # Core Web Components
│   ├── base/          # Base classes and utilities
│   ├── stream-progress/    # StreamProgress component
│   ├── model-loader/       # ModelLoader component
│   ├── parameter-slider/   # ParameterSlider component
│   ├── parameter-panel/    # ParameterPanel component
│   ├── queue-progress/     # QueueProgress component
│   ├── retry-progress/     # RetryProgress component
│   ├── batch-progress/     # BatchProgress component
│   └── index.ts            # Exports
├── themes/            # CSS themes
└── index.ts           # Main entry point

examples/              # Example applications
├── vanilla/           # Vanilla JS examples (10 demos)
└── index.html         # Examples gallery

docs/                  # Documentation
├── api/               # API documentation (7 component docs)
├── visual-variants.md # Visual customization guide
├── theming.md         # Theming guide
└── getting-started.md # Getting started guide
```

## How to Contribute

### 1. Reporting Bugs

- Use the [GitHub Issues](https://github.com/yourusername/ai-progress-controls/issues) page
- Check if the issue already exists
- Provide a clear title and description
- Include steps to reproduce
- Add code samples if possible
- Mention your environment (browser, OS, version)

### 2. Suggesting Features

- Open an issue with the "enhancement" label
- Clearly describe the feature and its use case
- Explain why it would be valuable
- Provide examples if possible

### 3. Submitting Code

#### Pull Request Process

1. **Ensure your code follows our standards**:
   - TypeScript with strict mode
   - Prettier formatted
   - All tests passing (292 tests)
   - Type definitions included
   - SonarQube clean

2. **Write tests** for new features

3. **Update documentation** if needed

4. **Write a clear commit message**:

   ```
   feat: add temperature slider component

   - Implements temperature slider (0-2 range)
   - Includes visual feedback and presets
   - Adds comprehensive tests
   - Updates documentation
   ```

5. **Submit the PR**:
   - Reference any related issues
   - Describe what your PR does
   - Add screenshots/demos if applicable

#### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### 4. Adding a New Component

If you're creating a new component:

1. Create a new directory under `src/core/`
2. Follow the existing component structure:
   ```
   my-component/
   ├── MyComponent.ts    # Main component class
   ├── types.ts          # TypeScript interfaces
   ├── styles.ts         # Component styles
   └── index.ts          # Exports
   ```
3. Extend the `AIControl` base class
4. Add comprehensive JSDoc comments
5. Create examples in `examples/vanilla/`
6. Write API documentation in `docs/api/`
7. Add tests

### 5. Writing Documentation

- Use clear, concise language
- Provide code examples
- Include TypeScript type annotations
- Add images/diagrams where helpful
- Test all code examples

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Provide explicit types for public APIs
- Use interfaces for configuration objects
- Document all public methods with JSDoc

### Naming Conventions

- **Classes**: PascalCase (`StreamProgress`)
- **Methods**: camelCase (`updateProgress`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TOKENS`)
- **Interfaces**: PascalCase with descriptive names (`StreamProgressConfig`)

### Comments

- Write JSDoc for all public APIs
- Use inline comments for complex logic
- Keep comments up-to-date with code

### Accessibility

- Always include ARIA attributes
- Support keyboard navigation
- Test with screen readers
- Respect `prefers-reduced-motion`

### Performance

- Minimize bundle size
- Use throttling for frequent updates
- Optimize animations
- Avoid unnecessary re-renders

## Testing

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { StreamProgress } from '../src/core/stream-progress';

describe('StreamProgress', () => {
  it('should create instance with default config', () => {
    const progress = new StreamProgress();
    expect(progress).toBeDefined();
  });

  it('should start streaming', () => {
    const progress = new StreamProgress();
    progress.start();
    const state = progress.getState();
    expect(state.isStreaming).toBe(true);
  });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm run test:coverage      # Coverage report
```

## Community

- **GitHub Discussions**: Ask questions, share ideas
- **GitHub Issues**: Report bugs and request features

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- No harassment or discrimination

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:

- Open an issue on GitHub
- Start a discussion on GitHub Discussions

---

Thank you for contributing to AI Progress Controls! 🎉
