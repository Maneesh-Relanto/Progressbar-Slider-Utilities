# Quality & Testing

We maintain high code quality standards through multiple layers of automated validation.

## Quick Start

### Run All Validations

```bash
npm run validate
```

This runs:

- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Prettier formatting check
- ✅ Unit tests with coverage

### Individual Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix  # Auto-fix issues

# Formatting
npm run format
npm run format:check

# Testing
npm test
npm run test:coverage
npm run test:ui

# Security
npm run security:audit
npm run security:fix

# Accessibility
npm run a11y:check

# Dependencies
npm run deps:check
npm run deps:update
```

## Automated Checks

### Git Hooks

- **Pre-commit:** Auto-format and lint staged files
- **Pre-push:** Run type checks and all tests

### CI/CD Pipeline

Every push runs:

1. Type checking
2. Linting
3. Format validation
4. Unit tests with coverage
5. Security audit
6. Production build
7. Lighthouse performance tests

## Quality Standards

- **Test Coverage:** ≥80% (lines, functions, branches, statements)
- **TypeScript:** Strict mode enabled
- **Lighthouse Scores:** ≥90 for all metrics
- **Security:** Zero high/critical vulnerabilities
- **Accessibility:** WCAG 2.1 Level AA compliant

## Tools

- **TypeScript** - Static type checking
- **ESLint** - Code quality and style
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **SonarQube** - Code quality analysis
- **Lighthouse** - Performance & accessibility
- **Axe** - Accessibility testing
- **npm audit** - Security vulnerabilities
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD automation

## Learn More

For detailed information, see our internal [QA & Validation Guide](../confidential/QA_VALIDATION_GUIDE.md).
