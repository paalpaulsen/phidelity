class PhiArticleBottomImage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    generateGridCSS() {
        // Standard Phidelity Breakpoints (Same as ArticleColumns)
        const breakpoints = [
            { id: '13', query: '(max-width: 169px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 170px) and (max-width: 768px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 769px) and (max-width: 1280px)', cols: 50, textCols: 1 }, /* User requested 1 col here */
            { id: '74', query: '(min-width: 1281px) and (max-width: 1688px)', cols: 74, textCols: 2 }, /* Reduced to 2 cols */
            { id: '98', query: '(min-width: 1689px)', cols: 98, textCols: 4 }
        ];

        return breakpoints.map(bp => {
            const cols = bp.cols;
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

                .full {
                    grid-area: auto / 3 / auto / -3;
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const title = this.getAttribute('title') || 'Nature’s Foundation';
        const summary = this.getAttribute('summary') || '';
        const image = this.getAttribute('image') || 'assets/images/bottom.jpg';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%; /* Fill the grid cell if stretched */
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text);
                    background: var(--mono-10);
                    container-type: inline-size;
                    container-name: article-columns;
                    position: relative; 
                    overflow: hidden; 
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-top: 3rem; 
                    padding-bottom: 0;
                    margin-bottom: -6rem; /* Create overlay with footer */
                    box-sizing: border-box;
                    gap: 0;
                    position: relative;
                    z-index: 2; /* Text over image */
                    flex: 1 0 auto; 
                }

                /* Bottom Image Container */
                .bottom-image-wrapper {
                    width: 100%;
                    display: block;
                    margin-top: auto; /* Push to bottom */
                    line-height: 0; 
                    flex-shrink: 0;
                    position: relative;
                    z-index: 1; /* Image under text */
                    pointer-events: none; /* Let clicks pass through if needed */
                }

                .bottom-image-wrapper img {
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    display: block;
                    object-fit: cover;
                }

                /* Typography */
                h2 {
                    font-family: var(--font-serif);
                    font-size: var(--type-h2);
                    line-height: 1.1;
                    margin: 0;
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
                    font-size: var(--type-base);
                    line-height: var(--leading-base);
                    color: var(--c-text);
                    margin-top: 0;
                    margin-bottom: 1rem;
                }

                p.summary {
                    font-family: var(--font-sans);
                    font-size: var(--type-summary-l);
                    font-weight: 300;
                    line-height: 1.5;
                    color: var(--c-text);
                    margin-bottom: 2rem;
                    max-width: 65ch;
                }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light);
                    margin-top: 2rem;
                }
                
                /* Override Grid Area: Centered or standard? 
                   User previously asked for constraints (left-half) to overlap image. 
                   With image BELOW, we might want to revert to standard width, OR keep the interesting constraints?
                   "Let's just have it ... below the text container." 
                   Usually implies standard text block then image.
                   I will remove the specific overrides that forced empty columns, as that was for the "background overlap" design.
                   Standard behavior (defined in generateGridCSS) is likely preferred if they are distinct blocks.
                */

                ${this.generateGridCSS()}

                /* OVERRIDES for Left-Weighted Layout */
                
                /* Tablet (50 cols): Span left ~66% */
                @container article-columns (min-width: 769px) and (max-width: 1280px) {
                    .full {
                        grid-area: auto / 3 / auto / 36 !important; /* Ends at ~70% */
                    }
                }
                
                /* Desktop (74 cols): Span left ~60% */
                @container article-columns (min-width: 1281px) and (max-width: 1688px) {
                    .full {
                         grid-area: auto / 3 / auto / 48 !important; /* ~60% width */
                    }
                }

                /* Large (98 cols): Span left ~50% */
                @container article-columns (min-width: 1689px) {
                    .full {
                         grid-area: auto / 3 / auto / 52 !important; /* ~50% width */
                    }
                }

                /* Mobile (26 cols): No overlay */
                @container article-columns (max-width: 768px) {
                    .container {
                        margin-bottom: 0;
                    }
                }
            </style>

            <div class="container">
                <div class="full">
                    <h2>${title}</h2>
                    <p class="summary">${summary}</p>
                    
                    <div class="multi-column">
                         <slot></slot>
                    </div>
                </div>
            </div>

            <div class="bottom-image-wrapper">
                <img src="${image}" alt="Decorative Bottom Background">
            </div>
        `;
    }
}

customElements.define('phi-article-bottom-image', PhiArticleBottomImage);
