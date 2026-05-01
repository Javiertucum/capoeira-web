import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { useLocale } from 'next-intl'

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Sistema"
        description="Configuración global de la plataforma."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Configuración"
            title="Ajustes de la Plataforma"
            description="Gestiona la versión actual de la app, el estado de la beta y otros parámetros globales."
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <AdminSectionCard
              title="Versión y Estado"
              description="Controla lo que los usuarios ven en la landing page respecto al estado de la app."
            >
              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Versión de la App</label>
                  <input 
                    type="text" 
                    defaultValue="2.5.1"
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm font-semibold focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Etiqueta de Estado</label>
                  <input 
                    type="text" 
                    defaultValue="Beta cerrada"
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm font-semibold focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                   <div>
                      <p className="text-sm font-bold text-text">Registro de Beta Abierto</p>
                      <p className="text-xs text-text-muted">Permite que nuevos usuarios se inscriban desde la web.</p>
                   </div>
                   <div className="h-6 w-11 rounded-full bg-accent relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                   </div>
                </div>
                <button className="btn btn-primary w-full shadow-lg">Guardar cambios</button>
              </div>
            </AdminSectionCard>

            <AdminSectionCard
              title="Integraciones"
              description="Servicios externos conectados a la plataforma."
            >
              <div className="space-y-6 p-6">
                 {[
                    { name: 'Firebase Admin', status: 'Conectado', icon: '🔥' },
                    { name: 'Google Play Console', status: 'Conectado', icon: '🤖' },
                    { name: 'Postmark Email', status: 'Conectado', icon: '✉️' },
                 ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-surface-muted/50">
                       <div className="flex items-center gap-4">
                          <span className="text-xl">{s.icon}</span>
                          <div>
                             <p className="text-sm font-bold text-text">{s.name}</p>
                             <p className="text-xs text-green-600 font-bold">{s.status}</p>
                          </div>
                       </div>
                       <button className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent">Gestionar</button>
                    </div>
                 ))}
              </div>
            </AdminSectionCard>
          </div>
          
          <AdminSectionCard
            title="Funciones de la Plataforma (v2.5.1)"
            description="Lista de funcionalidades activas reportadas en la web. Al editarlas aquí, se actualizan en la landing page."
          >
            <div className="p-0 overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-surface/10">
                        {['Función', 'Descripción', 'Estado', 'Mockup', 'Acción'].map((h) => (
                           <th key={h} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{h}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {[
                        { f: 'KPI Dashboard', d: 'Visualización de métricas en tiempo real', s: 'Activo', m: 'kpi' },
                        { f: 'Asistencia con QR', d: 'Pase de lista con escaneo móvil', s: 'Activo', m: 'attendance' },
                        { f: 'Gestión Financiera', d: 'Cobros y deudas multi-moneda', s: 'Activo', m: 'finances' },
                        { f: 'Mapa Global', d: 'Descubrimiento de núcleos por GPS', s: 'Activo', m: 'map' },
                        { f: 'Horarios Flexibles', d: 'Gestión de turmas y cambios de sede', s: 'Activo', m: 'calendar' },
                        { f: 'Directorio de Alumnos', d: 'Base de datos con historial y contacto', s: 'Activo', m: 'users' },
                     ].map((row) => (
                        <tr key={row.f} className="hover:bg-surface/30 transition-colors">
                           <td className="px-6 py-4 text-sm font-bold text-text">{row.f}</td>
                           <td className="px-6 py-4 text-xs text-text-muted">{row.d}</td>
                           <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase">{row.s}</span></td>
                           <td className="px-6 py-4 text-xs mono text-text-secondary">{row.m}</td>
                           <td className="px-6 py-4 text-[10px] font-black uppercase text-accent cursor-pointer hover:underline">Editar</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
