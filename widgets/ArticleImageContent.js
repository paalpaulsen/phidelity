class PhiArticleImageContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.expanded = false;
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('.toggle-btn').addEventListener('click', () => this.toggleCaption());
    }

    toggleCaption() {
        this.expanded = !this.expanded;
        const container = this.shadowRoot.querySelector('.container');
        if (this.expanded) {
            container.classList.add('expanded');
        } else {
            container.classList.remove('expanded');
        }
    }

    generateGridCSS() {
        // Standard Phidelity Breakpoints (keeping grid for consistency even if overlay absolute ignores it)
        const breakpoints = [
            { id: '13', query: '(max-width: 169px)', cols: 13 },
            { id: '26', query: '(min-width: 170px) and (max-width: 768px)', cols: 26 },
            { id: '50', query: '(min-width: 769px) and (max-width: 1280px)', cols: 50 },
            { id: '74', query: '(min-width: 1281px) and (max-width: 1688px)', cols: 74 },
            { id: '98', query: '(min-width: 1689px)', cols: 98 }
        ];

        return breakpoints.map(bp => {
            const cols = bp.cols || (bp.id === '13' ? 13 : 26);

            return `
            @container article-image-content ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                }
            }
            `;
        }).join('\n');
    }

    render() {
        const image = this.getAttribute('image') || 'assets/images/gallery_1.jpg';
        // Check for image set (JSON)
        let imageSet = null;
        try {
            const setAttr = this.getAttribute('images-set');
            if (setAttr) {
                imageSet = JSON.parse(setAttr);
            }
        } catch (e) {
            console.error('Invalid images-set JSON', e);
        }

        const alt = this.getAttribute('alt') || 'Full width article image';
        const caption = this.getAttribute('caption') || '';
        const credit = this.getAttribute('credit') || 'Photo: Source';

        // Prepare logical images
        // If imageSet exists, we render multiple images and toggle them with CSS
        // Keys expected: 'mobile', 'desktop' (maybe 'tablet')

        let imgHTML = `<img src="${image}" alt="${alt}" class="img-default">`;

        if (imageSet) {
            imgHTML = `
                <img src="${imageSet.mobile}" alt="${alt}" class="img-mobile">
                <img src="${imageSet.desktop}" alt="${alt}" class="img-desktop">
            `;
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/macro.css">
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    background: var(--mono-10);
                    container-type: inline-size;
                    container-name: article-image-content;
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 0; 
                    box-sizing: border-box;
                    position: relative; 
                }

                figure {
                    margin: 0;
                    width: 100%;
                    grid-column: 1 / -1;
                    position: relative;
                }

                img {
                    width: 100%;
                    height: auto;
                    display: block;
                    object-fit: contain;
                }

                /* Responsive Logic */
                .img-mobile { display: block; }
                .img-desktop { display: none; }
                
                @container article-image-content (min-width: 769px) {
                    .img-mobile { display: none; }
                    .img-desktop { display: block; }
                }

                /* If no set is used, default is always shown (class img-default) */
                
                /* Toggle Button (Info Icon) */
                .toggle-btn {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    background-color: var(--blue-07);
                    color: var(--mono-10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 20;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease, background-color 0.2s;
                    border: none;
                }

                .toggle-btn:hover {
                    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
                    transform: scale(1.05);
                }

                /* The 'i' icon */
                .icon-i {
                    font-family: var(--font-sans); 
                    font-weight: 700;
                    font-size: var(--type-h3);
                    font-style: normal;
                    line-height: 1;
                }

                /* Caption Overlay */
                .caption-overlay {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    background: white;
                    padding: 0;
                    width: 3rem; 
                    height: 3rem; 
                    border-radius: 2rem;
                    overflow: hidden;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 10;
                    pointer-events: none;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                /* Expanded State */
                .container.expanded .caption-overlay {
                    width: auto;
                    max-width: calc(100% - 4rem);
                    height: auto;
                    min-height: 120px;
                    padding: 1.5rem 2rem 1.5rem 1.5rem;
                    border-radius: 12px;
                    opacity: 1;
                    pointer-events: auto;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    right: 2rem;
                    bottom: 5.5rem; 
                }

                .caption-content {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.3s 0.1s, transform 0.3s 0.1s;
                    width: 100%;
                }

                .container.expanded .caption-content {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Typography handled by global .caption from macro.css */
                p { margin: 0; }
                p.caption {
                    /* Inherits from macro.css */
                    margin-top: 0;
                }

                .credit {
                    display: block;
                    margin-top: 0.5rem;
                    font-size: var(--type-micro);
                    color: var(--c-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .container.expanded .toggle-btn {
                    background-color: var(--c-text);
                    transform: rotate(45deg); 
                }

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <figure>
                    ${imgHTML}
                    
                    <div class="caption-overlay">
                        <div class="caption-content">
                            <p class="caption">${caption}</p>
                            <span class="credit">${credit}</span>
                        </div>
                    </div>

                    <button class="toggle-btn" aria-label="Show info">
                        <span class="icon-i">i</span>
                    </button>
                </figure>
            </div>
        `;
    }
}

customElements.define('phi-article-image-content', PhiArticleImageContent);
