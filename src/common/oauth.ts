import type { OAuthConfig, OAuthResponse } from '../types'

export function buildAuthUrl(config: OAuthConfig): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'api web refresh_token',
    prompt: 'login'
  })
  
  return `${config.loginUrl}/services/oauth2/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(
  code: string,
  config: OAuthConfig
): Promise<OAuthResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret || '',
    redirect_uri: config.redirectUri
  })

  const response = await fetch(`${config.loginUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

export async function refreshAccessToken(
  refreshToken: string,
  config: OAuthConfig
): Promise<OAuthResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret || ''
  })

  const response = await fetch(`${config.loginUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`)
  }

  return response.json()
}

export async function revokeToken(
  token: string,
  loginUrl: string
): Promise<void> {
  const params = new URLSearchParams({ token })
  
  await fetch(`${loginUrl}/services/oauth2/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
}