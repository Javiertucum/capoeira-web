const COUNTRY_TO_ISO: Record<string, string> = {
  // Spanish / Portuguese / English names used across the app
  brasil: 'BR', brazil: 'BR',
  chile: 'CL',
  argentina: 'AR',
  mexico: 'MX', méxico: 'MX',
  colombia: 'CO',
  peru: 'PE', perú: 'PE',
  uruguay: 'UY',
  paraguay: 'PY',
  bolivia: 'BO',
  ecuador: 'EC',
  venezuela: 'VE',
  'costa rica': 'CR',
  panama: 'PA', panamá: 'PA',
  guatemala: 'GT',
  honduras: 'HN',
  'el salvador': 'SV',
  nicaragua: 'NI',
  'republica dominicana': 'DO', 'república dominicana': 'DO', 'dominican republic': 'DO',
  cuba: 'CU',
  portugal: 'PT',
  espana: 'ES', españa: 'ES', spain: 'ES',
  francia: 'FR', france: 'FR',
  italia: 'IT', italy: 'IT',
  alemania: 'DE', germany: 'DE', allemagne: 'DE',
  'reino unido': 'GB', 'united kingdom': 'GB', 'estados unidos': 'US', 'united states': 'US', usa: 'US',
  suiza: 'CH', switzerland: 'CH', suisse: 'CH',
  belgica: 'BE', bélgica: 'BE', belgium: 'BE',
  holanda: 'NL', 'países bajos': 'NL', 'paises bajos': 'NL', netherlands: 'NL',
  austria: 'AT',
  suecia: 'SE', sweden: 'SE',
  noruega: 'NO', norway: 'NO',
  dinamarca: 'DK', denmark: 'DK',
  finlandia: 'FI', finland: 'FI',
  polonia: 'PL', poland: 'PL',
  grecia: 'GR', greece: 'GR',
  irlanda: 'IE', ireland: 'IE',
  canada: 'CA', canadá: 'CA',
  japon: 'JP', japón: 'JP', japan: 'JP',
  australia: 'AU',
  'nueva zelanda': 'NZ', 'new zealand': 'NZ',
  'sudafrica': 'ZA', 'sudáfrica': 'ZA', 'south africa': 'ZA',
  angola: 'AO',
  mozambique: 'MZ',
}

function isoToFlagEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
}

export function flagForCountry(country?: string | null): string | null {
  if (!country) return null
  const iso = COUNTRY_TO_ISO[country.trim().toLowerCase()]
  return iso ? isoToFlagEmoji(iso) : null
}
