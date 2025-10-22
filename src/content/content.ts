// Content script for Salesforce login pages
(() => {
  if ((window as any).__sf_oauth_injected) return
  ;(window as any).__sf_oauth_injected = true

  const container = document.createElement('div')
  container.id = 'sf-oauth-assistant'
  container.className = 'fixed top-4 right-4 z-[999999] font-sans'

  container.innerHTML = `
    <div class="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold text-gray-900">Quick Access</h3>
        <a href="${chrome.runtime.getURL('src/options/index.html')}" 
           target="_blank" 
           class="text-xs text-blue-600 hover:text-blue-800">
          Manage
        </a>
      </div>
      <div id="orgListContent" class="text-sm text-gray-600">
        Loading...
      </div>
    </div>
  `

  document.body.appendChild(container)

  async function loadOrgs() {
    try {
      const session = await chrome.storage.session.get(['masterPassPlain'])
      if (!session.masterPassPlain) {
        showMessage('Unlock in extension to see orgs')
        return
      }

      const storage = await chrome.storage.local.get(['orgsEncrypted'])
      if (!storage.orgsEncrypted) {
        showMessage('No orgs configured')
        return
      }

      // Send message to background to decrypt
      chrome.runtime.sendMessage(
        { action: 'getOrgs' },
        (response) => {
          if (response?.orgs) {
            renderOrgs(response.orgs)
          }
        }
      )
    } catch (err) {
      showMessage('Error loading orgs')
    }
  }

  function showMessage(msg: string) {
    const el = document.getElementById('orgListContent')
    if (el) el.textContent = msg
  }

  function renderOrgs(orgs: any[]) {
    const el = document.getElementById('orgListContent')
    if (!el) return

    const isTest = window.location.hostname.includes('test')
    const filtered = orgs.filter((o: any) => 
      isTest ? o.loginType === 'sandbox' : o.loginType === 'prod'
    )

    if (filtered.length === 0) {
      el.innerHTML = '<p class="text-gray-500">No orgs for this login page</p>'
      return
    }

    el.innerHTML = filtered.map((o: any) => `
      <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-900 truncate">${o.name}</div>
          <div class="text-xs text-gray-500 truncate">
            ${o.authMethod === 'oauth' ? '🔒 OAuth' : o.username}
          </div>
        </div>
        <button 
          class="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          data-org-id="${o.id}">
          Open
        </button>
      </div>
    `).join('')

    el.querySelectorAll('button[data-org-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orgId = (e.target as HTMLElement).dataset.orgId
        const org = filtered.find((o: any) => o.id === orgId)
        if (org) {
          chrome.runtime.sendMessage({ action: 'openAndLogin', org })
        }
      })
    })
  }

  setTimeout(loadOrgs, 500)
})()