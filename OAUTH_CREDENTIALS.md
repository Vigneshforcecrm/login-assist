# OAuth Credentials for Testing

## 🔑 Provided Credentials

These credentials have been shared by the user for configuring the extension:

### Production Org

**Consumer Key (Client ID):**
```
3MVG9PwZx9R6_Urdu_8Q5G0JlxXoog.3CrPg8_P4lH22OZ_lAugI.5C3z6tpz2QAfpeMeKKsyeYDXQHohQIH7
```

**Consumer Secret:**
```
06A0AA77D4EED4A66D84EFB9E42DC08844A9B10F62531FC0F62DD8E7C50F4CF1
```

---

## 📝 How to Use These Credentials

1. **Load the extension** in Chrome (see INSTALLATION_GUIDE.md)
2. **Open extension settings** (click extension icon → Settings)
3. **Unlock with master password** (set one if first time)
4. **Go to "OAuth Setup" tab**
5. **In Production Orgs section:**
   - Paste Consumer Key in "Consumer Key (Client ID)" field
   - Paste Consumer Secret in "Consumer Secret" field
6. **Click "Save Production Config"**
7. **Done!** You can now add orgs using OAuth

---

## 🎯 Quick Setup Commands

If you need to pre-configure these in code (development only):

```javascript
// This is what the extension stores internally after you save config:
const oauthConfig = {
  prod: {
    clientId: '3MVG9PwZx9R6_Urdu_8Q5G0JlxXoog.3CrPg8_P4lH22OZ_lAugI.5C3z6tpz2QAfpeMeKKsyeYDXQHohQIH7',
    clientSecret: '06A0AA77D4EED4A66D84EFB9E42DC08844A9B10F62531FC0F62DD8E7C50F4CF1',
    redirectUri: chrome.identity.getRedirectURL(),
    loginUrl: 'https://login.salesforce.com'
  }
}
```

---

## 🔐 Security Notes

⚠️ **IMPORTANT**: These credentials are stored encrypted in Chrome's local storage after you save them through the UI. They should be:

- ✅ Kept confidential
- ✅ Only used with this extension
- ✅ Not shared publicly
- ✅ Revoked if compromised
- ✅ Stored encrypted with your master password

---

## 🧪 Testing OAuth Flow

After configuring these credentials:

1. Go to **Organizations** tab
2. Select **OAuth** authentication
3. Choose **Production** org type
4. Click **"Connect with OAuth"**
5. Salesforce login window will open
6. Enter your Salesforce credentials
7. Approve access
8. Org will be saved automatically

---

## 📍 Callback URL

The extension will generate its own callback URL based on the Chrome extension ID:

```
https://<extension-id>.chromiumapp.org/
```

**To find your callback URL:**
1. Load extension in Chrome
2. Go to extension settings
3. Open "OAuth Setup" tab
4. Copy the callback URL shown in the instructions

**Important**: This callback URL must be configured in your Salesforce Connected App for OAuth to work.

---

## ✅ Verification

You know the credentials are working when:

1. OAuth Setup tab shows `✓ prod OAuth config saved`
2. You can click "Connect with OAuth" without errors
3. Salesforce login window opens
4. After login, org is added to your list
5. Access token is stored and usable

---

## 🔄 Callback URL Setup in Salesforce

If you need to update the Salesforce Connected App:

1. **Go to Salesforce Setup**
2. **Navigate to**: App Manager → Your Connected App → Edit
3. **OAuth Settings section**:
   - Add callback URL: `https://<your-extension-id>.chromiumapp.org/`
   - Ensure scopes include: `api`, `web`, `refresh_token`
4. **Save** changes
5. **Wait** 2-10 minutes for changes to propagate

---

## 🎯 Expected OAuth Scopes

The extension requests these OAuth scopes:

- ✅ `api` - Access and manage your data
- ✅ `web` - Access your basic information
- ✅ `refresh_token` - Perform requests at any time (offline access)

These are configured in `src/common/oauth.ts`:

```typescript
scope: 'api web refresh_token'
```
