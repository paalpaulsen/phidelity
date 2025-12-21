class PhiArticleQuote extends HTMLElement {
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
            { id: '13', query: '(max-width: 169px)', cols: 13 },
            { id: '26', query: '(min-width: 170px) and (max-width: 768px)', cols: 26 },
            { id: '50', query: '(min-width: 769px) and (max-width: 1280px)', cols: 50 },
            { id: '74', query: '(min-width: 1281px) and (max-width: 1688px)', cols: 74 },
            { id: '98', query: '(min-width: 1689px)', cols: 98 }
        ];

        return breakpoints.map(bp => {
            const cols = bp.cols;

            // Responsive centering logic - Compact width (~24-26 cols)
            let gridColumn = '3 / -3'; // Default for mobile/tablet (26)

            if (cols === 13) gridColumn = '1 / -1';
            if (cols === 50) gridColumn = '13 / -13'; // Width 26
            if (cols === 74) gridColumn = '19 / -19'; // Width 38 (Wider)
            if (cols === 98) gridColumn = '13 / -13'; // Width 74 (Even Wider)

            return `
            @container article-quote ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                }

                .content-area {
                    grid-column: ${gridColumn};
                }

                .container {
                    padding-block: 3rem; /* Standard Padding */
                    min-height: ${cols >= 50 ? '40vh' : '0'};
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const quote = this.getAttribute('quote') || 'The golden ratio is the signature of the divine in nature.';
        const name = this.getAttribute('name') || 'Pål Eirik Paulsen';
        const role = this.getAttribute('role') || 'SVP, Product Design';
        const image = this.getAttribute('image') || 'assets/images/author.jpg';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/macro.css">
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--c-text);
                    background: var(--mono-10);
                    container-type: inline-size;
                    container-name: article-quote;
                }



                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 3rem; 
                    box-sizing: border-box;
                    gap: 0;
                    align-content: center;
                }

                .content-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Centered alignment */
                    text-align: center;
                }

                /* Huge Quote Mark */
                .quote-mark {
                    font-family: var(--font-serif);
                    /* font-size: 8rem; -> No direct variable for 8rem. Using display-lg or keeping custom big */
                    font-size: var(--type-display-lg); /* 6.85rem max, close enough and fluid */
                    line-height: 0.5;
                    color: var(--mono-08); 
                    margin-bottom: 0; /* Decrease space up to quote symbol (to text) by 1em */
                    user-select: none;
                }

                /* Quote Text */
                .h2-quote {
                    font-family: var(--font-serif);
                    font-size: var(--type-h1-m); /* H1 Medium */ 
                    font-style: italic;
                    line-height: 1.2;
                    margin: 0 0 2rem 0;
                    font-weight: 400;
                    color: var(--c-text);
                    letter-spacing: var(--tracking-heading, 0.02em);
                }

                /* Meta / Byline */
                .meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-family: var(--font-sans);
                    font-size: var(--type-caption);
                }

                .avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    background-color: var(--mono-09);
                    /* No border needed on light background, or subtle */
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    text-align: left; /* Force left align relative to avatar */
                    align-items: flex-start;
                }
                
                /* Typography handled by macro.css (.name, .role) */

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <div class="content-area">
                    <span class="quote-mark">“</span>
                    <h2 class="h2-quote">${quote}</h2>
                    
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

customElements.define('phi-article-quote', PhiArticleQuote);
