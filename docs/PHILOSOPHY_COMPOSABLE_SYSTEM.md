# The Phidelity Manifesto: A Composable Future

## 1. The Universal Atom Theory
> "There is no reason to build Lego blocks that already exist."

**The Philosophy:**
All organizations in the world share the same fundamental primitives (Buttons, Inputs, Toggles). The "Button" is a solved problem. It is a standard of the World Wide Web.
**The Implication:**
We should stop building "Custom Button Components" from scratch. We should use standard, proven implementations.

## 2. Branding is a "Skin", Not a Body
> "What is mutable is the hex codes, numbers, specific iconography."

**The Philosophy:**
A Brand is a set of **values** (Tokens), not a set of **components**.
*   **The Body (Component):** Should be standard, robust, unopinionated.
*   **The Skin (Brand):** Is applied *on top* via CSS Variables.
**The Implication:**
Never hardcode "Brand Logic" inside "Component Logic". They must remain distinct.

## 3. The Tri-Layer Architecture
> "It is important that we think of Layout/Composition as its own layer."

We separate the system into three sovereign layers:
1.  **Repo A (Brand):** The DNA (Tokens).
2.  **Repo B (Atoms):** The Lego Blocks (Standard, Boring, Robust).
3.  **Repo C (Layout/Phidelity):** The Construction Site (Where Blocks meet to form structures).

## 4. The Vanilla Imperative (The Long Game)
> "Frameworks come and go, but CSS and Javascript remain."

**The Philosophy:**
React, Vue, and Svelte are fleeting. The DOM is eternal.
**The Strategic Shift:**
If AI can now instantly generate robust, accessible **Vanilla Web Components** (or pure HTML/CSS), do we still need heavy frameworks like Material UI?
*   **Old World:** We needed libraries (MUI) because writing accessible components was hard.
*   **New World (AI):** Writing distinct components is trivial. We can lean on "Vanilla" standards to ensure our code survives the next framework death.

## 5. The "Global Molecule" Problem
> "Some things (like Datepickers) do not become part of a web standard."

**The Question:**
If we go "Vanilla", how do we handle complex beasts like Calendar Pickers, Data Grids, or Rich Text Editors?

**The Solution: "Layer 2.5 - The Specialist"**
We acknowledge that `<div>` and `<input>` cover 80% of the UI. For the remaining 20% (the "Global Molecules"), we **outsource to Specialists**.
*   **Layer 2 (Standard Atoms):** Button, Input, Card. -> **DO IT YOURSELF (Vanilla/AI).**
*   **Layer 2.5 (Specialist Molecules):** Datepicker, DataGrid. -> **BUY IT (Designsystemet / Headless UI).**

**The Rule:**
Do not reinvent the wheel for *Logic-Heavy* components (Datemath is hard).
Do reinvent the wheel for *Style-Heavy* components (Cards, lists, buttons are easy).

## 6. The Human Markup Standard
> "The aim must be to make humanly readable markup. No div soup."

**The Philosophy:**
Code is for humans first, machines second.
*   **Bad:** `<div class="MuiBox-root css-1x2j3"><div class="css-82js">`
*   **Good:** `<article class="phi-card">`

**The Implication:**
We reject "Utility Class Soup" (Tailwind style `div class="flex flex-col p-4 m-2 bg-blue-500"`) in favor of **Semantic Components** (`<Card>`).
The HTML should tell a story about *what* the content is, not *what it looks like*.

## 7. Design System as Content (DSaaS)
> "Brand css could perhaps be changeable tokens in a 'content layer'."

**The Philosophy:**
If "Brand" is just data (Hex codes, Fonts), then it belongs in a Database (CMS), not in a Git Repo.
**The Future State:**
We move `packages/brand/tokens.css` into **Sanity CMS**.
*   **Marketing Team:** Can update the "Brand Color" in Sanity during a campaign.
*   **The System:** Fetches the new Token values at build time (or runtime).
*   **The Result:** The Design System becomes a living, breathing content type. "Theming" becomes "Editing".

## 8. The Home of Molecules: Expansion of Layer 2
> "Where do we store the global molecules? We don't have a 2.5 layer."

**The Architectural Decision:**
We rename **Repo B (Atoms)** to **Repo B (Components)**.
It now houses both:
1.  **Atoms:** Single-cell organisms (Button, Input).
2.  **Molecules:** Multi-cell organisms (Datepicker, Search Bar, Card).

**Why not in Layout Rep (Repo C)?**
*   **Repo C (Phidelity) is Physics:** It defines *Gravity, Grid, Spacing*. It doesn't care if it's holding a Button or a Spaceship.
*   **Repo B (Components) is Matter:** It defines the objects.
*   **A "Global Molecule" is still an Object.** A Datepicker is a "Thing" you drop into a grid cell. Therefore, it belongs in Repo B.

**Layer 2.5 (The Specialist)** is just a "Vendor" that supplies Repo B.
*   *You import the Datepicker from `Designsystemet` into Repo B, wrap it, and export it as `<AppDatepicker>`.*
