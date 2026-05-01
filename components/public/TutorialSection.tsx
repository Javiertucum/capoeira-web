'use client'

import { useState } from 'react'
import FeatureMockup from './FeatureMockup'

export default function TutorialSection({ locale }: { locale: string }) {
  const [activeFlow, setActiveFlow] = useState('daily')

  const copy = {
    es: {
      title: 'Tu escuela en la palma de tu mano',
      subtitle: 'Explora la interfaz real de Agenda Capoeiragem con datos de ejemplo',
      flows: [
        {
          id: 'daily',
          title: 'Gestión Diaria',
          mockup: 'attendance',
          steps: [
            { title: 'Toma de Asistencia', desc: 'Controla quién entrena hoy con un simple toque. Los datos se sincronizan con la nube al instante.' },
            { title: 'Perfiles Detallados', desc: 'Consulta el avance de cada alumno, su corda actual y su frecuencia de entrenamiento.' },
            { title: 'Buscador Inteligente', desc: 'Encuentra cualquier contacto o centro de entrenamiento por nombre o apodo.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administración',
          mockup: 'finance',
          steps: [
            { title: 'Finanzas Claras', desc: 'Visualiza la recaudación mensual y el estado de pagos de todo tu grupo sin Excel.' },
            { title: 'Métricas KPI', desc: 'Analiza el crecimiento de alumnos nuevos y la retención con gráficos profesionales.' },
            { title: 'Reportes en PDF', desc: 'Genera el informe mensual de tu núcleo listo para enviar a tus supervisores.' }
          ]
        },
        {
          id: 'student',
          title: 'Para Alumnos',
          mockup: 'student',
          steps: [
            { title: 'Próximas Clases', desc: 'Revisa cuándo y dónde entrenas hoy. Recibe notificaciones de cambios de última hora.' },
            { title: 'Tu Graduación', desc: 'Mira cuánto te falta para tu próxima corda basándote en tus asistencias reales.' },
            { title: 'Eventos Globales', desc: 'Descubre rodas, workshops y batizados cerca de ti y confirma tu presencia.' }
          ]
        },
        {
          id: 'group',
          title: 'Para Grupos',
          mockup: 'educator',
          steps: [
            { title: 'Control de Sedes', desc: 'Supervisa múltiples núcleos y profesores bajo una misma organización centralizada.' },
            { title: 'Jerarquía Oficial', desc: 'Configura el sistema de cordas único de tu grupo para todos tus profesores.' },
            { title: 'Moderación', desc: 'Aprueba solicitudes de nuevos alumnos y edita la información pública de tus sedes.' }
          ]
        }
      ]
    },
    pt: {
      title: 'Sua escola na palma da mão',
      subtitle: 'Explore a interface real do Agenda Capoeiragem com dados de exemplo',
      flows: [
        {
          id: 'daily',
          title: 'Gestão Diária',
          mockup: 'attendance',
          steps: [
            { title: 'Chamada Rápida', desc: 'Controle quem treina hoje com um simples toque. Dados sincronizados na nuvem.' },
            { title: 'Perfis Detalhados', desc: 'Consulte o progresso de cada aluno, sua corda atual e frequência de treino.' },
            { title: 'Busca Inteligente', desc: 'Encontre qualquer contato ou centro de treino por nome ou apelido.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administração',
          mockup: 'finance',
          steps: [
            { title: 'Finanças Claras', desc: 'Visualize a arrecadação mensal e o status de pagamentos de todo o grupo.' },
            { title: 'Métricas KPI', desc: 'Analise o crescimento de novos alunos e retenção com gráficos profissionais.' },
            { title: 'Relatórios em PDF', desc: 'Gere o relatório mensal do seu núcleo pronto para enviar aos supervisores.' }
          ]
        },
        {
          id: 'student',
          title: 'Para Alunos',
          mockup: 'student',
          steps: [
            { title: 'Próximos Treinos', desc: 'Veja quando e onde treina hoje. Receba notificações de mudanças.' },
            { title: 'Sua Graduação', desc: 'Veja quanto falta para sua próxima corda baseado em suas presenças reais.' },
            { title: 'Eventos Globais', desc: 'Descubra rodas e batizados perto de você e confirme presença.' }
          ]
        },
        {
          id: 'group',
          title: 'Para Grupos',
          mockup: 'educator',
          steps: [
            { title: 'Controle de Sedes', desc: 'Supervisione múltiplos núcleos e professores sob uma mesma organização.' },
            { title: 'Hierarquia Oficial', desc: 'Configure o sistema de cordas único do seu grupo para todos os professores.' },
            { title: 'Moderação', desc: 'Aprove solicitações de novos alunos e edite informações públicas.' }
          ]
        }
      ]
    },
    en: {
      title: 'Your school in your pocket',
      subtitle: 'Explore the real Agenda Capoeiragem interface with sample data',
      flows: [
        {
          id: 'daily',
          title: 'Daily Management',
          mockup: 'attendance',
          steps: [
            { title: 'Quick Attendance', desc: 'Control who trains today with a simple tap. Data syncs instantly to the cloud.' },
            { title: 'Detailed Profiles', desc: 'Check each student\'s progress, current belt, and training frequency.' },
            { title: 'Smart Search', desc: 'Find any contact or training center by name or nickname.' }
          ]
        },
        {
          id: 'admin',
          title: 'Administration',
          mockup: 'finance',
          steps: [
            { title: 'Clear Finances', desc: 'Visualize monthly revenue and payment status for your entire group.' },
            { title: 'KPI Metrics', desc: 'Analyze new student growth and retention with professional charts.' },
            { title: 'PDF Reports', desc: 'Generate your center\'s monthly report ready to send to supervisors.' }
          ]
        },
        {
          id: 'student',
          title: 'For Students',
          mockup: 'student',
          steps: [
            { title: 'Upcoming Classes', desc: 'Check when and where you train today. Get notifications for changes.' },
            { title: 'Your Graduation', desc: 'See how much is left for your next belt based on your real attendance.' },
            { title: 'Global Events', desc: 'Discover rodas and batizados near you and confirm your presence.' }
          ]
        },
        {
          id: 'group',
          title: 'For Groups',
          mockup: 'educator',
          steps: [
            { title: 'Branch Control', desc: 'Supervise multiple centers and teachers under one centralized organization.' },
            { title: 'Official Hierarchy', desc: 'Set up your group\'s unique belt system for all your teachers.' },
            { title: 'Moderation', desc: 'Approve new student requests and edit public branch information.' }
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
                  <p className="text-bg/30 text-[11px] font-bold uppercase tracking-widest">Vista previa interactiva</p>
                  <p className="text-accent text-xs font-medium mt-1">Interactúa con el teléfono para ver más detalles</p>
               </div>
             </div>

             <div className="animate-in zoom-in duration-500">
                <FeatureMockup type={currentFlow.mockup as any} interactive />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
