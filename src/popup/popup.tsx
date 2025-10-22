import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import { decryptOrgArray } from '../common/crypto'
import type { SalesforceOrg, BackgroundMessage } from '../types'

function App() {
  const [orgs, setOrgs] = useState<SalesforceOrg[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrgs()
  }, [])

  async function loadOrgs() {
    try {
      const session = await chrome.storage.session.get(['masterPassPlain'])
      if (!session.masterPassPlain) {
        setMessage('Open settings to unlock')
        setLoading(false)
        return
      }

      const storage = await chrome.storage.local.get(['orgsEncrypted'])
      if (!storage.orgsEncrypted) {
        setOrgs([])
        setLoading(false)
        return
      }

      const arr = decryptOrgArray(storage.orgsEncrypted, session.masterPassPlain)
      setOrgs(arr)
    } catch (err) {
      setMessage('Failed to load orgs')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(org: SalesforceOrg) {
    const msg: BackgroundMessage = { action: 'openAndLogin', org }
    chrome.runtime.sendMessage(msg)
    setMessage(`Opening ${org.name}...`)
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div className="bg-gradient-to-br from-salesforce-light to-white min-h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-salesforce-dark">
              SF OAuth Assistant
            </h1>
            <p className="text-xs text-gray-600">Secure OAuth access</p>
          </div>
          <button
            onClick={openOptions}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Settings
          </button>
        </div>

        {message && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            {message}
          </div>
        )}

        <div className="space-y-2">
          {loading && (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          )}
          
          {!loading && orgs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">No orgs configured</p>
              <button
                onClick={openOptions}
                className="px-4 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark"
              >
                Add Org
              </button>
            </div>
          )}

          {orgs.map(org => (
            <div
              key={org.id}
              className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {org.name}
                    </h3>
                    {org.authMethod === 'oauth' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        OAuth
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {org.instanceUrl}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {org.loginType === 'sandbox' ? '🧪 Sandbox' : '🏢 Production'}
                  </div>
                </div>
                <button
                  onClick={() => handleLogin(org)}
                  className="ml-3 px-4 py-2 bg-salesforce-blue text-white text-sm rounded-lg hover:bg-salesforce-dark transition-colors"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)