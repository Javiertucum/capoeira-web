'use client'

import React, { useState, useEffect } from 'react'

interface FeatureMockupProps {
  type: 'home' | 'attendance' | 'graduation' | 'event' | 'educator'
  interactive?: boolean
}

// Replicating the REAL CordaVisual logic from the app
const CordaVisual = ({ colors, tipLeft, tipRight, width = 80, height = 10 }: { colors: string[], tipLeft?: string, tipRight?: string, width?: number, height?: number }) => {
  const isSplit = colors.length === 2
  const isStriped = colors.length >= 3
  
  return (
    <div className="relative overflow-hidden border border-white/10 shadow-sm" style={{ width, height, borderRadius: height / 2 }}>
      {colors.length === 1 && <div className="absolute inset-0" style={{ backgroundColor: colors[0] }} />}
      {isSplit && (
        <div className="absolute inset-0 flex">
          <div className="flex-1" style={{ backgroundColor: colors[0] }} />
          <div className="flex-1" style={{ backgroundColor: colors[1] }} />
        </div>
      )}
      {isStriped && (
        <div className="absolute inset-0 flex rotate-[-35deg] scale-150">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: colors[i % colors.length] }} />
          ))}
        </div>
      )}
      {tipLeft && <div className="absolute left-0 top-0 bottom-0 w-[20%] z-10" style={{ backgroundColor: tipLeft }} />}
      {tipRight && <div className="absolute right-0 top-0 bottom-0 w-[20%] z-10" style={{ backgroundColor: tipRight }} />}
    </div>
  )
}

const REAL_STUDENTS = [
  { name: 'Mola', surname: 'Chile', nickname: 'Mola', corda: { name: 'Monitor (Verde-Amarela)', colors: ['#008000', '#FFD700'], tipLeft: '#FFFFFF' }, present: true },
  { name: 'Tucum', surname: 'Santiago', nickname: 'Tucum', corda: { name: 'Monitor (Verde-Azul)', colors: ['#008000', '#0000FF'] }, present: true },
  { name: 'Sabiá', surname: 'Valparaíso', nickname: 'Sabiá', corda: { name: 'Graduado (Azul)', colors: ['#0000FF'] }, present: false },
  { name: 'Cascavel', surname: 'Concepción', nickname: 'Cascavel', corda: { name: 'Aluno (Amarela)', colors: ['#FFD700'] }, present: true },
]

