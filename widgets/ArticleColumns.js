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
        // Standard Phidelity Breakpoints (Figma Aligned)
        const breakpoints = [
            { id: '13', query: '(max-width: 337px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 338px) and (max-width: 649px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 650px) and (max-width: 961px)', cols: 50, textCols: 2 },
            { id: '74', query: '(min-width: 962px) and (max-width: 1273px)', cols: 74, textCols: 3 },
            { id: '98', query: '(min-width: 1274px) and (max-width: 1585px)', cols: 98, textCols: 3 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122, textCols: 3 },
            { id: '146', query: '(min-width: 1898px) and (max-width: 2209px)', cols: 146, textCols: 3 },
            { id: '170', query: '(min-width: 2210px) and (max-width: 2521px)', cols: 170, textCols: 3 },
            { id: '194', query: '(min-width: 2522px)', cols: 194, textCols: 3 }
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
                    grid-area: auto / ${bp.id === '122' ? 5 : 3} / auto / ${bp.id === '122' ? -5 : -3};
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const title = this.getAttribute('title') || 'A new paradigm';
        const summary = this.getAttribute('summary') || '';


        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/macro.css">
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text);
                    background: var(--mono-10); /* Standard White Background */
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
                    font-size: var(--type-base);
                    line-height: var(--leading-base);
                    color: var(--c-text);
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

                a { color: inherit; }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light);
                    margin-top: 2rem;
                }

                .image-span {
                    width: 100%;
                    margin: 0 0 2rem 0; /* Top aligned */
                    break-inside: avoid;
                    page-break-inside: avoid;
                }

                .image-span img {
                    width: 100%;
                    height: auto;
                    display: block;
                    background: #f0f0f0;
                }

                ${this.generateGridCSS()}
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
        `;
    }
}

customElements.define('phi-article-columns', PhiArticleColumns);
