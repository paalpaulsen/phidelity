class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}generateGridCSS(){return[{id:"13",query:"(max-width: 337px)",cols:13},{id:"26",query:"(min-width: 338px) and (max-width: 649px)",cols:26},{id:"50",query:"(min-width: 650px) and (max-width: 961px)",cols:50},{id:"74",query:"(min-width: 962px) and (max-width: 1273px)",cols:74},{id:"98",query:"(min-width: 1274px) and (max-width: 1585px)",cols:98},{id:"122",query:"(min-width: 1586px) and (max-width: 1897px)",cols:122},{id:"146",query:"(min-width: 1898px) and (max-width: 2209px)",cols:146},{id:"170",query:"(min-width: 2210px) and (max-width: 2521px)",cols:170},{id:"194",query:"(min-width: 2522px)",cols:194}].map(r=>{const t=r.cols,c=`minmax(calc(100cqw / ${t} / 1.618), auto)`;let e="3 / -3",i="3 / -3",s="3 / -3",l="3 / -3",a="3 / -3",o="3 / -1";return t>=50&&t<74&&(e="3 / 25",i="27 / 49",s="3 / 25",l="3 / 49",a="3 / 15"),t>=74&&t<122&&(e="3 / 37",i="39 / 73",s="3 / 37",l="3 / 73",a="3 / 21"),t>=122&&(e="5 / 60",i="64 / 119",s="5 / 60",l="5 / 119",a="5 / 25",o="5 / -1"),`
            @container article-form ${r.query} {
                .container {
                    grid-template-columns: repeat(${t}, 1fr);
                    grid-auto-rows: ${c};
                }
                
                /* Responsive Header Alignment */
                h2 { grid-column: ${o}; }
                
                .field-name { grid-column: ${e}; }
                .field-email { grid-column: ${i}; }
                .field-phone { grid-column: ${s}; }
                .field-message { grid-column: ${l}; }
                .field-submit { grid-column: ${a}; }
            }
            `}).join(`
`)}render(){this.shadowRoot.innerHTML=`
            <!-- PHIDELITY MACRO (Baseline) -->
            <link rel="stylesheet" href="/css/macro.css">
            <!-- COMPONENT LAYER (Designsystemet) - Version Pinned CDN (@1.9.0) -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@digdir/designsystemet-css@1.9.0/dist/src/index.css">
            
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
               DATA-COLOR-SCHEME:
               Explicitly set theme. Designsystemet often requires a class or data-attribute on a parent.
               We add 'ds-theme-light' just in case the data attribute isn't sufficient in this version.
            -->
            <div class="container" data-color-scheme="light" data-size="md">
                <h2>Contact</h2>

                <!-- NAME -->
                <div class="field-wrapper field-name">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="name">Name</label>
                        <input class="ds-input" id="name" type="text" placeholder="Your full name" />
                    </div>
                </div>

                <!-- EMAIL -->
                <div class="field-wrapper field-email">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="email">Email</label>
                        <input class="ds-input" id="email" type="email" placeholder="email@domain.com" />
                    </div>
                </div>

                <!-- PHONE -->
                <div class="field-wrapper field-phone">
                    <div class="ds-field">
                        <label class="ds-label" data-weight="medium" for="phone">Phone Number</label>
                        <input class="ds-input" id="phone" type="tel" placeholder="+00 000 00 000" />
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
                    <button id="send-btn" class="ds-button" type="button" data-variant="primary">
                        Send Message
                    </button>
                </div>

            </div>
        `;const n=this.shadowRoot.querySelector("#send-btn");n&&n.addEventListener("click",()=>this.sendEmail())}async sendEmail(){const n=this.shadowRoot.querySelector("#name"),r=this.shadowRoot.querySelector("#email"),t=this.shadowRoot.querySelector("#phone"),c=this.shadowRoot.querySelector("#message"),e=this.shadowRoot.querySelector("#send-btn"),i=n.value,s=r.value,l=t.value,a=c.value;if(!i||!s||!a){alert("Please fill in Name, Email, and Message.");return}const o=e.innerText;e.innerText="Sending...",e.disabled=!0;try{const d=await fetch("send_mail.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:i,email:s,phone:l,message:a})});let m;try{m=await d.json()}catch{const h=await d.text();throw new Error("Server response not valid JSON: "+h.substring(0,50))}if(d.ok&&m.status==="success")e.innerText="Sent!",alert("Message sent successfully!"),n.value="",r.value="",t.value="",c.value="";else throw new Error(m.message||"Failed to send")}catch(d){console.error("Email Error:",d),alert("Could not send message. ("+d.message+")")}finally{e.innerText!=="Sent!"?(e.innerText=o,e.disabled=!1):setTimeout(()=>{e.innerText=o,e.disabled=!1},3e3)}}}customElements.define("phi-article-form",u);
