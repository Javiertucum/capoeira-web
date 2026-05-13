export type SegmentFilter = {
  roles?: string[]
  countries?: string[]
  appVersions?: string[]
  groupIds?: string[]
  nucleoIds?: string[]
  subscriptionPlans?: string[]
  userIds?: string[]
  noGroup?: boolean
  adminsOnly?: boolean
  adminUids?: string[]
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
  appVersion?: unknown
  role: unknown
  country: unknown
  groupId: unknown
  nucleoIds?: unknown
  [key: string]: unknown
}

/** Pure filtering logic — no I/O. Exported for testing. */
export function filterUserDocs(users: RawUserDoc[], segment: SegmentFilter): TokenEntry[] {
  const individualUids = new Set(segment.userIds ?? [])
  const resolvedAdminUids = new Set(segment.adminUids ?? [])
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

    const isResolvedAdmin = segment.adminsOnly === true && resolvedAdminUids.has(data.id)

    if (segment.adminsOnly === true && !isResolvedAdmin) {
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

    if (segment.appVersions && segment.appVersions.length > 0) {
      const appVersion = typeof data.appVersion === 'string' ? data.appVersion : null
      if (!appVersion || !segment.appVersions.includes(appVersion)) continue
    }

    const hasGroupFilter = (segment.groupIds && segment.groupIds.length > 0) || segment.noGroup
    if (hasGroupFilter && !isResolvedAdmin) {
      const groupId = typeof data.groupId === 'string' ? data.groupId : null
      const inSelected =
        segment.groupIds && segment.groupIds.length > 0 && groupId !== null && segment.groupIds.includes(groupId)
      const isUngrouped = segment.noGroup === true && !groupId
      if (!inSelected && !isUngrouped) continue
    }

    if (segment.nucleoIds && segment.nucleoIds.length > 0 && !isResolvedAdmin) {
      const userNucleoIds = Array.isArray(data.nucleoIds)
        ? data.nucleoIds.filter((value): value is string => typeof value === 'string')
        : []
      const matchesNucleo = userNucleoIds.some((nucleoId) => segment.nucleoIds?.includes(nucleoId))
      if (!matchesNucleo) continue
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
