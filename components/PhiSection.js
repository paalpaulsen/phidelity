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
          min-width: 0; 
          max-width: 100%;
          overflow: hidden; /* Safari Enforcer */
        }

        .wrapper {
            container-type: inline-size;
            container-name: phi-section;
            width: 100%;
        }

        section {
          width: 100%;
          display: grid;
          /* Critical Fix: Use minmax(0, 1fr) to force children to shrink */
          grid-template-columns: minmax(0, 1fr); 
          gap: 1px;
          background: #3C3C3C; /* var(--c-border) */
        }

        /* Ensure slotted content participates in the grid */
        slot {
            display: contents;
        }

        /* --- MACRO 1: FULL WIDTH --- */
        .layout-full {
            grid-template-columns: minmax(0, 1fr);
        }

        /* --- MACRO 2: GOLDEN RATIO --- */
        /* Desktop: 1.618fr | 1fr */
        @container phi-section (min-width: 999px) {
            .layout-golden {
                grid-template-columns: minmax(0, 1.618fr) minmax(0, 1fr);
                gap: 1px;
            }
            .layout-golden ::slotted(:nth-child(3)) {
                grid-column: 1 / -1;
            }
        }
        /* Wide: 1.618fr | 1fr | 1.618fr */
        @container phi-section (min-width: 1900px) {
            .layout-golden {
                grid-template-columns: minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr);
                gap: 1px;
            }
            .layout-golden ::slotted(:nth-child(3)) {
                grid-column: auto;
            }
        }

        /* --- MACRO 3: TRINITY (1:1:1) --- */
        /* Desktop: 1fr | 1fr (Starts at 2000px as requested) */
        @container phi-section (min-width: 2000px) {
            .layout-trinity {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                column-gap: 0; /* No vertical lines requested? Preserving existing logic */
                gap: 1px;
            }
            .layout-trinity ::slotted(:nth-child(3)) {
                grid-column: 1 / -1;
            }
        }
        /* Wide: 1fr | 1fr | 1fr */
        @container phi-section (min-width: 2400px) {
            .layout-trinity {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                column-gap: 0;
            }
            .layout-trinity ::slotted(:nth-child(3)) {
                grid-column: auto;
            }
        }

        /* --- MACRO 4: STATIC DYNAMIC --- */
        /* Desktop Wide: 1000px | 1fr */
        @container phi-section (min-width: 1500px) {
            .layout-static-dynamic {
                grid-template-columns: 1000px minmax(0, 1fr);
                gap: 1px;
            }
        }

        /* --- MACRO 5: HEXAD (1-6 Cols) --- */
        /* Default: 1 Col (see general default) */
        
        /* 2 Cols */
        @container phi-section (min-width: 1820px) {
            .layout-hexad { 
                grid-template-columns: repeat(2, minmax(0, 1fr)); 
                gap: 1px;
            }
        }
        /* 3 Cols */
        @container phi-section (min-width: 3400px) {
            .layout-hexad { 
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1px;
            }
        }
        /* 6 Cols */
        @container phi-section (min-width: 4000px) {
            .layout-hexad { 
                grid-template-columns: repeat(6, minmax(0, 1fr));
                gap: 1px;
            }
        }

        /* --- MACRO 6: TETRA (4 Blocks 2x2) --- */
        /* Desktop: 1fr | 1fr */
        @container phi-section (min-width: 1600px) {
            .layout-tetra {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 1px 0;
            }
        }
        /* Ultra Wide: 1fr | 1fr | 1fr | 1fr */
        @container phi-section (min-width: 2800px) {
            .layout-tetra {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }
      </style>

      <div class="wrapper">
        <section class="layout-${layout}">
            <slot></slot>
        </section>
      </div>
    `;
    }
}

customElements.define('phi-section', PhiSection);
