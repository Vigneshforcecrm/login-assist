# Installation & Testing Guide

## 📦 Installation Steps

### 1. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** toggle (top right corner)
4. Click **"Load unpacked"** button
5. Navigate to and select: `/app/dist` folder
6. The extension should now appear in your extensions list

### 2. Pin the Extension (Optional but Recommended)

1. Click the puzzle piece icon (🧩) in Chrome toolbar
2. Find "Salesforce OAuth Assistant"
3. Click the pin icon to keep it visible in toolbar

---

## 🔧 Initial Configuration

### Step 1: Set Master Password

1. Click the extension icon in Chrome toolbar
2. Click "Settings" button
3. You'll see the "Unlock Vault" screen
4. Enter a master password (minimum 6 characters)
   - Example: `MySecurePass123`
5. Click "Unlock"
6. ✅ You're now in the settings page

### Step 2: Configure OAuth Credentials

1. In the settings page, click the **"🔐 OAuth Setup"** tab
2. You'll see setup instructions with the callback URL

#### For Production Orgs:

3. In the **"🏢 Production Orgs"** section:
   - **Consumer Key (Client ID)**: Paste your provided key:
     ```
     3MVG9PwZx9R6_Urdu_8Q5G0JlxXoog.3CrPg8_P4lH22OZ_lAugI.5C3z6tpz2QAfpeMeKKsyeYDXQHohQIH7
     ```
   - **Consumer Secret**: Paste your provided secret:
     ```
     06A0AA77D4EED4A66D84EFB9E42DC08844A9B10F62531FC0F62DD8E7C50F4CF1
     ```
4. Click **"Save Production Config"**
5. You should see: `✓ prod OAuth config saved`

#### For Sandbox Orgs (Optional):

6. Repeat the same process in the **"🧪 Sandbox Orgs"** section if you have sandbox credentials
7. Click **"Save Sandbox Config"**

---

## 🎯 Adding Your First Org

### Method 1: OAuth (Recommended)

1. Go to **"🏢 Organizations"** tab
2. In the left sidebar form:
   - **Authentication Method**: Click "🔒 OAuth (Recommended)"
   - **Org Type**: Select "Production" or "Sandbox"
3. Click **"✨ Connect with OAuth"** button
4. A new window will open for Salesforce login
5. Log in with your Salesforce credentials
6. Approve the OAuth access
7. ✅ The window will close and the org will be added automatically

### Method 2: Password (Legacy)

1. Go to **"🏢 Organizations"** tab
2. Click "🔑 Password" authentication method
3. Fill in the form:
   - **Name**: My Production Org
   - **Username**: your-email@example.com
   - **Password**: your-password
   - **Instance URL**: https://your-domain.salesforce.com
   - **Org Type**: Production or Sandbox
   - **Append Security Token**: Check if you use security token
   - **Security Token**: Your token (if applicable)
4. Click **"Save"**

---

## ✅ Testing the Extension

### Test 1: View Saved Orgs in Popup

1. Click the extension icon in Chrome toolbar
2. You should see your saved org(s)
3. Each org shows:
   - Name
   - OAuth/Password badge
   - Production/Sandbox indicator
   - "Open" button

### Test 2: Quick Login via Popup

1. Click the extension icon
2. Click the **"Open"** button on any org
3. A new tab should open with Salesforce
4. You should be automatically logged in

### Test 3: Content Script on Login Page

1. Manually navigate to:
   - Production: `https://login.salesforce.com`
   - Sandbox: `https://test.salesforce.com`
2. A **"Quick Access"** panel should appear in the top-right corner
3. You should see your saved orgs for that environment
4. Click "Open" on any org to login

### Test 4: Token Management (OAuth Only)

1. Click extension icon → Settings
2. Go to **"🏢 Organizations"** tab
3. Find an OAuth org
4. Test the **"Refresh Token"** button
   - Should show: `✓ Token refreshed`
5. Check token expiry time updates

### Test 5: Security Features

1. Go to **"🔒 Security"** tab
2. Try **"Change Password"**:
   - Enter new master password
   - Data should be re-encrypted
   - You can still access orgs
3. Review security information displayed

---

## 🔍 Troubleshooting

