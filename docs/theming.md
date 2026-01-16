# Theming Guide

Complete guide to customizing AI Progress Controls for your brand and design system.

## Table of Contents

- [Quick Start](#quick-start)
- [CSS Custom Properties](#css-custom-properties)
- [Size Variants](#size-variants)
- [Brand Integration Examples](#brand-integration-examples)
- [Color Schemes](#color-schemes)
- [Advanced Customization](#advanced-customization)

---

## Quick Start

All components use CSS custom properties (CSS variables) for theming. You can customize them globally or per-component:

```css
/* Global theming - applies to all components */
:root {
  --ai-primary-color: #3b82f6;
  --ai-background-color: #ffffff;
  --ai-text-color: #1f2937;
  --ai-border-radius: 8px;
}

/* Component-specific theming */
stream-progress {
  --ai-primary-color: #10b981;
}
```

```html
<!-- Inline theming -->
<stream-progress style="--ai-primary-color: #ef4444;"></stream-progress>
```

---

## CSS Custom Properties

### Core Theme Variables

All components support these base theme variables:

| Variable                | Default      | Description                                      |
| ----------------------- | ------------ | ------------------------------------------------ |
| `--ai-primary-color`    | `#3b82f6`    | Primary accent color (progress bars, highlights) |
| `--ai-secondary-color`  | `#10b981`    | Secondary accent color (success states)          |
| `--ai-background-color` | `#ffffff`    | Component background                             |
| `--ai-text-color`       | `#1f2937`    | Primary text color                               |
| `--ai-border-color`     | `#e5e7eb`    | Border color                                     |
| `--ai-border-radius`    | `8px`        | Border radius                                    |
| `--ai-font-family`      | System fonts | Font family                                      |
| `--ai-font-size`        | `14px`       | Base font size                                   |
| `--ai-spacing`          | `12px`       | Base spacing unit                                |

### Component-Specific Variables

#### StreamProgress

```css
stream-progress {
  --ai-primary-color: #3b82f6; /* Streaming indicator color */
  --ai-secondary-color: #10b981; /* Completion color */
  --ai-background-color: #ffffff;
  --ai-text-color: #1f2937;
  --ai-border-color: #e5e7eb;
  --ai-border-radius: 8px;
  --ai-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ai-font-size: 14px;
  --ai-spacing: 12px;
}
```

#### BatchProgress

```css
batch-progress {
  --ai-primary-color: #3b82f6; /* Processing color */
  --ai-success-color: #10b981; /* Completed items color */
  --ai-error-color: #ef4444; /* Failed items color */
  --ai-warning-color: #f59e0b; /* Warning color */
  --ai-background-color: #ffffff;
  --ai-border-color: #e5e7eb;
  --ai-border-radius: 8px;
  --ai-spacing: 12px;
}
```

#### ModelLoader

```css
model-loader {
  --ai-primary-color: #3b82f6; /* Active stage color */
  --ai-secondary-color: #10b981; /* Completed stage color */
  --ai-error-color: #ef4444; /* Error state color */
  --ai-warning-color: #f59e0b; /* Warning state color */
  --ai-background-color: #ffffff;
  --ai-text-color: #1f2937;
  --ai-border-color: #e5e7eb;
  --ai-border-radius: 8px;
  --ai-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ai-font-size: 14px;
  --ai-spacing: 12px;
}
```

#### QueueProgress

```css
queue-progress {
  --queue-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --queue-font-size: 14px;
  --queue-text: #e4e4e7; /* Text color */
  --queue-background: #1a1a2e; /* Dark background */
  --queue-border: #27273a; /* Border color */
  --queue-border-radius: 12px;
  --queue-padding: 24px;
  --transition-speed: 0.3s;
}
```

#### RetryProgress

```css
retry-progress {
  --retry-primary: #f59e0b; /* Warning/retry color */
  --retry-success: #10b981; /* Success color */
  --retry-error: #ef4444; /* Error color */
  --retry-background: #1f2937; /* Dark background */
  --retry-text: #f3f4f6; /* Light text */
  --retry-text-secondary: #9ca3af; /* Secondary text */
  --retry-border: #374151; /* Border color */
}
```

#### ParameterSlider

```css
parameter-slider {
  --ai-slider-bg: #1f2937; /* Slider background */
  --ai-slider-text: #f9fafb; /* Text color */
  --ai-primary-color: #3b82f6; /* Thumb and fill color */
  --ai-background-color: #ffffff;
  --ai-text-color: #1f2937;
  --ai-border-color: #e5e7eb;
  --ai-border-radius: 8px;
  --ai-font-size: 14px;
  --ai-spacing: 12px;
}
```

---

## Size Variants

All components support three size variants via the `size` attribute:

### Compact Size

Optimized for mobile and space-constrained layouts:

```html
<stream-progress size="compact"></stream-progress>
<batch-progress size="compact"></batch-progress>
<model-loader size="compact"></model-loader>
```

**Characteristics:**

- Reduced padding (8px vs 12px)
- Smaller font size (12px vs 14px)
- Compact progress bars (6px vs 8px height)
- Tighter spacing

### Default Size

Standard size for most use cases:

```html
<stream-progress></stream-progress> <batch-progress size="default"></batch-progress>
```

**Characteristics:**

- Normal padding (12px)
- Standard font size (14px)
- Regular progress bars (8px height)

### Large Size

Prominent display for dashboards and key metrics:

```html
<stream-progress size="large"></stream-progress>
<batch-progress size="large"></batch-progress>
<model-loader size="large"></model-loader>
```

**Characteristics:**

- Increased padding (16px)
- Larger font size (16px)
- Thicker progress bars (10px height)
- More spacious layout

### Programmatic Size Control

```typescript
const progress = new StreamProgress({
  size: 'compact', // 'compact' | 'default' | 'large'
  message: 'Processing...',
});

// Change size dynamically
progress.setAttribute('size', 'large');
```

---

## Brand Integration Examples

### OpenAI Theme

```css
/* OpenAI-inspired green theme */
:root {
  --ai-primary-color: #10a37f; /* OpenAI green */
  --ai-secondary-color: #19c37d; /* Lighter green */
  --ai-background-color: #ffffff;
  --ai-text-color: #2d333a;
  --ai-border-color: #e5e7eb;
  --ai-border-radius: 6px;
  --ai-font-family: 'Söhne', 'Helvetica Neue', Arial, sans-serif;
}
```

```html
<stream-progress style="--ai-primary-color: #10a37f; --ai-border-radius: 6px;"> </stream-progress>
```

### Anthropic Theme

```css
/* Anthropic-inspired warm theme */
:root {
  --ai-primary-color: #d97757; /* Anthropic orange */
  --ai-secondary-color: #e88c6a; /* Lighter orange */
  --ai-background-color: #faf8f5; /* Warm background */
  --ai-text-color: #1a1818;
  --ai-border-color: #e8dfd2;
  --ai-border-radius: 8px;
}
```

### Google AI Theme

```css
/* Google AI-inspired multi-color theme */
:root {
  --ai-primary-color: #4285f4; /* Google blue */
  --ai-secondary-color: #34a853; /* Google green */
  --ai-error-color: #ea4335; /* Google red */
  --ai-warning-color: #fbbc04; /* Google yellow */
  --ai-background-color: #ffffff;
  --ai-text-color: #202124;
  --ai-border-radius: 8px;
  --ai-font-family: 'Google Sans', 'Roboto', Arial, sans-serif;
}
```

### Cohere Theme

```css
/* Cohere-inspired dark theme */
:root {
  --ai-primary-color: #d18ee2; /* Cohere purple */
  --ai-secondary-color: #9d5db8; /* Darker purple */
  --ai-background-color: #1a1625; /* Dark purple background */
  --ai-text-color: #f4f1f8;
  --ai-border-color: #342d42;
  --ai-border-radius: 12px;
}
```

### Hugging Face Theme

```css
/* Hugging Face-inspired playful theme */
:root {
  --ai-primary-color: #ff9d00; /* HF orange */
  --ai-secondary-color: #ffb037; /* Lighter orange */
  --ai-background-color: #ffffff;
  --ai-text-color: #0f172a;
  --ai-border-color: #e2e8f0;
  --ai-border-radius: 8px;
  --ai-font-family: 'IBM Plex Sans', sans-serif;
}
```

---

## Color Schemes

### Light Mode (Default)

```css
:root {
  --ai-primary-color: #3b82f6;
  --ai-secondary-color: #10b981;
  --ai-background-color: #ffffff;
  --ai-text-color: #1f2937;
  --ai-border-color: #e5e7eb;
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --ai-primary-color: #60a5fa; /* Lighter blue for dark bg */
    --ai-secondary-color: #34d399; /* Lighter green */
    --ai-background-color: #1f2937; /* Dark background */
    --ai-text-color: #f9fafb; /* Light text */
    --ai-border-color: #374151; /* Darker border */
  }
}
```

### High Contrast

```css
/* High contrast theme for accessibility */
:root {
  --ai-primary-color: #0066cc; /* WCAG AA compliant blue */
  --ai-secondary-color: #008844; /* WCAG AA compliant green */
  --ai-background-color: #ffffff;
  --ai-text-color: #000000;
  --ai-border-color: #000000;
  --ai-border-radius: 4px;
}
```

### Corporate/Professional

```css
/* Neutral, professional theme */
:root {
  --ai-primary-color: #475569; /* Slate gray */
  --ai-secondary-color: #0ea5e9; /* Professional blue */
  --ai-background-color: #f8fafc;
  --ai-text-color: #0f172a;
  --ai-border-color: #cbd5e1;
  --ai-border-radius: 6px;
  --ai-font-family: 'Inter', -apple-system, sans-serif;
}
```

---

## Advanced Customization

### Component-Level Theming

Apply different themes to different components:

```html
<style>
  /* OpenAI theme for streaming */
  stream-progress {
    --ai-primary-color: #10a37f;
  }

  /* Anthropic theme for batch processing */
  batch-progress {
    --ai-primary-color: #d97757;
  }

  /* Custom theme for model loading */
  model-loader {
    --ai-primary-color: #8b5cf6;
    --ai-border-radius: 12px;
  }
</style>

<stream-progress></stream-progress>
<batch-progress></batch-progress>
<model-loader></model-loader>
```

### Dynamic Theming with JavaScript

```typescript
// Switch theme dynamically
function applyTheme(component: HTMLElement, theme: 'openai' | 'anthropic' | 'dark') {
  const themes = {
    openai: {
      '--ai-primary-color': '#10a37f',
      '--ai-background-color': '#ffffff',
      '--ai-text-color': '#2d333a',
    },
    anthropic: {
      '--ai-primary-color': '#d97757',
      '--ai-background-color': '#faf8f5',
      '--ai-text-color': '#1a1818',
    },
    dark: {
      '--ai-primary-color': '#60a5fa',
      '--ai-background-color': '#1f2937',
      '--ai-text-color': '#f9fafb',
    },
  };

  const themeVars = themes[theme];
  Object.entries(themeVars).forEach(([key, value]) => {
    component.style.setProperty(key, value);
  });
}

// Usage
const progress = document.querySelector('stream-progress');
applyTheme(progress, 'openai');
```

### Shadow DOM Styling

Components use Shadow DOM for style encapsulation. To style internal elements, use CSS custom properties:

```css
/* ❌ Won't work - can't penetrate Shadow DOM */
stream-progress .progress-bar {
  background: red;
}

/* ✅ Correct - use CSS variables */
stream-progress {
  --ai-primary-color: red;
}
```

### Custom Animation Speed

```css
queue-progress {
  --transition-speed: 0.5s; /* Slower animations */
}

retry-progress {
  --transition-speed: 0.1s; /* Faster animations */
}
```

---

## Best Practices

### 1. Maintain Contrast Ratios

Ensure text/background combinations meet WCAG AA standards (4.5:1 contrast ratio):

```css
/* Good - high contrast */
:root {
  --ai-primary-color: #0066cc;
  --ai-background-color: #ffffff;
}

/* Bad - low contrast */
:root {
  --ai-primary-color: #dddddd;
  --ai-background-color: #ffffff;
}
```

### 2. Consistent Border Radius

Keep border radius consistent across components:

```css
:root {
  --ai-border-radius: 8px; /* Apply to all components */
}
```

### 3. Use System Font Stack

For better performance and native feel:

```css
:root {
  --ai-font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

### 4. Test Dark Mode

Always test your theme in both light and dark modes:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Adjust colors for dark mode */
  }
}
```

### 5. Respect Reduced Motion

Consider users with motion sensitivity:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-speed: 0s;
  }
}
```

---

## Examples

### Full-Page Theme Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Global OpenAI theme */
      :root {
        --ai-primary-color: #10a37f;
        --ai-secondary-color: #19c37d;
        --ai-background-color: #ffffff;
        --ai-text-color: #2d333a;
        --ai-border-color: #e5e7eb;
        --ai-border-radius: 6px;
        --ai-font-family: 'Söhne', 'Helvetica Neue', Arial, sans-serif;
      }

      body {
        font-family: var(--ai-font-family);
        background: #f7f7f8;
        padding: 2rem;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
    </style>
    <script type="module" src="/dist/index.es.js"></script>
  </head>
  <body>
    <div class="container">
      <stream-progress size="large"></stream-progress>
      <batch-progress size="default"></batch-progress>
      <model-loader size="compact"></model-loader>
    </div>
  </body>
</html>
```

---

## Troubleshooting

### Theme Not Applying

1. **Check CSS variable naming** - Must match exactly (case-sensitive)
2. **Verify specificity** - Inline styles override CSS rules
3. **Clear browser cache** - Old styles may be cached
4. **Check Shadow DOM** - Can't style internal elements directly

### Colors Look Different

1. **Check color format** - Use hex (#3b82f6) or rgb(59, 130, 246)
2. **Verify browser support** - CSS variables work in modern browsers
3. **Test in different browsers** - Color rendering may vary

### Size Variant Not Working

1. **Check attribute value** - Must be 'compact', 'default', or 'large'
2. **Verify component support** - All components support size variants
3. **Test programmatically** - Try `component.setAttribute('size', 'large')`

---

For more information, see:

- [Quick Start Guide](QUICK_START.md)
- [Installation Guide](installation-guide.md)
- [API Documentation](api/)
- [Examples](../examples/)
