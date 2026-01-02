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
        // Standard Phidelity Breakpoints (Figma Aligned)
        const breakpoints = [
            { id: '13', query: '(max-width: 337px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 338px) and (max-width: 649px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 650px) and (max-width: 961px)', cols: 50, textCols: 1 }, /* Keep 1 for Tablet as per layout */
            { id: '74', query: '(min-width: 962px) and (max-width: 1273px)', cols: 74, textCols: 2 }, /* Keep 2 for Desktop */
            { id: '98', query: '(min-width: 1274px) and (max-width: 1585px)', cols: 98, textCols: 3 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122, textCols: 3 },
            { id: '146', query: '(min-width: 1898px) and (max-width: 2209px)', cols: 146, textCols: 3 },
            { id: '170', query: '(min-width: 2210px) and (max-width: 2521px)', cols: 170, textCols: 3 },
            { id: '194', query: '(min-width: 2522px)', cols: 194, textCols: 3 }
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
        const caption = this.getAttribute('caption') || 'Phidelity uses the divine math of the golden ratio to create a grid system that is both visually pleasing and responsive. Like the math nature uses to distribute seeds in a sunflower.';

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
                    margin-bottom: auto; 
                    box-sizing: border-box;
                    gap: 0;
                    position: relative;
                    z-index: 2; /* Text over image */
                    flex: 1 0 auto; 
                }

                /* RESPONSIVE TYPOGRAPHY */
                @container article-columns (max-width: 961px) {
                    .container {
                        --scale-up: 1.309; 
                        --type-h3: calc(var(--type-base) * var(--scale-up));
                        --type-h2: calc(var(--type-base) * var(--scale-up) * var(--scale-up));
                        --type-h1-s: calc(var(--type-base) * var(--scale-up) * var(--scale-up));
                        --type-h1-m: calc(var(--type-base) * var(--scale-up) * var(--scale-up) * var(--scale-up));
                        --type-h1-l: calc(var(--type-base) * var(--scale-up) * var(--scale-up) * var(--scale-up) * var(--scale-up));
                        --type-h1: var(--type-h1-m);
                        --type-display-med: var(--type-h1-m);
                        --type-display-lg: var(--type-h1-l);
                        --type-summary-l: calc(var(--type-base) * var(--scale-up));
                    }
                }

                /* Bottom Zone (Grid Layout) */
                .bottom-zone {
                    display: grid;
                    width: 100%;
                    margin-top: -3rem; /* Negative margin to pull up */
                    flex-shrink: 0;
                    position: relative;
                    z-index: 1;
                    /* Grid definitions per breakpoint below */
                }

                /* Layer 1: Background */
                .caption-bg {
                    background: var(--mono-09);
                    grid-column: 1 / -1;
                    /* grid-row set in breakpoints */
                    z-index: 0;
                }

                /* Layer 2: Text */
                .caption-text {
                    font-family: var(--font-sans);
                    font-size: var(--type-base); /* Increased size */
                    color: var(--mono-03);
                    margin: 0;
                    line-height: 1.5;
                    z-index: 2; /* On top of bg */
                    align-self: center; /* Center aligned */
                    pointer-events: none; /* Layout only */
                }

                /* Layer 3: Image */
                .image-zone {
                    position: relative;
                    line-height: 0;
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-end; 
                    z-index: 1; /* On top of bg, below text if overlapped */
                    pointer-events: none;
                }

                .image-zone img {
                    width: auto;
                    max-width: 100%;
                    max-height: 60vh;
                    object-fit: contain;
                    display: block;
                }

                /* --- BREAKPOINTS & GRID COORDINATES --- */

                /* 13 Cols (< 170px) */
                @container article-columns (max-width: 169px) {
                    .bottom-zone {
                        grid-template-columns: repeat(13, 1fr);
                        grid-template-rows: 1fr auto;
                        gap: 0;
                        margin-top: 0; /* Reset negative margin */
                    }
                    .caption-bg   { grid-row: 2; } 
                    .caption-text { 
                        grid-column: 2 / -2; 
                        grid-row: 2; 
                        align-self: center;
                        padding: 2rem 0;
                    }
                    .image-zone   { 
                        grid-column: 2 / -2; 
                        grid-row: 1 / -1; 
                        margin-bottom: 2rem; 
                    }
                }

                /* 26 Cols (170px - 768px) - Mobile */
                @container article-columns (min-width: 170px) and (max-width: 768px) {
                    .bottom-zone {
                        grid-template-columns: repeat(26, 1fr);
                        grid-template-rows: 1fr auto;
                        gap: 0;
                        margin-top: 0; /* Reset negative margin */
                    }
                    .caption-bg   { grid-row: 2; }
                    
                    /* Text: Left Side (Col 3 - 17) Wider, indented */
                    .caption-text { 
                        grid-column: 3 / 18; 
                        grid-row: 2;
                        align-self: center;
                        padding: 3rem 0;
                    }

                    /* Image: Right Side (9 Cols: 18 - 26) Narrower */
                    .image-zone { 
                        grid-column: 18 / -1; 
                        grid-row: 1 / -1; 
                        justify-content: flex-end;
                        align-items: flex-end;
                    }
                }

                /* 50 Cols (769px - 1280px) - Tablet */
                @container article-columns (min-width: 769px) and (max-width: 1280px) {
                    .bottom-zone {
                        grid-template-columns: repeat(50, 1fr);
                        grid-template-rows: 1fr auto;
                        gap: 0;
                        --col-w: calc(100cqw / 50);
                    }
                    .caption-bg { grid-row: 2; }
                    
                    /* Text: Col 4 - 28 */
                    .caption-text { 
                        grid-column: 4 / 29; 
                        grid-row: 2;
                        align-self: center;
                        padding: 4rem 0; /* Creates height */
                    }
                    
                    /* Image: Col 30 - 50 (No overlap) */
                    .image-zone { 
                        grid-column: 30 / -1; 
                        grid-row: 1 / -1; 
                        align-self: end;
                    }
                }

                /* 74 Cols (1281px - 1688px) - Desktop */
                @container article-columns (min-width: 1281px) and (max-width: 1688px) {
                    .bottom-zone {
                        grid-template-columns: repeat(74, 1fr);
                        grid-template-rows: 1fr auto;
                        gap: 0;
                        --col-w: calc(100cqw / 74);
                    }
                    .caption-bg { grid-row: 2; }
                    
                    /* Text: Col 4 - 40 */
                    .caption-text { 
                        grid-column: 4 / 41; 
                        grid-row: 2;
                        align-self: center;
                        padding: 4rem 0;
                    }
                    
                    /* Image: Col 43 - 74 */
                    .image-zone { 
                        grid-column: 43 / -1; 
                        grid-row: 1 / -1; 
                        align-self: end;
                    }
                }

                /* 98 Cols (> 1689px) - Large */
                @container article-columns (min-width: 1689px) {
                    .bottom-zone {
                        grid-template-columns: repeat(98, 1fr);
                        grid-template-rows: 1fr auto;
                        gap: 0;
                        --col-w: calc(100cqw / 98);
                    }
                    .caption-bg { grid-row: 2; }
                    
                    /* Text: Col 4 - 54 */
                    .caption-text { 
                        grid-column: 4 / 55; 
                        grid-row: 2;
                        align-self: center;
                        padding: 4rem 0;
                    }
                    
                    /* Image: Col 57 - 98 */
                    .image-zone { 
                        grid-column: 57 / -1; 
                        grid-row: 1 / -1; 
                        align-self: end;
                    }
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
                
                /* ... (Rest of typography unchanged) ... */
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
                
                ${this.generateGridCSS()}

                /* OVERRIDES for Left-Weighted Layout */
                @container article-columns (min-width: 650px) and (max-width: 961px) {
                    .full { grid-area: auto / 3 / auto / 36 !important; }
                }
                @container article-columns (min-width: 962px) and (max-width: 1273px) {
                    .full { grid-area: auto / 3 / auto / 60 !important; }
                }
                @container article-columns (min-width: 1274px) and (max-width: 1585px) {
                    .full { grid-area: auto / 3 / auto / 81 !important; }
                }
                @container article-columns (min-width: 1586px) {
                    .full { grid-area: auto / 5 / auto / 98 !important; }
                }
                @container article-columns (max-width: 649px) {
                    .container { margin-bottom: 0; }
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

            <div class="bottom-zone">
                <div class="caption-bg"></div>
                <p class="caption-text">${caption}</p>
                <div class="image-zone">
                    <img src="${image}" alt="${title} Figure">
                </div>
            </div>
        `;
    }
}

customElements.define('phi-article-bottom-image', PhiArticleBottomImage);
