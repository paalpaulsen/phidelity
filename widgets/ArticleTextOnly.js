class PhiArticleTextOnly extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    generateGridCSS() {
        // Standard Phidelity Breakpoints
        const breakpoints = [
            { id: '13', query: '(max-width: 169px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 170px) and (max-width: 768px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 769px) and (max-width: 1280px)', cols: 50, textCols: 2 },
            { id: '74', query: '(min-width: 1281px) and (max-width: 1688px)', cols: 74, textCols: 3 },
            { id: '98', query: '(min-width: 1689px)', cols: 98, textCols: 4 }
        ];

        return breakpoints.map(bp => {
            const cols = bp.cols;
            const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

            return `
            @container article-text-only ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }

                .multi-column {
                    column-count: ${bp.textCols};
                }

                .full {
                    grid-area: auto / 3 / auto / -3;
                }
            }
            `;
        }).join('\n');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text);
                    container-type: inline-size;
                    container-name: article-text-only;
                }

                .container {
                    display: grid;
                    width: 100%;
                    height: 100%;
                    padding-block: 3rem; 
                    box-sizing: border-box;
                    gap: 0;
                    align-content: center;
                }

                p {
                    font-family: var(--font-sans);
                    font-weight: 400;
                    font-size: var(--type-base, 1rem);
                    line-height: var(--leading-base, 1.618);
                    color: var(--c-text);
                    margin-top: 0;
                    margin-bottom: 1rem;
                    letter-spacing: var(--tracking-base, 0em);
                }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light, #dadada);
                }

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <div class="full">
                     <div class="multi-column">
                        <p>Every column, row, type scale, and spacing unit is mathematically calculated from the golden ratio. This means every layout flows with natural visual balance — no guesswork, no arbitrary numbers.</p>
                        
                        <p>Grids use column counts like 26, 50, 74, and 98 — intentionally divisible by 2, 3, 4, 6, and beyond. Combine fractions like 1/2, 1/3, 1/4, 1/6 effortlessly. Build layouts like stacking bricks — flexible but structured.</p>
                        
                        <p>Phidelity uses container queries to make modules adapt to their space — meaning you can mount content side-by-side or vertically, based on available room, not device width.</p>
                        
                        <p>On large screens, layouts expand horizontally like a gallery or dashboard. On small screens, they flow vertically like a classic article. No breakpoints needed — just space-awareness.</p>
                        
                        <p>Phidelity structures content using the natural progression of the golden ratio. From Fibonacci-based bento layouts to responsive container queries, it lets your interface breathe and scale like living systems. Modular, fluid, and inherently beautiful — your grid becomes a rhythm, not a restriction.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('phi-article-text-only', PhiArticleTextOnly);
