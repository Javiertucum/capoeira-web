'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FlowStep {
  title: string
  desc: string
}

export default function TutorialSection({ locale }: { locale: string }) {
  const [activeFlow, setActiveFlow] = useState('daily')

  const copy = {
    es: {
      title: 'Explora los flujos de la App',
      subtitle: 'Tutoriales paso a paso para dominar tu comunidad',
      flows: [
        {
          id: 'daily',
          title: 'Gestión Diaria',
          steps: [
            { title: 'Perfil & Onboarding', desc: 'Configura tu identidad, grupo y especialidades en segundos.' },
            { title: 'Asistencia Rápida', desc: 'Toma lista con un toque seleccionando el horario del día.' },
            { title: 'Buscador Global', desc: 'Encuentra cualquier alumno, núcleo o profesor al instante.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administración',
          steps: [
            { title: 'Control de Pagos', desc: 'Gestiona mensualidades, deudas y estados financieros claros.' },
            { title: 'Dashboard KPI', desc: 'Analiza el crecimiento y salud de tu escuela con gráficos.' },
            { title: 'Exportación CSV/PDF', desc: 'Genera reportes profesionales listos para compartir.' }
          ]
        },
        {
          id: 'community',
          title: 'Comunidad',
          steps: [
            { title: 'Feed Personalizado', desc: 'Mantente al día con noticias y eventos de tu mundo capoeira.' },
            { title: 'Mapa de Núcleos', desc: 'Encuentra dónde entrenar en cualquier parte del mundo.' },
            { title: 'Gestión de Eventos', desc: 'Publica batizados y rodas con posters y ubicación GPS.' }
          ]
        },
        {
          id: 'leadership',
          title: 'Liderazgo',
          steps: [
            { title: 'Jerarquía de Grupo', desc: 'Supervisa múltiples profesores y sedes de forma centralizada.' },
            { title: 'Sistema de Cordas', desc: 'Define el sistema de grados oficial de tu organización.' },
            { title: 'Métricas de Avance', desc: 'Analiza quién está listo para subir de nivel objetivamente.' }
          ]
        }
      ]
    },
    pt: {
      title: 'Explore os fluxos da App',
      subtitle: 'Tutoriais passo a passo para dominar sua comunidade',
      flows: [
        {
          id: 'daily',
          title: 'Gestão Diária',
          steps: [
            { title: 'Perfil & Onboarding', desc: 'Configure sua identidade, grupo e especialidades em segundos.' },
            { title: 'Chamada Rápida', desc: 'Faça a chamada com um toque selecionando o horário do dia.' },
            { title: 'Busca Global', desc: 'Encontre qualquer aluno, núcleo ou professor instantaneamente.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administração',
          steps: [
            { title: 'Controle de Pagamentos', desc: 'Gerencie mensalidades, dívidas e estados financeiros claros.' },
            { title: 'Dashboard KPI', desc: 'Analise o crescimento e saúde da sua escola com gráficos.' },
            { title: 'Exportação CSV/PDF', desc: 'Gere relatórios profissionais prontos para compartilhar.' }
          ]
        },
        {
          id: 'community',
          title: 'Comunidade',
          steps: [
            { title: 'Feed Personalizado', desc: 'Fique em dia com notícias e eventos do seu mundo capoeira.' },
            { title: 'Mapa de Núcleos', desc: 'Encontre onde treinar em qualquer parte do mundo.' },
            { title: 'Gestão de Eventos', desc: 'Publique batizados e rodas com posters e localização GPS.' }
          ]
        },
        {
          id: 'leadership',
          title: 'Liderança',
          steps: [
            { title: 'Hierarquia de Grupo', desc: 'Supervisione múltiplos professores e sedes de forma centralizada.' },
            { title: 'Sistema de Cordas', desc: 'Defina o sistema de graus oficial da sua organização.' },
            { title: 'Métricas de Avanço', desc: 'Analise quem está pronto para subir de nível objetivamente.' }
          ]
        }
      ]
    },
    en: {
      title: 'Explore App Flows',
      subtitle: 'Step-by-step tutorials to master your community',
      flows: [
        {
          id: 'daily',
          title: 'Daily Management',
          steps: [
            { title: 'Profile & Onboarding', desc: 'Setup your identity, group, and specialties in seconds.' },
            { title: 'Quick Attendance', desc: 'Take attendance with a tap by selecting the daily schedule.' },
            { title: 'Global Search', desc: 'Find any student, center, or teacher instantly.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administration',
          steps: [
            { title: 'Payment Control', desc: 'Manage monthly fees, debts, and clear financial statuses.' },
            { title: 'KPI Dashboard', desc: 'Analyze your school growth and health with charts.' },
            { title: 'CSV/PDF Export', desc: 'Generate professional reports ready to share.' }
          ]
        },
        {
          id: 'community',
          title: 'Community',
          steps: [
            { title: 'Personalized Feed', desc: 'Stay up to date with news and events from your capoeira world.' },
            { title: 'Center Map', desc: 'Find where to train anywhere in the world.' },
            { title: 'Event Management', desc: 'Publish batizados and rodas with posters and GPS location.' }
          ]
        },
        {
          id: 'leadership',
          title: 'Leadership',
          steps: [
            { title: 'Group Hierarchy', desc: 'Supervise multiple teachers and locations centrally.' },
            { title: 'Belt System', desc: 'Define your organization\'s official grading system.' },
            { title: 'Progress Metrics', desc: 'Analyze who is ready to level up objectively.' }
          ]
        }
      ]
    }
  }

  const c = copy[locale as keyof typeof copy] ?? copy.en
  const currentFlow = c.flows.find(f => f.id === activeFlow) ?? c.flows[0]

  return (
    <div id="tutorials" className="py-24 border-t border-bg/10">
      <div className="text-center mb-16">
        <h2 className="text-bg font-black text-4xl lg:text-5xl tracking-tight mb-4">{c.title}</h2>
        <p className="text-bg/50 text-lg">{c.subtitle}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        {/* Tabs */}
        <div className="flex flex-col gap-3">
          {c.flows.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFlow(f.id)}
              className={`flex items-center gap-4 px-6 py-5 rounded-[24px] border transition-all text-left ${
                activeFlow === f.id 
                  ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-[1.02]' 
                  : 'bg-bg/5 border-bg/10 text-bg/60 hover:bg-bg/10 hover:border-bg/20'
              }`}
            >
              <span className="font-black text-lg tracking-tight">{f.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-bg/5 rounded-[48px] border border-bg/10 p-8 lg:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-64 w-64 bg-accent/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-accent/20 transition-all duration-700" />
          
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] items-center relative z-10">
             <div className="space-y-8">
               {currentFlow.steps.map((s, idx) => (
                 <div key={s.title} className="flex gap-6 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="h-10 w-10 rounded-xl bg-accent text-white flex items-center justify-center font-black flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-bg mb-2">{s.title}</h4>
                      <p className="text-bg/50 leading-relaxed">{s.desc}</p>
                    </div>
                 </div>
               ))}
             </div>

             {/* Live UI Mockup (React-based for maximum sharpness and control) */}
             <div className="hidden lg:block aspect-[9/19] w-full max-w-[300px] mx-auto bg-ink rounded-[44px] border-[10px] border-[#1A1E26] overflow-hidden relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] group-hover:scale-[1.02] transition-transform duration-700 ring-1 ring-white/10">
                {/* Status Bar */}
                <div className="h-10 px-6 pt-4 flex justify-between items-center text-[10px] font-bold text-bg/40 mono uppercase tracking-widest z-20 relative">
                   <span>9:41</span>
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full border border-current" />
                      <div className="w-3 h-3 rounded-full bg-current" />
                   </div>
                </div>

                <div className="absolute inset-0 pt-12 p-5 flex flex-col overflow-hidden">
                   {activeFlow === 'daily' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-4">
                               <div className="w-12 h-12 rounded-full bg-accent/40" />
                            </div>
                            <h4 className="text-bg font-black text-lg">Javier Muñoz</h4>
                            <p className="text-accent text-[11px] font-bold tracking-widest uppercase">Tucum</p>
                         </div>
                         <div className="space-y-3">
                            <div className="h-12 rounded-2xl bg-white/5 border border-white/10 px-4 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">✓</div>
                                  <div className="w-24 h-2 bg-white/10 rounded-full" />
                               </div>
                               <div className="w-8 h-2 bg-white/5 rounded-full" />
                            </div>
                            <div className="h-12 rounded-2xl bg-white/5 border border-white/10 px-4 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-lg bg-white/10" />
                                  <div className="w-20 h-2 bg-white/10 rounded-full" />
                               </div>
                               <div className="w-8 h-2 bg-white/5 rounded-full" />
                            </div>
                            <div className="h-32 rounded-2xl bg-white/5 border border-white/10 p-4">
                               <div className="w-full h-2 bg-white/10 rounded-full mb-3" />
                               <div className="w-5/6 h-2 bg-white/10 rounded-full" />
                            </div>
                         </div>
                      </div>
                   )}

                   {activeFlow === 'admin' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="flex justify-between items-end mb-6">
                            <div>
                               <p className="text-bg/40 text-[9px] font-bold uppercase tracking-widest mb-1">Finanzas</p>
                               <h4 className="text-bg font-black text-xl">Marzo 2026</h4>
                            </div>
                            <div className="bg-accent px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">
                               KPI +12%
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                               <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                                  <div className={`w-4 h-4 rounded-lg ${i % 2 === 0 ? 'bg-green-500/20' : 'bg-accent/20'}`} />
                                  <div className="h-4 w-12 bg-white/10 rounded-full" />
                                  <div className="h-2 w-8 bg-white/5 rounded-full" />
                               </div>
                            ))}
                         </div>
                         <div className="h-12 rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-accent/20">
                            Descargar Reporte PDF
                         </div>
                      </div>
                   )}

                   {activeFlow === 'community' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="aspect-[4/5] rounded-[24px] bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/20 relative overflow-hidden mb-4">
                            <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-ink/80 to-transparent">
                               <span className="bg-accent w-fit px-2 py-0.5 rounded text-[8px] font-black text-white uppercase mb-2">25-26 ABR</span>
                               <h4 className="text-bg font-bold text-sm leading-tight">Batizado & Troca de Cordas</h4>
                               <p className="text-bg/60 text-[10px] mt-1">Bom Caminho, Chile</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <div className="flex-1 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-bg">
                               Ver en el Mapa
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-accent border border-accent flex items-center justify-center shadow-lg shadow-accent/20">
                               <div className="w-4 h-4 border-2 border-white rounded-full" />
                            </div>
                         </div>
                      </div>
                   )}

                   {activeFlow === 'leadership' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <h4 className="text-bg font-black text-lg mb-6">Jerarquía & Cordas</h4>
                         <div className="space-y-3">
                            {[
                               { c: '#008000', n: 'Corda Verde', r: '7 Alumnos' },
                               { c: '#FFD700', n: 'Corda Amarela', r: '4 Alumnos' },
                               { c: '#0000FF', n: 'Corda Azul', r: '2 Alumnos' },
                               { c: '#008000', n: 'Monitor', r: '1 Profesor', split: true }
                            ].map((belt, i) => (
                               <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                                  <div 
                                    className="w-12 h-2.5 rounded-full shadow-inner" 
                                    style={{ 
                                      background: belt.split 
                                        ? `linear-gradient(to right, white 50%, ${belt.c} 50%)` 
                                        : belt.c 
                                    }} 
                                  />
                                  <div>
                                     <p className="text-bg font-bold text-[11px] leading-none mb-1">{belt.n}</p>
                                     <p className="text-bg/40 text-[9px] font-medium leading-none">{belt.r}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center">
                   <div className="w-20 h-1 rounded-full bg-white/10" />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
