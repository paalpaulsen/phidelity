class MediaGallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      currentIndex: 0,
      images: [],
      showMobileCaption: false,
      showThumbnails: false
    };
  }

  static get observedAttributes() {
    return ['images'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'images' && oldValue !== newValue) {
      try {
        this.state.images = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Invalid JSON for images attribute', e);
      }
    }
  }

  connectedCallback() {
    if (this.hasAttribute('images') && this.state.images.length === 0) {
      try {
        this.state.images = JSON.parse(this.getAttribute('images'));
      } catch (e) {
        console.error('Invalid JSON for images attribute', e);
      }
    }
    this.render();
  }

  nextImage() {
    this.state.currentIndex = (this.state.currentIndex + 1) % this.state.images.length;
    this.render();
  }

  prevImage() {
    this.state.currentIndex = (this.state.currentIndex - 1 + this.state.images.length) % this.state.images.length;
    this.render();
  }

  selectImage(index) {
    this.state.currentIndex = index;
    this.render();
  }

  toggleMobileCaption() {
    this.state.showMobileCaption = !this.state.showMobileCaption;
    this.render();
  }

  toggleThumbnails() {
    this.state.showThumbnails = !this.state.showThumbnails;
    this.render();
  }

  render() {
    if (!this.state.images.length) return;
    const current = this.state.images[this.state.currentIndex];
    const { showMobileCaption } = this.state;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          font-family: 'Inter', sans-serif;
          --c-bg: #0E0E0E;
          --c-text: #fff;
          --c-accent: rgba(255, 255, 255, 0.1);
          
          container-type: inline-size;
          container-name: media-gallery;
        }

        .gallery-container {
          display: grid;
          width: 100%;
          height: 100%;
          background: var(--c-bg);
          color: var(--c-text);
          position: relative;
          overflow: hidden;
          gap: 0; /* Strict Grid Spacing */
        }

        /* ELEMENTS */
        .media-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        
        h3 { margin: 0; font-family: 'DM Serif Display', serif; font-weight: 400; font-size: 1.5rem; }

        /* ZONES DEFAULT STYLING */
        .title-zone { 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0.75rem 0; border-bottom: 1px solid var(--c-accent); 
            z-index: 5; width: 100%;
        }
        .media-zone { 
            position: relative; width: 100%; background: #000; 
            aspect-ratio: 16 / 9; overflow: hidden; 
        }
        .thumbs-zone { 
            display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; 
        }
        .info-zone { display: flex; flex-direction: column; gap: 1rem; }

        /* CAPTION OVERLAY (Mobile Only) */
        .caption-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%;
          background: rgba(14, 14, 14, 0.9);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          transform: translateY(${showMobileCaption ? '0' : '-100%'});
          transition: transform 0.3s ease-in-out;
          z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        /* STATIC CAPTION (Desktop/XL) */
        .static-caption {
            font-size: 0.9rem; line-height: 1.5; color: rgba(255,255,255,0.9); margin: 0;
        }
        .caption-text { font-size: 0.9rem; line-height: 1.5; color: rgba(255,255,255,0.9); margin: 0; }

        /* CAPTION TOGGLE */
        .caption-toggle {
            background: transparent; border: none; color: #fff; cursor: pointer; 
            padding: 8px; display: flex; align-items: center; justify-content: center;
            transition: transform 0.3s;
            transform: rotate(${showMobileCaption ? '180deg' : '0deg'});
        }
        .caption-toggle:hover { color: var(--c-accent); }

        /* THUMBNAILS */
        .thumbs-list { 
            flex: 1; display: flex; gap: 0.5rem; overflow-x: auto; 
            scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth;
        }
        .thumbs-list::-webkit-scrollbar { display: none; }
        
        .thumb { 
            width: 100px; height: auto; aspect-ratio: 16 / 9; /* Enforce 16:9 */
            object-fit: cover; cursor: pointer; opacity: 0.5; 
            border: 1px solid transparent; flex-shrink: 0; transition: opacity 0.2s;
        }
        .thumb.active { opacity: 1; border-color: #fff; }
        .thumb:hover { opacity: 1; }

        .nav-btn {
            background: transparent; border: 1px solid rgba(255,255,255,0.3); 
            color: #fff; cursor: pointer; width: 32px; height: 32px; 
            display: flex; align-items: center; justify-content: center; 
            transition: all 0.2s; flex-shrink: 0;
        }
        .nav-btn:hover { background: #fff; color: #000; }


        /* --- PHIDELITY GRID COORDINATES --- */

        /* SHARED STYLES FOR STACKED LAYOUTS (< 963px) */
        /* These are applied by individual breakpoints below */

        /* 13 Cols (< 170px) */
        @container media-gallery (max-width: 169px) {
           .gallery-container {
             grid-template-columns: repeat(13, 1fr);
             grid-template-rows: auto auto auto;
             --col-w: calc(100cqw / 13);
           }
           /* 1 Col Padding Sides: Content 2-12 */
           .info-zone   { grid-column: 2 / 13; grid-row: 1; border: none; padding: 0; }
           .media-zone  { grid-column: 2 / 13; grid-row: 2; margin-bottom: calc(1 * var(--col-w)); }
           .thumbs-zone { 
               grid-column: 2 / 13; grid-row: 3; 
               gap: calc(0.5 * var(--col-w)); /* Smaller gap to fit 3 thumbs */
               margin-bottom: calc(1 * var(--col-w)); 
           }
           .thumbs-list { gap: calc(0.5 * var(--col-w)); }
           .thumb       { width: calc(2 * var(--col-w)); } /* 2 cols wide */
           .nav-btn     { width: calc(1 * var(--col-w)); height: calc(1 * var(--col-w)); }
           
           .static-caption { display: none; }
           .caption-toggle { display: flex; }
           .caption-overlay { display: block; }
        }

        /* 26 Cols (170px - 650px) */
        @container media-gallery (min-width: 170px) and (max-width: 650px) {
           .gallery-container {
             grid-template-columns: repeat(26, 1fr);
             grid-template-rows: auto auto auto;
             --col-w: calc(100cqw / 26);
           }
           /* 2 Col Padding Sides: Content 3-24 */
           .info-zone   { grid-column: 3 / 25; grid-row: 1; border: none; padding: 0; }
           .media-zone  { grid-column: 3 / 25; grid-row: 2; margin-bottom: calc(2 * var(--col-w)); }
           .thumbs-zone { 
               grid-column: 3 / 25; grid-row: 3; 
               gap: calc(1 * var(--col-w)); 
               margin-bottom: calc(2 * var(--col-w)); 
           }
           .thumbs-list { gap: calc(1 * var(--col-w)); }
           .thumb       { width: calc(3 * var(--col-w)); }
           .nav-btn     { width: calc(2 * var(--col-w)); height: calc(2 * var(--col-w)); }
           
           .static-caption { display: none; }
           .caption-toggle { display: flex; }
           .caption-overlay { display: block; }
        }

        /* 50 Cols (651px - 962px) */
        @container media-gallery (min-width: 651px) and (max-width: 962px) {
           .gallery-container {
             grid-template-columns: repeat(50, 1fr);
             grid-template-rows: auto auto auto;
             --col-w: calc(100cqw / 50);
           }
           /* 2 Col Padding Sides: Content 3-48 */
           .info-zone   { grid-column: 3 / 49; grid-row: 1; border: none; padding: 0; }
           .media-zone  { grid-column: 3 / 49; grid-row: 2; margin-bottom: calc(2 * var(--col-w)); }
           .thumbs-zone { 
               grid-column: 3 / 49; grid-row: 3; 
               gap: calc(1 * var(--col-w)); 
               margin-bottom: calc(2 * var(--col-w)); 
           }
           .thumbs-list { gap: calc(1 * var(--col-w)); }
           .thumb       { width: calc(4 * var(--col-w)); }
           .nav-btn     { width: calc(2 * var(--col-w)); height: calc(2 * var(--col-w)); }
           
           .static-caption { display: none; }
           .caption-toggle { display: flex; }
           .caption-overlay { display: block; }
        }

        /* 74 Cols (963px - 1274px) - DESKTOP START */
        @container media-gallery (min-width: 963px) and (max-width: 1274px) {
          .gallery-container {
            grid-template-columns: repeat(74, 1fr);
            grid-template-rows: auto auto;
            --col-w: calc(100cqw / 74);
          }
          /* Media: 1-52 */
          .media-zone { grid-column: 1 / 53; grid-row: 1; }
          /* Info: 55-72 (Gap 53-54, Right Gap 73-74) */
          .info-zone { 
              grid-column: 55 / 73; grid-row: 1 / 3; 
              border-left: 1px solid var(--c-accent); padding-left: 1rem;
          }
          /* Thumbs: 3-50 (Indented 2 cols) */
          .thumbs-zone { 
              grid-column: 3 / 51; grid-row: 2; 
              padding-top: 0; 
              margin-top: calc(2 * var(--col-w)); 
              margin-bottom: calc(2 * var(--col-w));
              gap: calc(2 * var(--col-w)); 
          }
          .thumbs-list { gap: calc(2 * var(--col-w)); } 
          .thumb       { width: calc(5 * var(--col-w)); } /* 5 Cols wide */
          .nav-btn     { width: calc(2 * var(--col-w)); height: calc(2 * var(--col-w)); } /* 2x2 Cols */
          
          .static-caption { display: block; }
          .caption-overlay { display: none; }
          .caption-toggle { display: none; }
        }

        /* 98 Cols (1275px - 1585px) */
        @container media-gallery (min-width: 1275px) and (max-width: 1585px) {
          .gallery-container {
            grid-template-columns: repeat(98, 1fr);
            grid-template-rows: auto auto;
            --col-w: calc(100cqw / 98);
          }
          /* Media: 1-70 */
          .media-zone { grid-column: 1 / 71; grid-row: 1; }
          /* Info: 73-96 (Gap 71-72, Right Gap 97-98) */
          .info-zone { 
              grid-column: 73 / 97; grid-row: 1 / 3; 
              border-left: 1px solid var(--c-accent); padding-left: 1rem;
          }
          /* Thumbs: 3-68 (Indented 2 cols) */
          .thumbs-zone { 
              grid-column: 3 / 69; grid-row: 2; 
              padding-top: 0; 
              margin-top: calc(2 * var(--col-w));
              margin-bottom: calc(2 * var(--col-w));
              gap: calc(2 * var(--col-w));
          }
          .thumbs-list { gap: calc(2 * var(--col-w)); }
          .thumb       { width: calc(6 * var(--col-w)); }
          .nav-btn     { width: calc(2 * var(--col-w)); height: calc(2 * var(--col-w)); }
          
          .static-caption { display: block; }
          .caption-overlay { display: none; }
          .caption-toggle { display: none; }
        }

        /* 122 Cols (1586px - 1897px) - XL START */
        @container media-gallery (min-width: 1586px) and (max-width: 1897px) {
          .gallery-container {
            grid-template-columns: repeat(122, 1fr);
            grid-template-rows: 100%;
            --col-w: calc(100cqw / 122);
          }
          /* Media: 1-80 */
          .media-zone { grid-column: 1 / 81; grid-row: 1 / -1; height: 100%; }
          /* Info: 83-102 (Gap 81-82) */
          .info-zone { 
              grid-column: 83 / 103; grid-row: 1 / -1; 
              border: none; padding: 0;
              padding-top: calc(2 * var(--col-w)); /* 2 Col Top Spacing */
          }
          /* Thumbs: 105-122 (Gap 103-104) */
          .thumbs-zone { 
              grid-column: 105 / -1; grid-row: 1 / -1; 
              flex-direction: column; border: none; 
              padding: calc(2 * var(--col-w)); /* 2 Col Padding All Sides */
              gap: calc(2 * var(--col-w));
          }
          .thumbs-list { flex-direction: column; width: 100%; gap: calc(2 * var(--col-w)); }
          .thumb { width: 100%; height: auto; aspect-ratio: 16/9; }
          .nav-btn { display: none; }
          
          .static-caption { display: block; }
          .caption-overlay { display: none; }
          .caption-toggle { display: none; }
          .title-zone { border: none; margin-bottom: calc(2 * var(--col-w)); padding: 0; }
        }

        /* 146 Cols (> 1898px) */
        @container media-gallery (min-width: 1898px) {
          .gallery-container {
            grid-template-columns: repeat(146, 1fr);
            grid-template-rows: 100%;
            --col-w: calc(100cqw / 146);
          }
          /* Media: 1-96 */
          .media-zone { grid-column: 1 / 97; grid-row: 1 / -1; height: 100%; }
          /* Info: 99-122 (Gap 97-98) */
          .info-zone { 
              grid-column: 99 / 123; grid-row: 1 / -1; 
              border: none; padding: 0;
              padding-top: calc(2 * var(--col-w)); /* 2 Col Top Spacing */
          }
          /* Thumbs: 125-146 (Gap 123-124) */
          .thumbs-zone { 
              grid-column: 125 / -1; grid-row: 1 / -1; 
              flex-direction: column; border: none; 
              padding: calc(2 * var(--col-w)); /* 2 Col Padding All Sides */
              gap: calc(2 * var(--col-w));
          }
          
          .thumbs-list { flex-direction: column; width: 100%; gap: calc(2 * var(--col-w)); }
          .thumb { width: 100%; height: auto; aspect-ratio: 16/9; }
          .nav-btn { display: none; }
          
          .static-caption { display: block; }
          .caption-overlay { display: none; }
          .caption-toggle { display: none; }
          .title-zone { border: none; margin-bottom: calc(2 * var(--col-w)); padding: 0; }
        }
      </style>

      <div class="gallery-container">
        
        <!-- INFO ZONE (Title + Static Caption) -->
        <div class="info-zone">
            <div class="title-zone">
              <h3>${current.title}</h3>
              
              <!-- Caption Toggle (Mobile Only) -->
              <button class="caption-toggle" onclick="this.getRootNode().host.toggleMobileCaption()" aria-label="Toggle Caption">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            
            <!-- Static Caption (Desktop/XL) -->
            <div class="static-caption">
                 <p class="caption-text">
                    ${current.description}
                    <br><br>
                    <small style="opacity: 0.7; text-transform: uppercase;">${current.credits}</small>
                 </p>
            </div>
        </div>
        
        <!-- MEDIA ZONE -->
        <div class="media-zone">
          <img class="media-img" src="${current.src}" alt="${current.title}">
          
          <!-- Caption Overlay (Mobile Only) -->
          <div class="caption-overlay">
             <p class="caption-text">
                ${current.description}
                <br><br>
                <small style="opacity: 0.7; text-transform: uppercase;">${current.credits}</small>
             </p>
          </div>
        </div>

        <!-- THUMBS ZONE -->
        <div class="thumbs-zone">
          <button class="nav-btn" onclick="this.getRootNode().host.prevImage()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div class="thumbs-list">
            ${this.state.images.map((img, idx) => `
              <img class="thumb ${idx === this.state.currentIndex ? 'active' : ''}" 
                   src="${img.src}" 
                   onclick="this.getRootNode().host.selectImage(${idx})">
            `).join('')}
          </div>

          <button class="nav-btn" onclick="this.getRootNode().host.nextImage()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

      </div>
    `;
  }

  // Re-attach listeners if needed, or use inline onclicks as above for simplicity in shadow DOM
}


customElements.define('phi-media-gallery', MediaGallery);
