export interface SalesforceOrg {
  id: string
  name: string
  instanceUrl: string
  loginType: 'prod' | 'sandbox'
  group?: string
  authMethod: 'oauth' | 'password'
  
  // OAuth fields
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: number
  
  // Password fields (legacy support)
  username?: string
  password?: string
  token?: string
  loginWithToken?: boolean
  
  lastUsed?: string
  createdAt: string
}

export interface OAuthConfig {
  clientId: string
  clientSecret?: string
  redirectUri: string
  loginUrl: string
}

export interface StorageData {
  orgsEncrypted?: string
  oauthConfigs?: Record<string, OAuthConfig>
  masterHash?: string
}

export interface BackgroundMessage {
  action: 'openAndLogin' | 'startOAuth' | 'refreshToken' | 'revokeToken'
  org?: SalesforceOrg
  loginType?: 'prod' | 'sandbox'
  orgId?: string
}

export interface OAuthResponse {
  access_token: string
  refresh_token?: string
  instance_url: string
  id: string
  issued_at: string
  signature: string
}