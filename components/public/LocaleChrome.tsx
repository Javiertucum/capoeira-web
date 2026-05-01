'use client'

import { usePathname } from 'next/navigation'
import Nav from '@/components/public/Nav'

type Props = Readonly<{
  children: React.ReactNode
}>

export default function LocaleChrome({ children }: Props) {
  const pathname = usePathname()
  const isAdmin = pathname.includes('/admin')

  return (
    <div className="min-h-screen">
      <Nav />
      <div className={isAdmin ? undefined : 'pt-[72px]'}>{children}</div>
    </div>
  )
}
