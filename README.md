# Phidelity
**Design with Nature**

Phidelity is a CSS framework founded on calculations, geometry, and natural proportions. It represents a paradigm shift in digital application design: Moving away from arbitrary breakpoints and viewports toward a mathematical, container-based canvas where ideas can grow and flourish naturally.

---

## 1. The Paradigm Shift
**From Viewport to Container**

Traditional web design imposes a grid onto the screen ("Standard Desktop," "Tablet," "Mobile"). Phidelity flips this model. It does not care about the device screen; it cares about the **Container**.

-   **Intrinsic Design**: Components adapt to their immediate environment, not the browser window.
-   **No Magic Numbers**: Layouts are not defined by arbitrary pixels (e.g., 20px gutters) but by mathematical ratios (Golden Ratio `1.618`).
-   **Fluidity**: Typography and spacing use `clamp()` and container units (`cqw`), ensuring infinite responsiveness without "breakpoint jumps."

---

## 2. Design Workflow: Inside-Out
**The LEGO Philosophy**

Phidelity enables an "Inside-Out" workflow. Designers can concentrate on "widgets" as independent, self-aware entities first—optimizing them for every relevant column width (Level 3).

Later, these entities can be assembled onto the big canvas (Levels 1 & 2) like **LEGO** blocks. You have the full freedom to "build with a big LEGO board" when composing the macro layout, knowing that the micro-components will fluidly adapt to whatever slot they are placed in.

## 3. The Three-Level Architecture

Phidelity structures design into three distinct levels of hierarchy, ensuring scalability from the skeleton to the widget.

### Level 1: Semantic Elements (The Skeleton)
*Role: Structure & Semantics*

The foundation of the application is built on standard HTML5 tags, enhanced with custom web components to enforce the "App Shell" structure.
-   `<phi-main>`: The primary canvas.
-   `<phi-header>`, `<phi-left-nav>`: Structural anchors.
-   **Goal**: Provide a semantic, accessible backbone that holds the geometry together.

### Level 2: Sections (The Tendons)
*Role: Macro Layouts & Responsive Ability*

Sections are the high-level containers that like tendons connect the flesh to the skeleton." They define how content is distributed across the available widths using powerful CSS Grid algorithms.

**Key Layouts:**
-   **Golden**: Divides space using the Golden Ratio (`1.618 : 1`). Perfect for sidebar/main content splits.
-   **Trinity**: A balanced `1 : 1 : 1` split.
-   **Hexad**: A dashboard-ready layout that scales from 1 to 6 columns seamlessly based on container width.
-   **Static Dynamic**: A layout that statically freezes the first container's width while allowing the second to dynamically scale based on the available space.

This level provides the **"Ultra Wide Responsive Ability"**, allowing the application to scale from a mobile screen to a 4k cinema display without losing its proportions.

### Level 3: Widgets (The Flesh)
*Role: Responsive Content & Micro Grids*

This is the **"Grid-Perfect"** (as opposed to the **"Pixel-Perfect"** of older CSS frameworks) layer. Inside the broad strokes of a Section, the Designer needs precision. Phidelity replaces the rigid pixel with the **dynamic Golden Ratio Grid Cell** as the fundamental unit for sizing, spacing, and positioning.

**In Practice:**
This power is already live. The Widgets **Introduction**, **Typographic Scale**, **Color System**, **Bento Box**, and **Media Gallery** all utilize this Widget Level logic to render self-aware, responsive interfaces.  Widgets are independent entities that only share global CSS variable like color- and text-classes.

**The Grid System (24n + 2)**
Phidelity uses a sophisticated logic of **26, 50, 74, 98, ... columns**.
-   **2 Columns** are reserved for left/right "Margins" (Breathing room).
-   **Content** grows in blocks of **24 columns**.
-   **No Gaps**: There are no arbitrary `gap: 20px` rules. The grid is continuous. Spacing is defined by *leaving columns empty*, ensuring every whitespace is mathematically proportional to the content.

| Logic | Columns | Context |
| :--- | :--- | :--- |
| **Mobile** | **26** | 2 Marg + 22 Content + 2 Marg |
| **Tablet** | **50** | +24 Content Columns |
| **Desktop** | **74** | +24 Content Columns |
| **Wide** | **98** | +24 Content Columns |
| **XL** | **122** | +24 Content Columns |
| **Cinema** | **146** | +24 Content Columns |

---

## 4. Technical Implementation

### The "Pure Container" Architecture
Phidelity draws a clear technical line between the Skeleton and the Organs, but **Everything** is now a Container Query:

1.  **Semantic Elements (Level 1)**: The root `<html>` element is defined as the container `phi-root`. The App Shell (`phi-left-nav`, `phi-right-nav`) queries this root container instead of the viewport. This makes the entire application **embeddable**.
2.  **Sub-Level Elements (Levels 2 & 3)**: Everything inside the skeleton—Sections, Widgets—relies on their nearest parent container.

### The Coordinate System
Because the grid has "No Gaps," placing items is a coordinate exercise.
-   **Placement**: `grid-column: 3 / 25` (Spans the 22 content columns of a Mobile grid).
-   **Design Freedom**: You are not locked into "12 columns." You have up to 146 units of precision to align typography, images, and data.

---

> *"The grid is not a constraint; it is the mathematical soil in which your design grows."*

---

## 5. License & Attribution

### MIT License
Phidelity is open-source software licensed under the [MIT License](LICENSE).

### Attribution Request
While the MIT license allows for free use, we kindly request that if you use Phidelity in your projects, you provide credit to the original creator.

**Recommended Citation:**
> Built with [Phidelity](https://github.com/paalpaulsen/phidelity) - A Golden Ratio CSS Framework by Pål Eirik Paulsen.
