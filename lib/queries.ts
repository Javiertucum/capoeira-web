import 'server-only'

import type { Group, GraduationLevel, MapNucleo, PublicUserProfile, StatsData } from './types'
import { adminDb } from './firebase-admin'
import { FieldPath } from 'firebase-admin/firestore'

type FirestoreRecord = Record<string, unknown>
type VisibilityOptions = { includeHidden?: boolean }

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const items = value.filter((item): item is string => typeof item === 'string')
  return items.length > 0 ? items : []
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function asNullableString(value: unknown): string | null | undefined {
  if (value === null) return null
  return asString(value)
}

function asRecord(value: unknown): FirestoreRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as FirestoreRecord)
    : undefined
}

function isPubliclyVisible(data: FirestoreRecord | undefined): boolean {
  const moderation = asRecord(data?.moderation)
  const state = asString(moderation?.state)
  return state !== 'hidden' && state !== 'suspended'
}

function mapModerationState(data: FirestoreRecord): PublicUserProfile['moderation'] {
  const moderation = asRecord(data.moderation)
  if (!moderation) return undefined
  const state = asString(moderation.state)
  if (state !== 'visible' && state !== 'hidden' && state !== 'suspended') return undefined
  return {
    state,
    reason: asNullableString(moderation.reason),
    note: asNullableString(moderation.note),
  }
}

function asNucleoSchedules(value: unknown): MapNucleo['schedules'] | undefined {
  if (!Array.isArray(value)) return undefined

  const schedules = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const schedule = item as Record<string, unknown>
      const dayOfWeek = asNumber(schedule.dayOfWeek)
      const startTime = asString(schedule.startTime)
      const endTime = asString(schedule.endTime)
      if (dayOfWeek === undefined || startTime === undefined || endTime === undefined) {
        return null
      }
      return { dayOfWeek, startTime, endTime }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return schedules
}

function asSortTimestamp(value: unknown): number {
  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const time = new Date(value).getTime()
    return Number.isFinite(time) ? time : 0
  }

  if (
    value &&
    typeof value === 'object' &&
    'toMillis' in value &&
    typeof (value as { toMillis?: unknown }).toMillis === 'function'
  ) {
    return ((value as { toMillis: () => number }).toMillis() ?? 0)
  }

  return 0
}

function mapPublicUserProfile(
  id: string,
  data: FirestoreRecord
): PublicUserProfile {
  const socialLinks = data.socialLinks
  const socialLinksObject =
    socialLinks && typeof socialLinks === 'object' && !Array.isArray(socialLinks)
      ? (socialLinks as Record<string, unknown>)
      : undefined

  return {
    uid: id,
    name: asString(data.name) ?? '',
    surname: asString(data.surname) ?? '',
    nickname: asNullableString(data.nickname),
    role: data.role === 'educator' ? 'educator' : 'student',
    groupId: asNullableString(data.groupId),
    nucleoIds: asStringArray(data.nucleoIds),
    graduationLevelId: asNullableString(data.graduationLevelId),
    avatarUrl: asNullableString(data.avatarUrl),
    bio: asNullableString(data.bio),
    country: asNullableString(data.country),
    educatorEligible: asBoolean(data.educatorEligible),
    socialLinks: socialLinksObject
      ? {
          instagram: asNullableString(socialLinksObject.instagram),
          facebook: asNullableString(socialLinksObject.facebook),
          whatsapp: asNullableString(socialLinksObject.whatsapp),
          youtube: asNullableString(socialLinksObject.youtube),
          tiktok: asNullableString(socialLinksObject.tiktok),
          website: asNullableString(socialLinksObject.website),
        }
      : undefined,
    createdAt: asNullableString(data.createdAt) ?? undefined,
    moderation: mapModerationState(data),
  }
}

function mapGroup(id: string, data: FirestoreRecord): Group {
  return {
    id,
    name: asString(data.name) ?? '',
    logoUrl: asNullableString(data.logoUrl),
    adminUserIds: asStringArray(data.adminUserIds),
    coAdminIds: asStringArray(data.coAdminIds),
    memberCount: asNumber(data.memberCount),
    graduationSystemName: asNullableString(data.graduationSystemName),
    representedCountries: asStringArray(data.representedCountries),
    representedCities: asStringArray(data.representedCities),
    moderation: mapModerationState(data),
  }
}

