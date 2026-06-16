'use client'

import React, { useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type FeatureMockupType =
  | 'home'
  | 'attendance'
  | 'graduation'
  | 'event'
  | 'educator'
  | 'finances'
  | 'kpi'
  | 'map'
  | 'notifications'

export type FeatureMockupSize = 'default' | 'lg'

interface FeatureMockupProps {
  type: FeatureMockupType
  size?: FeatureMockupSize
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const CordaBelt = ({
  colors,
  tipLeft,
  tipRight,
  width = 80,
  height = 10,
}: {
  colors: string[]
  tipLeft?: string
  tipRight?: string
  width?: number
  height?: number
}) => {
  const isSplit = colors.length === 2
  const isStriped = colors.length >= 3
  return (
    <div
      className="relative overflow-hidden"
      style={{ width, height, borderRadius: height / 2, border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {colors.length === 1 && (
        <div className="absolute inset-0" style={{ backgroundColor: colors[0] }} />
      )}
      {isSplit && (
        <div className="absolute inset-0 flex">
          <div className="flex-1" style={{ backgroundColor: colors[0] }} />
          <div className="flex-1" style={{ backgroundColor: colors[1] }} />
        </div>
      )}
      {isStriped && (
        <div className="absolute inset-0 flex rotate-[-35deg] scale-150">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full flex-1" style={{ backgroundColor: colors[i % colors.length] }} />
          ))}
        </div>
      )}
      {tipLeft && (
        <div className="absolute bottom-0 left-0 top-0 z-10 w-[20%]" style={{ backgroundColor: tipLeft }} />
      )}
      {tipRight && (
        <div className="absolute bottom-0 right-0 top-0 z-10 w-[20%]" style={{ backgroundColor: tipRight }} />
      )}
    </div>
  )
}

function Avatar({ name, bg = '#1e2a1e', accent = '#10B981' }: { name: string; bg?: string; accent?: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black"
      style={{ background: bg, color: accent, border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {name[0].toUpperCase()}
    </div>
  )
}

function NavBar({ active }: { active: 'home' | 'events' | 'community' | 'profile' }) {
  const items = [
    {
      key: 'home',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: 'events',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      key: 'community',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      key: 'profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center justify-around border-t border-white/8 bg-[#0e1218]/95 px-4 pb-5 pt-3 backdrop-blur-lg">
      {items.map((item) => (
        <div
          key={item.key}
          className="flex flex-col items-center gap-1"
          style={{ color: item.key === active ? '#10B981' : 'rgba(255,255,255,0.22)' }}
        >
          {item.icon}
          {item.key === active && (
            <span className="h-1 w-1 rounded-full" style={{ background: '#10B981' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function HomeScreen() {
  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 pb-4 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#10B981' }}>
          Viernes, 9 May 2026
        </p>
        <h4 className="mt-0.5 text-[22px] font-black leading-tight" style={{ color: '#f0f4f0' }}>
          Hola, Tucum
        </h4>
        <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
          2 eventos esta semana en tu red
        </p>
      </div>

      {/* Search */}
      <div
        className="mx-5 mb-4 flex h-10 items-center gap-2.5 rounded-2xl px-4"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Buscar eventos, núcleos...</span>
      </div>

      {/* Filter chips */}
      <div className="mb-4 flex gap-2 px-5">
        {['Todos', 'Batizados', 'Rodas', 'Talleres'].map((f, i) => (
          <span
            key={f}
            className="rounded-full px-3 py-1 text-[9px] font-bold"
            style={
              i === 0
                ? { background: '#10B981', color: '#fff' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {f}
          </span>
        ))}
      </div>

      {/* Featured event card */}
      <div className="mx-5 mb-3 overflow-hidden rounded-[22px]" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Poster area */}
        <div className="relative h-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2b1e 0%, #1a4a2e 60%, #10B981 100%)' }}>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" />
              <path d="M30 70 Q50 20 70 70" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider" style={{ background: '#10B981', color: '#fff' }}>
                BATIZADO
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                15–17 MAY
              </span>
            </div>
            <p className="text-[13px] font-black leading-tight text-white">
              Batizado Bom Caminho 2026
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Santiago, Chile · 42 confirmados
            </p>
          </div>
        </div>
      </div>

      {/* Second event */}
      <div
        className="mx-5 mb-3 flex items-center gap-3 rounded-2xl p-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, #1a2035, #2a3550)' }}>
          <div className="flex h-full items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold" style={{ color: '#e8f0e8' }}>Roda da Comunidade — Mayo</p>
          <p className="mt-0.5 text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Dom 25 May · Buenos Aires</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="rounded-full px-2 py-0.5 text-[7.5px] font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>RODA</span>
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>18 interesados</span>
          </div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>

      <div className="flex-1" />
    </div>
  )
}

function AttendanceScreen() {
  const students = [
    { name: 'Mola',     corda: { colors: ['#008000', '#FFD700'], tipLeft: '#fff' }, present: true },
    { name: 'Tucum',    corda: { colors: ['#008000', '#0000CD'] }, present: true },
    { name: 'Sabiá',    corda: { colors: ['#0000CD'] }, present: false },
    { name: 'Cascavel', corda: { colors: ['#FFD700'] }, present: true },
    { name: 'Irapuã',   corda: { colors: ['#FFD700', '#008000'] }, present: false },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pb-3 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#10B981' }}>Nucleo Tucum</p>
        <h4 className="text-[20px] font-black leading-tight" style={{ color: '#f0f4f0' }}>Asistencia</h4>
      </div>

      {/* Session selector */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-4" style={{ scrollbarWidth: 'none' }}>
        {['18:30 · Iniciantes', '19:45 · Avanzados'].map((s, i) => (
          <div
            key={s}
            className="shrink-0 rounded-2xl px-4 py-2.5 text-[10px] font-bold whitespace-nowrap"
            style={
              i === 0
                ? { background: '#10B981', color: '#fff', boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {s}
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="mx-5 mb-3 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="text-center">
          <p className="text-[14px] font-black" style={{ color: '#10B981' }}>3</p>
          <p className="text-[8px] font-bold uppercase tracking-wide" style={{ color: 'rgba(16,185,129,0.7)' }}>Presentes</p>
        </div>
        <div className="h-8 w-px" style={{ background: 'rgba(16,185,129,0.2)' }} />
        <div className="text-center">
          <p className="text-[14px] font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>2</p>
          <p className="text-[8px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>Ausentes</p>
        </div>
        <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="text-center">
          <p className="text-[14px] font-black" style={{ color: 'rgba(255,255,255,0.7)' }}>5</p>
          <p className="text-[8px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>Total</p>
        </div>
      </div>

      {/* Student list */}
      <div className="flex-1 space-y-2 overflow-y-auto px-5">
        {students.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-2xl p-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Avatar name={s.name} />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold leading-tight" style={{ color: '#e8f0e8' }}>
                {s.name}
              </p>
              <div className="mt-1.5">
                <CordaBelt {...s.corda} width={64} height={7} />
              </div>
            </div>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
              style={
                s.present
                  ? { background: '#10B981', boxShadow: '0 2px 12px rgba(16,185,129,0.3)' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }
              }
            >
              {s.present && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="px-5 pb-2 pt-3">
        <div
          className="flex h-12 items-center justify-center rounded-2xl text-[12px] font-black"
          style={{ background: '#10B981', color: '#fff', boxShadow: '0 6px 24px rgba(16,185,129,0.3)' }}
        >
          Guardar Asistencia
        </div>
      </div>
    </div>
  )
}

function GraduationScreen() {
  const levels = [
    { name: 'Corda Verde',        colors: ['#15803d'], pos: 1, count: 4 },
    { name: 'Verde-Amarela',      colors: ['#15803d', '#CA8A04'], pos: 2, count: 7 },
    { name: 'Amarela',            colors: ['#CA8A04'], pos: 3, count: 6 },
    { name: 'Azul',               colors: ['#1d4ed8'], pos: 4, count: 3, educator: true },
    { name: 'Verde-Azul',         colors: ['#15803d', '#1d4ed8'], pos: 5, count: 2 },
    { name: 'Verde-Branca',       colors: ['#15803d', '#e2e8f0'], pos: 6, count: 1, educator: true },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-5 pb-3 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#10B981' }}>Grupo Bom Caminho</p>
        <h4 className="text-[20px] font-black leading-tight" style={{ color: '#f0f4f0' }}>Graduaciones</h4>
      </div>

      <div className="mx-5 mb-3 rounded-2xl px-4 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Sistema Adulto · 6 niveles · 23 miembros</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-5">
        {levels.map((l) => (
          <div
            key={l.name}
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="w-5 text-[10px] font-black font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {String(l.pos).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold leading-tight" style={{ color: '#e8f0e8' }}>{l.name}</p>
                {l.educator && (
                  <span className="rounded-full px-1.5 py-0.5 text-[7px] font-black uppercase" style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                    Educador
                  </span>
                )}
              </div>
              <div className="mt-1.5">
                <CordaBelt colors={l.colors} width={80} height={8} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-black" style={{ color: 'rgba(255,255,255,0.6)' }}>{l.count}</p>
              <p className="text-[7px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.2)' }}>alumnos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiScreen() {
  const bars = [42, 58, 47, 71, 63, 88, 95]
  const metrics = [
    { label: 'Alumnos activos', value: '24', sub: '+3 este mes', up: true },
    { label: 'Retención',       value: '89%', sub: 'Últimos 90d', up: true },
    { label: 'Asistencia prom.', value: '83%', sub: '↑ 4% vs mes ant.', up: true },
    { label: 'Ingresos (CLP)',   value: '$178K', sub: 'Mayo 2026', up: false },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-5 pb-3 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#10B981' }}>Nucleo Tucum</p>
        <h4 className="text-[20px] font-black leading-tight" style={{ color: '#f0f4f0' }}>Métricas</h4>
      </div>

      {/* Chart */}
      <div className="mx-5 mb-4 rounded-[20px] p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Crecimiento</p>
            <p className="text-[18px] font-black" style={{ color: '#f0f4f0' }}>+24%
              <span className="ml-1.5 text-[10px] font-bold" style={{ color: '#10B981' }}>↑</span>
            </p>
          </div>
          <span className="rounded-lg px-2 py-1 text-[8px] font-black" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>30 días</span>
        </div>
        <div className="flex h-14 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background: i === bars.length - 1 ? '#10B981' : 'rgba(16,185,129,0.25)',
                transition: 'height 0.3s ease',
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
            <span key={d} className="flex-1 text-center text-[7px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-2 gap-2 px-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-[18px] p-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-[8px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {m.label}
            </p>
            <p className="text-[15px] font-black leading-none" style={{ color: '#e8f0e8' }}>{m.value}</p>
            <p className="mt-1 text-[8px]" style={{ color: m.up ? '#10B981' : 'rgba(255,255,255,0.3)' }}>{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FinancesScreen() {
  const transactions = [
    { name: 'Mola',     type: 'Mensualidad Mayo',  amount: '$35.000', ok: true },
    { name: 'Tucum',    type: 'Clase suelta',       amount: '$5.000',  ok: true },
    { name: 'Sabiá',    type: 'Mensualidad Mayo',   amount: '$35.000', ok: false },
    { name: 'Cascavel', type: 'Mensualidad Abr.',   amount: '$35.000', ok: true },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-5 pb-3 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#10B981' }}>Tesorería</p>
        <h4 className="text-[20px] font-black leading-tight" style={{ color: '#f0f4f0' }}>Finanzas</h4>
      </div>

      {/* Balance card */}
      <div
        className="mx-5 mb-4 rounded-[22px] p-5"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(16,185,129,0.7)' }}>Balance Total · Mayo</p>
        <p className="text-[26px] font-black leading-none" style={{ color: '#f0f4f0' }}>$450.000</p>
        <p className="mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>CLP · 4 pagos recibidos</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full px-3 py-1 text-[9px] font-bold" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>U$D 120</span>
          <span className="rounded-full px-3 py-1 text-[9px] font-bold" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>€ 85</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5">
        <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.25)' }}>Cobros Recientes</p>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div
              key={`${t.name}-${t.type}`}
              className="flex items-center gap-3 rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Avatar name={t.name} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold leading-tight" style={{ color: '#e8f0e8' }}>{t.name}</p>
                <p className="mt-0.5 text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.type}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black" style={{ color: t.ok ? '#e8f0e8' : 'rgba(255,255,255,0.3)' }}>
                  {t.amount}
                </p>
                <p className="mt-0.5 text-[8px] font-bold" style={{ color: t.ok ? '#10B981' : '#f59e0b' }}>
                  {t.ok ? 'Pagado' : 'Pendiente'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MapScreen() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0" style={{ background: '#12181f' }}>
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        {/* Roads suggestion */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 300 500" fill="none">
          <path d="M0 200 Q80 180 150 200 Q220 220 300 200" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0 320 Q100 300 150 320 Q200 340 300 320" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M100 0 Q120 120 100 250 Q80 380 100 500" stroke="white" strokeWidth="2" fill="none" />
          <path d="M200 0 Q215 150 200 280 Q185 400 200 500" stroke="white" strokeWidth="1" fill="none" />
        </svg>

        {/* Map pins */}
        <div className="absolute" style={{ top: '30%', left: '40%', transform: 'translate(-50%, -50%)' }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: '#10B981', boxShadow: '0 0 0 6px rgba(16,185,129,0.2), 0 4px 16px rgba(16,185,129,0.4)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#15803d"/>
            </svg>
          </div>
        </div>
        {[{ top: '55%', left: '22%' }, { top: '48%', left: '68%' }, { top: '70%', left: '50%' }].map((pos, i) => (
          <div
            key={i}
            className="absolute flex h-6 w-6 items-center justify-center rounded-full"
            style={{ ...pos, transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white opacity-60" />
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative z-10 px-4 pt-3">
        <div
          className="flex h-11 items-center gap-3 rounded-full px-4"
          style={{ background: 'rgba(14,18,24,0.9)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Buscar núcleos...</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Location card */}
      <div className="relative z-10 m-3 rounded-[24px] p-4" style={{ background: 'rgba(14,18,24,0.92)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black leading-tight" style={{ color: '#e8f0e8' }}>Núcleo Tucum</p>
            <p className="mt-0.5 text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Santiago, Chile · 15 alumnos</p>
            <div className="mt-2 flex gap-2">
              <span className="rounded-full px-2.5 py-1 text-[8px] font-black" style={{ background: '#10B981', color: '#fff' }}>Activo</span>
              <span className="rounded-full px-2.5 py-1 text-[8px] font-bold" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>Ver detalle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsScreen() {
  const items = [
    { title: 'Batizado Bom Caminho', desc: 'Mañana a las 09:00 — confirma asistencia', time: '5 min', accent: true },
    { title: 'Asistencia guardada', desc: '8 presentes · sesión Lunes 18:30', time: '2 h', accent: false },
    { title: 'Nueva graduación', desc: 'Mola ascendió a Corda Verde-Amarela', time: 'Ayer', accent: false },
    { title: 'Pago confirmado',  desc: 'Mensualidad Tucum · Mayo 2026', time: '3 días', accent: false },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-5 pb-3 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#10B981' }}>Centro</p>
        <h4 className="text-[20px] font-black leading-tight" style={{ color: '#f0f4f0' }}>Notificaciones</h4>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-5">
        {items.map((n, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-2xl p-3.5"
            style={
              n.accent
                ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
            }
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{ background: n.accent ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={n.accent ? '#10B981' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold leading-tight" style={{ color: n.accent ? '#10B981' : '#e8f0e8' }}>{n.title}</p>
              <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{n.desc}</p>
            </div>
            <p className="shrink-0 text-[8px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.18)' }}>{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventScreen() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Poster */}
      <div
        className="relative mx-5 mt-2 mb-4 overflow-hidden rounded-[22px]"
        style={{ height: 140, background: 'linear-gradient(145deg, #0d2b1e 0%, #1a4a2e 50%, #10B981 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.8" />
            <path d="M25 75 Q50 15 75 75" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-[8px] font-black" style={{ background: '#10B981', color: '#fff' }}>BATIZADO</span>
            <span className="rounded-full px-2.5 py-0.5 text-[8px] font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>15–17 MAY</span>
          </div>
          <p className="text-[14px] font-black text-white leading-tight">Batizado Bom Caminho 2026</p>
          <p className="mt-0.5 text-[9px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Santiago, Chile</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 px-5 mb-4">
        <div className="flex h-10 items-center justify-center gap-2 rounded-2xl text-[11px] font-black" style={{ background: '#10B981', color: '#fff', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Confirmado
        </div>
        <div className="flex h-10 items-center justify-center gap-2 rounded-2xl text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3" strokeLinecap="round"/></svg>
          Interesado
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-5 mb-4">
        {[{ label: 'Confirmados', val: '42' }, { label: 'Interesados', val: '118' }, { label: 'Precio', val: '$35K' }].map((s) => (
          <div key={s.label} className="rounded-xl py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[13px] font-black" style={{ color: '#e8f0e8' }}>{s.val}</p>
            <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Description snippet */}
      <div className="px-5">
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
          El encuentro anual de Capoeira Bom Caminho reúne practicantes de toda Sudamérica para talleres, rodas y graduaciones...
        </p>
      </div>
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

const MAX_W: Record<FeatureMockupSize, string> = {
  default: '300px',
  lg:      '360px',
}

const NAV_MAP: Record<FeatureMockupType, 'home' | 'events' | 'community' | 'profile'> = {
  home:          'home',
  attendance:    'community',
  graduation:    'community',
  event:         'events',
  educator:      'community',
  finances:      'community',
  kpi:           'community',
  map:           'home',
  notifications: 'home',
}

export default function FeatureMockup({ type, size = 'default' }: FeatureMockupProps) {
  const screens: Record<FeatureMockupType, React.ReactNode> = {
    home:          <HomeScreen />,
    attendance:    <AttendanceScreen />,
    graduation:    <GraduationScreen />,
    event:         <EventScreen />,
    educator:      <AttendanceScreen />,
    finances:      <FinancesScreen />,
    kpi:           <KpiScreen />,
    map:           <MapScreen />,
    notifications: <NotificationsScreen />,
  }

  return (
    <div className="relative mx-auto" style={{ maxWidth: MAX_W[size], width: '100%' }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-4 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: 'rgba(16,185,129,0.5)' }}
      />

      {/* Phone shell */}
      <div
        className="relative mx-auto aspect-[9/19] w-full overflow-hidden"
        style={{
          background: '#0A0C10',
          borderRadius: 52,
          border: '7px solid #1a1e26',
          boxShadow: '0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 top-2 z-30 flex items-center justify-center gap-2"
          style={{ transform: 'translateX(-50%)', width: 96, height: 26, background: '#1a1e26', borderRadius: 13 }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-1 w-8 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Status bar */}
        <div className="relative z-20 flex h-12 items-center justify-between px-8 pt-5">
          <span className="font-mono text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>9:41</span>
          <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M1 6l8.5 8.5L12 12l2.5 2.5L23 6"/></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="11" rx="2" opacity="0.4"/><rect x="4" y="9" width="13" height="7" rx="1"/></svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="absolute" style={{ top: 48, left: 0, right: 0, bottom: 68, overflow: 'hidden' }}>
          {screens[type]}
        </div>

        {/* Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <NavBar active={NAV_MAP[type]} />
        </div>

        {/* Home indicator */}
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1.5 w-20 rounded-full"
          style={{ transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.12)' }}
        />

        {/* Glass highlight */}
        <div
          className="pointer-events-none absolute inset-0 z-40"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)' }}
        />
      </div>
    </div>
  )
}
