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
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        // Debounce or requestAnimationFrame could be added here
        this.layoutItems();
    }

    calculateGrid() {
        // 1. Get Current Breakpoint based on Container Width (Internal logic)
        // We can use window.innerWidth for macro layout logic matching CSS
        const w = this.getBoundingClientRect().width;
        let cols = 146; // Default largest

        if (w < 170) cols = 13;
        else if (w < 651) cols = 26;
        else if (w < 963) cols = 50;
        else if (w < 1275) cols = 74;
        else if (w < 1586) cols = 98;
        else if (w < 1898) cols = 122;

        return cols;
    }

    layoutItems() {
        const gridEl = this.shadowRoot.getElementById('masonry-grid');
        if (!gridEl) return;

        const totalCols = this.calculateGrid();
        const items = Array.from(gridEl.children);

        // RESET all items first
        items.forEach(item => {
            item.style.gridColumn = '';
            item.style.gridRow = '';
            item.style.marginTop = '';
        });

        // DESKTOP+ (Elastic Justification) - WITH MARGINS
        gridEl.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;

        // VERTICAL RHYTHM (3 Row Spacing)
        // 1 Row = ColWidth / 1.618 (Golden Ratio)
        const containerWidth = gridEl.getBoundingClientRect().width;
        // Approximation of column width including gaps if any (here gap is 0)
        const colWidth = containerWidth / totalCols;
        const rowHeight = colWidth / 1.618;
        const verticalPadding = rowHeight * 3;

        gridEl.style.paddingTop = `${verticalPadding}px`;
        gridEl.style.paddingBottom = `${verticalPadding}px`;

        // MARGIN LOGIC:
        // Phidelity Standard: 2 columns Margin Left, 2 Columns Margin Right.
        // Usable Columns = Total - 4.
        const marginCols = 2;
        const usableCols = totalCols - (marginCols * 2);

        // Start placement at Column 3 (Index 1-based) -> 1 + 2 = 3.
        const startColIndex = 1 + marginCols;

        /* 
           ALGORITHM: Row-by-Row Filling
           1. Take items one by one.
           2. Try to fit into current row (max width: usableCols).
           3. If row full (or mostly full), justify/stretch items to fill usableCols.
        */

        let currentRow = [];
        let currentRowWidth = 0;
        const gap = 2; // Strict 2-col gap

        const getBaseWidth = (size) => {
            const s = Number(size);
            if (s === 2) return 50;
            if (s === 0) return 12; // New "Mini" size
            return 21; // Reduced from 26 to allow 2 cards on 50-col grid
        };

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const sizeVal = item.getAttribute('data-size');
            const sizeNum = sizeVal === null ? 1 : Number(sizeVal);
            const baseW = getBaseWidth(sizeNum);

            const needed = currentRow.length === 0 ? baseW : gap + baseW;

            if (currentRowWidth + needed <= usableCols) {
                currentRow.push({ el: item, base: baseW, size: sizeNum });
                currentRowWidth += needed;
            } else {
                this.justifyRow(currentRow, usableCols, gap, startColIndex);
                currentRow = [{ el: item, base: baseW, size: sizeNum }];
                currentRowWidth = baseW;
            }
        }

        if (currentRow.length > 0) {
            this.justifyRow(currentRow, usableCols, gap, startColIndex);
        }
    }

    justifyRow(rowItems, targetWidth, gap, startOffset) {
        if (rowItems.length === 0) return;

        const gapsTotal = (rowItems.length - 1) * gap;
        const baseContentTotal = rowItems.reduce((acc, it) => acc + it.base, 0);
        const remainder = targetWidth - (baseContentTotal + gapsTotal);

        const baseAdd = Math.floor(remainder / rowItems.length);
        let leftOver = remainder % rowItems.length;

        let currentCol = startOffset; // Start at Left Margin (e.g. 3)

        rowItems.forEach((itemObj, idx) => {
            let extra = baseAdd;
            if (leftOver > 0) {
                extra += 1;
                leftOver -= 1;
            }

            const finalWidth = itemObj.base + extra;
            const start = currentCol;
            const end = start + finalWidth;

            itemObj.el.style.gridColumnStart = start;
            itemObj.el.style.gridColumnEnd = end;

            currentCol = end + gap;
        });
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

        /* CONTAINER QUERY SUPPORT for Internal Cards */
        .card-wrapper {
             container-type: inline-size;
             container-name: card-wrapper;
        }

        .masonry-grid {
          display: grid;
          /* Default to mobile until JS calculates */
          grid-template-columns: repeat(26, 1fr); 
          /* Explicit Gap Logic managed by JS Column Placement */
          gap: 0; 
          column-gap: 0;
          row-gap: 2rem; 
          width: 100%;
        }

        .masonry-item {
          background: var(--mono-10);
          border: 1px solid var(--mono-09);
          /* No fixed height, let content dictate, but ensure min height for visual */
          min-height: 200px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .masonry-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            z-index: 2;
        }

        /* INTERNAL CARD LAYOUTS */
        
        /* Size 0 (Mini) - 12 Cols */
        .masonry-item[data-size="0"] .card-content {
             grid-template-columns: repeat(12, 1fr);
        }
        .masonry-item[data-size="0"] .card-txt {
             grid-column: 1/-1; /* Full width text for mini cards? Or Padded? */
             padding: 1rem;
        }

        /* 26-Col Layout (Default) - "Small" */
        .card-content { 
            display: grid; 
            grid-template-columns: repeat(26, 1fr); 
            gap: 0; 
            height: 100%;
            align-content: start; /* Force content to top */
        }
        
        .card-img { 
            grid-column: 1/-1; 
            aspect-ratio: 16/9; 
            background: var(--mono-09);
            overflow: hidden;
        }
        .card-img img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-txt { 
            grid-column: 3/25; /* 2 col padding */
            padding-top: calc((100cqw / 26 / 1.618) * 2);  /* 2 Phidelity Rows from Top */
            padding-bottom: 1.5rem;
            display: flex; flex-direction: column; gap: 0.5rem;
            justify-content: flex-start; /* Force text to top */
        }
        
        h3 { 
            margin: 0; font-size: var(--type-base); font-weight: 700; color: var(--mono-02);
            font-family: 'DM Serif Display', serif; 
        }
        p { margin: 0; font-size: var(--type-caption); color: var(--mono-06); line-height: 1.4; }

        /* 50-Col Layout (> 650px) - "Large" */
        @container card-wrapper (min-width: 651px) {
            .card-content { grid-template-columns: repeat(50, 1fr); }
            
            /* Large Card Layout: Image Left, Text Right? Or Top/Bottom? 
               User said "Cards that have various grid spans". 
               Let's keep Top/Bottom for Masonry usually, but maybe Landscape?
               Let's stick to Top/Bottom for now to ensure stacking.
            */
            .card-img { grid-column: 1/-1; aspect-ratio: 21/9; }
            .card-txt { 
                grid-column: 3/49; 
                /* Recalculate 2-Row Padding based on 50 columns */
                padding-top: calc((100cqw / 50 / 1.618) * 2);
            }
        }

      </style>
      <div class="masonry-grid" id="masonry-grid">
         ${this.state.items.map((it, idx) => `
            <div class="masonry-item card-wrapper" data-size="${it.size || 1}">
                <div class="card-content">
                    <div class="card-img">
                         ${it.image ? `<img src="${it.image}" alt="${it.title}">` : `<div style="width:100%; height:100%; background: linear-gradient(45deg, #f3f3f3, #e8e8e8);"></div>`}
                    </div>
                    <div class="card-txt">
                        <h3>${it.title || 'Untitled'}</h3>
                        <p>${it.summary || ''}</p>
                    </div>
                </div>
            </div>
         `).join('')}
      </div>
    `;

        // Trigger layout
        requestAnimationFrame(() => this.layoutItems());
    }
}

customElements.define('phi-masonry-deck', MasonryDeck);
