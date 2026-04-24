export interface PublicUserProfile {
  uid: string
  name: string
  surname: string
  nickname?: string | null
  role: 'student' | 'educator'
  groupId?: string | null
  nucleoIds?: string[]
  graduationLevelId?: string | null
  avatarUrl?: string | null
  bio?: string | null
  country?: string | null
  educatorEligible?: boolean
  socialLinks?: {
    instagram?: string | null
    facebook?: string | null
    whatsapp?: string | null
    youtube?: string | null
    tiktok?: string | null
    website?: string | null
  }
  createdAt?: string
  moderation?: PublicModerationState
}

export interface PublicModerationState {
  state?: 'visible' | 'hidden' | 'suspended'
  reason?: string | null
  note?: string | null
}

export interface Group {
  id: string
  name: string
  logoUrl?: string | null
  adminUserIds?: string[]
  coAdminIds?: string[]
  memberCount?: number
  graduationSystemName?: string | null
  representedCountries?: string[]
  representedCities?: string[]
  moderation?: PublicModerationState
}

export interface Nucleo {
  id: string
  groupId: string
  name: string
  country?: string | null
  city?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  responsibleEducatorId?: string | null
  coEducatorIds?: string[]
  schedules?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
  moderation?: PublicModerationState
}

export interface MapNucleo extends Nucleo {
  groupName: string
}

export interface GraduationLevel {
  id: string
  name: string
  order: number
  colors: string[]
  tipColorLeft?: string | null
  tipColorRight?: string | null
  isSpecial?: boolean
  isEstagiario?: boolean
  isEducator?: boolean
  category?: 'infantil' | 'juvenil' | 'adult' | null
  description?: string | null
}

export interface StatsData {
  nucleos: number
  groups: number
  educators: number
  countries: number
}
