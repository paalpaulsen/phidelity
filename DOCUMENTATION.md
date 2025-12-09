# Phidelity Documentation

This document serves as a comprehensive guide for developers using the Phidelity CSS framework.

## 1. Getting Started

### Installation
Phidelity is designed as a drop-in framework.
1.  **Clone the Repo**: Download the Phidelity repository.
2.  **Include CSS**: Link `css/macro.css` in your `<head>`.
3.  **Include JS**: Include `js/app.js` and component scripts at the end of your `<body>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Phidelity App</title>
    <link rel="stylesheet" href="css/macro.css">
</head>
<body>
    <!-- App Shell -->
    <div class="shell-body">
        <phi-left-nav></phi-left-nav>
        
        <phi-main>
            <!-- Your Content Here -->
        </phi-main>
        
        <phi-right-nav></phi-right-nav>
    </div>

    <!-- Scripts -->
    <script src="components/PhiSection.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### Browser Requirements
Phidelity relies heavily on **Container Queries** (`@container`).
-   **Supported Browsers**: Chrome 105+, Safari 16+, Firefox 110+, Edge 105+.
-   **Note**: Ensure `container-type` is defined on parent elements for queries to work.

---

## 2. API Reference

### Component: `<phi-section>`
The core layout container. Uses the `layout` attribute to define grid behavior.

| Attribute | Value | Description |
| :--- | :--- | :--- |
| `layout` | `full` | **Default**. Single column stack. |
| | `golden` | **Golden Ratio**. Desktop: `1.618fr 1fr`. Wide: `1.618fr 1fr 1.618fr`. |
| | `trinity` | **Trinity**. Desktop: `1fr 1fr`. Wide: `1fr 1fr 1fr`. |
| | `hexad` | **Hexad**. Dashboard grid scaling from 1 to 6 columns based on width. |
| | `static-dynamic` | **Static Dynamic**. Wide: `1000px 1fr`. |

#### Example:
```html
<phi-section layout="golden">
    <div class="zone">Main Content (1.618fr)</div>
    <div class="zone">Sidebar (1fr)</div>
</phi-section>
```

### Component: App Shell
-   `<phi-left-nav>`: Responsive left navigation. Collapses to off-canvas on mobile.
-   `<phi-right-nav>`: Responsive right navigation.
-   `<div class="shell-body">`: The CSS Grid parent that orchestrates the App Shell.

---

## 3. Grid System & Calculations

Phidelity uses a unique **"24 + 2"** system that scales mathematically across all screen sizes. It prioritizes having a highly composite internal number (24) for flexible division.

### The Algorithm: `24n + 2`
*   **n**: The "Step" or "Factor" (1, 2, 3...).
*   **2**: The fixed structural margins (Left + Right).
*   **24**: The standard block of content columns.

| Context | Query Range | Formula | Total Columns | Config |
| :--- | :--- | :--- | :--- | :--- |
| **Step 0** | `< 170px` | `12 + 1` (Exception) | **13** | 12 Content + 1 Spacer (Prime Protection) |
| **Step 1** | `170px - 650px` | `24(1) + 2` | **26** | 2 Margins + 24 Content |
| **Step 2** | `651px - 962px` | `24(2) + 2` | **50** | 2 Margins + 48 Content |
| **Step 3** | `963px - 1274px` | `24(3) + 2` | **74** | 2 Margins + 72 Content |
| **Step 4** | `1275px - 1585px` | `24(4) + 2` | **98** | 2 Margins + 96 Content |
| **Step 5** | `1586px - 1897px` | `24(5) + 2` | **122** | 2 Margins + 120 Content |
| **Step 6** | `> 1898px` | `24(6) + 2` | **146** | 2 Margins + 144 Content |

### The Golden Ratio Row
Perhaps the most groundbreaking element of Phidelity is how it handles vertical rhythm. Instead of arbitrary pixel heights, rows are calculated dynamically to be the **Golden Ratio** of the column width.

Example:
```css  
@container (min-width: 170px) and (max-width: 650px) {
  .container {
    /* 1. Define the columns */
    grid-template-columns: repeat(26, 1fr);
    
    /* 2. Calculate the Golden Row */
    /* Row Height = (Container Width / No. of Cols) / Phi */
    grid-auto-rows: minmax(calc(100cqw / 26 / 1.618), auto);
  }
}
```

This ensures that every "Grid Cell" is a perfect Golden Rectangle, creating a harmonious naturally proportional canvas for content to live in.

---

## 4. Design Tokens (CSS Variables)
Phidelity uses a comprehensive system of CSS variables defined in `macro.css`.

### Calculated Typography
Phidelity does not use arbitrary font sizes. All type is calculated from a single base unit using the **Golden Ratio**.

*   **Phi (φ)**: `1.618`
*   **Half-Phi**: `1.309` (approx `1 + (φ - 1) / 2`)

**The Logic:**
1.  **Mobile (Half-Phi)**: On smaller screens, the extreme contrast of the Golden Ratio is too aggressive. Phidelity uses a "dampened" scale (`1.309`) to maintain hierarchy without breaking the viewport.
2.  **Desktop (Full-Phi)**: On larger screens, the system blossoms into the full Golden Ratio (`1.618`) for dramatic, editorial typography.

**3. Application Mode (Optional)**
For complex dashboards or dense "Application Tools" where the full Golden Ratio creates text that is too large, you can force the "Half-Phi" scale (`1.309`) on desktop.
*   **Usage**: Add the class `.mode-app` to the `<body>`.
*   **Effect**: Text scales remain tight and information-dense, perfect for tools and data-heavy interfaces.

**Formulas:**
*   `--type-base`: 1rem
*   `--type-h3`: `Base * Scale`
*   `--type-h2`: `Base * Scale²`
*   `--type-h1`: `Base * Scale³`
*   `--type-caption`: `Base / Scale`

This ensures that `<h1>` relates to `<p>` in exactly the same mathematical way that a Grid Cell relates to the Container.

### Calculated Colors
Just like typography, color is not arbitrary. The shading scale is generated by deriving values from **255** (White) divided by **Phi (`1.618`)**.

**The Formula:**
`255 / 1.618` ... iteratively applied to generate the sequence.

**The "Phi Scale" (0-255):**
*   **0** (#00)
*   **14** (#0E)
*   **37** (#25)
*   **60** (#3C)
*   **97** (#61)
*   **158** (#9E)
*   **195** (#C3)
*   **218** (#DA)
*   **241** (#F1)
*   **255** (#FF)

This sequence creates the "Strict Phi Palette" used for all monochrome and accent variations (e.g., `--mono-02` is `#0E0E0E`, `--mono-04` is `#3C3C3C`).

### UI Tokens
-   `--c-bg`: Background color.
-   `--c-text`: Primary text color.
-   `--c-border`: Default border color.

---

## 5. Widget Development Guide

### Concept: The "Grid-Perfect" Widget
Widgets are independent components that live inside a Section's zone.

### Building a Widget
1.  **Container**: Set `container-type: inline-size` on the widget wrapper.
2.  **Grid**: Phidelity does not enforce a global grid on widgets; widgets should define their own internal grid logic based on container size, but usually adhere to the **24n + 2** philosophy for consistency.
3.  **Placement**: Use `grid-column` to place items relative to your internal grid.
