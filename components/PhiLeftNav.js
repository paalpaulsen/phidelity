class PhiLeftNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupAccordion();
  }

  setupAccordion() {
    const groups = this.shadowRoot.querySelectorAll('.nav-group');
    groups.forEach(group => {
      const header = group.querySelector('.nav-l1.has-children');
      if (!header) return;

      header.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling
        const isActive = group.classList.toggle('active');
        const chevron = header.querySelector('.chevron');
        if (chevron) {
          chevron.style.transform = isActive ? 'rotate(-135deg)' : 'rotate(45deg)';
        }
      });
    });

    // Color Links Logic
    const colorLinks = this.shadowRoot.querySelectorAll('.color-link');
    colorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const colorId = link.getAttribute('data-color');
        this.dispatchEvent(new CustomEvent('navigate-color', {
          detail: { colorId },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          background: var(--mono-09); /* var(--c-nav-bg) */
          overflow-y: auto;
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
          
          /* Container Context */
          container-type: inline-size;
          container-name: left-nav;
        }
        
        * { box-sizing: border-box; }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          
          /* 26 Column Phidelity Grid */
          display: grid;
          grid-template-columns: repeat(26, 1fr);
          width: 100%;
          --col-w: calc(100% / 26);
        }
        
        li {
            grid-column: 1 / -1; /* Full Width */
        }

        /* L1 ITEM (Eyebrow L) */
        .nav-l1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem 1rem calc(2 * var(--col-w)); /* Start at Col 3 */
          width: 100%; /* Ensure full width clickability */
          
          /* Eyebrow L Style */
          font-size: var(--type-base, 1rem);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          line-height: 1.2;
          
          text-decoration: none;
          color: var(--mono-03); /* var(--c-text) */
          border-bottom: 1px solid var(--mono-04); /* var(--c-border) */
          cursor: pointer;
          transition: background 0.2s ease; /* Smooth hover */
        }
        
        .nav-l1:hover {
            background: var(--mono-08);
        }
        
        /* Non-interactive L1 (Spacer) */
        span.nav-l1 {
            cursor: default;
        }
        span.nav-l1:hover {
            background: transparent;
        }

        /* L2 ITEM (Eyebrow S) */
        .nav-l2 {
          display: block;
          padding: 0.8rem 1.5rem 0.8rem calc(3 * var(--col-w)); /* Start at Col 4 */
          width: 100%;
          
          /* Eyebrow S Style */
          font-size: var(--type-caption, 0.8rem);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          line-height: 1.2;
          
          text-decoration: none;
          color: var(--mono-05); /* var(--c-text-muted) */
          border-bottom: 1px solid var(--mono-08); /* var(--c-border-light) */
          background: var(--mono-10); /* Lighter bg for L2 */
          transition: background 0.2s ease;
        }

        .nav-l2:hover {
          background: var(--mono-10);
          color: var(--mono-03);
        }
        
        /* CHEVRON */
        .chevron {
            width: 8px;
            height: 8px;
            border-right: 2px solid var(--mono-05);
            border-bottom: 2px solid var(--mono-05);
            transform: rotate(45deg); /* Points down */
            transition: transform 0.3s ease;
            margin-right: 0.5rem;
        }

        /* SUB ITEMS (Accordion) */
        .sub-items {
            display: none;
            width: 100%;
        }
        
        .nav-group.active .sub-items {
            display: block;
        }
      </style>

      <nav>
        <ul>
          <!-- Simple Links -->
          <li><span class="nav-l1">&nbsp;</span></li>
          
          <!-- Introduction (Accordion) -->
          <li class="nav-group">
             <a href="#intro-article" class="nav-l1 has-children">
                Introduction <span class="chevron"></span>
             </a>
             <ul class="sub-items">
                <li><a href="#origin" class="nav-l2">Origin</a></li>
                <li><a href="#natures-math" class="nav-l2">Nature's Math</a></li>
                <li><a href="#container-queries" class="nav-l2">Container Queries</a></li>
                <li><a href="#three-level-architecture" class="nav-l2">Three level architecture</a></li>
             </ul>
          </li>

          <li><a href="#full-bottom" class="nav-l1">Infographic</a></li>
          <li><a href="#grid" class="nav-l1">Grid System</a></li>
          <li><a href="#gallery" class="nav-l1">Phi Gallery</a></li>
          
          <li><a href="#typography" class="nav-l1">Typographic Scale</a></li>

          <!-- Color System (Accordion) -->
          <li class="nav-group">
             <a href="#pantone" class="nav-l1 has-children">
                Color System <span class="chevron"></span>
             </a>
             <ul class="sub-items">
                <li><a href="#" class="nav-l2 color-link" data-color="mono">Monochrome</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="green">Phi Green</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="blue">Phi Blue</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="purple">Phi Purple</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="magenta">Phi Magenta</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="red">Phi Red</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="earth">Phi Earth</a></li>
                <li><a href="#" class="nav-l2 color-link" data-color="solar">Phi Solar</a></li>
             </ul>
          </li>
          
          <li><a href="#bento" class="nav-l1">Bento Box</a></li>
          <li><a href="#masonry" class="nav-l1">Elastic Masonry</a></li>
          <li><a href="#contact" class="nav-l1">Contact Us</a></li>
          
        </ul>
      </nav>
    `;
  }
}

customElements.define('phi-left-nav', PhiLeftNav);
