class PhiRightNav extends HTMLElement {
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
          container-name: right-nav;
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
          color: var(--mono-06); /* var(--c-text-muted) */
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
          <li><a href="semantic.html" class="nav-l1">Semantic Elements</a></li>
          <li><a href="sections.html" class="nav-l1">Sections</a></li>
          <li><a href="widgets.html" class="nav-l1">Widgets</a></li>

          <!-- Layouts (Accordion) 
          <li class="nav-group">
             <a href="#" class="nav-l1 has-children">
                Layouts <span class="chevron"></span>
             </a>
             <ul class="sub-items">
                <li><a href="layouts.html#full" class="nav-l2">Full Width</a></li>
                <li><a href="layouts.html#golden" class="nav-l2">Golden Ratio</a></li>
                <li><a href="layouts.html#trinity" class="nav-l2">Trinity</a></li>
             </ul>
          </li>-->

          <!-- User Menu (Accordion) 
          <li class="nav-group active">
             <a href="#" class="nav-l1 has-children">
                User <span class="chevron"></span>
             </a>
             <ul class="sub-items">
                <li><a href="#" class="nav-l2">Profile</a></li>
                <li><a href="#" class="nav-l2">Account Settings</a></li>
                <li><a href="#" class="nav-l2">Log Out</a></li>
             </ul>
          </li> -->
        </ul>
      </nav>
    `;
  }
}

customElements.define('phi-right-nav', PhiRightNav);