### Extension Not Loading

**Issue**: Extension doesn't appear after loading unpacked
- ✅ Check `/app/dist` folder exists
- ✅ Verify manifest.json is in /app/dist/
- ✅ Look for errors in chrome://extensions/
- ✅ Try reloading the extension

### OAuth Flow Fails

**Issue**: OAuth window opens but doesn't work
- ✅ Check Consumer Key/Secret are correct
- ✅ Verify callback URL in Salesforce Connected App matches Chrome extension ID
- ✅ Ensure OAuth scopes include: `api`, `web`, `refresh_token`
- ✅ Check Salesforce Connected App is active and approved

### Cannot See Orgs in Popup

**Issue**: Popup shows "Open settings to unlock"
- ✅ Go to Settings and unlock with master password
- ✅ Master password must match what you set initially
- ✅ If forgotten, go to Security → Delete All Data (starts fresh)

### Content Script Not Appearing

**Issue**: Quick Access panel doesn't show on login pages
- ✅ Refresh the Salesforce login page
- ✅ Check browser console for errors (F12)
- ✅ Verify extension has host permissions for Salesforce domains
- ✅ Try reloading the extension in chrome://extensions/

### Auto-Login Not Working

**Issue**: Opens Salesforce but doesn't log in automatically
- ✅ For OAuth: Check token hasn't expired (should auto-refresh)
- ✅ For Password: Verify credentials are correct
- ✅ Check browser console for script injection errors
- ✅ Try the Refresh Token button for OAuth orgs

---

## 🎨 Visual Testing Checklist

- [ ] Extension icon appears in toolbar
- [ ] Popup opens with clean UI
- [ ] Settings page opens in new tab
- [ ] OAuth Setup shows callback URL
- [ ] Organizations tab shows form and list
- [ ] Security tab displays correctly
- [ ] Content script panel appears on login pages
- [ ] All buttons are clickable and responsive
- [ ] Success/error messages display properly
- [ ] Token expiry times are shown for OAuth orgs

---

## 📊 Expected Behavior Summary

### ✅ What Should Work:

1. **Popup**: Opens, shows orgs, "Open" button launches Salesforce
2. **OAuth Flow**: Opens Salesforce login, returns with token, saves org
3. **Password Login**: Fills credentials and submits automatically
4. **Token Refresh**: Updates access token before expiry
5. **Content Script**: Shows quick access on login pages
6. **Encryption**: All data encrypted with master password
7. **Session Storage**: Master password only in session memory

### ❌ Known Limitations:

- Master password is required each browser session
- OAuth requires valid Salesforce Connected App setup
- Content script only works on login.salesforce.com and test.salesforce.com
- Extension is Chrome-only (Manifest V3)

---

## 🚀 Advanced Testing

### Test OAuth Token Expiry

1. Add an OAuth org
2. Wait 2 hours (or change tokenExpiry in storage to past time)
3. Click "Open" on the org
4. Should auto-refresh token before opening

### Test Multiple Orgs

1. Add 3+ orgs (mix of prod/sandbox, OAuth/password)
2. Verify popup shows all orgs correctly
3. Test opening each one
4. Verify content script filters by environment

### Test Master Password Security

1. Lock browser (close all tabs)
2. Reopen extension
3. Should require master password again
4. Data should still be encrypted and accessible after unlock

---

## 📞 Getting Help

If you encounter issues:

1. **Check Browser Console**: Open DevTools (F12) and look for errors
2. **Check Background Service Worker**: 
   - Go to chrome://extensions/
   - Click "service worker" under the extension
   - View console logs
3. **Verify Build**: Ensure `/app/dist` contains all files
4. **Review Permissions**: Check manifest.json has all required permissions

---

## ✨ Success Criteria

Your extension is working correctly if:

✅ You can unlock the vault with master password
✅ OAuth flow completes and saves org
✅ Clicking "Open" logs you into Salesforce automatically
✅ Content script appears on Salesforce login pages
✅ Tokens refresh automatically before expiry
✅ All tabs (Orgs, OAuth Setup, Security) work properly

---

**🎉 Congratulations!** Your Salesforce OAuth Assistant extension is ready to use!
