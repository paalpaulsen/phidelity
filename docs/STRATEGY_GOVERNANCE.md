# Strategy: Governance (The Social Operating System)

**Role:** The Constitution.
**Definition:** The rules, roles, and rituals that ensure the system evolves without chaos.
**Core Principle:** "Separation of Powers".

---

## 1. The Political Model: "Federated Core" (Democracy by Design)
**Principle:** A layered separation of concerns invites a distribution of ownership.
*   **Dictatorship vs. Democracy:** Monolithic systems require a "Dictator" (The Architect) to approve every change. Layered systems allow a "Federation" (Brand, Product, Content) to govern their own domains.
*   **The Federal Deal:**
    *   **Brand** works on *Style* (Layer 1) without blocking Product.
    *   **Product** works on *Features* (Layer 3) without breaking the Grid.
    *   **Platform** protects the *Infrastructure* (Layer 5) without slowing down Content.

### 1.1 The separation of Church (Brand) and State (Product)
*   **The Constitution:** The **Layout Engine** (Phidelity) is the constitution. It cannot be broken by Brand whims.
*   **The Freedom:** The **Token Layer** is where Brand exercises totally freedom.
*   **The Result:** Brand Designers can change "Red" to "Blue" without asking permission. But they *cannot* change a "Sidebar" to a "Modal" without a System amendment.

---

## 2. The Pace Layers (Shearing Layers)
Inspired by Stewart Brand, we recognize that different layers of the system must evolve at different speeds to survive.

### 2.1 The Fast Layers (Fashion & Commerce)
*These layers change constantly. They learn quickly.*
*   **Layer 1: Tokens (Fashion):**
    *   *Speed:* **Seasonal.** (Rebrands, Campaign Adjustments).
    *   *Owner:* **Brand** (Design Director).
*   **Layer 4: Content (Commerce):**
    *   *Speed:* **Daily/Hourly.** (News, Products).
    *   *Owner:* **Editorial** (Content Managers).

### 2.2 The Middle Layers (Infrastructure)
*These layers provide the stable platform for the fast layers.*
*   **Layer 3: Layout/Widgets (Infrastructure):**
    *   *Speed:* **Sprints.** (3-week cycles).
    *   *Owner:* **Product** (Feature Teams).
*   **Layer 2: Components (Infrastructure):**
    *   *Speed:* **Quarterly.** (Slow, careful versioning).
    *   *Owner:* **System Maintainers** (3rd Party / Core Team).

### 2.3 The Slow Layers (Nature)
*The foundation. If these move too fast, the system collapses.*
*   **Layer 5 & 6: Build & Delivery (Nature):**
    *   *Speed:* **Yearly.** (Long-term stability).
    *   *Owner:* **Platform** (DevOps/CTO).
*   **Layer 7: Governance (Culture):**
    *   *Speed:* **Decadal.** (The Constitution).
    *   *Owner:* **The Senate** (Federated Tech Leads).

---

## 3. The Governing Groups (Simplified Model)
*We consolidate ownership into 4 key pillars.*

### 3.1 Brand & Marketing (The Identity)
*   **Scope:** Tokens, Brand Assets.
*   **Who:** Brand Dept / Marketing / Corp Comm.
*   **Champion:** Chief Design Officer.

### 3.2 Product Design Core (The Experience)
*   **Scope:** Components, Layouts, Content Templates.
*   **Who:** Lead Designers (Marketing & Product) + SMEs (Ad Hoc).
*   **Focus:** Ensuring the "System" serves the "User" across all apps.

### 3.3 IT & Platform (The Engine)
*   **Scope:** Build, Delivery, Security.
*   **Who:** IT Architects, App Developers, Lead Engineers.
*   **Focus:** Performance, uptime, and developer experience (DX).

### 3.4 The Plenum (The Senate)
*   **Scope:** Governance & Strategy.
*   **Who:** Representatives from the 3 groups above.
*   **Ritual:** Quarterly "State of the System" meetings.

---

## 4. The Future Development

### 4.1 Inner Sourcing (The Contribution Model)
*   **Problem:** Central teams become bottlenecks.
*   **Solution:** Any product team can build a Widget.
*   **Process:**
    1.  Team A builds a "Stock Ticker Widget" for their page.
    2.  They submit a PR to `packages/widgets`.
    3.  Core Team reviews for "Phidelity Compliance" (Is it responsive? Does it use Tokens?).
    4.  Merge. Now Team B can use the "Stock Ticker".

### 4.2 Breaking Changes (The Senate)
*   If a change affects the **Core Grid** or **API Contracts**, it requires a "Senate Vote" (Tech Leads from all consumers).
*   *Example:* Changing the Grid from 50 to 60 columns. (High Impact).

---

## 6. The Tooling (The Forum)
*Governance requires a place to speak and a place to write.*

### 6.1 The Communication Channel (Teams)
*   **Tool:** Microsoft Teams (or Slack).
*   **Usage:**
    *   **Channel:** `#system-governance`.
    *   **Purpose:** The daily "Town Hall". Where designers and devs ask: "Does a component for this exist?" or "Can I change this color?"
    *   **Value:** Transparency. Everyone sees the answer.

### 6.2 The Decision Record (GitHub)
*   **Tool:** GitHub Issues / Discussions.
*   **Usage:**
### 6.3 The Visual Source (Figma)
*   **Tool:** Figma.
*   **Usage:**
    *   **The Mirror:** The Figma structure must *exactly mirror* the Code Architecture.
        *   `Figma/Tokens` <-> `GitHub/packages/tokens`
        *   `Figma/Core-Components` <-> `Designsystemet` (Linked Library)
        *   `Figma/Widgets` <-> `GitHub/packages/widgets`
    *   **Rule:** If it doesn't exist in Figma, it shouldn't exist in Code (and vice versa).
### 6.4 The Bridge (Tokens & Variables)
*   **Tools:** Tokens Studio (Plugin) **OR** Figma Variables (Native).
*   **Usage:**
    *   **Automation:** We do *not* copy-paste hex codes.
    *   **The Pipeline:**
        1.  Designer changes "Primary Blue" in Figma (using Variables).
        2.  Designer clicks "Push to GitHub" (via Tokens Studio or REST API script).
        3.  GitHub creates a Pull Request (`feat: update brand colors`).
        4.  Developer merges. Code is updated.
    *   **Result:** Brand is the API. Code is the consumer.
