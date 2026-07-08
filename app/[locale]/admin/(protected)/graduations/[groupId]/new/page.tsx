import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTopbar from '@/components/admin/AdminTopbar'
import GraduationEditForm from '@/components/admin/GraduationEditForm'
import { getAdminGroupName } from '@/lib/admin-queries'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ locale: string; groupId: string }> }

export default async function GraduationCreatePage({ params }: Props) {
  const { locale, groupId } = await params
  const groupName = await getAdminGroupName(groupId)

  if (!groupName) notFound()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Graduaciones" description={`Nuevo nivel para ${groupName}`} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
          <AdminPageHeader
            eyebrow={groupName}
            title="Crear graduación"
            description="Al guardar, el admin del grupo recibirá una notificación para revisar el nivel en la app."
          />
          <GraduationEditForm level={null} groupId={groupId} locale={locale} />
        </div>
      </div>
    </div>
  )
}
