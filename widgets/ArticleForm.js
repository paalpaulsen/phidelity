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
            let topicArea = '1 / -1';
            let contactArea = '1 / -1';
            let newsletterArea = '1 / -1';
            let messageArea = '1 / -1';
            let buttonArea = '1 / -1';

            // TABLET (50 Cols)
            // Standard Text Indent is typically 3/-3 or similar.
            // Here we want a 2-column form layout.
            if (cols >= 50 && cols < 74) {
                // Left col: 3 to 26 (24 cols)
                // Right col: 27 to 50 (24 cols) -> actually 27 / 51 in grid lines?
                // Grid lines are 1-based. 50 cols + 1 gap? No, gaps are 0.
                // Col 50 ends at line 51.

                nameArea = '3 / 27';
                emailArea = '27 / 51';
                topicArea = '3 / 27';
                contactArea = '27 / 51';
                newsletterArea = '3 / 51';
                messageArea = '3 / 51';
                buttonArea = '3 / 15'; // Smaller button
            }

            // DESKTOP (74 Cols)
            // Standard Text Indent: 3 / -3 (approx)
            if (cols >= 74 && cols < 122) {
                // Total width 74.
                // Half is 37.
                // Left: 3 to 39 (36 cols)
                // Right: 39 to 75? (36 cols) -> 39 + 36 = 75. 74 cols ends at 75.
                nameArea = '3 / 39';
                emailArea = '39 / 75';
                topicArea = '3 / 39';
                contactArea = '39 / 75';
                newsletterArea = '3 / 75';
                messageArea = '3 / 75';
                buttonArea = '3 / 21';
            }

            // LARGE SCREENS (122+ Cols) 
            // Standard Text Indent: 5 / -5 (Cols 5 to 118) -> Line 5 to 119?
            // 122 cols.
            // Start line 5. End line 122-4 = 118? No.
            // 122 cols. -5 means 5th from end.
            if (cols >= 122) {
                // We want to center the form or restrict it to the "Content Area"
                // Let's use 5 / -5 as the bounds.
                // However, grid-column on children needs specific line numbers if we don't have a wrapper.
                // Phidelity widgets usually don't have an inner wrapper for "content area", they use grid columns directly.

                // Left half of "5 to -5":
                // 5 is start. Total width is huge.
                // Let's just use specific spans for a balanced look (approx 50/50 split of the center area).

                // Center line of 122 is 62.
                // Left: 25 to 62.
                // Right: 62 to 99. (Leaving 24 cols on each side? 25 is 5+20?)

                // Let's try to match the ArticleTextOnly feel (which uses 5 / -5).
                // Left Field: 5 / 62
                // Right Field: 62 / 119 (122 cols + 1 = 123. 123 - 4 = 119).

                nameArea = '5 / 62';
                emailArea = '62 / 119';
                topicArea = '5 / 62';
                contactArea = '62 / 119';
                newsletterArea = '5 / 119';
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
                .field-topic { grid-column: ${topicArea}; }
                .field-contact { grid-column: ${contactArea}; }
                .field-newsletter { grid-column: ${newsletterArea}; }
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

                <!-- TOPIC (Select) -->
                <div class="field-wrapper field-topic">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="topic">Topic</label>
                        <select class="ds-select" id="topic">
                            <option value="" disabled selected>Select a topic...</option>
                            <option value="support">Customer Support</option>
                            <option value="sales">Sales Inquiry</option>
                            <option value="press">Press & Media</option>
                        </select>
                    </div>
                </div>

                <!-- CONTACT PREFERENCE (Radio) -->
                <div class="field-wrapper field-contact">
                    <fieldset class="ds-fieldset">
                        <legend class="ds-label" data-weight="medium">Preferred Contact</legend>
                        <div class="ds-field">
                            <input class="ds-input" type="radio" value="email" id="contact-email" name="contact" checked />
                            <label class="ds-label" data-weight="regular" for="contact-email">Email</label>
                        </div>
                        <div class="ds-field">
                            <input class="ds-input" type="radio" value="phone" id="contact-phone" name="contact" />
                            <label class="ds-label" data-weight="regular" for="contact-phone">Phone</label>
                        </div>
                    </fieldset>
                </div>

                <!-- NEWSLETTER (Checkbox) -->
                <div class="field-wrapper field-newsletter">
                    <fieldset class="ds-fieldset">
                        <legend class="ds-label" data-weight="medium">Notifications</legend>
                        <div class="ds-field">
                            <input class="ds-input" type="checkbox" value="weekly" id="notify-weekly" />
                            <label class="ds-label" data-weight="regular" for="notify-weekly">Weekly Digest</label>
                        </div>
                        <div class="ds-field">
                            <input class="ds-input" type="checkbox" value="offers" id="notify-offers" />
                            <label class="ds-label" data-weight="regular" for="notify-offers">Special Offers</label>
                        </div>
                    </fieldset>
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
