# Layout Part 1: Canvas Taxonomy (The Context)

**Role:** The Architect.
**Definition:** The macro layout layer that orchestrates the Global Grid and Semantic Sections. It sets the stage for the widgets.

---

## 1. The Global Grid (Media Query Based)
*The traditional responsive grid logic from the "Old World".*

*   **Definition:** A viewport-based grid (e.g., 12 columns) used for macro layout.
*   **Usage:** Optional. Used when defining the main layout shells or when not using container queries.
*   **Context Awareness:** It knows about the screen size (Viewport).

---

## 2. Semantic Layouts (The Rooms)
*   **The Shell:** The page is divided into semantic zones that act as containers for widgets.
    *   **Header (North):** (`<header>`, `<nav>`) Navigation and identity.
    *   **Aside (East/West):** (`<aside>`) Contextual tools / Sidebar.
    *   **Main (Center):** (`<main>`) The primary value area.
    *   **Footer (South):** (`<footer>`) Legal and sitemap.

---

## 3. The Sections (The Parents)
*   **Macro Layout:** These divide the `Main` room into vertical slices (using `<section>` or `<article>`).
*   **Role:** They provide the *context* and *width* for the children.
*   **The Law:** Sections usually run on the Global Grid or use simple Flex/Grid. They are *agnostic* to the internal content of the widgets they contain.
*   **Example:** A "Two-Column Section" gives 50% width to two different Phidelity Widgets.
