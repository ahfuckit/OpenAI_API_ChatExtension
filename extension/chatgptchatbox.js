/**
* @summary Use Contract.chat() to create a interface for using OpenAI's ChatGPT API on any website. 
The following can be done in the rendered element settings menu.
** Set your OpenAI API key
** Choose a gpt model
** Choose a temperature
** Set the token limit
** Choose a theme
@extends HTMLElement HTMLELEMENT
@classdesc Chat interface for OpenAI's ChatGPT API.
@name APIChatBox
@author `CSingendonk`
@copyright &copy; 2024
*/
class APIChatBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadow = this.shadowRoot;
        this.apiKey = null;
        this.endpoint = 'https://api.openai.com/v1/chat/completions/';
        this.model = 'gpt-4o-mini';
        this.temperature = 0.7;
        this.top_p = 0.5;
        this.theme = 'light';
        this.customtheme = {
            bgclr: '#ffffff',
            txtclr: '#000000',
            fontsz: '14px',
        };
        this.messages = [];
        this.maxTokens = 250;
        this.max_tokens = this.maxTokens;
        this.render();
    }
    render() {
        const styles = `
       <style>
           #container {
               display: flex;
               flex-direction: column;
               max-width: 100%;
               max-height: 100%;
               border: 1px solid #e0e0e0;
               border-radius: 8px;
               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
               margin: 0;
               width: fit-content;
               background-color: #ffffff;
               overflow: hidden;
           }
           #titlebar {
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 15px 25px;
               background-color: #007bff;
               color: white;
               border-radius: 8px 8px 0 0;
               flex-shrink: 0;
           }
           .bar-spacer {
               flex-grow: 1;
               cursor: pointer;
               transition: background-color 0.3s;
               font-size: 14px;
               font-weight: bold;
               text-transform: uppercase;
               letter-spacing: 1px;
               text-align: center;
           }
           #settings-container {
               padding: 15px;
               background-color: #f8f9fa;
               border: 1px solid #e9ecef;
               border-radius: 8px;
               box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
               position: relative;
               top: 100%;
               right: 0;
               z-index: 1000;
               min-width: 220px;
               flex-shrink: 0;
           }
           #settings-container span {
               display: block;
               padding: 10px;
               margin: 4px 0;
               border-radius: 4px;
               cursor: pointer;
               transition: background-color 0.2s;
           }
           #settings-container span:hover {
               background-color: #e0e0e0;
           }
           #api-select {
               margin-top: 10px;
               padding: 10px;
               background-color: #fff;
               border-radius: 6px;
               box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
           }
           #chat-view {
               display: flex;
               flex-direction: column;
               border: 1px solid #ccc;
               flex-grow: 1;
               width: auto;
               border-radius: 0 0 8px 8px;
               overflow-y: auto;
               height: 100%;
           }
           .chat-container {
               padding: 15px;
               border-radius: 8px;
               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
               border: 1px solid #cccccc0d;
               background-color: #f9f9f9;
               flex-grow: 1;
               display: flex;
               flex-direction: column;
           }
           .messages {
               flex-grow: 1;
               display: flex;
               flex-direction: column;
               margin-bottom: 10px;
           }
           .message {
               margin: 1% 0;
               padding: 1% 0.5%;
               border-radius: 6px;
               word-wrap: break-word;
               width: fit-content;
               max-width: 80%;
           }
           .user-message {
               background-color: #d7ecfc;
               margin-left: 20px;
               align-self: flex-end;
           }
           .user-message:hover {
               background-color: #aeeeee;
           }
           .bot-message {
               background-color: #a4b9c9;
               margin-right: 20px;
               align-self: flex-start;
               
           }
           .bot-message:hover {
               background-color: #f5f5f5;
           }
           .input-area {
               display: flex;
               margin-top: 15px;
               gap: 10px;
               flex-shrink: 0;
           }
           .input-area input {
               flex: 1;
               padding: 10px;
               border: 2px solid #ddd;
               border-radius: 6px;
               font-size: 14px;
               transition: border-color 0.3s;
           }
           .input-area input:focus {
               outline: none;
               border-color: #0056b3;
           }
           .input-area button {
               padding: 10px 16px;
               border: none;
               background-color: #007bff;
               color: white;
               border-radius: 6px;
               cursor: pointer;
               transition: background-color 0.3s;
           }
           .input-area button:hover {
               background-color: #0056b3;
           }
           .typing-indicator {
               display: none;
               margin: 8px 0;
               color: #666;
               font-style: italic;
           }
           .typing-indicator.visible {
               display: block;
           }
           .collapsible {
               background-color: #f1f1f1;
               color: #333;
               cursor: pointer;
               padding: 10px;
               border: none;
               text-align: left;
               outline: none;
               font-size: 1rem;
               transition: 0.4s;
               width: fit-content;
               max-width: 100%;
               max-height: fit-content;
               overflow: hidden;
               border-radius: 5px;
               margin-bottom: 1%;
               margin-top: 1%;
               margin-left: 1%;
               margin-right: 1%;
               user-select: none;
           }
           .collapsible:hover {
               background-color: #ccc;
           }
           .collapsed {
               display: none;
           }
           .expanded {
               display: block;
           }
           .dropdown {
               position: relative;
               float: right;
               display: block;
           }
           #settingsbtn {
               cursor: pointer;
           }
           host {
               display: flex;
               position: relative;
               width: fit-content;
               height: fit-content;
               border: 1px solid #ccc;
               border-radius: 5px;
               padding: 10px;
               background-color: #f9f9f9;
               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
           }
           api-chat-box, #titlebar span {
               font-size: 1.5rem;
           }
           #apisettingsbtn, .settingsbtn  {
               box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
               width: 100%;
               height: 1.5rem;
           }
           drag-grip {
               width: fit-content;
               position: absolute;

               transition: all cubic-bezier(.68,-0.55,.27,1.55) 0.3s;
               float: left;
               clear: both;
           }

           .menubtn {
                cursor: pointer;
                margin: initial;
                padding: initial;
                border: initial;
                background-color: initial;
                color: initial;
                font-size: initial;
                font-family: initial;
                text-align: initial;
                text-decoration: initial;
                text-transform: tranlateY(1px);
                transition: all cubic-bezier(.68,-0.55,.27,1.55) 0.3s;
            }

            .menubtn:hover {
                background-color: #e0e0e0;
                transform: translateY(-1px);
                text-decoration: underline;
                text-underline-offset: 2px;
                text-decoration-color: #007bff;
                text-decoration-thickness: 2px;
                text-decoration-skip-ink: none;
                text-transform: none;
                transform: scale(1.05);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                outline: -1% solid #007bff;
            }

            .inputbtn {
                cursor: pointer;
                margin: 1%;
                padding: 1%;
                border: initial; -1px solid #007bffaa;
                background-color: #00aaff;
                color: black;
                font-size: 1.1rem;
                font-family: initial;
                text-align: center;
                text-decoration: initial;
                text-transform: tranlateY(1px);
                transition: all cubic-bezier(.68,-0.55,.27,1.55) 0.3s;
                border-radius: 5px;
                box-shadow: 0 2px 4px inset rgba(0, 0, 0, 0.1);
            }

            .light-theme {
                background-color: #f0f0f0;
                color: #333;
            }
            .dark-theme {
                background-color: #1a1a1a;
                color: #fff;
            }

            html, body{
                width: fit-content;
                height: fit-content;
                min-width: fit-content;
                min-height: fit-content;
           }
       </style>
   `;
        //           <drag-grip></drag-grip> // for floating web component version

        const template = `
       <div id="container" class="container">
           <div id="titlebar" class="titlebar">
               <div>
                   <span class="menubtn" id="chatbtn">Chat</span>
               </div>
               <span class="bar-spacer"></span>
               <div>
                   <span id="settingsbtn" class="menubtn" >Settings</span>
               </div>
               <span class="bar-spacer"></span>
               <div>
               <span class="menubtn" id="helpbtn">Help</span>
               </div>
               <span class="bar-spacer"></span>
               <div>
               <!--
               <span>
                   <button class="menubtn panelbtn" id="minimize-button">-</button>
                   <button class="menubtn panelbtn "  id="maximize-button">+</button>
                   <button class="menubtn panelbtn"  id="close-button">X</button>
               </span>
               -->
               </div>
           </div>
           <div id="settings-container" class="collapsible dropdown" style="display: none;">
                <span id="themesettingsbtn" class="settingsbtn menubtn">Theme</span>
                <div id="theme-select" class="collapsible dropdown collapsed" style="display: none;">
                    <span class="light-theme"  id="lightthemebtn">Light</span>
                    <span class="dark-theme" id="darkthemebtn">Dark</span>
                    <span style="all: initial;" id="systemthemebtn">System</span>
                    <span style="background-image: linear-gradient(to-right blue green red yellow)" id="customthemebtn">Custom</span>
                    <div id="customtheme" class="collapsible dropdown collapsed" style="display: none;">
                        <span>Background Color:<input type="color" id="backgroundcolorinput" /></span>
                        <span>Text Color:<input type="color" id="textcolorinput" /></span>
                        <span>Font Size:<input type="number" increment="1" minimum="10" value="16" maximum="100" id="fontsizeinput" /></span>
                    </div>
                    <span id="resetthemebtn">Reset</span>
                    <span id="savethemebtn">Save</span>
                </div>
                <div>
                    <span id="apisettingsbtn" class="settingsbtn menubtn">API</span>
                    <div id="api-select" class="collapsible dropdown" style="display: none;">
                        <span>Key:<input type="text" id="apiKeyinput" /><button id="savekeybtn" class="inputbtn">Save</button></span>
                        <span>Organization:<input type="text" id="organizationinput" /></span>
                        <span>Endpoint:<input type="text" id="apiUrlinput" placeholder="default: https://api.openai.com/v1/chat/completions/" /></span>
                        <span>Model:<input type="text" id="modelinput" placeholder="gpt-4o-mini" /></span>
                        <span>Temperature:<input type="text" id="temperatureinput" placeholder="0.7" /></span>
                        <span>Max Tokens:<input type="number" increment="10" minimum="10" value="250" maximum="10000" id="max_tokensinput"  />
                            <input type="range" id="max_tokens_range" min="10" max="10000" value="250" />
                            <span id="max_tokens_value">250</span>
                            <input style="display: none" type="text" placeholder="Token use limit per response, includes input tokens." id="max_tokens_text" />
                        </span>
                    </div>
                </div>
            </div>

           <div class="collapsible dropdown" id="chat-view">
               <div class="chat-header titlebar">
                   <span class="menubtn" id="newchatbtn">New Chat</span>
                   <span class="menubtn" id="clearchatbtn">Clear Chat</span>
                   <span class="menubtn" id="savechatbtn">Save Chat</span>
                   <span class="menubtn" id="chathistorybtn">History</div>
                </div>                  
               <div class="chat-container container">
                   <div class="messages" id="messages"></div>
                   <div class="typing-indicator" id="typingIndicator">ChatGPT is typing...</div>
                   <div class="input-area">
                       <input type="text" id="userInput" placeholder="Type your message..." />
                       <button id="sendButton">Send</button>
                   </div>
               </div>
           </div>
           <div class="collapsible dropdown" id="help-view">
                <div class="help-container container">
                <h2>Help</h2>
                <p>Welcome to the ChatGPT ChatBox! Here are some tips to get started:</p>
                <ul>
                    <li>You need to enter your OpenAI API key in the settings to use the chatbox. \n To get a new one you can create an account on the <a href="https://www.openai.com">OpenAI API</a> website and follow their instructions to generate one.
                    </li>
                    <li>You can customize the chatbox's appearance and behavior in the settings.</li>
                    <li>To start a new chat, click the "New Chat" button or close the extension panel and reopen it.</li>
                    <li>To clear the chat history, click the "Clear Chat" button.</li>
                </ul>
                </div>
            </div>
       </div>
   `;
        this.shadowRoot.innerHTML = styles + template;
        this.setEventListeners();
    }

    setEventListeners() {

        function setClassTheme(theme) {
            const body = document.body;
            let hastheme = () => body.className.includes('-theme') ? true : false;
            function checkfortheme() {
            if (hastheme()) {
                body.className = body.className.replace(body.className.substring(body.className.lastIndexOf(' ', body.className.indexOf('-theme')), body.className.indexOf('-theme') + 6), '');
            }
            if (hastheme()){
                checkfortheme();
            }
            }
            body.className += `${theme}-theme`;


        }

        // UI Control Elements
        const chatbtn = this.shadowRoot.getElementById('chatbtn');
        const chatView = this.shadowRoot.getElementById('chat-view');
        const settingsbtn = this.shadowRoot.getElementById('settingsbtn');
        const helpButton = this.shadowRoot.getElementById('helpbtn');
        const helpContainer = this.shadowRoot.getElementById('help-view');
        const minimizeButton = this.shadowRoot.getElementById('minimize-button');
        const maximizeButton = this.shadowRoot.getElementById('maximize-button');
        const closeButton = this.shadowRoot.getElementById('close-button');
        // Theme Elements
        const themeButton = this.shadowRoot.getElementById('themesettingsbtn');
        const themeselect = this.shadowRoot.getElementById('theme-select');
        const lightthemebtn = this.shadowRoot.getElementById('lightthemebtn');
        const darkthemebtn = this.shadowRoot.getElementById('darkthemebtn');
        const systemthemebtn = this.shadowRoot.getElementById('systemthemebtn');
        const customthemebtn = this.shadowRoot.getElementById('customthemebtn');
        const customtheme = this.shadowRoot.getElementById('customtheme');
        const resetthemebtn = this.shadowRoot.getElementById('resetthemebtn');
        const savethemebtn = this.shadowRoot.getElementById('savethemebtn');
        const backgroundcolorinput = this.shadowRoot.getElementById('backgroundcolorinput');
        const textcolorinput = this.shadowRoot.getElementById('textcolorinput');
        const fontsizeinput = this.shadowRoot.getElementById('fontsizeinput');

        // API Settings Elements
        const apiSettingsbtn = this.shadowRoot.getElementById('apisettingsbtn');
        const apiKeyinput = this.shadowRoot.getElementById('apiKeyinput');
        const saveKeybtn = this.shadowRoot.getElementById('savekeybtn');
        const modelinput = this.shadowRoot.getElementById('modelinput');
        const temperatureinput = this.shadowRoot.getElementById('temperatureinput');
        const max_tokensinput = this.shadowRoot.getElementById('max_tokensinput');
        const max_tokens_range = this.shadowRoot.getElementById('max_tokens_range');
        const max_tokens_value = this.shadowRoot.getElementById('max_tokens_value');
        const max_tokens_text = this.shadowRoot.getElementById('max_tokens_text');

        // Chat Elements
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const userInput = this.shadowRoot.getElementById('userInput');


        // UI Control Listeners
        chatbtn.addEventListener('click', () => {
            chatView.style.display = chatView.style.display === 'none' ? 'block' : 'none';
        });

        settingsbtn.addEventListener('click', () => {
            const settingsContainer = this.shadowRoot.getElementById('settings-container');
            settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
        });

        helpContainer.style.display = 'none';
        helpButton.addEventListener('click', () => {
            helpContainer.style.display = helpContainer.style.display === 'none' ? 'block' : 'none';
        });

/*         // Window Control Listeners
        minimizeButton.addEventListener('click', () => {
            const h = this.shadowRoot.querySelector('#container');
            const hh = document.querySelector('api-chat-box');
            const hhh = hh.parentElement || hh.previousElementSibling.parentElement;
            const hhhh = hhh.parentElement || hh.getRootNode() ;
            const hhhhh = this.shadowRoot.host || hhhh;
            [h, hh, hhh, hhhh, hhhhh].forEach(element => {
                element.style.transition = 'all 0.2s ease-in-out';
                element.style.transformOrigin = 'top left';
                element.style.transform = 'scaleY(0.5)';
                element.style.height = parseInt(element.style.height) / 2 + 'px';
            });   
            const tbs = this.shadowRoot.querySelectorAll('.titlebar');
            tbs.forEach(tb => {
                tb.style.transition = 'all 0.2s ease-in-out';
                tb.style.transformOrigin = 'top center';
                tb.style.height = `${(parseInt(tb.style.height) * 2)}%`;
                tb.style.transform = 'scaleY(2)';
                tb.style.width = '100%';
                tb.style.position = 'absolute';
                tb.style.top = '0px';
                tb.style.left = '0px';
                tb.style.zIndex = '10001';


            });
        });

        maximizeButton.addEventListener('click', () => {
            const h = this.shadowRoot.querySelector('#container');
            h.style.transition = 'all 0.2s ease-in-out';
            h.style.transform = 'scale(2)';
        });

        closeButton.addEventListener('click', () => {
            const h = this.shadowRoot.querySelector('#container');
            h.style.transition = 'transform 0.2s ease-in-out';
            h.style.transform = 'scale(0)';
            setTimeout(() => {
                h.style.display = 'none';
            }, 200);
        }); */

        
        themeButton.addEventListener('click', () => {
            themeselect.style.display = themeselect.style.display === 'none' ? 'block' : 'none';
        });

        lightthemebtn.addEventListener('click', () => {
            setClassTheme('light');
            this.shadowRoot.querySelectorAll('div').forEach(element => {
                element.style.color = 'black';
                element.style.backgroundColor = 'white';
                element.style.borderColor = '#005599'; 
            });
            Contract.data().secureStore('theme', 'light');
        });

        darkthemebtn.addEventListener('click', () => {
            const body = document.body;
            setClassTheme('dark');
            Contract.data().secureStore('theme', 'dark');
            this.shadowRoot.querySelectorAll('div').forEach(element => {
                element.style.color = 'white';
                element.style.backgroundColor = 'black';
                element.style.borderColor = 'grey'; 
            });

        });

        customthemebtn.addEventListener('click', () => {
            customtheme.style.display = customtheme.style.display === 'none' ? 'block' : 'none';
            customtheme.querySelectorAll('input').forEach(input => {
                if (input.type == 'color') {
                    if (input.id === 'backgroundcolorinput') {
                        input.addEventListener('input', (e) => {
                            this.customtheme.bgclr = input.value;
                Contract.data().secureStore('customtheme', JSON.stringify(this.customtheme));

                        });
                    } else if (input.id === 'textcolorinput') {
                        input.addEventListener('input', (e) => {
                            this.customtheme.txtclr = input.value;
                Contract.data().secureStore('customtheme', JSON.stringify(this.customtheme));

                        });
                    }
                }
                if (input.type == 'text')
                    input.addEventListener('input', (e) => {
                            this.customtheme.fontsz = input.value + 'px';
                Contract.data().secureStore('customtheme', JSON.stringify(this.customtheme));

                    });
                if (input.type == 'number'){
                    input.addEventListener('input', (e) => {
                        this.customtheme.fontsz = input.value + 'px';
                Contract.data().secureStore('customtheme', JSON.stringify(this.customtheme));

                    });
                }
                Contract.data().secureStore('customtheme', JSON.stringify(this.customtheme));
                [...this.shadowRoot.querySelectorAll('div'), ...this.shadowRoot.querySelectorAll('#menubtn')].forEach(element => {
                    element.style.color = this.customtheme.txtclr;
                    element.style.backgroundColor = this.customtheme.bgclr;
                    element.style.fontSize = this.customtheme.fontsz;
                });

                
            });
        });

        // API Settings Listeners
        apiSettingsbtn.addEventListener('click', () => {
            const apiSettingsContainer = this.shadowRoot.getElementById('api-select');
            apiSettingsContainer.style.display = apiSettingsContainer.style.display === 'none' ? 'block' : 'none';
        });

        function apikeylisteners() {
            apiKeyinput.addEventListener('input', (e) => {
                apiKeyinput.focus();
                const apiKey = apiKeyinput.value;
            });

            apiKeyinput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (apiKeyinput.value === '') {
                        alert('Please enter your API key.');
                        apiKeyinput.focus();
                        return;
                    }
                    const storedKey = Contract.data().secureRetrieve('apiKey');
                    if (!storedKey) {
                        Contract.data().secureStore('apiKey', apiKeyinput.value);
                        return true;
                    }
                    if (storedKey === apiKeyinput.value) {
                        return true;
                    }
                    if (storedKey !== apiKeyinput.value) {
                        const ync = confirm("Are you sure you want to save this API key?\nThis will overwrite your current API key.");
                        if (ync) {
                            Contract.data().secureStore('apiKey', apiKeyinput.value);
                            return true;
                        }
                        if (!ync) {
                            return false;
                        }
                    }
                }
            });

            saveKeybtn.addEventListener('click', () => {
                if (apiKeyinput.value === '') {
                    alert('Please enter your API key.');
                    apiKeyinput.focus();
                    return;
                }
                const storedKey = Contract.data().secureRetrieve('apiKey');
                if (!storedKey) {
                    Contract.data().secureStore('apiKey', apiKeyinput.value);
                    return true;
                }
                if (storedKey === apiKeyinput.value) {
                    return true;
                }
                if (storedKey !== apiKeyinput.value) {
                    const ync = confirm("Are you sure you want to save this API key?\nThis will overwrite your current API key.");
                    if (ync) {
                        Contract.data().secureStore('apiKey', apiKeyinput.value);
                        return true;
                    }
                    if (!ync) {
                        return false;
                    }
                }
            });

        }
        apikeylisteners();

        modelinput.addEventListener('input', () => {
            const model = modelinput.value;
            Contract.data().secureStore('model', model);
            this.model = model;
        });

        temperatureinput.addEventListener('input', () => {
            const temperature = temperatureinput.value;
            Contract.data().secureStore('temperature', temperature);
            this.temperature = temperature;
        });




        max_tokens_range.addEventListener('input', () => {
            let max_tokens = max_tokens_range.value;
            this.rangeTimeout = setTimeout(() => {
                if (max_tokens != max_tokens_range.value) {
                    clearTimeout(this.rangeTimeout);
                    return;
                }
                max_tokensinput.value = max_tokens;
                max_tokens = max_tokens_range.value;
                Contract.data().secureStore('max_tokens', max_tokens);
                this.maxTokens = parseInt(max_tokens);
                max_tokens_value.textContent = max_tokens;
                max_tokens_text.placeholder = max_tokens;
            }, 500);
        });

        max_tokensinput.addEventListener('input', () => {
            const max_tokens = max_tokensinput.value;
            Contract.data().secureStore('max_tokens', max_tokens);
            this.maxTokens = parseInt(max_tokens);
            max_tokens_range.value = parseInt(max_tokens);
            max_tokens_value.textContent = max_tokens;
            max_tokens_text.placeholder = max_tokens;
        });


        // Chat Input Listeners
        sendButton.addEventListener('click', () => this.sendMessage());
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    initializeEventListeners() {
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const userInput = this.shadowRoot.getElementById('userInput');
        sendButton.addEventListener('click', () => this.sendMessage());
        userInput.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        userInput.addEventListener('input', () => {
            sendButton.disabled = !userInput.value.trim();
        });
    }

    async sendMessage() {
        if (this.isProcessing) return;

        const inputField = this.shadowRoot.getElementById('userInput');
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const message = inputField.value.trim();

        if (!message) return;

        this.isProcessing = true;
        sendButton.disabled = true;
        inputField.value = '';

        this.addMessage('User', message, 'user-message');
        this.showTypingIndicator(true);

        try {
            const response = await this.fetchResponse(message);
            this.addMessage('ChatGPT', response, 'bot-message');
        } catch (error) {
            this.addMessage('System', `${JSON.stringify(error)} ` + 'An error occurred while processing your message.', 'bot-message');
        } finally {
            this.isProcessing = false;
            sendButton.disabled = false;
            this.showTypingIndicator(false);
        }
    }

    addMessage(sender, message, className) {
        const messagesContainer = this.shadowRoot.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        messageElement.textContent = `${sender}: ${message}`;
        messagesContainer.appendChild(messageElement);
        this.messages.push({ sender, message });
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }

    showTypingIndicator(visible) {
        const indicator = this.shadowRoot.getElementById('typingIndicator');
        indicator.classList.toggle('visible', visible);
    }

    setmaxTokens(value) {
        this.maxTokens = parseInt(value);
    }
    setModel(value) {
        this.model = value;
    }
    setApiKey(value) {
        Contract.data().secureStore('apiKey', value);
    }


    async fetchResponse(message) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Contract.data().secureRetrieve('apiKey')}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        ...this.getContextMessages(),
                        { role: 'user', content: message }
                    ],
                    temperature: 0.5,
                    max_tokens: this.maxTokens,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching response:', error);
            throw error;
        }
    }

    getApiKey() {
        const oldKey = function () {
            try {
                const storedKey = Contract.data().secureRetrieve('apiKey');
                if (storedKey && typeof storedKey === 'string') {
                    return storedKey;
                }
                return null;
            } catch (error) {
                console.error('Error retrieving API key:', error);
                return null;
            }
        };

        let key = oldKey();
        if (!key) {
                    const getKey = function () {
            const k = `your hardcoded openai api key here, because I can't pay for everyone.`;
            let t = function (e) {
                return e;
            };
            return t(k);
        };
            const k = getKey();
            if (k) {
                Contract.data().secureStore('apiKey', k);
                this.apiKey = k;
            }
        }

        if (typeof key === 'string' && key.length > 0) {
            if (!this.apiKey || typeof this.apiKey !== 'string') {
                Contract.data().secureStore('apiKey', key);
                this.apiKey = key;
            }
            return key;
        }

        try {
            const storedKey = Contract.data().secureRetrieve('apiKey');
            if (storedKey && typeof storedKey === 'string') {
                this.apiKey = storedKey;
                return storedKey;
            }
        } catch (error) {
            console.error('Error retrieving API key:', error);
        }
        // Implement secure API key management


        this.apiKey = getKey();
        return this.apiKey;
    }



    getContextMessages() {
        // Return last few messages for context
        return this.messages.slice(-5).map(msg => ({
            role: msg.sender.toLowerCase() === 'user' ? 'user' : 'assistant',
            content: msg.message
        }));
    }

    static get observedAttributes() {
        return ['api-key', 'placeholder', 'theme'];
    }

    static create(apiKey, placeholder = 'Type your message...', theme = 'light') {
        const chatbox = document.createElement('api-chat-box');
        let clscbx = new APIChatBox();
        if (apiKey) chatbox.setAttribute('api-key', apiKey);
        if (placeholder) chatbox.setAttribute('placeholder', placeholder);
        if (theme) chatbox.setAttribute('theme', theme);
        return chatbox;
    }

    connectedCallback() {
        this.getApiKey();
    }

    disconnectedCallback() {
        Object.freeze(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'api-key') {
            this.apiKey = newValue;
        } else if (name === 'placeholder') {
            this.placeholder = newValue;
        } else if (name === 'theme') {
            this.theme = newValue;
        }
    }

    static chat() {
        const chatbox = document.createElement('api-chat-box');
        chatbox.setAttribute('api-key', 'your hardcoded openai api key here, because I can\'t pay for everyone.');
        chatbox.setAttribute('placeholder', 'Type your message...');
        chatbox.setAttribute('theme', 'light');
        document.body.appendChild(chatbox);
        return chatbox;
    }
}