export async function getGroup(id: string, options: VisibilityOptions = {}): Promise<Group | null> {
  const doc = await adminDb.collection('groups').doc(id).get()
  if (!doc.exists) return null
  if (!options.includeHidden && !isPubliclyVisible(doc.data() as FirestoreRecord)) return null
  return mapGroup(doc.id, doc.data() as FirestoreRecord)
}

function mapMapNucleo(
  id: string,
  groupId: string,
  groupName: string,
  data: FirestoreRecord
): MapNucleo {
  return {
    id,
    groupId,
    groupName,
    name: asString(data.name) ?? '',
    country: asNullableString(data.country),
    city: asNullableString(data.city),
    address: asNullableString(data.address),
    latitude: asNumber(data.latitude),
    longitude: asNumber(data.longitude),
    responsibleEducatorId: asNullableString(data.responsibleEducatorId),
    coEducatorIds: asStringArray(data.coEducatorIds),
    schedules: asNucleoSchedules(data.schedules),
    moderation: mapModerationState(data),
  }
}

export async function getStats(): Promise<StatsData> {
  const [usersSnap, groupsSnap, nucleosSnap] = await Promise.all([
    adminDb.collection('usersPublic').get(),
    adminDb.collection('groups').get(),
    adminDb.collectionGroup('nucleos').get(),
  ])

  const visibleUserDocs = usersSnap.docs.filter((doc) =>
    isPubliclyVisible(doc.data() as FirestoreRecord)
  )
  const visibleGroupDocs = groupsSnap.docs.filter((doc) =>
    isPubliclyVisible(doc.data() as FirestoreRecord)
  )
  const visibleNucleoDocs = nucleosSnap.docs.filter((doc) =>
    isPubliclyVisible(doc.data() as FirestoreRecord)
  )

  const educators = visibleUserDocs.filter((doc) => {
    const data = doc.data() as FirestoreRecord
    return data.role === 'educator' || data.educatorEligible === true
  }).length

  const countries = new Set(
    visibleUserDocs
      .map((doc) => asNullableString((doc.data() as FirestoreRecord).country))
      .filter((country): country is string => Boolean(country))
  ).size

  return {
    nucleos: visibleNucleoDocs.length,
    groups: visibleGroupDocs.length,
    educators,
    countries,
  }
}

export async function getAllNucleos(options: VisibilityOptions = {}): Promise<MapNucleo[]> {
  const [nucleosSnap, groupsSnap] = await Promise.all([
    adminDb.collectionGroup('nucleos').get(),
    adminDb.collection('groups').get(),
  ])

  const visibleGroupDocs = groupsSnap.docs.filter((doc) =>
    options.includeHidden || isPubliclyVisible(doc.data() as FirestoreRecord)
  )
  const groupNames = new Map(
    visibleGroupDocs.map((doc) => {
      const data = doc.data() as FirestoreRecord
      return [doc.id, asString(data.name) ?? ''] as const
    })
  )

  return nucleosSnap.docs
    .filter((doc) => options.includeHidden || isPubliclyVisible(doc.data() as FirestoreRecord))
    .map((doc) => {
      const parent = doc.ref.parent.parent
      const groupId = parent?.id ?? ''
      const groupName = groupNames.get(groupId)
      if (!options.includeHidden && groupName === undefined) return null
      return mapMapNucleo(doc.id, groupId, groupName ?? '', doc.data() as FirestoreRecord)
    })
    .filter((nucleo): nucleo is MapNucleo => nucleo !== null)
}

export async function getFeaturedEducators(): Promise<PublicUserProfile[]> {
  const featuredSnap = await adminDb
    .collection('adminFeaturedContent')
    .where('active', '==', true)
    .where('entityType', '==', 'user')
    .get()
    .catch(() => ({ docs: [] as FirebaseFirestore.QueryDocumentSnapshot[] }))

  if (featuredSnap.docs.length > 0) {
    const featured = featuredSnap.docs
      .map((doc) => doc.data() as FirestoreRecord)
      .sort((left, right) => (asNumber(left.order) ?? 999) - (asNumber(right.order) ?? 999))
      .slice(0, 8)

    const docs = await Promise.all(
      featured.map((item) => {
        const entityId = asString(item.entityId)
        return entityId ? adminDb.collection('usersPublic').doc(entityId).get() : null
      })
    )

    const educators = docs
      .filter((doc): doc is FirebaseFirestore.DocumentSnapshot => Boolean(doc?.exists))
      .filter((doc) => {
        const data = doc.data() as FirestoreRecord
        return data.role === 'educator' && isPubliclyVisible(data)
      })
      .map((doc) => mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord))

    if (educators.length > 0) return educators
  }

  const snap = await adminDb
    .collection('usersPublic')
    .where('role', '==', 'educator')
    .get()

  return snap.docs
    .filter((doc) => isPubliclyVisible(doc.data() as FirestoreRecord))
    .sort((left, right) => {
      const leftCreatedAt = asSortTimestamp((left.data() as FirestoreRecord).createdAt)
      const rightCreatedAt = asSortTimestamp((right.data() as FirestoreRecord).createdAt)
      return rightCreatedAt - leftCreatedAt
    })
    .slice(0, 8)
    .map((doc) => mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord))
}

