# 🎨 Visual Guide - What to Expect

This guide shows you what the extension looks like at each step.

---

## 1. 📦 Loading the Extension

**Location**: `chrome://extensions/`

**What you'll see:**
```
┌─────────────────────────────────────────────────┐
│  Extensions                                     │
│  ┌──────────────────────────────────────┐     │
│  │ Developer mode        [ON]           │     │
│  └──────────────────────────────────────┘     │
│                                                 │
│  [Load unpacked] [Pack extension] [Update]    │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ 🔵 Salesforce OAuth Assistant           │ │
│  │    Manage Salesforce orgs with OAuth... │ │
│  │    Version: 2.0.0                       │ │
│  │    ID: abcdef123456...                  │ │
│  │    [Details] [Remove] [Errors]         │ │
│  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Key indicators:**
- ✅ Extension name shows correctly
- ✅ Version 2.0.0 displayed
- ✅ No error badges
- ✅ Extension icon visible in toolbar

---

## 2. 🔓 First Launch - Master Password

**Click extension icon** → You'll see:

```
┌────────────────────────────────────────┐
│  SF OAuth Assistant                    │
│  Secure OAuth access                   │
│                          [Settings]    │
├────────────────────────────────────────┤
│                                        │
│         Loading...                     │
│                                        │
│  (or)                                  │
│                                        │
│    Open settings to unlock            │
│                                        │
│         [Add Org]                      │
│                                        │
└────────────────────────────────────────┘
```

**Click "Settings" or "Add Org"** → Opens options page

---

## 3. 🔐 Options Page - Unlock Screen

**Full-screen settings page:**

```
═══════════════════════════════════════════════════════
 Salesforce OAuth Assistant
 Manage your Salesforce orgs with secure OAuth authentication
───────────────────────────────────────────────────────

┌───────────────────────────────────────────────────┐
│  Unlock Vault                                     │
│                                                   │
│  Enter your master password to access encrypted  │
│  org data                                        │
│                                                   │
│  [Master password (min 6 chars)...]  [Unlock]   │
└───────────────────────────────────────────────────┘
```

**After entering password and clicking Unlock:**

---

## 4. 📑 Options Page - Main Interface

**Tab Navigation:**

```
═══════════════════════════════════════════════════════
 Salesforce OAuth Assistant
 Manage your Salesforce orgs with secure OAuth authentication
───────────────────────────────────────────────────────

┌───────────────────────────────────────────────────┐
│  🏢 Organizations  |  🔐 OAuth Setup  |  🔒 Security │
└───────────────────────────────────────────────────┘
```

**Active tab has blue underline**

---

## 5. 🔐 OAuth Setup Tab

```
┌─────────────────────────────────────────────────────┐
│  OAuth Configuration                                │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ ℹ️ Setup Instructions                         │ │
│  │ 1. Create a Connected App in Salesforce...   │ │
│  │ 2. Enable OAuth Settings with callback URL:  │ │
│  │    https://xyz123.chromiumapp.org/           │ │
│  │ 3. Select scopes: api, web, refresh_token    │ │
│  │ 4. Copy Consumer Key and Secret below        │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  🏢 Production Orgs                                 │
│  ┌─────────────────────────────────────────┐      │
│  │ Consumer Key (Client ID)                │      │
│  │ [3MVG9PwZx9R6_Urdu_8Q5G0...]           │      │
│  └─────────────────────────────────────────┘      │
│  ┌─────────────────────────────────────────┐      │
│  │ Consumer Secret (Optional)              │      │
│  │ [06A0AA77D4EED4A66D84EFB...]           │      │
│  └─────────────────────────────────────────┘      │
│  [Save Production Config]                          │
│                                                     │
│  🧪 Sandbox Orgs                                    │
│  (Same layout as Production)                       │
└─────────────────────────────────────────────────────┘
```

**After saving:**
```
┌───────────────────────────────────────┐
│ ✓ prod OAuth config saved            │
└───────────────────────────────────────┘
```

---

## 6. 🏢 Organizations Tab

**Layout**: Split into two sections

```
┌────────────────────────────────────────────────────────────────┐
│  🏢 Organizations  |  🔐 OAuth Setup  |  🔒 Security           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ✓ prod OAuth config saved                                    │
│                                                                │
├──────────────────┬─────────────────────────────────────────────┤
│                  │                                             │
│  Add Org         │  Saved Organizations (0)                    │
│                  │                                             │
│  Authentication  │  No organizations added yet                │
│  [🔒 OAuth ✓]    │  Use OAuth to securely connect your        │
│  [🔑 Password]   │  Salesforce orgs                           │
│                  │                                             │
│  Org Type        │                                             │
│  [Production ▾]  │                                             │
│                  │                                             │
│  [✨ Connect     │                                             │
│   with OAuth]    │                                             │
│                  │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

