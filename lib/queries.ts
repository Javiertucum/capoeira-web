import 'server-only'

import type { Group, MapNucleo, PublicUserProfile, StatsData } from './types'
import { adminDb } from './firebase-admin'

type FirestoreRecord = Record<string, unknown>

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
  }
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
  }
}

export async function getStats(): Promise<StatsData> {
  const [usersSnap, groupsSnap, nucleosSnap] = await Promise.all([
    adminDb.collection('usersPublic').get(),
    adminDb.collection('groups').get(),
    adminDb.collectionGroup('nucleos').get(),
  ])

  const educators = usersSnap.docs.filter((doc) => {
    const data = doc.data() as FirestoreRecord
    return data.role === 'educator' || data.educatorEligible === true
  }).length

  const countries = new Set(
    usersSnap.docs
      .map((doc) => asNullableString((doc.data() as FirestoreRecord).country))
      .filter((country): country is string => Boolean(country))
  ).size

  return {
    nucleos: nucleosSnap.size,
    groups: groupsSnap.size,
    educators,
    countries,
  }
}

export async function getAllNucleos(): Promise<MapNucleo[]> {
  const [nucleosSnap, groupsSnap] = await Promise.all([
    adminDb.collectionGroup('nucleos').get(),
    adminDb.collection('groups').get(),
  ])

  const groupNames = new Map(
    groupsSnap.docs.map((doc) => {
      const data = doc.data() as FirestoreRecord
      return [doc.id, asString(data.name) ?? ''] as const
    })
  )

  return nucleosSnap.docs.map((doc) => {
    const parent = doc.ref.parent.parent
    const groupId = parent?.id ?? ''
    const groupName = groupNames.get(groupId) ?? ''
    return mapMapNucleo(doc.id, groupId, groupName, doc.data() as FirestoreRecord)
  })
}

export async function getFeaturedEducators(): Promise<PublicUserProfile[]> {
  const snap = await adminDb
    .collection('usersPublic')
    .where('role', '==', 'educator')
    .get()

  return snap.docs
    .sort((left, right) => {
      const leftCreatedAt = asSortTimestamp((left.data() as FirestoreRecord).createdAt)
      const rightCreatedAt = asSortTimestamp((right.data() as FirestoreRecord).createdAt)
      return rightCreatedAt - leftCreatedAt
    })
    .slice(0, 8)
    .map((doc) => mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord))
}

export async function getEducatorProfile(uid: string): Promise<PublicUserProfile | null> {
  const doc = await adminDb.collection('usersPublic').doc(uid).get()
  if (!doc.exists) return null
  return mapPublicUserProfile(doc.id, doc.data() as FirestoreRecord)
}

export async function getGroupWithNucleos(
  groupId: string
): Promise<{ group: Group; nucleos: MapNucleo[] } | null> {
  const [groupDoc, nucleosSnap] = await Promise.all([
    adminDb.collection('groups').doc(groupId).get(),
    adminDb.collection('groups').doc(groupId).collection('nucleos').get(),
  ])

  if (!groupDoc.exists) return null

  const group = mapGroup(groupDoc.id, groupDoc.data() as FirestoreRecord)
  const nucleos = nucleosSnap.docs.map((doc) =>
    mapMapNucleo(doc.id, groupId, group.name, doc.data() as FirestoreRecord)
  )

  return { group, nucleos }
}

export async function getAllGroups(): Promise<Group[]> {
  const snap = await adminDb.collection('groups').get()
  return snap.docs.map((doc) => mapGroup(doc.id, doc.data() as FirestoreRecord))
}
