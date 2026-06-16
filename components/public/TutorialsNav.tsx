'use client'

import { useEffect, useState } from 'react'

export type NavSection = { id: string; title: string; category: string }

export default function TutorialsNav({ sections }: { sections: NavSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

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

  return (
    <nav aria-label="Tutorial navigation">
      {/* Mobile: horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-150 ${
              activeId === s.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-card text-text-secondary'
            }`}
          >
            {s.title}
          </a>
        ))}
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