---

## 7. 🔄 OAuth Flow in Progress

**When you click "Connect with OAuth":**

1. **Message appears:**
```
┌─────────────────────────────────┐
│ Starting OAuth flow...          │
└─────────────────────────────────┘
```

2. **New window opens** (Salesforce login):
```
┌────────────────────────────────────┐
│  Salesforce                        │
├────────────────────────────────────┤
│  Log In                            │
│                                    │
│  Username                          │
│  [your-email@example.com]          │
│                                    │
│  Password                          │
│  [••••••••••]                      │
│                                    │
│  [Log In]                          │
│                                    │
│  Forgot Your Password?             │
└────────────────────────────────────┘
```

3. **After login** → Window closes automatically

4. **Success message:**
```
┌─────────────────────────────────┐
│ ✓ Added Production Org          │
└─────────────────────────────────┘
```

---

## 8. 📋 Organizations Tab (With Orgs)

**After adding orgs:**

```
┌──────────────────┬─────────────────────────────────────────────┐
│                  │  Saved Organizations (2)                    │
│  Add Org         │                                             │
│                  │  ┌──────────────────────────────────────┐  │
│                  │  │ Production Org           [OAuth] 🏢  │  │
│                  │  │ https://mycompany.salesforce.com     │  │
│                  │  │ Token expires: 2025-08-22 3:45 PM    │  │
│                  │  │                    [Refresh Token]   │  │
│                  │  │                    [Revoke]         │  │
│                  │  │                    [Delete]         │  │
│                  │  └──────────────────────────────────────┘  │
│                  │                                             │
│                  │  ┌──────────────────────────────────────┐  │
│                  │  │ Sandbox Org              [OAuth] 🧪  │  │
│                  │  │ https://mycompany--dev.sandbox...   │  │
│                  │  │ Token expires: 2025-08-22 2:30 PM    │  │
│                  │  │                    [Refresh Token]   │  │
│                  │  │                    [Revoke]         │  │
│                  │  │                    [Delete]         │  │
│                  │  └──────────────────────────────────────┘  │
└──────────────────┴─────────────────────────────────────────────┘
```

**Badge meanings:**
- 🟢 **[OAuth]** = OAuth authentication (secure)
- 🟡 **[Password]** = Password authentication (legacy)
- 🏢 **Prod** = Production org
- 🧪 **Sandbox** = Sandbox org

---

## 9. 🔍 Extension Popup (After Setup)

**Click extension icon in toolbar:**

```
┌────────────────────────────────────────┐
│  SF OAuth Assistant                    │
│  Secure OAuth access                   │
│                          [Settings]    │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Production Org         [OAuth]   │ │
│  │ https://mycompany.salesforce.com │ │
│  │ 🏢 Production                    │ │
│  │                         [Open]   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Sandbox Org            [OAuth]   │ │
│  │ https://mycompany--dev.sandbox...│ │
│  │ 🧪 Sandbox                       │ │
│  │                         [Open]   │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

**Clicking [Open]:**
1. New tab opens
2. Salesforce loads
3. You're automatically logged in! ✅

---

## 10. 🌐 Content Script on Login Page

**When you visit login.salesforce.com:**

```
Browser Tab:
┌─────────────────────────────────────────────────────┐
│  login.salesforce.com                               │
├─────────────────────────────────────────────────────┤
│                                   ┌─────────────┐   │
│  Salesforce                       │ Quick Access│   │
│                                   │   [Manage]  │   │
│  Log In                           ├─────────────┤   │
│                                   │             │   │
│  Username                         │ Production  │   │
│  [              ]                 │ Org         │   │
│                                   │ 🔒 OAuth    │   │
│  Password                         │             │   │
│  [              ]                 │   [Open]    │   │
│                                   │             │   │
│  [Log In]                         └─────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**The Quick Access panel:**
- Appears automatically on Salesforce login pages
- Shows only matching orgs (Production on login.salesforce.com)
- Click [Open] to log in with that org
- Click [Manage] to open settings

