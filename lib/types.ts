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
}

export interface MapNucleo extends Nucleo {
  groupName: string
}

export interface StatsData {
  nucleos: number
  groups: number
  educators: number
  countries: number
}
