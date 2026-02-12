class PhiHeaderWhite extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    // No event listeners needed as buttons are removed
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: relative; /* Changed from sticky per user request */
          /* top: 0; removed */
          z-index: 5000;
        }

        header {
          padding: 0 1rem;
          height: 60px; /* var(--header-height) */
          display: flex;
          align-items: center;
          justify-content: center; /* Centered Logo */
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
          background: #FFFFFF; 
          border-bottom: 1px solid var(--mono-06);
          color: var(--mono-01); /* Dark text/icons */
        }
        
        .logo-img {
            height: 16px; 
            width: auto; 
            display: block;
        }
      </style>

      <header>
        <!-- Logo: Sopra Steria -->
        <img src="assets/images/soprasteria-logo.svg" alt="Sopra Steria" class="logo-img">
      </header>
    `;
  }
}

customElements.define('phi-header-white', PhiHeaderWhite);
