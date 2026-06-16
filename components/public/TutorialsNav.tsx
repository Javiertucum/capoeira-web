'use client'

import { useEffect, useRef, useState } from 'react'

export type NavSection = { id: string; title: string; category: string }

export default function TutorialsNav({ sections }: { sections: NavSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sections])

  const categories: string[] = []
  const grouped: Record<string, NavSection[]> = {}
  for (const s of sections) {
    if (!grouped[s.category]) {
      grouped[s.category] = []
      categories.push(s.category)
    }
    grouped[s.category].push(s)
  }

  const activeSection = sections.find((s) => s.id === activeId)

  return (
    <nav aria-label="Tutorial navigation">
      {/* Mobile: hamburger dropdown */}
      <div className="relative lg:hidden" ref={dropdownRef}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((p) => !p)}
          className="inline-flex h-10 w-full items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold text-ink transition-colors duration-150 hover:border-ink/30"
        >
          <span
            className="flex h-4 w-4 shrink-0 flex-col justify-between py-[3px]"
            aria-hidden="true"
          >
            <span className="block h-px w-full bg-current" />
            <span className="block h-px w-3 bg-current" />
            <span className="block h-px w-full bg-current" />
          </span>
          <span className="flex-1 truncate text-left">
            {activeSection?.title ?? sections[0]?.title}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-10"
              tabIndex={-1}
            />
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-float"
            >
              {categories.map((cat) => (
                <div key={cat}>
                  <p className="px-4 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted">
                    {cat}
                  </p>
                  {grouped[cat].map((s) => {
                    const active = activeId === s.id
                    return (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        role="option"
                        aria-selected={active}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-100 ${
                          active
                            ? 'bg-ink text-bg font-semibold'
                            : 'text-text-secondary hover:bg-surface hover:text-ink'
                        }`}
                      >
                        {active ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span className="w-[14px] shrink-0" aria-hidden="true" />
                        )}
                        {s.title}
                      </a>
                    )
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop: grouped docs tree */}
      <div className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <div className="space-y-5 pr-2">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                {cat}
              </p>
              <div className="space-y-0.5">
                {grouped[cat].map((s) => {
                  const active = activeId === s.id
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={`relative flex items-center rounded-lg px-3 py-[7px] text-sm transition-all duration-100 ${
                        active
                          ? 'bg-accent/10 font-semibold text-accent'
                          : 'font-medium text-text-secondary hover:bg-surface hover:text-ink'
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-accent" aria-hidden />
                      )}
                      {s.title}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
