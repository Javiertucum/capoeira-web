'use client'

import { useState } from 'react'
import FeatureMockup from './FeatureMockup'

export default function TutorialSection({ locale }: { locale: string }) {
  const [activeFlow, setActiveFlow] = useState('home')

  const copy = {
    es: {
      title: 'Funciones reales, diseño nativo',
      subtitle: 'Explora la interfaz exacta de la App v2.5.1 replicada en la web',
      flows: [
        {
          id: 'home',
          title: 'Panel Personalizado',
          mockup: 'home',
          steps: [
            { title: 'Tu Agenda al Día', desc: 'Visualiza tus próximos eventos, rodas y clases directamente en el inicio con un saludo personalizado.' },
            { title: 'Buscador de Red', desc: 'Encuentra núcleos, profesores o eventos en segundos usando filtros por fecha y ubicación.' },
            { title: 'Event Cards Reales', desc: 'Cada evento muestra su poster, categoría (Batizado, Workshop), precio y confirmados.' }
          ]
        },
        {
          id: 'attendance',
          title: 'Control de Asistencia',
          mockup: 'attendance',
          steps: [
            { title: 'Sesiones de Entrenamiento', desc: 'Pasa lista seleccionando el horario del día (Iniciantes, Avançados, etc) con un solo toque.' },
            { title: 'Identificación Visual', desc: 'Cada alumno muestra su apodo y su corda actual con los colores oficiales de tu grupo.' },
            { title: 'Sincronización Cloud', desc: 'Al guardar la asistencia, los datos se suben a Firebase para generar tus reportes mensuales.' }
          ]
        },
        {
          id: 'graduation',
          title: 'Sistema de Cordas',
          mockup: 'graduation',
          steps: [
            { title: 'Jerarquía Visual', desc: 'Define el sistema de grados de tu grupo. Soporta cordas sólidas, split y trenzadas diagonalmente.' },
            { title: 'Umbral de Educador', desc: 'Configura a partir de qué grado un alumno es considerado educador para supervisar sus propios núcleos.' },
            { title: 'Puntas y Especiales', desc: 'Gestiona graduaciones estagiarias con puntas de colores y niveles infantiles o juveniles.' }
          ]
        }
      ]
    },
    pt: {
      title: 'Funções reais, design nativo',
      subtitle: 'Explore a interface exata da App v2.5.1 replicada na web',
      flows: [
        {
          id: 'home',
          title: 'Painel Personalizado',
          mockup: 'home',
          steps: [
            { title: 'Sua Agenda em Dia', desc: 'Visualize seus próximos eventos, rodas e aulas diretamente no início com saudação personalizada.' },
            { title: 'Busca de Rede', desc: 'Encontre núcleos, professores ou eventos em segundos usando filtros por data e localização.' },
            { title: 'Cards Reais', desc: 'Cada evento mostra seu poster, categoria (Batizado, Workshop), preço e confirmados.' }
          ]
        },
        {
          id: 'attendance',
          title: 'Controle de Presença',
          mockup: 'attendance',
          steps: [
            { title: 'Sessões de Treino', desc: 'Faça a chamada selecionando o horário do dia (Iniciantes, Avançados, etc) com um toque.' },
            { title: 'Identificação Visual', desc: 'Cada aluno mostra seu apelido e sua corda atual com as cores oficiais do seu grupo.' },
            { title: 'Sincronização Cloud', desc: 'Ao salvar a presença, os dados sobem para o Firebase para gerar seus relatórios mensais.' }
          ]
        },
        {
          id: 'graduation',
          title: 'Sistema de Cordas',
          mockup: 'graduation',
          steps: [
            { title: 'Hierarquia Visual', desc: 'Defina o sistema de graus do seu grupo. Suporta cordas sólidas, split e trançadas diagonalmente.' },
            { title: 'Limite de Educador', desc: 'Configure a partir de qual grau um aluno é considerado educador para supervisionar núcleos.' },
            { title: 'Pontas e Especiais', desc: 'Gerencie graduações estagiárias com pontas coloridas e níveis infantis ou juvenis.' }
          ]
        }
      ]
    },
    en: {
      title: 'Real features, native design',
      subtitle: 'Explore the exact App v2.5.1 interface replicated on the web',
      flows: [
        {
          id: 'home',
          title: 'Personalized Panel',
          mockup: 'home',
          steps: [
            { title: 'Your Daily Agenda', desc: 'View your upcoming events, rodas, and classes directly on home with a personalized greeting.' },
            { title: 'Network Search', desc: 'Find centers, teachers, or events in seconds using date and location filters.' },
            { title: 'Real Event Cards', desc: 'Each event displays its poster, category (Batizado, Workshop), price, and attendees.' }
          ]
        },
        {
          id: 'attendance',
          title: 'Attendance Control',
          mockup: 'attendance',
          steps: [
            { title: 'Training Sessions', desc: 'Take attendance by selecting the daily schedule (Beginners, Advanced, etc) with one tap.' },
            { title: 'Visual Identification', desc: 'Each student displays their nickname and current belt with your group\'s official colors.' },
            { title: 'Cloud Sync', desc: 'When saving attendance, data is uploaded to Firebase to generate your monthly reports.' }
          ]
        },
        {
          id: 'graduation',
          title: 'Graduation System',
          mockup: 'graduation',
          steps: [
            { title: 'Visual Hierarchy', desc: 'Define your group\'s grading system. Supports solid, split, and diagonally braided belts.' },
            { title: 'Educator Threshold', desc: 'Configure at which rank a student is considered an educator to supervise their own centers.' },
            { title: 'Tips and Specials', desc: 'Manage intern graduations with colored tips and child or youth levels.' }
          ]
        }
      ]
    }
  }

  const c = copy[locale as keyof typeof copy] ?? copy.en
  const currentFlow = c.flows.find(f => f.id === activeFlow) ?? c.flows[0]

  return (
    <div id="tutorials" className="py-40">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
        <div className="max-w-[800px]">
          <h2 className="text-[#10131A] font-black leading-none tracking-[-0.05em]" style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}>
            {c.title}
          </h2>
        </div>
        <p className="max-w-[400px] text-xl text-[#10131A]/60 leading-relaxed pb-2 font-medium">
          {c.subtitle}
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[340px_1fr]">
        {/* Tabs - Vertical Stack */}
        <div className="flex flex-col gap-4">
          {c.flows.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFlow(f.id)}
              className={`group flex items-center justify-between gap-4 px-8 py-7 rounded-[32px] border transition-all text-left relative overflow-hidden ${
                activeFlow === f.id 
                  ? 'bg-accent border-accent text-white shadow-vanguard scale-[1.05] z-10' 
                  : 'bg-[#10131A]/5 border-[#10131A]/10 text-[#10131A]/40 hover:bg-[#10131A]/10 hover:border-[#10131A]/20'
              }`}
            >
              <div className="relative z-10">
                 <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${activeFlow === f.id ? 'text-white/60' : 'text-accent'}`}>Modulo {f.id === 'home' ? '01' : f.id === 'attendance' ? '02' : '03'}</p>
                 <span className="font-black text-xl tracking-tighter">{f.title}</span>
              </div>
              <div className={`transition-transform duration-500 group-hover:translate-x-1 ${activeFlow === f.id ? 'opacity-100' : 'opacity-0'}`}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              {activeFlow === f.id && (
                 <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
              )}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="relative group">
           {/* Background Glow */}
           <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full opacity-50" />
           
           <div className="relative glass p-10 lg:p-16 rounded-[56px] border-white/40 shadow-vanguard">
              <div className="grid gap-16 lg:grid-cols-[1fr_340px] items-center">
                 <div className="space-y-12">
                   {currentFlow.steps.map((s, idx) => (
                     <div key={idx} className="flex gap-8 animate-in slide-in-from-left-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="h-12 w-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-accent/20 text-xl rotate-3">
                          {idx + 1}
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-2xl font-black text-[#10131A] tracking-tight">{s.title}</h4>
                          <p className="text-lg text-[#10131A]/60 leading-relaxed font-medium">{s.desc}</p>
                        </div>
                     </div>
                   ))}
                   
                   <div className="pt-10 border-t border-[#10131A]/10 flex items-center gap-6">
                      <div className="flex -space-x-3">
                         {[1,2,3].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-[#10131A]/10 backdrop-blur-sm" />
                         ))}
                      </div>
                      <div>
                         <p className="text-[#10131A] font-black text-sm tracking-tight leading-none">v2.5.1 Experience</p>
                         <p className="text-accent text-[10px] font-bold uppercase tracking-widest mt-1">Native components replication</p>
                      </div>
                   </div>
                 </div>

                 <div className="animate-in zoom-in duration-700 relative" key={currentFlow.id}>
                    <div className="absolute inset-0 bg-accent/10 blur-[60px] rounded-full floating" />
                    <FeatureMockup type={currentFlow.mockup as any} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
