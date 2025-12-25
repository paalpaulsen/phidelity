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

    // FIRST RENDER: Create DOM Structure
    if (!this.shadowRoot.querySelector('.gallery-container')) {
      this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/macro.css">
      <style>
        * { box-sizing: border-box; }

        :host {
          display: block;
          width: 100%;
          height: auto;
          max-height: 85vh; /* Constrain height to prevent oversized images */
          font-family: 'Inter', sans-serif;
          --c-bg: var(--mono-02);
          --c-text: var(--mono-10);
          --c-accent: rgba(255, 255, 255, 0.1);
          
          container-type: inline-size;
          container-name: media-gallery;
        }

        .gallery-container {
          display: grid;
          width: 100%;
          height: auto;
          background: var(--c-bg);
          color: var(--c-text);
          position: relative;
          overflow: hidden;
          gap: 0; /* Strict Grid Spacing */
        }

        /* ELEMENTS */
        .media-img { width: 100%; height: 100%; object-fit: contain; display: block; background: #000; }
        
        h3 { margin: 0; font-family: var(--font-sans); font-weight: 700; }

        /* ZONES DEFAULT STYLING */
        .title-zone { 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0.75rem 0; border-bottom: 1px solid var(--c-accent); 
            z-index: 5; width: 100%;
        }
        .media-zone { 
            position: relative; width: 100%; background: var(--mono-01); 
            aspect-ratio: 16 / 9; 
            overflow: hidden;
            display: flex; align-items: center; justify-content: center; 
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
          padding: 1.5rem calc(2 * var(--col-w));
          transform: translateY(-100%);
          transition: transform 0.3s ease-in-out;
          z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .caption-overlay.show { transform: translateY(0); }
        
        /* STATIC CAPTION (Desktop/XL) */
        .static-caption { display: block; }
        
        /* Local Override for Dark Theme */
        .caption { 
            color: var(--mono-10); 
            opacity: 0.9;
        }
        /* Remove margin in overlay bubble */
        .caption-overlay .caption { margin-top: 0; }

        /* CAPTION TOGGLE */
        .caption-toggle {
            background: transparent; border: none; color: var(--mono-10); cursor: pointer; 
            padding: 8px; display: flex; align-items: center; justify-content: center;
            transition: transform 0.3s;
        }
        .caption-toggle.active { transform: rotate(180deg); }
        .caption-toggle:hover { color: var(--c-accent); }

        /* THUMBNAILS */
        .thumbs-list { 
            flex: 1; display: flex; gap: 0.5rem; overflow: auto; 
            scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth;
        }
        .thumbs-list::-webkit-scrollbar { display: none; }
        
        .thumb { 
            width: 100px; height: auto; aspect-ratio: 16 / 9; /* Enforce 16:9 */
            object-fit: cover; cursor: pointer; opacity: 0.5; 
            border: 1px solid transparent; flex-shrink: 0; transition: opacity 0.2s;
        }
        .thumb.active { opacity: 1; border-color: var(--mono-10); }
        .thumb:hover { opacity: 1; }

        .nav-btn {
            background: transparent; border: 1px solid rgba(255,255,255,0.3); 
            color: var(--mono-10); cursor: pointer; width: 32px; height: 32px; 
            display: flex; align-items: center; justify-content: center; 
            transition: all 0.2s; flex-shrink: 0;
        }
        .nav-btn:hover { background: var(--mono-10); color: var(--mono-01); }


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
           .media-zone  { grid-column: 2 / 13; grid-row: 2; margin-bottom: calc(1 * var(--col-w)); aspect-ratio: 16/9; }
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
           .media-zone  { grid-column: 3 / 25; grid-row: 2; margin-bottom: calc(2 * var(--col-w)); aspect-ratio: 16/9; }
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
           .media-zone  { grid-column: 3 / 49; grid-row: 2; margin-bottom: calc(2 * var(--col-w)); aspect-ratio: 16/9; }
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
          .media-zone { grid-column: 1 / 53; grid-row: 1; height: 100%; }
          /* Info: 55-72 (Gap 53-54, Right Gap 73-74) */
          .info-zone { 
              grid-column: 55 / 73; grid-row: 1 / 3; 
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
          .media-zone { grid-column: 1 / 71; grid-row: 1; height: 100%; }
          /* Info: 73-96 (Gap 71-72, Right Gap 97-98) */
          .info-zone { 
              grid-column: 73 / 97; grid-row: 1 / 3; 
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
            grid-template-rows: auto;
            --col-w: calc(100cqw / 122);
          }
          /* Media: 1-80 */
          .media-zone { grid-column: 1 / 81; grid-row: 1 / -1; height: auto; aspect-ratio: 16/9; }
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
              gap: calc(1 * var(--col-w));
              overflow: hidden; /* Contain scrolling */
              justify-content: space-between;
              height: 0; min-height: 100%; /* Force height match */
          }
          .thumbs-list { 
              flex-direction: column; 
              width: 100%; 
              gap: calc(1 * var(--col-w)); 
              overflow-y: auto; /* Vertical Scroll */
          }
          .thumb { width: 100%; height: auto; aspect-ratio: 16/9; }
          
          /* Nav Buttons: Visible and Rotated */
          .nav-btn { 
              display: flex; 
              width: 100%; 
              height: 32px;
          }
          .nav-btn:first-child svg { transform: rotate(90deg); } /* Left Arrow -> Up */
          .nav-btn:last-child svg { transform: rotate(90deg); } /* Right Arrow -> Down */
          
          .static-caption { display: block; }
          .caption-overlay { display: none; }
          .caption-toggle { display: none; }
          .title-zone { border: none; margin-bottom: calc(2 * var(--col-w)); padding: 0; }
        }

        /* 146 Cols (> 1898px) */
        @container media-gallery (min-width: 1898px) {
          .gallery-container {
            grid-template-columns: repeat(146, 1fr);
            grid-template-rows: auto;
            --col-w: calc(100cqw / 146);
          }
          /* Media: 1-96 */
          .media-zone { grid-column: 1 / 97; grid-row: 1 / -1; height: auto; aspect-ratio: 16/9; }
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
              gap: calc(1 * var(--col-w));
              overflow: hidden;
              justify-content: space-between;
              height: 0; min-height: 100%; /* Force height match */
          }
          
          .thumbs-list { 
              flex-direction: column; 
              width: 100%; 
              gap: calc(1 * var(--col-w)); 
              overflow-y: auto;
          }
          .thumb { width: 100%; height: auto; aspect-ratio: 16/9; }
          
          /* Nav Buttons: Visible and Rotated */
          .nav-btn { 
              display: flex; 
              width: 100%; 
              height: 32px;
          }
          .nav-btn:first-child svg { transform: rotate(90deg); }
          .nav-btn:last-child svg { transform: rotate(90deg); }

          
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
              <h3 id="gallery-title"></h3>
              
              <!-- Caption Toggle (Mobile Only) -->
              <button id="cap-toggle" class="caption-toggle" onclick="this.getRootNode().host.toggleMobileCaption()" aria-label="Toggle Caption">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            
            <!-- Static Caption (Desktop/XL) -->
            <div class="static-caption">
                 <p class="caption" id="gallery-desc">
                 </p>
            </div>
        </div>
        
        <!-- MEDIA ZONE -->
        <div class="media-zone">
          <img id="gallery-img" class="media-img" src="" alt="">
          
          <!-- Caption Overlay (Mobile Only) -->
          <div id="gallery-overlay" class="caption-overlay">
             <p class="caption" id="gallery-overlay-desc">
             </p>
          </div>
        </div>

        <!-- THUMBS ZONE -->
        <div class="thumbs-zone">
          <button class="nav-btn" onclick="this.getRootNode().host.prevImage()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div class="thumbs-list" id="thumbs-list">
            ${this.state.images.map((img, idx) => `
              <img class="thumb" 
                   src="${img.src}" 
                   data-index="${idx}"
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

    // UPDATE DYNAMIC CONTENT
    // Reuse 'current' from top of scope

    // Image
    const img = this.shadowRoot.getElementById('gallery-img');
    img.src = current.src;
    img.alt = current.title;

    // Title
    this.shadowRoot.getElementById('gallery-title').textContent = current.title;

    // Descriptions
    const descHtml = `
      ${current.description}
      <br><br>
      <small style="opacity: 0.7; text-transform: uppercase;">${current.credits}</small>
    `;
    this.shadowRoot.getElementById('gallery-desc').innerHTML = descHtml;
    this.shadowRoot.getElementById('gallery-overlay-desc').innerHTML = descHtml;

    // Toggle State
    const toggle = this.shadowRoot.getElementById('cap-toggle');
    const overlay = this.shadowRoot.getElementById('gallery-overlay');

    if (this.state.showMobileCaption) {
      toggle.classList.add('active');
      overlay.classList.add('show');
    } else {
      toggle.classList.remove('active');
      overlay.classList.remove('show');
    }

    // Thumbnails Active State
    const thumbs = this.shadowRoot.querySelectorAll('.thumb');
    thumbs.forEach((t, i) => {
      if (i === this.state.currentIndex) t.classList.add('active');
      else t.classList.remove('active');
    });

    this.scrollToActive();
  }

  scrollToActive() {
    const activeThumb = this.shadowRoot.querySelector('.thumb.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Re-attach listeners if needed, or use inline onclicks as above for simplicity in shadow DOM
}


customElements.define('phi-media-gallery', MediaGallery);
