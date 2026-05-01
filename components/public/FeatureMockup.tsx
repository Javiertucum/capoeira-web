'use client'

import React from 'react'

interface FeatureMockupProps {
  type: 'educator' | 'student' | 'finance' | 'map'
}

export default function FeatureMockup({ type }: FeatureMockupProps) {
  return (
    <div className="relative aspect-[9/19] w-full max-w-[300px] mx-auto bg-ink rounded-[44px] border-[10px] border-[#1A1E26] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      {/* Status Bar */}
      <div className="h-10 px-6 pt-4 flex justify-between items-center text-[9px] font-bold text-bg/30 mono uppercase tracking-widest z-20 relative">
        <span>9:41</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border border-current" />
          <div className="w-2.5 h-2.5 rounded-full bg-current" />
        </div>
      </div>

      <div className="absolute inset-0 pt-12 p-5 flex flex-col overflow-hidden">
        {type === 'educator' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-bg font-black text-lg">Dashboard</h4>
                <div className="w-8 h-8 rounded-full bg-white/10" />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-3">
                   <p className="text-[8px] text-accent font-bold uppercase mb-1">Alumnos</p>
                   <p className="text-bg font-black text-lg">128</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                   <p className="text-[8px] text-bg/40 font-bold uppercase mb-1">Asistencia</p>
                   <p className="text-bg font-black text-lg">94%</p>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                   <div className="h-2 w-16 bg-white/20 rounded-full" />
                   <div className="h-2 w-8 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-2">
                   {[1,2,3].map(i => (
                      <div key={i} className="flex items-center gap-2">
                         <div className="w-6 h-1 bg-accent/40 rounded-full" style={{ width: i === 1 ? '70%' : i === 2 ? '40%' : '85%' }} />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {type === 'student' && (
          <div className="space-y-4">
             <div className="h-10 rounded-full bg-white/5 border border-white/10 flex items-center px-4 gap-3 mb-4">
                <div className="w-3 h-3 rounded-full border border-white/20" />
                <div className="h-2 w-24 bg-white/10 rounded-full" />
             </div>
             <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent to-accent-ink p-6 flex flex-col justify-end">
                <h4 className="text-white font-black text-xl leading-tight">Tu próxima Roda</h4>
                <p className="text-white/70 text-xs mt-2">Mañana, 18:00 • Santiago</p>
             </div>
             <div className="space-y-3">
                {[1,2].map(i => (
                   <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="space-y-1.5">
                         <div className="h-2 w-24 bg-white/20 rounded-full" />
                         <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {type === 'finance' && (
           <div className="space-y-4">
              <h4 className="text-bg font-black text-lg mb-4">Ingresos</h4>
              <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-5 text-center">
                 <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Marzo</p>
                 <p className="text-bg font-black text-2xl">$1.240.000</p>
              </div>
              <div className="space-y-2">
                 {['Mola', 'Tucum', 'Sabiá'].map(name => (
                    <div key={name} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-bg font-bold text-xs">{name}</span>
                       </div>
                       <span className="text-bg/40 text-[10px]">$35.000</span>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center">
        <div className="w-16 h-1 rounded-full bg-white/10" />
      </div>
    </div>
  )
}
