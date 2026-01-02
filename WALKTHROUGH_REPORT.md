# Safari Performance Fixes

I have applied the following logical and styling optimizations to address the rendering slowness in Safari.

## Changes

### 1. Reduced Shadow Complexity
Large, high-blur shadows are very expensive for the browser's compositor.
- **Body Shadow**: Reduced blur from `100px` to `25px`.
- **Mobile Navigation**: Reduced blur from `50px` to `15px`.

### 2. Layout Optimization
- **Content Visibility**: Added `content-visibility: auto` to the `.zone` class. This allows the browser to skip styling and layout for content that is off-screen, significantly reducing the initial load and scroll overhead for complex grid layouts like yours.

## Verification
Please open `index.html` in Safari and verify:
1.  **Scrolling Performance**: Is it smoother?
2.  **Visuals**: Do the reduced shadows still look acceptable?
3.  **Scrolling Stability**: Does the scrollbar behave normally (no massive jumping)?

## Next Steps
If performance is still an issue, the next step would be to simplify the `GridDisplay` component, which generates a very large number of DOM nodes and CSS rules for the 194-column overlay.

# Safari Resize Fix

I have removed the CSS transition on the main grid layout. This resolves the rendering artifacts seen when resizing the browser window, particularly in Safari.

## Changes

### CSS (macro.css)
- **Removed Transition**: Deleted `transition: grid-template-columns ...` from `.shell-body`.
- **Why**: Removing the transition prevents intermediate "glitchy" states during resize, ensuring Container Queries fire against the correct final width immediately.

# Right Nav Layout Fix

I addressed an issue where the right navigation would not indent the main content (allocate grid space) when the left navigation was also active.

## Changes

### CSS (macro.css)
- **Reinforced Specificity**: Added a specific rule `body.right-open:not(.left-closed) .shell-body`.
  - Ensures the grid resolves to `362px 1fr 362px` when both sidebars are open.

## Verification
1.  Open the site on desktop (>1000px).
2.  Ensure Left Nav is visible.
3.  Toggle Right Nav Open.
4.  Verify main content shrinks to 3-column layout.

# Widget Responsiveness Fix (Safari Hardening)

Safari's rendering engine handles Grid/Flex constraints strictly. To fix layout refusals:

## Changes

### CSS (macro.css)
- **Strict Containment**: Added `max-width: 100%` and `overflow-x: hidden` to `phi-main`.

### JS (PhiMain.js)
- **Layout Engine**: Changed `<main>` from `display: flex` to `display: grid` with `grid-template-columns: minmax(0, 1fr)`. This creates a rigid "crush zone" that forces children to shrink.

### JS (PhiSection.js)
- **Wrapper Pattern**: Added internal `.wrapper` for container context to decouple it from `:host`.
- **Strict Tracks**: Changed all `1fr` templates to `minmax(0, 1fr)`.

### JS (Widgets)
- **Responsive Typography**: Injected recalibration logic into key widgets (`Hero`, `ArticleTextOnly`, etc.) to reset typography scales when container width is `< 961px`.

## Verification
1.  Open layout on Safari.
2.  Toggle Right Navigation.
3.  Observe that `phi-hero` and other widgets reflow and scale text down perfectly without horizontal scrolling.

# Documentation & Architecture

- **Orchestration Update**: Rewrote `phidelity_orchestration.md` to include:
    - **Chapter 6: The Head (Astro)**: Replacing Storybook with the Vendor-Agnostic Renderer strategy.
    - **Chapter 7: Use Cases**: Detailed strategies for External (SSG) vs Internal (SSR) apps.
    - **Chapter 8: Deployment**: formatting for Azure Hosting, Identity, and Pipelines.
- **Architecture Visualization**: Created a comprehensive Mermaid diagram illustrating the "Shared Core" feeding into both Internal and External paths.

![Architecture Diagram](/Users/ppaulsen/.gemini/antigravity/brain/a3d16bf4-d3e5-439e-bf61-0d5e547dd070/architecture_diagram_v1_1767352699960.png)
