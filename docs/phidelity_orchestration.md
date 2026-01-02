# Phidelity Orchestration Layer
> **Context:** How Phidelity fits into the broader enterprise technology stack, acting as the bridge between raw atomic components (Designsystemet) and the final user experience.

## The 6-Layer Architecture

### 1. The Foundation: Designsystemet.no
**Role: Atomic Components & Primitives**
*   **What it is:** The base "LEGO bricks." Buttons, Inputs, Checkboxes. **Often distributed as React components** (or Vue/Svelte).
*   **Responsibility:** Handling the *micro-interactions* and state (hover, focus, disabled).
*   **Phidelity's Relationship:** Phidelity is **Framework Agnostic**. It defines the *Slots* and *Grids*. It doesn't care if the button inside the slot is a `React <Button />`, a `Vue <Button />`, or a raw HTML `<button>`.

### 2. The Brain: Phidelity System
**Role: Layout & Design Philosophy**
*   **What it is:** The "Orchestration Layer." It defines Space, Rhythm, Proportion, and Flow.
*   **Responsibility:**
    *   **The Grid:** The 24+2 Golden Ratio Mesh.
    *   **The Containers:** Sections (Golden, Trinity, Hexad).
    *   **The Physics:** How things grow, shrink, and stack (Container Queries).
*   **Key Concept:** Phidelity does not design the *doorknob* (Designsystemet does that); Phidelity designs the *Room*.

### 3. The Content: Sanity.io / Payload CMS
**Role: Pure Content (Headless CMS)**
*   **What it is:** The database of truth. Strings, Images, References.
*   **Responsibility:** Storing content in a purely semantic, presentation-agnostic format (Portable Text / JSON Blocks).
*   **Phidelity's Relationship:** Phidelity widgets connect to CMS schemas. A `phi-article-hero` widget maps directly to a `hero` object in Sanity or a Collection in Payload. The design system essentially visualizes the structured data.

### 4. The Code: Web Components
**Role: The Distribution Mechanism**
*   **What it is:** `phi-widget-name.js`. Custom Elements hosted in a dedicated repository (GitHub/NPM).
*   **Responsibility:** Encapsulating the logic (JS), style (CSS), and structure (HTML) into a portable unit.
*   **Strategy:** By using Web Components, Phidelity becomes framework-agnostic. It can be dropped into a React app, a Vue dashboard, or a legacy CMS without friction.

### 5. The Soul: Brand Guide
**Role: Visual Stylization**
*   **What it is:** The "Skin" or "Theme."
*   **Responsibility:** Defining the specific *flavor* of the output.
    *   **Typography:** Which font family? (Inter vs. Tiempos).
    *   **Color Palette:** The specific HSL values for `--c-accent`.
    *   **Tone of Voice:** The feeling of the UI.
*   **Phidelity's Relationship:** Phidelity consumes these via CSS Variables (`macro.css`). You can swap the Brand Guide (change the variables) without touching the layout engine (Phidelity) or the atomic logic (Designsystemet).

### 6. The Head: The Open Renderer
**Role: The Vendor-Agnostic Host**
*   **What it is:** The "Glue" that fetches data and hydrates components. Recommended: **Astro** (or standard HTML/Node).
*   **Responsibility:** 
    *   **Static Site Generation / Server-Side Rendering:** Turning data into HTML.
    *   **Routing:** Connecting specific URLs (`/about`) to specific Phidelity Sections.
    *   **Hydration:** Loading the minimal JS needed for the Web Components.
*   **Why Open?**
    *   **Zero Lock-in:** By using a standard Renderer like **Astro**, you are not tied to a specific cloud (like Vercel/Next.js). You can deploy to a basic Apache server, Docker container, AWS, or Edge.
    *   **Performance:** It strips away the framework weight, delivering raw HTML + Phidelity's native Web Components.
    *   **Future Proof:** If the "JS Framework of the Month" changes, "The Head" can be swapped out without rebuilding the entire design system or content model.

### 7. Strategy by Use Case
How "The Head" adapts for different enterprise needs while keeping the core (Phidelity/Designsystemet) identical.

