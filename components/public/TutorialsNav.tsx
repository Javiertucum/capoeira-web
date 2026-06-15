'use client'

import { useEffect, useState } from 'react'

type Section = { id: string; title: string }

export default function TutorialsNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  const moduleNumber = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <nav className="lg:sticky lg:top-28">
      <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
        {sections.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`flex shrink-0 items-center gap-3 rounded-full border px-5 py-3 text-sm font-bold transition-colors duration-150 ease-[var(--ease-out)] lg:rounded-2xl ${
              activeId === section.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-white text-text-secondary hover:border-accent/30 hover:text-ink'
            }`}
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] opacity-60">
              {moduleNumber(i)}
            </span>
            {section.title}
          </a>
        ))}
      </div>
    </nav>
  )
}
