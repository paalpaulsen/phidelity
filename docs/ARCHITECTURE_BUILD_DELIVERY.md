# Architecture: Build & Delivery (The Factory & The Postman)

**Concept:** How the abstract Code and Content are transformed into a concrete Experience.

## 1. The Build Layer (The Lego Builder)
**Metaphor:** The Factory / The Fast Lego Builder.
**Location:** Outside the Firewall (e.g., Vercel, Netlify, Azure Static Web Apps).

### The Job
This is the **Execution Engine**. It receives two sets of instructions and builds the visual result in milliseconds.

### The Supply Chain (Inputs)
The Build Layer acts as the central hub, pulling from 6 distinct sources:

1.  **Tokens (The Physics):** Fetched from **GitHub** (JSON).
    *   *Role:* Defines the visual language (Color, Type).
2.  **Components (The Bricks):** Fetched from **Designsystemet** (NPM).
    *   *Role:* The raw input fields and buttons.
3.  **Brand Assets (The Decoration):** Fetched from **GitHub/Vendors**.
    *   *Role:* Icons (Lucide), Imagery (Unsplash), Vectors (Undraw).
4.  **Modules (The Machinery):** Fetched from **Vendors**.
    *   *Role:* Functional engines (Stripe, YouTube, Google Maps).
5.  **Phidelity Core (The Architect):** Fetched from **GitHub** (The Codebase).
    *   *Role:* The Layout Engine, Templates, and Widget definitions.
6.  **Sanity (The Instruction):** Fetched from **Sanity API**.
    *   *Role:* The "Lego Instruction Manual" (Content + Configuration).

### The Assembly
The Builder takes the **Instruction** (Sanity) which says:
*"Build a [Product Page] using [Red Tokens]. Put a [Stripe Module] in the sidebar and a [Unsplash Image] in the header."*

It then grabs all those pieces from their respective sources and snaps them together into a single, cohesive HTML file.

### The Outputs
The Factory produces two distinct artifacts:

1.  **The Experience (The Website):**
    *   A fully formed, static HTML/CSS "Lego Castle".
    *   Optimized for end-users (Performance & SEO).
2.  **The Catalog (Live Docs):**
    *   *Concept:* The "Demo Page" *is* the documentation.
    *   *Mechanism:* Each widget on the demo page has a small "View Source" link that points directly to the **GitHub** file.
    *   *Benefit:* **Zero Duplication.** We do not maintain a separate documentation site. The code in GitHub is the single source of truth.

---

## 2. The Delivery Layer (The Postman)
**Metaphor:** The Postman / The Edge Network.
**Location:** The Global CDN (Content Delivery Network).

### The Job
This is the **Distribution Network**. It takes the finished "Lego Castle" and ensures it is waiting on the user's doorstep *before they even ask for it*.

1.  **Replication:**
    *   The finished page is copied to servers in Oslo, New York, Tokyo, and London.
2.  **Handover:**
    *   When a user visits `phidelity.com`, the "Postman" (Edge Node) nearest to them hands over the packet immediately.
3.  **Security:**
    *   The "Postman" protects the "Factory". Users never talk to the Build Server or the Database directly; they only talk to the Postman.

---

## 3. The Flow
1.  **Editor** clicks "Publish" in Sanity.
2.  **Sanity** shouts "New Instructions!" (Webhook).
3.  **Build Layer** (Factory) wakes up, fetches new data, re-assembles the page.
4.  **Build Layer** hands the new page to the **Delivery Layer** (Postman).
5.  **User** sees the new content instantly.

---

## 4. Internal Execution (Behind the Firewall)
*   **Question:** Can this run inside a private corporate network?
*   **Answer:** **Yes.**
*   **How:**
    *   The "Factory" (Build Layer) is just code (Node.js/Docker container).
    *   You can spin up this container on an **Internal Server** (Intranet).
    *   It fetches content from Sanity (or an internal CMS) and builds the site.
    *   **The Postman:** Instead of a Global CDN, the "Postman" is your internal network (NGINX/Apache) serving the files to employees only.
    *   **Security:** This creates a *completely isolated* version of the system that the public internet cannot see.
*   **Zero Dependency:**
    *   **No Azure Required:** If you are on a private cloud, you do NOT need Azure. The code runs on standard **Docker** or **Node.js** servers.
    *   You own the infrastructure 100%.
