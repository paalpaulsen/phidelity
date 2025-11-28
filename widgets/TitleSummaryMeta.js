class TitleSummaryMeta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['eyebrow', 'title', 'summary', 'name', 'role', 'image'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const eyebrow = this.getAttribute('eyebrow') || 'Eyebrow Text';
    const title = this.getAttribute('title') || 'Page Title';
    const summary = this.getAttribute('summary') || '';
    const name = this.getAttribute('name') || 'Pål Eirik Paulsen';
    const role = this.getAttribute('role') || 'Digital Designer';
    const image = this.getAttribute('image') || 'https://via.placeholder.com/150';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          color: var(--c-text, #111);
          --font-serif: 'DM Serif Display', serif;
          
          /* Container Context */
          container-type: inline-size;
          container-name: title-meta;
        }

        .container {
          display: grid;
          /* Grid defined in queries */
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        /* Elements */
        .eyebrow {
          grid-column: 1 / -1;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: var(--c-text-muted, #999);
          margin: 0 0 1rem 0;
        }

        h1 {
          grid-column: 1 / -1;
          font-family: var(--font-serif);
          font-size: 4rem;
          font-weight: 400;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          letter-spacing: -0.02em;
        }

        .lead {
          grid-column: 1 / -1;
          font-size: 1.25rem;
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 2rem 0;
          opacity: 0.9;
        }

        .meta {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #eee;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .name { font-weight: 700; font-size: 1rem; }
        .role { font-weight: 400; font-size: 0.875rem; color: var(--c-text-muted, #666); }

        /* --- PHIDELITY GRID LOGIC --- */

        /* 13 Cols (< 170px) */
        @container title-meta (max-width: 169px) {
          .container { grid-template-columns: repeat(13, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 2 / -2; }
          h1 { font-size: 2rem; }
        }

        /* 26 Cols (170px - 650px) */
        @container title-meta (min-width: 170px) and (max-width: 650px) {
          .container { grid-template-columns: repeat(26, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 3 / -3; } /* Standard Mobile Margin */
          h1 { font-size: 2.5rem; }
        }

        /* 50 Cols (651px - 962px) */
        @container title-meta (min-width: 651px) and (max-width: 962px) {
          .container { grid-template-columns: repeat(50, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 4 / -4; }
        }

        /* 74 Cols (963px - 1274px) */
        @container title-meta (min-width: 963px) and (max-width: 1274px) {
          .container { grid-template-columns: repeat(74, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 7 / -7; } /* Indented for larger screens */
        }

        /* 98 Cols (1275px - 1585px) */
        @container title-meta (min-width: 1275px) and (max-width: 1585px) {
          .container { grid-template-columns: repeat(98, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 7 / -7; }
        }

        /* 122 Cols (1586px - 1897px) */
        @container title-meta (min-width: 1586px) and (max-width: 1897px) {
          .container { grid-template-columns: repeat(122, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 7 / -7; }
        }

        /* 146 Cols (> 1898px) */
        @container title-meta (min-width: 1898px) {
          .container { grid-template-columns: repeat(146, 1fr); }
          .eyebrow, h1, .lead, .meta { grid-column: 7 / -7; }
        }

      </style>

      <div class="container">
        <div class="eyebrow">${eyebrow}</div>
        <h1>${title}</h1>
        ${summary ? `<div class="lead">${summary}</div>` : ''}
        
        <div class="meta">
          <img class="avatar" src="${image}" alt="${name}">
          <div class="user-info">
            <span class="name">${name}</span>
            <span class="role">${role}</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('phi-title-summary-meta', TitleSummaryMeta);
