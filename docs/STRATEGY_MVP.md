# Strategy: The "Path of Least Resistance" MVP

**Goal:** Ship a White Label Composable Design System with the absolute smallest footprint.
**Philosophy:** Only solve the universal problems. Use specific, robust Open Source tools for everything else.

---

## 1. The MVP Stack
*We choose specific technologies to reduce decision fatigue and ensure compatibility.*

*   **Layer 1: Tokens (Identity)** -> **Git / JSON**
    *   *Why:* "Almost never" updated. Overkill to have a DB. Git provides version history and simple editing.
*   **Layer 2: Components (Bricks)** -> **Designsystemet** (NAV)
    *   *Why:* Enterprise-grade, accessible, and the **standard for the Norwegian public sector**. Simplifies adoption locally.
*   **Layer 3: Widgets (Physics)** -> **Phidelity**
    *   *Why:* The only layer we build. It provides the glue and the grid.
*   **Layer 4: Content (Data)** -> **Strapi**
    *   *Why:* Unified with the Token provider. One backend to rule them all.
*   **Layer 5: Build (Assembly)** -> **Astro**
    *   *Why:* "Islands Architecture" handles static content (Articles) and interactive widgets (Search) perfectly. Zero-JS by default.

---

## 2. The Standard Inventory (Scope)
*We ship ONLY the Lowest Common Denominator. Every web product needs these.*

### 2.1 Widgets (The Furniture)
*   **Global Header:** Logo + Navigation + Search Trigger.
*   **Global Footer:** Sitemap + Social Links + Legal/Copyright.
*   **Navigation:** Responsive List (Burger menu interactions).

### 2.2 Templates (The Rooms)
*   **Front Page:** The "Cover". A vertical stack of Teasers/Cards.
*   **Article Page:** The "Reader". Typography focused content view.

---

## 3. The Promise
By strictly limiting the scope to these 5 items (3 Widgets, 2 Templates) and 4 technologies, we can deploy a fully functional, brandable website in **hours**, not weeks. This provides the "Skeleton" upon which clients can build their specific muscle.
