import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getOgLocale, SITE_NAME } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

type LegalSection = { heading: string; body: string }

type LegalCopy = {
  title: string
  heading: string
  updated?: string
  intro: string
  sections?: LegalSection[]
  back: string
}

const COPY = {
  es: {
    title: 'Privacidad',
    heading: 'Política de privacidad',
    updated: 'Última actualización: Junio 2026',
    intro:
      'Esta política aplica tanto a la app móvil/web Agenda Capoeiragem como a este sitio (agendacapoeiragem.com). Describe qué datos recopilamos, para qué los usamos y qué derechos tienes sobre ellos.',
    sections: [
      {
        heading: '1. Información que recopilamos',
        body:
          'Datos de cuenta y perfil: nombre, apellido, apodo (opcional), email, rol (alumno/educador), foto de perfil y país. Datos de uso: eventos creados o confirmados, grupos y núcleos a los que perteneces, asistencia y pagos dentro de tu núcleo, y tu graduación de capoeira. Con tu permiso, usamos el GPS del dispositivo para detectar tu país actual (nunca guardamos coordenadas exactas, solo el país) y mostrarte notificaciones de eventos relevantes cerca de ti; si no das el permiso, usamos el país de tu perfil. También guardamos un token de notificaciones push (FCM) por dispositivo.',
      },
      {
        heading: '2. Cómo usamos tu información',
        body:
          'Para crear y gestionar tu cuenta, mostrar tu perfil público a otros usuarios, enviarte notificaciones sobre eventos, tu grupo/núcleo y tu progreso de graduación (cada tipo se puede desactivar desde la app, en Configuración › Notificaciones), procesar suscripciones premium y mejorar la app.',
      },
      {
        heading: '3. Con quién compartimos información',
        body:
          'Tu perfil público (nombre, apodo, graduación, grupo) es visible para otros usuarios de la app. No vendemos tu información personal. Usamos proveedores externos para operar el servicio: Firebase/Google Cloud (cuenta, base de datos, notificaciones push, analítica con Firebase Analytics), RevenueCat (gestión de suscripciones premium) y Google AdMob/AdSense (anuncios). Estos proveedores pueden recopilar identificadores de dispositivo y datos de uso según sus propias políticas de privacidad.',
      },
      {
        heading: '4. Anuncios',
        body:
          'La app y este sitio muestran anuncios mediante Google AdMob/AdSense. Puedes gestionar tus opciones de anuncios personalizados desde la app, en Configuración › Privacidad de anuncios.',
      },
      {
        heading: '5. Almacenamiento y seguridad',
        body:
          'Los datos se almacenan en Firebase (Google Cloud Platform) con reglas de acceso por usuario. Implementamos medidas de seguridad estándar de la industria, pero ningún sistema es 100% infalible.',
      },
      {
        heading: '6. Conservación y transferencias internacionales',
        body:
          'Conservamos tus datos mientras tu cuenta esté activa; al eliminarla se borran en cascada tu perfil, pagos, becas, solicitudes y participaciones. Las cuentas nunca activadas y los datos de eventos pasados se depuran periódicamente. Nuestros proveedores (Google, RevenueCat, Sentry) pueden procesar datos en servidores fuera de tu país, principalmente en Estados Unidos, bajo cláusulas contractuales tipo y marcos de transferencia equivalentes.',
      },
      {
        heading: '7. Tus derechos',
        body:
          'De acuerdo con la normativa aplicable (incluida la Ley 21.719 de Chile, el RGPD europeo y la LGPD brasileña), tienes derecho a acceder, rectificar, suprimir y portar tus datos, a oponerte a ciertos tratamientos y a revocar tu consentimiento en cualquier momento. Puedes gestionar tu información desde Configuración en la app, eliminar tu cuenta con todos los datos asociados, o escribirnos a agendacapoeiragem@gmail.com. También puedes reclamar ante la autoridad de protección de datos de tu país.',
      },
      {
        heading: '8. Menores de edad',
        body:
          'Para crear una cuenta propia se requiere tener al menos 14 años. Los alumnos menores pueden ser gestionados por su educador como alumnos sin cuenta, con la autorización de su padre, madre o representante legal; el acceso a esos datos queda limitado a los educadores y administradores del grupo, y el educador es responsable de mantenerlos exactos y eliminarlos cuando corresponda.',
      },
      {
        heading: '9. Contacto',
        body: 'Si tienes preguntas sobre esta política, contáctanos en agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Privacidade',
    heading: 'Política de privacidade',
    updated: 'Última atualização: junho de 2026',
    intro:
      'Esta política se aplica tanto ao app Agenda Capoeiragem (móvel/web) quanto a este site (agendacapoeiragem.com). Descreve quais dados coletamos, para que os usamos e quais direitos você tem sobre eles.',
    sections: [
      {
        heading: '1. Informações que coletamos',
        body:
          'Dados de conta e perfil: nome, sobrenome, apelido (opcional), e-mail, função (aluno/educador), foto de perfil e país. Dados de uso: eventos criados ou confirmados, grupos e núcleos aos quais você pertence, presença e pagamentos dentro do seu núcleo, e sua graduação de capoeira. Com sua permissão, usamos o GPS do dispositivo para detectar seu país atual (nunca guardamos coordenadas exatas, apenas o país) e mostrar notificações de eventos relevantes perto de você; sem a permissão, usamos o país do seu perfil. Também guardamos um token de notificações push (FCM) por dispositivo.',
      },
      {
        heading: '2. Como usamos suas informações',
        body:
          'Para criar e gerenciar sua conta, exibir seu perfil público a outros usuários, enviar notificações sobre eventos, seu grupo/núcleo e seu progresso de graduação (cada tipo pode ser desativado no app, em Configurações › Notificações), processar assinaturas premium e melhorar o app.',
      },
      {
        heading: '3. Com quem compartilhamos informações',
        body:
          'Seu perfil público (nome, apelido, graduação, grupo) é visível para outros usuários do app. Não vendemos suas informações pessoais. Usamos provedores externos para operar o serviço: Firebase/Google Cloud (conta, banco de dados, notificações push, análise com Firebase Analytics), RevenueCat (gestão de assinaturas premium) e Google AdMob/AdSense (anúncios). Esses provedores podem coletar identificadores de dispositivo e dados de uso conforme suas próprias políticas de privacidade.',
      },
      {
        heading: '4. Anúncios',
        body:
          'O app e este site exibem anúncios via Google AdMob/AdSense. Você pode gerenciar suas opções de anúncios personalizados no app, em Configurações › Privacidade de anúncios.',
      },
      {
        heading: '5. Armazenamento e segurança',
        body:
          'Os dados são armazenados no Firebase (Google Cloud Platform) com regras de acesso por usuário. Implementamos medidas de segurança padrão da indústria, mas nenhum sistema é 100% infalível.',
      },
      {
        heading: '6. Retenção e transferências internacionais',
        body:
          'Mantemos seus dados enquanto sua conta estiver ativa; ao excluí-la, seu perfil, pagamentos, bolsas, solicitações e participações são apagados em cascata. Contas nunca ativadas e dados de eventos passados são depurados periodicamente. Nossos fornecedores (Google, RevenueCat, Sentry) podem processar dados em servidores fora do seu país, principalmente nos Estados Unidos, sob cláusulas contratuais padrão e mecanismos de transferência equivalentes.',
      },
      {
        heading: '7. Seus direitos',
        body:
          'De acordo com a legislação aplicável (incluindo a LGPD brasileira, a Lei 21.719 do Chile e o RGPD europeu), você tem direito a acessar, corrigir, excluir e portar seus dados, a se opor a certos tratamentos e a revogar seu consentimento a qualquer momento. Você pode gerenciar suas informações em Configurações no app, excluir sua conta com todos os dados associados, ou escrever para agendacapoeiragem@gmail.com. Também pode reclamar junto à autoridade de proteção de dados do seu país.',
      },
      {
        heading: '8. Menores de idade',
        body:
          'Para criar uma conta própria é preciso ter pelo menos 14 anos. Alunos menores podem ser geridos pelo educador como alunos sem conta, com a autorização do pai, mãe ou responsável legal; o acesso a esses dados fica limitado aos educadores e administradores do grupo, e o educador é responsável por mantê-los corretos e excluí-los quando necessário.',
      },
      {
        heading: '9. Contato',
        body: 'Se tiver dúvidas sobre esta política, contate-nos em agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Voltar ao início',
  },
  en: {
    title: 'Privacy',
    heading: 'Privacy policy',
    updated: 'Last updated: June 2026',
    intro:
      'This policy applies to both the Agenda Capoeiragem app (mobile/web) and this site (agendacapoeiragem.com). It describes what data we collect, what we use it for, and your rights over it.',
    sections: [
      {
        heading: '1. Information we collect',
        body:
          'Account and profile data: first/last name, nickname (optional), email, role (student/educator), profile photo, and country. Usage data: events you create or confirm, groups and núcleos you belong to, attendance and payments within your núcleo, and your capoeira graduation. With your permission, we use the device GPS to detect your current country (we never store exact coordinates, only the country) to show you notifications about relevant events near you; if you don\'t grant permission, we use your profile country instead. We also store a push notification token (FCM) per device.',
      },
      {
        heading: '2. How we use your information',
        body:
          'To create and manage your account, show your public profile to other users, send notifications about events, your group/núcleo, and your graduation progress (each type can be turned off in the app under Settings › Notifications), process premium subscriptions, and improve the app.',
      },
      {
        heading: '3. Who we share information with',
        body:
          'Your public profile (name, nickname, graduation, group) is visible to other app users. We do not sell your personal information. We rely on external providers to run the service: Firebase/Google Cloud (account, database, push notifications, analytics via Firebase Analytics), RevenueCat (premium subscription management), and Google AdMob/AdSense (ads). These providers may collect device identifiers and usage data under their own privacy policies.',
      },
      {
        heading: '4. Advertising',
        body:
          'The app and this site display ads via Google AdMob/AdSense. You can manage your personalized ad choices in the app under Settings › Ad privacy.',
      },
      {
        heading: '5. Storage and security',
        body:
          'Data is stored in Firebase (Google Cloud Platform) with per-user access rules. We implement industry-standard security measures, but no system is 100% foolproof.',
      },
      {
        heading: '6. Retention and international transfers',
        body:
          'We keep your data while your account is active; when you delete it, your profile, payments, scholarships, requests, and participations are removed in cascade. Never-activated accounts and past event data are purged periodically. Our providers (Google, RevenueCat, Sentry) may process data on servers outside your country, mainly in the United States, under standard contractual clauses and equivalent transfer frameworks.',
      },
      {
        heading: '7. Your rights',
        body:
          'Under applicable data protection law (including the EU GDPR, Chile\'s Law 21.719, and Brazil\'s LGPD), you have the right to access, rectify, delete, and port your data, to object to certain processing, and to withdraw your consent at any time. You can manage your information from Settings in the app, delete your account with all associated data, or email us at agendacapoeiragem@gmail.com. You may also lodge a complaint with your country\'s data protection authority.',
      },
      {
        heading: '8. Minors',
        body:
          'You must be at least 14 years old to create your own account. Younger students can be managed by their educator as accountless students, with authorization from a parent or legal guardian; access to that data is limited to the group\'s educators and administrators, and the educator is responsible for keeping it accurate and deleting it when appropriate.',
      },
      {
        heading: '9. Contact',
        body: 'If you have questions about this policy, contact us at agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Back to home',
  },
  fr: {
    title: 'Confidentialité',
    heading: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    intro:
      'Cette politique s\'applique à l\'application Agenda Capoeiragem (mobile/web) ainsi qu\'à ce site (agendacapoeiragem.com). Elle décrit quelles données nous collectons, à quoi elles servent et quels droits vous avez sur elles.',
    sections: [
      {
        heading: '1. Informations que nous collectons',
        body:
          'Données de compte et de profil : nom, prénom, surnom (facultatif), e-mail, rôle (élève/éducateur), photo de profil et pays. Données d\'utilisation : événements créés ou confirmés, groupes et núcleos auxquels vous appartenez, présence et paiements au sein de votre núcleo, et votre graduation de capoeira. Avec votre permission, nous utilisons le GPS de l\'appareil pour détecter votre pays actuel (nous ne stockons jamais de coordonnées exactes, seulement le pays) afin de vous montrer des notifications d\'événements pertinents près de vous ; sans permission, nous utilisons le pays de votre profil. Nous stockons également un jeton de notification push (FCM) par appareil.',
      },
      {
        heading: '2. Comment nous utilisons vos informations',
        body:
          'Pour créer et gérer votre compte, afficher votre profil public aux autres utilisateurs, envoyer des notifications sur les événements, votre groupe/núcleo et votre progression de graduation (chaque type peut être désactivé dans l\'application, sous Réglages › Notifications), traiter les abonnements premium et améliorer l\'application.',
      },
      {
        heading: '3. Avec qui nous partageons les informations',
        body:
          'Votre profil public (nom, surnom, graduation, groupe) est visible par les autres utilisateurs de l\'application. Nous ne vendons pas vos informations personnelles. Nous utilisons des prestataires externes pour faire fonctionner le service : Firebase/Google Cloud (compte, base de données, notifications push, analyse via Firebase Analytics), RevenueCat (gestion des abonnements premium) et Google AdMob/AdSense (publicités). Ces prestataires peuvent collecter des identifiants d\'appareil et des données d\'utilisation selon leurs propres politiques de confidentialité.',
      },
      {
        heading: '4. Publicité',
        body:
          'L\'application et ce site affichent des publicités via Google AdMob/AdSense. Vous pouvez gérer vos préférences de publicité personnalisée dans l\'application, sous Réglages › Confidentialité des publicités.',
      },
      {
        heading: '5. Stockage et sécurité',
        body:
          'Les données sont stockées dans Firebase (Google Cloud Platform) avec des règles d\'accès par utilisateur. Nous appliquons des mesures de sécurité standard du secteur, mais aucun système n\'est infaillible à 100 %.',
      },
      {
        heading: '6. Conservation et transferts internationaux',
        body:
          'Nous conservons vos données tant que votre compte est actif ; lorsque vous le supprimez, votre profil, vos paiements, bourses, demandes et participations sont effacés en cascade. Les comptes jamais activés et les données d\'événements passés sont purgés périodiquement. Nos prestataires (Google, RevenueCat, Sentry) peuvent traiter des données sur des serveurs situés hors de votre pays, principalement aux États-Unis, dans le cadre de clauses contractuelles types et de mécanismes de transfert équivalents.',
      },
      {
        heading: '7. Vos droits',
        body:
          'Conformément à la législation applicable (dont le RGPD européen, la loi chilienne 21.719 et la LGPD brésilienne), vous avez le droit d\'accéder à vos données, de les rectifier, de les supprimer et de les porter, de vous opposer à certains traitements et de retirer votre consentement à tout moment. Vous pouvez gérer vos informations depuis les Réglages dans l\'application, supprimer votre compte avec toutes les données associées, ou nous écrire à agendacapoeiragem@gmail.com. Vous pouvez également saisir l\'autorité de protection des données de votre pays.',
      },
      {
        heading: '8. Mineurs',
        body:
          'Il faut avoir au moins 14 ans pour créer son propre compte. Les élèves plus jeunes peuvent être gérés par leur éducateur comme élèves sans compte, avec l\'autorisation d\'un parent ou représentant légal ; l\'accès à ces données est limité aux éducateurs et administrateurs du groupe, et l\'éducateur est responsable de leur exactitude et de leur suppression le moment venu.',
      },
      {
        heading: '9. Contact',
        body: 'Pour toute question sur cette politique, contactez-nous à agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Retour à l\'accueil',
  },
  de: {
    title: 'Datenschutz',
    heading: 'Datenschutzerklärung',
    updated: 'Letzte Aktualisierung: Juni 2026',
    intro:
      'Diese Erklärung gilt sowohl für die App Agenda Capoeiragem (mobil/web) als auch für diese Website (agendacapoeiragem.com). Sie beschreibt, welche Daten wir erheben, wofür wir sie verwenden und welche Rechte du hast.',
    sections: [
      {
        heading: '1. Informationen, die wir erheben',
        body:
          'Konto- und Profildaten: Vorname, Nachname, Spitzname (optional), E-Mail, Rolle (Schüler/Lehrer), Profilfoto und Land. Nutzungsdaten: erstellte oder bestätigte Events, Gruppen und Núcleos, denen du angehörst, Anwesenheit und Zahlungen innerhalb deines Núcleos, sowie deine Capoeira-Graduierung. Mit deiner Erlaubnis nutzen wir das GPS des Geräts, um dein aktuelles Land zu erkennen (wir speichern nie genaue Koordinaten, nur das Land), um dir relevante Event-Benachrichtigungen in deiner Nähe zu zeigen; ohne Erlaubnis nutzen wir das Land aus deinem Profil. Wir speichern außerdem ein Push-Benachrichtigungs-Token (FCM) pro Gerät.',
      },
      {
        heading: '2. Wie wir deine Informationen verwenden',
        body:
          'Um dein Konto zu erstellen und zu verwalten, dein öffentliches Profil anderen Nutzern zu zeigen, Benachrichtigungen über Events, deine Gruppe/dein Núcleo und deinen Graduierungsfortschritt zu senden (jeder Typ kann in der App unter Einstellungen › Benachrichtigungen deaktiviert werden), Premium-Abonnements zu verarbeiten und die App zu verbessern.',
      },
      {
        heading: '3. Mit wem wir Informationen teilen',
        body:
          'Dein öffentliches Profil (Name, Spitzname, Graduierung, Gruppe) ist für andere App-Nutzer sichtbar. Wir verkaufen deine persönlichen Daten nicht. Wir nutzen externe Anbieter für den Betrieb des Dienstes: Firebase/Google Cloud (Konto, Datenbank, Push-Benachrichtigungen, Analyse via Firebase Analytics), RevenueCat (Verwaltung von Premium-Abonnements) und Google AdMob/AdSense (Werbung). Diese Anbieter können Geräte-IDs und Nutzungsdaten gemäß ihren eigenen Datenschutzrichtlinien erheben.',
      },
      {
        heading: '4. Werbung',
        body:
          'Die App und diese Website zeigen Werbung über Google AdMob/AdSense an. Du kannst deine Einstellungen für personalisierte Werbung in der App unter Einstellungen › Werbe-Datenschutz verwalten.',
      },
      {
        heading: '5. Speicherung und Sicherheit',
        body:
          'Daten werden in Firebase (Google Cloud Platform) mit Zugriffsregeln pro Nutzer gespeichert. Wir setzen branchenübliche Sicherheitsmaßnahmen ein, aber kein System ist zu 100 % unfehlbar.',
      },
      {
        heading: '6. Aufbewahrung und internationale Übermittlungen',
        body:
          'Wir speichern deine Daten, solange dein Konto aktiv ist; beim Löschen werden Profil, Zahlungen, Stipendien, Anfragen und Teilnahmen kaskadierend entfernt. Nie aktivierte Konten und Daten vergangener Events werden regelmäßig bereinigt. Unsere Anbieter (Google, RevenueCat, Sentry) können Daten auf Servern außerhalb deines Landes verarbeiten, hauptsächlich in den USA, auf Grundlage von Standardvertragsklauseln und gleichwertigen Übermittlungsmechanismen.',
      },
      {
        heading: '7. Deine Rechte',
        body:
          'Nach geltendem Datenschutzrecht (einschließlich der EU-DSGVO, des chilenischen Gesetzes 21.719 und der brasilianischen LGPD) hast du das Recht auf Auskunft, Berichtigung, Löschung und Übertragbarkeit deiner Daten, auf Widerspruch gegen bestimmte Verarbeitungen und auf jederzeitigen Widerruf deiner Einwilligung. Du kannst deine Informationen in den Einstellungen der App verwalten, dein Konto mit allen zugehörigen Daten löschen oder uns unter agendacapoeiragem@gmail.com schreiben. Du kannst dich außerdem bei der Datenschutzbehörde deines Landes beschweren.',
      },
      {
        heading: '8. Minderjährige',
        body:
          'Für ein eigenes Konto musst du mindestens 14 Jahre alt sein. Jüngere Schüler können von ihrem Lehrer als Schüler ohne Konto verwaltet werden, mit Einwilligung eines Elternteils oder Erziehungsberechtigten; der Zugriff auf diese Daten ist auf die Lehrer und Administratoren der Gruppe beschränkt, und der Lehrer ist dafür verantwortlich, sie korrekt zu halten und bei Bedarf zu löschen.',
      },
      {
        heading: '9. Kontakt',
        body: 'Bei Fragen zu dieser Erklärung kontaktiere uns unter agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Zurück zur Startseite',
  },
  it: {
    title: 'Privacy',
    heading: 'Informativa sulla privacy',
    updated: 'Ultimo aggiornamento: giugno 2026',
    intro:
      'Questa informativa si applica sia all\'app Agenda Capoeiragem (mobile/web) che a questo sito (agendacapoeiragem.com). Descrive quali dati raccogliamo, a cosa servono e quali diritti hai su di essi.',
    sections: [
      {
        heading: '1. Informazioni che raccogliamo',
        body:
          'Dati di account e profilo: nome, cognome, soprannome (opzionale), e-mail, ruolo (allievo/educatore), foto profilo e paese. Dati di utilizzo: eventi creati o confermati, gruppi e núcleos a cui appartieni, presenze e pagamenti all\'interno del tuo núcleo e la tua graduazione di capoeira. Con il tuo permesso, utilizziamo il GPS del dispositivo per rilevare il tuo paese attuale (non salviamo mai coordinate esatte, solo il paese) per mostrarti notifiche di eventi rilevanti vicino a te; senza permesso, usiamo il paese del tuo profilo. Salviamo anche un token di notifiche push (FCM) per dispositivo.',
      },
      {
        heading: '2. Come utilizziamo le tue informazioni',
        body:
          'Per creare e gestire il tuo account, mostrare il tuo profilo pubblico ad altri utenti, inviare notifiche su eventi, il tuo gruppo/núcleo e i tuoi progressi di graduazione (ogni tipo può essere disattivato nell\'app, in Impostazioni › Notifiche), elaborare gli abbonamenti premium e migliorare l\'app.',
      },
      {
        heading: '3. Con chi condividiamo le informazioni',
        body:
          'Il tuo profilo pubblico (nome, soprannome, graduazione, gruppo) è visibile ad altri utenti dell\'app. Non vendiamo le tue informazioni personali. Ci affidiamo a fornitori esterni per gestire il servizio: Firebase/Google Cloud (account, database, notifiche push, analisi tramite Firebase Analytics), RevenueCat (gestione degli abbonamenti premium) e Google AdMob/AdSense (pubblicità). Questi fornitori possono raccogliere identificativi del dispositivo e dati di utilizzo secondo le proprie politiche sulla privacy.',
      },
      {
        heading: '4. Pubblicità',
        body:
          'L\'app e questo sito mostrano pubblicità tramite Google AdMob/AdSense. Puoi gestire le tue preferenze sulla pubblicità personalizzata nell\'app, in Impostazioni › Privacy degli annunci.',
      },
      {
        heading: '5. Archiviazione e sicurezza',
        body:
          'I dati sono archiviati su Firebase (Google Cloud Platform) con regole di accesso per utente. Implementiamo misure di sicurezza standard del settore, ma nessun sistema è infallibile al 100%.',
      },
      {
        heading: '6. Conservazione e trasferimenti internazionali',
        body:
          'Conserviamo i tuoi dati finché il tuo account è attivo; quando lo elimini, profilo, pagamenti, borse di studio, richieste e partecipazioni vengono cancellati a cascata. Gli account mai attivati e i dati di eventi passati vengono depurati periodicamente. I nostri fornitori (Google, RevenueCat, Sentry) possono trattare dati su server al di fuori del tuo paese, principalmente negli Stati Uniti, sulla base di clausole contrattuali standard e meccanismi di trasferimento equivalenti.',
      },
      {
        heading: '7. I tuoi diritti',
        body:
          'In base alla normativa applicabile (incluso il GDPR europeo, la legge cilena 21.719 e la LGPD brasiliana), hai diritto ad accedere, rettificare, cancellare e portare i tuoi dati, a opporti a determinati trattamenti e a revocare il consenso in qualsiasi momento. Puoi gestire le tue informazioni dalle Impostazioni nell\'app, eliminare il tuo account con tutti i dati associati o scriverci a agendacapoeiragem@gmail.com. Puoi inoltre presentare reclamo all\'autorità di protezione dei dati del tuo paese.',
      },
      {
        heading: '8. Minori',
        body:
          'Per creare un account proprio bisogna avere almeno 14 anni. Gli allievi più giovani possono essere gestiti dal proprio educatore come allievi senza account, con l\'autorizzazione di un genitore o rappresentante legale; l\'accesso a quei dati è limitato agli educatori e amministratori del gruppo, e l\'educatore è responsabile di mantenerli corretti ed eliminarli quando necessario.',
      },
      {
        heading: '9. Contatto',
        body: 'Per domande su questa informativa, contattaci a agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Torna alla home',
  },
} satisfies Record<string, LegalCopy>

function getCopy(locale: string): LegalCopy {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)

  return {
    title: copy.title,
    description: copy.intro,
    alternates: {
      canonical: getLocalizedPath(locale, '/privacy'),
      languages: getLanguageAlternates('/privacy'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.intro,
      url: getLocalizedPath(locale, '/privacy'),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const copy = getCopy(locale)

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[760px] rounded-[28px] border border-border bg-card px-6 py-8 shadow-[0_24px_80px_var(--shadow)] sm:px-8 sm:py-10">
        <h1 className="text-[clamp(30px,5vw,44px)] font-semibold tracking-[-0.04em] text-text">
          {copy.heading}
        </h1>
        {copy.updated && <p className="mt-2 text-xs text-text-secondary/70">{copy.updated}</p>}
        <p className="mt-5 text-base leading-8 text-text-secondary">{copy.intro}</p>

        {copy.sections?.map((section) => (
          <div key={section.heading} className="mt-7">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-text">{section.heading}</h2>
            <p className="mt-2 text-base leading-8 text-text-secondary">{section.body}</p>
          </div>
        ))}

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
