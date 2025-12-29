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
        // Standard Phidelity Breakpoints (Figma Aligned)
        const breakpoints = [
            { id: '13', query: '(max-width: 337px)', cols: 13, textCols: 1 },
            { id: '26', query: '(min-width: 338px) and (max-width: 649px)', cols: 26, textCols: 1 },
            { id: '50', query: '(min-width: 650px) and (max-width: 961px)', cols: 50, textCols: 2 },
            { id: '74', query: '(min-width: 962px) and (max-width: 1273px)', cols: 74, textCols: 3 },
            { id: '98', query: '(min-width: 1274px) and (max-width: 1585px)', cols: 98, textCols: 4 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122, textCols: 5 },
            { id: '146', query: '(min-width: 1898px) and (max-width: 2209px)', cols: 146, textCols: 6 },
            { id: '170', query: '(min-width: 2210px) and (max-width: 2521px)', cols: 170, textCols: 6 },
            { id: '194', query: '(min-width: 2522px)', cols: 194, textCols: 6 }
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
                gridArea = 'auto / 3 / auto / 25'; // Widen text area for mobile
            } else if (bp.id === '98') {
                gridArea = 'auto / 5 / auto / 58';
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
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 4rem; 
                    box-sizing: border-box;
                    gap: 0;
                    height: 100%; 
                    align-content: start; /* Align to top like ArticleColumns */
                    
                    /* Background Moved Here for Container Query Support */
                    background-image: url('assets/images/hero_bg.jpg');
                    background-size: cover;
                    background-position: center; 
                    background-repeat: no-repeat;
                    background-color: var(--mono-09);
                }

                /* Mobile Background Adjustment */
                @container hero (max-width: 649px) {
                    .container {
                        background-size: 70% auto; /* 70% width per request */
                        background-position: bottom center; /* Image at bottom */
                    }
                    .content-area {
                        margin-bottom: 5rem; /* Space under text */
                    }
                }

                /* Tablet (50 Cols) Background Adjustment (Fix Cropping) */
                @container hero (min-width: 650px) and (max-width: 961px) {
                    .container {
                        /* Shift image left by approx 3 columns worth (3 * 13px = ~40px or %), 
                           but background-position is easier. 
                           User said "move image 3 columns to the left".
                           If it's centered, moving left means moving center point left.
                           "40% center" or similar */
                        background-position: 40% center; 
                    }
                }

                /* Large Screen Background Adjustment (122 Col+) */
                @container hero (min-width: 1586px) {
                    .container {
                        background-size: 85%; /* Reduce a bit */
                        background-position: right center; /* Ensure it stays right */
                    }
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

                .social-links {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 0.5rem;
                }
                .icon-link {
                    color: var(--c-text);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1rem;
                    height: 1rem;
                    transition: opacity 0.2s ease;
                }
                .icon-link:hover {
                    opacity: 0.7;
                }
                .icon-link svg {
                    width: 100%;
                    height: 100%;
                    fill: currentColor;
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
                            <div class="social-links">
                                <!-- Email -->
                                <a href="mailto:phidelity@interfazer.com" class="icon-link" aria-label="Email">
                                    <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                                </a>
                                <!-- LinkedIn -->
                                <a href="https://www.linkedin.com/in/paalpaulsen/" class="icon-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                                <!-- X -->
                                <a href="https://x.com/paalpaulsen" class="icon-link" target="_blank" rel="noopener noreferrer" aria-label="X">
                                    <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('phi-hero', PhiHero);
