class PhiLeftNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          background: #F1F1F1; /* var(--c-nav-bg) */
          overflow-y: auto;
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-l1 {
          display: block;
          padding: 1rem 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          color: #252525; /* var(--c-text) */
          border-bottom: 1px solid #3C3C3C; /* var(--c-border) */
        }

        .nav-l2 {
          display: block;
          padding: 0.8rem 1.5rem 0.8rem 2.5rem;
          text-decoration: none;
          color: #9E9E9E; /* var(--c-text-muted) */
          font-weight: 500;
          font-size: 0.9rem;
          border-bottom: 1px solid #DADADA; /* var(--c-border-light) */
        }

        .nav-l2:hover {
          background: #F9F9F9; /* var(--c-hover) */
          color: #252525; /* var(--c-text) */
        }
      </style>

      <nav>
        <ul>
          <li><span class="nav-l1">Layouts</span></li>
          <li><a href="#full" class="nav-l2">Full Width</a></li>
          <li><a href="#golden" class="nav-l2">Golden Ratio</a></li>
          <li><a href="#trinity" class="nav-l2">Trinity</a></li>
        </ul>
      </nav>
    `;
    }
}

customElements.define('phi-left-nav', PhiLeftNav);
