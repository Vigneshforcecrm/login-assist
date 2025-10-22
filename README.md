# Salesforce OAuth Assistant - Chrome Extension

Secure Chrome extension for managing Salesforce orgs with OAuth 2.0 authentication. No passwords stored - uses OAuth tokens for secure access.

## Features

✅ **OAuth 2.0 Authentication** - Secure login without storing passwords
✅ **Multiple Org Support** - Manage production and sandbox orgs
✅ **Encrypted Storage** - AES-256 encryption with master password
✅ **Auto Token Refresh** - Seamless re-authentication
✅ **Quick Access** - One-click login from extension popup
✅ **Content Script Integration** - Quick access on Salesforce login pages

## Installation

### 1. Build the Extension

```bash
npm install
npm run build
```

### 2. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project

### 3. Configure OAuth (Required)

The extension needs OAuth credentials from Salesforce Connected App:

1. **In Salesforce:**
   - Go to Setup → App Manager
   - Click "New Connected App"
   - Fill in basic information (name, email)
   - Enable OAuth Settings
   - Use callback URL: `https://<extension-id>.chromiumapp.org/`
     (Get this from the extension's OAuth Setup tab)
   - Select OAuth scopes: `api`, `web`, `refresh_token`
   - Save and note the Consumer Key and Secret

2. **In Extension:**
   - Click extension icon → Settings
   - Go to "OAuth Setup" tab
   - Enter Consumer Key: `3MVG9PwZx9R6_Urdu_8Q5G0JlxXoog.3CrPg8_P4lH22OZ_lAugI.5C3z6tpz2QAfpeMeKKsyeYDXQHohQIH7`
   - Enter Consumer Secret: `06A0AA77D4EED4A66D84EFB9E42DC08844A9B10F62531FC0F62DD8E7C50F4CF1`
   - Save configuration for Production and/or Sandbox

## Usage

### First Time Setup

1. **Set Master Password:**
   - Open extension options (Settings)
   - Enter a strong master password (min 6 characters)
   - This encrypts all stored data

2. **Add Org with OAuth:**
   - Go to "Organizations" tab
   - Select "OAuth" authentication method
   - Choose org type (Production/Sandbox)
   - Click "Connect with OAuth"
   - Complete Salesforce login
   - Org is saved automatically

### Daily Use

**From Extension Popup:**
- Click extension icon
- Click "Open" on any saved org
- Opens new tab and auto-logs you in

**From Salesforce Login Page:**
- Visit login.salesforce.com or test.salesforce.com
- Quick access panel appears in top right
- Click "Open" on any org

## Security

- **AES-256 Encryption**: All credentials encrypted with master password
- **Session-only Storage**: Master password never persisted to disk
- **OAuth Tokens**: No password storage when using OAuth
- **Auto Refresh**: Access tokens refreshed automatically before expiry
- **Revocation**: Revoke access anytime from settings

## Project Structure

```
src/
├── types/           # TypeScript interfaces
├── common/          # Crypto and OAuth utilities
├── background/      # Service worker (background.ts)
├── content/         # Content script for login pages
├── popup/           # Extension popup UI
└── options/         # Settings page UI
```

## Development

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## Technology Stack

- **TypeScript** - Type safety
- **React** - UI components
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **crypto-js** - Encryption
- **Chrome Extensions API** - Manifest V3

## Troubleshooting

**OAuth flow fails:**
- Verify Connected App callback URL matches extension ID
- Check OAuth scopes include `api`, `web`, `refresh_token`
- Ensure Connected App is approved for users

**Cannot decrypt orgs:**
- Master password may be incorrect
- Re-enter master password in settings

**Content script not appearing:**
- Refresh the Salesforce login page
- Check browser console for errors

**Token expired:**
- Tokens auto-refresh 5 minutes before expiry
- Manually refresh from "Organizations" tab if needed

## License

MIT License - Use freely for development and production

## Support

For issues or questions, please check:
- Chrome extension console for errors
- Background service worker console
- Salesforce Connected App configuration
