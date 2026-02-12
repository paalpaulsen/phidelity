# Architecture: The Phidelity Monorepo

To achieve the vision of "Independent Repos" that can be fetched/referenced, we utilize a **Monorepo Architecture** (Workspace).
This treats every major layer of the system as a distinct internal package.

## 1. The Workspace Structure
The `packages/` directory contains the "Protected Folders" representing the source of truth for the system.

```text
/phidelity-monorepo
├── /apps
│   └── /platform           # The "Visual Builder" (The Consumer)
│
├── /packages               # The "Independent Repos" (The Suppliers)
│   ├── /tokens             # The DNA
│   ├── /primitives         # The UI Kit (Designsystemet Adapter)
│   ├── /brand-assets       # The Personality
│   └── /modules            # The Capabilities
│
└── package.json            # Workspace Config
```

---

## 2. Package Definitions

### 2.1 `packages/tokens` (The Physics)
*   **Role:** The single source of truth for design values.
*   **Strategy:** Pure Data.
*   **Contents:**
    *   `physics.css` (Golden Ratio scales, easing).
    *   `brand.css` (The null defaults, overridable by clients).
    *   `tokens.json` (Raw data for the Visual Builder to consume).

### 2.2 `packages/primitives` (The UI Adapter)
*   **Role:** Providing the basic building blocks.
*   **Strategy:** Wrapper Pattern.
*   **Implementation:**
    *   It imports `designsystemet` (or any other base lib).
    *   It wraps them to enforce Phidelity Grids and spacing.
    *   It exports `<PhiButton>`, `<PhiInput>`, etc.

### 2.3 `packages/brand-assets` (The Content Layer)
*   **Role:** A central registry for all brand personality assets.
*   **Sub-Packages / Exports:**
    *   `@phidelity/assets/icons` -> Exports Lucide (SVG).
    *   `@phidelity/assets/graphics` -> Exports Undraw & Unsplash URLs/SVGs.
    *   `@phidelity/assets/audio` -> Exports Material Sounds (MP3/WAV).
    *   `@phidelity/assets/3d` -> Exports Kenney Models (GLB).
    *   `@phidelity/assets/voice` -> Exports Tone-of-Voice JSON schemas.

### 2.4 `packages/modules` (The Capability Layer)
*   **Role:** Standardized wrappers for complex 3rd party tools.
*   **Strategy:** "Batteries Included" integration.
*   **Exports:**
    *   `GoogleMaps` -> Wraps Google Maps API.
    *   `VideoPlayer` -> Wraps YouTube/Vimeo.
    *   `RichText` -> Wraps Tiptap.
    *   `Payment` -> Wraps Stripe Elements.
    *   `Analytics` -> Wraps GA4/Hotjar scripts.
    *   `Feeds` -> Wraps Instagram/Pinterest embeds.

---

## 3. The "Fetching" Mechanism
Because these are packages, the "Visual Builder" App doesn't need to copy files. It simply `imports` them:

```javascript
import { PhiButton } from '@phidelity/primitives';
import { HeroPattern } from '@phidelity/brand-assets';
import { PhiMap } from '@phidelity/modules';
```

When a **Client** wants to "sever the connection" or "eject", they can simply copy the specific package source code into their own `packages/` folder and stop updating it from the Phidelity master.
