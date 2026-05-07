'use client'

import { useState } from 'react'
import FeatureMockup from './FeatureMockup'

export default function TutorialSection({ locale }: { locale: string }) {
  const [activeFlow, setActiveFlow] = useState('home')

  const copy = {
    es: {
      title: 'Funciones reales, diseño nativo',
      subtitle: 'Explora la interfaz de la App replicada en la web',
      flows: [
        {
          id: 'home',
          title: 'Panel Personalizado',
          mockup: 'home',
          steps: [
            { title: 'Tu Agenda al Día', desc: 'Ve tus próximos eventos, rodas y clases al entrar a la app — con saludo personalizado y fecha en tiempo real.' },
            { title: 'Buscador de Red', desc: 'Encuentra núcleos, educadores o eventos en segundos con filtros por día, semana o mes.' },
            { title: 'Tarjetas de Evento Reales', desc: 'Cada evento muestra su categoría (Batizado, Workshop, Roda), precio y cantidad de confirmados.' }
          ]
        },
        {
          id: 'attendance',
          title: 'Control de Asistencia',
          mockup: 'attendance',
          steps: [
            { title: 'Pasa Lista por Horario', desc: 'Selecciona la sesión del día (Iniciantes 18:30, Avançados 19:45) y marca asistencia con un toque.' },
            { title: 'Identidad Visual', desc: 'Cada alumno muestra su apodo y su corda con los colores exactos configurados en tu sistema de graduación.' },
            { title: 'Registro en la Nube', desc: 'Al guardar, los datos se sincronizan con Firebase para generar reportes mensuales y estadísticas del grupo.' }
          ]
        },
        {
          id: 'graduation',
          title: 'Sistema de Cordas',
          mockup: 'graduation',
          steps: [
            { title: 'Jerarquía Configurable', desc: 'Define el sistema de grados de tu grupo. Soporta cordas sólidas, split y trenzadas diagonalmente.' },
            { title: 'Umbral de Educador', desc: 'Configura a partir de qué grado un alumno es considerado educador y puede supervisar sus propios núcleos.' },
            { title: 'Puntas y Especiales', desc: 'Gestiona graduaciones estagiarias con puntas de colores, niveles infantiles y categorías personalizadas.' }
          ]
        },
        {
          id: 'finances',
          title: 'Finanzas del Núcleo',
          mockup: 'finances',
          steps: [
            { title: 'Balance Multi-Moneda', desc: 'Visualiza el balance total de tu núcleo en CLP, USD o EUR — todo en una sola vista actualizada.' },
            { title: 'Cobros Recientes', desc: 'Registra mensualidades y clases sueltas por alumno. El historial queda guardado y categorizado por mes.' },
            { title: 'Control de Tesorería', desc: 'El educador ve exactamente quién pagó, quién está pendiente y cuánto ingresó en el período.' }
          ]
        },
        {
          id: 'map',
          title: 'Mapa Global',
          mockup: 'map',
          steps: [
            { title: 'Directorio Mundial', desc: 'Todos los núcleos registrados aparecen en un mapa interactivo. Busca por ciudad, país o nombre de grupo.' },
            { title: 'Ficha del Núcleo', desc: 'Desde el mapa accedes a los horarios, el educador responsable y los datos de contacto del núcleo.' },
            { title: 'Presencia Global', desc: 'La comunidad de capoeira en Chile, Brasil, Europa y el mundo — visible en tiempo real para cualquier usuario.' }
          ]
        }
      ]
    },
    pt: {
      title: 'Funções reais, design nativo',
      subtitle: 'Explore a interface do App replicada na web',
      flows: [
        {
          id: 'home',
          title: 'Painel Personalizado',
          mockup: 'home',
          steps: [
            { title: 'Sua Agenda em Dia', desc: 'Veja seus próximos eventos, rodas e aulas ao abrir o app — com saudação personalizada e data em tempo real.' },
            { title: 'Busca de Rede', desc: 'Encontre núcleos, educadores ou eventos em segundos com filtros por dia, semana ou mês.' },
            { title: 'Cards de Evento Reais', desc: 'Cada evento mostra sua categoria (Batizado, Workshop, Roda), preço e total de confirmados.' }
          ]
        },
        {
          id: 'attendance',
          title: 'Controle de Presença',
          mockup: 'attendance',
          steps: [
            { title: 'Chamada por Horário', desc: 'Selecione a sessão do dia (Iniciantes 18:30, Avançados 19:45) e marque a presença com um toque.' },
            { title: 'Identidade Visual', desc: 'Cada aluno mostra seu apelido e sua corda com as cores exatas configuradas no seu sistema de graduação.' },
            { title: 'Registro na Nuvem', desc: 'Ao salvar, os dados sobem para o Firebase para gerar relatórios mensais e estatísticas do grupo.' }
          ]
        },
        {
          id: 'graduation',
          title: 'Sistema de Cordas',
          mockup: 'graduation',
          steps: [
            { title: 'Hierarquia Configurável', desc: 'Defina o sistema de graus do seu grupo. Suporta cordas sólidas, split e trançadas diagonalmente.' },
            { title: 'Limite de Educador', desc: 'Configure a partir de qual grau um aluno é considerado educador e pode supervisionar núcleos próprios.' },
            { title: 'Pontas e Especiais', desc: 'Gerencie graduações estagiárias com pontas coloridas, níveis infantis e categorias personalizadas.' }
          ]
        },
        {
          id: 'finances',
          title: 'Finanças do Núcleo',
          mockup: 'finances',
          steps: [
            { title: 'Saldo Multi-Moeda', desc: 'Visualize o saldo total do seu núcleo em BRL, USD ou EUR — tudo em uma única tela atualizada.' },
            { title: 'Cobranças Recentes', desc: 'Registre mensalidades e aulas avulsas por aluno. O histórico fica salvo e categorizado por mês.' },
            { title: 'Controle de Tesouraria', desc: 'O educador vê exatamente quem pagou, quem está pendente e quanto entrou no período.' }
          ]
        },
        {
          id: 'map',
          title: 'Mapa Global',
          mockup: 'map',
          steps: [
            { title: 'Diretório Mundial', desc: 'Todos os núcleos registrados aparecem em um mapa interativo. Busque por cidade, país ou nome do grupo.' },
            { title: 'Ficha do Núcleo', desc: 'Do mapa você acessa os horários, o educador responsável e os dados de contato do núcleo.' },
            { title: 'Presença Global', desc: 'A comunidade da capoeira no Brasil, Chile, Europa e no mundo — visível em tempo real para qualquer usuário.' }
          ]
        }
      ]
    },
    en: {
      title: 'Real features, native design',
      subtitle: 'Explore the App interface replicated on the web',
      flows: [
        {
          id: 'home',
          title: 'Personalized Panel',
          mockup: 'home',
          steps: [
            { title: 'Your Daily Agenda', desc: 'See your upcoming events, rodas, and classes the moment you open the app — with a personalized greeting and live date.' },
            { title: 'Network Search', desc: 'Find centers, educators, or events in seconds using day, week, or month filters.' },
            { title: 'Real Event Cards', desc: 'Each event shows its category (Batizado, Workshop, Roda), price, and number of confirmed attendees.' }
          ]
        },
        {
          id: 'attendance',
          title: 'Attendance Control',
          mockup: 'attendance',
          steps: [
            { title: 'Take Attendance by Session', desc: 'Select the day\'s session (Beginners 18:30, Advanced 19:45) and mark attendance with a single tap.' },
            { title: 'Visual Identity', desc: 'Each student displays their nickname and belt with the exact colors configured in your graduation system.' },
            { title: 'Cloud Sync', desc: 'When saved, data is synced to Firebase to generate monthly reports and group statistics.' }
          ]
        },
        {
          id: 'graduation',
          title: 'Belt System',
          mockup: 'graduation',
          steps: [
            { title: 'Configurable Hierarchy', desc: 'Define your group\'s grading system. Supports solid, split, and diagonally braided belts.' },
            { title: 'Educator Threshold', desc: 'Set at which rank a student becomes an educator and can supervise their own training centers.' },
            { title: 'Tips & Specials', desc: 'Manage intern graduations with colored tips, child/youth levels, and custom categories.' }
          ]
        },
        {
          id: 'finances',
          title: 'Center Finances',
          mockup: 'finances',
          steps: [
            { title: 'Multi-Currency Balance', desc: 'View your center\'s total balance in CLP, USD, or EUR — all in a single updated view.' },
            { title: 'Recent Collections', desc: 'Log monthly fees and single-class payments per student. History is saved and categorized by month.' },
            { title: 'Treasury Control', desc: 'The educator sees exactly who paid, who is pending, and how much came in during the period.' }
          ]
        },
        {
          id: 'map',
          title: 'Global Map',
          mockup: 'map',
          steps: [
            { title: 'World Directory', desc: 'All registered centers appear on an interactive map. Search by city, country, or group name.' },
            { title: 'Center Profile', desc: 'From the map you access schedules, the responsible educator, and the center\'s contact details.' },
            { title: 'Global Presence', desc: 'The capoeira community in Chile, Brazil, Europe, and worldwide — visible in real time to any user.' }
          ]
        }
      ]
    }
  }

  const c = copy[locale as keyof typeof copy] ?? copy.en
  const currentFlow = c.flows.find(f => f.id === activeFlow) ?? c.flows[0]
  const moduleNumber = (i: number) => String(i + 1).padStart(2, '0')

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
        <div className="flex flex-col gap-3">
          {c.flows.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFlow(f.id)}
              className={`group flex items-center justify-between gap-4 px-7 py-6 rounded-[28px] border transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[var(--ease-out)] text-left relative overflow-hidden active:scale-[0.98] ${
                activeFlow === f.id
                  ? 'bg-accent border-accent text-white shadow-vanguard scale-[1.03] z-10'
                  : 'bg-[#10131A]/5 border-[#10131A]/10 text-[#10131A]/40 hover:bg-[#10131A]/8 hover:border-[#10131A]/20'
              }`}
            >
              <div className="relative z-10">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${activeFlow === f.id ? 'text-white/60' : 'text-accent'}`}>
                  Módulo {moduleNumber(i)}
                </p>
                <span className="font-black text-[18px] tracking-tight leading-tight">{f.title}</span>
              </div>
              <div className={`transition-[transform,opacity] duration-200 ease-[var(--ease-out)] group-hover:translate-x-1 flex-shrink-0 ${activeFlow === f.id ? 'opacity-100' : 'opacity-0'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
            <div className="grid gap-16 lg:grid-cols-[1fr_320px] items-center">
              <div className="space-y-10">
                {currentFlow.steps.map((s, idx) => (
                  <div key={idx} className="flex gap-7 emil-enter-stagger" style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="h-11 w-11 rounded-2xl bg-accent text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-accent/20 text-lg rotate-3">
                      {idx + 1}
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xl font-black text-[#10131A] tracking-tight">{s.title}</h4>
                      <p className="text-base text-[#10131A]/60 leading-relaxed font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-8 border-t border-[#10131A]/10 flex items-center gap-5">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-[#10131A]/10 backdrop-blur-sm" />
                    ))}
                  </div>
                  <div>
                    <p className="text-[#10131A] font-black text-sm tracking-tight leading-none">Experiencia Fluida</p>
                    <p className="text-accent text-[10px] font-bold uppercase tracking-widest mt-1">Navegación nativa y rápida</p>
                  </div>
                </div>
              </div>

              <div className="emil-enter relative" key={currentFlow.id}>
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
