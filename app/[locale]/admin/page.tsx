import { redirect } from 'next/navigation'
import { getSessionUid } from '@/lib/auth/session'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminEntryPage({ params }: Props) {
  const { locale } = await params
  const uid = await getSessionUid()

  if (uid) {
    redirect(`/${locale}/admin/dashboard`)
  }

  redirect(`/${locale}/admin/login`)
}
