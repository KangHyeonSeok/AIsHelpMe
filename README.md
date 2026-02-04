# AIsHelpMe 🤖✨

> **Zero-cost consensus bridge between Gemini and ChatGPT for multi-LLM synergy**

## ⚠️ Important Disclaimer

> **🔬 Experimental Tool Notice**
> 
> This project is an **experimental tool** that relies on browser automation of third-party services (Google Gemini and ChatGPT). Please be aware:
> 
> - **UI Changes May Break Functionality**: This tool interacts with web interfaces that can change at any time. Even minor updates to CSS class names, HTML structure, or page layouts by Google or OpenAI may cause the script to stop working without notice.
> - **Educational Purpose**: This tool is intended for **learning and experimental purposes only**. 
> - **Terms of Service Compliance**: Users are solely responsible for ensuring their use of this tool complies with the Terms of Service of Google Gemini, ChatGPT, and any other services involved.
> - **No Warranty**: This software is provided "as-is" under the MIT License. The authors and contributors assume no liability for any issues arising from its use.
> 
> By using this tool, you acknowledge and accept these limitations and responsibilities.

## 📖 Overview

AIsHelpMe is a Tampermonkey UserScript that creates a seamless, zero-cost consensus bridge between Google Gemini and ChatGPT. It orchestrates a three-step workflow where both AI models collaborate to produce better answers through peer review and synthesis.

### ✨ Features

- **🔄 Automated Workflow**: Three-step process (Draft → Critique → Finalize) runs automatically
- **💾 Cross-Tab Syncing**: Uses `GM_storage` for seamless communication without focus switching
- **🎨 Visual Feedback**: Built-in UI indicators show workflow status in real-time
- **🔒 Privacy-First**: All processing happens locally in your browser - no external servers
- **⚡ Zero Cost**: No API keys required, works with free web interfaces

## 🚀 Installation

### Prerequisites

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)

### Install the UserScript

1. Click on the Tampermonkey icon in your browser
2. Select "Create a new script..."
3. Copy the contents of `ais-help-me.user.js` and paste it into the editor
4. Save the script (Ctrl+S or Cmd+S)

**Or** directly install by clicking on the raw `.user.js` file in this repository - Tampermonkey will detect it automatically.

## 📋 How It Works

The workflow operates in three distinct phases:

### 1️⃣ **Draft Phase** (Gemini)
- User submits a prompt to Gemini
- Script automatically captures Gemini's initial response
- Saves the draft to cross-tab storage

### 2️⃣ **Critique Phase** (ChatGPT)
- Switch to ChatGPT tab
- Script auto-pastes the draft with a critique request
- ChatGPT provides structured feedback on accuracy, completeness, and clarity
- Critique is saved to storage

### 3️⃣ **Finalize Phase** (Gemini)
- Return to Gemini tab
- Script sends the critique back to Gemini
- Gemini synthesizes both perspectives into an improved final answer

## 🎯 Usage Guide

### Step-by-Step Instructions

1. **Open Gemini** (`https://gemini.google.com`)
   - You'll see the "AIsHelpMe Control" panel in the bottom-right corner

2. **Start the Workflow**
   - Click the "Start Consensus Flow" button
   - A status indicator will appear: "✓ Consensus flow activated!"

3. **Submit Your Prompt**
   - Type your question in Gemini's input box
   - Submit it normally
   - Wait for Gemini's response to complete
   - Status will update: "✓ Draft captured! Now open ChatGPT tab."

4. **Switch to ChatGPT** (`https://chatgpt.com` or `https://chat.openai.com`)
   - The script automatically prepares a critique request
   - Status shows: "✓ Critique request ready! Click Send button."
   - Click the Send button to submit
   - Wait for ChatGPT's critique
   - Status updates: "✓ Critique captured! Return to Gemini tab."

5. **Return to Gemini**
   - The script prepares the final synthesis prompt
   - Status shows: "✓ Final synthesis request ready! Click Send."
   - Click Send to get the improved answer
   - Status completes: "✅ Consensus flow complete!"

### Tips for Best Results

- 🕐 **Be Patient**: Allow each AI to complete its response before moving to the next step
- 🔄 **Multiple Tabs**: Keep both Gemini and ChatGPT tabs open throughout the workflow
- 🎯 **Clear Prompts**: Start with well-defined questions for better consensus
- 🔁 **Reset When Needed**: Use the "Reset" button if the workflow gets stuck

## 🎨 UI Elements

### Control Panel (Bottom-Right)
- **Start Consensus Flow**: Initiates the three-step workflow
- **Reset**: Clears all stored data and resets the workflow state

### Status Indicator (Top-Right)
- Shows real-time workflow progress
- Provides next-step instructions
- Auto-hides when not in use

## 🛠️ Technical Details

### Architecture
- **Platform**: Tampermonkey UserScript (JavaScript)
- **Storage**: GM_storage API for cross-tab synchronization
- **Compatibility**: Works on Gemini and ChatGPT web interfaces

### Supported Sites
- `https://gemini.google.com/*`
- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

### State Management
The script uses four states:
- `IDLE`: No active workflow
- `WAITING_FOR_DRAFT`: Listening for Gemini's initial response
- `WAITING_FOR_CRITIQUE`: Ready to send to ChatGPT for critique
- `WAITING_FOR_FINAL`: Ready for Gemini's final synthesis

## 🐛 Troubleshooting

### Workflow Not Starting
- Ensure you're on the Gemini page when clicking "Start Consensus Flow"
- Refresh the page and try again
- Check that Tampermonkey is enabled

### Text Not Auto-Inserting
- Some sites may update their HTML structure
- You can manually copy/paste the prompts shown in the status indicator
- Check browser console for detailed logs (prefix: `[AIsHelpMe]`)

### Status Stuck
- Click the "Reset" button in the control panel
- Clear storage manually via Tampermonkey's storage viewer
- Restart the workflow from step 1

## 🔐 Privacy & Security

- **No External Servers**: All processing happens in your browser
- **No Data Collection**: Script doesn't send data anywhere
- **Open Source**: Full code is available for review
- **Local Storage Only**: Uses browser's local storage via GM_storage API

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review browser console logs (look for `[AIsHelpMe]` prefix)
3. Open an issue on GitHub

## 🎉 Acknowledgments

Built with ❤️ for the AI community to leverage multiple LLMs for better answers through collaborative consensus.
