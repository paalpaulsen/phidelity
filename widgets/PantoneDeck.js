class PantoneDeck extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.buildDeck();
  }

  scrollToSection(id) {
    const section = this.shadowRoot.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          color: var(--c-text);
          padding-bottom: 4rem;
        }

        * { box-sizing: border-box; }

        /* VARIABLES (Inherited from global scope, but we can define defaults if needed) */
        
        /* 3. MACRO GALLERY (Distribution) */
        .wrapper { 
          container-type: inline-size; 
          container-name: bento-box; 
          width: 100%; 
        }
        
        h3.zone-label { 
          display: block; margin-bottom: 2rem; margin-top: 6rem;
          /* Inherit standard H3 styles or override specific properties if needed */
          font-family: var(--font-sans, 'Inter', sans-serif);
          font-weight: 500;
          font-size: var(--type-h3);
          color: var(--c-text);
          letter-spacing: -0.02em;
          border-bottom: 1px solid var(--c-border-light); 
          padding-bottom: 1rem;
        }

        /* 
           MACRO GRID
           Phidelity Standard: 2-column margins, 2-column gutters.
           Card Width = 10 columns (except on smallest screen).
        */
        .pantone-gallery {
          display: grid;
          /* Default (Mobile 26 cols) */
          grid-template-columns: repeat(2, 1fr);
          gap: calc(100cqw * 2 / 26);
          padding: 0 calc(100cqw * 2 / 26);
        }
        
        .zone-label {
          margin-left: calc(100cqw * 2 / 26);
          margin-right: calc(100cqw * 2 / 26);
        }

        /* 13 Cols (< 170px) */
        @container bento-box (max-width: 169px) {
          .pantone-gallery {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 0 calc(100cqw * 2 / 13);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 13);
            margin-right: calc(100cqw * 2 / 13);
          }
        }

        /* 26 Cols (170px - 650px) */
        @container bento-box (min-width: 170px) and (max-width: 650px) {
          .pantone-gallery {
            grid-template-columns: repeat(2, 1fr);
            gap: calc(100cqw * 2 / 26);
            padding: 0 calc(100cqw * 2 / 26);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 26);
            margin-right: calc(100cqw * 2 / 26);
          }
        }

        /* 50 Cols (651px - 962px) */
        @container bento-box (min-width: 651px) and (max-width: 962px) {
          .pantone-gallery {
            grid-template-columns: repeat(4, 1fr);
            gap: calc(100cqw * 2 / 50);
            padding: 0 calc(100cqw * 2 / 50);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 50);
            margin-right: calc(100cqw * 2 / 50);
          }
        }

        /* 74 Cols (963px - 1274px) */
        @container bento-box (min-width: 963px) and (max-width: 1274px) {
          .pantone-gallery {
            grid-template-columns: repeat(6, 1fr);
            gap: calc(100cqw * 2 / 74);
            padding: 0 calc(100cqw * 2 / 74);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 74);
            margin-right: calc(100cqw * 2 / 74);
          }
        }

        /* 98 Cols (1275px - 1585px) */
        @container bento-box (min-width: 1275px) and (max-width: 1585px) {
          .pantone-gallery {
            grid-template-columns: repeat(8, 1fr);
            gap: calc(100cqw * 2 / 98);
            padding: 0 calc(100cqw * 2 / 98);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 98);
            margin-right: calc(100cqw * 2 / 98);
          }
        }

        /* 122 Cols (1586px - 1897px) */
        @container bento-box (min-width: 1586px) and (max-width: 1897px) {
          .pantone-gallery {
            grid-template-columns: repeat(10, 1fr);
            gap: calc(100cqw * 2 / 122);
            padding: 0 calc(100cqw * 2 / 122);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 122);
            margin-right: calc(100cqw * 2 / 122);
          }
        }

        /* 146 Cols (> 1898px) */
        @container bento-box (min-width: 1898px) {
          .pantone-gallery {
            grid-template-columns: repeat(12, 1fr);
            gap: calc(100cqw * 2 / 146);
            padding: 0 calc(100cqw * 2 / 146);
          }
          .zone-label {
            margin-left: calc(100cqw * 2 / 146);
            margin-right: calc(100cqw * 2 / 146);
          }
        }

        /* =========================================
           4. THE CARD (Micro Layout)
           ========================================= */
        .pantone-card {
          /* THE CORE: Each card is a container */
          container-type: inline-size; 
          
          background: var(--mono-10);
          border: 1px solid var(--c-border-light);
          aspect-ratio: 2/3;
          
          /* INTERNAL GRID: 26 Columns (Standard Mobile Resolution) */
          display: grid;
          grid-template-columns: repeat(26, 1fr);
          grid-template-rows: 1.618fr 1fr;
          
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }

        /* SWATCH: Full Bleed */
        .color-swatch {
          grid-column: 1 / -1; 
          grid-row: 1 / 2;
          border-bottom: 1px solid var(--c-border-light);
        }

        /* CONTENT: Uses internal 26-col grid */
        .card-info {
          grid-column: 1 / -1;
          grid-row: 2 / 3;
          
          /* Inherit the 26 columns from parent */
          display: grid;
          grid-template-columns: subgrid; 
          grid-template-columns: inherit; /* Fallback */
          
          align-content: center;
          row-gap: 4px;
        }

        /* Text alignment: Starts at Col 3, Ends at Col 25 (2 col margin) */
        .color-name {
          grid-column: 3 / 25; 
          font-weight: 700; font-size: 0.85rem; color: var(--mono-04);
          margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .val-group {
          grid-column: 3 / 25;
          display: flex; justify-content: space-between;
          font-family: var(--font-mono, monospace); font-size: var(--type-caption); color: var(--c-text-muted);
          border-bottom: 1px solid var(--c-border-light); padding-bottom: 2px;
        }
        .val-group:last-child { border-bottom: none; }
        
        .val-hex { color: var(--mono-03); font-weight: 600; }

        /* Light card border fix */
        .pantone-card.is-light { border-color: var(--mono-08); }
      </style>

      <div class="wrapper">
        <div id="deck-container"></div>
      </div>
    `;
  }

  buildDeck() {
    const scales = [
      { id: 'mono', name: 'Phi Mono', var: 'mono', count: 10 },
      { id: 'green', name: 'Phi Green', var: 'green', count: 12 },
      { id: 'blue', name: 'Phi Blue', var: 'blue', count: 14 },
      { id: 'purple', name: 'Phi Purple', var: 'purple', count: 8 },
      { id: 'magenta', name: 'Phi Magenta', var: 'magenta', count: 10 },
      { id: 'red', name: 'Phi Red', var: 'red', count: 12 },
      { id: 'earth', name: 'Phi Earth', var: 'earth', count: 10 },
      { id: 'solar', name: 'Phi Solar', var: 'solar', count: 12 }
    ];

    const deckContainer = this.shadowRoot.getElementById('deck-container');

    // Helper to convert RGB to Hex/HSL
    function analyzeColor(rgbString) {
      if (!rgbString) return { hex: '---', rgb: '---', hsl: '---' };
      const values = rgbString.match(/\d+/g);
      if (!values) return { hex: '---', rgb: '---', hsl: '---' };

      const map = values.map(Number);
      const r = map[0], g = map[1], b = map[2];

      // Hex
      const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

      // HSL
      let r1 = r / 255, g1 = g / 255, b1 = b / 255;
      let max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
      let h, s, l = (max + min) / 2;

      if (max === min) { h = s = 0; } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
          case g1: h = (b1 - r1) / d + 2; break;
          case b1: h = (r1 - g1) / d + 4; break;
        }
        h /= 6;
      }
      return {
        hex: hex,
        rgb: `${r} ${g} ${b}`,
        hsl: `${Math.round(h * 360)}/${Math.round(s * 100)}/${Math.round(l * 100)}`
      };
    }

    scales.forEach(scale => {
      // 1. Section Header
      const label = document.createElement('h3');
      label.className = 'zone-label';
      label.id = scale.id;
      label.textContent = scale.name;
      deckContainer.appendChild(label);

      // 2. Gallery Container
      const gallery = document.createElement('div');
      gallery.className = 'pantone-gallery';

      // 3. Card Loop (Dynamic Steps)
      for (let i = 1; i <= scale.count; i++) {
        // Format index (01, 02...)
        const idx = i.toString().padStart(2, '0');
        const varName = `--${scale.var}-${idx}`;
        const cardName = `${scale.name} ${idx}`;

        const card = document.createElement('div');
        card.className = 'pantone-card';

        // Highlight light cards for border visibility
        // Logic: Last 20% of cards are likely light for color scales, last few for mono
        if (scale.var === 'mono' && i >= scale.count - 1) card.classList.add('is-light');
        if (scale.var !== 'mono' && i === scale.count) card.classList.add('is-light');

        // Construct Internal Grid Layout
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = `var(${varName})`;

        const info = document.createElement('div');
        info.className = 'card-info';

        // Initial Append to DOM to calculate colors
        card.appendChild(swatch);
        card.appendChild(info);
        gallery.appendChild(card);

        // Calculate Data
        // We need to wait for the browser to apply styles to get the computed color
        requestAnimationFrame(() => {
          const bg = window.getComputedStyle(swatch).backgroundColor;
          const data = analyzeColor(bg);

          info.innerHTML = `
            <div class="color-name">${cardName}</div>
            <div class="val-group"><span class="val-hex">${data.hex}</span></div>
            <div class="val-group"><span>RGB</span><span>${data.rgb}</span></div>
            <div class="val-group"><span>HSL</span><span>${data.hsl}</span></div>
          `;
        });
      }

      deckContainer.appendChild(gallery);
    });
  }
}

customElements.define('phi-pantone-deck', PantoneDeck);
