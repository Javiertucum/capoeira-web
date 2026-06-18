import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'pt', 'en', 'fr', 'de', 'it'],
  defaultLocale: 'es',
})
