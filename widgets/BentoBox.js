class BentoBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initRulers();
    this.updateLabels();
    this.setupAccordion();
    window.addEventListener('resize', () => {
      this.updateLabels();
      // No need to re-setup accordion listeners if we use delegation or stable DOM, 
      // but since we might re-render or just change CSS, listeners persist.
      // However, updateLabels might need to know about visibility.
    });
  }

  setupAccordion() {
    const items = this.shadowRoot.querySelectorAll('.bento-item');
    const grid = this.shadowRoot.querySelector('.grid-container');

    items.forEach(item => {
      // Clone to remove old listeners
      const newClone = item.cloneNode(true);
      item.parentNode.replaceChild(newClone, item);

      newClone.addEventListener('click', () => {
        // Only toggle if container is smaller than 74-col breakpoint (963px)
        if (this.offsetWidth >= 963) return;

        // Toggle active class
        const isActive = newClone.classList.toggle('active');

        if (isActive) {
          // Get Grid Metrics
          const style = getComputedStyle(grid);
          const rowH = parseFloat(style.gridAutoRows);
          const gap = parseFloat(style.rowGap) || 0;

          if (rowH) {
            // Force layout update to get correct scrollHeight
            const contentH = newClone.scrollHeight;

            // Calculate Span: s = (H + g) / (h + g)
            // We add a small buffer (1px) to avoid sub-pixel clipping
            const span = Math.ceil((contentH + gap + 1) / (rowH + gap));
            newClone.style.gridRowEnd = `span ${span}`;
          }
        } else {
          newClone.style.gridRowEnd = ''; // Revert to CSS default
        }

        // Update labels/rulers because height changed
        setTimeout(() => this.updateLabels(), 300);
      });
    });
    // Re-run labels after attaching listeners (and potentially cloning)
    this.updateLabels();
  }

  generateGridCSS() {
    const breakpoints = [
      { id: '146', query: '(min-width: 1898px)', cols: 146 },
      { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122 },
      { id: '98', query: '(min-width: 1275px) and (max-width: 1585px)', cols: 98 },
      { id: '74', query: '(min-width: 963px) and (max-width: 1274px)', cols: 74 },
      { id: '50', query: '(min-width: 651px) and (max-width: 962px)', cols: 50 },
      { id: '26', query: '(min-width: 170px) and (max-width: 650px)', cols: 26 },
      { id: '13', query: '(max-width: 169px)', cols: 13 }
    ];

    return breakpoints.map(bp => {
      let css = `
        @container bento-box ${bp.query} {
          .grid-container {
            grid-template-columns: repeat(${bp.cols}, 1fr);
            --col-count: ${bp.cols};
          }
          .col-index:nth-child(n+${bp.cols + 1}) { display: none; }
      `;

      if (bp.cols >= 146) {
        // 146 Cols: Tetris Layout with Central Square
        // Grid: 146 Cols x ~90 Rows
        // Gap: 2 Cols / 3 Rows

        css += `
        /* 1. LEFT TOWER (Vertical) */
        .item-1 { grid-column: 3 / 26; grid-row: 4 / 91; } /* W23 H87 */
        
        /* 2. MID-LEFT COLUMN */
        .item-2 { grid-column: 28 / 54; grid-row: 4 / 30; } /* W26 H26 */
        .item-3 { grid-column: 28 / 54; grid-row: 33 / 91; } /* W26 H58 (Vertical) */
        
        /* 3. CENTER COLUMN (The Big Square) */
        .item-4 { grid-column: 56 / 90; grid-row: 4 / 59; } /* W34 H55 */
        .item-5 { grid-column: 56 / 90; grid-row: 62 / 91; } /* W34 H29 */
        
        /* 4. RIGHT COLUMN */
        .item-6 { grid-column: 92 / 145; grid-row: 4 / 35; } /* W53 H31 */
        
        /* Split Bottom Right */
        .item-7 { grid-column: 92 / 118; grid-row: 38 / 91; } /* W26 H53 */
        .item-8 { grid-column: 120 / 145; grid-row: 38 / 91; } /* W25 H53 */
        
        .item-9 { display: none; }
        .item-10 { display: none; }
        `;
      } else if (bp.cols >= 122) {
        // 122 Cols: Adapted Tetris Layout
        css += `
        /* 1. LEFT TOWER (Vertical) */
        .item-1 { grid-column: 3 / 26; grid-row: 4 / 91; } /* W23 H87 */
        
        /* 2. MID-LEFT COLUMN */
        .item-2 { grid-column: 28 / 54; grid-row: 4 / 30; } /* W26 H26 */
        .item-3 { grid-column: 28 / 54; grid-row: 33 / 91; } /* W26 H58 */
        
        /* 3. CENTER COLUMN */
        .item-4 { grid-column: 56 / 90; grid-row: 4 / 59; } /* W34 H55 */
        .item-5 { grid-column: 56 / 90; grid-row: 62 / 91; } /* W34 H29 */
        
        /* 4. RIGHT COLUMN (Modified) */
        /* Item 6: Vertical Rectangle (Full Height) */
        .item-6 { grid-column: 92 / 121; grid-row: 4 / 91; } /* W28 H87 */
        
        /* Item 7: Stacked Below (Left) */
        .item-7 { grid-column: 3 / 54; grid-row: 94 / 121; } /* W51 H27 */
        
        /* Item 8: Stacked Below (Right) */
        .item-8 { grid-column: 56 / 121; grid-row: 94 / 121; } /* W65 H27 */
        
        .item-9 { display: none; }
        .item-10 { display: none; }
        `;
      } else if (bp.cols >= 98) {
        // 98 Cols: Adapted Tetris Layout (Items 6-8 moved down)
        css += `
          /* Items 1-3: Same */
          .item-1 { grid-column: 3 / 26; grid-row: 4 / 91; }
          .item-2 { grid-column: 28 / 54; grid-row: 4 / 30; }
          .item-3 { grid-column: 28 / 54; grid-row: 33 / 91; }
          
          /* Items 4-5: Extended to 97 (Align with Item 8) */
          .item-4 { grid-column: 56 / 97; grid-row: 4 / 59; } /* W39 H55 */
          .item-5 { grid-column: 56 / 97; grid-row: 62 / 91; } /* W39 H29 */
          
          /* Items 6, 7, 8: Side-by-side below, ending at 95 (3 col margin) */
          .item-6 { grid-column: 3 / 32; grid-row: 94 / 120; } /* W29 H26 */
          .item-7 { grid-column: 34 / 63; grid-row: 94 / 120; } /* W29 H26 */
          .item-8 { grid-column: 65 / 97; grid-row: 94 / 120; } /* W30 H26 */
          
          .item-9 { display: none; }
          .item-10 { display: none; }
        `;
      } else if (bp.cols >= 74) {
        // 74 Cols: Scaled down & Compacted (Heights reduced by 15 rows)
        css += `
          /* Items 1-3: Left Group */
          .item-1 { grid-column: 3 / 20; grid-row: 4 / 76; }
          .item-2 { grid-column: 22 / 41; grid-row: 4 / 30; }
          .item-3 { grid-column: 22 / 41; grid-row: 33 / 76; }
          
          /* Items 4-5: Right Group */
          .item-4 { grid-column: 43 / 73; grid-row: 4 / 44; }
          .item-5 { grid-column: 43 / 73; grid-row: 47 / 76; }
          
          /* Items 6-8: Footer Group (Moved up 15 rows) */
          .item-6 { grid-column: 3 / 25; grid-row: 79 / 105; }
          .item-7 { grid-column: 27 / 49; grid-row: 79 / 105; }
          .item-8 { grid-column: 51 / 73; grid-row: 79 / 105; }
          
          .item-9 { display: none; }
          .item-10 { display: none; }
        `;
      } else if (bp.cols === 50 || bp.cols === 26) {
        // Mobile/Tablet (50 & 26 Cols) - Explicit "Lego Board" Logic
        const rowH = `calc(100cqw / ${bp.cols} / 1.618)`;

        css += `
          .grid-container {
            --row-h: ${rowH};
            grid-template-columns: repeat(${bp.cols}, 1fr);
            grid-auto-rows: minmax(var(--row-h), auto);
            /* No gap property, using explicit rows */
            gap: 0;
          }
          
          .bento-item { 
            grid-column: 3 / -3; 
            height: auto;
            margin-bottom: 0;
            cursor: pointer;
          }

          /* Explicit Row Placement (Height 4, Gap 2) */
          .item-1 { grid-row: 3 / 7; }
          .item-2 { grid-row: 9 / 13; }
          .item-3 { grid-row: 15 / 19; }
          .item-4 { grid-row: 21 / 25; }
          .item-5 { grid-row: 27 / 31; }
          .item-6 { grid-row: 33 / 37; }
          .item-7 { grid-row: 39 / 43; }
          .item-8 { grid-row: 45 / 49; }

          /* Content Toggle Logic */
          .bento-content {
            display: none;
            padding-top: 1rem;
          }
          
          .bento-item.active .bento-content {
            display: block;
          }
          
          .bento-item.active {
             background: #ffffff;
             /* Ensure it stays on top if overlapping happens */
             z-index: 2; 
          }

          .bento-item .chevron {
            display: block; /* Show chevron on mobile */
            transform: rotate(45deg);
            transition: transform 0.3s ease;
          }
          .bento-item.active .chevron {
            transform: rotate(-135deg);
          }
          
          .item-9 { display: none; }
          .item-10 { display: none; }
        `;
      } else {
        // Fallback for 13 cols or others
        css += `
           .grid-container { display: none; }
         `;
      }

      css += `}`;
      return css;
    }).join('\n');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          container-type: inline-size;
          container-name: bento-box;
          font-family: 'JetBrains Mono', monospace;
          --c-bg: #F5F5F5;
          --c-card-bg: #FFFFFF;
          --c-card-border: #999999;
          --c-text-dark: #111111;
          --c-text-grey: #999999;
          --c-grid-line: rgba(0,0,0,0.1);
        }

        .grid-container {
          display: grid;
          width: 100%;
          background: var(--c-bg);
          /* Golden Ratio Rows */
          --col-w: calc(100cqw / var(--col-count, 146));
          --row-h: calc(var(--col-w) / 1.618);
          grid-auto-rows: var(--row-h);
          gap: 0;
          position: relative;
          padding-bottom: 2rem; /* Extra space at bottom */
        }

        /* RULER STYLES */
        .col-index {
          grid-row: 1;
          border-left: 1px solid var(--c-grid-line);
          font-size: 8px;
          color: var(--c-text-grey);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .col-index:nth-child(even) { background: rgba(0,0,0,0.02); }
        .col-index.is-one { border-left: 1px solid var(--c-text-dark); color: var(--c-text-dark); font-weight: bold; }

        .row-index {
            grid-column: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 8px;
            color: var(--c-text-grey);
            border-top: 1px solid var(--c-grid-line);
        }
        .row-index.is-one { border-top: 1px solid var(--c-text-dark); color: var(--c-text-dark); font-weight: bold; }

        /* BENTO ITEMS */
        .bento-item {
          background: var(--c-card-bg);
          border: 1px solid var(--c-card-border);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start; /* Changed to flex-start for accordion flow */
          padding: 1rem;
          z-index: 1;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        h3 {
            font-family: var(--font-serif, serif);
            margin: 0;
            color: var(--c-text-dark);
            font-weight: 700;
        }
        
        .eyebrow {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--c-text-grey);
            margin-top: 0.5rem;
        }
        
        .header-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
        }
        .chevron {
            width: 10px;
            height: 10px;
            border-right: 1px solid var(--c-text-grey);
            border-bottom: 1px solid var(--c-text-grey);
            transform: rotate(45deg); /* Points down */
            transition: transform 0.3s ease;
            display: none; /* Hide by default (Desktop) */
            margin-right: 0.5rem;
        }
        
        /* Default: Content visible (Desktop) */
        .bento-content {
            display: block;
            width: 100%;
        }

        ${this.generateGridCSS()}
      </style>

      <div class="grid-container" id="grid">
        <!-- ITEMS -->
        <div class="bento-item item-1">
            <div class="header-row"><h3>01</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-2">
            <div class="header-row"><h3>02</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-3">
            <div class="header-row"><h3>03</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-4">
            <div class="header-row"><h3>04</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-5">
            <div class="header-row"><h3>05</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-6">
            <div class="header-row"><h3>06</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-7">
            <div class="header-row"><h3>07</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-8">
            <div class="header-row"><h3>08</h3><span class="chevron"></span></div>
            <div class="bento-content"><span class="eyebrow"></span></div>
        </div>
        <div class="bento-item item-9"><h3>09</h3><span class="eyebrow"></span></div>
        <div class="bento-item item-10"><h3>10</h3><span class="eyebrow"></span></div>
      </div>
    `;
  }

  initRulers() {
    const grid = this.shadowRoot.getElementById('grid');
    if (!grid) return;

    const firstItem = grid.querySelector('.bento-item');

    // 1. Column Ruler (1-146)
    for (let i = 1; i <= 146; i++) {
      const div = document.createElement('div');
      div.className = 'col-index';
      if (i === 1) div.classList.add('is-one');

      // Show 1, 3, 5...
      if (i % 2 !== 0) div.textContent = i;

      div.style.gridColumn = `${i} / ${i + 1}`;
      grid.insertBefore(div, firstItem);
    }

    // 2. Row Ruler (1-150)
    for (let r = 2; r <= 150; r++) {
      const div = document.createElement('div');
      div.className = 'row-index';

      // Grid Row r corresponds to Row r
      const rowNum = r;

      if (rowNum % 2 !== 0) {
        div.textContent = rowNum;
      }

      div.style.gridRow = `${r} / ${r + 1}`;
      grid.appendChild(div);
    }
  }

  updateLabels() {
    const items = this.shadowRoot.querySelectorAll('.bento-item');
    if (!items.length) return;

    let maxRow = 0;

    items.forEach(item => {
      const style = getComputedStyle(item);

      // Check if item is displayed
      if (style.display === 'none') return;

      // Resolve negative indices
      const resolveIndex = (val, max) => {
        const i = parseInt(val);
        if (isNaN(i)) return 'auto';
        return i < 0 ? max + i + 1 : i;
      };

      // Get current column count from container style
      const container = this.shadowRoot.querySelector('.grid-container');
      const colCount = parseInt(getComputedStyle(container).getPropertyValue('--col-count')) || 146;

      const colStart = resolveIndex(style.gridColumnStart, colCount);
      const colEnd = resolveIndex(style.gridColumnEnd, colCount);

      // Handle Auto Rows (Mobile)
      let rStart, rEnd, height;
      if (style.gridRowStart === 'auto') {
        rStart = 'Auto';

        if (style.gridRowEnd.startsWith('span')) {
          const span = parseInt(style.gridRowEnd.split(' ')[1]);
          height = span;
          rEnd = `Span ${span}`;
        } else {
          rEnd = 'Auto';
          height = 'Auto';
        }
      } else {
        rStart = parseInt(style.gridRowStart) - 1;
        rEnd = parseInt(style.gridRowEnd) - 1;
        height = rEnd - rStart;

        // Update maxRow only for explicit rows
        if (rEnd > maxRow) maxRow = rEnd;
      }

      const width = colEnd - colStart;

      const eyebrow = item.querySelector('.eyebrow');
      if (eyebrow) {
        eyebrow.textContent = `X: ${colStart}-${colEnd} | Y: ${rStart}-${rEnd} | W: ${width} | H: ${height}`;
      }
    });

    // Dynamic Ruler Visibility
    const rowIndices = this.shadowRoot.querySelectorAll('.row-index');
    rowIndices.forEach(div => {
      // Parse row from gridRow style (set as "r / r+1")
      const rowStyle = div.style.gridRow;
      const r = parseInt(rowStyle.split('/')[0]);

      if (isNaN(r)) return;

      // Hide if beyond content + 3 rows padding
      if (r >= maxRow + 3) {
        div.style.display = 'none';
      } else {
        div.style.display = 'flex';
      }
    });
  }
}

customElements.define('phi-bento-box', BentoBox);
