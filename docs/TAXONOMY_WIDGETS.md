# Layout Part 2: Widget Taxonomy (The Content)

**Role:** The Artist.
**Definition:** Self-contained, responsive business units that maintain their integrity regardless of where they are placed.

---

## 1. The Rules of Agnosticism
*   **No Hardcoded Physics:** Widgets must never define `border-radius: 4px` or `transition: 200ms`.
*   **Token Consumption:** Widgets must request abstract traits: `radius="medium"`, `speed="fast"`.
*   **The Result:** The same widget code can feel "Round & Bouncy" for Brand A, and "Square & Instant" for Brand B, purely based on the injected Physics Tokens.

---

## 2. The Phidelity Grid (Container Query Based)
*The specific "LEGO Board" inside the widget. This is the Micro-Layout.*

*   **Definition:** A high-density grid used for complex formatting *inside* a container.
*   **Tracks:** 26, 50, 74, 98 Columns (Golden Ratio scales).
*   **Behavior:** Components snap to these tracks using `phi-col-span`.
*   **Context Ignorance:** It doesn't know about the screen size, only its container width.

---

## 3. The Organisms (Phidelity Widgets)
*These compose L1 Tokens and L2 Components into "Business Value".*

### 3.1 Content Widgets
*   **Hero Section:** (Section + H1 + Image + CTA)
*   **Product Card:** (Card Surface + Image + H3 + Button)
*   **Article Body:** (Rich Text + Images + Quotes)

### 3.2 Functional Widgets
*   **Contact Form:** (Card + Input Group + Submit Button + Recaptcha)
*   **Newsletter Signup:** (Input + Button)

### 3.3 Structural Widgets
*   **Global Header:** (Nav + Logo + Search)
*   **Footer:** (Grid + Links + Social Icons)
