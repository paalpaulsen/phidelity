# Strategy: The White Label Composable Design System

> **"Just Add Brand."**

**The Vision:** An easy, controllable, brandable, open-source, non-vendor-specific, flexible, and agnostic solution.
**The Method:** "Radical Agnosticism" achieved through strict separation of concerns across the **6-Layer Stack**.

---

## 1. Token Layer
**Role:** The Sovereign Identity. Defines the "Skin" of the brand foundation.
*   **White Label Strategy:** Tokens must be pure data (JSON/Variables), completely decoupled from implementation.
*   **The Agnostic Promise:** A change in Brand Color (e.g., Rebranding) requires **zero** code changes in components or widgets.
*   **Storage:** `packages/brand/tokens.json` (Source of Truth).

## 2. Component Layer
**Role:** The Supply Chain. Provides the raw "Bricks" (Buttons, Inputs, Primitives).
*   **White Label Strategy:** Treat Component Libraries (Designsystemet, Radix, MUI) as **external suppliers**.
*   **The Controlled Connection:** Use **NPM SemVer** to pin specific versions (e.g., `v1.9.0`). This prevents "Vendor Lock-in" to their release schedule.
*   **Optimization:** We prefer "Headless" or "CSS-only" primitives to maximize portability across frameworks.

## 3. Widget Layer
**Role:** The Weaver. The core Intellectual Property (IP) of the White Label system.
*   **White Label Strategy:** This is where we assemble **L1 Tokens**, **L2 Components**, and **L4 Content** into functional units.
*   **The Independence:** Widgets are **Self-Contained**. They own their layout "Physics" (Phidelity Grid) but delegate everything else.
*   **The Interface:** Widgets accept content via generic Props, making them ignorant of the CMS.

## 4. Content Layer
**Role:** The Data Source. Breaths life into the widgets.
*   **White Label Strategy:** Data sources are interchangeable plugins.
*   **Vendor Agnosticism:**
    *   **Sanity:** Used as a headless API.
    *   **Swapability:** Because L3 Widgets consume generic props, you can swap Sanity for **Strapi**, **Directus**, or **Local Markdown** without rewriting the Widget.

## 5. Build Layer
**Role:** The Composer. Assembles widgets into Pages and Templates.
*   **White Label Strategy:** The Framework is an implementation detail.
*   **Interoperability:** Our "Universal Widgets" (Web Components or Framework Agnostic) can be rendered by **Astro**, **Next.js**, **Nuxt**, or **PHP**.
*   **The Sandbox:** We verify this by running different frameworks in the same repo to prove widget portability.

## 6. Delivery Layer
**Role:** The Infrastructure. Where the code runs.
*   **White Label Strategy:** Usage of Open Standards (Static HTML/CSS/JS) ensures commodity hosting.
*   **Cloud Freedom:**
    *   **Azure/AWS:** Supported but not required.
    *   **Edge:** Deployable to Vercel/Netlify for speed, or on-prem Docker for control.
    *   **No Lock-in:** The application code contains no provider-specific infrastructure logic.

## 7. Governance Layer
**Role:** The Constitution. The social operating system.
**White Label Strategy:** Separation of Concerns = Political Peace.
*   **Defined Rights:**
    *   **Brand** owns Tokens (Look & Feel).
    *   **Product** owns Widgets (Feature Logic).
    *   **Platform** owns Layout (Grid Physics).
*   **Inner Sourcing:** Allows Product Teams to contribute Widgets back to the Core, preventing bottlenecks.

---

## Summary: The "Widget Factory" Concept

By adhering to this structure, the **Widget Layer (L3)** becomes the portable "Product". It weaves together replaceable inputs (Tokens, Components, Content) to create a stable, brandable experience that survives technology shifts.
