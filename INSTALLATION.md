# Installation Guide

## Quick Start (5 minutes)

### Step 1: Install Tampermonkey

Choose your browser and install the Tampermonkey extension:

| Browser | Installation Link |
|---------|------------------|
| 🌐 Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| 🦊 Firefox | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) |
| 🔷 Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| 🧭 Safari | [App Store](https://apps.apple.com/app/tampermonkey/id1482490089) |
| 🎭 Opera | [Opera Add-ons](https://addons.opera.com/extensions/details/tampermonkey-beta/) |

### Step 2: Install AIsHelpMe Script

#### Method 1: Direct Install (Recommended)
1. Go to the [ais-help-me.user.js](./ais-help-me.user.js) file in this repository
2. Click the "Raw" button
3. Tampermonkey will automatically detect it and show an installation page
4. Click "Install" button

#### Method 2: Manual Install
1. Click the Tampermonkey icon in your browser toolbar
2. Select "Create a new script..."
3. Delete the default template code
4. Copy all content from [ais-help-me.user.js](./ais-help-me.user.js)
5. Paste it into the editor
6. Save (File → Save or Ctrl+S / Cmd+S)

### Step 3: Verify Installation

1. Open [Gemini](https://gemini.google.com) or [ChatGPT](https://chatgpt.com)
2. Look for the "AIsHelpMe Control" panel in the bottom-right corner
3. If you see it, installation was successful! 🎉

## Detailed Setup Instructions

### Configuring Tampermonkey (Optional)

For optimal performance, you can adjust these Tampermonkey settings:

1. Click Tampermonkey icon → Dashboard
2. Go to Settings tab
3. Recommended settings:
   - **Config mode**: Advanced
   - **Script Update**: Check for updates automatically (Daily)
   - **Inject Mode**: Instant

### Granting Permissions

The script requires these permissions to function:

- ✅ `GM_setValue` / `GM_getValue` - For cross-tab data storage
- ✅ `GM_deleteValue` - For cleaning up after workflow completion  
- ✅ `GM_addValueChangeListener` - For real-time sync between tabs

These are automatically granted when you install the script.

## Updating the Script

### Automatic Updates

If you installed via "Direct Install" method:
1. Tampermonkey checks for updates automatically
2. Updates are applied when you restart your browser

### Manual Updates

If you installed via "Manual Install":
1. Open Tampermonkey Dashboard
2. Find "AIsHelpMe" script
3. Click the Edit icon (pencil)
4. Replace all content with the new version
5. Save the file

## Uninstalling

### Remove the Script

1. Click Tampermonkey icon → Dashboard
2. Find "AIsHelpMe - Gemini & ChatGPT Consensus Bridge"
3. Click the trash icon
4. Confirm deletion

### Remove Tampermonkey (Optional)

If you want to completely remove Tampermonkey:

1. Go to your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Firefox: `about:addons`
   - Edge: `edge://extensions`
   - Safari: Safari → Preferences → Extensions

2. Find Tampermonkey
3. Click "Remove" or "Uninstall"

## Troubleshooting Installation

### Script Not Appearing

**Problem**: Control panel doesn't show up on Gemini/ChatGPT

**Solutions**:
1. ✅ Verify Tampermonkey is installed and enabled
2. ✅ Check that the script is enabled in Tampermonkey Dashboard
3. ✅ Refresh the Gemini/ChatGPT page (Ctrl+R / Cmd+R)
4. ✅ Clear browser cache and reload
5. ✅ Check browser console (F12) for error messages

### Permission Errors

**Problem**: Script shows "Permission denied" errors

**Solutions**:
1. ✅ Reinstall the script (this resets permissions)
2. ✅ Check Tampermonkey settings: Config mode should be "Advanced"
3. ✅ Ensure you're on the correct domains (gemini.google.com or chatgpt.com)

### Script Conflicts

**Problem**: Script interferes with other Tampermonkey scripts

**Solutions**:
1. ✅ Temporarily disable other scripts one-by-one to find conflicts
2. ✅ Check if other scripts also modify Gemini/ChatGPT interfaces
3. ✅ Adjust script execution order in Tampermonkey Dashboard

### Browser Compatibility

**Minimum Browser Versions**:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+
- Opera 76+

If using an older browser:
1. Update to the latest version
2. Or use a supported browser

## Additional Resources

- 📖 [User Guide](./README.md#usage-guide) - Learn how to use the script
- 🐛 [Troubleshooting](./README.md#troubleshooting) - Common issues and solutions
- 💬 [GitHub Issues](../../issues) - Report bugs or request features

## Security Note

This script:
- ✅ Only runs on Gemini and ChatGPT domains
- ✅ Does not send data to external servers
- ✅ Uses local browser storage only
- ✅ Open source and auditable

Always review UserScript code before installation for your security!
