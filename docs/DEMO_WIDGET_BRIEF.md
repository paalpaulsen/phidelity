# Demo Widget Suggestion: "The Phidelity Omni-Card"

To demonstrate the power of the 6-Layer Architecture, we need a widget that is "Dense" enough to require every layer but "Simple" enough to understand at a glance.

**Suggestion:** A **"Performance Analytics Card"** (e.g., "Q3 Revenue Report").

![The Omni-Card Architecture Mapping](/Users/ppaulsen/Phidelity/docs/images/architecture_widget_map.png)

This widget combines typography, interactive controls, data visualization, and structure.

---

## 1. The Anatomy of the Widget (Layer Mapping)

Here is how we map the parts of this widget to the "parts of different layers":

### L1 Token (The DNA)
*   **The Colors:** The Chart's data lines use `var(--brand-primary)` and `var(--brand-secondary)`. The "Trend Up" arrow uses `var(--semantic-success)`.
*   **The Fonts:** The Revenue Number uses `var(--font-display)`. The labels use `var(--font-body)`.

### L2 Component (The Supply Chain)
*   **Simple Component:** The **"Export PDF" Button** and **"Timeframe" Dropdown** come directly from **Designsystemet** (`<ds-button>`, `<ds-select>`).
*   **Compounded Component:** The **Chart** itself is an instance of **Apache eCharts**, wrapped as a generic `ReusabledChart` component.

### L3 Widget (The Factory)
*   **The Physics:**
    *   **The Grid:** The internal layout of the card uses a local **13-column Phidelity Grid**.
    *   **Golden Ratio:** The height of the chart area relative to the header is exactly `1 : 1.618`.
    *   **Responsive:**
        *   *Mobile:* Stacked Layout (Header -> Chart -> Footer).
        *   *Desktop:* Landscape Layout (Header Left -> Chart Right).
*   **The Container:** The card wrapper itself.

### L4 Content (The Soul)
*   **The Data:**
    *   Title: "Nordic Region Revenue"
    *   Value: "$4.2M"
    *   Trend: "+12%"
    *   Chart Data: `[120, 132, 101, 134...]` (Array of numbers).
    *   *Source:* Fetched from Sanity/JSON.

---

## 2. The Responsive Plan (The Phidelity Grid)

We will demonstrate adaptation across three Phidelity Breakpoints, showing how **Physics (L3)** can control **Content (L4)** display:

*   **Small (Mobile / 26 Col Context): "Focus Mode"**
    *   **Behavior:** Space is limited. We cannot show all data.
    *   **UI:** Shows **One Graph** at a time.
    *   **Control:** Adds a **Segmented Control** (Designsystemet Toggle) to switch views: [ Revenue | Users | Retention ].
    *   **Grid:** Stacked Vertical.

*   **Medium (Tablet / 50 Col Context): "Comparison Mode"**
    *   **Behavior:** More space allows for context.
    *   **UI:** Shows **Revenue Graph** (Main) + **Users Graph** (Secondary) side-by-side.
    *   **Control:** "Retention" is moved to a summary footer.
    *   **Grid:** 2-Column Split (24 cols | 2 cols gap | 24 cols).

*   **Large (Desktop / 74 Col Context): "Dashboard Mode"**
    *   **Behavior:** Full visibility. "God Mode" view.
    *   **UI:** Shows **All Three Graphs** simultaneously.
    *   **Control:** The Segmented Control **disappears** (it's no longer needed).
    *   **Grid:** Golden Ratio Split (Main Revenue Chart left, vertical stack of small sparklines right).

---

## 3. Why this Widget?
It forces us to prove:
1.  **State-Driven Layout:** The L3 Widget must hold "Local State" (which tab is active?) only on Mobile.
2.  **Conditional Rendering:** The "Switch" component only renders at `< 50` cols.
3.  **Style Injection:** Can we style the *inside* of the 3rd party eChart using our L1 Brand Tokens?
4.  **Composition:** Can we place a Designsystemet Button *next* to a React eChart inside a Phidelity Grid?
