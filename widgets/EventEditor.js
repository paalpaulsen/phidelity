class PhiEventEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // State
        this.state = {
            items: [], // Will load from window.EVENTS_DATA
            isAuthenticated: false,
            view: 'list', // 'list' or 'edit'
            editingItemIndex: null, // Index in items array, null for new
            tempItem: {}, // Holds form data during edit
            confirmDeleteIndex: null, // Index of item to delete, null if none
            showPastEvents: false,
            searchQuery: '',
            serverStatus: 'unknown' // 'unknown', 'online', 'offline'
        };

        // Password for "Simple protection"
        this.PASSWORD = "phidelity";
    }

    connectedCallback() {
        // Load data safely
        if (window.EVENTS_DATA) {
            // Clone to avoid direct ref issues until save
            this.state.items = JSON.parse(JSON.stringify(window.EVENTS_DATA));
            this.sortItems();
        }
        this.checkServerStatus();
        this.render();
    }

    checkServerStatus() {
        if (window.location.protocol === 'file:') {
            this.state.serverStatus = 'file-protocol';
            return;
        }

        // Assume unknown until first save attempt or active check
        this.state.serverStatus = 'unknown';
    }

    // --- ACTIONS ---

    login(password) {
        if (password === this.PASSWORD) {
            this.state.isAuthenticated = true;
            this.render();
        } else {
            alert('Incorrect Password');
        }
    }

    editItem(index) {
        this.state.editingItemIndex = index;
        this.state.tempItem = { ...this.state.items[index] };
        this.state.view = 'edit';
        this.render();
    }

    addNew() {
        const now = new Date();
        const defaultDate = this.formatDate(now).split(' ')[0]; // DD/MM/YYYY

        // Default end date same day
        const defaultEnd = defaultDate;

        this.state.editingItemIndex = null;
        this.state.tempItem = {
            title: '',
            startDate: defaultDate + ' 09:00', // Default start time
            endDate: defaultEnd + ' 17:00',   // Default end time
            size: 'M',
            businessUnit: 'APPS',
            summary: '',
            link: '',
            linkText: '',
            hidden: false
        };
        this.state.view = 'edit';
        this.render();
    }

    saveItem() {
        // Basic Validation
        if (!this.state.tempItem.title || !this.state.tempItem.startDate) {
            alert('Title and Start Date are required.');
            return;
        }

        if (this.state.editingItemIndex !== null) {
            // Update
            this.state.items[this.state.editingItemIndex] = { ...this.state.tempItem };
        } else {
            // Create
            this.state.items.push({ ...this.state.tempItem });
            // sort by date? keeping it simple for now, append.
        }

        // Update Global Data (In Memory)
        this.sortItems();
        window.EVENTS_DATA = this.state.items;

        // Persist to Server
        this.saveToServer();

        this.state.view = 'list';
        this.render();
    }

    requestDelete(index) {
        this.state.confirmDeleteIndex = index;
        this.render();
    }

    cancelDelete() {
        this.state.confirmDeleteIndex = null;
        this.render();
    }

    confirmDelete() {
        if (this.state.confirmDeleteIndex !== null) {
            this.state.items.splice(this.state.confirmDeleteIndex, 1);
            // Update Global Data
            window.EVENTS_DATA = this.state.items;

            // Persist to Server
            this.saveToServer();

            this.state.confirmDeleteIndex = null;
            this.render();
        }
    }

    deleteItem(index) {
        // Fallback or deprecated
        this.requestDelete(index);
    }

    exportData() {
        const dataStr = "window.EVENTS_DATA = " + JSON.stringify(this.state.items, null, 4) + ";";
        navigator.clipboard.writeText(dataStr).then(() => {
            alert('Data copied to clipboard! Replace content of data/event_data.js');
        });
        console.log(dataStr);
    }

    toggleHidden(index) {
        const item = this.state.items[index];
        item.hidden = !item.hidden;
        window.EVENTS_DATA = this.state.items;
        this.saveToServer();
        this.render();
    }

    saveToServer() {
        this.state.serverStatus = 'connecting';
        this.render();

        // Use .php endpoint for compatibility with standard hosting
        fetch('/api/save_events.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.items)
        })
            .then(response => {
                if (!response.ok) throw new Error('Server returned ' + response.status);
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Data saved to server successfully');
                    this.state.serverStatus = 'online';
                } else {
                    console.warn('Failed to save data to server');
                    this.state.serverStatus = 'offline';
                }
                this.render();
            })
            .catch(error => {
                console.error('Error saving data:', error);
                this.state.serverStatus = 'offline';
                this.render();
                // Do NOT alert. User will see status indicator.
            });
    }



    updateTempItem(field, value) {
        this.state.tempItem[field] = value;
    }

    // --- HELPERS ---

    // Convert DD/MM/YYYY HH:mm to YYYY-MM-DD (for input type="date")
    toDateInputValue(dateStr) {
        if (!dateStr) return '';
        const [date, time] = dateStr.split(' ');
        if (!date) return '';
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    }

    // Convert DD/MM/YYYY HH:mm to HH:mm (for input type="time")
    toTimeInputValue(dateStr) {
        if (!dateStr) return '00:00';
        const [date, time] = dateStr.split(' ');
        return time || '00:00';
    }

    // Convert YYYY-MM-DD to DD/MM/YYYY
    fromDateInputValue(val) {
        if (!val) return '';
        const [year, month, day] = val.split('-');
        return `${day}/${month}/${year}`;
    }

    // Return DD/MM/YYYY HH:mm from Date object
    formatDate(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    getFilteredItems() {
        const now = new Date();
        return this.state.items.map((item, index) => ({ item, index })).filter(({ item }) => {
            // 1. Filter by Past Events
            if (!this.state.showPastEvents) {
                const date = this.parseDate(item.startDate);
                if (date < now) return false;
            }

            // 2. Filter by Search Query
            if (this.state.searchQuery) {
                const query = this.state.searchQuery.toLowerCase();
                const titleMatch = item.title && item.title.toLowerCase().includes(query);
                const summaryMatch = item.summary && item.summary.toLowerCase().includes(query);
                if (!titleMatch && !summaryMatch) return false;
            }

            return true;
        });
    }

    sortItems() {
        this.state.items.sort((a, b) => {
            const dateA = this.parseDate(a.startDate);
            const dateB = this.parseDate(b.startDate);
            return dateA - dateB;
        });
    }

    parseDate(dateStr) {
        if (!dateStr) return new Date(8640000000000000); // Push to end
        // Expects DD/MM/YYYY HH:mm
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart ? timePart.split(':') : ['00', '00'];
        return new Date(year, month - 1, day, hours, minutes);
    }

    getSizeColor(size) {
        const map = {
            'XL': '#D9202C', // Sopra Steria Red
            'L': '#F4811F', // Sopra Steria Orange
            'M': '#9E9E9E', // Sopra Steria Grey
            'S': '#0e0e0e'  // Sopra Steria Black
        };
        return map[size] || '#9E9E9E';
    }

    // --- RENDERERS ---

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                    background: #fff;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    color: var(--mono-02, #333);
                    position: relative; /* For modal positioning */
                }
                
                /* Layout */
                .container {
                    max-width: 100%; 
                }

                .header-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .header-actions h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--mono-02);
                }

                /* Buttons */
                .btn {
                    cursor: pointer;
                    padding: 0.6rem 1.2rem;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    font-family: inherit;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                
                .btn-primary { background: var(--mono-02, #000); color: #fff; }
                .btn-primary:hover { background: #333; }
                
                .btn-secondary { background: #eee; color: #333; }
                .btn-secondary:hover { background: #ddd; }
                
                .btn-danger { background: #fff; color: #D9202C; border-color: #D9202C; }
                .btn-danger:hover { background: #D9202C; color: #fff; }

                .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.8rem; }

                /* Inputs */
                input[type="text"], input[type="date"], input[type="datetime-local"], input[type="time"], textarea, select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    font-family: inherit;
                    box-sizing: border-box;
                }

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    color: #666;
                }

                .radio-group {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .radio-option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }

                /* List View */
                .event-list {
                    display: grid;
                    gap: 1rem;
                }
                
                .event-card {
                    background: #fff;
                    border: 1px solid #eee;
                    border-left: 4px solid #ccc;
                    padding: 1rem;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    position: relative;
                }
                
                .event-card.hidden {
                    opacity: 0.6;
                    background: #fafafa;
                }

                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .card-title {
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .card-meta {
                    font-size: 0.85rem;
                    color: #666;
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .card-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    justify-content: flex-end;
                }

                .tag {
                    padding: 2px 6px;
                    background: #eee;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                /* H1 Styling from YearWheel */
                h1 {
                    font-family: var(--font-serif, 'DM Serif Display', serif);
                    font-size: 3rem;
                    margin: 2rem 0 1rem 0;
                    color: var(--mono-01);
                    font-weight: var(--heading-weight, 400);
                    line-height: 1.1;
                }

                .top-nav {
                    margin-bottom: 2rem;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    color: var(--mono-05);
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: color 0.2s;
                }
                .back-link:hover { color: var(--mono-02); }

                /* Login View */
                .login-view {
                    text-align: center;
                    padding: 4rem 1rem;
                }
                .login-view input {
                    max-width: 300px;
                    margin: 0 auto 1rem auto;
                }

                /* Modal Overlay */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                }

                .modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

            </style>

            <div class="container">
                ${!this.state.isAuthenticated ? this.renderLogin() : this.renderMain()}
            </div>
            
            ${this.state.confirmDeleteIndex !== null ? this.renderModal() : ''}
        `;

        if (!this.state.isAuthenticated) {
            this.bindLoginEvents();
        } else {
            this.bindMainEvents();
            if (this.state.confirmDeleteIndex !== null) {
                this.bindModalEvents();
            }
        }
    }

    renderLogin() {
        return `
            <div class="login-view">
                <h2>Event Editor Access</h2>
                <p>Please enter the password to manage events.</p>
                <input type="password" id="password-input" placeholder="Password" />
                <br>
                <button id="login-btn" class="btn btn-primary">Unlock Editor</button>
            </div>
        `;
    }

    renderModal() {
        return `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>Confirm Deletion</h3>
                    <p>Are you sure you want to delete this event? This cannot be undone.</p>
                    <div class="modal-actions">
                        <button id="modal-cancel" class="btn btn-secondary">Cancel</button>
                        <button id="modal-confirm" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMain() {
        return `
            <div class="main-view">
                ${this.state.view === 'list' ? this.renderList() : this.renderForm()}
            </div>
        `;
    }

    renderList() {
        const filtered = this.getFilteredItems();
        return `
            <div class="top-nav">
                <a href="yearwheel.html" class="back-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Year Wheel
                </a>
                <h1>Event Editor</h1>
            </div>

            <div class="header-actions">
                <div>
                    <h3>Events (${this.state.items.length})</h3>
                    <small>Manage your Year Wheel events</small>
                </div>
                <div style="display:flex; gap:0.5rem; align-items: center;">
                    ${this.state.serverStatus === 'file-protocol' ? `
                        <span style="color: #D9202C; font-size: 0.8rem; font-weight: 600; margin-right: 0.5rem;">Running from file://</span>
                        <a href="http://localhost:3000/event_editor.html" class="btn btn-primary btn-sm" style="text-decoration: none;">Open Localhost</a>
                    ` : ''}
                    ${this.state.serverStatus === 'offline' ? `
                        <span style="color: #D9202C; font-size: 0.8rem; font-weight: 600; margin-right: 0.5rem;">Offline Mode</span>
                        <button id="export-btn" type="button" class="btn btn-secondary btn-sm">Copy JSON</button>
                    ` : ''}
                    ${this.state.serverStatus === 'connecting' ? `
                        <span style="font-size: 0.8rem; color: #666; margin-right: 0.5rem;">Saving...</span>
                    ` : ''}
                    <button id="add-btn" type="button" class="btn btn-primary btn-sm">+ Add New</button>
                </div>
            </div>

            <div class="filters">
                <input type="text" id="filter-search" placeholder="Search events..." value="${this.state.searchQuery}" />
                <label>
                    <input type="checkbox" id="filter-past" ${this.state.showPastEvents ? 'checked' : ''} />
                    Show Past Events
                </label>
            </div>

            <div class="event-list">
                ${filtered.length === 0 ? '<div style="text-align:center; padding:2rem; color:#666;">No events found matching your criteria.</div>' : ''}
                ${filtered.map(({ item, index }) => {
            const sizeColor = this.getSizeColor(item.size);
            return `
                    <div class="event-card ${item.hidden ? 'hidden' : ''}" style="border-left-color: ${sizeColor}">
                        <div class="card-top">
                            <div>
                                <div class="card-meta">
                                    <span>${item.startDate}</span>
                                    <span class="tag">${item.businessUnit}</span>
                                    ${item.hidden ? '<span class="tag" style="background:#ddd;">HIDDEN</span>' : ''}
                                </div>
                                <div class="card-title">${item.title}</div>
                            </div>
                            <div class="tag" style="background:${sizeColor}; color:${item.size === 'S' || item.size === 'XL' || (item.size === 'M' && sizeColor === '#9E9E9E') ? '#fff' : '#000'}">${item.size}</div>
                        </div>
                        
                        <div style="font-size:0.9rem; color:#555;">${item.summary || ''}</div>

                        <div class="card-actions">
                            <button type="button" class="btn btn-secondary btn-sm" data-action="toggle-hidden" data-index="${index}">
                                ${item.hidden ? 'Show' : 'Hide'}
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-index="${index}">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-index="${index}">Delete</button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;
    }

    renderForm() {
        const item = this.state.tempItem;
        return `
            <div class="form-view">
                <div class="header-actions">
                    <h3>${this.state.editingItemIndex !== null ? 'Edit Event' : 'New Event'}</h3>
                </div>
                
                <form id="event-form">
                    <label>Title</label>
                    <input type="text" id="input-title" value="${item.title || ''}" required placeholder="e.g. Q1 Planning" />

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label>Start</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="date" id="input-startDate-date" value="${this.toDateInputValue(item.startDate)}" style="flex: 2;" />
                                <input type="time" id="input-startDate-time" value="${this.toTimeInputValue(item.startDate)}" style="flex: 1;" />
                            </div>
                        </div>
                        <div>
                            <label>End</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="date" id="input-endDate-date" value="${this.toDateInputValue(item.endDate)}" style="flex: 2;" />
                                <input type="time" id="input-endDate-time" value="${this.toTimeInputValue(item.endDate)}" style="flex: 1;" />
                            </div>
                        </div>
                    </div>

                    <label>Summary</label>
                    <textarea id="input-summary" rows="3">${item.summary || ''}</textarea>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label>Business Unit</label>
                            <select id="input-businessUnit">
                                <option value="Advisory" ${item.businessUnit === 'Advisory' ? 'selected' : ''}>Advisory</option>
                                <option value="APPS" ${item.businessUnit === 'APPS' ? 'selected' : ''}>APPS</option>
                                <option value="DPS" ${item.businessUnit === 'DPS' ? 'selected' : ''}>DPS</option>
                                <option value="X-BU" ${item.businessUnit === 'X-BU' ? 'selected' : ''}>X-BU</option>
                            </select>
                        </div>
                        <div>
                            <label>Size</label>
                            <div class="radio-group">
                                ${['S', 'M', 'L', 'XL'].map(size => `
                                    <label class="radio-option">
                                        <input type="radio" name="size" value="${size}" ${item.size === size ? 'checked' : ''} />
                                        ${size}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <label>Link (Optional)</label>
                    <input type="text" id="input-link" value="${item.link || ''}" placeholder="https://..." />
                    
                    <label>Link Text (Optional)</label>
                    <input type="text" id="input-linkText" value="${item.linkText || ''}" placeholder="Read More" />

                    <label class="radio-option">
                        <input type="checkbox" id="input-hidden" ${item.hidden ? 'checked' : ''} />
                        Hide this event from public view (Draft)
                    </label>

                    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" id="cancel-btn" class="btn btn-secondary">Cancel</button>
                        <button type="button" id="save-btn" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        `;
    }

    // --- BINDINGS ---

    bindLoginEvents() {
        const btn = this.shadowRoot.getElementById('login-btn');
        const input = this.shadowRoot.getElementById('password-input');

        const login = () => this.login(input.value);

        btn.addEventListener('click', login);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    }

    bindModalEvents() {
        const cancelBtn = this.shadowRoot.getElementById('modal-cancel');
        const confirmBtn = this.shadowRoot.getElementById('modal-confirm');

        if (cancelBtn) cancelBtn.addEventListener('click', () => this.cancelDelete());
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmDelete());
    }

    bindMainEvents() {
        if (this.state.view === 'list') {
            const addBtn = this.shadowRoot.getElementById('add-btn');
            const exportBtn = this.shadowRoot.getElementById('export-btn');

            if (addBtn) addBtn.addEventListener('click', () => this.addNew());
            if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());

            // Filter bindings
            const searchInput = this.shadowRoot.getElementById('filter-search');
            const pastCheckbox = this.shadowRoot.getElementById('filter-past');

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.state.searchQuery = e.target.value;
                    this.render();
                    const input = this.shadowRoot.getElementById('filter-search');
                    if (input) {
                        input.focus();
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                    }
                });
            }

            if (pastCheckbox) {
                pastCheckbox.addEventListener('change', (e) => {
                    this.state.showPastEvents = e.target.checked;
                    this.render();
                });
            }

            // List Item Actions
            const list = this.shadowRoot.querySelector('.event-list');
            if (list) {
                list.addEventListener('click', (e) => {
                    const btn = e.target.closest('button');
                    if (!btn) return;

                    e.preventDefault();
                    e.stopPropagation();

                    const action = btn.dataset.action;
                    const index = parseInt(btn.dataset.index);

                    if (action === 'edit') this.editItem(index);
                    if (action === 'delete') this.requestDelete(index);
                    if (action === 'toggle-hidden') this.toggleHidden(index);
                });
            }
        }
        else if (this.state.view === 'edit') {
            const cancelBtn = this.shadowRoot.getElementById('cancel-btn');
            const saveBtn = this.shadowRoot.getElementById('save-btn');

            const inputs = this.shadowRoot.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    // Special handling for date/time split inputs
                    if (input.id.startsWith('input-startDate-') || input.id.startsWith('input-endDate-')) {
                        const baseField = input.id.includes('startDate') ? 'startDate' : 'endDate';

                        const dateInput = this.shadowRoot.getElementById(`input-${baseField}-date`);
                        const timeInput = this.shadowRoot.getElementById(`input-${baseField}-time`);

                        const dateVal = dateInput.value;
                        const timeVal = timeInput.value;

                        if (dateVal) {
                            const formattedDate = this.fromDateInputValue(dateVal);
                            const fullValue = `${formattedDate} ${timeVal || '00:00'}`;
                            this.updateTempItem(baseField, fullValue);
                        }
                        return;
                    }

                    const field = e.target.id.replace('input-', '');
                    let value = e.target.value;

                    if (e.target.type === 'checkbox') {
                        value = e.target.checked;
                    }

                    if (e.target.type === 'radio') {
                        if (e.target.checked) {
                            this.updateTempItem(e.target.name, value);
                        }
                    } else {
                        this.updateTempItem(field, value);
                    }
                });
            });

            if (cancelBtn) cancelBtn.addEventListener('click', () => {
                this.state.view = 'list';
                this.render();
            });

            if (saveBtn) saveBtn.addEventListener('click', () => this.saveItem());
        }
    }
}

customElements.define('phi-event-editor', PhiEventEditor);
