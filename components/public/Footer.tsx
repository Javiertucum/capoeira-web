import Link from 'next/link'

export default function Footer({ locale = 'es' }: { locale?: string }) {
  const NAV_PLATFORM = [
    { label: 'Funcionalidades', href: '#features' },
    { label: 'Directorio',      href: '#directorio' },
    { label: 'Descargar App',   href: `/${locale}/app` },
  ]

  const NAV_COMMUNITY = [
    { label: 'Descargar App',   href: `/${locale}/app` },
    { label: 'Admin',           href: '/admin' },
  ]

  const NAV_LEGAL = [
    { label: 'Privacidad',      href: `/${locale}/privacy` },
    { label: 'Términos',        href: `/${locale}/terms` },
  ]

  return (
    <footer className="border-t border-border bg-bg">
      <div className="page-shell py-16 lg:py-20">

        {/* ── Main grid ── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-[18px] leading-none text-bg transition-transform duration-200 ease-[var(--ease-out)] hover:scale-[1.05]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
              >
                a<span style={{ color: 'var(--accent)' }}>·</span>c
              </span>
              <span
                className="text-[17px] font-black tracking-tight text-ink"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Agenda Capoeiragem
              </span>
            </div>
            <p className="max-w-[30ch] text-sm leading-relaxed text-text-secondary">
              La plataforma de gestión y comunidad para el ecosistema capoeirista global.
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">
              iOS · Android
            </p>
          </div>

          {/* Platform links */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Plataforma
            </p>
            <ul className="space-y-3">
              {NAV_PLATFORM.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-150 ease-[var(--ease-out)] hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Comunidad
            </p>
            <ul className="space-y-3">
              {NAV_COMMUNITY.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-150 ease-[var(--ease-out)] hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-[11px] font-medium text-text-muted">
            © 2026 Agenda Capoeiragem. Todos los derechos reservados.
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
