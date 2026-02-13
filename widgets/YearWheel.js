// EVENTS_DATA is loaded from data/event_data.js

class PhiYearWheel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedFilters = new Set(); // Stores active BU filters
    }

    async connectedCallback() { // Made async just in case
        this.render();

        // Render Month Slices (Dynamic)
        this.renderMonthSlices();

        // Initialize Grid CSS
        this.generateGridCSS();

        // Populate Event List and Render Dots if data exists
        requestAnimationFrame(() => {
            const eventList = this.shadowRoot.getElementById('wheel-events');

            if (window.EVENTS_DATA) {
                // Pass data to list widget
                if (eventList) {
                    eventList.setAttribute('items', JSON.stringify(window.EVENTS_DATA));
                }

                // Render dots on the wheel
                this.allEvents = window.EVENTS_DATA; // Source of truth
                this.events = [...this.allEvents]; // Active filtered set
                // Sort events chronologically (Source)
                this.allEvents.sort((a, b) => {
                    const dateA = this.parseDate(a.startDate);
                    const dateB = this.parseDate(b.startDate);
                    return dateA - dateB;
                });
                // Sync active events
                this.events = [...this.allEvents];

                this.activeIndex = 0;
                this.renderEventDots();
                this.updateEventList();
            }
        });

        this.highlightEvents();
    }

    // Helper: Parse Date (DD/MM/YYYY) to Week Index (0-51)
    getWeekFromDate(dateStr) {
        // format: "15/03/2026 09:00"
        const [day, month, year] = dateStr.split(' ')[0].split('/');
        const date = new Date(`${year}-${month}-${day}`);
        const start = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
        return Math.floor(days / 7);
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

    // Helper: Get Radius and Dot Size by Event Size
    getSizeConfig(size) {
        // Inner radius ~40 (Hub), Outer ~100.
        // S (Inner) -> XL (Outer)
        const map = {
            'S': { r: 50, dot: 2 },
            'M': { r: 65, dot: 3 },
            'L': { r: 80, dot: 4 },
            'XL': { r: 92, dot: 5 }
        };
        return map[size] || map['M'];
    }

    renderEventDots(events) {
        events = events || this.events;
        if (!events) return;

        const svg = this.shadowRoot.querySelector('.wheel-wrapper svg');
        events.sort((a, b) => {
            const dateA = this.parseDate(a.startDate);
            const dateB = this.parseDate(b.startDate);
            return dateA - dateB;
        });

        // Group for dots
        let dotsGroup = this.shadowRoot.getElementById('event-dots');
        if (!dotsGroup) {
            dotsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            dotsGroup.id = "event-dots";
            svg.appendChild(dotsGroup);
        } else {
            dotsGroup.innerHTML = ''; // Clear existing
        }

        const center = { x: 100, y: 100 };
        const anglePerWeek = 360 / 52;

        // Group for needle (Append LAST so it's ON TOP)
        let needleGroup = this.shadowRoot.getElementById('needle-group');
        if (!needleGroup) {
            needleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            needleGroup.id = "needle-group";
            svg.appendChild(needleGroup); // Always on top
        } else {
            // Move to end to ensure z-index
            svg.appendChild(needleGroup);
            needleGroup.innerHTML = '';
        }

        const activeEvent = events[this.activeIndex];

        // Render NEEDLE for active event (Week Slice)
        if (activeEvent) {
            const activeWeek = this.getWeekFromDate(activeEvent.startDate);
            // Slice 0 is Top. Angle is clockwise.
            const needleAngleDeg = (activeWeek * anglePerWeek) + (anglePerWeek / 2);

            // Needle: Tapered "Cone" Shape
            // Tip at 40 (Radius 60). Base at 100 (Center).
            // Width at base: +/- 6px (12px total).
            // Path: Tip -> Right Base -> Rounded Cap -> Left Base -> Tip

            const needle = document.createElementNS("http://www.w3.org/2000/svg", "path");
            needle.setAttribute("d", "M 100 40 L 106 100 Q 100 102 94 100 Z");
            needle.setAttribute("fill", "var(--mono-02)"); // Dark Grey

            // Rotate around center (100, 100)
            needle.setAttribute("transform", `rotate(${needleAngleDeg}, 100, 100)`);
            needle.style.transition = "transform 0.5s ease-out";

            needleGroup.appendChild(needle);
        }

        events.forEach((event, index) => {
            const weekIndex = this.getWeekFromDate(event.startDate);
            const { r, dot } = this.getSizeConfig(event.size);
            const color = this.getSizeColor(event.size);

            const angleDeg = (weekIndex * anglePerWeek) + (anglePerWeek / 2);
            const angleRad = (angleDeg - 90) * (Math.PI / 180);

            const cx = center.x + r * Math.cos(angleRad);
            const cy = center.y + r * Math.sin(angleRad);

            // ACTIVE EVENT HIGHLIGHT (Red Circle)
            if (index === this.activeIndex) {
                const highlight = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                highlight.setAttribute("cx", cx);
                highlight.setAttribute("cy", cy);
                highlight.setAttribute("r", dot + 4); // Ring around dot
                highlight.setAttribute("fill", "none");
                highlight.setAttribute("stroke", "var(--red-06, #FF0000)");
                highlight.setAttribute("stroke-width", "1.5");
                dotsGroup.appendChild(highlight);
            }

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", dot);
            circle.setAttribute("fill", color);
            circle.setAttribute("stroke", "white");
            circle.setAttribute("stroke-width", "0.5");
            index === this.activeIndex ? circle.setAttribute("stroke-width", "1") : null;
            circle.style.cursor = "pointer";

            // Interaction
            circle.onclick = () => this.setActiveEvent(index);

            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = `${event.title} (${event.size})`;
            circle.appendChild(title);

            dotsGroup.appendChild(circle);
        });
    }

    renderMonthSlices() {
        const slicesGroup = this.shadowRoot.getElementById('slices');
        const labelsGroup = this.shadowRoot.getElementById('month-labels');
        if (!slicesGroup || !labelsGroup) return;

        slicesGroup.innerHTML = '';
        labelsGroup.innerHTML = '';

        const center = { x: 100, y: 100 };
        const radius = 100;
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const anglePerMonth = 360 / 12;

        months.forEach((month, index) => {
            // Calculate start and end angles (clockwise, starting from top 0)
            const startAngle = index * anglePerMonth;
            const endAngle = (index + 1) * anglePerMonth;

            // Convert to radians (subtract 90 to align with top)
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = center.x + radius * Math.cos(startRad);
            const y1 = center.y + radius * Math.sin(startRad);
            const x2 = center.x + radius * Math.cos(endRad);
            const y2 = center.y + radius * Math.sin(endRad);

            // Path definition
            const d = `
                M ${center.x} ${center.y}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 0 1 ${x2} ${y2}
                Z
            `;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.classList.add("slice");
            path.setAttribute("fill", "var(--mono-10)");
            path.setAttribute("stroke", "var(--mono-05)");
            path.setAttribute("stroke-width", "1");
            slicesGroup.appendChild(path);

            // Label Position (Center of Slice, slightly inwards)
            const labelAngle = startAngle + (anglePerMonth / 2);
            const labelRad = (labelAngle - 90) * (Math.PI / 180);
            let labelR = 110; // Outside radius
            if (month === 'MAR') labelR = 114; // Adjust MAR separation per user request

            const lx = center.x + labelR * Math.cos(labelRad);
            const ly = center.y + labelR * Math.sin(labelRad);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", lx);
            text.setAttribute("y", ly);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.style.fontFamily = "var(--font-sans)";
            text.style.fontSize = "8px";
            text.style.fontWeight = "600";
            text.style.fill = "var(--mono-04)";
            text.textContent = month;

            labelsGroup.appendChild(text);
        });
    }

    // Helper: Parse Date String to Date Object
    parseDate(dateStr) {
        const [day, month, year] = dateStr.split(' ')[0].split('/');
        return new Date(`${year}-${month}-${day}`);
    }

    highlightEvents() {
        // Reset to white/default
        const slices = this.shadowRoot.querySelectorAll('.slice');
        slices.forEach(slice => slice.style.fill = 'var(--mono-10)');
    }

    // New: Handle Dot Click
    setActiveEvent(index) {
        this.activeIndex = index;
        this.renderEventDots(); // Re-render needle/highlight
        this.updateEventList(); // Rotate list
    }

    // Filter Logic
    toggleFilter(bu) {
        // Toggle selection
        if (this.selectedFilters.has(bu)) {
            this.selectedFilters.delete(bu);
        } else {
            this.selectedFilters.add(bu);
        }

        // Update UI State
        const btnIdMap = {
            'X-BU': 'filter-xbu',
            'APPS': 'filter-apps',
            'DPS': 'filter-dps',
            'Advisory': 'filter-advisory'
        };
        const btnId = btnIdMap[bu];
        const btn = this.shadowRoot.getElementById(btnId);
        if (btn) {
            btn.classList.toggle('active', this.selectedFilters.has(bu));
        }

        this.applyFilters();
    }

    applyFilters() {
        if (!this.allEvents) return;

        // Reset to full list or filter
        let filteredEvents = this.allEvents;
        if (this.selectedFilters.size > 0) {
            filteredEvents = this.allEvents.filter(e => this.selectedFilters.has(e.businessUnit));
        }

        this.events = filteredEvents;
        this.activeIndex = 0; // Reset pagination when filter changes

        // 1. Update List (This handles pagination slicing)
        this.updateEventList();

        // 2. Update Dots on Wheel (Uses this.events)
        this.renderEventDots();
    }

    updateEventList() {
        const listWidget = this.shadowRoot.querySelector('phi-event-list');
        if (listWidget && this.events) {
            // Show Active Event + Next 4 events (Max 5 total)
            const visibleEvents = this.events.slice(this.activeIndex, this.activeIndex + 5);
            listWidget.setAttribute('items', JSON.stringify(visibleEvents));
            this.updateNavState();
        }
    }

    updateNavState() {
        const prevBtn = this.shadowRoot.getElementById('btn-prev');
        const nextBtn = this.shadowRoot.getElementById('btn-next');
        if (prevBtn && nextBtn) {
            prevBtn.disabled = this.activeIndex === 0;
            const maxIndex = this.events.length - 1;
            // Next is disabled if we are at the last event
            nextBtn.disabled = this.activeIndex >= maxIndex;

            prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
            prevBtn.style.cursor = prevBtn.disabled ? 'default' : 'pointer';
            nextBtn.style.cursor = nextBtn.disabled ? 'default' : 'pointer';
        }
    }

    prevEvent() {
        const pageSize = 5;
        if (this.activeIndex > 0) {
            this.setActiveEvent(Math.max(0, this.activeIndex - pageSize));
        }
    }

    nextEvent() {
        const pageSize = 5;
        if (this.activeIndex < this.events.length - 1) {
            // Jump forward by page size, but clamp to the start of the last "page" or the last item?
            // User said "Page through". If we are at 0, next should be 5. 
            // If we are at 10, and length is 12, next should probably stay at 10 or go to 11 (last item)?
            // Let's jump by 5, clamping to length-1.
            this.setActiveEvent(Math.min(this.events.length - 1, this.activeIndex + pageSize));
        }
    }

    generateGridCSS() {
        const breakpoints = [
            { id: '194', query: '(min-width: 2522px)', cols: 194 },
            { id: '170', query: '(min-width: 2210px) and (max-width: 2521px)', cols: 170 },
            { id: '146', query: '(min-width: 1898px) and (max-width: 2209px)', cols: 146 },
            { id: '122', query: '(min-width: 1586px) and (max-width: 1897px)', cols: 122 },
            { id: '98', query: '(min-width: 1274px) and (max-width: 1585px)', cols: 98 },
            { id: '74', query: '(min-width: 962px) and (max-width: 1273px)', cols: 74 },
            { id: '50', query: '(min-width: 650px) and (max-width: 961px)', cols: 50 },
            { id: '26', query: '(min-width: 338px) and (max-width: 649px)', cols: 26 },
            { id: '13', query: '(max-width: 337px)', cols: 13 }
        ];

        return breakpoints.map(bp => {
            // GENERIC CONTAINER QUERY (No name) so it applies to ANY immediate parent container
            let css = `
                @container ${bp.query} {
            `;

            if (bp.cols >= 26) {
                // Phidelity Grid Logic
                css += `
                    .phi-container {
                        display: grid;
                        grid-template-columns: repeat(${bp.cols}, 1fr);
                        --col-count: ${bp.cols};
                        --col-w: calc(100cqw / var(--col-count));
                        --row-h: calc(var(--col-w) / 1.618);
                        grid-auto-rows: minmax(var(--row-h), auto);
                        gap: 0;
                    }
                    
                    /* Align children to the grid */
                    .header-content, .filter-content {
                        grid-column: 4 / -4;
                    }
                    
                    /* SVG Wheel Alignment */
                    .wheel-wrapper svg {
                        /* 1 / -1 for full width per user request (reduced padding) */
                        grid-column: 1 / -1;
                    }
                `;

                // Split Wrapper Logic matches >= 50 cols of PARENT
                if (bp.cols >= 50) {
                    css += `
                        .split-wrapper {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 0;
                            align-items: start;
                            padding-left: 2rem;
                            padding-right: 2rem;
                        }
                     `;
                } else {
                    css += `
                        .split-wrapper {
                            display: block;
                            padding-left: 2rem;
                            padding-right: 2rem;
                        }
                        .wheel-wrapper, .event-list {
                            margin-bottom: 2rem;
                        }
                     `;
                }

            } else {
                // Micro (13 cols)
                css += `
                    .phi-container {
                        display: block;
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                    .split-wrapper {
                        display: block;
                    }
                    .header-content, .filter-content, .wheel-wrapper, .event-list {
                        width: 100%;
                        margin-bottom: 1rem;
                    }
                `;
            }

            css += `}`;
            return css;
        }).join('\n');
    }

    render() {
        const gridCSS = this.generateGridCSS();

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/macro.css">
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: auto; /* explicit auto */
                    min-height: 0;
                    /* Main outer container */
                    container-type: inline-size; 
                }

                /* Common Container Styling */
                .phi-container {
                    width: 100%;
                    background: transparent; /* Was var(--mono-10) White */
                    box-sizing: border-box;
                    justify-items: start;
                    
                    /* Make me a container too! */
                    container-type: inline-size;
                }

                /* Split Wrapper */
                .split-wrapper {
                    width: 100%;
                    /* Not a container itself, just a layout grid */
                }

                /* Wrapper Col for nested containment */
                .wrapper-col {
                    width: 100%;
                    min-width: 0; /* Important for grid items */
                    overflow: hidden; /* Helps containment */
                    container-type: inline-size;
                }

                /* Margins between the main sections */
                .title-container { margin-bottom: 0; }
                .filter-container { margin-bottom: 2rem; }
                .content-container { margin-bottom: 4rem; }

                /* Element Styling */
                .header-content h1 {
                    font-family: var(--font-serif, 'DM Serif Display', serif);
                    font-size: 3rem;
                    margin: 2rem 0 1rem 0;
                    color: var(--mono-01);
                }

                .filter-content {
                    background: transparent;
                    border: none;
                    border-top: 1px solid var(--mono-06);
                    padding: 1rem 1rem 1rem 0; /* Left padding 0 to align with H1 */
                    display: flex;
                    gap: 0.5rem; /* Reduced gap given more items */
                    align-items: center;
                    justify-content: flex-start; /* Explicit left alignment */
                    width: 100%;
                    box-sizing: border-box;
                }

                .filter-btn {
                    background: transparent;
                    border: 1px solid var(--mono-06);
                    border-radius: 4px;
                    padding: 0.25rem 0.5rem;
                    cursor: pointer;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    color: var(--mono-04);
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    white-space: nowrap; /* Prevent breaking */
                }
                
                .filter-btn:hover {
                    background: var(--mono-09);
                    border-color: var(--mono-04);
                    color: var(--mono-02);
                }

                .filter-btn.active {
                    background: var(--mono-02);
                    color: var(--mono-10);
                    border-color: var(--mono-02);
                }

                .filter-checkbox {
                    width: 12px;
                    height: 12px;
                    border: 1px solid currentColor;
                    border-radius: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none; /* Let button handle click */
                }

                .filter-btn.active .filter-checkbox {
                    background: currentColor;
                }

                .filter-btn.active .filter-checkbox::after {
                    content: '';
                    display: block;
                    width: 3px;
                    height: 6px;
                    border: solid var(--mono-02);
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                    margin-bottom: 2px;
                }

                .wheel-wrapper {
                    position: relative;
                    display: flex;
                    align-items: start;
                    justify-content: center;
                    min-height: 200px;
                    /* Padding removed per user request, handled by viewBox */
                    
                    /* NESTED CONTAINER: I am a child of split-wrapper, but I am also a Grid Container */
                    /* So I use .phi-container class */
                }

                .event-list {
                    background: transparent;
                    border: none;
                    padding: 1rem;
                    box-sizing: border-box;
                    
                     /* NESTED CONTAINER: Same here */
                }

                .nav-container {
                    position: sticky;
                    bottom: 0;
                    z-index: 100;
                    background: var(--mono-10); /* ensuring background covers content */
                    border-top: 1px solid var(--mono-08);
                    padding: 1rem;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 2rem;
                }
                
                .nav-controls {
                    display: flex;
                    gap: 1rem;
                }
                
                .nav-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease;
                }
                .nav-btn:hover:not(:disabled) {
                    transform: scale(1.1);
                }
                .nav-icon {
                    width: 24px;
                    height: 24px;
                    fill: var(--mono-02);
                }
                
                }

                svg {
                    width: 100%;
                    height: auto;
                    display: block;
                    overflow: visible;
                }
                
                /* SVG Styles */
                .slice { fill: var(--mono-10); stroke: var(--mono-05); stroke-width: 1px; vector-effect: non-scaling-stroke; transition: fill 0.3s ease, transform 0.2s ease; cursor: default; transform-origin: 100px 100px; }
                /* .slice:hover removed per user request */
                .quarter { fill: var(--mono-10); stroke: var(--mono-05); stroke-width: 1px; vector-effect: non-scaling-stroke; pointer-events: none; }
                .quarter-label { font-family: var(--font-sans, 'Inter', sans-serif); font-size: 8px; font-weight: 700; fill: var(--mono-01); text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
                
                ${gridCSS}
            </style>

            <div class="main-wrapper">
                
                <!-- 1. Title Container -->
                <div class="phi-container title-container">
                    <div class="header-content">
                        <h1>Årshjulet</h1>
                    </div>
                </div>

                <!-- 2. Filter Container -->
                <div class="phi-container filter-container">
                    <div class="filter-content">
                        <!-- Filter Icon removed per user request -->
                        <button class="filter-btn" id="filter-xbu" onclick="this.getRootNode().host.toggleFilter('X-BU')">
                            <div class="filter-checkbox"></div>
                            X&nbsp;-BU
                        </button>
                        <button class="filter-btn" id="filter-apps" onclick="this.getRootNode().host.toggleFilter('APPS')">
                            <div class="filter-checkbox"></div>
                            APPS
                        </button>
                        <button class="filter-btn" id="filter-dps" onclick="this.getRootNode().host.toggleFilter('DPS')">
                            <div class="filter-checkbox"></div>
                            DPS
                        </button>
                        <button class="filter-btn" id="filter-advisory" onclick="this.getRootNode().host.toggleFilter('Advisory')">
                            <div class="filter-checkbox"></div>
                            Advisory
                        </button>
                    </div>
                </div>

                <div class="split-wrapper">
                    
                    <!-- Wrapper Col 1: Acts as Container Context for Wheel -->
                    <div class="wrapper-col">
                        <div class="phi-container wheel-wrapper">
                             <!-- Content inside aligns to THIS container's grid -->
                            <svg viewBox="-20 -20 240 240" xmlns="http://www.w3.org/2000/svg">
                                <g id="slices">
                                    <!-- Slices will be generated by JS -->
                                </g>
                                <g id="month-labels">
                                    <!-- Labels will be generated by JS -->
                                </g>
                                <g id="quarters">
                                    <path d="M 100 100 L 100 60 A 40 40 0 0 1 140 100 Z" class="quarter" id="q1" />
                                    <text x="115" y="85" class="quarter-label">Q1</text>
                                    <path d="M 100 100 L 140 100 A 40 40 0 0 1 100 140 Z" class="quarter" id="q2" />
                                    <text x="115" y="115" class="quarter-label">Q2</text>
                                    <path d="M 100 100 L 100 140 A 40 40 0 0 1 60 100 Z" class="quarter" id="q3" />
                                    <text x="85" y="115" class="quarter-label">Q3</text>
                                    <path d="M 100 100 L 60 100 A 40 40 0 0 1 100 60 Z" class="quarter" id="q4" />
                                    <text x="85" y="85" class="quarter-label">Q4</text>
                                </g>
                                <!-- Restoring missing layers -->
                                <g id="events-layer"></g>
                                <g id="needle-layer"></g>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Wrapper Col 2: Acts as Container Context for Event List -->
                    <div class="wrapper-col">
                        <div class="phi-container event-list">
                             <!-- Content inside aligns to THIS container's grid -->
                            <div style="grid-column: 2 / -2; width: 100%;">
                                <!-- Event List Widget -->
                                <phi-event-list id="wheel-events"></phi-event-list>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Sticky Nav Controls -->
                <div class="nav-container">
                    <div class="nav-controls">
                        <button id="btn-prev" class="nav-btn" aria-label="Previous Event">
                            <svg class="nav-icon" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                        </button>
                        <button id="btn-next" class="nav-btn" aria-label="Next Event">
                            <svg class="nav-icon" viewBox="0 0 24 24">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
            </div>
        `;

        this.shadowRoot.getElementById('btn-prev').onclick = () => this.prevEvent();
        this.shadowRoot.getElementById('btn-next').onclick = () => this.nextEvent();
    }
}

customElements.define('phi-year-wheel', PhiYearWheel);
