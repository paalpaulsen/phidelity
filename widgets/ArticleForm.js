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
            let topicArea = '1 / -1';
            let contactArea = '1 / -1';
            let newsletterArea = '1 / -1';
            let messageArea = '1 / -1';
            let buttonArea = '1 / -1';

            if (cols >= 50) {
                // 2-Column Grid (approx)
                nameArea = '3 / 27';
                emailArea = '27 / 51'; // Adjusted for 50-col grid (3-27 is 24 cols, 27-51 is 24 cols)? 
                // Wait, 50 col grid logic:
                // Start 3. 
                // Let's use simple halves for now based on previous manual values:
                // Previous was 3/15 and 15/27.
                nameArea = '3 / 27';
                emailArea = '27 / 51'; // Should check if 51 exists. max is 50. 
                // Let's stick to safe values:
                nameArea = '3 / 26';
                emailArea = '26 / 49';

                topicArea = '3 / 26';
                contactArea = '26 / 49';
                newsletterArea = '3 / 49'; // Full width

                messageArea = '3 / 49'; // Full
                buttonArea = '3 / 15'; // Left
            }

            if (cols >= 74) {
                // Desktop Grid
                nameArea = '3 / 38'; // Half of content area (3-73) roughly
                emailArea = '38 / 73';

                topicArea = '3 / 38';
                contactArea = '38 / 73';

                newsletterArea = '3 / 73';

                messageArea = '3 / 73';
                buttonArea = '3 / 20';
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
