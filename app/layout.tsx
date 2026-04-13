import { headers } from 'next/headers'
import type { Metadata } from 'next'
import './globals.css'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
  title: 'Agenda Capoeiragem',
  description: 'Encuentra núcleos, grupos y educadores de capoeira en todo el mundo',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = requestHeaders.get('X-NEXT-INTL-LOCALE') ?? routing.defaultLocale

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
