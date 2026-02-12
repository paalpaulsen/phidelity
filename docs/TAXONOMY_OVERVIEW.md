# Phidelity System Taxonomy

The Phidelity architecture is strictly divided into **6 Layers of Composition**, moving from abstract constants to concrete delivery.

| Layer | Name | Role | Status | Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **L1** | **Tokens** | Brand Identity & System Physics | ✅ Active | [TAXONOMY_TOKENS.md](TAXONOMY_TOKENS.md) |
| **L2** | **Components** | Atoms, Molecules, Embeds (Supply) | ✅ Active | [TAXONOMY_COMPONENTS.md](TAXONOMY_COMPONENTS.md) |
| **L3** | **Layout** | Composition, Grid, Sections, Widgets (Product) | 🚧 Active | [TAXONOMY_LAYOUT.md](TAXONOMY_LAYOUT.md) |
| **L4** | **Content** | Text, Image, Metadata | 📋 Planned | - |
| **L5** | **Build** | Page Templates, Features | 📋 Planned | - |
| **L6** | **Delivery** | Sites, Apps (Infrastructure) | 📋 Planned | - |

---

## The Philosophy: "Radical Agnosticism"
By strictly separating these layers, we ensure that:
1.  **Rebranding (L1)** does not break functionality (L3).
2.  **Swapping Libraries (L2)** does not break layouts (L3).
3.  **Changing CMS (L4)** does not require rewriting widgets (L3).
