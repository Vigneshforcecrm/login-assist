import { buildAuthUrl, exchangeCodeForToken, refreshAccessToken, revokeToken } from '../common/oauth'
import { decryptOrgArray, encryptOrgArray } from '../common/crypto'
import type { BackgroundMessage, OAuthConfig, SalesforceOrg } from '../types'

chrome.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
  if (message.action === 'openAndLogin') {
    handleOpenAndLogin(message.org!)
    return true
  }
  
  if (message.action === 'startOAuth') {
    handleOAuthFlow(message.loginType!)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }))
    return true
  }
  
  if (message.action === 'refreshToken') {
    handleRefreshToken(message.orgId!)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }))
    return true
  }
  
  if (message.action === 'revokeToken') {
    handleRevokeToken(message.orgId!)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }))
    return true
  }
})

async function handleOpenAndLogin(org: SalesforceOrg) {
  // Check if token needs refresh
  if (org.authMethod === 'oauth' && org.refreshToken && org.tokenExpiry) {
    const now = Date.now()
    if (now >= org.tokenExpiry - 300000) { // Refresh 5 min before expiry
      try {
        const config = await getOAuthConfig(org.loginType)
        const tokenResponse = await refreshAccessToken(org.refreshToken, config)
        
        // Update stored org with new token
        await updateOrgToken(org.id, tokenResponse.access_token, 
          tokenResponse.refresh_token || org.refreshToken)
        
        org.accessToken = tokenResponse.access_token
      } catch (err) {
        console.error('Token refresh failed:', err)
      }
    }
  }

  const loginUrl = org.authMethod === 'oauth' 
    ? org.instanceUrl 
    : (org.loginType === 'sandbox' ? 'https://test.salesforce.com' : 'https://login.salesforce.com')

  chrome.tabs.create({ url: loginUrl }, (tab) => {
    if (!tab.id) return

    const tabId = tab.id
    
    if (org.authMethod === 'oauth' && org.accessToken) {
      // For OAuth, inject session with access token
      setTimeout(() => injectOAuthSession(tabId, org), 2000)
    } else if (org.authMethod === 'password') {
      // Legacy password-based login
      setTimeout(() => injectPasswordLogin(tabId, org), 2000)
    }
  })
}

function injectOAuthSession(tabId: number, org: SalesforceOrg) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (instanceUrl: string, accessToken: string) => {
      // Redirect to instance with frontdoor servlet
      const frontdoorUrl = `${instanceUrl}/secur/frontdoor.jsp?sid=${accessToken}`
      window.location.href = frontdoorUrl
    },
    args: [org.instanceUrl, org.accessToken!]
  }).catch(err => {
    console.error('OAuth injection failed:', err)
    // Retry once
    setTimeout(() => injectOAuthSession(tabId, org), 1000)
  })
}

function injectPasswordLogin(tabId: number, org: SalesforceOrg) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (username: string, password: string, useToken: boolean, token: string) => {
      const passwordToUse = useToken ? password + token : password
      
      const userField = document.querySelector<HTMLInputElement>('#username') || 
        document.querySelector<HTMLInputElement>('input[type="email"]')
      const passField = document.querySelector<HTMLInputElement>('#password') || 
        document.querySelector<HTMLInputElement>('input[type="password"]')
      
      if (userField) userField.value = username
      if (passField) passField.value = passwordToUse
      
      const loginBtn = document.querySelector<HTMLButtonElement>('#Login') || 
        document.querySelector<HTMLButtonElement>('button[type="submit"]')
      if (loginBtn) loginBtn.click()
    },
    args: [org.username!, org.password!, org.loginWithToken || false, org.token || '']
  }).catch(() => {
    setTimeout(() => injectPasswordLogin(tabId, org), 1000)
  })
}

async function handleOAuthFlow(loginType: 'prod' | 'sandbox'): Promise<{ org: SalesforceOrg }> {
  const config = await getOAuthConfig(loginType)
  const authUrl = buildAuthUrl(config)
  
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          reject(new Error(chrome.runtime.lastError?.message || 'OAuth cancelled'))
          return
        }
        
        try {
          const url = new URL(redirectUrl)
          const code = url.searchParams.get('code')
          
          if (!code) {
            reject(new Error('No authorization code received'))
            return
          }
          
          const tokenResponse = await exchangeCodeForToken(code, config)
          
          // Create org object
          const org: SalesforceOrg = {
            id: crypto.randomUUID(),
            name: `${loginType === 'sandbox' ? 'Sandbox' : 'Production'} Org`,
            instanceUrl: tokenResponse.instance_url,
            loginType,
            authMethod: 'oauth',
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            tokenExpiry: Date.now() + 7200000, // 2 hours
            createdAt: new Date().toISOString()
          }
          
          resolve({ org })
        } catch (err) {
          reject(err)
        }
      }
    )
  })
}

async function handleRefreshToken(orgId: string): Promise<{ success: boolean }> {
  const storage = await chrome.storage.local.get(['orgsEncrypted'])
  const session = await chrome.storage.session.get(['masterPassPlain'])
  
  if (!storage.orgsEncrypted || !session.masterPassPlain) {
    throw new Error('Not unlocked')
  }
  
  const orgs = decryptOrgArray(storage.orgsEncrypted, session.masterPassPlain)
  const org = orgs.find(o => o.id === orgId)
  
  if (!org || !org.refreshToken) {
    throw new Error('Org not found or no refresh token')
  }
  
  const config = await getOAuthConfig(org.loginType)
  const tokenResponse = await refreshAccessToken(org.refreshToken, config)
  
  await updateOrgToken(orgId, tokenResponse.access_token, 
    tokenResponse.refresh_token || org.refreshToken)
  
  return { success: true }
}

async function handleRevokeToken(orgId: string): Promise<{ success: boolean }> {
  const storage = await chrome.storage.local.get(['orgsEncrypted'])
  const session = await chrome.storage.session.get(['masterPassPlain'])
  
  if (!storage.orgsEncrypted || !session.masterPassPlain) {
    throw new Error('Not unlocked')
  }
  
  const orgs = decryptOrgArray(storage.orgsEncrypted, session.masterPassPlain)
  const org = orgs.find(o => o.id === orgId)
  
  if (!org || !org.accessToken) {
    throw new Error('Org not found or no access token')
  }
  
  const loginUrl = org.loginType === 'sandbox' 
    ? 'https://test.salesforce.com' 
    : 'https://login.salesforce.com'
  
  await revokeToken(org.accessToken, loginUrl)
  
  return { success: true }
}

async function getOAuthConfig(loginType: 'prod' | 'sandbox'): Promise<OAuthConfig> {
  const storage = await chrome.storage.local.get(['oauthConfigs'])
  const configs = storage.oauthConfigs || {}
  
  const config = configs[loginType]
  if (!config) {
    throw new Error(`OAuth config not found for ${loginType}`)
  }
  
  return config
}

async function updateOrgToken(orgId: string, accessToken: string, refreshToken: string) {
  const storage = await chrome.storage.local.get(['orgsEncrypted'])
  const session = await chrome.storage.session.get(['masterPassPlain'])
  
  if (!storage.orgsEncrypted || !session.masterPassPlain) return
  
  const orgs = decryptOrgArray(storage.orgsEncrypted, session.masterPassPlain)
  const updatedOrgs = orgs.map(o => 
    o.id === orgId 
      ? { ...o, accessToken, refreshToken, tokenExpiry: Date.now() + 7200000 }
      : o
  )
  
  const encrypted = encryptOrgArray(updatedOrgs, session.masterPassPlain)
  await chrome.storage.local.set({ orgsEncrypted: encrypted })
}