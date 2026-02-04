# Project Structure

This repository contains the AIsHelpMe UserScript - a consensus bridge between Gemini and ChatGPT.

## 📁 File Organization

```
AIsHelpMe/
│
├── ais-help-me.user.js     # Main Tampermonkey UserScript (Core Implementation)
│   └── Contains all logic for the 3-step consensus workflow
│
├── README.md               # Project overview and comprehensive guide
│   ├── Overview and features
│   ├── Installation instructions
│   ├── Complete usage guide
│   ├── Troubleshooting
│   └── License information
│
├── QUICKSTART.md          # Fast-track guide for new users
│   └── Get started in 5 minutes
│
├── INSTALLATION.md        # Detailed installation instructions
│   ├── Step-by-step Tampermonkey setup
│   ├── Script installation methods
│   ├── Troubleshooting installation issues
│   └── Updating and uninstalling
│
├── EXAMPLES.md            # Usage examples and workflow visualization
│   ├── Complete workflow example with real prompts
│   ├── Multiple use-case scenarios
│   ├── Workflow diagram
│   └── Best practices and tips
│
├── CONTRIBUTING.md        # Developer guide
│   ├── How to contribute
│   ├── Development setup
│   ├── Code style guidelines
│   ├── Architecture overview
│   └── Debugging tips
│
├── .gitignore            # Git ignore rules
│   └── Excludes temporary files, IDE configs, etc.
│
└── LICENSE               # MIT License

```

## 🎯 Quick Navigation

**For Users:**
- 🚀 New here? Start with [QUICKSTART.md](QUICKSTART.md)
- 📖 Want details? Read [README.md](README.md)
- 💡 Need examples? Check [EXAMPLES.md](EXAMPLES.md)
- 🛠️ Installation help? See [INSTALLATION.md](INSTALLATION.md)

**For Developers:**
- 🤝 Want to contribute? Read [CONTRIBUTING.md](CONTRIBUTING.md)
- 🔧 Main code: [ais-help-me.user.js](ais-help-me.user.js)
- 📄 License: [LICENSE](LICENSE)

## 🧩 Core Components

### UserScript Architecture

The `ais-help-me.user.js` file contains:

1. **Configuration** (Lines ~23-54)
   - Storage keys
   - State definitions
   - DOM selectors
   - Timing delays

2. **Utility Functions** (Lines ~56-118)
   - Logging
   - Platform detection
   - Element waiting

3. **Storage Layer** (Lines ~120-168)
   - GM_storage wrappers
   - State management
   - Data persistence

4. **UI Components** (Lines ~170-250)
   - Status indicator
   - Control panel
   - Visual feedback

5. **Content Handlers** (Lines ~252-360)
   - Response extraction
   - Text insertion
   - DOM manipulation

6. **Workflow Functions** (Lines ~362-485)
   - Draft phase handler
   - Critique phase handler
   - Finalize phase handler

7. **Event System** (Lines ~487-560)
   - Gemini listeners
   - ChatGPT listeners
   - Cross-tab sync

8. **Initialization** (Lines ~562-600)
   - Platform detection
   - Event setup
   - State recovery

## 🔄 Workflow Overview

```
User → Gemini (Draft) → Storage → ChatGPT (Critique) → Storage → Gemini (Final) → User
```

### Data Flow

1. **Draft Phase**:
   ```
   User Input → Gemini Response → extractGeminiResponse() 
   → setDraft() → GM_storage['ais_draft']
   ```

2. **Critique Phase**:
   ```
   GM_storage['ais_draft'] → getDraft() → insertTextIntoChatGPT() 
   → ChatGPT Response → extractChatGPTResponse() 
   → setCritique() → GM_storage['ais_critique']
   ```

3. **Finalize Phase**:
   ```
   GM_storage['ais_draft' + 'ais_critique'] → getDraft() + getCritique() 
   → insertTextIntoGemini() → Gemini Response → Final Answer
   ```

## 🛠️ Technical Details

### Dependencies
- **Runtime**: Browser with Tampermonkey extension
- **APIs Used**: 
  - `GM_setValue` / `GM_getValue` - Cross-tab storage
  - `GM_addValueChangeListener` - Real-time sync
  - `MutationObserver` - DOM change detection

### Browser Compatibility
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Supported Platforms
- ✅ Google Gemini (gemini.google.com)
- ✅ ChatGPT (chatgpt.com, chat.openai.com)

## 📊 Size & Performance

| Metric | Value |
|--------|-------|
| Script Size | ~19 KB |
| Initialization Time | ~2 seconds |
| Memory Footprint | <5 MB |
| Storage Used | <100 KB per session |

## 🔐 Security

- ✅ No external network requests
- ✅ No data collection or telemetry
- ✅ No third-party dependencies
- ✅ Open source and auditable
- ✅ Uses browser's local storage only

## 📝 Version History

### v1.0.0 (Initial Release)
- ✨ Three-step consensus workflow
- 🔄 Cross-tab synchronization via GM_storage
- 🎨 Visual UI indicators
- 🛠️ Control panel for workflow management
- 📖 Comprehensive documentation

## 🚀 Future Enhancements

Potential improvements (see CONTRIBUTING.md for how to help):
- Support for additional AI platforms (Claude, Perplexity, etc.)
- Customizable critique prompts
- Multiple critique rounds
- Export consensus results
- Workflow templates
- History tracking

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Credits

Created with ❤️ by [KangHyeonSeok](https://github.com/KangHyeonSeok)

For the AI community to leverage multiple LLMs through collaborative consensus.
