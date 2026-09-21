export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL || ''

export const GOOGLE_PLAY_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || ''

export function joinDeepLink(token: string) {
  return `invayt://join/${encodeURIComponent(token)}`
}

export function payDeepLink(matchId: string) {
  return `invayt://pay/${encodeURIComponent(matchId)}`
}