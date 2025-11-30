class PhiSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['layout'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'layout') {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const layout = this.getAttribute('layout') || 'full';

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        section {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr; /* Default Stacked */
          gap: 1px;
          background: #3C3C3C; /* var(--c-border) */
        }

        /* Ensure slotted content participates in the grid */
        slot {
            display: contents;
        }

        /* --- MACRO 1: FULL WIDTH --- */
        .layout-full {
            grid-template-columns: 1fr;
        }

        /* --- MACRO 2: GOLDEN RATIO --- */
        /* Desktop: 1.618fr | 1fr */
        @container (min-width: 999px) {
            .layout-golden {
                grid-template-columns: 1.618fr 1fr;
            }
        }
        /* Wide: 1.618fr | 1fr | 1.618fr */
        @container (min-width: 1900px) {
            .layout-golden {
                grid-template-columns: 1.618fr 1fr 1.618fr;
            }
        }

        /* --- MACRO 3: TRINITY (1:1:1) --- */
        /* Desktop: 1fr | 1fr */
        @container (min-width: 768px) {
            .layout-trinity {
                grid-template-columns: 1fr 1fr;
            }
        }
        /* Wide: 1fr | 1fr | 1fr */
        @container (min-width: 1900px) {
            .layout-trinity {
                grid-template-columns: 1fr 1fr 1fr;
            }
        }

        /* --- MACRO 4: STATIC DYNAMIC --- */
        /* Desktop Wide: 1000px | 1fr */
        @container (min-width: 1500px) {
            .layout-static-dynamic {
                grid-template-columns: 1000px 1fr;
            }
        }
      </style>

      <section class="layout-${layout}">
        <slot></slot>
      </section>
    `;
    }
}

customElements.define('phi-section', PhiSection);
