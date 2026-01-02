class PhiArticleFlow extends HTMLElement {
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

            // ArticleFlow MUST be flexible
            const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

            // ADDED: Margin on H2 instead of Container
            const marginRule = cols >= 26
                ? `margin-bottom: calc(2 * 100cqw / ${cols} / 1.618);`
                : 'margin-bottom: 0;';

            return `
            @container article-flow ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }
                
                /* Apply calculated space to H2 */
                h2 {
                    ${marginRule}
                }

                .multi-column {
                    column-count: ${bp.textCols};
                    /* No margin-top here to avoid H3 collapse issues */
                    margin-top: 0; 
                }

                .content-wrapper {
                    grid-column: ${bp.id === '122' ? 5 : 3} / ${bp.id === '122' ? -5 : -3};
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
                    background: var(--mono-10);
                    container-type: inline-size;
                    container-name: article-flow;
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 3rem; /* Standard Padding */
                    box-sizing: border-box;
                    gap: 0;
                }

                /* RESPONSIVE TYPOGRAPHY */
                @container article-flow (max-width: 961px) {
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

                /* Typography */

                h2 {
                    font-family: var(--font-serif);
                    font-size: var(--type-h2);
                    line-height: 1.1;
                    margin: 0;
                    font-weight: 400;
                    letter-spacing: var(--tracking-heading, 0.02em);
                    width: 100%;
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
                    margin-top: 0;
                    margin-bottom: 2rem;
                    /* No max-width restriction here as it is column-flow */
                }
                
                /* Hide empty summary */
                p.summary:empty {
                    display: none;
                }

                a { color: inherit; }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light);
                    margin-top: 0;
                    width: 100%;
                }

                .image-span {
                    width: 100%;
                    margin: 2rem 0 0 0;
                    break-inside: avoid;
                    page-break-inside: avoid;
                }

                .image-span img {
                    width: 100%;
                    height: auto;
                    display: block;
                    background: #f0f0f0;
                }
                
                /* Alignment Fix: Remove top margin from ALL H3s in columns */
                ::slotted(h3) {
                    margin-top: 0 !important;
                    margin-block-start: 0 !important;
                }

                /* Move spacing to bottom of paragraphs */
                ::slotted(p) {
                    margin-bottom: 2rem;
                }

                /* Handle Slotted Images in Columns */
                ::slotted(figure) {
                    width: 100%;
                    margin: 2rem 0;
                    break-inside: avoid;
                    page-break-inside: avoid;
                    display: block;
                }
                ::slotted(figure img) {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                /* Typography handled by macro.css */

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <!-- Content Wrapper (Restricted Width) -->
                <div class="content-wrapper">
                    <h2>${title}</h2>

                    <div class="multi-column">
                        <!-- Summary integrated into columns -->
                        ${summary ? `<p class="summary">${summary}</p>` : ''}
                        
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('phi-article-flow', PhiArticleFlow);
