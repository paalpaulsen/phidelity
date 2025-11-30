class GridDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initLogic();
  }

  disconnectedCallback() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          color: var(--c-text, #111);
        }

        * { box-sizing: border-box; }

        /* VARIABLES (Scoped to component, falling back to global if available) */
        .wrapper {
          --phi: 1.618033988;
          --c-grid-line: #E0E0E0;
          --c-grid-text: #999;
          --c-margin: rgba(255, 0, 0, 0.05);
          --c-margin-text: #D32F2F;
          --c-block-bg: #F5F5F5;
          --c-block-border: #E0E0E0;
          --c-text: #111;
          --c-hud-bg: #111;
          --c-hud-text: #fff;
          --c-accent: #00E0FF;
        }

        /* 1. CONTAINER CONTEXT */
        .wrapper {
          container-type: inline-size;
          container-name: bento-box;
          width: 100%; 
          max-width: 3200px; 
          margin: 0 auto;
        }

        .inner {
          container-type: inline-size; 
          /* border: 1px solid #000; REMOVED to avoid double border with Zone */
          padding: 0 0 2rem 0;
          position: relative;
        }

        /* 2. THE HUD (Heads Up Display) */
        .hud {
          background: var(--c-hud-bg); color: var(--c-hud-text);
          padding: 1rem 0;
          margin-bottom: 1.5rem;
          display: grid;
          /* Grid columns defined in queries below */
          align-items: start;
        }
        
        .hud-item { display: flex; flex-direction: column; gap: 4px; }
        
        /* TYPOGRAPHY */
        .eyebrow {
            font-family: 'Inter', sans-serif;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
            opacity: 0.5;
            margin: 0;
        }

        .paragraph {
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            font-weight: 400;
            margin: 0;
        }
        
        /* Live Width Color */
        #live-width { color: var(--mono-12, #fff); font-weight: 700; }
        
        /* Breakpoint info injected via CSS */
        .hud-bp::after { content: "Initializing..."; }

        /* 3. THE RULER */
        .grid-ruler {
          display: grid; height: 30px; margin-bottom: 2rem;
          border-bottom: 1px solid #000;
        }
        .col-index {
          display: none; /* Hidden by default */
          border-left: 1px solid var(--c-grid-line);
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          justify-content: center; align-items: center; color: var(--c-grid-text);
        }
        /* Margins */
        .col-index:nth-child(1), .col-index:nth-child(2) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }

        /* 4. CONTENT BLOCKS */
        .row { display: none; margin-bottom: 1rem; } /* Hidden by default */
        
        .block {
          background: var(--c-block-bg); border: 1px solid var(--c-block-border);
          padding: 0.2rem; text-align: center;
          display: flex; flex-direction: column; justify-content: center;
          min-height: 40px; font-size: 10px; font-weight: 600;
          margin-bottom: 1em;
          white-space: nowrap; overflow: hidden; font-family: 'JetBrains Mono', monospace;
        }

        /* ==========================================================================
           THE MATH MATRIX & BREAKPOINT LABELS
        ========================================================================== */

        /* --- WATCH: 13 COLUMNS (0 - 169px) --- */
        @container (max-width: 169px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(13, 1fr); }
          .col-index:nth-child(-n+13) { display: flex; }
          .col-index:nth-child(12), .col-index:nth-child(13) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }
          
          .row.is-full { display: grid; }
          .full { grid-column: 3 / 12; }

          .hud-item:nth-child(1) { grid-column: 3 / 12; margin-bottom: 1rem; }
          .hud-item:nth-child(2) { grid-column: 3 / 12; }

          .hud-bp::after { content: "13 Cols [0px - 169px]"; }
        }

        /* --- MOBILE: 26 COLUMNS (170px - 650px) --- */
        @container (min-width: 170px) and (max-width: 650px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(26, 1fr); }
          .col-index:nth-child(-n+26) { display: flex; }
          .col-index:nth-child(25), .col-index:nth-child(26) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }

          .row.is-full, .row.is-half, .row.is-third, .row.is-fourth, .row.is-sixth, .row.is-eighth { display: grid; }

          .full { grid-column: 3 / 25; }
          .half1 { grid-column: 3 / 13; } .half2 { grid-column: 15 / 25; }
          .third1 { grid-column: 3 / 9; } .third2 { grid-column: 11 / 17; } .third3 { grid-column: 19 / 25; }
          .fourth1 { grid-column: 3 / 7; } .fourth2 { grid-column: 9 / 13; } .fourth3 { grid-column: 15 / 19; } .fourth4 { grid-column: 21 / 25; }
          .sixth1 { grid-column: 3 / 5; } .sixth2 { grid-column: 7 / 9; } .sixth3 { grid-column: 11 / 13; } .sixth4 { grid-column: 15 / 17; } .sixth5 { grid-column: 19 / 21; } .sixth6 { grid-column: 23 / 25; }
          .eighth1 { grid-column: 3 / 4; } .eighth2 { grid-column: 6 / 7; } .eighth3 { grid-column: 9 / 10; } .eighth4 { grid-column: 12 / 13; } .eighth5 { grid-column: 15 / 16; } .eighth6 { grid-column: 18 / 19; } .eighth7 { grid-column: 21 / 22; } .eighth8 { grid-column: 24 / 25; }

          .hud-item:nth-child(1) { grid-column: 3 / 13; }
          .hud-item:nth-child(2) { grid-column: 15 / 25; }

          .hud-bp::after { content: "26 Cols [Start: 170px | End: 650px]"; }
        }

        /* --- TABLET: 50 COLUMNS (651px - 962px) --- */
        @container (min-width: 651px) and (max-width: 962px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(50, 1fr); }
          .col-index:nth-child(-n+50) { display: flex; }
          .col-index:nth-child(49), .col-index:nth-child(50) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }
          
          .row.is-full, .row.is-half, .row.is-third, .row.is-fourth, .row.is-sixth, .row.is-eighth, .row.is-twelfth { display: grid; }

          .full { grid-column: 3 / 49; }
          .half1 { grid-column: 3 / 25; } .half2 { grid-column: 27 / 49; }
          .third1 { grid-column: 3 / 17; } .third2 { grid-column: 19 / 33; } .third3 { grid-column: 35 / 49; }
          .fourth1 { grid-column: 3 / 13; } .fourth2 { grid-column: 15 / 25; } .fourth3 { grid-column: 27 / 37; } .fourth4 { grid-column: 39 / 49; }
          .sixth1 { grid-column: 3 / 9; } .sixth2 { grid-column: 11 / 17; } .sixth3 { grid-column: 19 / 25; } .sixth4 { grid-column: 27 / 33; } .sixth5 { grid-column: 35 / 41; } .sixth6 { grid-column: 43 / 49; }
          .eighth1 { grid-column: 3 / 7; } .eighth2 { grid-column: 9 / 13; } .eighth3 { grid-column: 15 / 19; } .eighth4 { grid-column: 21 / 25; } .eighth5 { grid-column: 27 / 31; } .eighth6 { grid-column: 33 / 37; } .eighth7 { grid-column: 39 / 43; } .eighth8 { grid-column: 45 / 49; }
          .twelfth1 { grid-column: 3 / 5; } .twelfth2 { grid-column: 7 / 9; } .twelfth3 { grid-column: 11 / 13; } .twelfth4 { grid-column: 15 / 17; } .twelfth5 { grid-column: 19 / 21; } .twelfth6 { grid-column: 23 / 25; } .twelfth7 { grid-column: 27 / 29; } .twelfth8 { grid-column: 31 / 33; } .twelfth9 { grid-column: 35 / 37; } .twelfth10 { grid-column: 39 / 41; } .twelfth11 { grid-column: 43 / 45; } .twelfth12 { grid-column: 47 / 49; }

          .hud-item:nth-child(1) { grid-column: 7 / 17; }
          .hud-item:nth-child(2) { grid-column: 19 / -7; }

          .hud-bp::after { content: "50 Cols [Start: 651px | End: 962px]"; }
        }

        /* --- DESKTOP: 74 COLUMNS (963px - 1274px) --- */
        @container (min-width: 963px) and (max-width: 1274px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(74, 1fr); }
          .col-index:nth-child(-n+74) { display: flex; }
          .col-index:nth-child(73), .col-index:nth-child(74) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }
          
          .row.is-full, .row.is-half, .row.is-third, .row.is-fourth, .row.is-sixth, .row.is-eighth, .row.is-twelfth { display: grid; }

          .full { grid-column: 3 / 73; }
          .half1 { grid-column: 3 / 37; } .half2 { grid-column: 39 / 73; }
          .third1 { grid-column: 3 / 25; } .third2 { grid-column: 27 / 49; } .third3 { grid-column: 51 / 73; }
          .fourth1 { grid-column: 3 / 19; } .fourth2 { grid-column: 21 / 37; } .fourth3 { grid-column: 39 / 55; } .fourth4 { grid-column: 57 / 73; }
          .sixth1 { grid-column: 3 / 13; } .sixth2 { grid-column: 15 / 25; } .sixth3 { grid-column: 27 / 37; } .sixth4 { grid-column: 39 / 49; } .sixth5 { grid-column: 51 / 61; } .sixth6 { grid-column: 63 / 73; }
          .eighth1 { grid-column: 3 / 10; } .eighth2 { grid-column: 12 / 19; } .eighth3 { grid-column: 21 / 28; } .eighth4 { grid-column: 30 / 37; } .eighth5 { grid-column: 39 / 46; } .eighth6 { grid-column: 48 / 55; } .eighth7 { grid-column: 57 / 64; } .eighth8 { grid-column: 66 / 73; }
          .twelfth1 { grid-column: 3 / 7; } .twelfth2 { grid-column: 9 / 13; } .twelfth3 { grid-column: 15 / 19; } .twelfth4 { grid-column: 21 / 25; } .twelfth5 { grid-column: 27 / 31; } .twelfth6 { grid-column: 33 / 37; } .twelfth7 { grid-column: 39 / 43; } .twelfth8 { grid-column: 45 / 49; } .twelfth9 { grid-column: 51 / 55; } .twelfth10 { grid-column: 57 / 61; } .twelfth11 { grid-column: 63 / 67; } .twelfth12 { grid-column: 69 / 73; }

          .hud-item:nth-child(1) { grid-column: 7 / 17; }
          .hud-item:nth-child(2) { grid-column: 19 / -7; }

          .hud-bp::after { content: "74 Cols [Start: 963px | End: 1274px]"; }
        }

        /* --- LARGE: 98 COLUMNS (1275px - 1585px) --- */
        @container (min-width: 1275px) and (max-width: 1585px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(98, 1fr); }
          .col-index:nth-child(-n+98) { display: flex; }
          .col-index:nth-child(97), .col-index:nth-child(98) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }
          
          .row.is-full, .row.is-half, .row.is-third, .row.is-fourth, .row.is-sixth, .row.is-eighth, .row.is-twelfth { display: grid; }

          .full { grid-column: 3 / 97; }
          .half1 { grid-column: 3 / 49; } .half2 { grid-column: 51 / 97; }
          .third1 { grid-column: 3 / 33; } .third2 { grid-column: 35 / 65; } .third3 { grid-column: 67 / 97; }
          .fourth1 { grid-column: 3 / 25; } .fourth2 { grid-column: 27 / 49; } .fourth3 { grid-column: 51 / 73; } .fourth4 { grid-column: 75 / 97; }
          .sixth1 { grid-column: 3 / 17; } .sixth2 { grid-column: 19 / 33; } .sixth3 { grid-column: 35 / 49; } .sixth4 { grid-column: 51 / 65; } .sixth5 { grid-column: 67 / 81; } .sixth6 { grid-column: 83 / 97; }
          .eighth1 { grid-column: 3 / 13; } .eighth2 { grid-column: 15 / 25; } .eighth3 { grid-column: 27 / 37; } .eighth4 { grid-column: 39 / 49; } .eighth5 { grid-column: 51 / 61; } .eighth6 { grid-column: 63 / 73; } .eighth7 { grid-column: 75 / 85; } .eighth8 { grid-column: 87 / 97; }
          .twelfth1 { grid-column: 3 / 9; } .twelfth2 { grid-column: 11 / 17; } .twelfth3 { grid-column: 19 / 25; } .twelfth4 { grid-column: 27 / 33; } .twelfth5 { grid-column: 35 / 41; } .twelfth6 { grid-column: 43 / 49; } .twelfth7 { grid-column: 51 / 57; } .twelfth8 { grid-column: 59 / 65; } .twelfth9 { grid-column: 67 / 73; } .twelfth10 { grid-column: 75 / 81; } .twelfth11 { grid-column: 83 / 89; } .twelfth12 { grid-column: 91 / 97; }

          .hud-item:nth-child(1) { grid-column: 7 / 17; }
          .hud-item:nth-child(2) { grid-column: 19 / -7; }

          .hud-bp::after { content: "98 Cols [Start: 1275px | End: 1585px]"; }
        }

        /* --- XL: 122 COLUMNS (1586px - 1897px) --- */
        @container (min-width: 1586px) and (max-width: 1897px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(122, 1fr); }
          .col-index:nth-child(-n+122) { display: flex; }
          .col-index:nth-child(121), .col-index:nth-child(122) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }
          
          .row.is-full, .row.is-half, .row.is-third, .row.is-fourth, .row.is-sixth, .row.is-eighth, .row.is-twelfth { display: grid; }

          .full { grid-column: 3 / 121; }
          .half1 { grid-column: 3 / 61; } .half2 { grid-column: 63 / 121; }
          .third1 { grid-column: 3 / 41; } .third2 { grid-column: 43 / 81; } .third3 { grid-column: 83 / 121; }
          .fourth1 { grid-column: 3 / 31; } .fourth2 { grid-column: 33 / 61; } .fourth3 { grid-column: 63 / 91; } .fourth4 { grid-column: 93 / 121; }
          .sixth1 { grid-column: 3 / 21; } .sixth2 { grid-column: 23 / 41; } .sixth3 { grid-column: 43 / 61; } .sixth4 { grid-column: 63 / 81; } .sixth5 { grid-column: 83 / 101; } .sixth6 { grid-column: 103 / 121; }
          .eighth1 { grid-column: 3 / 16; } .eighth2 { grid-column: 18 / 31; } .eighth3 { grid-column: 33 / 46; } .eighth4 { grid-column: 48 / 61; } .eighth5 { grid-column: 63 / 76; } .eighth6 { grid-column: 78 / 91; } .eighth7 { grid-column: 93 / 106; } .eighth8 { grid-column: 108 / 121; }
          .twelfth1 { grid-column: 3 / 11; } .twelfth2 { grid-column: 13 / 21; } .twelfth3 { grid-column: 23 / 31; } .twelfth4 { grid-column: 33 / 41; } .twelfth5 { grid-column: 43 / 51; } .twelfth6 { grid-column: 53 / 61; } .twelfth7 { grid-column: 63 / 71; } .twelfth8 { grid-column: 73 / 81; } .twelfth9 { grid-column: 83 / 91; } .twelfth10 { grid-column: 93 / 101; } .twelfth11 { grid-column: 103 / 111; } .twelfth12 { grid-column: 113 / 121; }

          .hud-item:nth-child(1) { grid-column: 7 / 17; }
          .hud-item:nth-child(2) { grid-column: 19 / -7; }

          .hud-bp::after { content: "122 Cols [Start: 1586px | End: 1897px]"; }
        }

        /* --- CINEMA: 146 COLUMNS (1898px +) --- */
        @container (min-width: 1898px) {
          .grid-ruler, .row, .hud { grid-template-columns: repeat(146, 1fr); }
          .col-index:nth-child(-n+146) { display: flex; }
          .col-index:nth-child(145), .col-index:nth-child(146) { background: var(--c-margin); color: var(--c-margin-text); font-weight: bold; }
          
          .row.is-full, .row.is-half, .row.is-third, .row.is-fourth, .row.is-sixth, .row.is-eighth, .row.is-ninth, .row.is-twelfth, .row.is-sixteenth { display: grid; }

          .full { grid-column: 3 / 145; }
          .half1 { grid-column: 3 / 73; } .half2 { grid-column: 75 / 145; }
          .third1 { grid-column: 3 / 49; } .third2 { grid-column: 51 / 97; } .third3 { grid-column: 99 / 145; }
          .fourth1 { grid-column: 3 / 37; } .fourth2 { grid-column: 39 / 73; } .fourth3 { grid-column: 75 / 109; } .fourth4 { grid-column: 111 / 145; }
          .sixth1 { grid-column: 3 / 25; } .sixth2 { grid-column: 27 / 49; } .sixth3 { grid-column: 51 / 73; } .sixth4 { grid-column: 75 / 97; } .sixth5 { grid-column: 99 / 121; } .sixth6 { grid-column: 123 / 145; }
          .eighth1 { grid-column: 3 / 19; } .eighth2 { grid-column: 21 / 37; } .eighth3 { grid-column: 39 / 55; } .eighth4 { grid-column: 57 / 73; } .eighth5 { grid-column: 75 / 91; } .eighth6 { grid-column: 93 / 109; } .eighth7 { grid-column: 111 / 127; } .eighth8 { grid-column: 129 / 145; }
          
          /* Ninths (14 cols wide) */
          .ninth1 { grid-column: 3 / 17; } .ninth2 { grid-column: 19 / 33; } .ninth3 { grid-column: 35 / 49; } .ninth4 { grid-column: 51 / 65; } .ninth5 { grid-column: 67 / 81; } .ninth6 { grid-column: 83 / 97; } .ninth7 { grid-column: 99 / 113; } .ninth8 { grid-column: 115 / 129; } .ninth9 { grid-column: 131 / 145; }
          
          /* Twelfths (10 cols wide) */
          .twelfth1 { grid-column: 3 / 13; } .twelfth2 { grid-column: 15 / 25; } .twelfth3 { grid-column: 27 / 37; } .twelfth4 { grid-column: 39 / 49; } .twelfth5 { grid-column: 51 / 61; } .twelfth6 { grid-column: 63 / 73; } .twelfth7 { grid-column: 75 / 85; } .twelfth8 { grid-column: 87 / 97; } .twelfth9 { grid-column: 99 / 109; } .twelfth10 { grid-column: 111 / 121; } .twelfth11 { grid-column: 123 / 133; } .twelfth12 { grid-column: 135 / 145; }
          
          /* Sixteenths (7 cols wide) */
          .sixteenth1 { grid-column: 3 / 10; } .sixteenth2 { grid-column: 12 / 19; } .sixteenth3 { grid-column: 21 / 28; } .sixteenth4 { grid-column: 30 / 37; } .sixteenth5 { grid-column: 39 / 46; } .sixteenth6 { grid-column: 48 / 55; } .sixteenth7 { grid-column: 57 / 64; } .sixteenth8 { grid-column: 66 / 73; } .sixteenth9 { grid-column: 75 / 82; } .sixteenth10 { grid-column: 84 / 91; } .sixteenth11 { grid-column: 93 / 100; } .sixteenth12 { grid-column: 102 / 109; } .sixteenth13 { grid-column: 111 / 118; } .sixteenth14 { grid-column: 120 / 127; } .sixteenth15 { grid-column: 129 / 136; } .sixteenth16 { grid-column: 138 / 145; }

          .hud-item:nth-child(1) { grid-column: 7 / 17; }
          .hud-item:nth-child(2) { grid-column: 19 / -7; }

          .hud-bp::after { content: "146 Cols [Start: 1898px]"; }
        }
      </style>

      <div class="wrapper">
        <div class="inner">
          
          <div class="hud">
            <div class="hud-item">
              <span class="eyebrow">Active Viewport</span>
              <span class="paragraph" id="live-width">---</span>
            </div>
            <div class="hud-item">
              <span class="eyebrow">Break Point</span>
              <span class="paragraph hud-bp"></span>
            </div>
          </div>

          <!-- DYNAMIC RULER -->
          <div id="ruler" class="grid-ruler"></div>

          <!-- CONTENT (Chronological) -->
          
          <div class="row is-full">
            <div class="block full">1/1</div>
          </div>

          <div class="row is-half">
            <div class="block half1">1/2</div> <div class="block half2">1/2</div>
          </div>

          <div class="row is-third">
            <div class="block third1">1/3</div> <div class="block third2">1/3</div> <div class="block third3">1/3</div>
          </div>

          <div class="row is-fourth">
            <div class="block fourth1">1/4</div> <div class="block fourth2">1/4</div> <div class="block fourth3">1/4</div> <div class="block fourth4">1/4</div>
          </div>

          <div class="row is-sixth">
            <div class="block sixth1">1/6</div> <div class="block sixth2">1/6</div> <div class="block sixth3">1/6</div>
            <div class="block sixth4">1/6</div> <div class="block sixth5">1/6</div> <div class="block sixth6">1/6</div>
          </div>

          <div class="row is-eighth">
            <div class="block eighth1">1/8</div> <div class="block eighth2">1/8</div> <div class="block eighth3">1/8</div> <div class="block eighth4">1/8</div>
            <div class="block eighth5">1/8</div> <div class="block eighth6">1/8</div> <div class="block eighth7">1/8</div> <div class="block eighth8">1/8</div>
          </div>

          <div class="row is-ninth">
            <div class="block ninth1">1/9</div> <div class="block ninth2">1/9</div> <div class="block ninth3">1/9</div>
            <div class="block ninth4">1/9</div> <div class="block ninth5">1/9</div> <div class="block ninth6">1/9</div>
            <div class="block ninth7">1/9</div> <div class="block ninth8">1/9</div> <div class="block ninth9">1/9</div>
          </div>

          <div class="row is-twelfth">
            <div class="block twelfth1">12</div> <div class="block twelfth2">12</div> <div class="block twelfth3">12</div> <div class="block twelfth4">12</div>
            <div class="block twelfth5">12</div> <div class="block twelfth6">12</div> <div class="block twelfth7">12</div> <div class="block twelfth8">12</div>
            <div class="block twelfth9">12</div> <div class="block twelfth10">12</div> <div class="block twelfth11">12</div> <div class="block twelfth12">12</div>
          </div>

          <div class="row is-sixteenth">
            <div class="block sixteenth1">16</div> <div class="block sixteenth2">16</div> <div class="block sixteenth3">16</div> <div class="block sixteenth4">16</div>
            <div class="block sixteenth5">16</div> <div class="block sixteenth6">16</div> <div class="block sixteenth7">16</div> <div class="block sixteenth8">16</div>
            <div class="block sixteenth9">16</div> <div class="block sixteenth10">16</div> <div class="block sixteenth11">16</div> <div class="block sixteenth12">16</div>
            <div class="block sixteenth13">16</div> <div class="block sixteenth14">16</div> <div class="block sixteenth15">16</div> <div class="block sixteenth16">16</div>
          </div>

        </div>
      </div>
    `;
  }

  initLogic() {
    // 1. Ruler Generation
    const ruler = this.shadowRoot.getElementById('ruler');
    if (ruler && ruler.children.length === 0) {
      for (let i = 1; i <= 146; i++) {
        const div = document.createElement('div');
        div.className = 'col-index';
        if (i <= 26) div.textContent = i;
        else if (i % 2 === 0) div.textContent = i;
        if (i === 1 || i === 2) div.textContent = "M";
        ruler.appendChild(div);
      }
    }

    // 2. Live Width Counter
    const widthDisplay = this.shadowRoot.getElementById('live-width');
    this._resizeHandler = () => {
      if (widthDisplay) widthDisplay.textContent = window.innerWidth + 'px';
    };
    window.addEventListener('resize', this._resizeHandler);
    this._resizeHandler(); // Init
  }
}

customElements.define('phi-grid-display', GridDisplay);
