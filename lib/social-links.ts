type SocialPlatform = 'instagram' | 'facebook' | 'whatsapp' | 'youtube' | 'tiktok' | 'website'

const HANDLE_BASE_URLS: Record<Exclude<SocialPlatform, 'whatsapp' | 'website'>, string> = {
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  youtube: 'https://youtube.com/',
  tiktok: 'https://tiktok.com/@',
}

function hasProtocol(value: string) {
  return /^https?:\/\//i.test(value)
}

function looksLikeDomain(value: string) {
  return /^[a-z0-9.-]+\.[a-z]{2,}/i.test(value)
}

function cleanHandle(value: string) {
  return value.trim().replace(/^@+/, '').replace(/^\/+|\/+$/g, '')
}

export function normalizeSocialLink(
  platform: SocialPlatform,
  value: string | null | undefined
) {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  if (platform === 'whatsapp') {
    const digits = trimmed.replace(/\D/g, '')
    return digits ? `https://wa.me/${digits}` : null
  }

  if (hasProtocol(trimmed)) {
    return trimmed
  }

  if (platform === 'website') {
    return looksLikeDomain(trimmed) ? `https://${trimmed}` : null
  }

  if (looksLikeDomain(trimmed)) {
    return `https://${trimmed}`
  }

  const cleaned = cleanHandle(trimmed)
  if (!cleaned) return null

  if (platform === 'tiktok') {
    return `${HANDLE_BASE_URLS.tiktok}${cleaned.replace(/^@+/, '')}`
  }

  return `${HANDLE_BASE_URLS[platform]}${cleaned}`
}
