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
          background: #FFFFFF; /* var(--c-bg) */
          border-bottom: 1px solid #3C3C3C; /* var(--c-border) */
          color: #252525; /* var(--c-text) */
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

        <span>Phidelity</span>

        <!-- Icon: User Profile -->
        <button id="btn-right" class="nav-btn" aria-label="User Profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </header>
    `;
    }
}

customElements.define('phi-header', PhiHeader);
