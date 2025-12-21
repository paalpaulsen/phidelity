class PhiArticleImage extends HTMLElement {
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

    render() {
        const image = this.getAttribute('image') || 'assets/images/article_image_bg.png';
        const caption = this.getAttribute('caption') || 'Seagulls in flight, demonstrating natural aerodynamics and fluid motion.';
        const credit = this.getAttribute('credit') || 'Photo: Nature Collection';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/macro.css">
            <style>
                :host {
                    display: flex; /* Changed from block to flex to fill parent zone directly */
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    flex: 1; /* Grow to fill zone */
                    min-height: 0; /* Allow scaling down to parent grid height */
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    background: var(--mono-10);
                    container-type: inline-size;
                    container-name: article-image;
                }

                .container {
                    position: relative;
                    width: 100%;
                    flex: 1; /* Fill the host */
                    height: auto; /* Let flex handle height */
                    min-height: 400px; /* Restore fallback height for mobile */
                    /* Background image removed in favor of img element */
                    /* Background image removed in favor of img element */
                    background: white; /* Changed from grey to white to avoid grey gaps */
                    overflow: hidden;
                    border-radius: 4px; /* Optional rounded corners */
                }

                /* Toggle Button (Info Icon) */
                .toggle-btn {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    background-color: var(--blue-07, #009EFF);
                    color: white;
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
                    width: 3rem; /* Starts same width as button */
                    height: 3rem; /* Starts same height as button */
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
                    max-width: calc(100% - 4rem); /* Ensure it stays within container with padding */
                    height: auto;
                    min-height: 120px;
                    padding: 1.5rem 2rem 1.5rem 1.5rem;
                    border-radius: 12px;
                    opacity: 1;
                    pointer-events: auto;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    right: 2rem;
                    bottom: 5.5rem; /* Moves up above the button, or we can expand the button itself */
                }
                
                /* Alternative Interaction: The button is part of the card? 
                   Let's keep the button separate as the trigger. 
                   When expanded, the card appears above/next to it.
                */

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

                p {
                    margin: 0;
                    /* Typography handled by global .caption from macro.css */
                }
                p.caption { margin-top: 0; }

                .credit {
                    display: block;
                    margin-top: 0.5rem;
                    font-size: var(--type-micro);
                    color: var(--c-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                /* Close x state for button when expanded? */
                .container.expanded .toggle-btn {
                    background-color: var(--c-text);
                    transform: rotate(45deg); /* Optional: turn i into x style if using plus, but for 'i' maybe just color change */
                }
                
                .container.expanded .icon-i {
                   /* If we want to change icon on expand */
                }

                /* Background Image as Element */
                .bg-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: bottom;
                    z-index: 0;
                    min-width: 100%;
                    min-height: 100%;
                }
                /* Grid-based Responsive Height */
                @container article-image (min-width: 1281px) {
                    .container {
                        min-height: 600px;
                    }
                }
                
                @container article-image (min-width: 1689px) {
                    .container {
                        min-height: 800px;
                    }
                }
            </style>

            <div class="container">
                <img class="bg-image" src="${image}" alt="Article Background" loading="lazy">
                
                <div class="caption-overlay">
                    <div class="caption-content">
                        <p class="caption">${caption}</p>
                        <span class="credit">${credit}</span>
                    </div>
                </div>

                <button class="toggle-btn" aria-label="Show info">
                    <span class="icon-i">i</span>
                </button>
            </div>
        `;
    }
}

customElements.define('phi-article-image', PhiArticleImage);
