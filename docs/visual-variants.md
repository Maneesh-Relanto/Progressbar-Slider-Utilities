# Visual Variants & Animations

This guide covers the visual customization options available for AI Controls, including visual variants and animation effects.

## Table of Contents

- [Visual Variants](#visual-variants)
- [Animation Effects](#animation-effects)
- [Combining Variants and Animations](#combining-variants-and-animations)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Browser Support](#browser-support)

## Visual Variants

Visual variants provide different styling approaches for your components. Each variant maintains consistent behavior while offering distinct visual aesthetics.

### Available Variants

| Variant        | Description                                 | Use Case                                     |
| -------------- | ------------------------------------------- | -------------------------------------------- |
| `default`      | Standard styling with shadows and depth     | General purpose, most common use case        |
| `minimal`      | Clean, flat design with border-only styling | Subtle interfaces, information-dense layouts |
| `gradient`     | Colorful animated gradients                 | Eye-catching displays, modern UIs            |
| `glassmorphic` | Frosted glass effect with backdrop blur     | Overlay interfaces, modern aesthetic         |

### Default Variant

The default variant provides a balanced design with subtle shadows and consistent styling:

```html
<stream-progress variant="default" max-tokens="1000"></stream-progress>
```

**Characteristics:**

- Soft box shadows for depth
- Standard border radius
- Clean, professional appearance
- Works well in light and dark themes

### Minimal Variant

A clean, flat design that removes visual complexity:

```html
<batch-progress variant="minimal" total-batches="10"></batch-progress>
```

**Characteristics:**

- No shadows
- Border-only styling
- Reduced visual weight
- Perfect for dense interfaces

### Gradient Variant

Dynamic gradients that add visual interest:

```html
<model-loader variant="gradient" model-name="GPT-4"></model-loader>
```

**Characteristics:**

- Animated gradient backgrounds
- Uses theme primary and secondary colors
- Smooth color transitions
- High visual impact

### Glassmorphic Variant

Modern frosted glass effect:

```html
<queue-progress variant="glassmorphic" total-items="5"></queue-progress>
```

**Characteristics:**

- Semi-transparent background
- Backdrop blur effect
- Subtle borders
- Works best over colorful backgrounds

## Animation Effects

Animation effects add motion and visual feedback to progress indicators.

### Available Animations

| Animation | Description                  | Use Case                                   |
| --------- | ---------------------------- | ------------------------------------------ |
| `none`    | No animation (default)       | Static displays, reduced motion preference |
| `striped` | Moving diagonal stripes      | Active progress indication                 |
| `pulse`   | Smooth opacity pulsing       | Idle/waiting states                        |
| `glow`    | Box-shadow intensity pulsing | Attention-grabbing, important progress     |

### None (Default)

No animation, static appearance:

```html
<stream-progress animation="none"></stream-progress>
```

### Striped Animation

Animated diagonal stripes moving across the progress bar:

```html
<stream-progress animation="striped" max-tokens="1000"></stream-progress>
```

**Characteristics:**

- Continuous diagonal stripe movement
- 1 second animation cycle
- Indicates active progress
- CSS-only animation (performant)

### Pulse Animation

Smooth opacity pulsing:

```html
<batch-progress animation="pulse" total-batches="10"></batch-progress>
```

**Characteristics:**

- 2 second animation cycle
- Opacity varies between 1.0 and 0.6
- Gentle, non-distracting
- Ideal for idle/waiting states

### Glow Animation

Box-shadow intensity pulsing:

```html
<queue-progress animation="glow" total-items="5"></queue-progress>
```

**Characteristics:**

- 2 second animation cycle
- Shadow size varies for "glow" effect
- Uses theme primary color
- High attention-grabbing

## Combining Variants and Animations

You can combine any variant with any animation for powerful customization:

```html
<!-- Minimal variant with striped animation -->
<stream-progress variant="minimal" animation="striped" max-tokens="1000"> </stream-progress>

<!-- Gradient variant with pulse animation -->
<batch-progress variant="gradient" animation="pulse" total-batches="10"> </batch-progress>

<!-- Glassmorphic variant with glow animation -->
<model-loader variant="glassmorphic" animation="glow" model-name="GPT-4"> </model-loader>
```

## Examples

### Example 1: Subtle Progress Indicator

For a subtle, non-intrusive progress indicator:

```html
<stream-progress variant="minimal" animation="none" max-tokens="1000"> </stream-progress>
```

### Example 2: Attention-Grabbing Loader

For a prominent, eye-catching loader:

```html
<model-loader variant="gradient" animation="glow" model-name="GPT-4" total-size="1500">
</model-loader>
```

### Example 3: Modern Overlay

For a modern overlay interface:

```html
<queue-progress variant="glassmorphic" animation="pulse" total-items="5"> </queue-progress>
```

### Example 4: Active Progress

For clearly indicating active progress:

```html
<batch-progress variant="default" animation="striped" total-batches="10"> </batch-progress>
```

## Programmatic Configuration

You can also set variants and animations programmatically:

### JavaScript

```javascript
const streamProgress = new StreamProgress({
  maxTokens: 1000,
  variant: 'gradient',
  animation: 'striped',
});

// Update later
streamProgress.setAttribute('variant', 'minimal');
streamProgress.setAttribute('animation', 'pulse');
```

### TypeScript

```typescript
import { StreamProgress, VisualVariant, AnimationEffect } from 'ai-progress-controls';

const variant: VisualVariant = 'glassmorphic';
const animation: AnimationEffect = 'glow';

const streamProgress = new StreamProgress({
  maxTokens: 1000,
  variant,
  animation,
});
```

## Best Practices

### 1. Match Your UI Design System

Choose variants that complement your existing design:

- **Corporate/Professional**: Use `default` variant
- **Modern/Trendy**: Use `gradient` or `glassmorphic`
- **Minimalist**: Use `minimal` variant
- **Overlay/Modal**: Use `glassmorphic` variant

### 2. Consider User Context

Select animations based on user context:

- **Active Loading**: `striped` animation
- **Idle/Waiting**: `pulse` animation
- **Important/Critical**: `glow` animation
- **Background Process**: `none` animation

### 3. Respect User Preferences

The library automatically respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations are automatically disabled */
}
```

This ensures accessibility for users sensitive to motion.

### 4. Theme Consistency

Visual variants work with all theme colors:

```html
<!-- OpenAI theme with gradient variant -->
<stream-progress variant="gradient" animation="striped"></stream-progress>

<script>
  document.documentElement.style.setProperty('--ai-primary-color', '#10a37f');
  document.documentElement.style.setProperty('--ai-secondary-color', '#1a7f64');
</script>
```

### 5. Performance Considerations

All animations use CSS only (no JavaScript), ensuring:

- Smooth 60fps performance
- Low CPU usage
- GPU acceleration where supported
- No impact on main thread

## Browser Support

### Visual Variants

| Browser      | Support         |
| ------------ | --------------- |
| Chrome 88+   | ✅ Full support |
| Firefox 94+  | ✅ Full support |
| Safari 15.4+ | ✅ Full support |
| Edge 88+     | ✅ Full support |

### Backdrop Filter (Glassmorphic)

| Browser      | Support         |
| ------------ | --------------- |
| Chrome 76+   | ✅ Full support |
| Firefox 103+ | ✅ Full support |
| Safari 15.4+ | ✅ Full support |
| Edge 79+     | ✅ Full support |

**Fallback:** If `backdrop-filter` is not supported, the glassmorphic variant gracefully degrades to a solid background.

## Combining with Other Features

### With Theming

```html
<!-- Gradient variant with custom OpenAI theme -->
<stream-progress variant="gradient" animation="striped" max-tokens="1000"> </stream-progress>

<script>
  // Set OpenAI theme colors
  document.documentElement.style.setProperty('--ai-primary-color', '#10a37f');
  document.documentElement.style.setProperty('--ai-secondary-color', '#1a7f64');
</script>
```

### With Size Variants

```html
<!-- Compact size with minimal variant -->
<stream-progress size="compact" variant="minimal" animation="none" max-tokens="1000">
</stream-progress>

<!-- Large size with gradient variant -->
<batch-progress size="large" variant="gradient" animation="pulse" total-batches="10">
</batch-progress>
```

### With Cursor Feedback

```html
<!-- Glassmorphic variant with cursor feedback -->
<model-loader variant="glassmorphic" animation="glow" cursor-feedback="true" model-name="GPT-4">
</model-loader>
```

## Interactive Demo

Check out the live demo at `examples/vanilla/visual-variants-demo.html` to see all variants and animations in action with interactive controls.

## Advanced Customization

If the built-in variants don't meet your needs, you can create custom variants using CSS custom properties:

```css
/* Custom variant */
stream-progress[variant='custom'] {
  --ai-background-color: #yourcolor;
  --ai-primary-color: #yourcolor;
  /* ... other properties */
}

stream-progress[variant='custom']::part(progress-fill) {
  /* Custom progress bar styling */
  background: linear-gradient(45deg, red, blue);
}
```

## TypeScript Support

Full TypeScript support with type safety:

```typescript
import type { VisualVariant, AnimationEffect } from 'ai-progress-controls';

// Type-safe variant
const variant: VisualVariant = 'glassmorphic'; // ✅ Valid
const invalid: VisualVariant = 'invalid'; // ❌ TypeScript error

// Type-safe animation
const animation: AnimationEffect = 'glow'; // ✅ Valid
const invalidAnim: AnimationEffect = 'invalid'; // ❌ TypeScript error
```

## Questions or Issues?

If you have questions or encounter issues:

1. Check the [Quick Reference](./QUICK_REFERENCE.md)
2. Review [examples/vanilla/visual-variants-demo.html](../examples/vanilla/visual-variants-demo.html)
3. Open an issue on GitHub

---

**Next Steps:**

- Explore [Theming Guide](./theming.md)
- Try the [Live Demo](../examples/vanilla/visual-variants-demo.html)
- Read [API Documentation](./api/)
