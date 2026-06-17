const DAY_SHORT = {
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  pt: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sá'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
} as const

export function getDayShort(locale: string) {
  return DAY_SHORT[locale as keyof typeof DAY_SHORT] ?? DAY_SHORT.en
}
