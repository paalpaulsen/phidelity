class PhiHero extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'summary', 'eyebrow', 'name', 'role', 'image'];
    }

    attributeChangedCallback() {
        this.render();
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

            // Hero needs to be flexible but maybe less text-heavy logic needed here than ArticleColumns.
            // Using similar row height logic for consistency.
            const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

            let gridArea = 'auto / 5 / auto / -5';

            if (bp.id === '50') {
                gridArea = 'auto / 5 / auto / 27';
            } else if (bp.id === '74') {
                gridArea = 'auto / 5 / auto / 40';
            } else if (bp.id === '26') {
                gridArea = 'auto / 3 / auto / 18';
            }

            return `
            @container hero ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }

                .content-area {
                    grid-area: ${gridArea};
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const title = this.getAttribute('title') || '';
        const summary = this.getAttribute('summary') || '';
        const eyebrow = this.getAttribute('eyebrow') || '';
        const name = this.getAttribute('name') || '';
        const role = this.getAttribute('role') || '';
        const image = this.getAttribute('image') || '';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/macro.css">
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%; /* Force fill of parent Zone */
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text); 
                    container-type: inline-size;
                    container-name: hero;
                    background-image: url('assets/images/hero_bg.jpg');
                    background-size: cover;
                    background-position: center; /* Restore requested alignment */
                    background-repeat: no-repeat;
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 4rem; 
                    box-sizing: border-box;
                    gap: 0;
                    height: 100%; 
                    align-content: start; /* Align to top like ArticleColumns */
                }

                /* Local overrides only - Typography handled by macro.css */
                h1 { margin: 0 0 1.5rem 0; }
                .summary-l { margin-bottom: 2rem; max-width: 55ch; color: var(--mono-05); }

                /* Layout & Structure (Preserved) */
                .meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    background-color: var(--mono-10);
                    border: 2px solid rgba(255,255,255,0.5);
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .user-info {
                    display: flex;
                    flex-direction: column;
                }

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <div class="content-area">
                    <p class="eyebrow-l" style="color: var(--mono-05);">${eyebrow}</p>
                    <h1>${title}</h1>
                    <p class="summary-l">${summary}</p>
                    
                    <div class="meta">
                        <img class="avatar" src="${image}" alt="${name}">
                        <div class="user-info">
                            <p class="name">${name}</p>
                            <p class="role">${role}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('phi-hero', PhiHero);
