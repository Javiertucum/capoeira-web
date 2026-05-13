type FirestoreLikeRecord = Record<string, unknown>

export function resolveAdminUserAppVersion(
  publicData: FirestoreLikeRecord,
  privateData: FirestoreLikeRecord,
): string {
  if (typeof publicData.appVersion === 'string') return publicData.appVersion
  if (typeof privateData.appVersion === 'string') return privateData.appVersion
  return ''
}
