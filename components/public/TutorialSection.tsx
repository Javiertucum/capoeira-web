'use client'

import { useState } from 'react'

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
    <div className="py-24 border-t border-bg/10">
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

             {/* Mockup Placeholder */}
             <div className="hidden lg:block aspect-[9/19] bg-bg/10 rounded-[32px] border-[6px] border-bg/20 overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-bg/20 font-black tracking-widest text-xs uppercase vertical-rl opacity-50">
                   {currentFlow.title} VIEW
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
