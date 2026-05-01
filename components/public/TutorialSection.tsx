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
    <div id="tutorials" className="py-24 border-t border-bg/10">
      <div className="text-center mb-16">
        <h2 className="text-bg font-black text-4xl lg:text-5xl tracking-tight mb-4">{c.title}</h2>
        <p className="text-bg/50 text-lg max-w-[600px] mx-auto">{c.subtitle}</p>
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
             <div className="space-y-10">
               {currentFlow.steps.map((s, idx) => (
                 <div key={s.title} className="flex gap-6 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="h-10 w-10 rounded-xl bg-accent text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-accent/20">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-bg mb-2">{s.title}</h4>
                      <p className="text-bg/50 leading-relaxed">{s.desc}</p>
                    </div>
                 </div>
               ))}
               <div className="pt-6 border-t border-white/5">
                  <p className="text-bg/30 text-[11px] font-bold uppercase tracking-widest">Vista previa real v2.5.1</p>
                  <p className="text-accent text-xs font-medium mt-1">Componentes nativos replicados con exactitud</p>
               </div>
             </div>

             <div className="animate-in zoom-in duration-500" key={currentFlow.id}>
                <FeatureMockup type={currentFlow.mockup as any} />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
