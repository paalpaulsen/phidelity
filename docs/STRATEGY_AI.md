# Strategy: AI (The Copilot)

**Role:** The Force Multiplier.
**Definition:** AI is not a "Layer". It is a vertical force that runs through *all* layers, acting as a Generator, Optimizer, and Librarian.

---

## 1. AI in Design (The Generator)
*Where AI accelerates creativity and production.*

### Layer 1: Tokens (Brand)
*   **Role:** The Colorist.
*   **Action:** Generating accessible color palettes or "Theme Variations" (e.g., "Generate a Dark Mode based on this Primary Blue").
*   **Tool:** OpenAI / Figma Plugins.

### Layer 3: Layouts (The Composer)
*   **Role:** The Builder.
*   **Action:** "Build me a Hero Section with a Video and a Sign-up Form."
*   **Value:** Because our Widgets are standardized (Phidelity), AI can easily "snap" them together. It understands our "Language" (Widgets) better than raw HTML.

### Layer 4: Content (The Writer)
*   **Role:** The Sub-Editor.
*   **Action:**
    *   **Summarization:** "Create a 50-word summary for this article."
    *   **Translation:** "Translate this Product Description to Norwegian."
    *   **Tagging:** "Analyze this text and assign 5 relevant taxonomy tags."
    *   **SEO:** "Rewrite this title to be more engaging."

---

## 2. AI in Coding (The Engineer)
*Where AI handles the boilerplate and quality assurance.*

### Layer 2: Components (The Maintainer)
*   **Role:** The Janitor.
*   **Action:** Writing Unit Tests, generating Documentation (JSDoc), and refactoring legacy code.
*   **Value:** Keeping the "Bricks" clean and well-documented.

### Layer 5: Build (The Optimizer)
*   **Role:** The QA Analyst.
*   **Action:** Analyzing build logs for errors, suggesting performance optimizations (e.g., "This image is too large"), and detecting security vulnerabilities.

---

## 3. AI in Governance (The Librarian)
*Where AI manages complexity.*

### Layer 7: Governance (The Oracle)
*   **Role:** The System Copilot.
*   **Problem:** "I don't know if we already have a 'Date Picker' component."
*   **Solution:** An AI Chatbot trained on our Documentation and Codebase.
*   **Interaction:**
    *   *User:* "Do we have a Date Picker?"
    *   *AI:* "Yes, `DatePicker` exists in `packages/core`. Here is the Figma link and the GitHub link."
    *   *User:* "Is it accessible?"
    *   *AI:* "Yes, it passed WCAG AA audits in the last CI run."

---

## 4. The Vanilla Advantage (AI Readiness)
*   **The Insight:** LLMs are trained on the entire internet. The internet is built on **HTML and CSS Standards**.
*   **The Problem with Frameworks:** Highly abstract frameworks (like specialized runtime-heavy UI libraries) require the AI to "learn" a proprietary syntax.
*   **The Phidelity Solution:** By staying "Close to Vanilla" (Standard Grid, Standard CSS, Semantic HTML):
    *   **Zero Learning Curve:** The AI doesn't need fine-tuning. It already knows how `<div>` and `grid-template-columns` work.
    *   **High Accuracy:** The AI is less likely to hallucinate because it is writing standard code, not framework-specific abstractions.
    *   **Future Proof:** As AI improves at "Writing Web Code", Phidelity automatically benefits.

## 5. The Lego Principle (Deterministic Assembly)
*   **The Concept:** Because Level 2 Components are "Ready Made" (imported from npm), the AI **never writes component source code**.
*   **The Shift:** The AI shifts from "Writing Code" (High Risk) to "Calling Functions" (Low Risk).
    *   *Bad AI Task:* "Write me a Date Picker component in React." (Result: Buggy, unstyled mess).
    *   *Phidelity AI Task:* "Import `<DatePicker>` from `@designsystemet` and place it here." (Result: Perfect, accessible, branded).
*   **Safety:** The AI acts as a **Construction Worker** placing certified bricks, not a **Manufacturer** trying to invent a new type of brick on the fly.

## 6. The Missing Link (Layout) & The Wizard (AI)
*   **The Missing Link:** The *Layout Layer* is the bridge between the **Design System** (Potential) and the **CMS** (Data). It turns "Buttons" and "Text" into functioning "Tools" (Widgets).
*   **The Widget Wizard:** AI assists the **UX Designer** (The Pilot) in constructing this bridge.
    *   **The Collaboration:**
        *   *Designer:* Defines the *Intent* ("I need a News Feed here").
        *   *AI:* Writes the **Vanilla CSS Grid** code to execute that intent, connecting the DS Components to the CMS Content.
    *   **The Advantage:** Because Phidelity uses standard CSS (Vanilla), the AI produces clean, responsive layout code instantly, allowing the Designer to focus on flow and function.
