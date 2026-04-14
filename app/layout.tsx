import { Manrope, Space_Grotesk } from 'next/font/google'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import './globals.css'
import { routing } from '@/i18n/routing'
import { SITE_NAME, SITE_URL, getSiteDescription } from '@/lib/site'

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: getSiteDescription(routing.defaultLocale),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: getSiteDescription(routing.defaultLocale),
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: getSiteDescription(routing.defaultLocale),
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = requestHeaders.get('X-NEXT-INTL-LOCALE') ?? routing.defaultLocale

  return (
    <html
      lang={locale}
      className={`${bodyFont.variable} ${displayFont.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
