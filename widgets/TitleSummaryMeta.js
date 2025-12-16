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

  generateGridCSS() {
    const breakpoints = [
      { id: '13', query: '(max-width: 169px)', cols: 13 },
      { id: '26', query: '(min-width: 170px) and (max-width: 650px)', cols: 26 },
      { id: '50', query: '(min-width: 651px) and (max-width: 962px)', cols: 50 },
      { id: '74', query: '(min-width: 963px) and (max-width: 1274px)', cols: 74 },
      { id: '98', query: '(min-width: 1275px) and (max-width: 1585px)', cols: 98 },
      { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122 },
      { id: '146', query: '(min-width: 1898px)', cols: 146 }
    ];

    const LAYOUT_CONFIG = {
      '13': {
        textGroup: '1 / 2 / auto / -2'
      },
      '26': {
        textGroup: '4 / 3 / 34 / -3'
      },
      '50': {
        rowCount: 50,
        textGroup: '6 / 6 / 51 / -6'
      },
      '74': {
        rowCount: 74,
        textGroup: '6 / 6 / 75 / -6'
      },
      '98': {
        rowCount: 98,
        textGroup: '6 / 6 / 99 / -6'
      },
      '122': {
        textGroup: '5 / 7 / 60 / -7'
      },
      '146': {
        textGroup: '1 / 7 / 71 / -7'
      }
    };

    return breakpoints.map(bp => {
      const cols = bp.cols;
      const config = LAYOUT_CONFIG[bp.id] || LAYOUT_CONFIG['98'];
      const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

      const explicitRows = config.rowCount
        ? `grid-template-rows: repeat(${config.rowCount}, ${rowHeight});`
        : '';

      return `
            @container title-meta ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                    ${explicitRows}
                }

                .text-group { grid-area: ${config.textGroup}; }
                .text-group { align-self: start; }
            }
            `;
    }).join('\n');
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
                  font-family: var(--font-sans, 'Inter', sans-serif);
                  color: var(--c-text, #111);
                  container-type: inline-size;
                  container-name: title-meta;
                }

                .container {
                  display: grid;
                  grid-template-columns: repeat(26, 1fr);
                  gap: 0;
                  padding-block: 3rem;
                }

                .text-group {
                  display: flex;
                  flex-direction: column;
                  gap: 1.5rem; /* Consistent vertical rhythm */
                }

                /* Typography */
                .eyebrow {
                  font-family: var(--font-sans);
                  font-size: 0.875rem;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                  font-weight: 700;
                  color: var(--mono-06);
                  margin: 0;
                }

                h1 {
                  font-family: var(--font-serif);
                  font-size: var(--type-h1);
                  font-weight: 400;
                  line-height: 1.1;
                  margin: 0;
                  letter-spacing: var(--tracking-heading, 0.02em);
                  color: var(--c-text);
                }

                .lead {
                  font-family: var(--font-sans);
                  font-size: var(--type-summary-l, 1.25rem);
                  font-weight: 300;
                  line-height: 1.5;
                  margin: 0;
                  color: var(--mono-06);
                }

                .meta {
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  font-family: var(--font-sans);
                  font-size: 0.875rem; 
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
                .role { font-weight: 400; font-size: 0.875rem; color: var(--mono-06); }

                ${this.generateGridCSS()}
            </style>

            <div class="container">
                <div class="text-group">
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
            </div>
        `;
  }
}

customElements.define('phi-title-summary-meta', TitleSummaryMeta);
