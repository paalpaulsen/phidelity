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
        const breakpoints = [
            { id: '13', query: '(max-width: 169px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 170px) and (max-width: 768px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 769px) and (max-width: 1280px)', cols: 50, textCols: 2 },
            { id: '74', query: '(min-width: 1281px) and (max-width: 1688px)', cols: 74, textCols: 3 },
            { id: '98', query: '(min-width: 1689px)', cols: 98, textCols: 4 }
        ];

        return breakpoints.map(bp => {
            const cols = bp.cols;

            // ArticleFlow MUST be flexible
            const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

            return `
            @container article-flow ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }

                .multi-column {
                    column-count: ${bp.textCols};
                }

                .content-wrapper {
                    grid-column: 3 / -3;
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

                /* Typography */

                h2 {
                    font-family: var(--font-serif);
                    font-size: var(--type-h2);
                    line-height: 1.1;
                    margin: 0 0 1rem 0;
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

                a { color: inherit; }

                /* Multi Column Layout */
                .multi-column {
                    column-gap: 4cqw;
                    column-rule: 1px solid var(--c-border-light);
                    margin-top: 1rem; /* Reduced from 2rem */
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
