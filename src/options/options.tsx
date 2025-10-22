import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './options.css'
import { encryptOrgArray, decryptOrgArray, hashMasterPassword } from '../common/crypto'
import type { SalesforceOrg, OAuthConfig, BackgroundMessage } from '../types'
import { v4 as uuidv4 } from 'uuid'

type Tab = 'orgs' | 'oauth' | 'security'

function OptionsApp() {
  const [activeTab, setActiveTab] = useState<Tab>('orgs')
  const [orgs, setOrgs] = useState<SalesforceOrg[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<SalesforceOrg>>(getEmptyForm())
  const [masterPass, setMasterPass] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [message, setMessage] = useState('')
  const [oauthConfigs, setOauthConfigs] = useState<Record<string, OAuthConfig>>({})
  
  useEffect(() => {
    checkUnlocked()
    loadOAuthConfigs()
  }, [])

  function getEmptyForm(): Partial<SalesforceOrg> {
    return {
      id: '',
      name: '',
      instanceUrl: '',
      loginType: 'prod',
      authMethod: 'oauth',
      group: ''
    }
  }

  async function checkUnlocked() {
    const session = await chrome.storage.session.get(['masterPassPlain'])
    if (session.masterPassPlain) {
      setMasterPass(session.masterPassPlain)
      setUnlocked(true)
      await loadOrgs(session.masterPassPlain)
    }
  }

  async function loadOrgs(master: string) {
    try {
      const storage = await chrome.storage.local.get(['orgsEncrypted'])
      if (!storage.orgsEncrypted) {
        setOrgs([])
        return
      }
      const arr = decryptOrgArray(storage.orgsEncrypted, master)
      setOrgs(arr)
    } catch (err) {
      setMessage('Failed to decrypt orgs. Wrong password?')
    }
  }

  async function loadOAuthConfigs() {
    const storage = await chrome.storage.local.get(['oauthConfigs'])
    setOauthConfigs(storage.oauthConfigs || {})
  }

  async function handleUnlock() {
    if (!masterPass || masterPass.length < 6) {
      setMessage('Master password must be at least 6 characters')
      return
    }

    try {
      await chrome.storage.session.set({ 
        masterPassPlain: masterPass,
        masterHash: hashMasterPassword(masterPass)
      })
      setUnlocked(true)
      await loadOrgs(masterPass)
      setMessage('Unlocked successfully')
    } catch (err) {
      setMessage('Unlock failed')
    }
  }

  async function handleStartOAuth(loginType: 'prod' | 'sandbox') {
    if (!oauthConfigs[loginType]) {
      setMessage(`Configure OAuth for ${loginType} first`)
      return
    }

    setMessage('Starting OAuth flow...')
    
    const msg: BackgroundMessage = { action: 'startOAuth', loginType }
    chrome.runtime.sendMessage(msg, async (response) => {
      if (response?.error) {
        setMessage(`OAuth failed: ${response.error}`)
        return
      }
      
      if (response?.org) {
        const newOrg = response.org as SalesforceOrg
        const updatedOrgs = [...orgs, newOrg]
        
        const encrypted = encryptOrgArray(updatedOrgs, masterPass)
        await chrome.storage.local.set({ orgsEncrypted: encrypted })
        
        setOrgs(updatedOrgs)
        setMessage(`✓ Added ${newOrg.name}`)
      }
    })
  }

  async function handleSave() {
    if (!unlocked) {
      setMessage('Unlock first')
      return
    }

    if (!form.name || !form.instanceUrl) {
      setMessage('Name and Instance URL required')
      return
    }

    try {
      let updatedOrgs: SalesforceOrg[]
      
      if (!form.id) {
        const newOrg: SalesforceOrg = {
          ...form as SalesforceOrg,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        }
        updatedOrgs = [...orgs, newOrg]
      } else {
        updatedOrgs = orgs.map(o => o.id === form.id ? { ...form as SalesforceOrg } : o)
      }

      const encrypted = encryptOrgArray(updatedOrgs, masterPass)
      await chrome.storage.local.set({ orgsEncrypted: encrypted })
      
      setOrgs(updatedOrgs)
      setForm(getEmptyForm())
      setEditing(null)
      setMessage('Saved successfully')
    } catch (err) {
      setMessage('Save failed')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this org?')) return

    const updatedOrgs = orgs.filter(o => o.id !== id)
    const encrypted = encryptOrgArray(updatedOrgs, masterPass)
    await chrome.storage.local.set({ orgsEncrypted: encrypted })
    
    setOrgs(updatedOrgs)
    setMessage('Deleted')
    
    if (editing === id) {
      setForm(getEmptyForm())
      setEditing(null)
    }
  }

  async function handleRefreshToken(org: SalesforceOrg) {
    setMessage('Refreshing token...')
    
    const msg: BackgroundMessage = { action: 'refreshToken', orgId: org.id }
    chrome.runtime.sendMessage(msg, async (response) => {
      if (response?.error) {
        setMessage(`Refresh failed: ${response.error}`)
        return
      }
      
      setMessage('✓ Token refreshed')
      await loadOrgs(masterPass)
    })
  }

  async function handleRevokeToken(org: SalesforceOrg) {
    if (!confirm('Revoke OAuth token? You will need to re-authenticate.')) return
    
    const msg: BackgroundMessage = { action: 'revokeToken', orgId: org.id }
    chrome.runtime.sendMessage(msg, async (response) => {
      if (response?.error) {
        setMessage(`Revoke failed: ${response.error}`)
        return
      }
      
      setMessage('✓ Token revoked')
      await handleDelete(org.id)
    })
  }

  async function handleSaveOAuthConfig(loginType: 'prod' | 'sandbox') {
    const clientId = (document.getElementById(`${loginType}-client-id`) as HTMLInputElement)?.value
    const clientSecret = (document.getElementById(`${loginType}-client-secret`) as HTMLInputElement)?.value
    
    if (!clientId) {
      setMessage('Client ID required')
      return
    }

    const config: OAuthConfig = {
      clientId,
      clientSecret,
      redirectUri: chrome.identity.getRedirectURL(),
      loginUrl: loginType === 'sandbox' ? 'https://test.salesforce.com' : 'https://login.salesforce.com'
    }

    const updatedConfigs = { ...oauthConfigs, [loginType]: config }
    await chrome.storage.local.set({ oauthConfigs: updatedConfigs })
    
    setOauthConfigs(updatedConfigs)
    setMessage(`✓ ${loginType} OAuth config saved`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-salesforce-dark mb-2">
            Salesforce OAuth Assistant
          </h1>
          <p className="text-gray-600">
            Manage your Salesforce orgs with secure OAuth authentication
          </p>
        </div>

        {/* Unlock Section */}
        {!unlocked && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Unlock Vault</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your master password to access encrypted org data
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                value={masterPass}
                onChange={(e) => setMasterPass(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Master password (min 6 chars)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue focus:border-transparent"
              />
              <button
                onClick={handleUnlock}
                className="px-6 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark transition-colors"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {unlocked && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex gap-8 px-6">
                  {(['orgs', 'oauth', 'security'] as Tab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-salesforce-blue text-salesforce-blue'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'orgs' && '🏢 Organizations'}
                      {tab === 'oauth' && '🔐 OAuth Setup'}
                      {tab === 'security' && '🔒 Security'}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                {message}
              </div>
            )}

            {/* Orgs Tab */}
            {activeTab === 'orgs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                    <h3 className="text-lg font-semibold mb-4">
                      {editing ? 'Edit Org' : 'Add Org'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Authentication Method
                        </label>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setForm({ ...form, authMethod: 'oauth' })}
                            className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                              form.authMethod === 'oauth'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            🔒 OAuth (Recommended)
                          </button>
                          <button
                            onClick={() => setForm({ ...form, authMethod: 'password' })}
                            className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                              form.authMethod === 'password'
                                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            🔑 Password
                          </button>
                        </div>
                      </div>

                      {form.authMethod === 'oauth' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Org Type
                            </label>
                            <select
                              value={form.loginType}
                              onChange={(e) => setForm({ ...form, loginType: e.target.value as 'prod' | 'sandbox' })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                            >
                              <option value="prod">Production</option>
                              <option value="sandbox">Sandbox</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleStartOAuth(form.loginType as 'prod' | 'sandbox')}
                            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            ✨ Connect with OAuth
                          </button>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={form.name || ''}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Username
                            </label>
                            <input
                              type="text"
                              value={form.username || ''}
                              onChange={(e) => setForm({ ...form, username: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              value={form.password || ''}
                              onChange={(e) => setForm({ ...form, password: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Instance URL
                            </label>
                            <input
                              type="text"
                              value={form.instanceUrl || ''}
                              onChange={(e) => setForm({ ...form, instanceUrl: e.target.value })}
                              placeholder="https://your-domain.salesforce.com"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Org Type
                            </label>
                            <select
                              value={form.loginType}
                              onChange={(e) => setForm({ ...form, loginType: e.target.value as 'prod' | 'sandbox' })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                            >
                              <option value="prod">Production</option>
                              <option value="sandbox">Sandbox</option>
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={form.loginWithToken || false}
                                onChange={(e) => setForm({ ...form, loginWithToken: e.target.checked })}
                                className="w-4 h-4 text-salesforce-blue rounded focus:ring-2 focus:ring-salesforce-blue"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Append Security Token
                              </span>
                            </label>
                          </div>

                          {form.loginWithToken && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Security Token
                              </label>
                              <input
                                type="password"
                                value={form.token || ''}
                                onChange={(e) => setForm({ ...form, token: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                              />
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              className="flex-1 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark transition-colors"
                            >
                              Save
                            </button>
                            {editing && (
                              <button
                                onClick={() => {
                                  setForm(getEmptyForm())
                                  setEditing(null)
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Org List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Saved Organizations ({orgs.length})
                    </h3>

                    {orgs.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p className="mb-4">No organizations added yet</p>
                        <p className="text-sm">Use OAuth to securely connect your Salesforce orgs</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orgs.map(org => (
                          <div
                            key={org.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900 truncate">
                                    {org.name}
                                  </h4>
                                  {org.authMethod === 'oauth' ? (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                      OAuth
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                                      Password
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    {org.loginType === 'sandbox' ? '🧪 Sandbox' : '🏢 Prod'}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-600 truncate mb-1">
                                  {org.instanceUrl}
                                </p>
                                
                                {org.username && (
                                  <p className="text-xs text-gray-500">
                                    {org.username}
                                  </p>
                                )}
                                
                                {org.tokenExpiry && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Token expires: {new Date(org.tokenExpiry).toLocaleString()}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 ml-4">
                                {org.authMethod === 'oauth' && (
                                  <>
                                    <button
                                      onClick={() => handleRefreshToken(org)}
                                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                    >
                                      Refresh Token
                                    </button>
                                    <button
                                      onClick={() => handleRevokeToken(org)}
                                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                      Revoke
                                    </button>
                                  </>
                                )}
                                {org.authMethod === 'password' && (
                                  <button
                                    onClick={() => {
                                      setForm(org)
                                      setEditing(org.id)
                                    }}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                  >
                                    Edit
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(org.id)}
                                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* OAuth Setup Tab */}
            {activeTab === 'oauth' && (
              <div className="max-w-3xl">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">OAuth Configuration</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions</h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Create a Connected App in Salesforce Setup</li>
                      <li>Enable OAuth Settings with callback URL: <code className="bg-blue-100 px-2 py-0.5 rounded">{chrome.identity.getRedirectURL()}</code></li>
                      <li>Select scopes: <strong>api</strong>, <strong>web</strong>, <strong>refresh_token</strong></li>
                      <li>Copy Consumer Key (Client ID) and Consumer Secret below</li>
                    </ol>
                  </div>

                  {/* Production Config */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">🏢 Production Orgs</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consumer Key (Client ID)
                        </label>
                        <input
                          id="prod-client-id"
                          type="text"
                          defaultValue={oauthConfigs.prod?.clientId || ''}
                          placeholder="3MVG9..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consumer Secret (Optional)
                        </label>
                        <input
                          id="prod-client-secret"
                          type="password"
                          defaultValue={oauthConfigs.prod?.clientSecret || ''}
                          placeholder="Leave empty for public client"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveOAuthConfig('prod')}
                        className="px-6 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark transition-colors"
                      >
                        Save Production Config
                      </button>
                    </div>
                  </div>

                  {/* Sandbox Config */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">🧪 Sandbox Orgs</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consumer Key (Client ID)
                        </label>
                        <input
                          id="sandbox-client-id"
                          type="text"
                          defaultValue={oauthConfigs.sandbox?.clientId || ''}
                          placeholder="3MVG9..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consumer Secret (Optional)
                        </label>
                        <input
                          id="sandbox-client-secret"
                          type="password"
                          defaultValue={oauthConfigs.sandbox?.clientSecret || ''}
                          placeholder="Leave empty for public client"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveOAuthConfig('sandbox')}
                        className="px-6 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark transition-colors"
                      >
                        Save Sandbox Config
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="max-w-3xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        All stored credentials are encrypted using AES-256 with your master password.
                        The master password is stored only in session memory and never persisted to disk.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          ✓ Master password active for this session
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">OAuth Tokens</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        OAuth tokens are encrypted and stored locally. Access tokens expire after 2 hours
                        and are automatically refreshed using the refresh token.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Tokens are never transmitted outside of Salesforce OAuth endpoints</li>
                        <li>Refresh tokens allow seamless re-authentication without passwords</li>
                        <li>You can revoke access at any time from the Orgs tab</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Use OAuth instead of password authentication whenever possible</li>
                        <li>Choose a strong master password (12+ characters recommended)</li>
                        <li>Review connected orgs regularly and remove unused ones</li>
                        <li>Revoke tokens for orgs you no longer use</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Change Master Password</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Changing your master password will re-encrypt all stored credentials.
                      </p>
                      <button
                        onClick={async () => {
                          const newPass = prompt('Enter new master password (min 6 characters):')
                          if (!newPass || newPass.length < 6) {
                            setMessage('Password must be at least 6 characters')
                            return
                          }
                          
                          // Re-encrypt with new password
                          const encrypted = encryptOrgArray(orgs, newPass)
                          await chrome.storage.local.set({ orgsEncrypted: encrypted })
                          await chrome.storage.session.set({ 
                            masterPassPlain: newPass,
                            masterHash: hashMasterPassword(newPass)
                          })
                          
                          setMasterPass(newPass)
                          setMessage('✓ Master password changed successfully')
                        }}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Change Password
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Danger Zone</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        These actions cannot be undone.
                      </p>
                      <button
                        onClick={async () => {
                          if (!confirm('Delete ALL stored data? This cannot be undone!')) return
                          
                          await chrome.storage.local.clear()
                          await chrome.storage.session.clear()
                          
                          setOrgs([])
                          setOauthConfigs({})
                          setUnlocked(false)
                          setMasterPass('')
                          setMessage('✓ All data deleted')
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete All Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<OptionsApp />)
