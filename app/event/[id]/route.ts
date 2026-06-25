import { NextRequest, NextResponse } from 'next/server'

const ANDROID_PACKAGE_NAME = 'com.capoeiraapp.mobile'
const PWA_BASE_URL = 'https://agenda-capoeiragem-app.web.app'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params
  const userAgent = request.headers.get('user-agent') ?? ''
  const isAndroid = /Android/i.test(userAgent)

  if (isAndroid) {
    return NextResponse.redirect(`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`, 302)
  }

  const pwaUrl = new URL(`/event/${id}`, PWA_BASE_URL)
  request.nextUrl.searchParams.forEach((value, key) => {
    pwaUrl.searchParams.set(key, value)
  })
  return NextResponse.redirect(pwaUrl, 302)
}
