const COUNTRY_TO_ISO: Record<string, string> = {
  // Spanish / Portuguese / English names used across the app (accents stripped — input is normalized before lookup)
  brasil: 'BR', brazil: 'BR',
  chile: 'CL',
  argentina: 'AR',
  mexico: 'MX',
  colombia: 'CO',
  peru: 'PE',
  uruguay: 'UY',
  paraguay: 'PY',
  bolivia: 'BO',
  ecuador: 'EC',
  venezuela: 'VE',
  'costa rica': 'CR',
  panama: 'PA',
  guatemala: 'GT',
  honduras: 'HN',
  'el salvador': 'SV',
  nicaragua: 'NI',
  'republica dominicana': 'DO', 'dominican republic': 'DO',
  cuba: 'CU',
  portugal: 'PT',
  espana: 'ES', spain: 'ES',
  francia: 'FR', france: 'FR',
  italia: 'IT', italy: 'IT',
  alemania: 'DE', germany: 'DE', allemagne: 'DE',
  'reino unido': 'GB', 'united kingdom': 'GB', 'estados unidos': 'US', 'united states': 'US', usa: 'US',
  suiza: 'CH', switzerland: 'CH', suisse: 'CH',
  belgica: 'BE', belgium: 'BE',
  holanda: 'NL', 'paises bajos': 'NL', netherlands: 'NL',
  austria: 'AT',
  suecia: 'SE', sweden: 'SE',
  noruega: 'NO', norway: 'NO',
  dinamarca: 'DK', denmark: 'DK',
  finlandia: 'FI', finland: 'FI',
  polonia: 'PL', poland: 'PL',
  grecia: 'GR', greece: 'GR',
  irlanda: 'IE', ireland: 'IE',
  canada: 'CA',
  japon: 'JP', japan: 'JP',
  australia: 'AU',
  'nueva zelanda': 'NZ', 'new zealand': 'NZ',
  sudafrica: 'ZA', 'south africa': 'ZA',
  angola: 'AO',
  mozambique: 'MZ',
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function isoForCountry(country?: string | null): string | null {
  if (!country) return null
  const normalized = normalize(country)
  if (!normalized) return null

  if (/^[a-z]{2}$/.test(normalized)) {
    return normalized.toUpperCase()
  }

  return COUNTRY_TO_ISO[normalized] ?? null
}

export function flagUrlForCountry(country?: string | null): string | null {
  const iso = isoForCountry(country)
  return iso ? `https://flagcdn.com/24x18/${iso.toLowerCase()}.png` : null
}
