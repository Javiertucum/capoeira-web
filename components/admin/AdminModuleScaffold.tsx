import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'

type Tone = 'default' | 'accent' | 'warning' | 'danger'

export interface AdminModuleStat {
  label: string
  value: React.ReactNode
  helper?: string
  tone?: Tone
}

type Props = Readonly<{
  section: string
  description: string
  title: string
  intro: string
  emptyTitle: string
  emptyDescription: string
  stats?: AdminModuleStat[]
}>

export default function AdminModuleScaffold({
  section,
  description,
  title,
  intro,
  emptyTitle,
  emptyDescription,
  stats = [],
}: Props) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section={section} description={description} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader eyebrow="Expansion admin" title={title} description={intro} />

          {stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <AdminStatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  helper={stat.helper}
                  tone={stat.tone}
                />
              ))}
            </div>
          ) : null}

          <AdminSectionCard
            title="Estado inicial"
            description="La estructura visual del modulo ya esta lista; la logica y los datos llegan en la siguiente fase."
          >
            <AdminEmptyState
              eyebrow={section}
              title={emptyTitle}
              description={emptyDescription}
            />
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
