# Decision Record: The Hybrid Layout Engine

**Status:** Adopted
**Context:** The user requested to use a utility-class engine (like Tailwind or Panda) *exclusively* for the Layout Layer, while keeping components isolated.

## 1. The Decision
We will adopt a **Hybrid Architecture** that strictly separates Micro and Macro concerns.
We will use **Panda CSS** as the engine for the Layout Layer.

## 2. The Architecture

### 2.1 The "Micro" World (Components)
*   **Scope:** Buttons, Inputs, Cards, unique Widgets.
*   **Technology:** CSS Modules / Vanilla Extract / Standard CSS.
*   **Rule:** Components MUST NOT use utility classes for their internal styling. They must own their styling completely to remain portable "Black Boxes".

### 2.2 The "Macro" World (Layouts)
*   **Scope:** The Canvas, Sections, and the *positioning* of Widgets.
*   **Technology:** Panda CSS (Utility Classes).
*   **Rule:** Layouts MUST NOT touch internal component properties (color, font-size, border-radius). They only control *placement* and *sizing*.

---

## 3. Why Panda CSS?
Reflecting the user's requirement for strict "Phidelity Compliance":

1.  **Type Safety:** Panda generates TypeScript definitions from our `tokens.json`. Developers get autocomplete for `gap: "phi.space.3"` but an error for `gap: "20px"`.
2.  **Build-Time Generation:** Unlike runtime CSS-in-JS, strictly static CSS is generated.
3.  **Scoping:** We can configure Panda to *only* scan the `apps/platform/layouts` folder, making it physically impossible to use it inside `packages/primitives`.

## 4. The "Just Layout" Configuration
We will explicitly disable the generation of non-layout utilities to prevent "leakage".

**Allowed Utilities:**
*   **Flex/Grid:** `display`, `flex-direction`, `grid-template-columns`, `gap`, `align-items`, `justify-content`.
*   **Sizing:** `width`, `height`, `min-width`, `max-width` (Mapped to Grid column spans).
*   **Spacing:** `margin`, `padding` (Mapped to Phidelity Spacing Scale).
*   **Position:** `relative`, `absolute`, `z-index`.
*   **Visibility:** `display: none/block`.

**Forbidden Utilities (Disabled in Config):**
*   **Typography:** No `text-xl`, `font-bold`. (Text styles are semantic Atoms).
*   **Color:** No `bg-red-500`, `text-blue-100`. (Colors are owned by Components/Themes).
*   **Effects:** No `shadow-lg`, `rounded-md`. (Skin is owned by Components).

---

## 5. Example Usage

```tsx
```tsx
// ✅ CORRECT: Pure Layout Composition
<div className={css({ 
  display: 'grid', 
  columns: '12', 
  gap: 'phi.space.5',
  paddingY: 'phi.space.8' 
})}>
  
  <div className={css({ columnSpan: '4' })}>
    <PhiCard /> {/* Component handles its own look */}
  </div>

  <div className={css({ columnSpan: '8' })}>
    <PhiChart />
  </div>

</div>
---

## 6. Recommendation: The Brick vs Mortar Standard
The user asked: *"Is your recommendation to always pair Phidelity up with Panda? Or will pure html/css for making widgets suffice?"*

**Verdict: Use the right tool for the layer.**

### 6.1 For Widgets (The Bricks) -> Recommendation: Vanilla / Standard CSS
Your approach of using vanilla HTML/CSS (`BentoBox.js`) is **Standard CSS**.
*   **Why:** IT makes the widget "Portable". You can drop that Bento Box into a Wordpress site, a React App, or a Ruby app, and it just works. It has zero dependencies on Panda.
*   **Verdict:** Continue using Vanilla/Standard CSS for individual Widgets.

### 6.2 For Applications (The Mortar) -> Recommendation: Panda CSS (Optional but Recommended)
When building the **Platform** that holds 50 widgets together, we recommend Panda.
*   **Why:** You need to orchestrate the *space between* the widgets. You need to ensure the grid is 50 columns. You need type safety for the overall architecture.
*   **Verdict:** Use Panda to *assemble* the page.
*   **Nuance:** If you prefer, you **CAN** use Vanilla CSS Grid for the layout shell too! (`display: grid; grid-template-columns: ...`). Panda is just a tool to help you write that CSS faster and safer. It is not required if you prefer manual control.

---

## 5. The Ultimate Composability Test
The user asked: *"Can we then JUST use Panda or JUST Tailwind? In the spirit of Composable Design, this should be options for the Layout layer."*

**Verdict: YES.**
Because we have strictly forbidden Components from relying on the Layout Engine (see Rule 2.1), the Layout Layer is **Swappable**.

*   **Scenario A (Phidelity Strict):** Use the pre-configured Panda engine with strict Golden Ratio enforcement.
*   **Scenario B (Generic Tailwind):** A client deletes the Phidelity Layout package and installs standard Tailwind.
    *   **Result:** They write `<div class="grid grid-cols-12 gap-4">`. (They lose the "Clean HTML" recipe system unless they rebuild it).
    *   **Impact:** The `<PhiCard>` still looks perfect inside that generic grid because it carries its own styles.

**This proves the architecture is truly Composable.** The "Mortar" can be changed without breaking the "Bricks", even if the new mortar looks different.
