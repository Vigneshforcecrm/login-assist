# ⚡ Quick Start Guide - 5 Minutes to First Login

Get up and running with the Salesforce OAuth Assistant in just 5 minutes!

---

## ✅ Prerequisites

Before starting, make sure you have:
- [ ] Chrome browser installed
- [ ] The `/app/dist` folder from this project
- [ ] OAuth credentials (Consumer Key & Secret)

---

## 🚀 Step-by-Step Setup (5 Minutes)

### ⏱️ Minute 1: Load Extension

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Toggle **"Developer mode"** (top right) → ON
4. Click **"Load unpacked"**
5. Select: `/app/dist` folder
6. ✅ Extension loaded!

**Visual Check**: You should see "Salesforce OAuth Assistant" in the list

---

### ⏱️ Minute 2: Set Master Password

1. Click the extension icon (🔵) in Chrome toolbar
2. Click **"Settings"** button
3. A new tab opens with "Unlock Vault" screen
4. Enter a master password (min 6 characters)
   ```
   Example: MySecurePass2025
   ```
5. Click **"Unlock"**
6. ✅ You're now in the settings page!

**Visual Check**: You should see three tabs: Organizations | OAuth Setup | Security

---

### ⏱️ Minute 3: Configure OAuth

1. Click the **"🔐 OAuth Setup"** tab
2. Scroll to **"🏢 Production Orgs"** section
3. **Paste Consumer Key:**
   ```
   3MVG9PwZx9R6_Urdu_8Q5G0JlxXoog.3CrPg8_P4lH22OZ_lAugI.5C3z6tpz2QAfpeMeKKsyeYDXQHohQIH7
   ```
4. **Paste Consumer Secret:**
   ```
   06A0AA77D4EED4A66D84EFB9E42DC08844A9B10F62531FC0F62DD8E7C50F4CF1
   ```
5. Click **"Save Production Config"**
6. ✅ You should see: `✓ prod OAuth config saved`

**Visual Check**: Green success message appears at top of page

---

### ⏱️ Minute 4: Add Your First Org

1. Click the **"🏢 Organizations"** tab
2. In the left sidebar form:
   - **Authentication Method**: Click "🔒 OAuth (Recommended)" (should be selected)
   - **Org Type**: Select "Production" from dropdown
3. Click the big green button: **"✨ Connect with OAuth"**
4. A new window opens with Salesforce login
5. Log in with your Salesforce credentials
6. Click "Allow" to approve access
7. Window closes automatically
8. ✅ You should see: `✓ Added Production Org`

**Visual Check**: Your org appears in the right panel with green [OAuth] badge

---

### ⏱️ Minute 5: Test One-Click Login

1. Click the extension icon (🔵) in Chrome toolbar
2. You should see your Production Org listed
3. Click the **"Open"** button
4. New tab opens
5. Salesforce loads
6. ✅ You're automatically logged in!

**Visual Check**: You should be on your Salesforce home page without entering credentials

---

## 🎉 Success!

**Congratulations!** You've successfully:
- ✅ Loaded the Chrome extension
- ✅ Set up your master password
- ✅ Configured OAuth credentials
- ✅ Added your first Salesforce org
- ✅ Tested one-click login

---

## 🎯 What's Next?

Now that you're set up, you can:

### Add More Orgs
- Repeat Minute 4 for sandbox orgs
- Or use password authentication for legacy orgs

### Use Quick Access
- Visit `login.salesforce.com`
- Look for the Quick Access panel (top right)
- Click "Open" to log in instantly

### Manage Tokens
- Go to Organizations tab
- Click "Refresh Token" to update tokens
- Click "Revoke" to remove OAuth access

### Explore Security
- Go to Security tab
- Change your master password
- Review encryption info
- Understand token management

---

## 🔄 Daily Workflow

Once set up, your daily workflow is simple:

```
1. Click extension icon
   ↓
2. Click "Open" on any org
   ↓
3. You're logged in! ✅
```

**Or:**

```
1. Visit login.salesforce.com
   ↓
2. Quick Access panel appears
   ↓
3. Click "Open" on any org
   ↓
4. You're logged in! ✅
```

---

## ⚡ Keyboard Shortcuts

| Action | Method |
|--------|--------|
| Open extension | Click icon in toolbar |
| Open settings | Click "Settings" in popup |
| Unlock vault | Enter password + Enter key |
| Add org via OAuth | Click "Connect with OAuth" |
| Quick login | Click "Open" on any org |

---

## 🆘 Quick Troubleshooting

### Problem: Extension not loading
**Solution**: Check that you selected `/app/dist` folder, not `/app`

### Problem: OAuth flow fails
**Solution**: Verify Consumer Key and Secret are pasted correctly (no extra spaces)

### Problem: Can't see orgs in popup
**Solution**: Go to Settings and unlock with your master password

### Problem: Auto-login not working
**Solution**: Click "Refresh Token" on the org in Organizations tab

---

## 📖 More Help

For detailed help, see:
- **INSTALLATION_GUIDE.md** - Complete setup instructions
- **VISUAL_GUIDE.md** - Screenshots and UI explanations
- **OAUTH_CREDENTIALS.md** - OAuth credential details
- **PROJECT_SUMMARY.md** - Full project overview

---

## 💡 Pro Tips

1. **Pin the Extension**: Click the puzzle icon (🧩) in Chrome toolbar, then pin the extension for quick access

2. **Use OAuth**: Always prefer OAuth over password authentication - it's more secure and automatic

3. **Set Strong Password**: Use a strong master password (12+ characters) to protect your encrypted data

4. **Refresh Tokens**: Tokens auto-refresh, but you can manually refresh before important work

5. **Quick Access on Login Pages**: Visit Salesforce login pages to see the Quick Access panel

6. **Multiple Orgs**: Add all your orgs (dev, sandbox, production) for instant switching

---

## ⏰ Time Estimates

| Task | Time |
|------|------|
| Load extension | 30 seconds |
| Set master password | 30 seconds |
| Configure OAuth | 1 minute |
| Add first org | 2 minutes |
| Test login | 1 minute |
| **Total** | **5 minutes** ✅ |

---

## 🎯 Checklist for Successful Setup

- [ ] Extension appears in chrome://extensions/
- [ ] Extension icon visible in toolbar
- [ ] Can open extension popup
- [ ] Can open settings page
- [ ] Master password set and working
- [ ] OAuth config saved (green checkmark)
- [ ] First org added successfully
- [ ] Can see org in popup
- [ ] "Open" button works
- [ ] Auto-login successful

**If all checked**: You're ready to go! 🚀

---

## 📞 Still Need Help?

If you get stuck:

1. **Check the console**: Press F12 in Chrome and look for errors
2. **Review credentials**: Make sure OAuth key/secret are correct
3. **Read detailed guide**: See INSTALLATION_GUIDE.md for troubleshooting
4. **Reload extension**: Go to chrome://extensions/ and click the reload button

---

**🎉 Happy logging in! Enjoy your one-click Salesforce access!**
