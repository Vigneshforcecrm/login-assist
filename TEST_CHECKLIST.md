# 🧪 Testing Checklist

Use this checklist to verify all features of the Salesforce OAuth Assistant extension.

---

## 📦 Pre-Flight Checks

### Build Verification
- [ ] `/app/dist` folder exists
- [ ] `manifest.json` present in dist/
- [ ] `background.js` present in dist/
- [ ] `content.js` present in dist/
- [ ] Icons folder present in dist/icons/
- [ ] All 3 icon files present (16, 48, 128)
- [ ] HTML files present in dist/src/
- [ ] Assets folder with JS/CSS bundles

### Extension Loading
- [ ] Extension loads without errors in chrome://extensions/
- [ ] No red error badge on extension card
- [ ] Extension icon appears in toolbar
- [ ] Can click extension icon to open popup

---

## 🔓 Authentication Tests

### Master Password
- [ ] First launch shows unlock screen
- [ ] Can set new master password (min 6 chars)
- [ ] Password too short shows error
- [ ] Correct password unlocks successfully
- [ ] Wrong password shows error
- [ ] Password persists during browser session
- [ ] Password cleared after browser restart

### Session Management
- [ ] Master password stored in session only
- [ ] Closing all tabs requires re-unlock
- [ ] Re-entering correct password works
- [ ] Data remains encrypted when locked

---

## 🔐 OAuth Configuration Tests

### OAuth Setup Page
- [ ] OAuth Setup tab is accessible
- [ ] Callback URL displayed correctly
- [ ] Setup instructions visible
- [ ] Can enter Consumer Key
- [ ] Can enter Consumer Secret
- [ ] Save button works for Production
- [ ] Save button works for Sandbox
- [ ] Success message appears after save
- [ ] Config persists after page refresh

### OAuth Credentials
- [ ] Production config saves correctly
- [ ] Sandbox config saves separately
- [ ] Can update existing config
- [ ] Empty Consumer Key shows error
- [ ] Saved values load on page refresh

---

## 🏢 Organization Management Tests

### Adding Orgs - OAuth Method
- [ ] Organizations tab accessible
- [ ] OAuth method selected by default
- [ ] Production org type selectable
- [ ] Sandbox org type selectable
- [ ] "Connect with OAuth" button enabled
- [ ] Clicking button opens Salesforce login
- [ ] Can log into Salesforce
- [ ] Can approve OAuth access
- [ ] Window closes after approval
- [ ] Org added to list automatically
- [ ] Success message displayed
- [ ] Org shows with OAuth badge
- [ ] Token expiry time displayed

### Adding Orgs - Password Method
- [ ] Can switch to password method
- [ ] Name field accepts input
- [ ] Username field accepts input
- [ ] Password field accepts input (masked)
- [ ] Instance URL field accepts input
- [ ] Org type dropdown works
- [ ] Security token checkbox works
- [ ] Security token field appears when checked
- [ ] Save button works
- [ ] Org added to list
- [ ] Org shows with Password badge

### Org List Display
- [ ] Orgs displayed in right panel
- [ ] Org count shown correctly
- [ ] OAuth orgs show green badge
- [ ] Password orgs show yellow badge
- [ ] Production orgs show 🏢 icon
- [ ] Sandbox orgs show 🧪 icon
- [ ] Instance URL displayed
- [ ] Username displayed (for password orgs)
- [ ] Token expiry displayed (for OAuth orgs)
- [ ] Action buttons visible

### Org Actions
- [ ] Edit button works (password orgs)
- [ ] Refresh Token button works (OAuth orgs)
- [ ] Revoke button works (OAuth orgs)
- [ ] Delete button works (all orgs)
- [ ] Delete shows confirmation dialog
- [ ] Confirming delete removes org
- [ ] Canceling delete keeps org

---

## 🔄 Token Management Tests

### Token Refresh
- [ ] Can manually refresh token
- [ ] Success message after refresh
- [ ] Token expiry updates
- [ ] Org remains in list
- [ ] Can use org after refresh
- [ ] Error handling for failed refresh

