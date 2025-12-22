class TypographicScale extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.resizeObserver = new ResizeObserver(() => this.updateMetadata());
    }

    connectedCallback() {
        this.render();
        this.bindEvents(); // Add listeners
        this.resizeObserver.observe(this.shadowRoot.querySelector('.type-container'));
        // Initial update after render
        requestAnimationFrame(() => this.updateMetadata());
    }

    bindEvents() {
        const toggle = this.shadowRoot.getElementById('mode-toggle');
        const container = this.shadowRoot.querySelector('.type-container');

        if (toggle && container) {
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    container.classList.add('mode-app');
                } else {
                    container.classList.remove('mode-app');
                }
                // Force metadata update after layout change
                requestAnimationFrame(() => this.updateMetadata());
            });
        }
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
    }

    updateMetadata() {
        const cards = this.shadowRoot.querySelectorAll('.type-card');
        cards.forEach(card => {
            const preview = card.querySelector('.type-preview');
            const metaSize = card.querySelector('.meta-size');
            const metaLS = card.querySelector('.meta-ls');
            const metaCase = card.querySelector('.meta-case');

            if (preview) {
                const style = getComputedStyle(preview);

                // Size
                if (metaSize) metaSize.textContent = `${Math.round(parseFloat(style.fontSize))}px`;

                // Letter Spacing
                if (metaLS) {
                    const ls = style.letterSpacing === 'normal' ? '0' : style.letterSpacing;
                    metaLS.textContent = ls;
                }

                // Case (Transform)
                if (metaCase) {
                    const tt = style.textTransform === 'none' ? 'Normal' : style.textTransform;
                    metaCase.textContent = tt.charAt(0).toUpperCase() + tt.slice(1);
                }
            }
        });
    }

    generateGridCSS(styles) {
        const breakpoints = [
            { id: '13', query: '(max-width: 169px)', cols: 13, slots: 1 },
            { id: '26', query: '(min-width: 170px) and (max-width: 650px)', cols: 26, slots: 1 },
            { id: '50', query: '(min-width: 651px) and (max-width: 962px)', cols: 50, slots: 2 },
            { id: '74', query: '(min-width: 963px) and (max-width: 1274px)', cols: 74, slots: 3 },
            { id: '98', query: '(min-width: 1275px) and (max-width: 1585px)', cols: 98, slots: 4 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122, slots: 5 },
            { id: '146', query: '(min-width: 1898px)', cols: 146, slots: 6 }
        ];

        return breakpoints.map(bp => {
            let css = `
            /* ${bp.cols} Cols (${bp.slots} Slots) */
            @container type-scale ${bp.query} {
                .type-container { 
                    --col-count: ${bp.cols}; 
                    --col-w: calc(100cqw / ${bp.cols});
                }
                .cards-grid, .control-bar { 
                    grid-template-columns: repeat(${bp.cols}, 1fr); 
                }
                .cards-grid {
                    row-gap: calc(2 * var(--col-w));
                }
            `;

            let currentSlot = 0;

            styles.forEach((style, index) => {
                // Determine width in slots (Default 1, Double 2)
                // Force single slot on mobile/tablet small (1 slot grids)
                const isDouble = style.isDouble && bp.slots > 1;
                const widthSlots = isDouble ? 2 : 1;

                // Wrap if not enough space
                if (currentSlot + widthSlots > bp.slots) {
                    currentSlot = 0;
                }

                // Calculate Grid Coordinates
                // Margin Left = 2 cols. Slot width = 22 cols. Gap = 2 cols.
                // Stride = 24 cols (22 + 2).
                // Start = 3 + (Slot * 24)
                const startCol = 3 + (currentSlot * 24);

                // Span calculation
                // Single: 22 cols
                // Double: 46 cols (22 + 2 + 22)
                const spanCols = isDouble ? 46 : 22;
                const endCol = startCol + spanCols;

                css += `
                .type-card:nth-child(${index + 1}) {
                    grid-column: ${startCol} / ${endCol};
                    ${isDouble ? 'grid-template-columns: repeat(50, 1fr);' : ''}
                }
                `;

                // Advance slot
                currentSlot += widthSlots;
            });

            css += `}`;
            return css;
        }).join('\n');
    }

    render() {
        // Sorted: Headers -> Summaries -> Paragraph -> Caption -> Eyebrows
        const styles = [
            { name: 'H1 L', token: 'H1-L', class: 'h1-l', tag: 'h1', calc: 'Base × φ⁴', lh: '1.1', isDouble: true },
            { name: 'H1 M', token: 'H1-M', class: 'h1-m', tag: 'h1', calc: 'Base × φ³', lh: '1.1' },
            { name: 'H1 S', token: 'H1-S', class: 'h1-s', tag: 'h1', calc: 'Base × φ²', lh: '1.2' },
            { name: 'H2', token: 'H2', class: 'h2', tag: 'h2', calc: 'Base × φ¹', lh: '1.3' },
            { name: 'H3', token: 'H3', class: 'h3', tag: 'h3', calc: 'Base', lh: '1.4' },
            { name: 'Summary L', token: 'Sum-L', class: 'summary-l', tag: 'p', calc: 'Base × φ¹', lh: '1.4' },
            { name: 'Summary S', token: 'Sum-S', class: 'summary-s', tag: 'p', calc: 'Base', lh: '1.5' },
            { name: 'Paragraph', token: 'P', class: 'p-body', tag: 'p', calc: 'Base', lh: '1.6' },
            { name: 'Caption', token: 'Cap', class: 'caption', tag: 'p', calc: 'Base ÷ φ', lh: '1.4' },
            { name: 'Eyebrow L', token: 'Eye-L', class: 'eyebrow-l', tag: 'p', calc: 'Base', lh: '1.2' },
            { name: 'Eyebrow S', token: 'Eye-S', class: 'eyebrow-s', tag: 'p', calc: 'Base ÷ φ', lh: '1.2' },
        ];

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Inter', sans-serif;
          --c-bg: var(--mono-02);
          --c-card-bg: var(--mono-10);
          --c-text: var(--mono-02);
          --c-meta: var(--mono-05);
          --c-border: var(--mono-09);
          --c-accent: rgba(255, 255, 255, 0.1);
          
          container-type: inline-size;
          container-name: type-scale;
        }

        .type-container {
          display: grid;
          width: 100%;
          background: var(--c-bg);
          padding: 2rem 0;
          gap: 0;
        }

        /* --- TYPOGRAPHY LOGIC --- */
        .type-container {
            /* Mobile Defaults (1.309 Scale) */
            --base-size: 16px;
            --scale: 1.309;
            
            /* Stable UI Font Size (Unnaffected by mode-app) */
            --ui-fs-sm: calc(var(--base-size) / 1.309);

            --fs-sm: calc(var(--base-size) / var(--scale));
            --fs-base: var(--base-size);
            --fs-md: calc(var(--base-size) * var(--scale));
            --fs-lg: calc(var(--base-size) * var(--scale) * var(--scale));
            --fs-xl: calc(var(--base-size) * var(--scale) * var(--scale) * var(--scale));
            --fs-xxl: calc(var(--base-size) * var(--scale) * var(--scale) * var(--scale) * var(--scale));
            --fs-xxxl: calc(var(--base-size) * var(--scale) * var(--scale) * var(--scale) * var(--scale) * var(--scale));
        }

        @container type-scale (min-width: 963px) {
            .type-container {
                --base-size: 18px;
                --scale: 1.618;
                /* Stable UI Font Size for Desktop */
                --ui-fs-sm: calc(var(--base-size) / 1.618);
            }
        }

        /* APPLICATION MODE: Force Half-Phi */
        .type-container.mode-app {
            --scale: 1.309 !important;
            /* Note: --ui-fs-sm is NOT overridden here, preserving UI consistency */
        }

        /* --- CONTROL BAR --- */
        .control-bar {
            display: grid;
            /* Grid defined in query */
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--mono-04);
            margin-bottom: 2rem;
            width: 100%;
        }
        
        .control-inner {
            grid-column: 3 / -3;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .bar-title {
            color: var(--mono-10);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .toggle-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--mono-07);
            font-size: 0.8rem;
        }
        
        /* Toggle Switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--mono-04);
            transition: .4s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: var(--mono-10);
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--blue-07); }
        input:checked + .slider:before { transform: translateX(20px); }

        /* --- CARDS GRID --- */
        .cards-grid {
            display: grid;
            width: 100%;
            grid-column: 1 / -1;
            gap: 0;
            padding: 0;
            /* Explicit placement requires no auto-flow gaps */
        }

        .type-card {
            background: var(--c-card-bg);
            color: var(--c-text);
            /* Phidelity Internal Grid: 26 Columns */
            display: grid;
            grid-template-columns: repeat(26, 1fr);
            grid-template-rows: min-content 1fr min-content;
            padding: 1.5rem 0; /* Vertical padding only, horizontal handled by grid */
            
            border: 1px solid var(--c-border);
            border-radius: var(--radius-base, 0px);
        }

        .card-header {
            grid-column: 3 / -3;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--c-border);
            padding-bottom: 0.5rem;
        }

        .token-badge {
            font-family: 'Inter', sans-serif;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            background: var(--mono-09);
            padding: 4px 8px;
            border-radius: var(--radius-base, 0px);
            color: var(--mono-04);
        }

        .type-preview {
            grid-column: 3 / -3;
            margin: 0;
            flex-grow: 1;
            /* Ensure text doesn't overflow */
            overflow-wrap: break-word; 
        }

        .meta-item { display: flex; flex-direction: column; gap: 2px; }
        
        /* Meta Label -> Eyebrow S */
        .meta-label { 
            font-size: var(--ui-fs-sm); /* Stabilized */
            text-transform: uppercase; 
            letter-spacing: 1.5px; 
            font-weight: 600; 
            line-height: 1.2;
            color: var(--mono-06);
            font-family: 'Inter', sans-serif;
        }

        /* Meta Value -> Caption */
        .meta-value { 
            font-size: var(--ui-fs-sm); /* Stabilized */
            line-height: 1.4; 
            color: var(--c-text);
            font-weight: 400;
        }

        /* Specific Styles */
        .h1-l { font-family: 'DM Serif Display', serif; font-size: var(--fs-xxl); line-height: 1.1; }
        .h1-m { font-family: 'DM Serif Display', serif; font-size: var(--fs-xl); line-height: 1.1; }
        .h1-s { font-family: 'DM Serif Display', serif; font-size: var(--fs-lg); line-height: 1.2; }
        
        .summary-l { font-size: var(--fs-md); line-height: 1.309; font-weight: 300; }
        .summary-s { font-size: var(--fs-base); line-height: 1.5; font-weight: 300; }
        
        .h2 { font-family: 'DM Serif Display', serif; font-size: var(--fs-md); line-height: 1.3; }
        .h3 { font-family: 'Inter', sans-serif; font-size: var(--fs-base); line-height: 1.4; font-weight: 700; }
        
        .p-body { font-size: var(--fs-base); line-height: 1.6; color: var(--mono-04); }
        
        .caption { font-size: var(--fs-sm); line-height: 1.4; color: var(--mono-05); }

        .eyebrow-l { font-size: var(--fs-base); text-transform: uppercase; letter-spacing: 2px; font-weight: 600; line-height: 1.2; }
        .eyebrow-s { font-size: var(--fs-sm); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; line-height: 1.2; }

        .card-footer {
            grid-column: 3 / -3;
            margin-top: 1.5rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            row-gap: 1.5rem; /* Distinct "row of spacing" */
            column-gap: 0.5rem;
            border-top: 1px solid var(--c-border);
            padding-top: 0.75rem;
        }

        /* --- PHIDELITY GRID COORDINATES (LEGO Board) --- */
        ${this.generateGridCSS(styles)}

      </style>
      
      <div class="type-container">
        
        <!-- Control Bar -->
        <div class="control-bar">
            <div class="control-inner">
                <span class="bar-title">Select scale</span>
                <div class="toggle-wrapper">
                    <span>Application mode</span>
                    <label class="switch">
                        <input type="checkbox" id="mode-toggle">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="cards-grid">
            ${styles.map(s => `
                <div class="type-card">
                    <div class="card-header">
                        <span class="token-badge">${s.token}</span>
                    </div>
                    
                    <${s.tag} class="type-preview ${s.class}">${s.name}</${s.tag}>
                    
                    <div class="card-footer caption">
                        <div class="meta-item">
                            <span class="meta-label">Calculation</span>
                            <span class="meta-value">${s.calc}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Size (px)</span>
                            <span class="meta-value meta-size">--</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Line Height</span>
                            <span class="meta-value">${s.lh}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Spacing</span>
                            <span class="meta-value meta-ls">--</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
      </div>
    `;
    }
}

customElements.define('phi-typographic-scale', TypographicScale);
