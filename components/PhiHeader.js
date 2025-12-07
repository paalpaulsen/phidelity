class PhiHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const btnLeft = this.shadowRoot.getElementById('btn-left');
    const btnRight = this.shadowRoot.getElementById('btn-right');

    if (btnLeft) {
      btnLeft.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('toggle-left-nav', {
          bubbles: true,
          composed: true
        }));
      });
    }

    if (btnRight) {
      btnRight.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('toggle-right-nav', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 5000;
        }

        header {
          padding: 0 1rem;
          height: 60px; /* var(--header-height) */
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
          background: var(--mono-02);
          border-bottom: 1px solid #3C3C3C; /* var(--c-border) */
          color: var(--mono-10);
        }

        /* ICON BUTTONS */
        .nav-btn {
            cursor: pointer;
            background: transparent;
            border: none;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            color: inherit;
        }

        .nav-btn:hover {
            opacity: 0.6;
        }

        .nav-btn svg {
            width: 24px;
            height: 24px;
            display: block;
        }
      </style>

      <header>
        <!-- Icon: Menu -->
        <button id="btn-left" class="nav-btn" aria-label="Toggle Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Logo -->
        <svg width="38" height="26" viewBox="0 0 38 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 18.5714H12.0178V26H0V18.5714Z" fill="#0E9EFF"/>
            <path d="M23.2844 10.4H3.75556V15.6H15.0222V22.2857H23.2844V10.4Z" fill="#FF0000"/>
            <path d="M37.5556 0H6.00889V7.42857H26.2889V19.3143H37.5556V0Z" fill="#00FF00"/>
        </svg>

        <!-- Icon: Info (Project Information) -->
        <button id="btn-right" class="nav-btn" aria-label="Project Information">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </header>
    `;
  }
}

customElements.define('phi-header', PhiHeader);
