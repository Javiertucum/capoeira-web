'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CONSENT_COOKIE } from './ConsentInit'

type ConsentValue = 'granted' | 'denied'

type BannerCopy = {
  text: string
  accept: string
  reject: string
  more: string
}

const BANNER_COPY: Record<string, BannerCopy> = {
  es: {
    text: 'Usamos cookies de analítica (Google Analytics) para entender cómo se usa el sitio. Solo se activan si aceptas.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    more: 'Más información',
  },
  pt: {
    text: 'Usamos cookies de análise (Google Analytics) para entender como o site é usado. Só são ativados se você aceitar.',
    accept: 'Aceitar',
    reject: 'Recusar',
    more: 'Mais informações',
  },
  en: {
    text: 'We use analytics cookies (Google Analytics) to understand how the site is used. They are only set if you accept.',
    accept: 'Accept',
    reject: 'Reject',
    more: 'Learn more',
  },
  fr: {
    text: "Nous utilisons des cookies d'analyse (Google Analytics) pour comprendre l'utilisation du site. Ils ne sont activés que si vous acceptez.",
    accept: 'Accepter',
    reject: 'Refuser',
    more: 'En savoir plus',
  },
  de: {
    text: 'Wir verwenden Analyse-Cookies (Google Analytics), um zu verstehen, wie die Website genutzt wird. Sie werden nur mit deiner Zustimmung gesetzt.',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
    more: 'Mehr erfahren',
  },
  it: {
    text: "Utilizziamo cookie di analisi (Google Analytics) per capire come viene usato il sito. Vengono attivati solo se accetti.",
    accept: 'Accetta',
    reject: 'Rifiuta',
    more: 'Maggiori informazioni',
  },
}

export function readConsentCookie(): ConsentValue | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`))
  return (match?.[1] as ConsentValue | undefined) ?? null
}

export function writeConsentCookie(value: ConsentValue) {
  const maxAge = 60 * 60 * 24 * 365 // 12 meses
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${
    location.protocol === 'https:' ? '; Secure' : ''
  }`
  try {
    localStorage.setItem(CONSENT_COOKIE, value)
  } catch {
    // localStorage puede estar bloqueado — la cookie es la fuente primaria
  }
}

export function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
  try {
    localStorage.removeItem(CONSENT_COOKIE)
  } catch {
    // ignore
  }
}

function applyConsent(value: ConsentValue) {
  writeConsentCookie(value)
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: value,
    })
  }
}

export default function CookieConsentBanner({ locale = 'es' }: { locale?: string }) {
  const [visible, setVisible] = useState(false)
  const copy = BANNER_COPY[locale] ?? BANNER_COPY.es

  useEffect(() => {
    setVisible(readConsentCookie() === null)
  }, [])

  if (!visible) return null

  function decide(value: ConsentValue) {
    applyConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={copy.text}
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-[720px] flex-col gap-3 rounded-[20px] border border-border bg-card px-5 py-4 shadow-[0_24px_80px_var(--shadow)] sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-6 text-text-secondary">
          {copy.text}{' '}
          <Link
            href={`/${locale}/cookies`}
            className="font-semibold text-text underline decoration-border underline-offset-4 hover:decoration-current"
          >
            {copy.more}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="rounded-[12px] border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-accent/35 hover:text-text"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="rounded-[12px] bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