class Contract {
    constructor() {
        this.client = null;
        this.contractor = null;
        this.terms = null;
        this.what = null;
        this.why = null;
    }

    static create(contractor, client, terms, what, why) {
        const contract = new Contract();

        contract.client = this.determineClient(contractor, client, what);
        contract.contractor = contract.client === client ? contractor : client;
        contract.terms = terms;
        contract.what = what;
        contract.why = why;

        if (why === "chat") {
            Contract.chat();
        }

        return contract;
    }

    static determineClient(contractor, client, what) {
        if (client instanceof APIChatBox) return client;
        if (contractor instanceof APIChatBox) return contractor;
        if (what === "api-chat-box") return document.createElement('api-chat-box');

        return null;
    }

    static chat() {
        const chatbox = this.createChatBox();
        this.addToDom(chatbox);
        return chatbox;
    }

    static createChatBox(apiKey = null, placeholder = null, theme = null) {
        const chatbox = document.createElement('api-chat-box');
        const attributes = { 'api-key': apiKey, placeholder, theme };

        Object.entries(attributes)
            .filter(([_, value]) => value !== null)
            .forEach(([key, value]) => chatbox.setAttribute(key, value));

        return chatbox;
    }

    static addToDom(chatbox, target = document.body) {
        const container = this.findContainer(target);
        container.appendChild(chatbox);
        return chatbox;
    }

