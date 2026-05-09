import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTopbar from '@/components/admin/AdminTopbar'
import SettingsForm from '@/components/admin/SettingsForm'
import { adminDb } from '@/lib/firebase-admin'

async function getSettings() {
  try {
    const doc = await adminDb.collection('adminSettings').doc('global').get()
    const data = doc.data() ?? {}
    return {
      appVersion: typeof data.appVersion === 'string' ? data.appVersion : '1.0.0',
      statusLabel: typeof data.statusLabel === 'string' ? data.statusLabel : 'Beta cerrada',
      betaRegistrationOpen: data.betaRegistrationOpen === true,
    }
  } catch {
    return { appVersion: '1.0.0', statusLabel: 'Beta cerrada', betaRegistrationOpen: false }
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

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
            description="Versión de la app, estado de beta y servicios conectados."
          />
          <SettingsForm initial={settings} />
        </div>
      </div>
    </div>
  )
}
