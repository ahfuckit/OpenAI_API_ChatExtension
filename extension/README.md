# GPT Chatbox Browser Extension

A browser extension that provides a customizable ChatGPT interface using OpenAI's API. The extension adds a popup chat interface through a custom `<api-chat-box>` web component.

## Features

- Clean and modern chat interface
- Customizable themes (Light/Dark/System/Custom)
- Configurable API settings:
  - OpenAI API key management
  - Model selection
  - Temperature control
  - Token limit adjustment
- Chat history management
- Responsive design
- Secure data storage

## Usage

1. Install the extension
2. Click the extension icon to open the chat popup
3. Enter your OpenAI API key in Settings
4. Start chatting with GPT!

## Technical Details

The extension is built using:
- Custom Elements v1 API
- Shadow DOM for encapsulation
- OpenAI Chat Completions API
- Secure local storage for API keys

### APIChatBox Component

The `<api-chat-box>` custom element provides:

```javascript
// Create a new chat instance
Contract.chat()

// Create with custom settings
APIChatBox.create(apiKey, placeholder, theme)

{
  apiKey: "your-openai-key",
  model: "gpt-4o-mini", 
  temperature: 0.7,
  maxTokens: 250,
  theme: "light|dark|system|custom"
}

Installation
Clone the repository
Load the unpacked extension in Chrome:
Go to chrome://extensions/
Enable Developer mode
Click "Load unpacked"
Select the extension directory
Files
manifest.json - Extension configuration
popup.html - Extension popup interface
chatgptchatbox.js - Main component implementation
License
Copyright © 2024 CSingendonk