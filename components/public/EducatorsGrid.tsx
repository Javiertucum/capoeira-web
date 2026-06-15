'use client'

import { useState } from 'react'
import Link from 'next/link'
import Avatar from '@/components/public/Avatar'
import Modal from '@/components/public/Modal'
import CountryFlag from '@/components/public/CountryFlag'
import type { MapNucleo } from '@/lib/types'

export type EducatorItem = {
  uid: string
  name: string
  surname: string
  avatarUrl?: string | null
  bio?: string | null
  country?: string | null
  graduationName?: string | null
}

export default function EducatorsGrid({
  locale,
  educators,
  nucleosByEducator,
  labels,
}: {
  locale: string
  educators: EducatorItem[]
  nucleosByEducator: Record<string, MapNucleo[]>
  labels: { title: string; viewProfile: string; nucleosSection: string }
}) {
  const [activeUid, setActiveUid] = useState<string | null>(null)
  const active = educators.find((e) => e.uid === activeUid) ?? null
  const activeNucleos = activeUid ? nucleosByEducator[activeUid] ?? [] : []

  if (educators.length === 0) return null

  return (
    <div className="mt-10">
      <p className="eyebrow acc mb-3">{labels.title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {educators.map((educator) => (
          <button
            key={educator.uid}
            type="button"
            onClick={() => setActiveUid(educator.uid)}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors duration-150 hover:border-accent"
          >
            <Avatar name={educator.name} surname={educator.surname} avatarUrl={educator.avatarUrl} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">
                {educator.name} {educator.surname}
                <CountryFlag country={educator.country} className="ml-2" />
              </p>
              {educator.graduationName && (
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{educator.graduationName}</p>
              )}
              {educator.bio && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{educator.bio}</p>}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <Modal open={!!active} onClose={() => setActiveUid(null)} title={`${active.name} ${active.surname}`}>
          <div className="space-y-3">
            {active.graduationName && (
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{active.graduationName}</p>
            )}
            {activeNucleos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{labels.nucleosSection}</p>
                {activeNucleos.map((nucleo) => (
                  <Link
                    key={nucleo.id}
                    href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                    className="block rounded-2xl border border-border bg-surface p-3 transition-colors duration-150 hover:border-accent"
                  >
                    <p className="font-bold text-ink">
                      {nucleo.name}
                      <CountryFlag country={nucleo.country} className="ml-2" />
                    </p>
                    {(nucleo.city || nucleo.country) && (
                      <p className="text-xs text-text-muted">{[nucleo.city, nucleo.country].filter(Boolean).join(', ')}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
            <Link
              href={`/${locale}/educadores/${active.uid}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-accent-ink hover:underline"
            >
              {labels.viewProfile} →
            </Link>
          </div>
        </Modal>
      )}
    </div>
  )
}
