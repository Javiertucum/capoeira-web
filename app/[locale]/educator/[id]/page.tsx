import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEducatorProfile, getNucleosByEducator, getGroup, getGraduationLevel } from '@/lib/queries'
import NucleoListItem from '@/components/public/NucleoListItem'
import Image from 'next/image'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const edu = await getEducatorProfile(id)
  if (!edu) return { title: 'Educador no encontrado' }
  const fullName = edu.nickname || `${edu.name} ${edu.surname}`
  return {
    title: `${fullName} — Capoeira Map`,
    description: edu.bio ?? `Educador de capoeira`,
  }
}

export default async function EducatorProfilePage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })

  const educator = await getEducatorProfile(id)
  if (!educator) {
    notFound()
  }

  // Fetch related data in parallel
  const [nucleos, group, graduationName] = await Promise.all([
    getNucleosByEducator(id),
    educator.groupId ? getGroup(educator.groupId) : Promise.resolve(null),
    educator.groupId && educator.graduationLevelId 
      ? getGraduationLevel(educator.groupId, educator.graduationLevelId)
      : Promise.resolve(null)
  ])

  return (
    <div className="relative min-h-screen pt-[60px]">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.12),transparent_70%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href={`/${locale}/map?filter=educators`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        <div className="flex flex-col gap-8 md:flex-row md:items-start lg:gap-12">
          {/* Left Column: Avatar & Basic Info */}
          <div className="flex flex-col items-center text-center md:sticky md:top-24 md:w-1/3">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-border bg-card shadow-xl xl:h-48 xl:w-48">
              {educator.avatarUrl ? (
                <Image
                  src={educator.avatarUrl}
                  alt={educator.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-muted text-4xl font-bold text-text-muted">
                  {educator.name[0]}
                </div>
              )}
            </div>

            <h1 className="mt-6 text-2xl font-bold text-text sm:text-3xl">
              {educator.nickname || `${educator.name} ${educator.surname}`}
            </h1>
            {educator.nickname && (
              <p className="mt-1 text-sm text-text-muted">
                {educator.name} {educator.surname}
              </p>
            )}

            <div className="mt-4 inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-[12px] font-semibold tracking-wider text-accent uppercase">
              {educator.role}
            </div>

            <div className="mt-8 flex w-full flex-col gap-4 text-left">
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{t('graduation')}</p>
                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {graduationName || t('unspecified')}
                </p>
              </div>

              {group && (
                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{t('group')}</p>
                  <Link 
                    href={`/${locale}/group/${group.id}`}
                    className="mt-1 block text-sm font-medium text-accent hover:underline"
                  >
                    {group.name}
                  </Link>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{t('location')}</p>
                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {educator.country || t('unspecified')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Social & Nucleos */}
          <div className="flex-1 space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-text">{t('bio')}</h2>
              <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-text-secondary">
                {educator.bio || t('unspecified')}
              </div>
            </section>

            {educator.socialLinks && Object.values(educator.socialLinks).some(Boolean) && (
              <section>
                <h2 className="text-xl font-semibold text-text">{t('contact')}</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {educator.socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${educator.socialLinks.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent/40 hover:text-text"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                      </svg>
                      Instagram
                    </a>
                  )}
                  {educator.socialLinks.whatsapp && (
                    <a
                      href={`https://wa.me/${educator.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent/40 hover:text-text"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                  {educator.socialLinks.website && (
                    <a
                      href={educator.socialLinks.website.startsWith('http') ? educator.socialLinks.website : `https://${educator.socialLinks.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent/40 hover:text-text"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      {t('website' as any) || 'Website'}
                    </a>
                  )}
                </div>
              </section>
            )}

            {nucleos.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-text">{t('nucleos')}</h2>
                <div className="mt-6 flex flex-col gap-4">
                  {nucleos.map((nucleo) => (
                    <NucleoListItem
                      key={nucleo.id}
                      nucleo={nucleo}
                      isActive={false}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
