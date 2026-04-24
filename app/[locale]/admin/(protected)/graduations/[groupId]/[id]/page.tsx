import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTopbar from '@/components/admin/AdminTopbar'
import GraduationEditForm from '@/components/admin/GraduationEditForm'
import { getAdminGraduationLevelById } from '@/lib/admin-queries'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ locale: string; groupId: string; id: string }> }

export default async function GraduationEditPage({ params }: Props) {
  const { locale, groupId, id } = await params
  const level = await getAdminGraduationLevelById(groupId, id)

  if (!level) notFound()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Graduaciones"
        description={`Editando nivel: ${level.name}`}
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
          <AdminPageHeader
            eyebrow={level.groupName}
            title={level.name}
            description={`Nivel de graduación #${level.order} · ${level.colors.length} color${level.colors.length !== 1 ? 'es' : ''}`}
          />
          <GraduationEditForm level={level} locale={locale} />
        </div>
      </div>
    </div>
  )
}
