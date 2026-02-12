# Tailwind Native: The Industry Standard

This document documents the "Tailwind Native" strategy. This serves as the **Control Group** and alternative to Phidelity Native.

In this model, **Phidelity is removed entirely.** Tailwind handles both the Geometry (Layout) and the Texture (Paint).

---

## 1. The Triad (Tailwind Edition)

We still maintain the separation of Brand and Logic, but Tailwind becomes the sole execution engine.

### Repo A: Brand (The Soul)
*   Raw values (`--brand-purple`).
*   Consumed by: Tailwind Config.

### Repo B: Atoms (The Mind)
*   Semantic mappings (`--action-primary`).
*   Consumed by: Tailwind Config.

### Repo C: Tailwind (The Engine)
*   **Role:** The Monolith. It consumes the tokens and generates **ALL** CSS.
*   **Physics:** Standard 12-column grids (or arbitrary values).
*   **Paint:** Standard Utility classes.

---

## 2. Implementation

### Geometry (Layout)
Instead of Phidelity's mathematical grid (`.phi-grid-74`), we use standard Tailwind classes.

*   **Grid:** `grid grid-cols-12 gap-4`
*   **Flex:** `flex flex-col space-y-4`
*   **Sizing:** `w-full max-w-4xl`

*Trade-off:* We lose the intrinsic Golden Ratio fluid physics. We gain the industry-standard familiarity.

### Texture (Paint)
We use Tailwind to paint the surface, mapped to our tokens.

*   **Color:** `bg-action-primary`
*   **Typography:** `text-xl font-brand`
*   **Shadow:** `shadow-md`

---

## 3. Comparison: Phidelity vs. Tailwind

| Feature | Phidelity Native | Tailwind Native |
| :--- | :--- | :--- |
| **Philosophy** | **Physics First** (Golden Ratio, Fluid containers) | **Utility First** (Standard 12-col, Media Queries) |
| **Geometry** | `.phi-grid` (Container Query based) | `grid-cols-12` (Viewport based usually) |
| **Texture** | Native CSS (`.bg-action`) | Tailwind Utilities (`bg-action`) |
| **Build Step** | **None** (Pure CSS) | **Heavy** (PostCSS, JIT, Config) |
| **Dependency** | Sovereign (You own the code) | External (You depend on Tailwind Labs) |
| **Learning Curve** | High (New Physics) | Low (Industry Standard) |

---

## 4. The Verdict
Choose **Tailwind Native** if:
*   You want to hire generic React developers who already know the class names.
*   You don't care about Golden Ratio or Container Query physics.
*   You want access to the massive ecosystem of Tailwind UI libraries.

Choose **Phidelity Native** if:
*   You want a superior, mathematical layout engine.
*   You want a lightweight, sovereign stack without build complexity.
*   You want "Container Query" native behavior by default.
