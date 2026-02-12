# Strategy: Theming & Token Integration ("The Bridge")

**The Challenge:** How do we force external components (Level 2) to use our Brand Tokens (Level 1) without forking their code or writing messy CSS overrides?

**The Answer:** **CSS Variable Mapping (The Bridge)**.

---

## 1. The Core Concept

We do not "repaint" components. We simply **re-route** their supply of digital paint.

*   **L1 Token (Our Truth):** We define `--brand-primary: #FF0000;`
*   **L2 Component (Their Expectation):** The button expects `--ds-color-success`.
*   **The Bridge:** We explicitly map *Their* variable to *Our* variable.

```css
:root {
  /* The Bridge: Mapping "Their" Semantic Names to "Our" Brand Values */
  --ds-color-success: var(--brand-primary);
  --ds-border-radius-base: var(--radius-md);
  --ds-font-family-body: var(--font-body);
}
```

---

## 2. Why This is "Agnostic"

1.  **Zero Specificity Wars:** We are not writing `.ds-button { background: ... }`. We are preserving the component's internal logic (hover states, focus rings) but changing the underlying value it consumes.
2.  **Implementation Hiding:** The component doesn't know it's being "themed". It just sees a valid CSS variable.
3.  **Scoped Theming:** Because CSS Variables obey the cascade, we can re-map themes locally for specific widgets.

### Example: The "Dark Mode" Widget
```css
/* Global Scope (Default Theme) */
:root {
  --ds-color-surface: var(--color-white);
}

/* Local Scope (Inverted Widget) */
.my-dark-widget {
  /* Re-mapping just for this container */
  --ds-color-surface: var(--color-charcoal);
  --ds-color-text: var(--color-white);
}
```

---

## 3. The Implementation Strategy

### Step A: The "Dictionary" (L1)
We define our own sovereign tokens in standard CSS.
*   `packages/brand/tokens.css`

### Step B: The "Translation Layer" (The Bridge)
We create a mapping file that imports the Vendor's inputs and assigns our outputs.
*   `packages/brand/mappings/designsystemet.css`

```css
/* designsystemet.css */
:root {
    --ds-semantic-primary: var(--brand-blue-500);
    --ds-semantic-secondary: var(--brand-orange-500);
}
```

### Step C: The Consumption (L3 Widget)
Accidental complexity is avoided. The widget simply imports the "Bridge".
```html
<style>
    @import '/css/mappings/designsystemet.css';
    /* Now <ds-button> automatically looks like us */
</style>
```

---

## 4. Complex Cases (eCharts / JS Libraries)

For libraries that use JavaScript for rendering (like Canvas/SVG charts), we use `getComputedStyle`.

1.  **Define:** Define the color in CSS: `--chart-line-1: var(--brand-primary)`.
2.  **Read:** In JS, read the variable: `getComputedStyle(el).getPropertyValue('--chart-line-1')`.
3.  **Inject:** Pass it to the library config.

This ensures **L1 CSS Tokens** remain the Single Source of Truth, even for JS-based components.