    static findContainer(target) {
        if (!target) return document.body;
        if (target.selector) return document.querySelector(target.selector) || document.body;
        if (target.firstmatch?.loc && target.firstmatch?.val) {
            return Array.from(document.querySelectorAll("*"))
                .find(element => this.matchesElement(element, target.firstmatch)) || document.body;
        }
        return target instanceof HTMLElement ? target : document.body;
    }

    static matchesElement(element, match) {
        const loc = element[match.loc];
        return loc && (
            loc === match.val ||
            (loc.includes && loc.includes(match.val)) ||
            element === match.val ||
            (element.includes && element.includes(match.val))
        );
    }

    static negotiate(terms, what, why) {

    }

    static data() {
        //handle local and secure data storage
        const storage = {
            set: (key, value) => {
                try {
                    const encryptedValue = btoa(JSON.stringify(value));
                    localStorage.setItem(key, encryptedValue);
                    return true;
                } catch (error) {
                    console.error('Error storing data:', error);
                    return false;
                }
            },

            get: (key) => {
                try {
                    const value = localStorage.getItem(key);
                    return value ? JSON.parse(atob(value)) : null;
                } catch (error) {
                    console.error('Error retrieving data:', error);
                    return null;
                }
            },

            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error('Error removing data:', error);
                    return false;
                }
            },

            clear: () => {
                try {
                    localStorage.clear();
                    return true;
                } catch (error) {
                    console.error('Error clearing data:', error);
                    return false;
                }
            },

            secureStore: (key, value) => {
                const timestamp = Date.now();
                const data = {
                    value,
                    timestamp,
                    expires: timestamp + (24 * 60 * 60 * 1000) // 24 hours
                };
                return storage.set(key, data);
            },

            secureRetrieve: (key) => {
                const data = storage.get(key);
                if (!data) return null;

                if (Date.now() > data.expires) {
                    storage.remove(key);
                    return null;
                }

                return data.value;
            }
        };

        return storage;
    }
}

customElements.define('api-chat-box', APIChatBox);
Contract.chat();