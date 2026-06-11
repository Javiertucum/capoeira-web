import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const COPY = {
  es: {
    title: 'Privacidad',
    heading: 'Política de privacidad',
    updated: 'Última actualización: 11 de junio de 2026',
    intro:
      'Esta política explica qué datos recopilamos en el sitio web de Agenda Capoeiragem, cómo los usamos y qué opciones tienes para controlar tu información.',
    sections: [
      {
        title: '1. Información que recopilamos',
        body:
          'Podemos recopilar el contenido que envías al formulario de beta o contacto, información técnica básica del navegador, dirección IP, idioma, páginas visitadas y datos necesarios para mantener el sitio seguro y operativo.',
      },
      {
        title: '2. Cómo usamos la información',
        body:
          'Usamos estos datos para responder mensajes, mejorar el sitio, medir el rendimiento, prevenir abuso, mostrar contenido relevante y gestionar funciones como analítica o publicidad cuando corresponda.',
      },
      {
        title: '3. Servicios de terceros',
        body:
          'Podemos apoyarnos en servicios de terceros como Vercel, Firebase, Google Analytics, Google AdMob, correo electrónico y herramientas de seguridad. Cada proveedor puede tratar datos según sus propias políticas.',
      },
      {
        title: '4. Cookies y anuncios',
        body:
          'El sitio puede usar cookies o identificadores similares para funciones técnicas, análisis y, cuando se habiliten anuncios, para gestionar consentimiento y preferencias publicitarias.',
      },
      {
        title: '5. Conservación y seguridad',
        body:
          'Conservamos la información solo durante el tiempo necesario para las finalidades descritas y aplicamos medidas razonables de seguridad para protegerla contra acceso no autorizado o uso indebido.',
      },
      {
        title: '6. Tus derechos',
        body:
          'Puedes solicitar acceso, corrección o eliminación de tus datos cuando la ley lo permita. Si quieres ejercer estos derechos, escríbenos a agendacapoeiragem@gmail.com.',
      },
    ],
    contact:
      'Si tienes preguntas sobre esta política o sobre el tratamiento de datos del sitio, contáctanos en agendacapoeiragem@gmail.com.',
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Privacidade',
    heading: 'Política de privacidade',
    updated: 'Última atualização: 11 de junho de 2026',
    intro:
      'Esta política explica quais dados coletamos no site da Agenda Capoeiragem, como os usamos e quais opções você tem para controlar suas informações.',
    sections: [
      {
        title: '1. Informações que coletamos',
        body:
          'Podemos coletar o conteúdo enviado pelo formulário de beta ou contato, informações técnicas básicas do navegador, endereço IP, idioma, páginas visitadas e dados necessários para manter o site seguro e funcionando.',
      },
      {
        title: '2. Como usamos as informações',
        body:
          'Usamos esses dados para responder mensagens, melhorar o site, medir desempenho, evitar abuso, mostrar conteúdo relevante e gerenciar recursos como análise ou anúncios quando aplicável.',
      },
      {
        title: '3. Serviços de terceiros',
        body:
          'Podemos usar serviços de terceiros como Vercel, Firebase, Google Analytics, Google AdMob, e-mail e ferramentas de segurança. Cada fornecedor pode tratar dados conforme suas próprias políticas.',
      },
      {
        title: '4. Cookies e anúncios',
        body:
          'O site pode usar cookies ou identificadores semelhantes para funções técnicas, análise e, quando anúncios estiverem ativados, para gerenciar consentimento e preferências de publicidade.',
      },
      {
        title: '5. Retenção e segurança',
        body:
          'Mantemos as informações apenas pelo tempo necessário para as finalidades descritas e aplicamos medidas razoáveis de segurança para protegê-las contra acesso não autorizado ou uso indevido.',
      },
      {
        title: '6. Seus direitos',
        body:
          'Você pode solicitar acesso, correção ou exclusão dos seus dados quando a lei permitir. Para exercer esses direitos, escreva para agendacapoeiragem@gmail.com.',
      },
    ],
    contact:
      'Se você tiver dúvidas sobre esta política ou sobre o tratamento de dados do site, entre em contato em agendacapoeiragem@gmail.com.',
    back: 'Voltar ao início',
  },
  en: {
    title: 'Privacy',
    heading: 'Privacy policy',
    updated: 'Last updated: June 11, 2026',
    intro:
      'This policy explains what data we collect on the Agenda Capoeiragem website, how we use it, and what choices you have to control your information.',
    sections: [
      {
        title: '1. Information we collect',
        body:
          'We may collect content you send through the beta or contact form, basic browser information, IP address, language, pages visited, and data needed to keep the site secure and running.',
      },
      {
        title: '2. How we use information',
        body:
          'We use this data to reply to messages, improve the site, measure performance, prevent abuse, show relevant content, and manage features such as analytics or ads where applicable.',
      },
      {
        title: '3. Third-party services',
        body:
          'We may rely on third-party services such as Vercel, Firebase, Google Analytics, Google AdMob, email, and security tools. Each provider may process data under its own policies.',
      },
      {
        title: '4. Cookies and ads',
        body:
          'The site may use cookies or similar identifiers for technical functions, analytics, and, when ads are enabled, to manage consent and ad preferences.',
      },
      {
        title: '5. Retention and security',
        body:
          'We retain information only as long as necessary for the purposes described and apply reasonable security measures to protect it against unauthorized access or misuse.',
      },
      {
        title: '6. Your rights',
        body:
          'You may request access, correction, or deletion of your data where the law allows. To exercise those rights, contact agendacapoeiragem@gmail.com.',
      },
    ],
    contact:
      'If you have questions about this policy or the site’s data handling, contact us at agendacapoeiragem@gmail.com.',
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
      canonical: getLocalizedPath(locale, '/privacy'),
      languages: getLanguageAlternates('/privacy'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.heading,
      url: getLocalizedPath(locale, '/privacy'),
      type: 'website',
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
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
