# Phidelity Orchestration Layer
> **Context:** How Phidelity fits into the broader enterprise technology stack, acting as the bridge between raw atomic components (Designsystemet) and the final user experience.

## The 6-Layer Architecture

### 1. The Foundation: Designsystemet.no
**Role: Atomic Components & Primitives**
*   **What it is:** The base "LEGO bricks." Buttons, Inputs, Checkboxes, Icons, Accessibility rules (WCAG).
*   **Responsibility:** Handling the *micro-interactions* and state (hover, focus, disabled).
*   **Phidelity's Relationship:** Phidelity imports these atoms "blindly." It trusts them to be accessible and compliant. Ideally, Phidelity never re-styles a button's *border-radius* or *focus-ring*; it simply *places* the button where it needs to go.

### 2. The Brain: Phidelity System
**Role: Layout & Design Philosophy**
*   **What it is:** The "Orchestration Layer." It defines Space, Rhythm, Proportion, and Flow.
*   **Responsibility:**
    *   **The Grid:** The 24+2 Golden Ratio Mesh.
    *   **The Containers:** Sections (Golden, Trinity, Hexad).
    *   **The Physics:** How things grow, shrink, and stack (Container Queries).
*   **Key Concept:** Phidelity does not design the *doorknob* (Designsystemet does that); Phidelity designs the *Room*.

### 3. The Content: Sanity.io
**Role: Pure Content (Headless CMS)**
*   **What it is:** The database of truth. Strings, Images, References.
*   **Responsibility:** Storing content in a purely semantic, presentation-agnostic format (Portable Text).
*   **Phidelity's Relationship:** Phidelity widgets connect to Sanity schemas. A `phi-article-hero` widget maps directly to a `hero` object in Sanity. The design system essentially visualizes the structured data.

### 4. The Code: Web Components
**Role: The Distribution Mechanism**
*   **What it is:** `phi-widget-name.js`. Custom Elements hosted in a dedicated repository (GitHub/NPM).
*   **Responsibility:** Encapsulating the logic (JS), style (CSS), and structure (HTML) into a portable unit.
*   **Strategy:** By using Web Components, Phidelity becomes framework-agnostic. It can be dropped into a React app, a Vue dashboard, or a legacy CMS without friction.

### 5. The Soul: Brand Guide
**Role: Visual Stylization**
*   **What it is:** The "Skin" or "Theme."
*   **Responsibility:** Defining the specific *flavor* of the output.
    *   **Typography:** Which font family? (Inter vs. Tiempos).
    *   **Color Palette:** The specific HSL values for `--c-accent`.
    *   **Tone of Voice:** The feeling of the UI.
*   **Phidelity's Relationship:** Phidelity consumes these via CSS Variables (`macro.css`). You can swap the Brand Guide (change the variables) without touching the layout engine (Phidelity) or the atomic logic (Designsystemet).

### 6. The Workshop: StoryBook
**Role: Assembly & Testing**
*   **What it is:** The laboratory.
*   **Responsibility:** The layer where all pieces are assembled and tested in isolation.
    *   Verify that *Designsystemet* atoms fit inside *Phidelity* grids.
    *   Verify that *Sanity* data correctly hydrates the *Web Components*.
    *   Verify that the *Brand Guide* colors are accessible.
*   **Workflow:** Developers build widgets here before they ever ship to the live application.

---

## Summary Diagram
```mermaid
graph TD
    DS[1. Designsystemet<br/>(Atoms)] --> SB[6. StoryBook<br/>(Assembly)]
    BG[5. Brand Guide<br/>(Thematic vars)] --> CL[2. Phidelity<br/>(Layout Logic)]
    CL --> SB
    WC[4. Web Components<br/>(Code/Dist)] --> SB
    CMS[3. Sanity<br/>(Content Data)] --> App[Production App]
    SB --> App
```
