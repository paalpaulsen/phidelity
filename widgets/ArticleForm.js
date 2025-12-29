class PhiArticleForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    generateGridCSS() {
        // Standard Phidelity Breakpoints
        const breakpoints = [
            { id: '13', query: '(max-width: 337px)', cols: 13 },
            { id: '26', query: '(min-width: 338px) and (max-width: 649px)', cols: 26 },
            { id: '50', query: '(min-width: 650px) and (max-width: 961px)', cols: 50 },
            { id: '74', query: '(min-width: 962px) and (max-width: 1273px)', cols: 74 },
            { id: '98', query: '(min-width: 1274px) and (max-width: 1585px)', cols: 98 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122 },
            { id: '146', query: '(min-width: 1898px) and (max-width: 2209px)', cols: 146 },
            { id: '170', query: '(min-width: 2210px) and (max-width: 2521px)', cols: 170 },
            { id: '194', query: '(min-width: 2522px)', cols: 194 }
        ];

        return breakpoints.map(bp => {
            const cols = bp.cols;
            const rowHeight = `minmax(calc(100cqw / ${cols} / 1.618), auto)`;

            // Layout Logic (Responsive)
            let nameArea = '1 / -1';
            let emailArea = '1 / -1';
            let messageArea = '1 / -1';
            let buttonArea = '1 / -1';

            if (cols >= 50) {
                nameArea = '3 / 15'; // Half-ish
                emailArea = '15 / 27'; // Half-ish
                messageArea = '3 / 27'; // Full
                buttonArea = '3 / 9'; // Left
            }

            if (cols >= 74) {
                nameArea = '3 / 25';
                emailArea = '27 / 49';
                messageArea = '3 / 49';
                buttonArea = '3 / 13';
            }

            return `
            @container article-form ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }
                .field-name { grid-column: ${nameArea}; }
                .field-email { grid-column: ${emailArea}; }
                .field-message { grid-column: ${messageArea}; }
                .field-submit { grid-column: ${buttonArea}; }
            }
            `;
        }).join('\n');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <!-- PHIDELITY MACRO (Baseline) -->
            <link rel="stylesheet" href="css/macro.css">
            
            <!-- THEME (Variables) -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@digdir/designsystemet-css@latest/dist/theme/designsystemet.css">
            
            <!-- COMPONENTS (Atoms) -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@digdir/designsystemet-css@latest/dist/src/index.css">

            <style>
                :host {
                    display: block;
                    width: 100%;
                    container-type: inline-size;
                    container-name: article-form;
                    background: var(--mono-09);
                }

                .container {
                    display: grid;
                    width: 100%;
                    padding-block: 3rem;
                    gap: 0; 
                }

                /* Layout Containers (Phidelity controls placement) */
                .field-wrapper {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 3ch; 
                }

                /* Typography Override explicitly for Headers (Phidelity Layer) */
                h2 {
                    grid-column: 3 / -1;
                    font-family: var(--font-serif);
                    font-size: var(--type-h2);
                    margin-bottom: 2rem;
                    color: var(--c-text);
                }

                /* 
                   Compatibility Fix for file:// protocol or missing resets:
                   Ensure box-sizing is border-box for all DS elements inside Shadow DOM.
                */
                .ds-field, .ds-label, .ds-input, .ds-button {
                    box-sizing: border-box;
                }
                
            </style>

            <!-- 
               DATA-COLOR-SCHEME & DATA-SIZE:
               Explicitly set theme and size mode for Designsystemet variables.
            -->
            <div class="container" data-color-scheme="light" data-size="md">
                <h2>Contact Us</h2>

                <!-- NAME -->
                <div class="field-wrapper field-name">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="name">Name</label>
                        <input class="ds-input" id="name" type="text" placeholder="Ola Nordmann" />
                    </div>
                </div>

                <!-- EMAIL -->
                <div class="field-wrapper field-email">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="email">Email</label>
                        <input class="ds-input" id="email" type="email" placeholder="ola@norge.no" />
                    </div>
                </div>

                <!-- MESSAGE -->
                <div class="field-wrapper field-message">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="message">Message</label>
                        <textarea class="ds-input" id="message" rows="5"></textarea>
                    </div>
                </div>

                <!-- SUBMIT -->
                <div class="field-wrapper field-submit">
                    <!-- Default ds-button = Primary -->
                    <button class="ds-button" type="button" data-variant="primary">
                        Send Message
                    </button>
                </div>

            </div>
        `;
    }
}

customElements.define('phi-article-form', PhiArticleForm);
