'use client'

import type { AdminNucleo } from '@/lib/admin-queries'
import { DAY_OPTIONS } from './dayOptions'

type Schedule = NonNullable<AdminNucleo['schedules']>[number]

// Debe coincidir exactamente con getScheduleKey() de capoeira-app/lib/utils/nucleoBilling.ts
export function getScheduleKey(schedule: Schedule): string {
  return `${schedule.dayOfWeek}-${schedule.startTime}-${schedule.endTime}`
}

function getScheduleLabel(schedule: Schedule): string {
  const day = DAY_OPTIONS.find((option) => option.value === schedule.dayOfWeek)?.label ?? schedule.dayOfWeek
  return `${day} ${schedule.startTime}-${schedule.endTime}`
}

interface Props {
  schedules: AdminNucleo['schedules']
  selectedKeys: string[]
  onChange: (keys: string[]) => void
}

export default function ScheduleKeyPicker({ schedules, selectedKeys, onChange }: Props) {
  const list = schedules ?? []

  function toggle(key: string) {
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((existing) => existing !== key))
    } else {
      onChange([...selectedKeys, key])
    }
  }

  if (list.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Este nucleo no tiene horarios cargados todavia.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((schedule) => {
        const key = getScheduleKey(schedule)
        const active = selectedKeys.includes(key)
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              active
                ? 'border-accent bg-accent/14 text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            {getScheduleLabel(schedule)}
          </button>
        )
      })}
    </div>
  )
}
