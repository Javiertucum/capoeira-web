'use client'

import React, { useState, useEffect } from 'react'

interface FeatureMockupProps {
  type: 'home' | 'attendance' | 'graduation' | 'event' | 'educator' | 'finances' | 'kpi' | 'map'
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

      case 'finances':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="pt-2">
                <p className="text-accent text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Tesorería</p>
                <h4 className="text-bg font-black text-2xl leading-tight">Finanzas</h4>
             </div>
             
             {/* Multi-currency balance card */}
             <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-5 rounded-[28px] border border-white/10">
                <p className="text-[10px] font-bold text-bg/40 uppercase tracking-widest mb-1">Balance Total</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-black text-bg">$450.000</span>
                   <span className="text-xs text-bg/30 font-bold">CLP</span>
                </div>
                <div className="mt-4 flex gap-3">
                   <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-bg/60 border border-white/5">U$D 120.00</div>
                   <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-bg/60 border border-white/5">€ 85.00</div>
                </div>
             </div>

             {/* Recent Transactions */}
             <div className="space-y-3">
                <p className="text-[10px] font-black text-bg/30 uppercase tracking-widest">Cobros Recientes</p>
                {[
                   { name: 'Mola', date: 'Hoy', amount: '35.000', type: 'Mensualidad' },
                   { name: 'Tucum', date: 'Ayer', amount: '5.000', type: 'Clase suelta' },
                ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex gap-3 items-center">
                         <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent">{t.name[0]}</div>
                         <div>
                            <p className="text-xs font-bold text-bg">{t.name}</p>
                            <p className="text-[9px] text-bg/40">{t.type}</p>
                         </div>
                      </div>
                      <p className="text-xs font-black text-bg">${t.amount}</p>
                   </div>
                ))}
             </div>
          </div>
        )

      case 'kpi':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="pt-2">
                <p className="text-accent text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Métricas</p>
                <h4 className="text-bg font-black text-2xl leading-tight">Rendimiento</h4>
             </div>

             {/* Growth Chart Mockup */}
             <div className="h-40 w-full bg-white/5 rounded-3xl border border-white/10 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[10px] font-bold text-bg/40">Alumnos Activos</p>
                      <p className="text-xl font-black text-bg">+24% <span className="text-[10px] text-green-400 font-bold">↑</span></p>
                   </div>
                   <div className="px-2 py-1 bg-accent/20 rounded-md text-[8px] font-black text-accent uppercase">30 Días</div>
                </div>
                <div className="flex items-end gap-1 h-16">
                   {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-accent/40 rounded-t-sm" style={{ height: `${h}%` }} />
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] font-bold text-bg/40 mb-1">Asistencia</p>
                   <p className="text-lg font-black text-bg">88%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] font-bold text-bg/40 mb-1">Retención</p>
                   <p className="text-lg font-black text-bg">92%</p>
                </div>
             </div>
          </div>
        )

      case 'map':
        return (
          <div className="relative h-full animate-in fade-in duration-500">
             {/* Map Background Mockup */}
             <div className="absolute inset-0 bg-[#1A1E26]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                
                {/* Map Pins */}
                <div className="absolute top-[30%] left-[40%] group">
                   <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border-4 border-[#0A0C10] shadow-lg animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full" />
                   </div>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0A0C10] px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
                      <p className="text-[9px] font-black text-bg uppercase tracking-widest">Sede Central</p>
                   </div>
                </div>

                <div className="absolute top-[60%] left-[20%]">
                   <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border-4 border-[#0A0C10]">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                   </div>
                </div>

                <div className="absolute top-[50%] left-[70%]">
                   <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border-4 border-[#0A0C10]">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                   </div>
                </div>
             </div>

             {/* Search Floating bar */}
             <div className="absolute top-4 inset-x-4 h-12 glass-dark rounded-full border border-white/10 flex items-center px-5 gap-3 shadow-2xl">
                <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                <p className="text-xs text-bg/40 font-medium">Buscar núcleos...</p>
             </div>

             {/* Location Detail Card */}
             <div className="absolute bottom-4 inset-x-4 glass-dark p-4 rounded-[28px] border border-white/10 shadow-2xl">
                <div className="flex gap-4">
                   <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center border border-white/5">
                      <div className="w-6 h-6 rounded-lg border-2 border-accent" />
                   </div>
                   <div>
                      <h5 className="text-bg font-black text-sm">Núcleo Tucum</h5>
                      <p className="text-bg/50 text-[10px] mt-0.5">Santiago, Chile • 15 Alumnos</p>
                      <div className="flex gap-2 mt-2">
                         <span className="px-2 py-0.5 bg-accent text-white text-[8px] font-black rounded-full uppercase">Activo</span>
                         <span className="px-2 py-0.5 bg-white/5 text-bg/40 text-[8px] font-bold rounded-full border border-white/10 uppercase">Ver detalles</span>
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
    <div className="relative group perspective-1000">
      {/* Glow Effect behind the phone */}
      <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
      
      <div 
        className={`relative aspect-[9/19] w-full max-w-[300px] mx-auto bg-[#0A0C10] rounded-[52px] border-[8px] border-[#1A1E26] overflow-hidden shadow-vanguard ring-1 ring-white/10 transition-all duration-700 hover:rotate-y-2 hover:scale-[1.02] ${interactive ? 'cursor-pointer' : ''}`}
        onClick={() => interactive && setCurrentStep(prev => (prev + 1) % 3)}
      >
        {/* Notch / Dynamic Island replication */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1A1E26] rounded-full z-30 flex items-center justify-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
           <div className="w-8 h-1 bg-white/5 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="h-12 px-8 pt-5 flex justify-between items-center text-[10px] font-black text-bg/30 mono uppercase tracking-widest z-20 relative">
          <span>9:41</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full border border-current opacity-50" />
            <div className="w-3 h-3 rounded-full bg-current" />
          </div>
        </div>

        <div className="absolute inset-0 pt-14 p-6 flex flex-col overflow-hidden">
           {renderScreen()}
        </div>

        {/* Glass Reflection Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30 z-40" />

        {/* Real App Navigation replication */}
        <div className="absolute bottom-0 inset-x-0 h-22 bg-bg/5 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-6 pb-4 z-30">
           {[
              { icon: 'home', active: type === 'home' },
              { icon: 'calendar', active: type === 'event' },
              { icon: 'people', active: type === 'graduation' },
              { icon: 'person', active: false }
           ].map((item, i) => (
              <div key={i} className={`flex flex-col items-center gap-1.5 transition-colors ${item.active ? 'text-accent' : 'text-bg/15'}`}>
                 <div className={`w-6 h-6 rounded-lg border-2 border-current transition-transform ${item.active ? 'scale-110' : 'scale-100'}`} />
                 {item.active && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
              </div>
           ))}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2.5 inset-x-0 flex justify-center z-30">
          <div className="w-20 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}
