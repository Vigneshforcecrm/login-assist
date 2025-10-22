import CryptoJS from 'crypto-js'
import type { SalesforceOrg } from '../types'

export function encryptOrgArray(orgArray: SalesforceOrg[], masterPass: string): string {
  const plaintext = JSON.stringify(orgArray)
  return CryptoJS.AES.encrypt(plaintext, masterPass).toString()
}

export function decryptOrgArray(ciphertext: string, masterPass: string): SalesforceOrg[] {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, masterPass)
    const plain = bytes.toString(CryptoJS.enc.Utf8)
    if (!plain) return []
    return JSON.parse(plain)
  } catch (e) {
    console.error('decryptOrgArray failed', e)
    return []
  }
}

export function hashMasterPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}