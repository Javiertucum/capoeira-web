export type SegmentFilter = {
  roles?: string[]
  countries?: string[]
  groupIds?: string[]
  nucleoIds?: string[]
  subscriptionPlans?: string[]
  userIds?: string[]
  noGroup?: boolean
  languages?: string[]
  /** Ej. ["3.0.30", "3.0.29"] — incluye solo usuarios cuya appVersion coincide exactamente con alguna de estas. */
  appVersions?: string[]
  /** Si se define, excluye usuarios sin appVersion registrada (ej. cuentas viejas nunca abiertas tras el cambio). */
  requireAppVersion?: boolean
}

export type TokenEntry = {
  uid: string
  token: string
  displayName: string
  email: string
}

export type RawUserDoc = {
  id: string
  fcmToken: unknown
  displayName: unknown
  email: unknown
  role: unknown
  country: unknown
  groupId: unknown
  nucleoIds?: unknown
  language?: unknown
  appVersion?: unknown
  [key: string]: unknown
}

/**
 * Compara dos versiones semver-like ("3.0.30" vs "3.0.9") segmento a segmento
 * — a diferencia de comparar strings, "3.0.9" > "3.0.30" si se comparara
 * lexicográficamente. Segmentos faltantes cuentan como 0.
 * Retorna negativo si a < b, positivo si a > b, 0 si son iguales.
 */
export function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map((n) => parseInt(n, 10) || 0)
  const partsB = b.split('.').map((n) => parseInt(n, 10) || 0)
  const len = Math.max(partsA.length, partsB.length)
  for (let i = 0; i < len; i += 1) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}

/** Pure filtering logic — no I/O. Exported for testing. */
export function filterUserDocs(users: RawUserDoc[], segment: SegmentFilter): TokenEntry[] {
  const individualUids = new Set(segment.userIds ?? [])
  const baseEntries: TokenEntry[] = []
  const individualEntries: TokenEntry[] = []

  for (const data of users) {
    const token = typeof data.fcmToken === 'string' ? data.fcmToken.trim() : ''
    if (!token) continue

    const entry: TokenEntry = {
      uid: data.id,
      token,
      displayName: typeof data.displayName === 'string' ? data.displayName : '',
      email: typeof data.email === 'string' ? data.email : '',
    }

    if (individualUids.has(data.id)) {
      individualEntries.push(entry)
      continue
    }

    if (segment.roles && segment.roles.length > 0) {
      const role = typeof data.role === 'string' ? data.role : 'student'
      if (!segment.roles.includes(role)) continue
    }

    if (segment.countries && segment.countries.length > 0) {
      const country = typeof data.country === 'string' ? data.country : null
      if (!country || !segment.countries.includes(country)) continue
    }

    if (segment.languages && segment.languages.length > 0) {
      const language = typeof data.language === 'string' ? data.language : null
      if (!language || !segment.languages.includes(language)) continue
    }

    if ((segment.appVersions && segment.appVersions.length > 0) || segment.requireAppVersion) {
      const appVersion = typeof data.appVersion === 'string' ? data.appVersion : null
      // Sin versión registrada no se puede saber si coincide con lo pedido — se excluye.
      if (!appVersion) continue
      if (segment.appVersions && segment.appVersions.length > 0 && !segment.appVersions.includes(appVersion)) continue
    }

    const hasGroupFilter =
      (segment.groupIds && segment.groupIds.length > 0) ||
      (segment.nucleoIds && segment.nucleoIds.length > 0) ||
      segment.noGroup
    if (hasGroupFilter) {
      const groupId = typeof data.groupId === 'string' ? data.groupId : null
      const userNucleoIds = Array.isArray(data.nucleoIds) ? (data.nucleoIds as string[]) : []
      const inSelectedGroup =
        segment.groupIds && segment.groupIds.length > 0 && groupId !== null && segment.groupIds.includes(groupId)
      const inSelectedNucleo =
        segment.nucleoIds && segment.nucleoIds.length > 0 && userNucleoIds.some((id) => segment.nucleoIds!.includes(id))
      const isUngrouped = segment.noGroup === true && !groupId
      if (!inSelectedGroup && !inSelectedNucleo && !isUngrouped) continue
    }

    baseEntries.push(entry)
  }

  // Union: base + individuals (deduplicated)
  const seen = new Set(baseEntries.map((e) => e.uid))
  for (const entry of individualEntries) {
    if (!seen.has(entry.uid)) {
      baseEntries.push(entry)
      seen.add(entry.uid)
    }
  }

  return baseEntries
}