export async function getAllEducators(): Promise<PublicUserProfile[]> {
  const snap = await adminDb
    .collection('usersPublic')
    .where('role', '==', 'educator')
    .get()

  return snap.docs
    .filter((doc) => isPubliclyVisible(doc.data() as FirestoreRecord))
    .map((doc) => mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord))
}

export async function getEducatorProfile(uid: string): Promise<PublicUserProfile | null> {
  const doc = await adminDb.collection('usersPublic').doc(uid).get()
  if (!doc.exists) return null
  if (!isPubliclyVisible(doc.data() as FirestoreRecord)) return null
  return mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord)
}

export async function getNucleosByEducator(uid: string, nucleoIds?: string[]): Promise<MapNucleo[]> {
  const queries = [
    adminDb.collectionGroup('nucleos').where('responsibleEducatorId', '==', uid).get(),
    adminDb.collectionGroup('nucleos').where('coEducatorIds', 'array-contains', uid).get(),
  ]

  if (nucleoIds && nucleoIds.length > 0) {
    // Firestore 'in' query supports up to 30 elements
    const chunks = []
    for (let i = 0; i < nucleoIds.length; i += 30) {
      chunks.push(nucleoIds.slice(i, i + 30))
    }
    chunks.forEach(chunk => {
      queries.push(adminDb.collectionGroup('nucleos').where(FieldPath.documentId(), 'in', chunk).get())
    })
  }

  const snapshots = await Promise.all([...queries, adminDb.collection('groups').get()])
  const groupsSnap = snapshots.pop() as FirebaseFirestore.QuerySnapshot
  const snaps = snapshots as FirebaseFirestore.QuerySnapshot[]

  const visibleGroupDocs = groupsSnap.docs.filter((doc) =>
    isPubliclyVisible(doc.data() as FirestoreRecord)
  )
  const groupNames = new Map(
    visibleGroupDocs.map((doc) => [doc.id, asString(doc.data().name) ?? ''] as const)
  )

  const seen = new Set<string>()
  const results: MapNucleo[] = []

  snaps.forEach((snap) => {
    snap.docs.forEach((doc) => {
      if (seen.has(doc.id)) return
      const data = doc.data() as FirestoreRecord
      if (!isPubliclyVisible(data)) return
      const parent = doc.ref.parent.parent
      const groupId = parent?.id ?? ''
      if (!groupNames.has(groupId)) return
      seen.add(doc.id)
      const groupName = groupNames.get(groupId) ?? ''
      results.push(mapMapNucleo(doc.id, groupId, groupName, data))
    })
  })

  return results
}

export async function getGraduationLevel(
  groupId: string,
  levelId: string
): Promise<string | null> {
  if (!groupId || !levelId) return null
  const doc = await adminDb
    .collection('groups')
    .doc(groupId)
    .collection('graduationLevels')
    .doc(levelId)
    .get()
  
  if (!doc.exists) return null
  return asString(doc.data()?.name) ?? null
}

export async function getGroupWithNucleos(
  groupId: string,
  options: VisibilityOptions = {}
): Promise<{ group: Group; nucleos: MapNucleo[] } | null> {
  const [groupDoc, nucleosSnap] = await Promise.all([
    adminDb.collection('groups').doc(groupId).get(),
    adminDb.collection('groups').doc(groupId).collection('nucleos').get(),
  ])

  if (!groupDoc.exists) return null
  if (!options.includeHidden && !isPubliclyVisible(groupDoc.data() as FirestoreRecord)) return null

  const group = mapGroup(groupDoc.id, groupDoc.data() as FirestoreRecord)
  const nucleos = nucleosSnap.docs
    .filter((doc) => options.includeHidden || isPubliclyVisible(doc.data() as FirestoreRecord))
    .map((doc) => mapMapNucleo(doc.id, groupId, group.name, doc.data() as FirestoreRecord))

  return { group, nucleos }
}

