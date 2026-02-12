# Layer 2: Component Taxonomy (Supply Chain)

This document defines the raw materials (Atoms, Molecules, Modules) that supply the Widget layer.

---

## 1. The Foundation Level (Repo B)
*This combined layer contains both pure HTML Atoms and complex Global Molecules. Many libraries (like Designsystemet) provide both.*

### 1.1 Atoms (Pure HTML / Single Cell)
*Simple, dumb, resilient. These maps 1:1 with HTML tags.*


*   **Text Content:** `p`, `blockquote`, `ul`, `ol`, `li`, `dl`, `dt`, `dd`, `figure`, `figcaption`, `hr`, `pre`, `h1-h6`.
*   **Inline Text:** `a`, `strong`, `small`, `s`, `cite`, `q`, `code`, `data`, `time`, `span`, `br`.
*   **Media / Embedded:** `img`, `iframe`, `embed`, `object`, `picture`, `source`, `canvas`, `video`, `audio`.
*   **Table:** `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `col`, `colgroup`.
*   **Form:** `button`, `input`, `label`, `select`, `textarea`, `fieldset`, `legend`, `datalist`, `optgroup`, `option`.
*   **Interactive:** `details`, `summary`, `dialog`.

### 1.2 Molecules (Global Logic / Multi Cell)
*Complex, smart, necessary.*
*   **Navigation:** `Tabs`, `Breadcrumbs`, `Pagination`, `Dropdown Menu`.
*   **Input:** `Datepicker`, `Search Autocomplete`, `Multi-Select`.
*   **Feedback:** `Toast`, `Modal`, `Tooltip`, `Alert`.
*   **Containers:** `Card Surface`, `Badge`, `Avatar`, `Accordion`.

### 1.3 Reference: Designsystemet Molecules
*Applying the Phidelity Taxonomy to an external vendor library (Atoms filtered out).*

*   **Navigation:** Breadcrumbs, Pagination, Tabs, SkipLink.
*   **Input Control:** Chip, Dropdown, Search, Suggestion, Switch, Tag, ToggleGroup, Textfield (Wrapper).
*   **Feedback:** Alert, ErrorSummary, Popover, Spinner, Tooltip, ValidationMessage, Skeleton.
*   **Containers/Display:** Avatar, AvatarStack, Badge, Card, Divider, Field.

---

## 2. Modules
*External Modules. These are massive systems we treat as black boxes.*

*   **Google Maps:** (Canvas + API)
*   **Video Player:** (YouTube / Vimeo / Custom Player)
*   **Rich Text Editor:** (TinyMCE / Tiptap)
*   **Chart / Graph:** (Highcharts / D3)
*   **Payment Provider:** (Stripe Elements)
*   **Social Feed:** (Instagram Embed)
*   **Recaptcha**
*   **Analytics / Heatmaps:** (Google Analytics / GTM / Hotjar)
*   **Consent Manager:** (Cookiebot / OneTrust)
*   **Chat & Support:** (Intercom / Zendesk / Messenger)
*   **Ad Tech:** (Doubleclick / AdSense)

---

## 3. Brand Assets
*Identity-specific content that gives the system its personality. These are content, not styles.*

*   **Illustrations:** (Undraw, Custom Vectors)
*   **Photography:** (Unsplash, Art Direction Guidance)
*   **Logos and Brand Shapes:** (Brand Guide, Marks, Favicons)
*   **Patterns & Textures:** (Background noise, repeated motifs, surface materials)
*   **Complex Gradients:** (Mesh gradients, image-based color fields)
*   **Tone of Voice:** (Snippets, Copy Guidelines, Error Message Persona)
*   **Motion & Video:** (Lottie files, Intro stingers, Background loops)
*   **Audio:** (Sonic branding, Earcons)
*   **3D Objects:** (Splines / GLB models / WebGL scenes)