#### A. External Applications (Marketing / High-Traffic / E-Commerce)
*   **Target:** Corporate Website, Online Shop, Landing Pages.
*   **Rendering Mode:** **Static (SSG)** (Default).
*   **Why:** Maximum speed, perfect SEO, 0ms Time-To-First-Byte at the Edge.
*   **Interactive Parts:** 
    *   **E-Commerce:** The "Add to Cart" button and "Cart Drawer" are **React Islands**.
    *   **Search:** The Search Bar is a **React Island** connected to Algolia/Sanity.
*   **Flow:** The user requests a page -> Global Content Delivery Network (CDN) serves pre-built HTML -> Page is instantly visible -> Cart hydrates 0.5s later.

#### B. Internal Tools (Intranets / Dashboards / Business Apps)
*   **Target:** Employee Intranet, Customer Portal, Back-office Admin.
*   **Rendering Mode:** **Server (SSR)**.
*   **Why:** Needs to check **Authentication** (Azure AD / Okta) before showing anything. Needs to fetch **User-Specific Data** (My Documents, My Team).
*   **Interactive Parts:**
    *   **Complex Forms:** Time-off requests, Travel expensing (Heavy React/Vue Forms).
    *   **Data Viz:** Live PowerBI or D3 charts.
*   **Flow:** User requests page -> Server checks Auth Cookie -> Server fetches "My Tasks" from API -> Server renders customized HTML -> Client takes over.

### 8. Deployment & Integration (Azure Example)
Since Phidelity uses agnostic building blocks (Web Components) and a standard Renderer (Astro), it integrates natively with enterprise clouds like **Azure**.

#### Hosting
*   **External Sites (SSG)**: Deploy to **Azure Static Web Apps**.
    *   *Benefits:* Global CDN (Content Delivery Network), automatic GitHub/Azure DevOps integration, extremely low cost.
*   **Internal Tools (SSR)**: Deploy to **Azure App Service** (Node.js or Docker).
    *   *Benefits:* Secure VNET integration, easy scaling, dedicated compute power.

#### Security & Identity
*   **Authentication**: Use **Astro Middleware** with `microsoft-entra-id` (Azure AD) to protect internal routes. Phidelity layouts remain visible only to authenticated employees.
*   **Secrets**: API Keys (Sanity Token, GitHub Token) are stored in **Azure Key Vault** or App Settings, injected into The Head at runtime.

#### CI/CD Pipeline (GitHub Actions)
1.  **Code**: Developer pushes changes to GitHub.
2.  **Test**: Action runs design system tests (Storybook/Vitest).
3.  **Build**: Action runs `astro build`.
    *   Fetches latest content from Sanity.
    *   Compiles React Islands and Phidelity Widgets.
4.  **Deploy**: Action pushes the `/dist` folder to Azure.

---

## Summary Diagram: The Universal Stack
This diagram shows how the same core inputs generate extremely different outputs depending on the use case.

```mermaid
flowchart TD
    %% Core Inputs
    subgraph Core ["1. The Core Assets (Shared)"]
        direction TB
        DS[Designsystemet<br/>(React Atoms)]
        PHI[Phidelity<br/>(Layout Engine)]
        CMS[Sanity CMS<br/>(Content)]
        BRAND[Brand Guide<br/>(CSS Tokens)]
    end

    %% The Head
    subgraph Head ["2. The Head (Astro Renderer)"]
        ASTRO{Astro Builder}
        MIDDLEware[Middleware<br/>(Auth/API)]
    end

    %% Deployment Paths
    subgraph Deploy ["3. Deployment Paths"]
        direction LR
        
        %% External Path
        subgraph Ext [External / Marketing]
            SSG[Static Build (SSG)]
            CDN[Azure Static Web Apps<br/>(Global CDN)]
            PUBLIC(Public Visitor)
        end

        %% Internal Path
        subgraph Int [Internal / Dashboard]
            SSR[Server Server (SSR)]
            APP[Azure App Service<br/>(Node.js)]
            ENTRA[Entra ID<br/>(Azure AD Auth)]
            PRIVATE(Employee)
        end
    end

    %% Connections
    DS & PHI & CMS & BRAND --> ASTRO
    ASTRO --> SSG
    ASTRO --> MIDDLEware --> SSR

    %% External Flow
    SSG --> CDN --> PUBLIC
    
    %% Internal Flow
    SSR --> APP --> ENTRA --> PRIVATE
```
