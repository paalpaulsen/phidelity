class PhiFooter extends HTMLElement {
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
          width: 100%;
          z-index: 50;
        }

        footer {
          height: 60px; /* var(--header-height) */
          border-top: 1px solid #3C3C3C; /* var(--c-border) */
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          background: #FFFFFF; /* var(--c-bg) */
          color: #252525; /* var(--c-text) */
        }
      </style>

      <footer>
        <span>&copy; 2025 Phidelity</span>
        <span>Version: 1.0.0</span>
      </footer>
    `;
  }
}

customElements.define('phi-footer', PhiFooter);
