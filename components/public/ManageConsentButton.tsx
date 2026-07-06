'use client'

import { clearConsentCookie } from './CookieConsentBanner'

const LABELS: Record<string, string> = {
  es: 'Gestionar mi consentimiento',
  pt: 'Gerenciar meu consentimento',
  en: 'Manage my consent',
  fr: 'Gérer mon consentement',
  de: 'Meine Einwilligung verwalten',
  it: 'Gestire il mio consenso',
}

/**
 * Borra la cookie de consentimiento y recarga: al volver a cargar, el banner
 * reaparece (readConsentCookie() === null) y GA queda denegado por defecto.
 */
export default function ManageConsentButton({ locale = 'es' }: { locale?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        clearConsentCookie()
        location.reload()
      }}
      className="mt-6 inline-flex items-center justify-center rounded-[14px] border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/35 hover:text-text"
    >
      {LABELS[locale] ?? LABELS.es}
    </button>
  )
}
