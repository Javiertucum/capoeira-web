'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FlowStep {
  title: string
  desc: string
}

interface Flow {
  id: string
  title: string
  icon: React.ReactNode
  steps: FlowStep[]
}

export default function TutorialSection({ locale }: { locale: string }) {
  const [activeFlow, setActiveFlow] = useState('onboarding')

  const copy = {
    es: {
      title: 'Explora los flujos de la App',
      subtitle: 'Tutoriales paso a paso para dominar tu comunidad',
      flows: [
        {
          id: 'onboarding',
          title: 'Onboarding',
          steps: [
            { title: 'Perfil', desc: 'Configura tu avatar, bio y redes sociales para que el mundo te conozca.' },
            { title: 'Grupo', desc: 'Busca tu grupo actual o crea uno nuevo definiendo el sistema de cordas.' },
            { title: 'Sede', desc: 'Registra tu núcleo de entrenamiento, mapa y horarios oficiales.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administración',
          steps: [
            { title: 'Asistencia', desc: 'Pasa lista en segundos seleccionando el horario del día.' },
            { title: 'Pagos', desc: 'Registra mensualidades y clases sueltas con estados de pago claros.' },
            { title: 'Reportes', desc: 'Genera PDFs y CSVs mensuales para una gestión profesional.' }
          ]
        },
        {
          id: 'events',
          title: 'Eventos',
          steps: [
            { title: 'Creación', desc: 'Define fechas, ubicación interactiva y categorías del evento.' },
            { title: 'Posters', desc: 'Sube múltiples imágenes para darle visibilidad a tu batizado.' },
            { title: 'Colaboradores', desc: 'Invita a otros educadores para gestionar el evento en equipo.' }
          ]
        },
        {
          id: 'graduations',
          title: 'Graduaciones',
          steps: [
            { title: 'Sistema', desc: 'Define los niveles de cordas, sus colores y nombres oficiales.' },
            { title: 'Umbral', desc: 'Marca a partir de qué nivel un alumno se considera educador.' },
            { title: 'Asignación', desc: 'Gradúa a tus alumnos de forma masiva o individual desde su perfil.' }
          ]
        }
      ]
    },
    pt: {
      title: 'Explore os fluxos da App',
      subtitle: 'Tutoriais passo a paso para dominar sua comunidade',
      flows: [
        {
          id: 'onboarding',
          title: 'Onboarding',
          steps: [
            { title: 'Perfil', desc: 'Configure seu avatar, bio e redes sociais para o mundo te conhecer.' },
            { title: 'Grupo', desc: 'Busque seu grupo atual ou crie um novo definindo o sistema de cordas.' },
            { title: 'Sede', desc: 'Registre seu núcleo de treino, mapa e horários oficiais.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administração',
          steps: [
            { title: 'Chamada', desc: 'Faça a chamada em segundos selecionando o horário do dia.' },
            { title: 'Pagos', desc: 'Registre mensalidades e aulas avulsas com estados de pagamento claros.' },
            { title: 'Relatórios', desc: 'Gere PDFs e CSVs mensais para uma gestão profissional.' }
          ]
        },
        {
          id: 'events',
          title: 'Eventos',
          steps: [
            { title: 'Criação', desc: 'Defina datas, localização interativa e categorias do evento.' },
            { title: 'Posters', desc: 'Suba múltiplas imagens para dar visibilidade ao seu batizado.' },
            { title: 'Colaboradores', desc: 'Convide outros educadores para gerenciar o evento em equipe.' }
          ]
        },
        {
          id: 'graduations',
          title: 'Graduações',
          steps: [
            { title: 'Sistema', desc: 'Defina os níveis de cordas, suas cores e nomes oficiais.' },
            { title: 'Limite', desc: 'Marque a partir de qual nível um aluno é considerado educador.' },
            { title: 'Atribuição', desc: 'Gradue seus alunos de forma massiva ou individual no perfil.' }
          ]
        }
      ]
    },
    en: {
      title: 'Explore App Flows',
      subtitle: 'Step-by-step tutorials to master your community',
      flows: [
        {
          id: 'onboarding',
          title: 'Onboarding',
          steps: [
            { title: 'Profile', desc: 'Setup your avatar, bio, and social links to show yourself to the world.' },
            { title: 'Group', desc: 'Find your current group or create a new one defining the corda system.' },
            { title: 'Location', desc: 'Register your training school, map, and official schedules.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administration',
          steps: [
            { title: 'Attendance', desc: 'Take attendance in seconds by selecting the daily schedule.' },
            { title: 'Payments', desc: 'Record monthly fees and single classes with clear payment statuses.' },
            { title: 'Reports', desc: 'Generate monthly PDFs and CSVs for professional management.' }
          ]
        },
        {
          id: 'events',
          title: 'Events',
          steps: [
            { title: 'Creation', desc: 'Define dates, interactive location, and event categories.' },
            { title: 'Posters', desc: 'Upload multiple images to give visibility to your batizado.' },
            { title: 'Collaborators', desc: 'Invite other educators to manage the event as a team.' }
          ]
        },
        {
          id: 'graduations',
          title: 'Graduations',
          steps: [
            { title: 'System', desc: 'Define corda levels, colors, and official names.' },
            { title: 'Threshold', desc: 'Mark at which level a student is considered an educator.' },
            { title: 'Assignment', desc: 'Graduate students in bulk or individually from their profile.' }
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
                   {activeFlow === 'onboarding' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-4">
                               <div className="w-12 h-12 rounded-full bg-accent/40" />
                            </div>
                            <h4 className="text-bg font-black text-lg">Javier Muñoz</h4>
                            <p className="text-accent text-[11px] font-bold tracking-widest uppercase">Tucum</p>
                         </div>
                         <div className="space-y-3">
                            <div className="h-12 rounded-2xl bg-white/5 border border-white/10 px-4 flex items-center">
                               <div className="w-full h-2 bg-white/10 rounded-full" />
                            </div>
                            <div className="h-12 rounded-2xl bg-white/5 border border-white/10 px-4 flex items-center">
                               <div className="w-2/3 h-2 bg-white/10 rounded-full" />
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
                               <p className="text-bg/40 text-[9px] font-bold uppercase tracking-widest mb-1">Reporte Mensual</p>
                               <h4 className="text-bg font-black text-xl">Marzo 2026</h4>
                            </div>
                            <div className="bg-accent px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">
                               KPI +12%
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                               <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                                  <div className="w-4 h-4 rounded-lg bg-accent/20" />
                                  <div className="h-4 w-12 bg-white/10 rounded-full" />
                                  <div className="h-2 w-8 bg-white/5 rounded-full" />
                               </div>
                            ))}
                         </div>
                         <div className="h-12 rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-xs">
                            Descargar Reporte PDF
                         </div>
                      </div>
                   )}

                   {activeFlow === 'events' && (
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
                               Confirmar
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                               <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                            </div>
                         </div>
                      </div>
                   )}

                   {activeFlow === 'graduations' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <h4 className="text-bg font-black text-lg mb-6">Sistema de Cordas</h4>
                         <div className="space-y-3">
                            {[
                               { c: '#008000', n: 'Corda Verde', r: 'Alumno Graduado' },
                               { c: '#FFD700', n: 'Corda Amarela', r: 'Alumno Graduado I' },
                               { c: '#0000FF', n: 'Corda Azul', r: 'Alumno Graduado II' },
                               { c: '#008000', n: 'Branca / Verde', r: 'Instructor', split: true }
                            ].map((belt, i) => (
                               <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                                  <div 
                                    className="w-12 h-2.5 rounded-full" 
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
