# Contributing to AIsHelpMe

Thank you for considering contributing to AIsHelpMe! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title**: Describe the issue in one line
2. **Description**: What happened vs. what you expected
3. **Steps to reproduce**: Detailed steps to recreate the issue
4. **Environment**:
   - Browser and version
   - Tampermonkey version
   - OS
5. **Console logs**: Include relevant console output (look for `[AIsHelpMe]` prefix)
6. **Screenshots**: If applicable

### Suggesting Enhancements

For feature requests or enhancements:

1. **Check existing issues**: Someone may have already suggested it
2. **Provide use case**: Explain why this feature would be useful
3. **Describe the solution**: How you envision it working
4. **Consider alternatives**: Are there other ways to achieve this?

### Pull Requests

We welcome pull requests! Here's how:

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+ (for linting/formatting tools - optional)
- A modern browser with Tampermonkey installed
- Text editor (VS Code, Sublime Text, etc.)

### Local Development

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AIsHelpMe.git
   cd AIsHelpMe
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/my-bug-fix
   ```

4. **Install development tools** (optional)
   ```bash
   npm install -g eslint prettier
   ```

### Making Changes

1. **Edit the UserScript**
   - Main file: `ais-help-me.user.js`
   - Test your changes by updating the script in Tampermonkey

2. **Test thoroughly**
   - Test on both Gemini and ChatGPT
   - Test all three workflow phases
   - Test error conditions
   - Test cross-tab synchronization

3. **Update documentation**
   - Update README.md if behavior changes
   - Update EXAMPLES.md if adding features
   - Add inline comments for complex code

4. **Follow code style**
   - Use consistent indentation (4 spaces)
   - Add meaningful comments
   - Use descriptive variable names
   - Follow existing code patterns

### Testing Checklist

Before submitting a PR, verify:

- [ ] Script loads without errors on Gemini
- [ ] Script loads without errors on ChatGPT
- [ ] Control panel appears correctly
- [ ] Draft phase works (Gemini → storage)
- [ ] Critique phase works (storage → ChatGPT → storage)
- [ ] Finalize phase works (storage → Gemini)
- [ ] Status indicators update correctly
- [ ] Reset button clears storage
- [ ] Cross-tab communication works
- [ ] No console errors during normal operation
- [ ] Works on multiple browser (if possible)

## 📝 Code Style Guidelines

### JavaScript Style

```javascript
// ✅ Good: Clear, descriptive names
function extractGeminiResponse() {
    const response = document.querySelector('.response-text');
    return response ? response.textContent.trim() : null;
}

// ❌ Bad: Unclear, abbreviated names
function getResp() {
    const r = document.querySelector('.response-text');
    return r ? r.textContent.trim() : null;
}
```

### Comments

```javascript
// ✅ Good: Explain WHY, not WHAT
// Wait for the response to be fully rendered before extracting
setTimeout(() => extractResponse(), 2000);

// ❌ Bad: States the obvious
// Set timeout to 2000ms
setTimeout(() => extractResponse(), 2000);
```

### Error Handling

```javascript
// ✅ Good: Graceful degradation with logging
function insertText(text) {
    try {
        const element = document.querySelector('#input');
        if (!element) {
            log('Input element not found');
            showStatus('⚠ Could not insert text automatically', 3000);
            return false;
        }
        element.value = text;
        return true;
    } catch (error) {
        log('Error inserting text:', error);
        return false;
    }
}

// ❌ Bad: Silent failures
function insertText(text) {
    document.querySelector('#input').value = text;
}
```

## 🏗️ Architecture Overview

### File Structure

```
AIsHelpMe/
├── ais-help-me.user.js    # Main UserScript
├── README.md              # Overview and usage guide
├── INSTALLATION.md        # Installation instructions
├── EXAMPLES.md            # Usage examples and workflow
├── CONTRIBUTING.md        # This file
└── LICENSE                # MIT License
```

### Script Architecture

```
UserScript
├── Configuration (CONFIG object)
├── Utility Functions
│   ├── Logging
│   ├── Platform Detection
│   └── Element Waiting
├── Storage Layer (GM_storage wrappers)
│   ├── State Management
│   ├── Draft Storage
│   ├── Critique Storage
│   └── Prompt Storage
├── UI Layer
│   ├── Status Indicator
│   └── Control Panel
├── Content Extraction
│   ├── Gemini Response Extractor
│   └── ChatGPT Response Extractor
├── Content Insertion
│   ├── Gemini Text Inserter
│   └── ChatGPT Text Inserter
├── Workflow Handlers
│   ├── Draft Handler (Gemini)
│   ├── Critique Handler (ChatGPT)
│   └── Finalize Handler (Gemini)
├── Event Listeners
│   ├── Gemini Listeners
│   └── ChatGPT Listeners
└── Initialization
```

### State Flow

```
IDLE → WAITING_FOR_DRAFT → WAITING_FOR_CRITIQUE → WAITING_FOR_FINAL → IDLE
  ↑                                                                      ↓
  └──────────────────────────────────────────────────────────────────────┘
```

## 🎯 Common Development Tasks

### Adding Support for New Selectors

If Gemini or ChatGPT updates their UI:

1. Open browser DevTools (F12)
2. Inspect the response element
3. Find the most stable selector (prefer data attributes)
4. Update `CONFIG.SELECTORS` in the script
5. Test thoroughly

Example:
```javascript
SELECTORS: {
    GEMINI: {
        response: [
            '.model-response-text',      // Primary
            '[data-response-chunk]',     // Fallback 1
            '.response-container-content' // Fallback 2
        ]
    }
}
```

### Improving Cross-Tab Communication

Current: Uses GM_storage with value change listeners

To enhance:
1. Add message queuing for reliability
2. Implement heartbeat mechanism
3. Add timeout handling
4. Consider BroadcastChannel API as fallback

### Adding New Features

1. **Plan**: Document the feature clearly
2. **Design**: How does it fit into existing workflow?
3. **Implement**: Write minimal, focused code
4. **Test**: Ensure it doesn't break existing features
5. **Document**: Update relevant documentation

## 🐛 Debugging Tips

### Enable Verbose Logging

The script uses a `log()` function. All logs are prefixed with `[AIsHelpMe]`.

To see logs:
1. Open DevTools (F12)
2. Go to Console tab
3. Filter for "AIsHelpMe"

### Check Storage State

To inspect GM_storage:
1. Click Tampermonkey icon
2. Select the script
3. Go to Storage tab
4. View current values

### Test Workflow Steps Individually

```javascript
// In console, test storage:
GM_setValue('ais_state', 'waiting_for_draft');
GM_getValue('ais_state');

// Test extraction:
extractGeminiResponse();

// Test insertion:
insertTextIntoGemini('test text');
```

## 📚 Resources

### UserScript Development
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [Greasemonkey Manual](https://wiki.greasespot.net/Greasemonkey_Manual:API)
- [UserScript.zone](https://userscript.zone/)

### Web APIs
- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage)
- [Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

### Tools
- [Selector Gadget](https://selectorgadget.com/) - Find CSS selectors easily
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Acknowledgments

Thank you for making AIsHelpMe better!

## ❓ Questions?

- 💬 Open a [Discussion](../../discussions)
- 🐛 Report an [Issue](../../issues)
- 📧 Contact the maintainer

---

**Happy Contributing! 🚀**
