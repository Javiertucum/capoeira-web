import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const COPY = {
  es: {
    title: 'Términos',
    heading: 'Términos y condiciones',
    updated: 'Última actualización: 11 de junio de 2026',
    intro:
      'Estos términos regulan el uso del sitio web de Agenda Capoeiragem, incluyendo el directorio público, los formularios de contacto y cualquier función asociada al sitio.',
    sections: [
      {
        title: '1. Aceptación de los términos',
        body:
          'Al usar el sitio aceptas estos términos. Si no estás de acuerdo, te pedimos que no uses el sitio ni envíes información a través de él.',
      },
      {
        title: '2. Uso permitido',
        body:
          'Puedes navegar, buscar contenido público y contactar con el equipo. No está permitido intentar acceder sin autorización, interferir con el funcionamiento del sitio, ni usarlo para actividades ilegales o abusivas.',
      },
      {
        title: '3. Contenido y propiedad intelectual',
        body:
          'El diseño, textos, marca y elementos visuales del sitio pertenecen a Agenda Capoeiragem o a sus respectivos titulares. El contenido público de la comunidad puede estar sujeto a sus propios derechos y permisos.',
      },
      {
        title: '4. Contenido de terceros y enlaces externos',
        body:
          'El sitio puede mostrar enlaces o integraciones de terceros. No controlamos esos servicios y no somos responsables de su disponibilidad, exactitud o políticas.',
      },
      {
        title: '5. Disponibilidad del servicio',
        body:
          'Intentamos mantener el sitio disponible, pero no garantizamos que esté libre de interrupciones, errores o mantenimiento. El sitio se proporciona tal como está y según disponibilidad.',
      },
      {
        title: '6. Cambios en los términos',
        body:
          'Podemos actualizar estos términos cuando sea necesario. La fecha de actualización mostrada arriba refleja la versión vigente publicada en el sitio.',
      },
    ],
    contact:
      'Si tienes preguntas sobre estos términos, escríbenos a agendacapoeiragem@gmail.com.',
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Termos',
    heading: 'Termos e condições',
    updated: 'Última atualização: 11 de junho de 2026',
    intro:
      'Estes termos regulam o uso do site da Agenda Capoeiragem, incluindo o diretório público, os formulários de contato e qualquer recurso associado ao site.',
    sections: [
      {
        title: '1. Aceitação dos termos',
        body:
          'Ao usar o site, você concorda com estes termos. Se não concordar, pedimos que não use o site nem envie informações por meio dele.',
      },
      {
        title: '2. Uso permitido',
        body:
          'Você pode navegar, buscar conteúdo público e entrar em contato com a equipe. Não é permitido tentar acessar sem autorização, interferir no funcionamento do site, nem usá-lo para atividades ilegais ou abusivas.',
      },
      {
        title: '3. Conteúdo e propriedade intelectual',
        body:
          'O design, os textos, a marca e os elementos visuais do site pertencem à Agenda Capoeiragem ou a seus respectivos titulares. O conteúdo público da comunidade pode estar sujeito aos próprios direitos e permissões.',
      },
      {
        title: '4. Conteúdo de terceiros e links externos',
        body:
          'O site pode exibir links ou integrações de terceiros. Não controlamos esses serviços e não somos responsáveis por sua disponibilidade, exatidão ou políticas.',
      },
      {
        title: '5. Disponibilidade do serviço',
        body:
          'Tentamos manter o site disponível, mas não garantimos que ele esteja livre de interrupções, erros ou manutenção. O site é fornecido no estado em que se encontra e conforme disponibilidade.',
      },
      {
        title: '6. Alterações nos termos',
        body:
          'Podemos atualizar estes termos quando necessário. A data de atualização exibida acima reflete a versão atualmente publicada no site.',
      },
    ],
    contact:
      'Se você tiver dúvidas sobre estes termos, escreva para agendacapoeiragem@gmail.com.',
    back: 'Voltar ao início',
  },
  en: {
    title: 'Terms',
    heading: 'Terms and conditions',
    updated: 'Last updated: June 11, 2026',
    intro:
      'These terms govern the use of the Agenda Capoeiragem website, including the public directory, contact forms, and any site-related features.',
    sections: [
      {
        title: '1. Acceptance of the terms',
        body:
          'By using the site, you agree to these terms. If you do not agree, please do not use the site or send information through it.',
      },
      {
        title: '2. Permitted use',
        body:
          'You may browse, search public content, and contact the team. You may not attempt unauthorized access, interfere with the site, or use it for illegal or abusive activities.',
      },
      {
        title: '3. Content and intellectual property',
        body:
          'The design, copy, brand, and visual elements of the site belong to Agenda Capoeiragem or their respective owners. Community public content may be subject to its own rights and permissions.',
      },
      {
        title: '4. Third-party content and external links',
        body:
          'The site may display third-party links or integrations. We do not control those services and are not responsible for their availability, accuracy, or policies.',
      },
      {
        title: '5. Service availability',
        body:
          'We try to keep the site available, but we do not guarantee it will be free of interruptions, errors, or maintenance. The site is provided as-is and as available.',
      },
      {
        title: '6. Changes to the terms',
        body:
          'We may update these terms when needed. The update date shown above reflects the current version published on the site.',
      },
    ],
    contact:
      'If you have questions about these terms, write to agendacapoeiragem@gmail.com.',
    back: 'Back to home',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)

  return {
    title: copy.title,
    description: copy.heading,
    alternates: {
      canonical: getLocalizedPath(locale, '/terms'),
      languages: getLanguageAlternates('/terms'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.heading,
      url: getLocalizedPath(locale, '/terms'),
      type: 'website',
    },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const copy = getCopy(locale)

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[820px] rounded-[28px] border border-border bg-card px-6 py-8 shadow-[0_24px_80px_var(--shadow)] sm:px-8 sm:py-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">{copy.updated}</p>
        <h1 className="mt-3 text-[clamp(30px,5vw,46px)] font-semibold tracking-[-0.04em] text-text">
          {copy.heading}
        </h1>
        <p className="mt-5 text-base leading-8 text-text-secondary">{copy.intro}</p>

        <div className="mt-10 space-y-8">
          {copy.sections.map((section) => (
            <article key={section.title} className="space-y-3 rounded-[22px] border border-border/70 bg-bg/40 p-5">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-text">{section.title}</h2>
              <p className="text-sm leading-7 text-text-secondary">{section.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm leading-7 text-text-secondary">{copy.contact}</p>

        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center justify-center rounded-[14px] border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/35 hover:text-text"
        >
          {copy.back}
        </Link>
      </div>
    </section>
  )
}
