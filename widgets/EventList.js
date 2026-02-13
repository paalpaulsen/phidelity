class EventList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            items: [] // Array of event objects
        };
    }

    static get observedAttributes() {
        return ['items'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'items' && oldValue !== newValue) {
            try {
                this.state.items = JSON.parse(newValue);
                this.render();
            } catch (e) {
                console.error('Invalid JSON for items attribute', e);
            }
        }
    }

    connectedCallback() {
        this.render();
    }

    // Helper to format Business Unit styles (Deprecated: All use uniform grey now)
    getBuColor(bu) {
        return 'var(--mono-06)';
    }

    // Helper: Get Color by Event Size (Sopra Steria Palette)
    getSizeColor(size) {
        const map = {
            'XL': '#D9202C', // Sopra Steria Red
            'L': '#F4811F', // Sopra Steria Orange
            'M': '#9E9E9E', // Sopra Steria Grey
            'S': '#0e0e0e'  // Sopra Steria Black
        };
        return map[size] || '#9E9E9E'; // Default to Grey
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                font-family: 'Inter', sans-serif;
                color: var(--mono-02);
            }

            /* CONTAINER QUERY */
            .event-list-wrapper {
                container-type: inline-size;
                container-name: event-list;
                width: 100%;
            }

            .event-grid {
                display: grid;
                gap: 2rem;
                width: 100%;
                /* Default Mobile: 1 Col */
                grid-template-columns: 1fr; 
            }

            /* EVENT CARD */
            .event-card {
                background: #FFFFFF;
                border: 1px solid var(--mono-08);
                padding: 1rem 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                transition: all 0.2s ease-in-out;
                border-left: 4px solid var(--mono-08);
                cursor: pointer;
                position: relative;
            }

            .event-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }

            /* COLLAPSED STATE */
            .event-card.collapsed {
                gap: 0;
            }

            .event-card.collapsed .card-body {
                display: none;
            }
            
            .event-card.collapsed .chevron {
                transform: rotate(0deg);
            }

            /* HEADER: Always Visible */
            .card-header {
                display: flex;
                flex-direction: column; /* Stack Date above Title */
                gap: 0.25rem; /* Reduced space between Date and Title Row */
                width: 100%;
            }

            .header-top-row {
                width: 100%;
            }

            .header-main-row {
                display: flex;
                justify-content: space-between;
                align-items: center; /* Align Title with Icons */
                gap: 1rem;
                width: 100%;
            }

            .event-size {
                display: inline-block;
                width: 16px; 
                height: 16px;
                border-radius: 50%;
                /* background set inline */
                flex-shrink: 0;
            }

            .chevron {
                color: var(--mono-06);
                transition: transform 0.3s ease;
                transform: rotate(180deg); /* Point up when expanded */
            }

            .eyebrow {
                font-family: var(--font-sans);
                font-size: var(--type-micro);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
                line-height: 1.2;
                color: var(--mono-05);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .event-title {
                margin: 0;
                font-family: var(--font-sans);
                font-size: var(--type-base);
                font-weight: 700;
                line-height: 1.3;
                letter-spacing: var(--tracking-heading);
                color: var(--mono-02);
            }

            /* BODY: Hidden when Collapsed */
            .card-body {
                padding-top: 0.5rem;
                margin-top: 0.5rem;
                border-top: 1px solid var(--mono-09);
                display: flex;
                flex-direction: column;
                gap: 1rem;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .meta-row {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                font-size: var(--type-caption);
                color: var(--mono-05);
                align-items: center;
                justify-content: flex-end; /* Right align content */
            }

            .bu-tag {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                background: var(--mono-09); /* Grey background */
                color: var(--mono-05);      /* Grey text */
                font-family: var(--font-sans);
                font-weight: 600;
                font-size: var(--type-micro);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .event-summary {
                margin: 0;
                font-family: var(--font-sans);
                font-size: var(--type-base);
                line-height: 1.5;
                font-weight: 300;
                color: var(--mono-04);
            }

            /* LINK BUTTON */
            .event-link-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem; /* Space between text and icon */
                background-color: var(--mono-02);
                color: var(--mono-10);
                padding: 0.75rem 1.5rem;
                border-radius: 4px; /* Standard button radius */
                text-decoration: none;
                font-family: var(--font-sans);
                font-size: var(--type-base);
                font-weight: 600;
                margin-top: 0.5rem; /* Space below summary */
                align-self: flex-start; /* Left align */
                transition: all 0.2s ease;
                border: 1px solid var(--mono-02);
            }

            .event-link-btn:hover {
                background-color: var(--mono-10);
                color: var(--mono-02);
                border-color: var(--mono-02);
            }
            
            /* RESPONSIVE LAYOUTS */
            /* Force Single Column Stack to fill width */
            .event-grid { grid-template-columns: 1fr; }

        </style>

        <div class="event-list-wrapper">
            <div class="event-grid">
                ${this.state.items.map((item, idx) => {
            const buColor = this.getBuColor(item.businessUnit);
            const sizeColor = this.getSizeColor(item.size); // New color based on size
            // Expand first item (Active), collapse others
            const isExpanded = idx === 0;
            const collapsedClass = isExpanded ? '' : 'collapsed';

            // Time Formatting
            const startTime = item.startDate.split(' ')[1] || '';
            const endTime = item.endDate.split(' ')[1] || '';
            const timeDisplay = startTime && endTime ? `${startTime}&nbsp;-&nbsp;${endTime}` : startTime;

            return `
                    <div class="event-card ${collapsedClass}" 
                         style="border-left-color: ${sizeColor}"
                         onclick="this.classList.toggle('collapsed')">
                        
                        <!-- HEADER: Stacked Date and Title/Icons -->
                        <div class="card-header">
                            
                            <!-- Row 1: Date (Full Width) -->
                            <div class="header-top-row">
                                <div class="event-date eyebrow">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    ${item.startDate.split(' ')[0]}
                                    <span style="margin: 0 0.5rem; opacity: 0.3;">|</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    ${timeDisplay}
                                </div>
                            </div>

                            <!-- Row 2: Title and Icons (Flex) -->
                            <div class="header-main-row">
                                <h3 class="event-title">${item.title}</h3>
                                
                                <div class="header-right">
                                    <div class="event-size" 
                                         title="Size: ${item.size}" 
                                         style="background-color: ${sizeColor};">
                                    </div>
                                    <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </div>
                            </div>

                        </div>

                        <!-- BODY: Summary, End Date, BU (Hidden in Collapsed) -->
                        <div class="card-body" onclick="event.stopPropagation();">
                            
                            <p class="event-summary">${item.summary}</p>
                            
                            <!-- LINK BUTTON (If exists) -->
                            ${item.link ? `
                                <a href="${item.link}" target="_blank" class="event-link-btn">
                                    ${item.linkText || 'Read More'}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                            ` : ''}
                            
                            <div class="meta-row">
                                <span class="bu-tag">
                                    ${item.businessUnit}
                                </span>
                                <!-- End Date Removed per request -->
                            </div>

                        </div>

                    </div>
                    `;
        }).join('')}
            </div>
        </div>
        `;
    }

    // Helper for Size Icons (User requested 'size icon', using text for now but could be shapes)
    getSizeIcon(size) {
        // Could return specific SVGs for S/M/L/XL if desired, 
        // but text inside circle is a common "Size Icon" pattern.
        return size;
    }
}

customElements.define('phi-event-list', EventList);
