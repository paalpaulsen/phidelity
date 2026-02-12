# Content Taxonomy

**Role:** The "Voice" of the System.
**Definition:** How data flows into the layout. We distinguish content by its *Lifecycle* and its *Source*.

---

## 1. Taxonomies (The Dictionaries)
*   **Definition:** Structured lists of reference data used to classify content or label the UI.
*   **Source:** Sanity (Singletons & Document Lists).

### 1.1 Interface (The UI Strings)
*   **Role:** Static text required for the application to function.
*   **Examples:**
    *   **Buttons:** "Submit", "Cancel".
    *   **Labels:** "Contact Us", "Read More".
    *   **Messages:** "404 Not Found", "Loading...".

### 1.2 Classification (The Content Structure)
*   **Role:** Metadata used to group and filter Content Types.
*   **Examples:**
    *   **Categories:** "News", "Tutorials", "Opinions".
    *   **Tags:** "CSS", "Design", "React".
    *   **Menus:** Header Links, Footer Columns.

## 2. Content Types (The Data)
*   **Definition:** The Schema. Defines *what* the content is and what fields it possesses.
*   **Source:** Sanity (Schema Definition).
*   **Types of Data:**
    *   **Documents:** Reusable records (Article, Product, Person).
    *   **Singletons:** Unique system pages (Settings, Global Config).

### 2.1 Schema Ingredients (The Fields)
*The atomic data columns that compose a Content Type:*
*   **Text:** Title, Summary, Body, Eyebrow/Label.
*   **Media:**
    *   *Images:* Promo Thumbnail, Landscape (16:9), Portrait (3:4), Panorama, Square.
    *   *Video:* Stream URL, Cover Image, Duration.
*   **Categorization:** Reference to *Taxonomies* (Tags, Categories).
*   **Numeric:** Size, Weight, Price, Inventory Count.
*   **Time:** Publish Date, Edit Date, Event Start/End.
*   **Geography:** Geo Position (Lat/Long), City, County, Country.
*   **People:** Author, Editor, Owner, Reference.

## 3. Template Builder (The Configuration)
*   **Definition:** The Builder. A mechanism to configure *how* a Content Type is rendered.
*   **Capabilities:**
    *   **Selection:** Choose which Layout to use (e.g., "Panorama" vs "Wide").
    *   **Composition:** Choose which Widgets to include (e.g., "Add Newsletter Block").
    *   **Sequencing:** Reorder the fields/widgets.
    *   **Visibility:** Hide specific data fields (e.g., "Hide Author Name").
*   **Role:** Separation of Data (Content Type) and View (Builder). One Content Type can have multiple Builder Configurations.
*   **Examples:**
    *   **Article Panorama:** Renders the Article with a huge hero image on top.
    *   **Article Wide:** Renders the *same* Article data, but with a wide data-table layout and no hero image.
*   **Configuration:** The Content Editor configures this builder in Sanity.

## 4. External APIs (The Inventory)
*   **Definition:** Data that originates outside the CMS. It is strictly structured and often read-only.
*   **Source:** 3rd Party (Stripe, Personio, Pimcore).
*   **Integration Strategy:**
    *   **The Reference Pattern (Curated):** Ideally, these flow *through* Sanity as **references**.
        *   *How:* We sync a lightweight "Stub" (ID + Title) to Sanity.
        *   *Benefit:* Editors can *manually select* a specific Product or Job to place on a Landing Page.
    *   **The Enrichment Pattern (Shadow):**
        *   *Goal:* Treat external items (Products) as full Phidelity Pages with custom layouts.
        *   *How:* Import *all* relevant fields (Images, Specs) into Sanity, essentially mirroring the PIM.
        *   *Benefit:* You can use the **Template Engine** to compose the Product Page (e.g., insert a "History of Air" widget block inside the "Nike Air Max" product page).
        *   *Trade-off:* Requires robust sync pipelines (Webhooks) to keep Sanity up to date with PIM.
*   **Examples:**
    *   **Open Positions:** Job ID, Department, Location (Source: Personio/Teamtailor).
    *   **Product DB:** SKU, Price, Stock Level (Source: Shopify/PIM).
    *   **Real-time Data:** Stock prices, Weather, Event availability.

---

## 5. The Language Strategy (Dimension)
In a Composable System, "Language" is not a separate folder. It is a **Dimension** that cuts across all 4 layers.

### Strategy: Field-Level Translation (Portable Text)
We do not duplicate documents for each language (e.g., `/en/home` and `/no/home`). Instead, **each field contains all languages.**

**Why?** It keeps the *Structure* (Layout) consistent across languages, while changing only the *Voice*.

#### Implementation by Layer:
1.  **Taxonomies:**
    *   `submitButton: { en: "Send", no: "Send inn" }`
    *   *Result:* The layout never breaks because "Send inn" is just a prop.
2.  **Content Types:**
    *   `body: { en: [Block], no: [Block] }`
    *   *Result:* You can have totally different paragraph structures per language, but they live in the same "Article ID".
3.  **Template Builder:**
    *   `templateName: "gallery-view"` (This string is rarely translated; it's a technical config).
    *   *Note:* Templates themselves don't hold content; they arrange the Content Type's fields.
4.  **APIs:**
    *   **Challenge:** External APIs often return only one language.
    *   **Solution:** The "Phidelity Wrapper" (in `packages/modules`) usually requests the specific locale from the API based on the user's current context context: `fetch('/api/products?lang=no')`.


