class PhiArticleColumns extends HTMLElement {
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

            // ArticleColumns is a text-flow widget. It MUST be flexible to accomodate content height.
            // Using minmax(Phi, auto) triggers expansion.
            const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

            return `
            @container article-columns ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }

                .multi-column {
                    column-count: ${bp.textCols};
                }

                /* Grid Zones from snippet (Simplified to 'full' for this basic widget) */
                .full {
                    grid-area: auto / 3 / auto / -3;
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const title = this.getAttribute('title') || 'A new paradigm';
        const summary = this.getAttribute('summary') || 'Phidelity represents a tiny revolution in digital application design and architecture: Moving away from arbitrary breakpoints and viewports toward a mathematical, container-based canvas where ideas can grow and flourish naturally.';
        const eyebrow = this.getAttribute('eyebrow') || 'Phidelity';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text);
                    container-type: inline-size;
                    container-name: article-columns;
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 3rem; /* Standard Padding */
                    box-sizing: border-box;
                    gap: 0;
                }

                /* Typography */
                .eyebrow {
                    font-family: var(--font-sans);
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 700;
                    color: var(--mono-06, #999);
                    margin: 0 0 0.5rem 0;
                }

                h2 {
                    font-family: var(--font-serif);
                    font-size: var(--type-h2);
                    line-height: 1.1;
                    margin: 0 0 1rem 0;
                    font-weight: 400;
                    letter-spacing: var(--tracking-heading, 0.02em);
                }

                h3 {
                    font-family: var(--font-sans);
                    font-size: var(--type-base);
                    font-weight: 700;
                    margin: 2rem 0 1rem 0;
                    letter-spacing: var(--tracking-heading, 0.02em);
                }

                p {
                    font-family: var(--font-sans);
                    font-weight: 400;
                    font-size: var(--type-base, 1rem);
                    line-height: var(--leading-base, 1.618);
                    color: var(--c-text);
                    margin-bottom: 1rem;
                }

                p.summary {
                    font-family: var(--font-sans);
                    font-size: var(--type-summary-l, 1.25rem);
                    font-weight: 300;
                    line-height: 1.5;
                    color: var(--c-text);
                    margin-bottom: 2rem;
                    max-width: 65ch;
                }

                a { color: inherit; }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light, #dadada);
                    margin-top: 2rem;
                }

                .image-span {
                    width: 100%;
                    margin: 2rem 0;
                    break-inside: avoid;
                    page-break-inside: avoid;
                }

                .image-span img {
                    width: 100%;
                    height: auto;
                    display: block;
                    background: #f0f0f0;
                }

                .image-span figcaption {
                    color: var(--c-text-muted);
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 300;
                }

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <div class="full">
                    <p class="eyebrow">${eyebrow}</p>
                    <h2>${title}</h2>
                    <p class="summary">${summary}</p>
                    
                    <div class="multi-column">
                        <figure class="image-span">
                            <img src="https://images.unsplash.com/photo-1599270613570-a620f2e59f75?q=80&w=3540&auto=format&fit=crop" alt="Sunflowers">
                            <figcaption>The seeds of the sunflower are distributed on the flower head according to the golden ratio.</figcaption>
                        </figure>

                        <p>Every column, row, type scale, and spacing unit is mathematically calculated from the golden ratio. This means every layout flows with natural visual balance — no guesswork, no arbitrary numbers.</p>
                        
                        <p>Grids use column counts like 26, 50, 74, and 98 — intentionally divisible by 2, 3, 4, 6, and beyond. Combine fractions like 1/2, 1/3, 1/4, 1/6 effortlessly. Build layouts like stacking bricks — flexible but structured.</p>
                        
                        <p>Phidelity uses container queries to make modules adapt to their space — meaning you can mount content side-by-side or vertically, based on available room, not device width.</p>
                        
                        <h3>Built for horizontal and vertical stacking</h3>      
                        <p>On large screens, layouts expand horizontally like a gallery or dashboard. On small screens, they flow vertically like a classic article. No breakpoints needed — just space-awareness.</p>
                        
                        <p>Phidelity structures content using the natural progression of the golden ratio. From Fibonacci-based bento layouts to responsive container queries, it lets your interface breathe and scale like living systems. Modular, fluid, and inherently beautiful — your grid becomes a rhythm, not a restriction.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('phi-article-columns', PhiArticleColumns);
