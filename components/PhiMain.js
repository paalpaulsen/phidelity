class PhiMain extends HTMLElement {
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
          overflow-y: auto;
          container-type: inline-size;
          container-name: macro-view;
        }

        main {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #3C3C3C; /* var(--c-border) */
          min-height: 100%;
        }

        slot {
            display: contents;
        }
      </style>

      <main>
        <slot></slot>
      </main>
    `;
  }
}

customElements.define('phi-main', PhiMain);
