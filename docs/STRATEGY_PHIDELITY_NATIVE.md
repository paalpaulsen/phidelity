# Phidelity Native: The Pure Architecture

We have moved beyond the "Hybrid" model. We do not need a massive external dependency (Tailwind) just to paint backgrounds blue.

This document outlines the **Phidelity Native** architecture: a self-contained, token-driven, sovereign stack.

---

## 1. The Triad of Truth

To maintain strict separation of concerns, we divide our "Design Brain" into three distinct Repositories (or Packages).

### Repo A: Brand (The Soul / Identity)
*   **Role:** Defines WHO we are. Pure, raw values.
*   **Content:**
    *   **Colors:** `--brand-purple: #6A00FF`
    *   **Typography:** `--brand-font: 'Inter', sans-serif`
    *   **Shape:** `--brand-radius: 4px`
    *   **Icons (The Vocabulary):** The raw SVG asset library (`assets/icons/*.svg`).
*   **Change Frequency:** Rare (Rebrand every 3-5 years).

### Repo B: Atoms (The Mind / Logic)
*   **Role:** Defines HOW we function. Maps Brand to Logic.
*   **Content:**
    *   `--action-primary: var(--brand-purple)`
    *   `--surface-card: #FFFFFF`
    *   `--status-error: #FF0000`
*   **Change Frequency:** Medium (UX tweaks).

### Repo C: Phidelity (The Body / Physics)
*   **Role:** Defines WHERE things go and HOW they move.
*   **Content:**
    *   **The Physics:** Spacing scales, Type scales, Grid logic, Breakpoints.
    *   **The Engine:** The actual CSS classes (`.phi-grid`, `.phi-gap-2`).
*   **Change Frequency:** Low (Core systems).

---

## 2. The Tailwind Replacement: The "Texture Layer"

In the Hybrid model, we used Tailwind to generate utilities like `bg-blue-500`.
In the Native model, **Phidelity generates these utilities itself.**

Since we own the tokens (Repo A & B), we can simply auto-generate a lightweight CSS file:

```css
/* generated-texture.css (12kb) vs Tailwind (Huge) */

/* Backgrounds */
.bg-action-primary { background-color: var(--action-primary); }
.bg-surface-card   { background-color: var(--surface-card); }

/* Typography */
.font-brand { font-family: var(--brand-font); }
```

**The Benefit:**
1.  **Zero Build Step:** No PostCSS, no Config file, no scanning HTML. Just pure CSS.
2.  **Semantic Naming:** We don't use generic `blue-500`. We use enforcing names like `action-primary`.
3.  **Total Sovereignty:** We are not dependent on a framework's update cycle.

---

## 3. The Native Workflow

### Step 1: Geometry (Phidelity Core)
We use Phidelity's grid system to build the skeleton. This handles all responsiveness via Container Queries.
`<div class="phi-grid-12 phi-gap-2">`

### Step 2: Texture (Phidelity Native Utils)
We use our generated utility classes to paint the skeleton.
`<div class="bg-surface-card radius-md shadow-1">`

### Step 3: Encapsulation
We avoid class soup by composing these tokens in standard CSS or Components.

```css
/* card.css */
.card-pricing {
  /* Geometry (Phidelity) */
  /* Handled by parent container query usually, or internal flex */
  display: flex; 
  flex-direction: column;
  gap: var(--space-4); /* Phidelity Token */

  /* Texture (Native) */
  background-color: var(--surface-card); /* Atom Token */
  border-radius: var(--brand-radius);    /* Brand Token */
  box-shadow: var(--shadow-1);
}
```

---

## 4. Integration: Theming External Libraries (Designsystemet)

A common challenge is using "Black Box" components (like Designsystemet) that come with their own colors.
**Question:** "Can we repaint Designsystemet buttons with our Brand Tokens?"
**Answer:** Yes, via a **Translation Layer**.

### The Mechanism
We do not hack the component. We simply map *Their* variables to *Our* tokens in a dedicated CSS scope.

```css
/* atoms/integration-designsystemet.css */

:root {
  /* 1. We identify the Variable Designsystemet uses */
  /* 2. We assign it to OUR Atom Token */
  
  --fds-btn-primary-bg:      var(--action-primary); 
  --fds-btn-primary-text:    var(--color-on-action);
  --fds-focus-ring:          var(--brand-focus);
}
```

**Result:**
The Designsystemet Button retains its **Physics** (Padding, Behavior, Accessibility) but adopts our **Texture** (Brand Color).

---

## 5. Summary
*   **We deleted Tailwind.**
*   **We kept the Speed.** (We still have utility classes).
*   **We gained Control.** (Our tokens drive the utilities directly).
