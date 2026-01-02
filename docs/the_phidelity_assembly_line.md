# The Phidelity Assembly Line
> **Concept:** Treating the Enterprise Website not as a "Project" but as a **Manufacturing Process**.

This document outlines the flow of raw materials into a finished product.

## Phase 1: Procurement (Raw Materials)
Before we build anything, we gather the certified parts.
*   **The Atoms (Designsystemet)**: We import the crate of LEGO bricks (Buttons, Inputs, Icons).
    *   **"Smart Packets"**: These are self-contained logic units (Validation, WCAG).
*   **The Paint (Brand Guide)**: We import the specific color buckets and typography rules.

### The Inventory (Sanity CMS)
*   **Role**: The Database of **Instances**.
*   ** Distinction**:
    *   **The Code (GitHub)**: Holds the *Template* (e.g., "A Hero Component exists").
    *   **The CMS (Sanity)**: Holds the *Instances* (e.g., "The About Us Hero", "The Homepage Hero").
*   **Action**: Sanity tells us *which* widgets to use and *what* to put inside them.

## Phase 2: The Widget Factory (Phidelity)
Here, we combine raw materials into usable components.
*   **The Three Layers of Design**:
    1.  **Brand Guide (Macro)**: Defines the **Full Palette**, **Illustrations**, and **Brand Icons** (Logos, Social).
    2.  **Designsystemet (Micro)**: Provides the **Core Icons** (Search, Menu).
    3.  **Phidelity Extension (Local Micro)**: Holds the **Extended Icon Library** (Cart, Compare, User) that we cannot add to the upstream Designsystemet.
    4.  **Phidelity (layout)**: Defines the *Geometry* (Where the button sits, how large the image is).
*   **The Assembly**: inside a `phi-hero.js` file, we:
    1.  Place the **Atom** (Button).
    2.  Apply the **Paint** (Brand Colors).
    3.  Define the **Empty Slot** (`<slot name="title">`).
*   **Output**: A standardized Web Component that is *visually complete* but **content-empty** (or using dummy placeholders).

### The Hierarchy of Assembly
Phidelity follows a strict nesting order (Atomic Design):
1.  **Atom**: The raw `<Button>` (from Designsystemet).
2.  **Molecule**: A "Search Bar" (Input + Button + Icon).
3.  **Organism (Widget)**: A `<phi-header>` which contains:
    *   The **Brand Logo** (from Brand Assets).
    *   The **Navigation** (an Organism itself).
    *   The **Search Bar** (a Molecule).
*   **Result**: The `<phi-header>` is the "Independently Deployable Increment." You can drop it on any page, and it brings its children (Nav, Search, Logo) with it.

## Phase 3: Final Assembly (The Head / Astro)
This is the production line where the car is put together and fueled.
*   **The Chassis**: Astro builds the HTML page structure.
*   **The Fuel (Sanity & APIs)**: This is where **Real Data** enters the building.
    *   **Sanity**: Content Fuel (Text, Images).
    *   **ERP/PIM**: Product Fuel.
*   **Fueling**: Astro injects the Real Data into the **Widget Slots**.
    *   *Real Sanity Data* -> *Phidelity Widget Slot*.
    *   *Sanity Data* ("Welcome to Phidelity") -> *Widget Slot* (`<h1 slot="title">`).
*   **Integration**: If a fancy feature (Mortgage Calculator) is needed, Astro mounts a **React Island** into the dashboard.

## Phase 4: Shipping (Deployment / Azure)
The car is finished. Now we deliver it to the customer.
*   **Logistics (CI/CD)**: GitHub Actions wraps the finished site into a container or static bundle.
*   **Security Check (Auth)**: If this is an Internal Vehicle (Intranet), we install the keycard reader (Entra ID / Azure AD).
*   **Delivery (CDN)**:
    *   **Public Cars**: Parked on **Azure Static Web Apps** (instantly available globally).
    *   **Private Cars**: Parked in **Azure App Service** (secure garage).

## Summary
We verified that we never "hack" a solution on the spot. We always follow the line:
**Atom** -> **Widget** -> **Page** -> **Ship**.
