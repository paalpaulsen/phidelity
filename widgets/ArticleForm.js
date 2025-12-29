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
            // Default: Mobile (Stacked, Full Width)
            let nameArea = '1 / -1';
            let emailArea = '1 / -1';
            let phoneArea = '1 / -1';
            let messageArea = '1 / -1';
            let buttonArea = '1 / -1';

            // TABLET (50 Cols)
            // Standard Text Indent is typically 3/-3 or similar.
            // Here we want a 2-column form layout.
            if (cols >= 50 && cols < 74) {
                // Requested: 2 col spacing (Gap & Right Margin)
                // Usable Width: 3 to 49 (46 cols).
                // Gap: 2 cols.
                // Fields: 22 cols each.

                // Left: 3 to 25.
                // Gap: 25 to 27.
                // Right: 27 to 49.
                // Right Margin: 49 to 51.

                nameArea = '3 / 25';
                emailArea = '27 / 49';

                // Row 2: Phone
                phoneArea = '3 / 25';

                messageArea = '3 / 49';
                buttonArea = '3 / 15'; // Smaller button
            }

            // DESKTOP (74 Cols)
            // Standard Text Indent: 3 / -3 (approx)
            if (cols >= 74 && cols < 122) {
                // Requested: 2 col spacing between Name and Email. 2 col space to right margin.
                // Left Margin: 2 cols (1-3)
                // Right Margin: 2 cols (73-75) -> End line 73.
                // Total Width: 3 to 73 = 70 cols.
                // Gap: 2 cols.
                // Fields: (70 - 2) / 2 = 34 cols each.

                // Name: 3 to 3+34 = 37.
                // Gap: 37 to 39.
                // Email: 39 to 73.

                nameArea = '3 / 37';
                emailArea = '39 / 73';

                // Row 2: Phone (Align Left)
                phoneArea = '3 / 37';

                // Message: Full Width of Content Area
                messageArea = '3 / 73';
                buttonArea = '3 / 21';
            }

            // LARGE SCREENS (122+ Cols) 
            // Standard Text Indent: 5 / -5 (Cols 5 to 118) -> Line 5 to 119?
            if (cols >= 122) {
                // Layout: [5 ... 60] (4 col gap) [64 ... 119]
                // Total width 114 cols. 55 cols each.

                nameArea = '5 / 60';
                emailArea = '64 / 119';

                // Row 2: Phone
                phoneArea = '5 / 60';

                messageArea = '5 / 119';
                buttonArea = '5 / 25';
            }

            return `
            @container article-form ${bp.query} {
                .container {
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-auto-rows: ${rowHeight};
                }
                .field-name { grid-column: ${nameArea}; }
                .field-email { grid-column: ${emailArea}; }
                .field-phone { grid-column: ${phoneArea}; }
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
            
            <!-- COMPONENTS (Atoms) - Theme variables inherited from global scope -->
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
                    background-color: var(--mono-09); /* Enforce background */
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
                .ds-field, .ds-label, .ds-input, .ds-button, .ds-select, .ds-fieldset {
                    box-sizing: border-box;
                }
                
                ${this.generateGridCSS()}
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

                <!-- PHONE -->
                <div class="field-wrapper field-phone">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="phone">Phone Number</label>
                        <input class="ds-input" id="phone" type="tel" placeholder="+47 000 00 000" />
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
