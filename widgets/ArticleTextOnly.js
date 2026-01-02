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
        // Standard Phidelity Breakpoints (Figma Aligned)
        const breakpoints = [
            { id: '13', query: '(max-width: 337px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 338px) and (max-width: 649px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 650px) and (max-width: 961px)', cols: 50, textCols: 2 },
            { id: '74', query: '(min-width: 962px) and (max-width: 1273px)', cols: 74, textCols: 3 },
            { id: '98', query: '(min-width: 1274px) and (max-width: 1585px)', cols: 98, textCols: 4 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122, textCols: 4 },
            { id: '146', query: '(min-width: 1898px) and (max-width: 2209px)', cols: 146, textCols: 6 },
            { id: '170', query: '(min-width: 2210px) and (max-width: 2521px)', cols: 170, textCols: 6 },
            { id: '194', query: '(min-width: 2522px)', cols: 194, textCols: 6 }
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
                    grid-area: auto / ${bp.id === '122' ? 5 : 3} / auto / ${bp.id === '122' ? -5 : -3};
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const title = this.getAttribute('title') || '';
        const summary = this.getAttribute('summary') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    min-width: 0;
                    height: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text);
                    background: var(--mono-10);
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
                }

                /* RESPONSIVE TYPOGRAPHY */
                @container article-text-only (max-width: 961px) {
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

                p {
                    font-family: var(--font-sans);
                    font-weight: 400;
                    font-size: var(--type-base);
                    line-height: var(--leading-base);
                    color: var(--c-text);
                    margin-top: 0;
                    margin-bottom: 1rem;
                    letter-spacing: var(--tracking-base, 0em);
                }

                h2 {
                    font-family: var(--font-serif);
                    font-size: var(--type-h2);
                    line-height: 1.1;
                    margin: 0;
                    font-weight: 400;
                    letter-spacing: var(--tracking-heading, 0.02em);
                }

                p.summary {
                    font-family: var(--font-sans);
                    font-size: var(--type-summary-l);
                    font-weight: 300;
                    line-height: 1.5;
                    color: var(--c-text);
                    margin-bottom: 2rem;
                }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light);
                }

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <div class="full">
                    ${title ? `<h2>${title}</h2>` : ''}
                    ${summary ? `<p class="summary">${summary}</p>` : ''}
                     <div class="multi-column">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('phi-article-text-only', PhiArticleTextOnly);