### Token Revocation
- [ ] Can revoke OAuth token
- [ ] Confirmation dialog appears
- [ ] Revoke removes org from list
- [ ] Success message displayed
- [ ] Cannot use org after revoke
- [ ] Error handling for failed revoke

### Auto Refresh
- [ ] Token refreshes before expiry (5 min)
- [ ] No user interaction needed
- [ ] Login works with refreshed token

---

## 🪟 Popup Tests

### Popup Display
- [ ] Popup opens when clicking icon
- [ ] Popup size correct (400x500px)
- [ ] Header displays correctly
- [ ] Settings button visible
- [ ] Orgs list displayed
- [ ] Loading state shows initially
- [ ] Empty state shown when no orgs

### Popup Actions
- [ ] Settings button opens options page
- [ ] Add Org button opens settings (when empty)
- [ ] Each org has Open button
- [ ] Clicking Open opens new tab
- [ ] New tab loads Salesforce
- [ ] Auto-login works
- [ ] Success message in popup

### Popup States
- [ ] Locked state: "Open settings to unlock"
- [ ] Loading state: "Loading..."
- [ ] Empty state: "No orgs configured"
- [ ] Populated state: Shows all orgs
- [ ] Error state: Shows error message

---

## 📄 Content Script Tests

### Login Page Integration
- [ ] Visit login.salesforce.com
- [ ] Quick Access panel appears
- [ ] Panel positioned top-right
- [ ] Panel styled correctly
- [ ] Shows "Loading..." initially
- [ ] Shows orgs when unlocked
- [ ] Filters Production orgs only

### Sandbox Login
- [ ] Visit test.salesforce.com
- [ ] Quick Access panel appears
- [ ] Filters Sandbox orgs only
- [ ] Production orgs not shown

### Content Script Actions
- [ ] Manage link opens settings
- [ ] Open button works for each org
- [ ] Clicking Open logs in
- [ ] Panel updates after adding org
- [ ] Empty state: "No orgs configured"
- [ ] Locked state: "Unlock in extension"

---

## 🔐 Security Tests

### Encryption
- [ ] Data encrypted in Chrome storage
- [ ] Cannot read data without password
- [ ] Changing password re-encrypts data
- [ ] Data accessible after password change
- [ ] No plaintext credentials in storage

### Storage
- [ ] Orgs stored encrypted
- [ ] OAuth configs stored
- [ ] Master password NOT stored locally
- [ ] Master password in session only
- [ ] Session clears on browser close

### Security Settings
- [ ] Security tab accessible
- [ ] Encryption info displayed
- [ ] OAuth info displayed
- [ ] Best practices shown
- [ ] Change Password button works
- [ ] Delete All Data button works
- [ ] Confirmation required for deletion
- [ ] Deletion removes all data
- [ ] Can start fresh after deletion

---

## 🎨 UI/UX Tests

### Visual Design
- [ ] Salesforce blue colors used
- [ ] Consistent spacing and padding
- [ ] Buttons have hover states
- [ ] Smooth transitions
- [ ] Icons display correctly
- [ ] Badges styled properly
- [ ] Forms aligned correctly

### Responsiveness
- [ ] Popup renders at 400px width
- [ ] Options page works full-screen
- [ ] Elements don't overflow
- [ ] Scrolling works when needed
- [ ] Text truncates properly
- [ ] Mobile viewport meta tag present

### Accessibility
- [ ] Tab navigation works
- [ ] Enter key submits forms
- [ ] Focus indicators visible
- [ ] Error messages clear
- [ ] Success messages clear
- [ ] Buttons have appropriate labels

---

## 🔌 Integration Tests

### Chrome APIs
- [ ] chrome.storage.local works
- [ ] chrome.storage.session works
- [ ] chrome.runtime.sendMessage works
- [ ] chrome.tabs.create works
- [ ] chrome.scripting.executeScript works
- [ ] chrome.identity.launchWebAuthFlow works
- [ ] chrome.identity.getRedirectURL works

### Background Service Worker
- [ ] Service worker loads
- [ ] Message handling works
- [ ] OAuth flow handler works
- [ ] Token refresh handler works
- [ ] Token revoke handler works
- [ ] Open and login handler works
- [ ] No console errors

