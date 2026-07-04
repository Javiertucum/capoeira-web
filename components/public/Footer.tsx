import Image from 'next/image'
import Link from 'next/link'
import { getTravelersPath } from '@/lib/travelers-content'

const FOOTER_COPY: Record<string, {
  tagline: string
  directorio: string
  tutoriales: string
  viajeros: string
  descargarApp: string
  plataforma: string
  comunidad: string
  admin: string
  sobre: string
  privacidad: string
  terminos: string
  copyright: string
}> = {
  es: {
    tagline: 'La plataforma de gestión y comunidad para el ecosistema capoeirista global.',
    directorio: 'Directorio',
    tutoriales: 'Tutoriales',
    viajeros: 'Para Viajeros',
    descargarApp: 'Descargar App',
    plataforma: 'Plataforma',
    comunidad: 'Comunidad',
    admin: 'Admin',
    sobre: 'Sobre nosotros',
    privacidad: 'Privacidad',
    terminos: 'Términos',
    copyright: '© 2026 Agenda Capoeiragem. Todos los derechos reservados.',
  },
  pt: {
    tagline: 'A plataforma de gestão e comunidade para o ecossistema capoeirista global.',
    directorio: 'Diretório',
    tutoriales: 'Tutoriais',
    viajeros: 'Para Viajantes',
    descargarApp: 'Baixar App',
    plataforma: 'Plataforma',
    comunidad: 'Comunidade',
    admin: 'Admin',
    sobre: 'Sobre nós',
    privacidad: 'Privacidade',
    terminos: 'Termos',
    copyright: '© 2026 Agenda Capoeiragem. Todos os direitos reservados.',
  },
  en: {
    tagline: 'The management and community platform for the global capoeira ecosystem.',
    directorio: 'Directory',
    tutoriales: 'Tutorials',
    viajeros: 'For Travelers',
    descargarApp: 'Download App',
    plataforma: 'Platform',
    comunidad: 'Community',
    admin: 'Admin',
    sobre: 'About us',
    privacidad: 'Privacy',
    terminos: 'Terms',
    copyright: '© 2026 Agenda Capoeiragem. All rights reserved.',
  },
  fr: {
    tagline: 'La plateforme de gestion et de communauté pour l’écosystème capoeiriste mondial.',
    directorio: 'Annuaire',
    tutoriales: 'Tutoriels',
    viajeros: 'Pour Voyageurs',
    descargarApp: 'Télécharger l’app',
    plataforma: 'Plateforme',
    comunidad: 'Communauté',
    admin: 'Admin',
    sobre: 'À propos',
    privacidad: 'Confidentialité',
    terminos: 'Conditions',
    copyright: '© 2026 Agenda Capoeiragem. Tous droits réservés.',
  },
  de: {
    tagline: 'Die Verwaltungs- und Community-Plattform für das globale Capoeira-Ökosystem.',
    directorio: 'Verzeichnis',
    tutoriales: 'Tutorials',
    viajeros: 'Für Reisende',
    descargarApp: 'App herunterladen',
    plataforma: 'Plattform',
    comunidad: 'Community',
    admin: 'Admin',
    sobre: 'Über uns',
    privacidad: 'Datenschutz',
    terminos: 'AGB',
    copyright: '© 2026 Agenda Capoeiragem. Alle Rechte vorbehalten.',
  },
  it: {
    tagline: "La piattaforma di gestione e comunità per l'ecosistema globale della capoeira.",
    directorio: 'Directory',
    tutoriales: 'Tutorial',
    viajeros: 'Per Viaggiatori',
    descargarApp: "Scarica l'app",
    plataforma: 'Piattaforma',
    comunidad: 'Comunità',
    admin: 'Admin',
    sobre: 'Chi siamo',
    privacidad: 'Privacy',
    terminos: 'Termini',
    copyright: '© 2026 Agenda Capoeiragem. Tutti i diritti riservati.',
  },
}

export default function Footer({ locale = 'es' }: { locale?: string }) {
  const c = FOOTER_COPY[locale] ?? FOOTER_COPY.es

  const NAV_PLATFORM = [
    { label: c.directorio, href: `/${locale}/#directorio` },
    { label: c.tutoriales, href: `/${locale}/tutoriales` },
    { label: c.viajeros, href: `/${locale}${getTravelersPath(locale)}` },
    { label: c.descargarApp, href: `/${locale}/app` },
  ]

  const NAV_COMMUNITY = [
    { label: c.sobre, href: `/${locale}/about` },
    { label: c.admin, href: `/${locale}/admin` },
  ]

  const NAV_LEGAL = [
    { label: c.privacidad, href: `/${locale}/privacy` },
    { label: c.terminos, href: `/${locale}/terms` },
  ]

  return (
    <footer className="border-t border-border bg-bg">
      <div className="page-shell py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Agenda Capoeiragem"
                width={40}
                height={40}
                className="shrink-0 rounded-2xl transition-transform duration-200 ease-[var(--ease-out)] hover:scale-[1.05]"
              />
              <span
                className="text-[17px] font-black tracking-tight text-ink"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Agenda Capoeiragem
              </span>
            </div>
            <p className="max-w-[30ch] text-sm leading-relaxed text-text-secondary">
              {c.tagline}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Android
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              {c.plataforma}
            </p>
            <ul className="space-y-3">
              {NAV_PLATFORM.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-150 ease-[var(--ease-out)] hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              {c.comunidad}
            </p>
            <ul className="space-y-3">
              {NAV_COMMUNITY.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-150 ease-[var(--ease-out)] hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 lg:mt-16 sm:flex-row">
          <p className="text-[11px] font-medium text-text-muted">
            {c.copyright}
          </p>
          <div className="flex gap-6">
            {NAV_LEGAL.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-text-muted transition-colors duration-150 ease-[var(--ease-out)] hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