export default function FeatureMockup({ type, interactive = false }: FeatureMockupProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const renderScreen = () => {
    switch (type) {
      case 'home':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             {/* REAL HomeHeader replication */}
             <div className="pt-2">
                <p className="text-accent text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Viernes, 1 de Mayo</p>
                <h4 className="text-bg font-black text-2xl leading-tight">Hola, Tucum</h4>
                <p className="text-bg/50 text-[11px] mt-1">Explora los próximos eventos de tu red.</p>
             </div>

             {/* Search Bar replication */}
             <div className="h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 gap-3">
                <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                <div className="h-2 w-32 bg-white/10 rounded-full" />
             </div>

             {/* Filters replication */}
             <div className="flex gap-2">
                {['Hoy', 'Semana', 'Mes'].map((f, i) => (
                   <div key={f} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${i === 0 ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-bg/40'}`}>
                      {f}
                   </div>
                ))}
             </div>

             {/* REAL EventCard replication */}
             <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex">
                   <div className="w-[80px] p-3 pr-1">
                      <div className="aspect-[3/4] bg-accent/20 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden">
                         <div className="w-8 h-8 rounded-full bg-accent/40" />
                      </div>
                   </div>
                   <div className="flex-1 p-4 pl-2 space-y-2">
                      <h5 className="text-bg font-bold text-sm leading-tight">Batizado Bom Caminho 2026</h5>
                      <div className="flex gap-2">
                         <span className="bg-accent px-2 py-0.5 rounded-full text-[8px] font-black text-white uppercase tracking-tighter">15-17 MAY</span>
                         <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[8px] font-bold text-bg/40 uppercase">BATIZADO</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-bg/40 text-[10px] font-medium">
                         <div className="w-2.5 h-2.5 rounded-full border border-current" />
                         <span>Santiago, Chile 🇨🇱</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )

      case 'attendance':
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-2">
                <h4 className="text-bg font-black text-xl">Nueva Sesión</h4>
                <div className="bg-accent/20 px-3 py-1.5 rounded-xl text-[9px] font-black text-accent uppercase">Hoy</div>
             </div>
             
             <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {['18:30 - Iniciantes', '19:45 - Avançados'].map((h, i) => (
                   <div key={h} className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-[10px] font-bold transition-all ${i === 0 ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-white/5 border-white/10 text-bg/40'}`}>
                      {h}
                   </div>
                ))}
             </div>

             <div className="space-y-2.5">
                {REAL_STUDENTS.map((s, i) => (
                   <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs text-bg/20">
                         {s.name[0]}
                      </div>
                      <div className="flex-1 space-y-1">
                         <p className="text-bg font-bold text-[13px] leading-tight">{s.name} {s.surname}</p>
                         <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.corda.colors[0] }} />
                            <span className="text-bg/30 text-[10px] font-medium">{s.corda.name}</span>
                         </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${s.present ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-bg/10 border border-white/5'}`}>
                         {s.present && <span className="text-sm font-black">✓</span>}
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="pt-4">
                <div className="h-14 rounded-2xl bg-accent flex items-center justify-center text-white font-black text-sm shadow-xl shadow-accent/30 transition-transform active:scale-95">
                   Guardar Asistencia
                </div>
             </div>
          </div>
        )

      case 'graduation':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="mb-4">
                <h4 className="text-bg font-black text-xl">Graduaciones</h4>
                <p className="text-bg/40 text-[11px] mt-1">Adultos educadores desde orden #12</p>
             </div>

             <div className="space-y-6">
                <div>
                   <p className="text-bg/30 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Sistema Adulto</p>
                   <div className="space-y-3">
                      {[
                         { name: 'Corda Verde-Amarela', colors: ['#008000', '#FFD700'], pos: 9 },
                         { name: 'Corda Verde-Azul', colors: ['#008000', '#0000FF'], pos: 10 },
                         { name: 'Monitor (Azul)', colors: ['#0000FF'], pos: 11, educator: true },
                      ].map((l, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 rounded-[28px] bg-white/5 border border-white/10">
                            <span className="text-bg/40 font-black text-[10px] w-6">#{l.pos}</span>
                            <div className="flex-1 space-y-3">
                               <div className="flex justify-between items-center">
                                  <h5 className="text-bg font-bold text-xs">{l.name}</h5>
                                  {l.educator && <span className="text-accent text-[8px] font-black uppercase tracking-tighter">Educador</span>}
                               </div>
                               <CordaVisual colors={l.colors} width={120} height={12} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div>
                   <p className="text-bg/30 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Estagiarios</p>
                   <div className="flex items-center gap-4 p-4 rounded-[28px] bg-white/5 border border-white/10">
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between items-center">
                            <h5 className="text-bg font-bold text-xs">Corda Amarela (Puntas Verdes)</h5>
                         </div>
                         <CordaVisual colors={['#FFD700']} tipLeft="#008000" tipRight="#008000" width={160} height={14} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )

      default:
        return <div className="text-bg/20 text-center py-20 font-black">REPLICANDO FUNCION...</div>
    }
  }

  return (
    <div 
      className={`relative aspect-[9/19] w-full max-w-[300px] mx-auto bg-ink rounded-[44px] border-[10px] border-[#1A1E26] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-500 ${interactive ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      onClick={() => interactive && setCurrentStep(prev => (prev + 1) % 3)}
    >
      {/* Status Bar */}
      <div className="h-10 px-6 pt-4 flex justify-between items-center text-[9px] font-bold text-bg/30 mono uppercase tracking-widest z-20 relative">
        <span>9:41</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border border-current" />
          <div className="w-2.5 h-2.5 rounded-full bg-current" />
        </div>
      </div>

      <div className="absolute inset-0 pt-12 p-6 flex flex-col overflow-hidden">
         {renderScreen()}
      </div>

      {/* Real App Navigation replication */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-bg/5 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 pb-2">
         {[
            { icon: 'home', active: type === 'home' },
            { icon: 'calendar', active: type === 'event' },
            { icon: 'people', active: type === 'graduation' },
            { icon: 'person', active: false }
         ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 ${item.active ? 'text-accent' : 'text-bg/20'}`}>
               <div className={`w-5 h-5 rounded-md border-2 border-current`} />
               <div className={`w-1 h-1 rounded-full ${item.active ? 'bg-accent' : 'transparent'}`} />
            </div>
         ))}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center">
        <div className="w-16 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  )
}