### Cross-Component Communication
- [ ] Popup → Background messages work
- [ ] Options → Background messages work
- [ ] Content → Background messages work
- [ ] Background → Storage updates work
- [ ] Storage → UI updates work

---

## 🌐 End-to-End Tests

### Complete OAuth Flow
1. [ ] Load extension
2. [ ] Set master password
3. [ ] Configure OAuth
4. [ ] Add org via OAuth
5. [ ] See org in popup
6. [ ] Click Open in popup
7. [ ] Auto-login successful

### Complete Password Flow
1. [ ] Switch to password method
2. [ ] Enter org details
3. [ ] Save org
4. [ ] See org in popup
5. [ ] Click Open
6. [ ] Credentials filled
7. [ ] Login button clicked

### Quick Access Flow
1. [ ] Visit login.salesforce.com
2. [ ] Panel appears
3. [ ] Click Open on org
4. [ ] New tab opens
5. [ ] Auto-login successful

### Token Lifecycle
1. [ ] Add OAuth org
2. [ ] Token has 2hr expiry
3. [ ] Use org immediately (works)
4. [ ] Wait or set expiry to past
5. [ ] Use org again
6. [ ] Token auto-refreshes
7. [ ] Login still works

---

## 🐛 Error Handling Tests

### Network Errors
- [ ] OAuth fails gracefully with network error
- [ ] Token refresh fails gracefully
- [ ] Clear error message shown
- [ ] Can retry after network restored

### Invalid Credentials
- [ ] Wrong OAuth credentials show error
- [ ] Wrong password shows error
- [ ] Invalid instance URL handled
- [ ] Clear error messages

### Edge Cases
- [ ] Empty org list handled
- [ ] No OAuth config shows error
- [ ] Expired token handled
- [ ] Invalid master password handled
- [ ] Deleted org doesn't appear
- [ ] Duplicate org names allowed
- [ ] Special characters in passwords work

---

## 📊 Performance Tests

### Load Times
- [ ] Extension loads quickly
- [ ] Popup opens instantly
- [ ] Options page loads fast
- [ ] No lag when switching tabs
- [ ] Smooth animations

### Resource Usage
- [ ] Low memory footprint
- [ ] No memory leaks
- [ ] Background script efficient
- [ ] Content script lightweight

---

## ✅ Final Verification

### Smoke Test (5 minutes)
- [ ] Load extension ✓
- [ ] Set password ✓
- [ ] Configure OAuth ✓
- [ ] Add one org ✓
- [ ] Open org from popup ✓
- [ ] Auto-login works ✓

### Regression Test (10 minutes)
- [ ] All tabs accessible ✓
- [ ] All buttons work ✓
- [ ] All forms save correctly ✓
- [ ] All messages display ✓
- [ ] No console errors ✓

### Production Readiness
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build completes successfully
- [ ] All files present in dist/
- [ ] Documentation complete
- [ ] OAuth credentials documented
- [ ] Installation guide provided

---

## 🎯 Success Criteria

### Must Have (Blocking Issues)
- [ ] Extension loads in Chrome
- [ ] OAuth flow completes
- [ ] Auto-login works
- [ ] Data encrypted
- [ ] No security vulnerabilities

### Should Have (High Priority)
- [ ] Token refresh works
- [ ] Content script appears
- [ ] Password method works
- [ ] UI polished
- [ ] Error handling robust

### Nice to Have (Low Priority)
- [ ] Animations smooth
- [ ] Icons custom-designed
- [ ] Keyboard shortcuts
- [ ] Export/import feature

---

## 📝 Test Results

**Date**: _____________
**Tester**: ___________
**Build Version**: 2.0.0

**Overall Result**: 
- [ ] ✅ All tests passed
- [ ] ⚠️ Some tests failed (document below)
- [ ] ❌ Critical failures (block release)

**Notes**:
```
[Add any issues, bugs, or observations here]
```

---

## 🔄 Retesting After Fixes

If issues found:
1. Document issue in Notes above
2. Fix the issue
3. Rebuild: `npm run build`
4. Reload extension in Chrome
5. Re-run failed tests
6. Verify fix successful

---

**Test completed successfully when all checkboxes are checked! ✅**
