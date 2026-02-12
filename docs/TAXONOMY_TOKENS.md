# Layer 1: Token Taxonomy (Physics & Brand)

This document provides a comprehensive list of design tokens, categorized by their source of truth: **Identity** (Brand) vs. **Physics** (System).

## 1. Identity Tokens (Variable)
*These define "Who we are". They change when the Brand changes.*

### 1.1 Color (The Palette)
*   **Brand Colors:** Primary, Secondary, Accent.
*   **Semantic Colors:** Success, Warning, Error, Info.
*   **Neutral Colors:** Text (Body, Heading, Muted), Backgrounds (Page, Surface, Overlay).

### 1.2 Typography (The Voice)
*   **Font Families:** Heading Font, Body Font, Monospace/Code Font.
*   **Font Weights:** Regular (400), Medium (500), Bold (700).

### 1.3 Shape (The Feel)
*   **Border Radius:** 
    *   *Small:* (2px) for checkboxes/tags.
    *   *Medium:* (4px/8px) for buttons/inputs.
    *   *Large:* (16px) for cards/modals.
    *   *Full:* (9999px) for pills/avatars.
*   **Border Width:** Hairline (1px), Focus Ring (2-3px).

---

## 2. Physics Tokens (Constant)
*These define "How the world works". They usually remain stable across brands to ensure structural integrity.*

### 2.1 Physics of Typography (Scale & Rhythm)
*   **Typographic Scale:** Unitless scales for harmonic sizing.
*   **Line Heights:** Heading (Tight), Body (Relaxed).
*   **Letter Spacing:** Tracking adjustments for Uppercase vs. Body.



### 2.2 Depth (The Z-Axis)
*   **Elevation (Shadows):**
    *   *Level 1:* Subtle (Card hover).
    *   *Level 2:* Distinct (Dropdown/Popover).
    *   *Level 3:* High (Modal/Dialog).
*   **Z-Index:** Layers of the application (Content < Header < Drawer < Modal < Toast).

### 2.3 Motion (Time)
*   **Duration:** 
    *   *Instant:* (0ms)
    *   *Fast:* (100-200ms) for hover/clicks.
    *   *Normal:* (300ms) for transitions/dialogs.
    *   *Slow:* (500ms+) for loading/large movements.
*   **Easing:** 
    *   *Linear:* (Mechanical).
    *   *Ease-Out:* (Decelerate - entering screen).
    *   *Ease-In:* (Accelerate - leaving screen).
    *   *Spring:* (Natural physics).

### 2.4 Opacity (Visibility)
*   **Disabled:** (0.3 - 0.5)
*   **Overlay/Dimmer:** (0.5 - 0.8) used behind modals.
*   **Ghost:** (0.1) used for hover states on transparent buttons.

---

## 3. The Separation of Powers
*   **Brand Tokens:** Live in **Git (brand.json)**. (Simple JSON file for Colors/Fonts).
    *   *Update Mechanism:* Edit file -> Commit -> CI/CD Rebuilds site (1 min coverage).
*   **Physics Tokens:** Live in **Git (system.json)**. (Admins control scale/radius/motion).
*   **Grid Engine:** Lives in **Phidelity CSS**. (The immutable code engine that renders the layouts).
