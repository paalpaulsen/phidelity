class SectionHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'lead'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'Section Title';
    const lead = this.getAttribute('lead') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          --c-bg: var(--mono-02, #0E0E0E);
          --c-text: #fff;
          --font-serif: 'DM Serif Display', serif;
          --font-sans: 'Inter', sans-serif;
        }

        .header-block {
          background-color: var(--c-bg);
          color: var(--c-text);
          padding-top: 4rem;
          padding-bottom: 4rem; /* Restored vertical space */
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: relative;
          
          /* Container Context for Grid Logic */
          container-type: inline-size;
          container-name: header-box;
        }

        .content-wrapper {
          display: grid;
          /* Local Typography Defaults (Mobile) */
          --scale: 1.309;
          --type-base: 1rem;
          /* H2 uses global fluid clamp */
          --type-summary-l: calc(var(--type-base) * var(--scale) * var(--scale));
        }

        /* Desktop Typography Override */
        @container header-box (min-width: 963px) {
          .content-wrapper {
            --scale: 1.618;
            --type-summary-l: calc(var(--type-base) * var(--scale));
          }
        }

        .text-container {
          /* Start at col 7, End at -3 (leaving 2 cols right margin) */
          grid-column: 7 / -3;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        h2 {
          font-family: var(--font-serif);
          font-size: var(--type-h2);
          font-weight: 400;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .lead {
          font-family: var(--font-sans);
          font-size: var(--type-summary-l);
          font-weight: 300;
          line-height: 1.309;
          color: var(--mono-07);
          max-width: 65ch;
          margin: 0;
        }

        /* --- PHIDELITY GRID LOGIC --- */
        /* Defining explicit columns to allow placement at col 7 */

        /* 13 Cols (< 170px) */
        @container header-box (max-width: 169px) {
          .content-wrapper { grid-template-columns: repeat(13, 1fr); }
          .text-container { grid-column: 3 / -3; } /* Fallback for tiny screens: standard margin */
        }

        /* 26 Cols (170px - 650px) */
        @container header-box (min-width: 170px) and (max-width: 650px) {
          .content-wrapper { grid-template-columns: repeat(26, 1fr); }
          .text-container { grid-column: 3 / -3; } /* Mobile: standard margin is better than col 7 (too narrow) */
        }

        /* 50 Cols (651px - 962px) */
        @container header-box (min-width: 651px) and (max-width: 962px) {
          .content-wrapper { grid-template-columns: repeat(50, 1fr); }
          .text-container { grid-column: 7 / -7; }
        }

        /* 74 Cols (963px - 1274px) */
        @container header-box (min-width: 963px) and (max-width: 1274px) {
          .content-wrapper { grid-template-columns: repeat(74, 1fr); }
          .text-container { grid-column: 7 / -7; }
        }

        /* 98 Cols (1275px - 1585px) */
        @container header-box (min-width: 1275px) and (max-width: 1585px) {
          .content-wrapper { grid-template-columns: repeat(98, 1fr); }
          .text-container { grid-column: 7 / -7; }
        }

        /* 122 Cols (1586px - 1897px) */
        @container header-box (min-width: 1586px) and (max-width: 1897px) {
          .content-wrapper { grid-template-columns: repeat(122, 1fr); }
          .text-container { grid-column: 7 / -7; }
        }

        /* 146 Cols (> 1898px) */
        @container header-box (min-width: 1898px) {
          .content-wrapper { grid-template-columns: repeat(146, 1fr); }
          .text-container { grid-column: 7 / -7; }
        }

      </style>

      <div class="header-block">
        <div class="content-wrapper">
          <div class="text-container">
            <h2>${title}</h2>
            ${lead ? `<p class="lead">${lead}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('phi-section-header', SectionHeader);
