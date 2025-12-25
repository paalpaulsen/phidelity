class MasonryDeck extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            items: [], // { id, size: 'small'|'large', content: ... }
        };
    }

    static get observedAttributes() {
        return ['items'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'items' && oldValue !== newValue) {
            try {
                this.state.items = JSON.parse(newValue);
                console.log('MasonryDeck: Items updated, count:', this.state.items.length);
                this.render();
            } catch (e) {
                console.error('Invalid JSON for items attribute', e);
            }
        }
    }

    connectedCallback() {
        console.log('MasonryDeck: Connected');
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Inter', sans-serif;
          color: var(--mono-02);
        }

        /* CONTAINER QUERY SUPPORT */
        .masonry-wrapper {
             container-type: inline-size;
             container-name: masonry;
             width: 100%;
             box-sizing: border-box;
             padding: 2rem; /* Default mobile padding */
        }

        .masonry-grid {
          column-count: 1; 
          column-gap: 2rem;
          width: 100%;
        }

        .masonry-item {
          background: var(--mono-10);
          border: 1px solid var(--mono-08);
          break-inside: avoid;
          margin-bottom: 2rem;
          display: block;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .masonry-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            z-index: 2;
        }

        .card-img { 
            width: 100%;
            overflow: hidden;
            display: block;
            background: var(--mono-09);
        }
        .card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        
        /* ASPECT RATIOS */
        .masonry-item .card-img { aspect-ratio: 1 / 1.618; }           /* Portrait (Default) */
        .masonry-item[data-size="2"] .card-img { aspect-ratio: 1.618 / 1; } /* Landscape */
        .masonry-item[data-size="0"] .card-img { aspect-ratio: 1 / 1; }     /* Square */

        /* INTERNAL CARD CONTENT */
        .card-text {
            background: #ffffff; /* White background for text */
            padding-block: 1.5rem;
            
            /* INTERNAL PHIDELITY GRID (26 Cols) */
            display: grid;
            grid-template-columns: repeat(26, 1fr);
            column-gap: 0; /* Gaps handled by column placement */
        }

        .card-text h3 {
            grid-column: 3 / 25; /* 2-Col Margin Left/Right */
            margin: 0 0 0.5rem 0;
            font-family: var(--font-sans, 'Inter', sans-serif);
            font-weight: 600;
            font-size: var(--type-h3); 
            line-height: 1.2;
            color: var(--c-text);
        }

        .card-text p {
            grid-column: 3 / 25; /* 2-Col Margin Left/Right */
            margin: 0 0 1rem 0;
            font-family: var(--font-sans, 'Inter', sans-serif);
            font-weight: 400;
            font-size: var(--type-summary-s);
            line-height: 1.5;
            color: var(--c-text-muted);
        }

        .caption {
            grid-column: 3 / 25;
            font-family: var(--font-sans);
            font-size: var(--type-base);
            font-weight: 300;
            color: var(--mono-06);
            display: block;
            margin-bottom: 0.5rem;
            margin-top: 1rem;
        }

        /* RESPONSIVE LAYOUT */
        
        /* > 650px (Tablet) -> 2 Columns */
        @container masonry (min-width: 651px) {
            .masonry-wrapper { padding: 4rem; } 
            .masonry-grid { column-count: 2; }
        }

        /* > 963px (Desert) -> 3 Columns */
        @container masonry (min-width: 963px) {
             .masonry-grid { column-count: 3; }
        }

        /* > 1275px (Large) -> 4 Columns */
        @container masonry (min-width: 1275px) {
             .masonry-wrapper { padding: 6rem; }
             .masonry-grid { column-count: 4; }
        }

        /* > 1586px (X-Large) -> 5 Columns */
        @container masonry (min-width: 1586px) {
             .masonry-grid { column-count: 5; }
        }

        /* > 1898px (Max) -> 6 Columns */
        @container masonry (min-width: 1898px) {
             .masonry-grid { column-count: 6; }
        }

      </style>
      <div class="masonry-wrapper">
          <div class="masonry-grid" id="masonry-grid">
             ${this.state.items.map((it, idx) => `
                <div class="masonry-item" data-size="${it.size !== undefined ? it.size : 1}">
                    <a href="${it.image}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">
                        <div class="card-img">
                             ${it.image ? `<img src="${it.image}" alt="${it.title || 'Portfolio Image'}">` : `<div style="width:100%; height:100%; background: linear-gradient(45deg, #f3f3f3, #e8e8e8);"></div>`}
                        </div>
                        <div class="card-text">
                            <h3>${it.title || 'Untitled'}</h3>
                            <p>${it.summary || 'No description available.'}</p>
                            <div class="caption">${it.credit || 'Unsplash'}</div>
                        </div>
                    </a>
                </div>
             `).join('')}
          </div>
      </div>
    `;
    }
}

customElements.define('phi-masonry-deck', MasonryDeck);