export async function getAllGroups(options: VisibilityOptions = {}): Promise<Group[]> {
  const snap = await adminDb.collection('groups').get()
  return snap.docs
    .filter((doc) => options.includeHidden || isPubliclyVisible(doc.data() as FirestoreRecord))
    .map((doc) => mapGroup(doc.id, doc.data() as FirestoreRecord))
}

export async function getGraduationLevelFull(
  groupId: string,
  levelId: string
): Promise<GraduationLevel | null> {
  if (!groupId || !levelId) return null
  const doc = await adminDb
    .collection('groups')
    .doc(groupId)
    .collection('graduationLevels')
    .doc(levelId)
    .get()
  if (!doc.exists) return null
  const d = doc.data() as FirestoreRecord
  const rawColors = d.colors
  const colors: string[] = Array.isArray(rawColors)
    ? rawColors.filter((c): c is string => typeof c === 'string')
    : []
  return {
    id: doc.id,
    name: asString(d.name) ?? '',
    order: asNumber(d.order) ?? 0,
    colors,
    tipColorLeft: asNullableString(d.tipColorLeft),
    tipColorRight: asNullableString(d.tipColorRight),
    isSpecial: asBoolean(d.isSpecial),
    isEstagiario: asBoolean(d.isEstagiario),
    isEducator: asBoolean(d.isEducator),
    category: (['infantil', 'juvenil', 'adult'] as const).includes(d.category as 'infantil' | 'juvenil' | 'adult')
      ? (d.category as 'infantil' | 'juvenil' | 'adult')
      : null,
    description: asNullableString(d.description),
  }
}

export async function getNucleoById(groupId: string, nucleoId: string): Promise<MapNucleo | null> {
  const [nucleoDoc, groupDoc] = await Promise.all([
    adminDb.collection('groups').doc(groupId).collection('nucleos').doc(nucleoId).get(),
    adminDb.collection('groups').doc(groupId).get(),
  ])
  if (!nucleoDoc.exists) return null
  if (!isPubliclyVisible(nucleoDoc.data() as FirestoreRecord)) return null
  if (groupDoc.exists && !isPubliclyVisible(groupDoc.data() as FirestoreRecord)) return null
  const groupName = groupDoc.exists ? (asString((groupDoc.data() as FirestoreRecord).name) ?? '') : ''
  return mapMapNucleo(nucleoDoc.id, groupId, groupName, nucleoDoc.data() as FirestoreRecord)
}

export async function getNucleoMembers(nucleoId: string): Promise<PublicUserProfile[]> {
  const snap = await adminDb
    .collection('usersPublic')
    .where('nucleoIds', 'array-contains', nucleoId)
    .get()
  return snap.docs
    .filter((doc) => isPubliclyVisible(doc.data() as FirestoreRecord))
    .map((doc) => mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord))
}

export async function getGroupEducators(groupId: string): Promise<PublicUserProfile[]> {
  const snap = await adminDb
    .collection('usersPublic')
    .where('groupId', '==', groupId)
    .where('role', '==', 'educator')
    .get()
  return snap.docs
    .filter((doc) => isPubliclyVisible(doc.data() as FirestoreRecord))
    .map((doc) => mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord))
}

export async function getGraduationLevels(groupId: string): Promise<GraduationLevel[]> {
  const snap = await adminDb
    .collection('groups')
    .doc(groupId)
    .collection('graduationLevels')
    .orderBy('order', 'asc')
    .get()

  return snap.docs.map((doc) => {
    const d = doc.data() as FirestoreRecord
    const rawColors = d.colors
    const colors: string[] = Array.isArray(rawColors)
      ? rawColors.filter((c): c is string => typeof c === 'string')
      : []

    return {
      id: doc.id,
      name: asString(d.name) ?? '',
      order: asNumber(d.order) ?? 0,
      colors,
      tipColorLeft: asNullableString(d.tipColorLeft),
      tipColorRight: asNullableString(d.tipColorRight),
      isSpecial: asBoolean(d.isSpecial),
      isEstagiario: asBoolean(d.isEstagiario),
      isEducator: asBoolean(d.isEducator),
      category: (['infantil', 'juvenil', 'adult'] as const).includes(d.category as 'infantil' | 'juvenil' | 'adult')
        ? (d.category as 'infantil' | 'juvenil' | 'adult')
        : null,
      description: asNullableString(d.description),
    }
  })
}