---

## 11. 🔒 Security Tab

```
┌─────────────────────────────────────────────────────┐
│  🏢 Organizations  |  🔐 OAuth Setup  |  🔒 Security │
├─────────────────────────────────────────────────────┤
│  Security Settings                                  │
│                                                     │
│  Encryption                                         │
│  All stored credentials are encrypted using         │
│  AES-256 with your master password. The master     │
│  password is stored only in session memory and     │
│  never persisted to disk.                          │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │ ✓ Master password active for this session │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  OAuth Tokens                                       │
│  OAuth tokens are encrypted and stored locally.    │
│  Access tokens expire after 2 hours and are        │
│  automatically refreshed using the refresh token.  │
│                                                     │
│  • Tokens never leave Salesforce OAuth endpoints  │
│  • Refresh tokens allow seamless re-auth          │
│  • Revoke access anytime from Orgs tab            │
│                                                     │
│  Best Practices                                     │
│  • Use OAuth instead of password auth              │
│  • Choose strong master password (12+ chars)      │
│  • Review connected orgs regularly                 │
│  • Revoke tokens for unused orgs                  │
│                                                     │
│  Change Master Password                             │
│  [Change Password]                                  │
│                                                     │
│  Danger Zone                                        │
│  [Delete All Data]                                  │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

The extension uses Salesforce-inspired colors:

- **Primary Blue**: `#0b66c3` (Salesforce blue)
- **Dark Blue**: `#032d60` (Headers, titles)
- **Light Blue**: `#ecf3fe` (Backgrounds)
- **Green**: For OAuth badges and success messages
- **Yellow**: For warning badges
- **Red**: For error messages and danger actions
- **Gray**: For secondary text and borders

---

## 🎯 UI Elements Legend

| Element | Meaning |
|---------|---------|
| 🏢 | Production org |
| 🧪 | Sandbox org |
| 🔒 | OAuth authentication |
| 🔑 | Password authentication |
| ✓ | Success / Completed |
| ⚠️ | Warning |
| ❌ | Error / Delete |
| ℹ️ | Information |
| ⚙️ | Settings |
| 🔄 | Refresh / Update |

---

## 📱 Popup Size

The extension popup has a fixed size:
- **Width**: 400px
- **Min Height**: 500px
- Scrollable if content exceeds height

---

## 💡 Visual Tips

### ✅ Good Signs
- Green badges for OAuth orgs
- "✓" checkmarks for success
- Token expiry times showing
- All tabs accessible

### ⚠️ Warning Signs
- Yellow badges for password auth
- "Open settings to unlock" message
- Missing orgs in list
- Error messages in red

### ❌ Problem Indicators
- "Configure OAuth first" message
- "Failed to load orgs"
- Missing callback URL
- Chrome extension errors badge

---

## 🖼️ Expected Visual Flow

```
Extension Icon
    ↓
Popup (Unlocked)
    ↓
List of Orgs
    ↓
Click [Open]
    ↓
New Tab Opens
    ↓
Salesforce Loads
    ↓
Auto-Login ✅
```

**Alternative:**
```
Extension Icon
    ↓
[Settings] Button
    ↓
Full Options Page
    ↓
Configure OAuth
    ↓
Add Orgs
    ↓
Use from Popup
```

---

This visual guide should help you understand what to expect at each step of using the extension!
