import { getAdminNucleos, getAdminEntityOptions } from '@/lib/admin-queries'
import AdminNucleosPageClient from '@/components/admin/AdminNucleosPageClient'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminNucleosPage({ params }: Props) {
  const { locale } = await params
  const [nucleos, entityOptions] = await Promise.all([
    getAdminNucleos().catch(() => []),
    getAdminEntityOptions(),
  ])

  const groupOptions = entityOptions.filter(o => o.type === 'group')

  return (
    <AdminNucleosPageClient 
      nucleos={nucleos} 
      locale={locale} 
      groupOptions={groupOptions} 
    />
  )
}
