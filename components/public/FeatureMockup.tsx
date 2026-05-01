'use client'

import React, { useState, useEffect } from 'react'

interface FeatureMockupProps {
  type: 'educator' | 'student' | 'finance' | 'map' | 'attendance' | 'group' | 'profile'
  interactive?: boolean
}

const INVENTED_STUDENTS = [
  { name: 'Mola', belt: 'Verde', status: 'pago' },
  { name: 'Tucum', belt: 'Amarela', status: 'pendiente' },
  { name: 'Sabiá', belt: 'Azul', status: 'pago' },
  { name: 'Cascavel', belt: 'Verde', status: 'pago' },
  { name: 'Aranha', belt: 'Branca/Verde', status: 'pago' },
]

export default function FeatureMockup({ type, interactive = false }: FeatureMockupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  
  // Auto-cycle for non-interactive versions or just to show life
  useEffect(() => {
    if (!interactive) {
      const timer = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % 3)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [interactive])

  const renderScreen = () => {
    switch (type) {
      case 'educator':
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
             <div className="flex justify-between items-end mb-2">
                <div>
                   <p className="text-[10px] text-bg/40 font-bold uppercase tracking-widest">Dashboard</p>
                   <h4 className="text-bg font-black text-xl">Bom Caminho</h4>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-white font-black text-xs shadow-lg shadow-accent/40">
                   BC
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-[8px] text-bg/40 font-bold uppercase">Alumnos</span>
                   </div>
                   <p className="text-bg font-black text-2xl">142</p>
                   <p className="text-green-500 text-[9px] font-bold mt-1">+12% este mes</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[8px] text-bg/40 font-bold uppercase">Asistencia</span>
                   </div>
                   <p className="text-bg font-black text-2xl">89%</p>
                   <p className="text-bg/30 text-[9px] font-medium mt-1">Media semanal</p>
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-[28px] p-5">
                <h5 className="text-bg font-bold text-xs mb-4">Próximos Batizados</h5>
                <div className="space-y-3">
                   {[
                      { name: 'Ginga Chile 2026', date: '15 May', color: 'bg-accent' },
                      { name: 'Encontro Europeu', date: '22 Jun', color: 'bg-blue-500' }
                   ].map((ev, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-6 rounded-full ${ev.color}`} />
                            <span className="text-bg font-bold text-[11px]">{ev.name}</span>
                         </div>
                         <span className="text-bg/30 text-[9px] font-mono">{ev.date}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )
      
      case 'finance':
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-bg font-black text-xl">Finanzas</h4>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[9px] font-black uppercase">En Meta</div>
             </div>
             
             <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-[32px] p-6 text-white shadow-xl shadow-green-900/20">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Recaudación Total</p>
                <p className="text-3xl font-black">$4.280.500</p>
                <div className="mt-4 flex gap-2">
                   <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-3/4" />
                   </div>
                   <span className="text-[9px] font-bold">75%</span>
                </div>
             </div>

             <div className="space-y-2">
                <p className="text-[10px] text-bg/30 font-bold uppercase tracking-widest mb-3">Estados de Pago</p>
                {INVENTED_STUDENTS.map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] ${s.status === 'pago' ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'}`}>
                            {s.name[0]}
                         </div>
                         <div>
                            <p className="text-bg font-bold text-xs">{s.name}</p>
                            <p className="text-bg/30 text-[9px] font-medium">{s.belt}</p>
                         </div>
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-tighter ${s.status === 'pago' ? 'text-green-500' : 'text-accent'}`}>
                         {s.status}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )

      case 'attendance':
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-bg font-black text-xl">Asistencia</h4>
                <div className="bg-white/10 px-4 py-2 rounded-2xl text-[10px] font-bold text-bg">18:30 - Intermedios</div>
             </div>
             
             <div className="flex gap-2 mb-4">
                {['L', 'M', 'X', 'J', 'V'].map((d, i) => (
                   <div key={i} className={`flex-1 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all ${i === 2 ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-bg/40'}`}>
                      <span className="text-[10px] font-bold">{d}</span>
                      <span className="text-xs font-black">{20 + i}</span>
                   </div>
                ))}
             </div>

             <div className="space-y-3">
                {INVENTED_STUDENTS.map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-2 pl-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-bg font-bold text-xs">{s.name}</span>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${i % 3 === 0 ? 'bg-white/5 text-bg/20' : 'bg-green-500 text-white shadow-lg shadow-green-500/20'}`}>
                         {i % 3 === 0 ? '○' : '✓'}
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="h-14 rounded-2xl bg-accent flex items-center justify-center text-white font-black text-sm shadow-xl shadow-accent/20">
                Guardar Listado
             </div>
          </div>
        )

      case 'student':
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-accent/20 flex items-center justify-center">
                   <div className="w-6 h-6 rounded-lg bg-accent/40" />
                </div>
                <div>
                   <h4 className="text-bg font-black text-lg">Hola, Mola!</h4>
                   <p className="text-accent text-[10px] font-bold uppercase tracking-widest">Alumno Graduado</p>
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <p className="text-[10px] text-bg/40 font-bold uppercase tracking-widest mb-1">Próxima Clase</p>
                <h5 className="text-bg font-black text-xl mb-4">Núcleo Central</h5>
                <div className="flex gap-4">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-bg/30 font-bold uppercase">Hora</span>
                      <span className="text-bg font-bold text-sm">19:30</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] text-bg/30 font-bold uppercase">Profesor</span>
                      <span className="text-bg font-bold text-sm">Tucum</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h5 className="text-bg font-black text-sm">Tu Avance</h5>
                   <span className="text-accent text-[10px] font-bold">Ver Sistema</span>
                </div>
                <div className="p-5 rounded-[28px] bg-white/5 border border-white/10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-2.5 rounded-full bg-green-500 shadow-inner shadow-black/20" />
                      <span className="text-bg font-bold text-xs">Corda Verde</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-2/3" />
                   </div>
                   <p className="text-[10px] text-bg/40 mt-3 font-medium">Faltan 12 asistencias para el umbral</p>
                </div>
             </div>
          </div>
        )

      default:
        return <div className="text-bg/20 text-center py-20 font-black">PROXIMAMENTE</div>
    }
  }

  return (
    <div 
      className={`relative aspect-[9/19] w-full max-w-[300px] mx-auto bg-ink rounded-[44px] border-[10px] border-[#1A1E26] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-500 ${interactive ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
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

      {/* Navigation Bar Mockup */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-bg/5 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-4">
         {[1,2,3,4].map(i => (
            <div key={i} className={`w-8 h-8 rounded-xl ${i === 1 ? 'bg-accent/20 text-accent' : 'text-bg/20'} flex items-center justify-center`}>
               <div className={`w-4 h-4 rounded-full border-2 border-current`} />
            </div>
         ))}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center">
        <div className="w-16 h-1 rounded-full bg-white/20" />
      </div>

      {interactive && (
        <div className="absolute top-12 right-6 bg-accent/20 text-accent text-[8px] font-black px-2 py-1 rounded-full animate-pulse">
           TAP PARA CAMBIAR
        </div>
      )}
    </div>
  )
}
