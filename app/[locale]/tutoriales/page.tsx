import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLanguageAlternateUrls, getLocalizedPath, getLocalizedUrl, getOgLocale, getSiteDescription, SITE_NAME } from '@/lib/site'
import TutorialsHero from '@/components/public/TutorialsHero'
import TutorialsNav, { type NavSection } from '@/components/public/TutorialsNav'
import TutorialSectionBlock, { type StepItem } from '@/components/public/TutorialSectionBlock'
import Footer from '@/components/public/Footer'
import type { FeatureMockupType } from '@/components/public/FeatureMockup'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

type Section = {
  id: string
  title: string
  category: string
  intro: string
  mockup?: FeatureMockupType
  steps: StepItem[]
}

// ─── Spanish ─────────────────────────────────────────────────────────────────

const SECTIONS_ES: Section[] = [
  {
    id: 'primeros-pasos',
    title: 'Primeros pasos',
    category: 'General',
    intro: 'Cómo crear tu cuenta, completar tu perfil y unirte a tu comunidad.',
    mockup: 'home',
    steps: [
      {
        t: 'Instala la app o úsala como app web',
        d: 'Descárgala desde Google Play en Android, o ábrela en tu navegador en agendacapoeiragem.com y agrégala a tu pantalla de inicio. En ambos casos funciona igual.',
        note: 'La versión nativa para iPhone está en desarrollo. Mientras tanto, usa Safari en iOS → "Agregar a pantalla de inicio".',
      },
      {
        t: 'Crea tu cuenta',
        d: 'Al abrir la app verás la pantalla "Crear cuenta — Únete a la comunidad de capoeira". Ingresa nombre, apellido, apodo (opcional) y correo. También puedes registrarte con Google para saltar el formulario.',
        tip: 'Antes de continuar, la app te preguntará tu rol: "Practicante" o "Educador". Elige "Educador" si ya enseñas capoeira — esto desbloquea las herramientas de gestión desde el inicio.',
      },
      {
        t: 'Completa el onboarding',
        d: 'Tras el registro, la pantalla de onboarding te guía para agregar tu foto de perfil y buscar tu grupo o núcleo. Puedes omitir este paso y hacerlo después, pero vincularte desde el inicio activa todas las funciones de comunidad.',
      },
      {
        t: 'Vincula tu grupo',
        d: 'En la pantalla de inicio verás la tarjeta "Sin grupo asignado" con el botón "Buscar grupos". Desde ahí puedes buscar tu grupo en el directorio y enviar una solicitud de ingreso. También puedes pedirle a tu educador que te agregue directamente desde el panel de su núcleo.',
        warn: 'Sin un grupo vinculado, no podrás ver los eventos ni el historial de graduaciones de tu comunidad. Las funciones de asistencia y pagos tampoco estarán disponibles.',
      },
      {
        t: '¿Olvidaste tu contraseña?',
        d: 'En la pantalla de inicio de sesión, toca "¿Olvidaste tu contraseña?". Ingresa tu correo y toca "Enviar enlace de restablecimiento". Recibirás un correo con el enlace — tócalo para crear una nueva contraseña. Luego regresa a la app y toca "Volver al inicio de sesión".',
        note: 'Si el correo no llega en unos minutos, revisa la carpeta de spam. El enlace expira en 24 horas.',
      },
    ],
  },
  {
    id: 'inicio-y-exploracion',
    title: 'Inicio y exploración',
    category: 'General',
    intro: 'Cómo navegar la pantalla principal y encontrar lo que necesitas rápido.',
    mockup: 'home',
    steps: [
      {
        t: 'La pantalla de Inicio',
        d: 'La pestaña "Inicio" muestra un saludo personalizado con tu nombre, la tarjeta de tu grupo y la sección "Próximos eventos" con los eventos de tu comunidad en orden cronológico. Si tienes notificaciones pendientes, aparece un badge rojo en la pestaña "Perfil".',
        tip: 'Desliza hacia abajo para actualizar el feed en cualquier momento.',
      },
      {
        t: 'Filtra los próximos eventos',
        d: 'En la sección "Próximos eventos" encontrarás chips de filtro: "Esta semana" y "Este mes". Tócalos para acotar la vista. Si no hay eventos con el filtro activo, la app lo indica con el mensaje "Sin filtros activos".',
      },
      {
        t: 'Búsqueda global',
        d: 'Toca la barra de búsqueda en la pantalla de Inicio para abrir la búsqueda global. Escribe cualquier término y verás resultados organizados en cuatro secciones: Eventos, Grupos, Núcleos y Usuarios.',
      },
      {
        t: 'El botón "+" (Educadores)',
        d: 'Si eres educador, verás un botón flotante "+" en la pantalla de Inicio. Tócalo para abrir un menú con tres opciones: "Nuevo evento", "Crear grupo" y "Crear núcleo". Es el acceso rápido a todas las acciones de creación.',
        note: 'El botón "+" solo aparece si tu cuenta tiene el rol de Educador. Si no lo ves, verifica tu rol en Perfil → Configuración.',
      },
      {
        t: 'Mapa global de núcleos',
        d: 'En la pestaña "Grupos" encontrarás un mapa interactivo con todos los núcleos registrados en el mundo. Pincha cualquier marcador para ver el nombre del núcleo, grupo al que pertenece y sus horarios. Útil para encontrar dónde entrenar cuando viajas.',
      },
    ],
  },
  {
    id: 'grupos-y-comunidad',
    title: 'Grupos y comunidad',
    category: 'General',
    intro: 'Cómo descubrir grupos, unirte y explorar la jerarquía de tu comunidad.',
    mockup: 'educator',
    steps: [
      {
        t: '¿Qué es un grupo y qué es un núcleo?',
        d: 'Un **grupo** es la organización de capoeira (el "grupo" o escuela en sentido amplio, ej: Abadá Capoeira, Cordão de Ouro). Un **núcleo** es el lugar físico concreto donde se entrena dentro de ese grupo — puede haber varios núcleos en distintas ciudades o países. Tú perteneces a un grupo y entrenas en un núcleo. Los educadores crean núcleos dentro de su grupo.',
        note: 'Cuando la app habla de "tu núcleo" se refiere al lugar específico donde entrenas. Cuando habla de "tu grupo" se refiere a la organización completa.',
      },
      {
        t: 'Explora los grupos',
        d: 'La pestaña "Grupos" muestra todos los grupos públicos registrados en la plataforma. Usa el buscador ("Buscar grupo...") para filtrar por nombre, y los menús desplegables de "País de presencia" y "Estilo de capoeira" para acotar la búsqueda.',
      },
      {
        t: 'El perfil de un grupo',
        d: 'Toca cualquier grupo para ver su perfil completo. Está organizado en pestañas: "Resumen" (descripción y datos), "Eventos" (próximos eventos del grupo), "Jerarquía" (árbol de educadores), "Núcleos" (lista de núcleos activos) y "Graduaciones" (sistema de cordas).',
      },
      {
        t: 'Solicitar unirse a un grupo',
        d: 'Desde el perfil del grupo, toca "Solicitar unirse al grupo". Tu solicitud quedará con el badge "Solicitud pendiente" hasta que el administrador la apruebe. Recibirás una notificación en la pestaña "Perfil → Notificaciones" cuando te acepten.',
        tip: 'Si quieres explicarle al administrador quién eres o cuál es tu núcleo, usa "Solicitud guiada". Te permite enviar un mensaje junto con la solicitud.',
      },
      {
        t: 'Ver la jerarquía del grupo',
        d: 'En la pestaña "Jerarquía" del perfil del grupo encontrarás el árbol completo de educadores y su relación entre sí. Puedes buscar por nombre dentro de la jerarquía. Toca cualquier educador para ver su perfil público.',
      },
      {
        t: 'Ver el perfil de un miembro',
        d: 'Toca el nombre de cualquier educador o miembro para ver su perfil: nombre, apodo, grupo, corda actual y núcleos donde enseña o entrena. El historial de graduaciones también es visible públicamente.',
      },
    ],
  },
  {
    id: 'eventos',
    title: 'Eventos',
    category: 'General',
    intro: 'Cómo descubrir, filtrar y confirmar tu interés en batizados, rodas y más.',
    mockup: 'event',
    steps: [
      {
        t: 'Explora el calendario de eventos',
        d: 'La pestaña "Eventos" muestra un calendario interactivo arriba y la lista de eventos abajo. Toca cualquier fecha en el calendario para ver los eventos de ese día. Puedes alternar entre vista de calendario y vista de lista con el botón toggle en la esquina.',
      },
      {
        t: 'Filtra por categoría y más',
        d: 'Toca "Filtros" para abrir las opciones avanzadas: Categoría (batizado, roda, roda abierta, troca de corda, curso, clase, workshop, seminario, festival, encuentro, intensivo, treino), Precio (gratis o pagados), Formato (presencial u online), Fechas, Grupo y Ubicación.',
        tip: 'Puedes combinar varios filtros al mismo tiempo. Un indicador de "Filtros activos" aparece junto al botón cuando hay filtros aplicados.',
      },
      {
        t: 'Detalle de un evento',
        d: 'Toca cualquier evento para ver la descripción completa, fecha y hora, ubicación en el mapa, tipo de evento, organizadores y el póster si tiene. También verás cuántas personas van ("Voy") y cuántas marcaron interés ("Me interesa").',
      },
      {
        t: 'Confirmar "Voy" o "Me interesa"',
        d: 'Desde el detalle del evento, toca "Me interesa" para guardarlo en tu lista, o "Voy" para confirmar tu asistencia. Los organizadores pueden ver el conteo de ambas confirmaciones.',
        tip: 'Los eventos que marcaste como "Voy" aparecen destacados en tu pantalla de Inicio, en la sección "Próximos eventos".',
      },
      {
        t: 'Compartir un evento',
        d: 'Usa el botón compartir (ícono en la esquina superior del detalle del evento) para enviarlo por WhatsApp, Instagram u otras apps. Se comparte el nombre del evento, la fecha y un enlace directo.',
      },
    ],
  },
  {
    id: 'tu-perfil',
    title: 'Tu perfil',
    category: 'General',
    intro: 'Cómo gestionar tu identidad, notificaciones y acceso a la configuración.',
    steps: [
      {
        t: 'Las tres pestañas del perfil',
        d: 'La pestaña "Perfil" tiene tres secciones internas: "Resumen" (tus próximos eventos y bio), "Notificaciones" (solicitudes pendientes de grupo, núcleo o educador) y "Gestión" (si eres educador, acceso a tus núcleos; si eres alumno, los núcleos donde entrenas).',
      },
      {
        t: 'Editar tu perfil',
        d: 'Toca el ícono de editar (lápiz) sobre tu foto de perfil o tu nombre para abrir el formulario de edición. Puedes cambiar tu foto, nombre, apellido, apodo, una breve bio y tu país. También puedes agregar tu fecha de nacimiento y links a tus redes sociales (Instagram, Facebook, WhatsApp, YouTube, TikTok y sitio web). Guarda los cambios tocando "Guardar".',
        tip: 'Las fotos se suben directamente desde tu cámara o galería. Una imagen cuadrada se ve mejor en el círculo de perfil.',
      },
      {
        t: 'Tu corda y graduaciones',
        d: 'Tu corda actual aparece con su color y nombre debajo de tu nombre en el perfil. Si tienes más de una graduación registrada, toca tu corda para ver el historial completo con fecha de cada cambio de nivel.',
      },
      {
        t: 'Configuración: idioma y tema',
        d: 'Desde "Perfil" toca "Configuración". Allí puedes cambiar el idioma (español, portugués, inglés) en la sección "Idioma", y el tema visual (claro u oscuro) en "Modo de la aplicación". Los cambios se aplican de inmediato.',
      },
      {
        t: 'Notificaciones pendientes',
        d: 'En la pestaña "Notificaciones" del perfil verás cinco tipos de solicitudes: "Solicitud de ingreso al grupo" (alguien quiere unirse a tu grupo), "Solicitud de educador" (petición de relación educador-alumno), "Solicitud al núcleo" (alguien quiere unirse a tu núcleo), "Solicitud de transferencia de núcleo" (transferencia de administración pendiente) y "Solicitud de colaboración" (invitación para co-organizar un evento). El badge rojo en la pestaña "Perfil" indica cuántas tienes sin revisar.',
      },
      {
        t: 'Reportar un problema',
        d: 'Ve a "Perfil" → "Configuración" → "Reportar un problema". Tu reporte llega directamente al equipo de desarrollo con información técnica de tu dispositivo adjunta automáticamente.',
      },
    ],
  },
  {
    id: 'premium',
    title: 'Plan Premium',
    category: 'General',
    intro: 'Qué incluye el plan gratuito, qué desbloquea Premium y cómo suscribirse.',
    steps: [
      {
        t: 'Límites del plan gratuito',
        d: 'Con una cuenta gratuita los educadores pueden crear hasta 10 eventos al mes y los alumnos pueden confirmar asistencia a 1 roda por mes. Las funciones de núcleo, asistencia y pagos están disponibles sin límite en ambos roles.',
        note: 'Los alumnos con plan gratuito ven anuncios dentro de la app.',
      },
      {
        t: 'Qué incluye Premium',
        d: 'Premium desbloquea eventos ilimitados para educadores, hasta 5 rodas por mes para alumnos, soporte prioritario y la app sin anuncios.',
        tip: 'El plan anual aparece marcado con la etiqueta "MEJOR OFERTA" y es significativamente más económico que pagar mes a mes.',
      },
      {
        t: 'Cómo suscribirse',
        d: 'Ve a "Perfil" → "Suscripción" o toca el banner Premium que aparece al alcanzar un límite. Elige el plan mensual o anual y confirma el pago con tu cuenta de Google Play o App Store.',
        note: 'Los pagos se procesan de forma segura a través de Google Play / App Store. Agenda Capoeiragem no almacena datos de tarjetas.',
      },
      {
        t: 'Restaurar compras',
        d: 'Si cambias de dispositivo o reinstalás la app, ve a "Perfil" → "Suscripción" → "Restaurar compras" para recuperar tu plan activo sin pagar nuevamente.',
        tip: 'Usa la misma cuenta de Google o Apple que usaste para comprar el plan.',
      },
    ],
  },
  {
    id: 'unirte-a-un-nucleo',
    title: 'Unirte a un núcleo',
    category: 'Practicantes',
    intro: 'Cómo encontrar un núcleo cercano, enviar una solicitud y qué ocurre después.',
    steps: [
      {
        t: 'Busca un núcleo en el mapa',
        d: 'Ve a la pestaña "Grupos" y usa el mapa interactivo para explorar los núcleos cerca de ti. Toca cualquier marcador para ver el nombre, grupo, horarios y la opción de ver el perfil completo.',
      },
      {
        t: 'Solicita ingresar con "Solicitar ingreso guiado"',
        d: 'Desde el perfil del núcleo, toca "Solicitar ingreso guiado". Puedes incluir un mensaje para presentarte al educador. Tu solicitud aparecerá en la sección "Solicitudes" del panel del núcleo.',
        tip: 'Si ya entrenas con un educador de Agenda Capoeiragem, pídele que te agregue directamente desde su panel para saltar el proceso de solicitud.',
      },
      {
        t: 'Espera la aprobación',
        d: 'Tu solicitud queda como "Pendiente" hasta que el educador la apruebe o rechace. Recibirás una notificación en "Perfil → Notificaciones" cuando haya una respuesta.',
        warn: 'Solo el educador puede aprobar solicitudes. Si no recibes respuesta en varios días, puedes intentar contactar al educador por otro medio.',
      },
      {
        t: 'Accede a tus clases y seguimiento',
        d: 'Una vez aprobado, el núcleo aparece en "Perfil" → pestaña "Gestión". Desde ahí verás tu historial de asistencia mes a mes y el estado de tus pagos si el núcleo gestiona mensualidades.',
      },
    ],
  },
  {
    id: 'tu-historial',
    title: 'Tu historial personal',
    category: 'Practicantes',
    intro: 'Cómo ver tu asistencia mensual, tus graduaciones y los eventos en que participaste.',
    steps: [
      {
        t: 'Asistencia del mes',
        d: 'Ve a "Perfil" → pestaña "Gestión" → tu núcleo. Verás tu porcentaje de asistencia del mes actual y la lista de clases con el indicador de si estuviste presente o ausente.',
      },
      {
        t: 'Historial de graduaciones',
        d: 'Desde tu perfil, toca tu corda actual para desplegar el historial completo con fecha de cada cambio de nivel. El registro es permanente y visible públicamente en tu perfil.',
      },
      {
        t: 'Estado de pagos',
        d: 'Si tu núcleo gestiona pagos, en la pestaña "Gestión" verás el estado de tu pago del mes: "Pendiente", "Pagado" o "Vencido". Solo el educador puede registrar tus pagos.',
        note: 'El estado de pago solo es visible para ti y tu educador. No es información pública.',
      },
      {
        t: 'Eventos confirmados',
        d: 'En la pestaña "Resumen" de tu perfil verás los próximos eventos a los que confirmaste "Voy". Puedes ver el detalle de cada uno tocando su nombre directamente desde el perfil.',
      },
    ],
  },
  {
    id: 'crear-grupo',
    title: 'Crear tu grupo',
    category: 'Educadores',
    intro: 'Cómo registrar tu grupo de capoeira en la plataforma y configurar su información.',
    steps: [
      {
        t: 'Acceder al formulario de creación',
        d: 'Toca el botón flotante "+" en la pantalla de Inicio y elige "Crear grupo". También puedes ir a la pestaña "Grupos" y tocar el botón "Crear grupo" en la esquina superior.',
        note: 'Solo los usuarios con rol de Educador pueden crear grupos. Verifica tu rol en "Perfil → Configuración".',
      },
      {
        t: 'Nombre y descripción',
        d: 'Ingresa el nombre oficial de tu grupo y una descripción. Ambos son obligatorios. El nombre aparecerá en el directorio global, en los perfiles de los miembros y en todos los eventos que organices.',
      },
      {
        t: 'Estilo de capoeira (obligatorio)',
        d: 'En el campo "Estilo de capoeira *" escribe el estilo que practicas (ej: Mixta, Benguela, Angola, Regional). Es un campo de texto libre y obligatorio. Este texto sirve como nombre de tu sistema de graduación, por eso influye en cómo se llaman las cuerdas de tu grupo.',
        tip: 'El campo "Ciudad" es opcional — puedes completarlo ahora o más tarde desde "Editar grupo".',
      },
      {
        t: 'Logo del grupo (opcional)',
        d: 'Sube el logo de tu grupo desde tu galería. Aparecerá en el perfil del grupo, en los núcleos y en la tarjeta del grupo que ven tus alumnos en la pantalla de Inicio.',
      },
      {
        t: 'Crear el grupo',
        d: 'Toca "Crear". Si el nombre no está duplicado, el grupo queda creado de inmediato. La app te preguntará si quieres configurar el sistema de graduación de inmediato — puedes hacerlo ahora o más tarde.',
      },
      {
        t: 'Invitar miembros',
        d: 'Una vez creado el grupo, comparte el nombre del grupo con tus alumnos. Ellos lo buscan en la pestaña "Grupos" → directorio, y solicitan ingreso. También puedes agregarlos directamente desde el panel de tu núcleo (sin que ellos soliciten nada) o vincularse durante su propio onboarding.',
        tip: 'No hay código de invitación: el flujo estándar es que los alumnos te busquen en el directorio o que tú los agregues desde el panel del núcleo.',
      },
    ],
  },
  {
    id: 'administrar-grupo',
    title: 'Administrar tu grupo',
    category: 'Educadores',
    intro: 'Cómo gestionar miembros, roles de administrador y la información del grupo.',
    steps: [
      {
        t: 'Panel de administración del grupo',
        d: 'Ve al perfil de tu grupo y toca el botón de administración (visible solo para administradores y co-administradores). Accederás a las opciones de gestión de miembros, roles y configuración.',
        note: 'Como creador del grupo, eres el administrador principal. Solo tú puedes transferir la administración completa a otra persona.',
      },
      {
        t: 'Aprobar o rechazar solicitudes de ingreso',
        d: 'En "Solicitudes" del panel del grupo verás las solicitudes pendientes con el nombre del solicitante y su mensaje si usó la solicitud guiada. Toca "Aprobar" o "Rechazar" para responder cada una.',
      },
      {
        t: 'Asignar roles: admin y co-admin',
        d: 'Desde el perfil de un miembro en el panel del grupo, puedes asignarle el rol de "Co-administrador" (acceso al panel) o promoverlo a "Administrador". Puedes también usar la opción "Dejar admin" para retirar el rol.',
        warn: '"Transferir administración" pasa el control total del grupo a otro usuario. Esta acción es irreversible: perderás el rol de administrador principal.',
      },
      {
        t: 'Editar la información del grupo',
        d: 'Ve al perfil del grupo → ícono de editar. Puedes cambiar el nombre, descripción, logo, estilo de capoeira y ciudad. Los cambios se aplican de inmediato y se reflejan en el directorio público.',
      },
      {
        t: 'Remover un miembro',
        d: 'Desde la lista de miembros del panel, toca el nombre de un miembro y elige "Remover del grupo". El miembro pierde acceso a los contenidos del grupo pero conserva su historial de graduaciones.',
        warn: 'Remover un miembro es reversible: puede volver a solicitar ingreso al grupo.',
      },
    ],
  },
  {
    id: 'supervision-educativa',
    title: 'Supervisión educativa',
    category: 'Educadores',
    intro: 'Cómo asignar un educador supervisor para los alumnos de tu núcleo y cómo funciona la jerarquía.',
    steps: [
      {
        t: 'Qué es la supervisión educativa',
        d: 'La supervisión educativa es la relación jerárquica entre educadores de un mismo grupo. Un educador más experimentado puede supervisar el progreso de los alumnos de otro educador, especialmente cuando están en distintas ciudades o países.',
        note: 'La pantalla de supervisión se llama "SUPERVISION EDUCATIVA" dentro del panel del núcleo.',
      },
      {
        t: 'Supervisión automática (mismo núcleo)',
        d: 'Si el supervisor y los alumnos comparten el mismo núcleo, la supervisión es automática. La app mostrará el badge "Comparte núcleo" en el perfil del alumno dentro del panel del supervisor.',
      },
      {
        t: 'Supervisión manual (fuera del núcleo)',
        d: 'Si el supervisor está en un núcleo diferente, puedes asignarlo manualmente. En la pantalla de supervisión, toca "Seleccionar educador supervisor" y busca al educador por nombre. Los alumnos supervisados aparecerán con el badge "Fuera de tu núcleo".',
        tip: 'Solo los educadores del mismo grupo pueden asignarse como supervisores. No es posible supervisar alumnos de grupos distintos.',
      },
      {
        t: 'Ver el árbol de supervisión',
        d: 'El árbol de supervisión es visible en la pestaña "Jerarquía" del perfil del grupo. Muestra las relaciones entre educadores y qué alumnos están bajo la supervisión de cada uno — el árbol de "mestre a aprendiz" de tu grupo.',
      },
    ],
  },
  {
    id: 'nucleo-configuracion',
    title: 'Crear tu núcleo',
    category: 'Educadores',
    intro: 'Cómo crear tu núcleo, ubicarlo en el mapa y configurar los horarios de entrenamiento.',
    mockup: 'map',
    steps: [
      {
        t: 'Acceder al formulario de creación',
        d: 'Toca el botón flotante "+" en la pantalla de Inicio y elige "Crear núcleo". También puedes ir a la pestaña "Grupos" → perfil de tu grupo → pestaña "Núcleos" → botón "Crear núcleo".',
        note: 'Necesitas ser administrador o co-administrador de un grupo para crear un núcleo. Si acabas de crear tu grupo, ya tienes ese rol automáticamente.',
      },
      {
        t: 'Ingresa el nombre y la ubicación',
        d: 'Completa los campos: "Nombre del núcleo" (ej: Núcleo Centro), "Ubicación" (dirección completa del lugar donde entrenas), "País" y "Ciudad". Todos son obligatorios.',
        tip: 'Después de ingresar la dirección, toca el mapa para abrir el selector de ubicación y mover el marcador a la posición exacta del lugar. Esto es lo que aparece en el directorio global.',
      },
      {
        t: 'Agrega los horarios de entrenamiento',
        d: 'En la sección "Horarios de entrenamiento", toca "Agregar horario". Selecciona el día de la semana, la hora de inicio y la hora de fin. Puedes agregar varios horarios para distintos días. Al menos un horario es obligatorio para crear el núcleo.',
        tip: 'Cada horario puede asociarse a una turma (grupo de alumnos). Si entrenas con niveles distintos en horarios distintos, agrégalos por separado y luego asigna los alumnos a cada turma.',
      },
      {
        t: 'Crea el núcleo',
        d: 'Toca "Crear núcleo". Si todos los campos están completos, el núcleo queda creado y aparecerá en el mapa global y en el directorio. Serás llevado automáticamente al panel administrativo del núcleo.',
      },
      {
        t: 'Editar o desactivar el núcleo',
        d: 'Para editar el nombre, dirección u horarios, ve al perfil del núcleo → ícono de editar. Si dejas de entrenar en ese lugar, puedes desactivarlo desde "Editar" para que no aparezca en el directorio sin perder el historial.',
      },
      {
        t: 'Configurar el sistema de cobros',
        d: 'Dentro de "Editar núcleo" encontrarás la sección de cobros. Activa el toggle "Clases gratuitas" si no cobras mensualidad — esto oculta completamente la pestaña de Pagos del panel. Si cobras, ingresa el precio mensual, la moneda y el día del mes en que vence el pago (ej: día 10). Estos datos se usan para calcular automáticamente los estados "Pendiente", "Vencido" y "Pagado" en la lista de pagos.',
        tip: 'Si tienes alumnos con tarifas distintas por horario, puedes crear turmas con sus propias opciones de cobro. Cada turma puede tener un precio diferente al del núcleo principal.',
      },
    ],
  },
  {
    id: 'co-educadores',
    title: 'Co-educadores',
    category: 'Educadores',
    intro: 'Cómo agregar co-educadores a tu núcleo y gestionar sus permisos.',
    steps: [
      {
        t: 'Qué es un co-educador',
        d: 'Un co-educador es un educador del mismo grupo que ayuda a gestionar tu núcleo. Tiene acceso al panel administrativo: puede registrar clases, marcar asistencia y registrar pagos, pero no puede cambiar la configuración del núcleo ni transferir la administración.',
      },
      {
        t: 'Agregar un co-educador',
        d: 'Ve al perfil de tu núcleo → sección "Co-educadores" → toca "Agregar co-educador". Busca al educador por nombre (debe ser miembro del mismo grupo con rol de Educador). Toca su nombre y confirma.',
        note: 'Solo pueden ser co-educadores los usuarios con rol de Educador dentro del mismo grupo.',
      },
      {
        t: 'Quitar un co-educador',
        d: 'En la sección "Co-educadores" del perfil del núcleo, toca el nombre del co-educador y elige "Quitar co-educador". La acción es inmediata y el educador pierde acceso al panel del núcleo.',
        warn: 'Quitar un co-educador no borra ningún dato. Todo el historial de clases y pagos registrado por él permanece en el sistema.',
      },
      {
        t: 'Salir del rol de co-educador',
        d: 'Si eres co-educador de un núcleo y ya no quieres serlo, ve al perfil del núcleo → sección "Co-educadores" → "Salir del rol de co-educador". También puedes hacerlo desde "Perfil → Gestión → [nombre del núcleo]" → "Salir del rol".',
      },
      {
        t: 'Transferir la administración del núcleo',
        d: 'Para pasar el control total del núcleo a otro educador, ve al perfil del núcleo → "Transferir administración". El receptor debe ser co-educador activo del núcleo.',
        warn: '"Transferir administración" es irreversible: pasas el control total a la otra persona. El nuevo administrador podrá cambiar todos los ajustes del núcleo.',
      },
    ],
  },
  {
    id: 'solicitudes-nucleo',
    title: 'Solicitudes al núcleo',
    category: 'Educadores',
    intro: 'Cómo gestionar las solicitudes de ingreso al núcleo desde el panel administrativo.',
    steps: [
      {
        t: 'Ver las solicitudes pendientes',
        d: 'Ve al perfil de tu núcleo → botón "Gestionar" → pestaña "Solicitudes". Verás todas las solicitudes de ingreso pendientes. Cada tarjeta muestra el nombre del solicitante, su foto, la fecha y el mensaje que envió (si usó la solicitud guiada).',
      },
      {
        t: 'Aprobar una solicitud',
        d: 'Toca "Aprobar" en la tarjeta del solicitante. El alumno recibirá una notificación de que fue aceptado y comenzará a aparecer en tu lista de alumnos. Puedes asignarlo a una turma de inmediato desde la pestaña "Alumnos".',
      },
      {
        t: 'Rechazar una solicitud',
        d: 'Toca "Rechazar" en la tarjeta del solicitante. El alumno recibirá una notificación indicando que su solicitud no fue aprobada.',
        tip: 'Si rechazas a alguien por error, el alumno puede volver a enviar una solicitud.',
      },
      {
        t: 'Historial de solicitudes procesadas',
        d: 'Debajo de las solicitudes pendientes encontrarás el historial de solicitudes ya procesadas: aprobadas (badge "Aceptada") y rechazadas (badge "Rechazada"). Las solicitudes procesadas permanecen en el historial y no se pueden eliminar.',
      },
    ],
  },
  {
    id: 'nucleo-alumnos',
    title: 'Alumnos y turmas',
    category: 'Educadores',
    intro: 'Cómo ver tus alumnos, agregar miembros sin cuenta y organizarlos por turma.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Panel administrativo del núcleo',
        d: 'Desde "Perfil" → pestaña "Gestión" → tu núcleo, o desde el perfil del núcleo tocando el botón de administración. Encontrarás cuatro pestañas: "Alumnos", "Asistencia", "Pagos" y "Reportes".',
      },
      {
        t: 'Ver la lista de alumnos',
        d: 'En la pestaña "Alumnos" verás todos los miembros vinculados a tu núcleo con su nombre, corda actual y el porcentaje de asistencia del mes. Si no hay miembros, la app muestra "No hay miembros".',
      },
      {
        t: 'Agregar un alumno sin cuenta (ghost member)',
        d: 'Desplázate hacia abajo en la pestaña "Alumnos" hasta la sección "Alumnos sin cuenta". Toca "Agregar alumno" para registrar manualmente a un alumno que no usa la app. Ingresa su nombre y datos básicos.',
        note: 'Los alumnos sin cuenta pueden recibir graduaciones y tener registro de asistencia y pagos, pero no inician sesión en la app. Cuando se registren, puedes vincular su perfil desde el panel para conservar todo el historial.',
      },
      {
        t: 'Crear y gestionar turmas',
        d: 'Accede a la gestión del núcleo (ícono de engranaje o botón "Gestionar"). Desde ahí puedes crear turmas — grupos de alumnos organizados por horario. Crea una turma por cada horario de clase (ej: "Lunes y miércoles 19:00") y asigna los alumnos a cada una.',
        tip: 'Organizar a tus alumnos en turmas hace que pasar lista sea mucho más rápido: en la pantalla de asistencia solo ves los alumnos que corresponden al horario seleccionado.',
      },
      {
        t: 'Ver el perfil individual de un alumno',
        d: 'Toca el nombre de cualquier alumno para ver su ficha individual: nombre, corda, porcentaje de asistencia del mes actual, historial de asistencia mes a mes y registro de pagos.',
      },
    ],
  },
  {
    id: 'asistencia',
    title: 'Control de asistencia',
    category: 'Educadores',
    intro: 'Cómo registrar la clase de hoy, marcar presentes y revisar el historial.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Registrar la clase de hoy',
        d: 'En el panel del núcleo → pestaña "Asistencia", verás el mensaje "Aún no hay clases este mes" si es la primera. Toca el botón "Registrar clase de hoy" para abrir el formulario de sesión.',
      },
      {
        t: 'Seleccionar horario y turma',
        d: 'En el formulario de sesión, selecciona el horario de hoy (uno de los que configuraste al crear el núcleo) y la turma correspondiente. La app cargará automáticamente la lista de alumnos de esa turma.',
        tip: 'Si no tienes turmas configuradas, la lista mostrará todos los alumnos del núcleo.',
      },
      {
        t: 'Marcar presentes y ausentes',
        d: 'Toca el nombre de cada alumno para alternar entre presente (✓ verde) y ausente. La lista muestra primero los alumnos de la turma seleccionada y luego el resto del núcleo, para que no mezcles asistentes de distintos grupos.',
      },
      {
        t: 'Guardar la clase',
        d: 'Toca "Guardar clase". La app muestra un diálogo de confirmación con el conteo de presentes y ausentes. Toca "Confirmar" para registrar la sesión en la nube. El porcentaje de asistencia de cada alumno se actualiza automáticamente.',
      },
      {
        t: 'Revisar sesiones anteriores',
        d: 'En la pestaña "Asistencia", las clases aparecen en orden cronológico. Toca cualquier sesión pasada para ver el detalle completo: quiénes estuvieron presentes, quiénes faltaron y la fecha y hora de registro.',
      },
    ],
  },
  {
    id: 'pagos',
    title: 'Pagos y tesorería',
    category: 'Educadores',
    intro: 'Cómo registrar mensualidades, controlar quién debe y exportar reportes.',
    mockup: 'finances',
    steps: [
      {
        t: 'La pestaña "Pagos"',
        d: 'En el panel administrativo del núcleo, ve a la pestaña "Pagos". Cada alumno aparece con su estado de pago del mes: "Pendiente", "Pagado", "Pagado (tarde)", "Vencido" o "Gratis". Los estados se calculan automáticamente en base al día de vencimiento que configuraste al editar el núcleo.',
        warn: 'La pestaña "Pagos" solo aparece si el núcleo tiene "Clases gratuitas" desactivado. Si la ves en blanco o no aparece, verifica la configuración de cobros del núcleo.',
      },
      {
        t: 'Registrar el pago de un alumno',
        d: 'Toca el nombre de un alumno en la pestaña "Pagos" y luego toca "Registrar pago". Ingresa el monto y selecciona el mes que corresponde. El estado del alumno cambia a "Pagado" de inmediato.',
        tip: 'Puedes registrar pagos adelantados para alumnos que pagan por anticipado. Solo selecciona el mes futuro correspondiente.',
      },
      {
        t: 'Ver quién tiene pagos pendientes o vencidos',
        d: 'En la lista de la pestaña "Pagos" verás de un vistazo el estado de todos los alumnos. Los estados "Pendiente" y "Vencido" aparecen destacados. También verás el día límite de pago configurado ("Vence el día X").',
      },
      {
        t: 'Generar y exportar el reporte mensual',
        d: 'Ve a la pestaña "Reportes" del panel del núcleo. Selecciona el formato (CSV para Excel o Google Sheets, o PDF para imprimir o compartir) y toca "Generar reporte". El reporte incluye el resumen de pagos y asistencia del mes.',
        tip: 'El reporte CSV es ideal para llevar un registro en planilla. El PDF es útil para compartir con la administración del grupo o para archivar.',
      },
    ],
  },
  {
    id: 'graduaciones',
    title: 'Sistema de graduación',
    category: 'Educadores',
    intro: 'Cómo configurar las cordas de tu grupo y registrar cambios de nivel.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Acceder al sistema de graduación',
        d: 'Ve al perfil de tu grupo → pestaña "Graduaciones". Si aún no tienes niveles configurados, verás el mensaje "No hay niveles de graduación definidos" y el botón "Configurar sistema ahora". También puedes ir por Grupo → Administración → "Gestionar sistema completo".',
      },
      {
        t: 'Crear un nivel de corda',
        d: 'Toca "Agregar nivel" o "Crear Nivel". Ingresa el nombre de la corda (ej: "Corda Verde-Amarela"), selecciona los colores que la componen, e indica si tiene puntas pintadas y cuántas. Guarda el nivel.',
        tip: 'El color visual de cada nivel aparece en el perfil de los alumnos y en el directorio público. Configúralo fielmente para que corresponda a la corda real.',
      },
      {
        t: 'Organizar por categoría',
        d: 'Los niveles se organizan automáticamente en secciones: "Sistema Adulto", "Sistema Juvenil", "Sistema Infantil", "Estagiarios" y "Niveles Especiales". Asigna la categoría correcta al crear o editar cada nivel.',
      },
      {
        t: 'Definir el nivel de educador',
        d: 'Puedes marcar a partir de qué corda un alumno se considera "educador" en el grupo. Esto determina quién tiene acceso a crear núcleos y a las herramientas de gestión. Esta configuración está en la sección de administración del grupo.',
      },
      {
        t: 'Asignar una graduación',
        d: 'Para graduar a un alumno, ve al perfil del grupo → "Graduaciones" → "Asignar graduación". Busca el alumno, selecciona el nuevo nivel y la fecha. El cambio queda registrado en el historial permanente del alumno y su nueva corda se muestra en su perfil de inmediato.',
        tip: 'Puedes asignar graduaciones de forma masiva para un batizado: selecciona varios alumnos a la vez, elige el nivel y la fecha, y todos quedan graduados en un solo paso.',
      },
      {
        t: 'Ver el historial de graduación de un alumno',
        d: 'Toca el nombre de cualquier alumno de tu grupo. En su perfil verás la corda actual con su color. Toca la corda para ver el historial completo: todos los cambios de nivel con fecha. El historial no puede eliminarse.',
      },
    ],
  },
  {
    id: 'eventos-educador',
    title: 'Crear y gestionar eventos',
    category: 'Educadores',
    intro: 'Cómo publicar un batizado, roda o taller para que la comunidad lo vea.',
    mockup: 'event',
    steps: [
      {
        t: 'Crear un evento',
        d: 'Toca el botón flotante "+" en la pantalla de Inicio → "Nuevo evento". También puedes ir a la pestaña "Eventos" y tocar el botón "Nuevo evento" en la esquina superior.',
      },
      {
        t: 'Completa los datos del evento',
        d: 'El formulario de creación incluye: nombre del evento, categoría (batizado, roda, roda abierta, troca de corda, curso, clase, workshop, seminario, festival, encuentro, intensivo o treino), fecha, hora de inicio y hora de fin.',
      },
      {
        t: 'Agrega descripción y póster',
        d: 'Ingresa la descripción con todos los detalles relevantes (precio, requisitos, qué traer, etc.). Sube una imagen de portada (póster) desde tu galería para darle visibilidad al evento.',
        tip: 'Los eventos con póster tienen mayor visibilidad en el feed de los miembros. Una imagen vertical con buena resolución se ve mejor.',
      },
      {
        t: 'Fija la ubicación en el mapa',
        d: 'Ingresa la dirección del evento. La app abrirá el selector de mapa donde puedes mover el marcador para ubicar exactamente el lugar. Los asistentes verán la ubicación y podrán abrir la navegación directamente desde el evento.',
      },
      {
        t: 'Precio y métodos de pago (opcional)',
        d: 'Si el evento tiene costo, ingresa el precio y la moneda. Luego agrega los métodos de pago aceptados: transferencia bancaria, efectivo, Mercado Pago, PayPal u otro. Cada método tiene campos para instrucciones o enlace de pago. Si el evento es gratuito, deja el precio en 0.',
      },
      {
        t: 'Cronograma / Agenda del evento (opcional)',
        d: 'En la sección "Agenda", toca "Agregar bloque" para crear el cronograma del evento. Cada bloque tiene: título de la actividad, hora de inicio y hora de fin (opcionales), descripción y lugar (presencial con dirección, o enlace online). Los bloques se ordenan cronológicamente de forma automática.',
        tip: 'Cuando agregas al menos un bloque con lugar, la ubicación general del evento desaparece del formulario — se deriva automáticamente de los bloques del cronograma. Ideal para batizados con múltiples actividades en distintos lugares.',
      },
      {
        t: 'Editar un evento ya creado',
        d: 'Ve al detalle del evento → toca el ícono de editar (disponible para el organizador y co-organizadores). Podrás cambiar todos los datos: título, categoría, fecha, descripción, póster, precio, métodos de pago, ubicación y cronograma. Los cambios se ven de inmediato para todos.',
        warn: 'Los usuarios que ya confirmaron "Voy" no reciben notificación automática cuando cambias la fecha o la ubicación. Si haces un cambio importante, comunícalo por otro canal.',
      },
      {
        t: 'Gestiona co-organizadores',
        d: 'Desde el menú de edición del evento toca "Colaboradores". Busca al co-organizador por nombre (debe tener cuenta en la app) y envía la invitación. El receptor verá la solicitud en "Perfil → Notificaciones". Al aceptar, tendrá acceso para editar el evento y ver la lista de asistentes.',
      },
    ],
  },
  {
    id: 'reportes-kpi',
    title: 'Reportes y KPIs',
    category: 'Educadores',
    intro: 'Cómo revisar las métricas del núcleo y exportar datos para análisis externos.',
    mockup: 'kpi',
    steps: [
      {
        t: 'Las métricas rápidas del panel',
        d: 'En la parte superior del panel administrativo del núcleo (pestañas Alumnos / Asistencia / Pagos / Reportes) verás una franja de KPIs: número de alumnos, cantidad de clases del mes, porcentaje de asistencia promedio, cantidad de alumnos pagados y cantidad de vencidos.',
      },
      {
        t: 'La pestaña "Reportes"',
        d: 'Ve al panel del núcleo → pestaña "Reportes". El subtítulo dice "Asistencia, pagos y estadísticas del núcleo". Desde aquí generas el reporte mensual con toda la información consolidada.',
      },
      {
        t: 'Elegir el formato del reporte',
        d: 'Selecciona el formato que necesitas: "CSV" para abrir en Excel o Google Sheets y hacer análisis personalizados, o "PDF" para obtener un documento listo para compartir o imprimir.',
      },
      {
        t: 'Generar y exportar',
        d: 'Toca "Generar reporte". La app genera el archivo con el resumen del mes: alumnos activos, sesiones realizadas, porcentaje de asistencia general y estado de pagos por alumno. Puedes compartirlo directamente desde la pantalla de exportación.',
        tip: 'Genera el reporte a fin de mes para llevar un registro histórico de la salud de tu núcleo. Los datos no se pierden, pero tener el respaldo en archivo es buena práctica.',
      },
    ],
  },
]

// ─── Portuguese ───────────────────────────────────────────────────────────────

const SECTIONS_PT: Section[] = [
  {
    id: 'primeiros-passos',
    title: 'Primeiros passos',
    category: 'Geral',
    intro: 'Como criar sua conta, completar seu perfil e entrar na sua comunidade.',
    mockup: 'home',
    steps: [
      {
        t: 'Instale o app ou use como app web',
        d: 'Baixe na Google Play no Android, ou acesse agendacapoeiragem.com no navegador e adicione à tela inicial para usar como app web (PWA). As duas opções funcionam igual.',
        note: 'A versão nativa para iPhone está em desenvolvimento. Enquanto isso, use o Safari no iOS → "Adicionar à tela de início".',
      },
      {
        t: 'Crie sua conta',
        d: 'Ao abrir o app, você verá a tela "Criar conta — Junte-se à comunidade de capoeira". Preencha nome, sobrenome, apelido (opcional) e e-mail. Você também pode se registrar com o Google.',
        tip: 'Antes de continuar, o app perguntará seu papel: "Praticante" ou "Educador". Escolha "Educador" se você já ensina capoeira — isso libera as ferramentas de gestão desde o início.',
      },
      {
        t: 'Complete o onboarding',
        d: 'Após o cadastro, a tela de onboarding vai guiá-lo para adicionar sua foto de perfil e encontrar seu grupo ou núcleo. Você pode pular essa etapa e fazer depois, mas vincular-se desde o início ativa todas as funções comunitárias.',
      },
      {
        t: 'Vincule seu grupo',
        d: 'Na tela inicial você verá o cartão "Sem grupo atribuído" com o botão "Buscar grupos". Procure seu grupo no diretório e envie uma solicitação de entrada. Você também pode pedir ao seu educador para te adicionar diretamente pelo painel do núcleo.',
        warn: 'Sem um grupo vinculado, você não conseguirá ver os eventos nem o histórico de graduações da sua comunidade. As funções de presença e pagamentos também não estarão disponíveis.',
      },
    ],
  },
  {
    id: 'inicio-e-exploracao',
    title: 'Início e exploração',
    category: 'Geral',
    intro: 'Como navegar a tela principal e encontrar o que você precisa rapidamente.',
    mockup: 'home',
    steps: [
      {
        t: 'A tela de Início',
        d: 'A aba "Início" mostra uma saudação personalizada com seu nome, o cartão do seu grupo e a seção "Próximos eventos" com os eventos da sua comunidade em ordem cronológica. Se houver notificações pendentes, aparece um badge vermelho na aba "Perfil".',
        tip: 'Deslize para baixo para atualizar o feed a qualquer momento.',
      },
      {
        t: 'Filtre os próximos eventos',
        d: 'Na seção "Próximos eventos" você encontrará chips de filtro: "Esta semana" e "Este mês". Toque neles para refinar a visualização.',
      },
      {
        t: 'Busca global',
        d: 'Toque na barra de busca na tela de Início para abrir a busca global. Digite qualquer termo e verá resultados em quatro seções: Eventos, Grupos, Núcleos e Usuários.',
      },
      {
        t: 'O botão "+" (Educadores)',
        d: 'Se você é educador, verá um botão flutuante "+" na tela de Início. Toque para abrir um menu com três opções: "Novo evento", "Criar grupo" e "Criar núcleo".',
        note: 'O botão "+" só aparece se sua conta tiver o papel de Educador. Verifique seu papel em Perfil → Configurações.',
      },
      {
        t: 'Mapa global de núcleos',
        d: 'Na aba "Grupos" você encontrará um mapa interativo com todos os núcleos registrados no mundo. Toque em qualquer marcador para ver o nome do núcleo, grupo e horários. Útil para encontrar onde treinar quando você viaja.',
      },
    ],
  },
  {
    id: 'grupos-e-comunidade',
    title: 'Grupos e comunidade',
    category: 'Geral',
    intro: 'Como descobrir grupos, entrar em um e explorar a hierarquia da sua comunidade.',
    mockup: 'educator',
    steps: [
      {
        t: 'O que é um grupo e o que é um núcleo?',
        d: 'Um **grupo** é a organização de capoeira (a "escola" no sentido amplo, ex: Abadá Capoeira, Cordão de Ouro). Um **núcleo** é o local físico específico onde se treina dentro desse grupo — pode haver vários núcleos em cidades ou países diferentes. Você pertence a um grupo e treina em um núcleo. Os educadores criam núcleos dentro do seu grupo.',
        note: 'Quando o app fala "seu núcleo" se refere ao local específico onde você treina. Quando fala "seu grupo" se refere à organização completa.',
      },
      {
        t: 'Explore os grupos',
        d: 'A aba "Grupos" mostra todos os grupos públicos registrados na plataforma. Use a barra de busca ("Buscar grupo...") para filtrar por nome, e os menus de "País de presença" e "Estilo de capoeira" para refinar.',
      },
      {
        t: 'O perfil de um grupo',
        d: 'Toque em qualquer grupo para ver seu perfil completo em abas: "Resumo" (descrição e dados), "Eventos" (próximos eventos do grupo), "Hierarquia" (árvore de educadores), "Núcleos" (lista de núcleos ativos) e "Graduações" (sistema de cordas).',
      },
      {
        t: 'Solicitar entrada em um grupo',
        d: 'No perfil do grupo, toque "Solicitar entrada no grupo". Sua solicitação ficará com o badge "Solicitação pendente" até o administrador aprovar. Você receberá uma notificação em "Perfil → Notificações" quando for aceito.',
        tip: 'Se quiser explicar ao administrador quem você é, use "Solicitação guiada". Permite enviar uma mensagem junto com a solicitação.',
      },
      {
        t: 'Ver a hierarquia do grupo',
        d: 'Na aba "Hierarquia" do perfil do grupo você encontrará a árvore completa de educadores. Pode buscar por nome dentro da hierarquia. Toque em qualquer educador para ver seu perfil público.',
      },
      {
        t: 'Ver o perfil de um membro',
        d: 'Toque no nome de qualquer educador ou membro para ver seu perfil: nome, apelido, grupo, corda atual e núcleos onde ensina ou treina. O histórico de graduações também é visível publicamente.',
      },
    ],
  },
  {
    id: 'eventos',
    title: 'Eventos',
    category: 'Geral',
    intro: 'Como descobrir, filtrar e confirmar seu interesse em batizados, rodas e mais.',
    mockup: 'event',
    steps: [
      {
        t: 'Explore o calendário de eventos',
        d: 'A aba "Eventos" mostra um calendário interativo no topo e a lista de eventos abaixo. Toque em qualquer data para ver os eventos daquele dia. Você pode alternar entre visão de calendário e visão de lista com o botão no canto.',
      },
      {
        t: 'Filtre por categoria e mais',
        d: 'Toque em "Filtros" para abrir as opções avançadas: Categoria (batizado, roda, roda aberta, troca de corda, curso, aula, workshop, seminário, festival, encontro, intensivo, treino), Preço (grátis ou pagos), Formato (presencial ou online), Datas, Grupo e Localização.',
        tip: 'Você pode combinar vários filtros ao mesmo tempo. Um indicador de "Filtros ativos" aparece junto ao botão quando há filtros aplicados.',
      },
      {
        t: 'Detalhes de um evento',
        d: 'Toque em qualquer evento para ver descrição completa, data e hora, localização no mapa, tipo de evento, organizadores e o pôster. Você verá quantas pessoas vão ("Vou") e quantas marcaram interesse ("Tenho interesse").',
      },
      {
        t: 'Confirmar "Vou" ou "Tenho interesse"',
        d: 'No detalhe do evento, toque "Tenho interesse" para salvá-lo na sua lista, ou "Vou" para confirmar presença. Os organizadores podem ver o total de ambas as confirmações.',
        tip: 'Os eventos que você marcou como "Vou" aparecem em destaque na sua tela de Início, na seção "Próximos eventos".',
      },
      {
        t: 'Compartilhar um evento',
        d: 'Use o botão compartilhar no detalhe do evento para enviá-lo pelo WhatsApp, Instagram ou outros apps. É compartilhado o nome, a data e um link direto para o evento.',
      },
    ],
  },
  {
    id: 'seu-perfil',
    title: 'Seu perfil',
    category: 'Geral',
    intro: 'Como gerenciar sua identidade, notificações e acessar as configurações.',
    steps: [
      {
        t: 'As três abas do perfil',
        d: 'A aba "Perfil" tem três seções: "Resumo" (seus próximos eventos e bio), "Notificações" (solicitações pendentes de grupo, núcleo ou educador) e "Gestão" (se educador, acesso aos seus núcleos; se aluno, os núcleos onde treina).',
      },
      {
        t: 'Editar seu perfil',
        d: 'Toque no ícone de editar (lápis) sobre sua foto ou nome para abrir o formulário de edição. Você pode mudar foto, nome, sobrenome e apelido. Salve tocando "Salvar".',
        tip: 'As fotos são enviadas da câmera ou galeria. Uma imagem quadrada fica melhor no círculo de perfil.',
      },
      {
        t: 'Sua corda e graduações',
        d: 'Sua corda atual aparece com cor e nome abaixo do seu nome no perfil. Se tiver mais de uma graduação registrada, toque na corda para ver o histórico completo com a data de cada mudança de nível.',
      },
      {
        t: 'Configurações: idioma e tema',
        d: 'Em "Perfil", toque "Configurações". Lá você pode mudar o idioma (português, espanhol, inglês) em "Idioma", e o tema visual (claro ou escuro) em "Modo do aplicativo". As mudanças se aplicam imediatamente.',
      },
      {
        t: 'Notificações pendentes',
        d: 'Na aba "Notificações" do perfil você verá cinco tipos de solicitações: "Solicitação de entrada no grupo" (alguém quer entrar no seu grupo), "Solicitação de educador" (pedido de relação educador-aluno), "Solicitação ao núcleo" (alguém quer entrar no seu núcleo), "Solicitação de transferência de núcleo" (transferência de administração pendente) e "Solicitação de colaboração" (convite para co-organizar um evento). O badge vermelho na aba "Perfil" indica quantas você tem sem revisar.',
      },
      {
        t: 'Reportar um problema',
        d: 'Vá em "Perfil" → "Configurações" → "Reportar um problema". Seu relato vai diretamente à equipe de desenvolvimento com informações técnicas do seu dispositivo anexadas automaticamente.',
      },
    ],
  },
  {
    id: 'premium',
    title: 'Plano Premium',
    category: 'Geral',
    intro: 'O que inclui o plano gratuito, o que o Premium desbloqueia e como assinar.',
    steps: [
      {
        t: 'Limites do plano gratuito',
        d: 'Com uma conta gratuita, educadores podem criar até 10 eventos por mês e alunos podem confirmar presença em 1 roda por mês. As funções de núcleo, presença e pagamentos estão disponíveis sem limite em ambos os papéis.',
        note: 'Alunos com plano gratuito veem anúncios dentro do app.',
      },
      {
        t: 'O que inclui o Premium',
        d: 'O Premium desbloqueia eventos ilimitados para educadores, até 5 rodas por mês para alunos, suporte prioritário e o app sem anúncios.',
        tip: 'O plano anual aparece marcado com a etiqueta "MELHOR OFERTA" e é significativamente mais econômico do que pagar mês a mês.',
      },
      {
        t: 'Como assinar',
        d: 'Vá em "Perfil" → "Assinatura" ou toque no banner Premium que aparece ao atingir um limite. Escolha o plano mensal ou anual e confirme o pagamento com sua conta do Google Play ou App Store.',
        note: 'Os pagamentos são processados com segurança pelo Google Play / App Store. O Agenda Capoeiragem não armazena dados de cartão.',
      },
      {
        t: 'Restaurar compras',
        d: 'Se trocar de dispositivo ou reinstalar o app, vá em "Perfil" → "Assinatura" → "Restaurar compras" para recuperar seu plano ativo sem pagar novamente.',
        tip: 'Use a mesma conta do Google ou Apple que usou para comprar o plano.',
      },
    ],
  },
  {
    id: 'entrar-num-nucleo',
    title: 'Entrar em um núcleo',
    category: 'Praticantes',
    intro: 'Como encontrar um núcleo perto de você, enviar uma solicitação e o que acontece depois.',
    steps: [
      {
        t: 'Busque um núcleo no mapa',
        d: 'Vá à aba "Grupos" e use o mapa interativo para explorar os núcleos perto de você. Toque em qualquer marcador para ver o nome, grupo, horários e a opção de ver o perfil completo.',
      },
      {
        t: 'Solicite entrar com "Solicitar entrada guiada"',
        d: 'No perfil do núcleo, toque "Solicitar entrada guiada". Você pode incluir uma mensagem para se apresentar ao educador. Sua solicitação aparecerá na seção "Solicitações" do painel do núcleo.',
        tip: 'Se já treina com um educador do Agenda Capoeiragem, peça para ele te adicionar diretamente pelo painel para pular o processo de solicitação.',
      },
      {
        t: 'Aguarde a aprovação',
        d: 'Sua solicitação fica como "Pendente" até o educador aprovar ou rejeitar. Você receberá uma notificação em "Perfil → Notificações" quando houver uma resposta.',
        warn: 'Só o educador pode aprovar solicitações. Se não receber resposta em alguns dias, tente contatar o educador por outro meio.',
      },
      {
        t: 'Acesse suas aulas e acompanhamento',
        d: 'Após a aprovação, o núcleo aparece em "Perfil" → aba "Gestão". Lá você verá seu histórico de presença mês a mês e o status dos seus pagamentos se o núcleo gerencia mensalidades.',
      },
    ],
  },
  {
    id: 'seu-historico',
    title: 'Seu histórico pessoal',
    category: 'Praticantes',
    intro: 'Como ver sua presença mensal, suas graduações e os eventos em que você participou.',
    steps: [
      {
        t: 'Presença do mês',
        d: 'Vá em "Perfil" → aba "Gestão" → seu núcleo. Você verá seu porcentual de presença do mês atual e a lista de aulas com indicador de presença ou ausência.',
      },
      {
        t: 'Histórico de graduações',
        d: 'No seu perfil, toque na sua corda atual para ver o histórico completo com a data de cada mudança de nível. O registro é permanente e visível publicamente no seu perfil.',
      },
      {
        t: 'Status de pagamentos',
        d: 'Se o seu núcleo gerencia pagamentos, na aba "Gestão" você verá o status do seu pagamento do mês: "Pendente", "Pago" ou "Vencido". Só o educador pode registrar seus pagamentos.',
        note: 'O status de pagamento é visível apenas para você e seu educador. Não é informação pública.',
      },
      {
        t: 'Eventos confirmados',
        d: 'Na aba "Resumo" do seu perfil você verá os próximos eventos nos quais confirmou "Vou". Pode ver o detalhe de cada um tocando o nome diretamente do perfil.',
      },
    ],
  },
  {
    id: 'criar-grupo',
    title: 'Criar seu grupo',
    category: 'Educadores',
    intro: 'Como registrar seu grupo de capoeira na plataforma e configurar suas informações.',
    steps: [
      {
        t: 'Acessar o formulário de criação',
        d: 'Toque no botão flutuante "+" na tela de Início → "Criar grupo". Você também pode ir à aba "Grupos" e tocar o botão "Criar grupo" no canto superior.',
        note: 'Apenas usuários com o papel de Educador podem criar grupos. Verifique seu papel em "Perfil → Configurações".',
      },
      {
        t: 'Nome e descrição',
        d: 'Insira o nome oficial do seu grupo e uma descrição. Ambos são obrigatórios. O nome aparecerá no diretório global, nos perfis dos membros e em todos os eventos que você organizar.',
      },
      {
        t: 'Estilo de capoeira (obrigatório)',
        d: 'No campo "Estilo de capoeira *" escreva o estilo que você pratica (ex: Mista, Benguela, Angola, Regional). É um campo de texto livre e obrigatório. Esse texto serve como nome do seu sistema de graduação e influencia como as cordas são chamadas no grupo.',
        tip: 'O campo "Cidade" é opcional — você pode preenchê-lo agora ou depois em "Editar grupo".',
      },
      {
        t: 'Logo do grupo (opcional)',
        d: 'Envie o logo do seu grupo da galeria. Aparecerá no perfil do grupo, nos núcleos e no cartão do grupo que seus alunos veem na tela de Início.',
      },
      {
        t: 'Criar o grupo',
        d: 'Toque "Criar". Se o nome não estiver duplicado, o grupo é criado imediatamente. O app perguntará se você quer configurar o sistema de graduação agora ou depois.',
      },
      {
        t: 'Convidar membros',
        d: 'Após criar o grupo, compartilhe o nome com seus alunos. Eles buscam na aba "Grupos" → diretório e solicitam entrada. Você também pode adicioná-los diretamente pelo painel do seu núcleo ou eles se vinculam durante o próprio onboarding.',
        tip: 'Não há código de convite: o fluxo padrão é os alunos te buscarem no diretório ou você os adicionar pelo painel do núcleo.',
      },
    ],
  },
  {
    id: 'administrar-grupo',
    title: 'Administrar seu grupo',
    category: 'Educadores',
    intro: 'Como gerenciar membros, papéis de administrador e as informações do grupo.',
    steps: [
      {
        t: 'Painel de administração do grupo',
        d: 'Vá ao perfil do seu grupo e toque o botão de administração (visível apenas para administradores e co-administradores). Você acessará as opções de gerenciamento de membros, papéis e configuração.',
        note: 'Como criador do grupo, você é o administrador principal. Apenas você pode transferir a administração completa para outra pessoa.',
      },
      {
        t: 'Aprovar ou rejeitar solicitações de entrada',
        d: 'Em "Solicitações" do painel do grupo você verá as solicitações pendentes com o nome do solicitante e sua mensagem se usou a solicitação guiada. Toque "Aprovar" ou "Rejeitar" para responder cada uma.',
      },
      {
        t: 'Atribuir papéis: admin e co-admin',
        d: 'No perfil de um membro no painel do grupo, você pode atribuir o papel de "Co-administrador" (acesso ao painel) ou promovê-lo a "Administrador". Você também pode usar a opção "Deixar admin" para remover o papel.',
        warn: '"Transferir administração" passa o controle total do grupo para outro usuário. Essa ação é irreversível: você perderá o papel de administrador principal.',
      },
      {
        t: 'Editar as informações do grupo',
        d: 'Vá ao perfil do grupo → ícone de editar. Você pode mudar nome, descrição, logo, estilo de capoeira e cidade. As mudanças se aplicam imediatamente e refletem no diretório público.',
      },
      {
        t: 'Remover um membro',
        d: 'Na lista de membros do painel, toque no nome de um membro e escolha "Remover do grupo". O membro perde acesso aos conteúdos do grupo, mas mantém seu histórico de graduações.',
        warn: 'Remover um membro é reversível: ele pode solicitar entrada no grupo novamente.',
      },
    ],
  },
  {
    id: 'supervisao-educativa',
    title: 'Supervisão educativa',
    category: 'Educadores',
    intro: 'Como atribuir um educador supervisor para os alunos do seu núcleo e como funciona a hierarquia.',
    steps: [
      {
        t: 'O que é a supervisão educativa',
        d: 'A supervisão educativa é a relação hierárquica entre educadores de um mesmo grupo. Um educador mais experiente pode supervisionar o progresso dos alunos de outro educador, especialmente útil quando estão em cidades ou países diferentes.',
        note: 'A tela de supervisão se chama "SUPERVISÃO EDUCATIVA" dentro do painel do núcleo.',
      },
      {
        t: 'Supervisão automática (mesmo núcleo)',
        d: 'Se o supervisor e os alunos compartilham o mesmo núcleo, a supervisão é automática. O app mostrará o badge "Compartilha núcleo" no perfil do aluno dentro do painel do supervisor.',
      },
      {
        t: 'Supervisão manual (fora do núcleo)',
        d: 'Se o supervisor está em um núcleo diferente, você pode atribuí-lo manualmente. Na tela de supervisão, toque "Selecionar educador supervisor" e busque o educador pelo nome. Os alunos supervisionados aparecerão com o badge "Fora do seu núcleo".',
        tip: 'Apenas educadores do mesmo grupo podem ser atribuídos como supervisores. Não é possível supervisionar alunos de grupos diferentes.',
      },
      {
        t: 'Ver a árvore de supervisão',
        d: 'A árvore de supervisão é visível na aba "Hierarquia" do perfil do grupo. Ela mostra as relações entre educadores e quais alunos estão sob supervisão de cada um — a árvore de "mestre a aprendiz" do seu grupo.',
      },
    ],
  },
  {
    id: 'nucleo-configuracao',
    title: 'Criar seu núcleo',
    category: 'Educadores',
    intro: 'Como criar seu núcleo, posicioná-lo no mapa e configurar os horários de treino.',
    mockup: 'map',
    steps: [
      {
        t: 'Acessar o formulário de criação',
        d: 'Toque no botão flutuante "+" na tela de Início → "Criar núcleo". Você também pode ir à aba "Grupos" → perfil do seu grupo → aba "Núcleos" → botão "Criar núcleo".',
        note: 'Você precisa ser administrador ou co-administrador de um grupo para criar um núcleo. Se acabou de criar seu grupo, já tem esse papel automaticamente.',
      },
      {
        t: 'Preencha nome e localização',
        d: 'Complete os campos: "Nome do núcleo" (ex: Núcleo Centro), "Localização" (endereço completo), "País" e "Cidade". Todos são obrigatórios.',
        tip: 'Após inserir o endereço, toque no mapa para abrir o seletor de localização e mover o marcador para o ponto exato. Isso é o que aparece no diretório global.',
      },
      {
        t: 'Adicione os horários de treino',
        d: 'Na seção "Horários de treinamento", toque "Adicionar horário". Selecione o dia da semana, hora de início e hora de fim. Adicione quantos horários precisar. Pelo menos um horário é obrigatório para criar o núcleo.',
        tip: 'Cada horário pode ser associado a uma turma. Se você treina diferentes níveis em horários distintos, adicione-os separadamente.',
      },
      {
        t: 'Crie o núcleo',
        d: 'Toque "Criar núcleo". Se todos os campos estão preenchidos, o núcleo é criado e aparecerá no mapa global e no diretório. Você será levado automaticamente ao painel administrativo do núcleo.',
      },
      {
        t: 'Editar ou desativar o núcleo',
        d: 'Para editar nome, endereço ou horários, vá ao perfil do núcleo → ícone de editar. Se parar de treinar naquele local, pode desativar o núcleo para que não apareça no diretório sem perder o histórico.',
      },
    ],
  },
  {
    id: 'co-educadores',
    title: 'Co-educadores',
    category: 'Educadores',
    intro: 'Como adicionar co-educadores ao seu núcleo e gerenciar suas permissões.',
    steps: [
      {
        t: 'O que é um co-educador',
        d: 'Um co-educador é um educador do mesmo grupo que ajuda a gerenciar seu núcleo. Tem acesso ao painel administrativo: pode registrar aulas, marcar presença e registrar pagamentos, mas não pode alterar a configuração do núcleo nem transferir a administração.',
      },
      {
        t: 'Adicionar um co-educador',
        d: 'Vá ao perfil do seu núcleo → seção "Co-educadores" → toque "Agregar co-educador". Busque o educador pelo nome (deve ser membro do mesmo grupo com papel de Educador). Toque no nome e confirme.',
        note: 'Apenas usuários com papel de Educador dentro do mesmo grupo podem ser co-educadores.',
      },
      {
        t: 'Remover um co-educador',
        d: 'Na seção "Co-educadores" do perfil do núcleo, toque no nome do co-educador e escolha "Quitar co-educador". A ação é imediata e o educador perde acesso ao painel do núcleo.',
        warn: 'Remover um co-educador não apaga nenhum dado. Todo o histórico de aulas e pagamentos registrado por ele permanece no sistema.',
      },
      {
        t: 'Sair do papel de co-educador',
        d: 'Se você é co-educador de um núcleo e não quer mais ser, vá ao perfil do núcleo → seção "Co-educadores" → "Salir del rol de co-educador". Você também pode fazer isso em "Perfil → Gestão → [nome do núcleo]" → "Salir del rol".',
      },
      {
        t: 'Transferir a administração do núcleo',
        d: 'Para passar o controle total do núcleo a outro educador, vá ao perfil do núcleo → "Transferir administração". O receptor deve ser co-educador ativo do núcleo.',
        warn: '"Transferir administração" é irreversível: você passa o controle total para a outra pessoa. O novo administrador poderá alterar todas as configurações do núcleo.',
      },
    ],
  },
  {
    id: 'solicitacoes-nucleo',
    title: 'Solicitações ao núcleo',
    category: 'Educadores',
    intro: 'Como gerenciar as solicitações de entrada no núcleo pelo painel administrativo.',
    steps: [
      {
        t: 'Ver as solicitações pendentes',
        d: 'Vá ao perfil do seu núcleo → botão "Gerenciar" → aba "Solicitações". Você verá todas as solicitações de entrada pendentes. Cada cartão mostra o nome do solicitante, sua foto, a data e a mensagem enviada (se usou a solicitação guiada).',
      },
      {
        t: 'Aprovar uma solicitação',
        d: 'Toque "Aprovar" no cartão do solicitante. O aluno receberá uma notificação de que foi aceito e começará a aparecer na sua lista de alunos. Você pode atribuí-lo a uma turma imediatamente na aba "Alunos".',
      },
      {
        t: 'Rejeitar uma solicitação',
        d: 'Toque "Rejeitar" no cartão do solicitante. O aluno receberá uma notificação indicando que sua solicitação não foi aprovada.',
        tip: 'Se rejeitar alguém por engano, o aluno pode enviar uma nova solicitação.',
      },
      {
        t: 'Histórico de solicitações processadas',
        d: 'Abaixo das solicitações pendentes você encontrará o histórico de solicitações já processadas: aprovadas (badge "Aceita") e rejeitadas (badge "Rejeitada"). As solicitações processadas ficam no histórico e não podem ser excluídas.',
      },
    ],
  },
  {
    id: 'nucleo-alunos',
    title: 'Alunos e turmas',
    category: 'Educadores',
    intro: 'Como ver seus alunos, adicionar membros sem conta e organizá-los por turma.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Painel administrativo do núcleo',
        d: 'Acesse em "Perfil" → aba "Gestão" → seu núcleo, ou pelo perfil do núcleo tocando o botão de administração. Você encontrará quatro abas: "Alunos", "Presença", "Pagamentos" e "Relatórios".',
      },
      {
        t: 'Ver a lista de alunos',
        d: 'Na aba "Alunos" você verá todos os membros vinculados ao seu núcleo, com nome, corda atual e porcentual de presença do mês. Se não houver membros, o app mostra "Não há membros".',
      },
      {
        t: 'Adicionar um aluno sem conta (ghost member)',
        d: 'Role para baixo na aba "Alunos" até a seção "Alunos sem conta". Toque "Adicionar aluno" para registrar manualmente um aluno que não usa o app. Insira o nome e os dados básicos.',
        note: 'Alunos sem conta podem receber graduações e ter registro de presença e pagamentos, mas não fazem login no app. Quando se cadastrarem, você pode vincular o perfil para preservar todo o histórico.',
      },
      {
        t: 'Criar e gerenciar turmas',
        d: 'Acesse a gestão do núcleo (ícone de engrenagem ou botão "Gerenciar"). Lá você pode criar turmas — grupos de alunos organizados por horário. Crie uma turma por horário de aula (ex: "Segunda e Quarta 19h") e atribua os alunos.',
        tip: 'Organizar alunos em turmas torna a chamada muito mais rápida: na tela de presença você vê apenas os alunos do horário selecionado.',
      },
      {
        t: 'Ver o perfil individual de um aluno',
        d: 'Toque no nome de qualquer aluno para ver sua ficha: nome, corda, porcentual de presença do mês, histórico de presença mês a mês e registro de pagamentos.',
      },
    ],
  },
  {
    id: 'presenca',
    title: 'Controle de presença',
    category: 'Educadores',
    intro: 'Como registrar a aula de hoje, marcar presentes e revisar o histórico.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Registrar a aula de hoje',
        d: 'No painel do núcleo → aba "Presença", você verá a mensagem "Ainda não há aulas este mês" se for a primeira. Toque o botão "Registrar aula de hoje" para abrir o formulário de sessão.',
      },
      {
        t: 'Selecionar horário e turma',
        d: 'No formulário de sessão, selecione o horário de hoje (um dos que você configurou ao criar o núcleo) e a turma correspondente. O app carregará automaticamente a lista de alunos daquela turma.',
        tip: 'Se não tiver turmas configuradas, a lista mostrará todos os alunos do núcleo.',
      },
      {
        t: 'Marcar presentes e ausentes',
        d: 'Toque no nome de cada aluno para alternar entre presente (✓ verde) e ausente. A lista mostra primeiro os alunos da turma selecionada e depois o restante do núcleo, para não misturar grupos.',
      },
      {
        t: 'Salvar a aula',
        d: 'Toque "Salvar aula". O app mostra um diálogo de confirmação com o total de presentes e ausentes. Toque "Confirmar" para registrar a sessão na nuvem. O porcentual de presença de cada aluno é atualizado automaticamente.',
      },
      {
        t: 'Revisar sessões anteriores',
        d: 'Na aba "Presença", as aulas aparecem em ordem cronológica. Toque em qualquer sessão passada para ver o detalhe completo: quem esteve presente, quem faltou e a data e hora do registro.',
      },
    ],
  },
  {
    id: 'pagamentos',
    title: 'Pagamentos e tesouraria',
    category: 'Educadores',
    intro: 'Como registrar mensalidades, controlar quem deve e exportar relatórios.',
    mockup: 'finances',
    steps: [
      {
        t: 'A aba "Pagamentos"',
        d: 'No painel administrativo do núcleo, vá à aba "Pagamentos". Cada aluno aparece com seu status de pagamento do mês: "Pendente", "Pago", "Pago (atrasado)", "Vencido" ou "Gratuito". Os status são calculados automaticamente por data.',
        warn: 'Se o mês já começou e um aluno não tem pagamento registrado, seu status muda automaticamente para "Pendente" e depois para "Vencido" a partir do dia limite configurado.',
      },
      {
        t: 'Registrar o pagamento de um aluno',
        d: 'Toque no nome do aluno na aba "Pagamentos" e depois em "Registrar pagamento". Insira o valor e selecione o mês correspondente. O status do aluno muda para "Pago" imediatamente.',
        tip: 'Você pode registrar pagamentos antecipados para alunos que pagam adiantado. Basta selecionar o mês futuro correspondente.',
      },
      {
        t: 'Ver quem tem pagamentos pendentes ou vencidos',
        d: 'Na lista da aba "Pagamentos" você vê de uma vez o status de todos os alunos. Os status "Pendente" e "Vencido" aparecem em destaque. Você também verá o dia limite de pagamento configurado.',
      },
      {
        t: 'Gerar e exportar o relatório mensal',
        d: 'Vá à aba "Relatórios" do painel do núcleo. Selecione o formato (CSV para Excel ou Google Sheets, ou PDF para imprimir ou compartilhar) e toque "Gerar relatório".',
        tip: 'O relatório CSV é ideal para planilha. O PDF é útil para compartilhar com a administração do grupo ou para arquivar.',
      },
    ],
  },
  {
    id: 'graduacoes',
    title: 'Sistema de graduação',
    category: 'Educadores',
    intro: 'Como configurar as cordas do seu grupo e registrar mudanças de nível.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Acessar o sistema de graduação',
        d: 'Vá ao perfil do seu grupo → aba "Graduações". Se ainda não tiver níveis configurados, você verá "Não há níveis de graduação definidos" e o botão "Configurar sistema agora".',
      },
      {
        t: 'Criar um nível de corda',
        d: 'Toque "Adicionar nível" ou "Criar Nível". Insira o nome da corda (ex: "Corda Verde-Amarela"), selecione as cores que a compõem, e indique se tem pontas pintadas e quantas. Salve o nível.',
        tip: 'A cor visual de cada nível aparece no perfil dos alunos e no diretório público. Configure fielmente para que corresponda à corda real.',
      },
      {
        t: 'Organizar por categoria',
        d: 'Os níveis se organizam em seções: "Sistema Adulto", "Sistema Juvenil", "Sistema Infantil", "Estagiários" e "Níveis Especiais". Atribua a categoria correta ao criar ou editar cada nível.',
      },
      {
        t: 'Definir o nível de educador',
        d: 'Você pode marcar a partir de qual corda um aluno é considerado "educador" no grupo. Isso determina quem tem acesso a criar núcleos e às ferramentas de gestão.',
      },
      {
        t: 'Atribuir uma graduação',
        d: 'No perfil do grupo → "Graduações" → "Atribuir graduação". Busque o aluno, selecione o novo nível e a data. A mudança fica registrada no histórico permanente do aluno e a nova corda aparece no seu perfil imediatamente.',
        tip: 'Você pode atribuir graduações em massa para um batizado: selecione vários alunos de uma vez, escolha o nível e a data, e todos são graduados em um único passo.',
      },
      {
        t: 'Ver o histórico de graduação de um aluno',
        d: 'Toque no nome de qualquer aluno do seu grupo. No seu perfil você verá a corda atual com sua cor. Toque na corda para ver o histórico completo: todas as mudanças de nível com data. O histórico não pode ser excluído.',
      },
    ],
  },
  {
    id: 'eventos-educador',
    title: 'Criar e gerenciar eventos',
    category: 'Educadores',
    intro: 'Como publicar um batizado, roda ou oficina para que a comunidade veja.',
    mockup: 'event',
    steps: [
      {
        t: 'Criar um evento',
        d: 'Toque o botão flutuante "+" na tela de Início → "Novo evento". Também pode ir à aba "Eventos" e tocar o botão "Novo Evento" no canto superior.',
      },
      {
        t: 'Preencha os dados do evento',
        d: 'O formulário inclui: nome do evento, categoria (batizado, roda, roda aberta, troca de corda, curso, aula, workshop, seminário, festival, encontro, intensivo ou treino), data, hora de início e hora de fim.',
      },
      {
        t: 'Adicione descrição e pôster',
        d: 'Insira a descrição com todos os detalhes relevantes (preço, requisitos, o que levar, etc.). Envie uma imagem de capa (pôster) da sua galeria para dar visibilidade ao evento.',
        tip: 'Eventos com pôster têm maior visibilidade no feed dos membros. Uma imagem vertical com boa resolução fica melhor.',
      },
      {
        t: 'Fixe a localização no mapa',
        d: 'Insira o endereço do evento. O app abrirá o seletor de mapa onde você pode mover o marcador para localizar exatamente o lugar. Os participantes verão a localização e poderão abrir a navegação diretamente do evento.',
      },
      {
        t: 'Gerencie co-organizadores e participantes',
        d: 'Após criar o evento, você pode adicionar co-organizadores no menu de edição → "Colaboradores". Eles podem editar o evento e ver a lista de quem marcou "Vou" ou "Tenho interesse".',
      },
    ],
  },
  {
    id: 'relatorios-kpi',
    title: 'Relatórios e KPIs',
    category: 'Educadores',
    intro: 'Como revisar as métricas do núcleo e exportar dados para análise externa.',
    mockup: 'kpi',
    steps: [
      {
        t: 'As métricas rápidas do painel',
        d: 'Na parte superior do painel administrativo do núcleo você verá uma faixa de KPIs: número de alunos, quantidade de aulas do mês, porcentual médio de presença, quantidade de alunos pagos e quantidade de vencidos.',
      },
      {
        t: 'A aba "Relatórios"',
        d: 'Vá ao painel do núcleo → aba "Relatórios". O subtítulo é "Presença, pagamentos e estatísticas do núcleo". Daqui você gera o relatório mensal com todas as informações consolidadas.',
      },
      {
        t: 'Escolha o formato do relatório',
        d: 'Selecione o formato que precisa: "CSV" para abrir no Excel ou Google Sheets, ou "PDF" para um documento pronto para compartilhar ou imprimir.',
      },
      {
        t: 'Gerar e exportar',
        d: 'Toque "Gerar relatório". O app gera o arquivo com o resumo do mês: alunos ativos, sessões realizadas, porcentual de presença geral e status de pagamentos por aluno. Você pode compartilhá-lo diretamente da tela de exportação.',
        tip: 'Gere o relatório ao fim de cada mês para manter um registro histórico da saúde do seu núcleo.',
      },
    ],
  },
]

// ─── English ──────────────────────────────────────────────────────────────────

const SECTIONS_EN: Section[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    category: 'General',
    intro: 'How to create your account, complete your profile, and join your community.',
    mockup: 'home',
    steps: [
      {
        t: 'Install the app or use it as a web app',
        d: 'Download it from Google Play on Android, or open agendacapoeiragem.com in your browser and add it to your home screen as a web app (PWA). Both options work the same way.',
        note: 'The native iPhone version is in development. In the meantime, use Safari on iOS → "Add to Home Screen".',
      },
      {
        t: 'Create your account',
        d: 'When you open the app you will see the screen "Create account — Join the capoeira community". Fill in your first name, last name, optional nickname, and email. You can also register with Google.',
        tip: 'Before continuing, the app will ask for your role: "Practitioner" or "Educator". Choose "Educator" if you already teach capoeira — this unlocks the management tools from the start.',
      },
      {
        t: 'Complete the onboarding',
        d: 'After registration, the onboarding screen guides you to add a profile photo and find your group or school. You can skip this step and do it later, but linking from the start activates all community features.',
      },
      {
        t: 'Link your group',
        d: 'On the home screen you will see the card "No group assigned" with a "Find groups" button. Search for your group in the directory and send a join request. You can also ask your educator to add you directly from their school admin panel.',
        warn: 'Without a linked group you cannot see your community\'s events or graduation history. Attendance and payment features will also be unavailable.',
      },
    ],
  },
  {
    id: 'home-and-discovery',
    title: 'Home & discovery',
    category: 'General',
    intro: 'How to navigate the main screen and find what you need quickly.',
    mockup: 'home',
    steps: [
      {
        t: 'The Home screen',
        d: 'The "Home" tab shows a personalized greeting with your name, your group card, and the "Upcoming events" section with your community\'s events in chronological order. A red badge on the "Profile" tab indicates pending notifications.',
        tip: 'Pull down to refresh the feed at any time.',
      },
      {
        t: 'Filter upcoming events',
        d: 'In the "Upcoming events" section you will find filter chips: "This week" and "This month". Tap them to narrow the view.',
      },
      {
        t: 'Global search',
        d: 'Tap the search bar on the Home screen to open global search. Type any term and you will see results organized in four sections: Events, Groups, Schools, and Users.',
      },
      {
        t: 'The "+" button (Educators)',
        d: 'If you are an educator, you will see a floating "+" button on the Home screen. Tap it to open a menu with three options: "New event", "Create group", and "Create school".',
        note: 'The "+" button only appears if your account has the Educator role. Check your role in Profile → Settings.',
      },
      {
        t: 'Global map of schools',
        d: 'In the "Groups" tab you will find an interactive map with all registered schools worldwide. Tap any marker to see the school name, its group, and its schedules. Useful for finding a place to train when traveling.',
      },
    ],
  },
  {
    id: 'groups-and-community',
    title: 'Groups & community',
    category: 'General',
    intro: 'How to discover groups, join one, and explore your community\'s hierarchy.',
    mockup: 'educator',
    steps: [
      {
        t: 'What is a group and what is a school (núcleo)?',
        d: 'A **group** is the capoeira organization as a whole (e.g. Abadá Capoeira, Cordão de Ouro). A **school** (núcleo) is a specific physical training location within that group — one group can have many schools in different cities or countries. You belong to a group and train at a school. Educators create schools inside their group.',
        note: 'When the app says "your school" it means the specific place where you train. When it says "your group" it means the whole organization.',
      },
      {
        t: 'Browse groups',
        d: 'The "Groups" tab shows all public groups on the platform. Use the search bar ("Search group...") to filter by name, and the "Country of presence" and "Capoeira style" dropdowns to narrow the search.',
      },
      {
        t: 'A group\'s profile',
        d: 'Tap any group to see its full profile organized in tabs: "Summary" (description and stats), "Events" (upcoming group events), "Hierarchy" (educator tree), "Schools" (active schools list), and "Graduations" (belt system).',
      },
      {
        t: 'Request to join a group',
        d: 'From the group profile, tap "Request to join the group". Your request will show the badge "Request pending" until the admin approves it. You will receive a notification in "Profile → Notifications" when accepted.',
        tip: 'If you want to tell the admin who you are, use "Guided request". It lets you send a message along with your request.',
      },
      {
        t: 'View the group hierarchy',
        d: 'In the "Hierarchy" tab of the group profile you will find the full educator tree. You can search by name within the hierarchy. Tap any educator to see their public profile.',
      },
      {
        t: 'View a member\'s profile',
        d: 'Tap the name of any educator or member to see their profile: name, nickname, group, current belt, and schools where they teach or train. The graduation history is also publicly visible.',
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    category: 'General',
    intro: 'How to discover, filter, and confirm your interest in batizados, rodas, and more.',
    mockup: 'event',
    steps: [
      {
        t: 'Explore the events calendar',
        d: 'The "Events" tab shows an interactive calendar at the top and the event list below. Tap any date to see that day\'s events. You can toggle between calendar view and list view with the button in the corner.',
      },
      {
        t: 'Filter by category and more',
        d: 'Tap "Filters" to open advanced options: Category (batizado, roda, open roda, troca de corda, course, class, workshop, seminar, festival, meetup, intensive, training), Price (free or paid), Format (in-person or online), Dates, Group, and Location.',
        tip: 'You can combine multiple filters at once. An "Active filters" indicator appears next to the button when filters are applied.',
      },
      {
        t: 'Event detail',
        d: 'Tap any event to see the full description, date and time, map location, event type, organizers, and poster if it has one. You will also see how many people are going ("Going") and how many marked interest ("Interested").',
      },
      {
        t: 'Confirm "Going" or "Interested"',
        d: 'From the event detail, tap "Interested" to save it to your list, or "Going" to confirm attendance. Organizers can see the total count for both.',
        tip: 'Events you marked as "Going" appear highlighted on your Home screen in the "Upcoming events" section.',
      },
      {
        t: 'Share an event',
        d: 'Use the share button in the event detail to send it via WhatsApp, Instagram, or other apps. The event name, date, and a direct link are shared.',
      },
    ],
  },
  {
    id: 'your-profile',
    title: 'Your profile',
    category: 'General',
    intro: 'How to manage your identity, notifications, and access settings.',
    steps: [
      {
        t: 'The three profile tabs',
        d: 'The "Profile" tab has three internal sections: "Summary" (your upcoming events and bio), "Notifications" (pending requests from group, school, or educator), and "Management" (if educator, access to your schools; if student, the schools where you train).',
      },
      {
        t: 'Edit your profile',
        d: 'Tap the edit icon (pencil) on your profile photo or name to open the edit form. You can change your photo, first name, last name, and nickname. Save by tapping "Save".',
        tip: 'Photos are uploaded from your camera or gallery. A square image looks best in the circular profile picture.',
      },
      {
        t: 'Your belt and graduations',
        d: 'Your current belt appears with its color and name below your name in the profile. If you have more than one recorded graduation, tap your belt to see the full history with the date of each level change.',
      },
      {
        t: 'Settings: language and theme',
        d: 'From "Profile", tap "Settings". There you can change the language (English, Spanish, Portuguese) in the "Language" section, and the visual theme (light or dark) in "App mode". Changes apply immediately.',
      },
      {
        t: 'Pending notifications',
        d: 'In the "Notifications" tab of your profile you will see five types of requests: "Group join request" (someone wants to join your group), "Educator request" (educator-student relationship request), "School join request" (someone wants to join your school), "School transfer request" (pending administration transfer), and "Collaboration request" (invitation to co-organize an event). The red badge on the "Profile" tab shows how many you have unread.',
      },
      {
        t: 'Report a problem',
        d: 'Go to "Profile" → "Settings" → "Report a problem". Your report goes directly to the development team with technical device information attached automatically.',
      },
    ],
  },
  {
    id: 'premium',
    title: 'Premium plan',
    category: 'General',
    intro: 'What the free plan includes, what Premium unlocks, and how to subscribe.',
    steps: [
      {
        t: 'Free plan limits',
        d: 'With a free account, educators can create up to 10 events per month and students can confirm attendance at 1 roda per month. School management, attendance, and payment features are available without limit for both roles.',
        note: 'Students on the free plan see ads inside the app.',
      },
      {
        t: 'What Premium includes',
        d: 'Premium unlocks unlimited events for educators, up to 5 rodas per month for students, priority support, and an ad-free experience.',
        tip: 'The annual plan is marked with the "BEST VALUE" badge and is significantly cheaper than paying month to month.',
      },
      {
        t: 'How to subscribe',
        d: 'Go to "Profile" → "Subscription" or tap the Premium banner that appears when you reach a limit. Choose the monthly or annual plan and confirm the payment with your Google Play or App Store account.',
        note: 'Payments are processed securely through Google Play / App Store. Agenda Capoeiragem does not store card data.',
      },
      {
        t: 'Restore purchases',
        d: 'If you change devices or reinstall the app, go to "Profile" → "Subscription" → "Restore purchases" to recover your active plan without paying again.',
        tip: 'Use the same Google or Apple account you used to purchase the plan.',
      },
    ],
  },
  {
    id: 'join-a-school',
    title: 'Joining a school',
    category: 'Practitioners',
    intro: 'How to find a nearby school, send a request, and what happens next.',
    steps: [
      {
        t: 'Find a school on the map',
        d: 'Go to the "Groups" tab and use the interactive map to explore schools near you. Tap any marker to see the name, group, schedules, and the option to view the full profile.',
      },
      {
        t: 'Request to join with "Guided join request"',
        d: 'From the school profile, tap "Guided join request". You can include a message to introduce yourself to the educator. Your request will appear in the "Requests" section of the school panel.',
        tip: 'If you already train with an educator who uses Agenda Capoeiragem, ask them to add you directly from their panel to skip the request process.',
      },
      {
        t: 'Wait for approval',
        d: 'Your request stays as "Pending" until the educator approves or rejects it. You will receive a notification in "Profile → Notifications" when there is a response.',
        warn: 'Only the educator can approve requests. If you do not receive a response within a few days, try contacting the educator through another channel.',
      },
      {
        t: 'Access your classes and tracking',
        d: 'Once approved, the school appears in "Profile" → "Management" tab. There you will see your month-by-month attendance history and your payment status if the school manages fees.',
      },
    ],
  },
  {
    id: 'your-history',
    title: 'Your personal history',
    category: 'Practitioners',
    intro: 'How to view your monthly attendance, your graduations, and the events you attended.',
    steps: [
      {
        t: "This month's attendance",
        d: 'Go to "Profile" → "Management" tab → your school. You will see your attendance percentage for the current month and the list of classes with a present or absent indicator for each.',
      },
      {
        t: 'Graduation history',
        d: 'From your profile, tap your current belt to expand the full history with the date of each level change. The record is permanent and publicly visible on your profile.',
      },
      {
        t: 'Payment status',
        d: 'If your school manages payments, in the "Management" tab you will see your payment status for the month: "Pending", "Paid", or "Overdue". Only the educator can record your payments.',
        note: 'Your payment status is visible only to you and your educator. It is not public information.',
      },
      {
        t: 'Confirmed events',
        d: 'In the "Summary" tab of your profile you will see upcoming events you confirmed "Going" to. You can view the detail of each one by tapping the event name directly from your profile.',
      },
    ],
  },
  {
    id: 'create-group',
    title: 'Creating your group',
    category: 'Educators',
    intro: 'How to register your capoeira group on the platform and configure its information.',
    steps: [
      {
        t: 'Access the creation form',
        d: 'Tap the floating "+" button on the Home screen → "Create group". You can also go to the "Groups" tab and tap "Create group" in the top corner.',
        note: 'Only users with the Educator role can create groups. Check your role in "Profile → Settings".',
      },
      {
        t: 'Name and description',
        d: 'Enter your group\'s official name and a description. Both are required. The name will appear in the global directory, on member profiles, and on all events you organize.',
      },
      {
        t: 'Capoeira style (required)',
        d: 'In the "Capoeira style *" field, type the style you practice (e.g. Mixed, Benguela, Angola, Regional). It is a free-text field and it is required. This text is used as the name of your graduation system and shapes how your belts are labeled.',
        tip: 'The "City" field is optional — you can fill it in now or later from "Edit group".',
      },
      {
        t: 'Group logo (optional)',
        d: 'Upload your group logo from your gallery. It will appear on the group profile, in schools, and on the group card that your students see on the Home screen.',
      },
      {
        t: 'Create the group',
        d: 'Tap "Create". If the name is not a duplicate, the group is created immediately. The app will ask if you want to set up the graduation system now or later.',
      },
      {
        t: 'Invite members',
        d: 'After creating the group, share its name with your students. They search for it in the "Groups" tab → directory and request to join. You can also add them directly from your school admin panel, or they can link during their own onboarding.',
        tip: 'There is no invite code: the standard flow is students finding you in the directory, or you adding them from the school panel.',
      },
    ],
  },
  {
    id: 'manage-group',
    title: 'Managing your group',
    category: 'Educators',
    intro: 'How to manage members, admin roles, and group information.',
    steps: [
      {
        t: 'Group administration panel',
        d: 'Go to your group profile and tap the administration button (visible only to admins and co-admins). You will access options for managing members, roles, and group configuration.',
        note: 'As the group creator, you are the main admin. Only you can transfer full administration to another person.',
      },
      {
        t: 'Approve or reject join requests',
        d: 'In "Requests" on the group panel you will see pending requests with the applicant\'s name and their message if they used the guided request. Tap "Approve" or "Reject" to respond to each one.',
      },
      {
        t: 'Assign roles: admin and co-admin',
        d: 'From a member\'s profile in the group panel, you can assign them the "Co-admin" role (panel access) or promote them to "Admin". You can also use the "Leave admin" option to remove the role.',
        warn: '"Transfer administration" passes full group control to another user. This action is irreversible: you will lose the main admin role.',
      },
      {
        t: 'Edit group information',
        d: 'Go to the group profile → edit icon. You can change the name, description, logo, capoeira style, and city. Changes apply immediately and are reflected in the public directory.',
      },
      {
        t: 'Remove a member',
        d: 'From the member list in the panel, tap a member\'s name and choose "Remove from group". The member loses access to group content but retains their graduation history.',
        warn: 'Removing a member is reversible: they can request to join the group again.',
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: 'Educational supervision',
    category: 'Educators',
    intro: 'How to assign a supervising educator for your school\'s students and how the hierarchy works.',
    steps: [
      {
        t: 'What educational supervision is',
        d: 'Educational supervision is the hierarchical relationship between educators in the same group. A more experienced educator can oversee the progress of another educator\'s students, especially useful when they are in different cities or countries.',
        note: 'The supervision screen is called "EDUCATIONAL SUPERVISION" inside the school panel.',
      },
      {
        t: 'Automatic supervision (same school)',
        d: 'If the supervisor and students share the same school, supervision is automatic. The app will show the "Same school" badge on the student\'s profile inside the supervisor\'s panel.',
      },
      {
        t: 'Manual supervision (outside the school)',
        d: 'If the supervisor is in a different school, you can assign them manually. On the supervision screen, tap "Select supervising educator" and search by name. Supervised students will show the "Outside your school" badge.',
        tip: 'Only educators from the same group can be assigned as supervisors. It is not possible to supervise students from different groups.',
      },
      {
        t: 'View the supervision tree',
        d: 'The supervision tree is visible in the "Hierarchy" tab of the group profile. It shows the relationships between educators and which students are under each one\'s supervision — the "mestre to apprentice" tree of your group.',
      },
    ],
  },
  {
    id: 'school-setup',
    title: 'Creating your school',
    category: 'Educators',
    intro: 'How to create your school, place it on the map, and set up training schedules.',
    mockup: 'map',
    steps: [
      {
        t: 'Access the creation form',
        d: 'Tap the floating "+" button on the Home screen → "Create school". You can also go to the "Groups" tab → your group\'s profile → "Schools" tab → "Create school" button.',
        note: 'You need to be an admin or co-admin of a group to create a school. If you just created your group, you already have that role automatically.',
      },
      {
        t: 'Fill in the name and location',
        d: 'Complete the required fields: "School name" (e.g. Downtown School), "Location" (full address of your training venue), "Country", and "City".',
        tip: 'After entering the address, tap the map to open the location picker and drag the marker to the exact spot. This is what appears on the global directory.',
      },
      {
        t: 'Add training schedules',
        d: 'In the "Training schedules" section, tap "Add schedule". Select the weekday, start time, and end time. Add as many schedules as you need. At least one schedule is required to create the school.',
        tip: 'Each schedule can be linked to a class group. If you train different levels at different times, add them separately.',
      },
      {
        t: 'Create the school',
        d: 'Tap "Create school". If all fields are complete, the school is created and will appear on the global map and in the directory. You will be taken automatically to the school\'s admin panel.',
      },
      {
        t: 'Edit or deactivate',
        d: 'To edit the name, address, or schedules, go to the school profile → edit icon. If you stop training at that location, you can deactivate the school so it doesn\'t appear in the directory without losing the history.',
      },
    ],
  },
  {
    id: 'co-educators',
    title: 'Co-educators',
    category: 'Educators',
    intro: 'How to add co-educators to your school and manage their permissions.',
    steps: [
      {
        t: 'What a co-educator is',
        d: 'A co-educator is an educator from the same group who helps manage your school. They have access to the admin panel: they can record classes, mark attendance, and register payments, but cannot change school configuration or transfer administration.',
      },
      {
        t: 'Add a co-educator',
        d: 'Go to your school profile → "Co-educators" section → tap "Add co-educator". Search for the educator by name (they must be a member of the same group with the Educator role). Tap their name and confirm.',
        note: 'Only users with the Educator role within the same group can be co-educators.',
      },
      {
        t: 'Remove a co-educator',
        d: 'In the "Co-educators" section of the school profile, tap the co-educator\'s name and choose "Remove co-educator". The action is immediate and the educator loses access to the school panel.',
        warn: 'Removing a co-educator does not delete any data. All class and payment history they recorded remains in the system.',
      },
      {
        t: 'Leave the co-educator role',
        d: 'If you are a co-educator at a school and no longer want to be, go to the school profile → "Co-educators" section → "Leave co-educator role". You can also do this from "Profile → Management → [school name]" → "Leave role".',
      },
      {
        t: 'Transfer school administration',
        d: 'To hand full school control to another educator, go to the school profile → "Transfer administration". The recipient must be an active co-educator of the school.',
        warn: '"Transfer administration" is irreversible: you pass full control to the other person. The new admin will be able to change all school settings.',
      },
    ],
  },
  {
    id: 'school-requests',
    title: 'School join requests',
    category: 'Educators',
    intro: 'How to manage join requests to your school from the admin panel.',
    steps: [
      {
        t: 'View pending requests',
        d: 'Go to your school profile → "Manage" button → "Requests" tab. You will see all pending join requests. Each card shows the applicant\'s name, photo, date, and the message they sent (if they used the guided request).',
      },
      {
        t: 'Approve a request',
        d: 'Tap "Approve" on the applicant\'s card. The student will receive a notification that they were accepted and will start appearing in your student list. You can assign them to a class group immediately from the "Students" tab.',
      },
      {
        t: 'Reject a request',
        d: 'Tap "Reject" on the applicant\'s card. The student will receive a notification that their request was not approved.',
        tip: 'If you reject someone by mistake, the student can send a new request.',
      },
      {
        t: 'Processed requests history',
        d: 'Below the pending requests you will find the history of already-processed requests: approved (badge "Accepted") and rejected (badge "Rejected"). Processed requests remain in the history and cannot be deleted.',
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Students & class groups',
    category: 'Educators',
    intro: 'How to view your students, add members without accounts, and organize them by class group.',
    mockup: 'attendance',
    steps: [
      {
        t: 'The school admin panel',
        d: 'Access it from "Profile" → "Management" tab → your school, or from the school profile by tapping the admin button. You will find four tabs: "Students", "Attendance", "Payments", and "Reports".',
      },
      {
        t: 'View the student list',
        d: 'In the "Students" tab you will see all members linked to your school with their name, current belt, and monthly attendance percentage. If there are no members, the app shows "No members".',
      },
      {
        t: 'Add a student without an account (ghost member)',
        d: 'Scroll down in the "Students" tab to the "Students without account" section. Tap "Add student" to manually register a student who doesn\'t use the app. Enter their name and basic details.',
        note: 'Ghost members can receive graduations and have attendance and payment records, but cannot log in to the app. When they sign up, you can link their profile to preserve the full history.',
      },
      {
        t: 'Create and manage class groups',
        d: 'Access the school management (gear icon or "Manage" button). There you can create class groups — sets of students organized by schedule. Create one per time slot (e.g. "Mon & Wed 7pm") and assign students to each.',
        tip: 'Organizing students into class groups makes attendance much faster: the attendance screen shows only the students for the selected time slot.',
      },
      {
        t: 'View an individual student\'s profile',
        d: 'Tap any student\'s name to see their profile: name, belt, current month attendance percentage, month-by-month attendance history, and payment record.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Attendance tracking',
    category: 'Educators',
    intro: 'How to record today\'s class, mark present and absent, and review history.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Record today\'s class',
        d: 'In the school admin panel → "Attendance" tab, you will see "No classes this month yet" if it\'s the first one. Tap "Record today\'s class" to open the session form.',
      },
      {
        t: 'Select schedule and class group',
        d: 'In the session form, select today\'s schedule (one of the ones you configured when creating the school) and the corresponding class group. The app will automatically load the students for that group.',
        tip: 'If you have no class groups configured, the list will show all students in the school.',
      },
      {
        t: 'Mark present and absent',
        d: 'Tap each student\'s name to toggle between present (✓ green) and absent. The list shows the selected class group\'s students first, then the rest of the school, so groups don\'t mix.',
      },
      {
        t: 'Save the class',
        d: 'Tap "Save class". The app shows a confirmation dialog with the present and absent counts. Tap "Confirm" to record the session to the cloud. Each student\'s attendance percentage updates automatically.',
      },
      {
        t: 'Review previous sessions',
        d: 'In the "Attendance" tab, sessions appear in chronological order. Tap any past session to see the full detail: who was present, who was absent, and the date and time of the record.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & treasury',
    category: 'Educators',
    intro: 'How to record monthly fees, track who owes, and export reports.',
    mockup: 'finances',
    steps: [
      {
        t: 'The "Payments" tab',
        d: 'In the school admin panel, go to the "Payments" tab. Each student appears with their current month\'s payment status: "Pending", "Paid", "Paid (late)", "Overdue", or "Free". Statuses are calculated automatically by date.',
        warn: 'If the month has started and a student has no recorded payment, their status automatically changes to "Pending" and then to "Overdue" after the configured due date.',
      },
      {
        t: 'Record a student payment',
        d: 'Tap the student\'s name in the "Payments" tab and then tap "Record payment". Enter the amount and select the corresponding month. The student\'s status immediately changes to "Paid".',
        tip: 'You can record advance payments for students who pay ahead of time. Just select the corresponding future month.',
      },
      {
        t: 'See who has pending or overdue payments',
        d: 'In the "Payments" tab list you can see all students\' statuses at a glance. "Pending" and "Overdue" statuses are highlighted. You will also see the configured payment due day.',
      },
      {
        t: 'Generate and export the monthly report',
        d: 'Go to the "Reports" tab of the school panel. Select the format (CSV for Excel or Google Sheets, or PDF to print or share) and tap "Generate report".',
        tip: 'CSV is ideal for spreadsheet analysis. PDF is useful for sharing with group administration or for archiving.',
      },
    ],
  },
  {
    id: 'graduations',
    title: 'Graduation system',
    category: 'Educators',
    intro: 'How to set up your group\'s belts and record level changes.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Access the graduation system',
        d: 'Go to your group\'s profile → "Graduations" tab. If no levels are configured yet, you will see "No graduation levels defined" and a "Set up system now" button.',
      },
      {
        t: 'Create a belt level',
        d: 'Tap "Add level" or "Create Level". Enter the belt name (e.g. "Green-Yellow Belt"), select the colors that compose it, and indicate whether it has painted tips and how many. Save the level.',
        tip: 'The visual color of each level appears on student profiles and in the public directory. Configure it faithfully to match the real belt.',
      },
      {
        t: 'Organize by category',
        d: 'Levels are organized automatically into sections: "Adult System", "Youth System", "Children\'s System", "Trainee Instructors", and "Special Levels". Assign the correct category when creating or editing each level.',
      },
      {
        t: 'Define the educator level',
        d: 'You can mark from which belt a student is considered an "educator" in the group. This determines who has access to create schools and use management tools.',
      },
      {
        t: 'Assign a graduation',
        d: 'In the group profile → "Graduations" → "Assign graduation". Find the student, select the new level and date. The change is recorded permanently in the student\'s history and the new belt appears on their profile immediately.',
        tip: 'You can assign graduations in bulk for a batizado: select multiple students at once, choose the level and date, and everyone is graduated in a single step.',
      },
      {
        t: "View a student's graduation history",
        d: "Tap any group member's name. Their profile shows the current belt with its color. Tap the belt to see the full history: every level change with date. The history cannot be deleted.",
      },
    ],
  },
  {
    id: 'manage-events',
    title: 'Create & manage events',
    category: 'Educators',
    intro: 'How to publish a batizado, roda, or workshop for the community to see.',
    mockup: 'event',
    steps: [
      {
        t: 'Create an event',
        d: 'Tap the floating "+" button on the Home screen → "New event". You can also go to the "Events" tab and tap "New Event" in the top corner.',
      },
      {
        t: 'Fill in the event details',
        d: 'The form includes: event name, category (batizado, roda, open roda, troca de corda, course, class, workshop, seminar, festival, meetup, intensive, or training session), date, start time, and end time.',
      },
      {
        t: 'Add a description and poster',
        d: 'Enter the description with all relevant details (price, requirements, what to bring, etc.). Upload a cover image (poster) from your gallery to give the event visibility.',
        tip: 'Events with a poster get higher visibility in members\' feeds. A vertical image with good resolution looks best.',
      },
      {
        t: 'Pin the location on the map',
        d: 'Enter the event address. The app opens the map picker where you can drag the marker to the exact location. Attendees will see the location and can open navigation directly from the event.',
      },
      {
        t: 'Manage co-organizers and attendees',
        d: 'After creating the event, you can add co-organizers in the edit menu → "Collaborators". Co-organizers can edit the event and see the full list of who marked "Going" or "Interested".',
      },
    ],
  },
  {
    id: 'reports-kpi',
    title: 'Reports & KPIs',
    category: 'Educators',
    intro: "How to review your school's metrics and export data for external analysis.",
    mockup: 'kpi',
    steps: [
      {
        t: 'Quick metrics strip',
        d: 'At the top of the school admin panel you will see a KPI strip: number of students, classes held this month, average attendance percentage, number of students paid, and number overdue.',
      },
      {
        t: 'The "Reports" tab',
        d: 'Go to the school panel → "Reports" tab. The subtitle reads "Attendance, payments and school statistics". This is where you generate the monthly report with all consolidated information.',
      },
      {
        t: 'Choose the report format',
        d: 'Select the format you need: "CSV" to open in Excel or Google Sheets for custom analysis, or "PDF" for a ready-to-share or print document.',
      },
      {
        t: 'Generate and export',
        d: 'Tap "Generate report". The app creates the file with a monthly summary: active students, sessions held, overall attendance percentage, and per-student payment status. You can share it directly from the export screen.',
        tip: 'Generate the report at the end of each month to maintain a historical record of your school\'s health.',
      },
    ],
  },
]

// ─── French ──────────────────────────────────────────────────────────────────

const SECTIONS_FR: Section[] = [
  {
    id: 'getting-started',
    title: `Premiers pas`,
    category: `Général`,
    intro: `Comment créer votre compte, compléter votre profil et rejoindre votre communauté.`,
    mockup: 'home',
    steps: [
      {
        t: `Installez l'app ou utilisez-la comme application web`,
        d: `Téléchargez-la sur Google Play sur Android, ou ouvrez agendacapoeiragem.com dans votre navigateur et ajoutez-la à votre écran d'accueil comme application web (PWA). Les deux options fonctionnent de la même manière.`,
        note: `La version native pour iPhone est en développement. En attendant, utilisez Safari sur iOS → « Sur l'écran d'accueil ».`,
      },
      {
        t: `Créez votre compte`,
        d: `À l'ouverture de l'app, vous verrez l'écran « Créer un compte — Rejoignez la communauté de la capoeira ». Renseignez votre prénom, votre nom, un surnom facultatif et votre e-mail. Vous pouvez aussi vous inscrire avec Google.`,
        tip: `Avant de continuer, l'app demandera votre rôle : « Pratiquant » ou « Éducateur ». Choisissez « Éducateur » si vous enseignez déjà la capoeira — cela débloque les outils de gestion dès le départ.`,
      },
      {
        t: `Complétez l'onboarding`,
        d: `Après l'inscription, l'écran d'onboarding vous guide pour ajouter une photo de profil et trouver votre groupe ou votre noyau. Vous pouvez sauter cette étape et la faire plus tard, mais vous relier dès le départ active toutes les fonctionnalités communautaires.`,
      },
      {
        t: `Reliez votre groupe`,
        d: `Sur l'écran d'accueil, vous verrez la carte « Aucun groupe assigné » avec un bouton « Trouver des groupes ». Cherchez votre groupe dans l'annuaire et envoyez une demande d'adhésion. Vous pouvez aussi demander à votre éducateur de vous ajouter directement depuis son panneau d'administration.`,
        warn: `Sans groupe relié, vous ne pouvez pas voir les événements de votre communauté ni l'historique des graduations. Les fonctions de présence et de paiement seront également indisponibles.`,
      },
    ],
  },
  {
    id: 'home-and-discovery',
    title: `Accueil et découverte`,
    category: `Général`,
    intro: `Comment naviguer sur l'écran principal et trouver rapidement ce dont vous avez besoin.`,
    mockup: 'home',
    steps: [
      {
        t: `L'écran d'accueil`,
        d: `L'onglet « Accueil » affiche un message de bienvenue personnalisé avec votre nom, la carte de votre groupe et la section « Événements à venir » avec les événements de votre communauté dans l'ordre chronologique. Un badge rouge sur l'onglet « Profil » indique des notifications en attente.`,
        tip: `Tirez vers le bas pour rafraîchir le fil à tout moment.`,
      },
      {
        t: `Filtrez les événements à venir`,
        d: `Dans la section « Événements à venir », vous trouverez des puces de filtre : « Cette semaine » et « Ce mois-ci ». Touchez-les pour affiner l'affichage.`,
      },
      {
        t: `Recherche globale`,
        d: `Touchez la barre de recherche sur l'écran d'accueil pour ouvrir la recherche globale. Tapez n'importe quel terme et vous verrez les résultats organisés en quatre sections : Événements, Groupes, Noyaux et Utilisateurs.`,
      },
      {
        t: `Le bouton « + » (Éducateurs)`,
        d: `Si vous êtes éducateur, vous verrez un bouton flottant « + » sur l'écran d'accueil. Touchez-le pour ouvrir un menu avec trois options : « Nouvel événement », « Créer un groupe » et « Créer un noyau ».`,
        note: `Le bouton « + » n'apparaît que si votre compte a le rôle Éducateur. Vérifiez votre rôle dans Profil → Réglages.`,
      },
      {
        t: `Carte mondiale des noyaux`,
        d: `Dans l'onglet « Groupes », vous trouverez une carte interactive avec tous les noyaux enregistrés dans le monde. Touchez un marqueur pour voir le nom du noyau, son groupe et ses horaires. Utile pour trouver un endroit où s'entraîner en voyage.`,
      },
    ],
  },
  {
    id: 'groups-and-community',
    title: `Groupes et communauté`,
    category: `Général`,
    intro: `Comment découvrir des groupes, en rejoindre un et explorer la hiérarchie de votre communauté.`,
    mockup: 'educator',
    steps: [
      {
        t: `Qu'est-ce qu'un groupe et qu'est-ce qu'un noyau ?`,
        d: `Un **groupe** est l'organisation de capoeira dans son ensemble (par ex. Abadá Capoeira, Cordão de Ouro). Un **noyau** est un lieu d'entraînement physique précis au sein de ce groupe — un groupe peut avoir de nombreux noyaux dans différentes villes ou pays. Vous appartenez à un groupe et vous vous entraînez dans un noyau. Les éducateurs créent des noyaux à l'intérieur de leur groupe.`,
        note: `Quand l'app dit « votre noyau », elle désigne le lieu précis où vous vous entraînez. Quand elle dit « votre groupe », elle désigne toute l'organisation.`,
      },
      {
        t: `Parcourir les groupes`,
        d: `L'onglet « Groupes » affiche tous les groupes publics de la plateforme. Utilisez la barre de recherche (« Rechercher un groupe... ») pour filtrer par nom, et les menus « Pays de présence » et « Style de capoeira » pour affiner la recherche.`,
      },
      {
        t: `Le profil d'un groupe`,
        d: `Touchez un groupe pour voir son profil complet organisé en onglets : « Résumé » (description et statistiques), « Événements » (événements à venir du groupe), « Hiérarchie » (arbre des éducateurs), « Noyaux » (liste des noyaux actifs) et « Graduations » (système de cordes).`,
      },
      {
        t: `Demander à rejoindre un groupe`,
        d: `Depuis le profil du groupe, touchez « Demander à rejoindre le groupe ». Votre demande affichera le badge « Demande en attente » jusqu'à ce que l'administrateur l'approuve. Vous recevrez une notification dans « Profil → Notifications » une fois acceptée.`,
        tip: `Si vous voulez dire à l'administrateur qui vous êtes, utilisez la « Demande guidée ». Elle vous permet d'envoyer un message avec votre demande.`,
      },
      {
        t: `Voir la hiérarchie du groupe`,
        d: `Dans l'onglet « Hiérarchie » du profil du groupe, vous trouverez l'arbre complet des éducateurs. Vous pouvez rechercher par nom dans la hiérarchie. Touchez un éducateur pour voir son profil public.`,
      },
      {
        t: `Voir le profil d'un membre`,
        d: `Touchez le nom d'un éducateur ou d'un membre pour voir son profil : nom, surnom, groupe, corde actuelle et noyaux où il enseigne ou s'entraîne. L'historique de graduations est aussi visible publiquement.`,
      },
    ],
  },
  {
    id: 'events',
    title: `Événements`,
    category: `Général`,
    intro: `Comment découvrir, filtrer et confirmer votre intérêt pour les batizados, rodas et plus encore.`,
    mockup: 'event',
    steps: [
      {
        t: `Explorer le calendrier des événements`,
        d: `L'onglet « Événements » affiche un calendrier interactif en haut et la liste des événements en dessous. Touchez une date pour voir les événements de ce jour. Vous pouvez basculer entre la vue calendrier et la vue liste avec le bouton dans le coin.`,
      },
      {
        t: `Filtrer par catégorie et plus`,
        d: `Touchez « Filtres » pour ouvrir les options avancées : Catégorie (batizado, roda, roda ouverte, troca de corda, cours, classe, atelier, séminaire, festival, rencontre, intensif, entraînement), Prix (gratuit ou payant), Format (en présentiel ou en ligne), Dates, Groupe et Lieu.`,
        tip: `Vous pouvez combiner plusieurs filtres à la fois. Un indicateur « Filtres actifs » apparaît à côté du bouton lorsque des filtres sont appliqués.`,
      },
      {
        t: `Détail de l'événement`,
        d: `Touchez un événement pour voir la description complète, la date et l'heure, l'emplacement sur la carte, le type d'événement, les organisateurs et l'affiche s'il y en a une. Vous verrez aussi combien de personnes y vont (« J'y vais ») et combien ont marqué leur intérêt (« Intéressé »).`,
      },
      {
        t: `Confirmer « J'y vais » ou « Intéressé »`,
        d: `Depuis le détail de l'événement, touchez « Intéressé » pour l'enregistrer dans votre liste, ou « J'y vais » pour confirmer votre présence. Les organisateurs peuvent voir le total des deux.`,
        tip: `Les événements que vous avez marqués « J'y vais » apparaissent en surbrillance sur votre écran d'accueil dans la section « Événements à venir ».`,
      },
      {
        t: `Partager un événement`,
        d: `Utilisez le bouton de partage dans le détail de l'événement pour l'envoyer via WhatsApp, Instagram ou d'autres apps. Le nom de l'événement, la date et un lien direct sont partagés.`,
      },
    ],
  },
  {
    id: 'your-profile',
    title: `Votre profil`,
    category: `Général`,
    intro: `Comment gérer votre identité, vos notifications et accéder aux réglages.`,
    steps: [
      {
        t: `Les trois onglets du profil`,
        d: `L'onglet « Profil » comporte trois sections internes : « Résumé » (vos événements à venir et votre bio), « Notifications » (demandes en attente de groupe, noyau ou éducateur) et « Gestion » (si éducateur, accès à vos noyaux ; si élève, les noyaux où vous vous entraînez).`,
      },
      {
        t: `Modifier votre profil`,
        d: `Touchez l'icône de modification (crayon) sur votre photo de profil ou votre nom pour ouvrir le formulaire d'édition. Vous pouvez changer votre photo, votre prénom, votre nom et votre surnom. Enregistrez en touchant « Enregistrer ».`,
        tip: `Les photos sont importées depuis votre appareil photo ou votre galerie. Une image carrée rend le mieux dans la photo de profil circulaire.`,
      },
      {
        t: `Votre corde et vos graduations`,
        d: `Votre corde actuelle apparaît avec sa couleur et son nom sous votre nom dans le profil. Si vous avez plus d'une graduation enregistrée, touchez votre corde pour voir l'historique complet avec la date de chaque changement de niveau.`,
      },
      {
        t: `Réglages : langue et thème`,
        d: `Depuis « Profil », touchez « Réglages ». Vous pouvez y changer la langue (français, anglais, espagnol, portugais) dans la section « Langue », et le thème visuel (clair ou sombre) dans « Mode de l'app ». Les changements s'appliquent immédiatement.`,
      },
      {
        t: `Notifications en attente`,
        d: `Dans l'onglet « Notifications » de votre profil, vous verrez cinq types de demandes : « Demande d'adhésion au groupe » (quelqu'un veut rejoindre votre groupe), « Demande d'éducateur » (demande de relation éducateur-élève), « Demande d'adhésion au noyau » (quelqu'un veut rejoindre votre noyau), « Demande de transfert de noyau » (transfert d'administration en attente) et « Demande de collaboration » (invitation à co-organiser un événement). Le badge rouge sur l'onglet « Profil » indique combien vous en avez de non lues.`,
      },
      {
        t: `Signaler un problème`,
        d: `Allez dans « Profil » → « Réglages » → « Signaler un problème ». Votre signalement est envoyé directement à l'équipe de développement avec les informations techniques de l'appareil jointes automatiquement.`,
      },
    ],
  },
  {
    id: 'premium',
    title: `Forfait Premium`,
    category: `Général`,
    intro: `Ce qu'inclut le forfait gratuit, ce que débloque Premium et comment s'abonner.`,
    steps: [
      {
        t: `Limites du forfait gratuit`,
        d: `Avec un compte gratuit, les éducateurs peuvent créer jusqu'à 10 événements par mois et les élèves peuvent confirmer leur présence à 1 roda par mois. La gestion du noyau, la présence et les paiements sont disponibles sans limite pour les deux rôles.`,
        note: `Les élèves au forfait gratuit voient des publicités dans l'app.`,
      },
      {
        t: `Ce qu'inclut Premium`,
        d: `Premium débloque des événements illimités pour les éducateurs, jusqu'à 5 rodas par mois pour les élèves, un support prioritaire et une expérience sans publicité.`,
        tip: `Le forfait annuel est marqué du badge « MEILLEUR PRIX » et est nettement moins cher que de payer mois après mois.`,
      },
      {
        t: `Comment s'abonner`,
        d: `Allez dans « Profil » → « Abonnement » ou touchez la bannière Premium qui apparaît lorsque vous atteignez une limite. Choisissez le forfait mensuel ou annuel et confirmez le paiement avec votre compte Google Play ou App Store.`,
        note: `Les paiements sont traités de façon sécurisée via Google Play / App Store. Agenda Capoeiragem ne stocke pas les données de carte.`,
      },
      {
        t: `Restaurer les achats`,
        d: `Si vous changez d'appareil ou réinstallez l'app, allez dans « Profil » → « Abonnement » → « Restaurer les achats » pour récupérer votre forfait actif sans payer à nouveau.`,
        tip: `Utilisez le même compte Google ou Apple que celui utilisé pour acheter le forfait.`,
      },
    ],
  },
  {
    id: 'join-a-school',
    title: `Rejoindre un noyau`,
    category: `Pratiquants`,
    intro: `Comment trouver un noyau à proximité, envoyer une demande et ce qui se passe ensuite.`,
    steps: [
      {
        t: `Trouver un noyau sur la carte`,
        d: `Allez dans l'onglet « Groupes » et utilisez la carte interactive pour explorer les noyaux près de chez vous. Touchez un marqueur pour voir le nom, le groupe, les horaires et l'option de voir le profil complet.`,
      },
      {
        t: `Demander à rejoindre avec la « Demande guidée »`,
        d: `Depuis le profil du noyau, touchez « Demande d'adhésion guidée ». Vous pouvez inclure un message pour vous présenter à l'éducateur. Votre demande apparaîtra dans la section « Demandes » du panneau du noyau.`,
        tip: `Si vous vous entraînez déjà avec un éducateur qui utilise Agenda Capoeiragem, demandez-lui de vous ajouter directement depuis son panneau pour sauter le processus de demande.`,
      },
      {
        t: `Attendre l'approbation`,
        d: `Votre demande reste « En attente » jusqu'à ce que l'éducateur l'approuve ou la rejette. Vous recevrez une notification dans « Profil → Notifications » lorsqu'il y aura une réponse.`,
        warn: `Seul l'éducateur peut approuver les demandes. Si vous ne recevez pas de réponse au bout de quelques jours, essayez de contacter l'éducateur par un autre canal.`,
      },
      {
        t: `Accéder à vos cours et à votre suivi`,
        d: `Une fois approuvé, le noyau apparaît dans « Profil » → onglet « Gestion ». Vous y verrez votre historique de présence mois par mois et votre statut de paiement si le noyau gère les cotisations.`,
      },
    ],
  },
  {
    id: 'your-history',
    title: `Votre historique personnel`,
    category: `Pratiquants`,
    intro: `Comment consulter votre présence mensuelle, vos graduations et les événements auxquels vous avez assisté.`,
    steps: [
      {
        t: `Présence de ce mois`,
        d: `Allez dans « Profil » → onglet « Gestion » → votre noyau. Vous verrez votre pourcentage de présence pour le mois en cours et la liste des cours avec un indicateur présent ou absent pour chacun.`,
      },
      {
        t: `Historique de graduations`,
        d: `Depuis votre profil, touchez votre corde actuelle pour déployer l'historique complet avec la date de chaque changement de niveau. L'enregistrement est permanent et visible publiquement sur votre profil.`,
      },
      {
        t: `Statut de paiement`,
        d: `Si votre noyau gère les paiements, dans l'onglet « Gestion » vous verrez votre statut de paiement du mois : « En attente », « Payé » ou « En retard ». Seul l'éducateur peut enregistrer vos paiements.`,
        note: `Votre statut de paiement n'est visible que par vous et votre éducateur. Ce n'est pas une information publique.`,
      },
      {
        t: `Événements confirmés`,
        d: `Dans l'onglet « Résumé » de votre profil, vous verrez les événements à venir auxquels vous avez confirmé « J'y vais ». Vous pouvez voir le détail de chacun en touchant le nom de l'événement directement depuis votre profil.`,
      },
    ],
  },
  {
    id: 'create-group',
    title: `Créer votre groupe`,
    category: `Éducateurs`,
    intro: `Comment enregistrer votre groupe de capoeira sur la plateforme et configurer ses informations.`,
    steps: [
      {
        t: `Accéder au formulaire de création`,
        d: `Touchez le bouton flottant « + » sur l'écran d'accueil → « Créer un groupe ». Vous pouvez aussi aller dans l'onglet « Groupes » et toucher « Créer un groupe » dans le coin supérieur.`,
        note: `Seuls les utilisateurs ayant le rôle Éducateur peuvent créer des groupes. Vérifiez votre rôle dans « Profil → Réglages ».`,
      },
      {
        t: `Nom et description`,
        d: `Saisissez le nom officiel de votre groupe et une description. Les deux sont obligatoires. Le nom apparaîtra dans l'annuaire mondial, sur les profils des membres et sur tous les événements que vous organisez.`,
      },
      {
        t: `Style de capoeira (obligatoire)`,
        d: `Dans le champ « Style de capoeira * », tapez le style que vous pratiquez (par ex. Mixte, Benguela, Angola, Regional). C'est un champ de texte libre et il est obligatoire. Ce texte sert de nom à votre système de graduation et définit l'intitulé de vos cordes.`,
        tip: `Le champ « Ville » est facultatif — vous pouvez le remplir maintenant ou plus tard depuis « Modifier le groupe ».`,
      },
      {
        t: `Logo du groupe (facultatif)`,
        d: `Importez le logo de votre groupe depuis votre galerie. Il apparaîtra sur le profil du groupe, dans les noyaux et sur la carte du groupe que vos élèves voient sur l'écran d'accueil.`,
      },
      {
        t: `Créer le groupe`,
        d: `Touchez « Créer ». Si le nom n'est pas un doublon, le groupe est créé immédiatement. L'app vous demandera si vous voulez configurer le système de graduation maintenant ou plus tard.`,
      },
      {
        t: `Inviter des membres`,
        d: `Après avoir créé le groupe, partagez son nom avec vos élèves. Ils le recherchent dans l'onglet « Groupes » → annuaire et demandent à le rejoindre. Vous pouvez aussi les ajouter directement depuis le panneau d'administration de votre noyau, ou ils peuvent se relier lors de leur propre onboarding.`,
        tip: `Il n'y a pas de code d'invitation : le flux standard, c'est que les élèves vous trouvent dans l'annuaire, ou que vous les ajoutiez depuis le panneau du noyau.`,
      },
    ],
  },
  {
    id: 'manage-group',
    title: `Gérer votre groupe`,
    category: `Éducateurs`,
    intro: `Comment gérer les membres, les rôles d'administration et les informations du groupe.`,
    steps: [
      {
        t: `Panneau d'administration du groupe`,
        d: `Allez sur le profil de votre groupe et touchez le bouton d'administration (visible uniquement par les administrateurs et co-administrateurs). Vous accéderez aux options de gestion des membres, des rôles et de la configuration du groupe.`,
        note: `En tant que créateur du groupe, vous êtes l'administrateur principal. Vous seul pouvez transférer l'administration complète à une autre personne.`,
      },
      {
        t: `Approuver ou rejeter les demandes d'adhésion`,
        d: `Dans « Demandes » du panneau du groupe, vous verrez les demandes en attente avec le nom du demandeur et son message s'il a utilisé la demande guidée. Touchez « Approuver » ou « Rejeter » pour répondre à chacune.`,
      },
      {
        t: `Attribuer des rôles : admin et co-admin`,
        d: `Depuis le profil d'un membre dans le panneau du groupe, vous pouvez lui attribuer le rôle « Co-admin » (accès au panneau) ou le promouvoir « Admin ». Vous pouvez aussi utiliser l'option « Quitter le rôle d'admin » pour retirer le rôle.`,
        warn: `« Transférer l'administration » confie le contrôle total du groupe à un autre utilisateur. Cette action est irréversible : vous perdrez le rôle d'administrateur principal.`,
      },
      {
        t: `Modifier les informations du groupe`,
        d: `Allez sur le profil du groupe → icône de modification. Vous pouvez changer le nom, la description, le logo, le style de capoeira et la ville. Les changements s'appliquent immédiatement et se reflètent dans l'annuaire public.`,
      },
      {
        t: `Retirer un membre`,
        d: `Depuis la liste des membres dans le panneau, touchez le nom d'un membre et choisissez « Retirer du groupe ». Le membre perd l'accès au contenu du groupe mais conserve son historique de graduations.`,
        warn: `Retirer un membre est réversible : il peut redemander à rejoindre le groupe.`,
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: `Supervision pédagogique`,
    category: `Éducateurs`,
    intro: `Comment assigner un éducateur superviseur pour les élèves de votre noyau et comment fonctionne la hiérarchie.`,
    steps: [
      {
        t: `Ce qu'est la supervision pédagogique`,
        d: `La supervision pédagogique est la relation hiérarchique entre éducateurs d'un même groupe. Un éducateur plus expérimenté peut suivre la progression des élèves d'un autre éducateur, ce qui est particulièrement utile lorsqu'ils sont dans des villes ou des pays différents.`,
        note: `L'écran de supervision s'appelle « SUPERVISION PÉDAGOGIQUE » à l'intérieur du panneau du noyau.`,
      },
      {
        t: `Supervision automatique (même noyau)`,
        d: `Si le superviseur et les élèves partagent le même noyau, la supervision est automatique. L'app affichera le badge « Même noyau » sur le profil de l'élève dans le panneau du superviseur.`,
      },
      {
        t: `Supervision manuelle (hors du noyau)`,
        d: `Si le superviseur est dans un noyau différent, vous pouvez l'assigner manuellement. Sur l'écran de supervision, touchez « Sélectionner un éducateur superviseur » et cherchez par nom. Les élèves supervisés afficheront le badge « Hors de votre noyau ».`,
        tip: `Seuls les éducateurs du même groupe peuvent être assignés comme superviseurs. Il n'est pas possible de superviser des élèves de groupes différents.`,
      },
      {
        t: `Voir l'arbre de supervision`,
        d: `L'arbre de supervision est visible dans l'onglet « Hiérarchie » du profil du groupe. Il montre les relations entre éducateurs et quels élèves sont sous la supervision de chacun — l'arbre « du mestre à l'apprenti » de votre groupe.`,
      },
    ],
  },
  {
    id: 'school-setup',
    title: `Créer votre noyau`,
    category: `Éducateurs`,
    intro: `Comment créer votre noyau, le placer sur la carte et configurer les horaires d'entraînement.`,
    mockup: 'map',
    steps: [
      {
        t: `Accéder au formulaire de création`,
        d: `Touchez le bouton flottant « + » sur l'écran d'accueil → « Créer un noyau ». Vous pouvez aussi aller dans l'onglet « Groupes » → profil de votre groupe → onglet « Noyaux » → bouton « Créer un noyau ».`,
        note: `Vous devez être administrateur ou co-administrateur d'un groupe pour créer un noyau. Si vous venez de créer votre groupe, vous avez déjà ce rôle automatiquement.`,
      },
      {
        t: `Renseigner le nom et l'emplacement`,
        d: `Complétez les champs obligatoires : « Nom du noyau » (par ex. Noyau Centre-ville), « Emplacement » (adresse complète de votre lieu d'entraînement), « Pays » et « Ville ».`,
        tip: `Après avoir saisi l'adresse, touchez la carte pour ouvrir le sélecteur d'emplacement et faites glisser le marqueur à l'endroit exact. C'est ce qui apparaît dans l'annuaire mondial.`,
      },
      {
        t: `Ajouter des horaires d'entraînement`,
        d: `Dans la section « Horaires d'entraînement », touchez « Ajouter un horaire ». Sélectionnez le jour de la semaine, l'heure de début et l'heure de fin. Ajoutez autant d'horaires que nécessaire. Au moins un horaire est requis pour créer le noyau.`,
        tip: `Chaque horaire peut être relié à une turma (groupe de classe). Si vous entraînez différents niveaux à des horaires différents, ajoutez-les séparément.`,
      },
      {
        t: `Créer le noyau`,
        d: `Touchez « Créer le noyau ». Si tous les champs sont complets, le noyau est créé et apparaîtra sur la carte mondiale et dans l'annuaire. Vous serez redirigé automatiquement vers le panneau d'administration du noyau.`,
      },
      {
        t: `Modifier ou désactiver`,
        d: `Pour modifier le nom, l'adresse ou les horaires, allez sur le profil du noyau → icône de modification. Si vous cessez de vous entraîner à cet endroit, vous pouvez désactiver le noyau pour qu'il n'apparaisse plus dans l'annuaire sans perdre l'historique.`,
      },
    ],
  },
  {
    id: 'co-educators',
    title: `Co-éducateurs`,
    category: `Éducateurs`,
    intro: `Comment ajouter des co-éducateurs à votre noyau et gérer leurs autorisations.`,
    steps: [
      {
        t: `Ce qu'est un co-éducateur`,
        d: `Un co-éducateur est un éducateur du même groupe qui aide à gérer votre noyau. Il a accès au panneau d'administration : il peut enregistrer des cours, marquer la présence et enregistrer des paiements, mais ne peut pas modifier la configuration du noyau ni transférer l'administration.`,
      },
      {
        t: `Ajouter un co-éducateur`,
        d: `Allez sur le profil de votre noyau → section « Co-éducateurs » → touchez « Ajouter un co-éducateur ». Cherchez l'éducateur par nom (il doit être membre du même groupe avec le rôle Éducateur). Touchez son nom et confirmez.`,
        note: `Seuls les utilisateurs ayant le rôle Éducateur au sein du même groupe peuvent être co-éducateurs.`,
      },
      {
        t: `Retirer un co-éducateur`,
        d: `Dans la section « Co-éducateurs » du profil du noyau, touchez le nom du co-éducateur et choisissez « Retirer le co-éducateur ». L'action est immédiate et l'éducateur perd l'accès au panneau du noyau.`,
        warn: `Retirer un co-éducateur ne supprime aucune donnée. Tout l'historique de cours et de paiements qu'il a enregistré reste dans le système.`,
      },
      {
        t: `Quitter le rôle de co-éducateur`,
        d: `Si vous êtes co-éducateur dans un noyau et ne souhaitez plus l'être, allez sur le profil du noyau → section « Co-éducateurs » → « Quitter le rôle de co-éducateur ». Vous pouvez aussi le faire depuis « Profil → Gestion → [nom du noyau] » → « Quitter le rôle ».`,
      },
      {
        t: `Transférer l'administration du noyau`,
        d: `Pour confier le contrôle total du noyau à un autre éducateur, allez sur le profil du noyau → « Transférer l'administration ». Le destinataire doit être un co-éducateur actif du noyau.`,
        warn: `« Transférer l'administration » est irréversible : vous confiez le contrôle total à l'autre personne. Le nouvel administrateur pourra modifier tous les réglages du noyau.`,
      },
    ],
  },
  {
    id: 'school-requests',
    title: `Demandes d'adhésion au noyau`,
    category: `Éducateurs`,
    intro: `Comment gérer les demandes d'adhésion à votre noyau depuis le panneau d'administration.`,
    steps: [
      {
        t: `Voir les demandes en attente`,
        d: `Allez sur le profil de votre noyau → bouton « Gérer » → onglet « Demandes ». Vous verrez toutes les demandes d'adhésion en attente. Chaque carte affiche le nom du demandeur, sa photo, la date et le message envoyé (s'il a utilisé la demande guidée).`,
      },
      {
        t: `Approuver une demande`,
        d: `Touchez « Approuver » sur la carte du demandeur. L'élève recevra une notification d'acceptation et commencera à apparaître dans votre liste d'élèves. Vous pouvez l'assigner à une turma immédiatement depuis l'onglet « Élèves ».`,
      },
      {
        t: `Rejeter une demande`,
        d: `Touchez « Rejeter » sur la carte du demandeur. L'élève recevra une notification indiquant que sa demande n'a pas été approuvée.`,
        tip: `Si vous rejetez quelqu'un par erreur, l'élève peut envoyer une nouvelle demande.`,
      },
      {
        t: `Historique des demandes traitées`,
        d: `Sous les demandes en attente, vous trouverez l'historique des demandes déjà traitées : approuvées (badge « Acceptée ») et rejetées (badge « Rejetée »). Les demandes traitées restent dans l'historique et ne peuvent pas être supprimées.`,
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: `Élèves et turmas`,
    category: `Éducateurs`,
    intro: `Comment voir vos élèves, ajouter des membres sans compte et les organiser par turma.`,
    mockup: 'attendance',
    steps: [
      {
        t: `Le panneau d'administration du noyau`,
        d: `Accédez-y depuis « Profil » → onglet « Gestion » → votre noyau, ou depuis le profil du noyau en touchant le bouton d'administration. Vous trouverez quatre onglets : « Élèves », « Présence », « Paiements » et « Rapports ».`,
      },
      {
        t: `Voir la liste des élèves`,
        d: `Dans l'onglet « Élèves », vous verrez tous les membres reliés à votre noyau avec leur nom, leur corde actuelle et leur pourcentage de présence mensuel. S'il n'y a pas de membres, l'app affiche « Aucun membre ».`,
      },
      {
        t: `Ajouter un élève sans compte (membre fantôme)`,
        d: `Faites défiler vers le bas dans l'onglet « Élèves » jusqu'à la section « Élèves sans compte ». Touchez « Ajouter un élève » pour enregistrer manuellement un élève qui n'utilise pas l'app. Saisissez son nom et ses informations de base.`,
        note: `Les membres fantômes peuvent recevoir des graduations et avoir des enregistrements de présence et de paiement, mais ne peuvent pas se connecter à l'app. Lorsqu'ils s'inscrivent, vous pouvez relier leur profil pour préserver tout l'historique.`,
      },
      {
        t: `Créer et gérer des turmas`,
        d: `Accédez à la gestion du noyau (icône d'engrenage ou bouton « Gérer »). Vous pouvez y créer des turmas — des ensembles d'élèves organisés par horaire. Créez-en une par créneau (par ex. « Lun & Mer 19h ») et assignez des élèves à chacune.`,
        tip: `Organiser les élèves en turmas rend la prise de présence bien plus rapide : l'écran de présence n'affiche que les élèves du créneau sélectionné.`,
      },
      {
        t: `Voir le profil d'un élève`,
        d: `Touchez le nom d'un élève pour voir son profil : nom, corde, pourcentage de présence du mois en cours, historique de présence mois par mois et historique de paiements.`,
      },
    ],
  },
  {
    id: 'attendance',
    title: `Suivi de présence`,
    category: `Éducateurs`,
    intro: `Comment enregistrer le cours du jour, marquer présents et absents, et consulter l'historique.`,
    mockup: 'attendance',
    steps: [
      {
        t: `Enregistrer le cours du jour`,
        d: `Dans le panneau d'administration du noyau → onglet « Présence », vous verrez « Aucun cours ce mois-ci pour l'instant » s'il s'agit du premier. Touchez « Enregistrer le cours du jour » pour ouvrir le formulaire de session.`,
      },
      {
        t: `Sélectionner l'horaire et la turma`,
        d: `Dans le formulaire de session, sélectionnez l'horaire du jour (l'un de ceux configurés lors de la création du noyau) et la turma correspondante. L'app chargera automatiquement les élèves de cette turma.`,
        tip: `Si vous n'avez pas de turma configurée, la liste affichera tous les élèves du noyau.`,
      },
      {
        t: `Marquer présents et absents`,
        d: `Touchez le nom de chaque élève pour basculer entre présent (✓ vert) et absent. La liste affiche d'abord les élèves de la turma sélectionnée, puis le reste du noyau, pour que les turmas ne se mélangent pas.`,
      },
      {
        t: `Enregistrer le cours`,
        d: `Touchez « Enregistrer le cours ». L'app affiche une boîte de confirmation avec le nombre de présents et d'absents. Touchez « Confirmer » pour enregistrer la session dans le cloud. Le pourcentage de présence de chaque élève se met à jour automatiquement.`,
      },
      {
        t: `Consulter les sessions précédentes`,
        d: `Dans l'onglet « Présence », les sessions apparaissent dans l'ordre chronologique. Touchez une session passée pour voir le détail complet : qui était présent, qui était absent, et la date et l'heure de l'enregistrement.`,
      },
    ],
  },
  {
    id: 'payments',
    title: `Paiements et trésorerie`,
    category: `Éducateurs`,
    intro: `Comment enregistrer les mensualités, suivre qui doit, et exporter des rapports.`,
    mockup: 'finances',
    steps: [
      {
        t: `L'onglet « Paiements »`,
        d: `Dans le panneau d'administration du noyau, allez dans l'onglet « Paiements ». Chaque élève apparaît avec son statut de paiement du mois en cours : « En attente », « Payé », « Payé (en retard) », « En retard » ou « Gratuit ». Les statuts sont calculés automatiquement selon la date.`,
        warn: `Si le mois a commencé et qu'un élève n'a aucun paiement enregistré, son statut passe automatiquement à « En attente » puis à « En retard » après la date d'échéance configurée.`,
      },
      {
        t: `Enregistrer le paiement d'un élève`,
        d: `Touchez le nom de l'élève dans l'onglet « Paiements » puis touchez « Enregistrer un paiement ». Saisissez le montant et sélectionnez le mois correspondant. Le statut de l'élève passe immédiatement à « Payé ».`,
        tip: `Vous pouvez enregistrer des paiements anticipés pour les élèves qui paient à l'avance. Sélectionnez simplement le mois futur correspondant.`,
      },
      {
        t: `Voir qui a des paiements en attente ou en retard`,
        d: `Dans la liste de l'onglet « Paiements », vous pouvez voir les statuts de tous les élèves d'un coup d'œil. Les statuts « En attente » et « En retard » sont mis en évidence. Vous verrez aussi le jour d'échéance de paiement configuré.`,
      },
      {
        t: `Générer et exporter le rapport mensuel`,
        d: `Allez dans l'onglet « Rapports » du panneau du noyau. Sélectionnez le format (CSV pour Excel ou Google Sheets, ou PDF à imprimer ou partager) et touchez « Générer le rapport ».`,
        tip: `Le CSV est idéal pour l'analyse en tableur. Le PDF est utile pour le partage avec l'administration du groupe ou pour l'archivage.`,
      },
    ],
  },
  {
    id: 'graduations',
    title: `Système de graduation`,
    category: `Éducateurs`,
    intro: `Comment configurer les cordes de votre groupe et enregistrer les changements de niveau.`,
    mockup: 'graduation',
    steps: [
      {
        t: `Accéder au système de graduation`,
        d: `Allez sur le profil de votre groupe → onglet « Graduations ». Si aucun niveau n'est encore configuré, vous verrez « Aucun niveau de graduation défini » et un bouton « Configurer le système maintenant ».`,
      },
      {
        t: `Créer un niveau de corde`,
        d: `Touchez « Ajouter un niveau » ou « Créer un niveau ». Saisissez le nom de la corde (par ex. « Corde vert-jaune »), sélectionnez les couleurs qui la composent et indiquez si elle a des pointes peintes et combien. Enregistrez le niveau.`,
        tip: `La couleur visuelle de chaque niveau apparaît sur les profils des élèves et dans l'annuaire public. Configurez-la fidèlement pour correspondre à la vraie corde.`,
      },
      {
        t: `Organiser par catégorie`,
        d: `Les niveaux sont organisés automatiquement en sections : « Système adulte », « Système jeune », « Système enfant », « Instructeurs stagiaires » et « Niveaux spéciaux ». Attribuez la bonne catégorie à la création ou à la modification de chaque niveau.`,
      },
      {
        t: `Définir le niveau d'éducateur`,
        d: `Vous pouvez indiquer à partir de quelle corde un élève est considéré comme « éducateur » dans le groupe. Cela détermine qui a accès à la création de noyaux et aux outils de gestion.`,
      },
      {
        t: `Attribuer une graduation`,
        d: `Sur le profil du groupe → « Graduations » → « Attribuer une graduation ». Trouvez l'élève, sélectionnez le nouveau niveau et la date. Le changement est enregistré de façon permanente dans l'historique de l'élève et la nouvelle corde apparaît immédiatement sur son profil.`,
        tip: `Vous pouvez attribuer des graduations en masse pour un batizado : sélectionnez plusieurs élèves à la fois, choisissez le niveau et la date, et tout le monde est gradué en une seule étape.`,
      },
      {
        t: `Voir l'historique de graduations d'un élève`,
        d: `Touchez le nom d'un membre du groupe. Son profil affiche la corde actuelle avec sa couleur. Touchez la corde pour voir l'historique complet : chaque changement de niveau avec sa date. L'historique ne peut pas être supprimé.`,
      },
    ],
  },
  {
    id: 'manage-events',
    title: `Créer et gérer des événements`,
    category: `Éducateurs`,
    intro: `Comment publier un batizado, une roda ou un atelier pour que la communauté le voie.`,
    mockup: 'event',
    steps: [
      {
        t: `Créer un événement`,
        d: `Touchez le bouton flottant « + » sur l'écran d'accueil → « Nouvel événement ». Vous pouvez aussi aller dans l'onglet « Événements » et toucher « Nouvel événement » dans le coin supérieur.`,
      },
      {
        t: `Renseigner les détails de l'événement`,
        d: `Le formulaire comprend : nom de l'événement, catégorie (batizado, roda, roda ouverte, troca de corda, cours, classe, atelier, séminaire, festival, rencontre, intensif ou séance d'entraînement), date, heure de début et heure de fin.`,
      },
      {
        t: `Ajouter une description et une affiche`,
        d: `Saisissez la description avec tous les détails pertinents (prix, prérequis, ce qu'il faut apporter, etc.). Importez une image de couverture (affiche) depuis votre galerie pour donner de la visibilité à l'événement.`,
        tip: `Les événements avec une affiche obtiennent une meilleure visibilité dans les fils des membres. Une image verticale en bonne résolution rend le mieux.`,
      },
      {
        t: `Épingler l'emplacement sur la carte`,
        d: `Saisissez l'adresse de l'événement. L'app ouvre le sélecteur de carte où vous pouvez faire glisser le marqueur à l'emplacement exact. Les participants verront l'emplacement et pourront ouvrir la navigation directement depuis l'événement.`,
      },
      {
        t: `Gérer les co-organisateurs et les participants`,
        d: `Après avoir créé l'événement, vous pouvez ajouter des co-organisateurs dans le menu de modification → « Collaborateurs ». Les co-organisateurs peuvent modifier l'événement et voir la liste complète de qui a marqué « J'y vais » ou « Intéressé ».`,
      },
    ],
  },
  {
    id: 'reports-kpi',
    title: `Rapports et KPI`,
    category: `Éducateurs`,
    intro: `Comment consulter les métriques de votre noyau et exporter les données pour une analyse externe.`,
    mockup: 'kpi',
    steps: [
      {
        t: `Bandeau de métriques rapides`,
        d: `En haut du panneau d'administration du noyau, vous verrez un bandeau de KPI : nombre d'élèves, cours donnés ce mois-ci, pourcentage de présence moyen, nombre d'élèves ayant payé et nombre en retard.`,
      },
      {
        t: `L'onglet « Rapports »`,
        d: `Allez dans le panneau du noyau → onglet « Rapports ». Le sous-titre indique « Présence, paiements et statistiques du noyau ». C'est ici que vous générez le rapport mensuel avec toutes les informations consolidées.`,
      },
      {
        t: `Choisir le format du rapport`,
        d: `Sélectionnez le format dont vous avez besoin : « CSV » pour ouvrir dans Excel ou Google Sheets et faire une analyse personnalisée, ou « PDF » pour un document prêt à partager ou à imprimer.`,
      },
      {
        t: `Générer et exporter`,
        d: `Touchez « Générer le rapport ». L'app crée le fichier avec un résumé mensuel : élèves actifs, sessions données, pourcentage de présence global et statut de paiement par élève. Vous pouvez le partager directement depuis l'écran d'exportation.`,
        tip: `Générez le rapport à la fin de chaque mois pour conserver un historique de la santé de votre noyau.`,
      },
    ],
  },
]

// ─── German ──────────────────────────────────────────────────────────────────

const SECTIONS_DE: Section[] = [
  {
    id: 'getting-started',
    title: 'Erste Schritte',
    category: 'Allgemein',
    intro: 'Wie du dein Konto erstellst, dein Profil vervollständigst und deiner Community beitrittst.',
    mockup: 'home',
    steps: [
      {
        t: 'Installiere die App oder nutze sie als Web-App',
        d: 'Lade sie bei Google Play für Android herunter, oder öffne agendacapoeiragem.com in deinem Browser und füge sie als Web-App (PWA) zum Startbildschirm hinzu. Beide Optionen funktionieren gleich.',
        note: 'Die native iPhone-Version ist in Entwicklung. Nutze in der Zwischenzeit Safari auf iOS → „Zum Home-Bildschirm hinzufügen".',
      },
      {
        t: 'Erstelle dein Konto',
        d: 'Wenn du die App öffnest, siehst du den Bildschirm „Konto erstellen — Tritt der Capoeira-Community bei". Gib deinen Vornamen, Nachnamen, optional einen Spitznamen und deine E-Mail ein. Du kannst dich auch mit Google registrieren.',
        tip: 'Bevor du fortfährst, fragt die App nach deiner Rolle: „Praktizierende/r" oder „Lehrer". Wähle „Lehrer", wenn du bereits Capoeira unterrichtest — das schaltet von Anfang an die Verwaltungstools frei.',
      },
      {
        t: 'Schließe das Onboarding ab',
        d: 'Nach der Registrierung führt dich der Onboarding-Bildschirm durch das Hinzufügen eines Profilfotos und das Finden deiner Gruppe oder Schule. Du kannst diesen Schritt überspringen und später erledigen, aber eine Verknüpfung von Anfang an aktiviert alle Community-Funktionen.',
      },
      {
        t: 'Verknüpfe deine Gruppe',
        d: 'Auf dem Home-Bildschirm siehst du die Karte „Keine Gruppe zugewiesen" mit einer Schaltfläche „Gruppen finden". Suche deine Gruppe im Verzeichnis und sende eine Beitrittsanfrage. Du kannst auch deinen Lehrer bitten, dich direkt aus dem Verwaltungsbereich seiner Schule hinzuzufügen.',
        warn: 'Ohne verknüpfte Gruppe kannst du die Events oder die Graduierungshistorie deiner Community nicht sehen. Auch Anwesenheits- und Zahlungsfunktionen sind dann nicht verfügbar.',
      },
    ],
  },
  {
    id: 'home-and-discovery',
    title: 'Start & Entdecken',
    category: 'Allgemein',
    intro: 'Wie du den Hauptbildschirm navigierst und schnell findest, was du brauchst.',
    mockup: 'home',
    steps: [
      {
        t: 'Der Home-Bildschirm',
        d: 'Der Tab „Home" zeigt eine personalisierte Begrüßung mit deinem Namen, deine Gruppenkarte und den Bereich „Anstehende Events" mit den Events deiner Community in chronologischer Reihenfolge. Ein rotes Abzeichen am Tab „Profil" zeigt ausstehende Benachrichtigungen an.',
        tip: 'Ziehe nach unten, um den Feed jederzeit zu aktualisieren.',
      },
      {
        t: 'Anstehende Events filtern',
        d: 'Im Bereich „Anstehende Events" findest du Filter-Chips: „Diese Woche" und „Diesen Monat". Tippe darauf, um die Ansicht einzugrenzen.',
      },
      {
        t: 'Globale Suche',
        d: 'Tippe auf die Suchleiste auf dem Home-Bildschirm, um die globale Suche zu öffnen. Gib einen beliebigen Begriff ein und du siehst Ergebnisse in vier Bereichen: Events, Gruppen, Schulen und Nutzer.',
      },
      {
        t: 'Der „+"-Button (Lehrer)',
        d: 'Wenn du Lehrer bist, siehst du auf dem Home-Bildschirm einen schwebenden „+"-Button. Tippe darauf, um ein Menü mit drei Optionen zu öffnen: „Neues Event", „Gruppe erstellen" und „Schule erstellen".',
        note: 'Der „+"-Button erscheint nur, wenn dein Konto die Rolle Lehrer hat. Prüfe deine Rolle unter Profil → Einstellungen.',
      },
      {
        t: 'Globale Karte der Schulen',
        d: 'Im Tab „Gruppen" findest du eine interaktive Karte mit allen registrierten Schulen weltweit. Tippe auf einen Marker, um Name, Gruppe und Zeitpläne der Schule zu sehen. Nützlich, um auf Reisen einen Trainingsort zu finden.',
      },
    ],
  },
  {
    id: 'groups-and-community',
    title: 'Gruppen & Community',
    category: 'Allgemein',
    intro: 'Wie du Gruppen entdeckst, einer beitrittst und die Hierarchie deiner Community erkundest.',
    mockup: 'educator',
    steps: [
      {
        t: 'Was ist eine Gruppe und was ist eine Schule (Núcleo)?',
        d: 'Eine **Gruppe** ist die Capoeira-Organisation als Ganzes (z. B. Abadá Capoeira, Cordão de Ouro). Eine **Schule** (Núcleo) ist ein konkreter physischer Trainingsort innerhalb dieser Gruppe — eine Gruppe kann viele Schulen in verschiedenen Städten oder Ländern haben. Du gehörst zu einer Gruppe und trainierst an einer Schule. Lehrer erstellen Schulen innerhalb ihrer Gruppe.',
        note: 'Wenn die App „deine Schule" sagt, ist der konkrete Ort gemeint, an dem du trainierst. Wenn sie „deine Gruppe" sagt, ist die gesamte Organisation gemeint.',
      },
      {
        t: 'Gruppen durchsuchen',
        d: 'Der Tab „Gruppen" zeigt alle öffentlichen Gruppen auf der Plattform. Nutze die Suchleiste („Gruppe suchen...") zum Filtern nach Namen, und die Dropdowns „Land der Präsenz" und „Capoeira-Stil", um die Suche einzugrenzen.',
      },
      {
        t: 'Das Profil einer Gruppe',
        d: 'Tippe auf eine Gruppe, um ihr vollständiges Profil in Tabs zu sehen: „Übersicht" (Beschreibung und Statistiken), „Events" (anstehende Gruppen-Events), „Hierarchie" (Lehrer-Baum), „Schulen" (Liste aktiver Schulen) und „Graduierungen" (Gürtelsystem).',
      },
      {
        t: 'Beitrittsanfrage für eine Gruppe',
        d: 'Tippe im Gruppenprofil auf „Beitritt zur Gruppe anfragen". Deine Anfrage zeigt das Abzeichen „Anfrage ausstehend", bis der Admin sie genehmigt. Du erhältst eine Benachrichtigung unter „Profil → Benachrichtigungen", wenn sie akzeptiert wird.',
        tip: 'Wenn du dem Admin sagen willst, wer du bist, nutze die „Geführte Anfrage". Damit kannst du deiner Anfrage eine Nachricht beifügen.',
      },
      {
        t: 'Die Gruppenhierarchie ansehen',
        d: 'Im Tab „Hierarchie" des Gruppenprofils findest du den vollständigen Lehrer-Baum. Du kannst innerhalb der Hierarchie nach Namen suchen. Tippe auf einen Lehrer, um sein öffentliches Profil zu sehen.',
      },
      {
        t: 'Das Profil eines Mitglieds ansehen',
        d: 'Tippe auf den Namen eines Lehrers oder Mitglieds, um sein Profil zu sehen: Name, Spitzname, Gruppe, aktueller Gürtel und Schulen, an denen er unterrichtet oder trainiert. Die Graduierungshistorie ist ebenfalls öffentlich sichtbar.',
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    category: 'Allgemein',
    intro: 'Wie du Batizados, Rodas und mehr entdeckst, filterst und dein Interesse bestätigst.',
    mockup: 'event',
    steps: [
      {
        t: 'Den Event-Kalender erkunden',
        d: 'Der Tab „Events" zeigt oben einen interaktiven Kalender und darunter die Event-Liste. Tippe auf ein Datum, um die Events dieses Tages zu sehen. Du kannst mit dem Button in der Ecke zwischen Kalender- und Listenansicht wechseln.',
      },
      {
        t: 'Nach Kategorie und mehr filtern',
        d: 'Tippe auf „Filter", um erweiterte Optionen zu öffnen: Kategorie (Batizado, Roda, offene Roda, Troca de Corda, Kurs, Klasse, Workshop, Seminar, Festival, Treffen, Intensivkurs, Training), Preis (kostenlos oder kostenpflichtig), Format (vor Ort oder online), Termine, Gruppe und Standort.',
        tip: 'Du kannst mehrere Filter gleichzeitig kombinieren. Neben dem Button erscheint ein Hinweis „Aktive Filter", wenn Filter angewendet werden.',
      },
      {
        t: 'Event-Detail',
        d: 'Tippe auf ein Event, um die vollständige Beschreibung, Datum und Uhrzeit, Standort auf der Karte, Event-Typ, Organisatoren und Plakat (falls vorhanden) zu sehen. Du siehst auch, wie viele Personen teilnehmen („Bin dabei") und wie viele Interesse markiert haben („Interessiert").',
      },
      {
        t: '„Bin dabei" oder „Interessiert" bestätigen',
        d: 'Tippe im Event-Detail auf „Interessiert", um es in deiner Liste zu speichern, oder auf „Bin dabei", um die Teilnahme zu bestätigen. Organisatoren sehen die Gesamtzahl für beide.',
        tip: 'Events, die du mit „Bin dabei" markiert hast, werden auf deinem Home-Bildschirm im Bereich „Anstehende Events" hervorgehoben angezeigt.',
      },
      {
        t: 'Ein Event teilen',
        d: 'Nutze den Teilen-Button im Event-Detail, um es per WhatsApp, Instagram oder andere Apps zu senden. Geteilt werden Event-Name, Datum und ein direkter Link.',
      },
    ],
  },
  {
    id: 'your-profile',
    title: 'Dein Profil',
    category: 'Allgemein',
    intro: 'Wie du deine Identität, Benachrichtigungen und Zugriffseinstellungen verwaltest.',
    steps: [
      {
        t: 'Die drei Profil-Tabs',
        d: 'Der Tab „Profil" hat drei interne Bereiche: „Übersicht" (deine anstehenden Events und Bio), „Benachrichtigungen" (ausstehende Anfragen von Gruppe, Schule oder Lehrer) und „Verwaltung" (als Lehrer Zugriff auf deine Schulen; als Schüler die Schulen, an denen du trainierst).',
      },
      {
        t: 'Bearbeite dein Profil',
        d: 'Tippe auf das Bearbeitungssymbol (Stift) bei deinem Profilfoto oder Namen, um das Bearbeitungsformular zu öffnen. Du kannst Foto, Vorname, Nachname und Spitzname ändern. Speichere mit „Speichern".',
        tip: 'Fotos werden aus deiner Kamera oder Galerie hochgeladen. Ein quadratisches Bild sieht im runden Profilfoto am besten aus.',
      },
      {
        t: 'Dein Gürtel und deine Graduierungen',
        d: 'Dein aktueller Gürtel erscheint mit Farbe und Name unter deinem Namen im Profil. Wenn du mehr als eine erfasste Graduierung hast, tippe auf deinen Gürtel, um die vollständige Historie mit dem Datum jedes Stufenwechsels zu sehen.',
      },
      {
        t: 'Einstellungen: Sprache und Theme',
        d: 'Tippe unter „Profil" auf „Einstellungen". Dort kannst du im Bereich „Sprache" die Sprache ändern und unter „App-Modus" das visuelle Theme (hell oder dunkel). Änderungen werden sofort übernommen.',
      },
      {
        t: 'Ausstehende Benachrichtigungen',
        d: 'Im Tab „Benachrichtigungen" deines Profils siehst du fünf Arten von Anfragen: „Gruppenbeitrittsanfrage" (jemand möchte deiner Gruppe beitreten), „Lehreranfrage" (Anfrage für eine Lehrer-Schüler-Beziehung), „Schulbeitrittsanfrage" (jemand möchte deiner Schule beitreten), „Schulübertragungsanfrage" (ausstehende Verwaltungsübertragung) und „Kooperationsanfrage" (Einladung zur Mitorganisation eines Events). Das rote Abzeichen am Tab „Profil" zeigt, wie viele du ungelesen hast.',
      },
      {
        t: 'Ein Problem melden',
        d: 'Gehe zu „Profil" → „Einstellungen" → „Problem melden". Dein Bericht geht direkt an das Entwicklungsteam, technische Geräteinformationen werden automatisch beigefügt.',
      },
    ],
  },
  {
    id: 'premium',
    title: 'Premium-Plan',
    category: 'Allgemein',
    intro: 'Was der kostenlose Plan beinhaltet, was Premium freischaltet, und wie du abonnierst.',
    steps: [
      {
        t: 'Grenzen des kostenlosen Plans',
        d: 'Mit einem kostenlosen Konto können Lehrer bis zu 10 Events pro Monat erstellen und Schüler die Teilnahme an 1 Roda pro Monat bestätigen. Schulverwaltung, Anwesenheit und Zahlungsfunktionen sind für beide Rollen unbegrenzt verfügbar.',
        note: 'Schüler im kostenlosen Plan sehen Werbung innerhalb der App.',
      },
      {
        t: 'Was Premium beinhaltet',
        d: 'Premium schaltet unbegrenzte Events für Lehrer frei, bis zu 5 Rodas pro Monat für Schüler, bevorzugten Support und eine werbefreie Erfahrung.',
        tip: 'Der Jahresplan ist mit dem Abzeichen „BESTER WERT" markiert und deutlich günstiger als die monatliche Zahlung.',
      },
      {
        t: 'Wie du abonnierst',
        d: 'Gehe zu „Profil" → „Abonnement" oder tippe auf das Premium-Banner, das erscheint, wenn du eine Grenze erreichst. Wähle den monatlichen oder jährlichen Plan und bestätige die Zahlung mit deinem Google Play- oder App Store-Konto.',
        note: 'Zahlungen werden sicher über Google Play / App Store abgewickelt. Agenda Capoeiragem speichert keine Kartendaten.',
      },
      {
        t: 'Käufe wiederherstellen',
        d: 'Wenn du das Gerät wechselst oder die App neu installierst, gehe zu „Profil" → „Abonnement" → „Käufe wiederherstellen", um deinen aktiven Plan ohne erneute Zahlung wiederherzustellen.',
        tip: 'Nutze dasselbe Google- oder Apple-Konto, mit dem du den Plan gekauft hast.',
      },
    ],
  },
  {
    id: 'join-a-school',
    title: 'Einer Schule beitreten',
    category: 'Praktizierende',
    intro: 'Wie du eine Schule in deiner Nähe findest, eine Anfrage sendest, und was danach passiert.',
    steps: [
      {
        t: 'Eine Schule auf der Karte finden',
        d: 'Gehe zum Tab „Gruppen" und nutze die interaktive Karte, um Schulen in deiner Nähe zu erkunden. Tippe auf einen Marker, um Name, Gruppe, Zeitpläne und die Option zu sehen, das vollständige Profil anzusehen.',
      },
      {
        t: 'Beitrittsanfrage mit „Geführter Beitrittsanfrage"',
        d: 'Tippe im Schulprofil auf „Geführte Beitrittsanfrage". Du kannst eine Nachricht hinzufügen, um dich dem Lehrer vorzustellen. Deine Anfrage erscheint im Bereich „Anfragen" des Schulbereichs.',
        tip: 'Wenn du bereits bei einem Lehrer trainierst, der Agenda Capoeiragem nutzt, bitte ihn, dich direkt aus seinem Bereich hinzuzufügen, um den Anfrageprozess zu überspringen.',
      },
      {
        t: 'Auf Genehmigung warten',
        d: 'Deine Anfrage bleibt „Ausstehend", bis der Lehrer sie genehmigt oder ablehnt. Du erhältst eine Benachrichtigung unter „Profil → Benachrichtigungen", wenn es eine Antwort gibt.',
        warn: 'Nur der Lehrer kann Anfragen genehmigen. Wenn du innerhalb einiger Tage keine Antwort erhältst, versuche, den Lehrer über einen anderen Kanal zu kontaktieren.',
      },
      {
        t: 'Zugriff auf deine Klassen und Verlauf',
        d: 'Nach der Genehmigung erscheint die Schule im Tab „Profil" → „Verwaltung". Dort siehst du deine monatliche Anwesenheitshistorie und deinen Zahlungsstatus, falls die Schule Gebühren verwaltet.',
      },
    ],
  },
  {
    id: 'your-history',
    title: 'Deine persönliche Historie',
    category: 'Praktizierende',
    intro: 'Wie du deine monatliche Anwesenheit, deine Graduierungen und besuchte Events einsiehst.',
    steps: [
      {
        t: 'Anwesenheit in diesem Monat',
        d: 'Gehe zu „Profil" → Tab „Verwaltung" → deine Schule. Du siehst deinen Anwesenheitsprozentsatz für den aktuellen Monat und die Liste der Klassen mit einer Anwesend- oder Abwesend-Anzeige für jede.',
      },
      {
        t: 'Graduierungshistorie',
        d: 'Tippe in deinem Profil auf deinen aktuellen Gürtel, um die vollständige Historie mit dem Datum jedes Stufenwechsels einzusehen. Der Eintrag ist dauerhaft und auf deinem Profil öffentlich sichtbar.',
      },
      {
        t: 'Zahlungsstatus',
        d: 'Wenn deine Schule Zahlungen verwaltet, siehst du im Tab „Verwaltung" deinen Zahlungsstatus für den Monat: „Ausstehend", „Bezahlt" oder „Überfällig". Nur der Lehrer kann deine Zahlungen erfassen.',
        note: 'Dein Zahlungsstatus ist nur für dich und deinen Lehrer sichtbar. Er ist keine öffentliche Information.',
      },
      {
        t: 'Bestätigte Events',
        d: 'Im Tab „Übersicht" deines Profils siehst du anstehende Events, bei denen du „Bin dabei" bestätigt hast. Du kannst das Detail jedes Events ansehen, indem du direkt auf den Event-Namen in deinem Profil tippst.',
      },
    ],
  },
  {
    id: 'create-group',
    title: 'Deine Gruppe erstellen',
    category: 'Lehrer',
    intro: 'Wie du deine Capoeira-Gruppe auf der Plattform registrierst und ihre Informationen konfigurierst.',
    steps: [
      {
        t: 'Auf das Erstellungsformular zugreifen',
        d: 'Tippe auf den schwebenden „+"-Button auf dem Home-Bildschirm → „Gruppe erstellen". Du kannst auch zum Tab „Gruppen" gehen und oben in der Ecke auf „Gruppe erstellen" tippen.',
        note: 'Nur Nutzer mit der Rolle Lehrer können Gruppen erstellen. Prüfe deine Rolle unter „Profil → Einstellungen".',
      },
      {
        t: 'Name und Beschreibung',
        d: 'Gib den offiziellen Namen deiner Gruppe und eine Beschreibung ein. Beides ist erforderlich. Der Name erscheint im globalen Verzeichnis, auf Mitgliedsprofilen und bei allen von dir organisierten Events.',
      },
      {
        t: 'Capoeira-Stil (erforderlich)',
        d: 'Gib im Feld „Capoeira-Stil *" den Stil ein, den du praktizierst (z. B. Gemischt, Benguela, Angola, Regional). Es ist ein Freitextfeld und erforderlich. Dieser Text wird als Name deines Graduierungssystems verwendet und bestimmt, wie deine Gürtel benannt werden.',
        tip: 'Das Feld „Stadt" ist optional — du kannst es jetzt oder später unter „Gruppe bearbeiten" ausfüllen.',
      },
      {
        t: 'Gruppenlogo (optional)',
        d: 'Lade das Logo deiner Gruppe aus deiner Galerie hoch. Es erscheint im Gruppenprofil, in Schulen und auf der Gruppenkarte, die deine Schüler auf dem Home-Bildschirm sehen.',
      },
      {
        t: 'Die Gruppe erstellen',
        d: 'Tippe auf „Erstellen". Wenn der Name nicht doppelt vorhanden ist, wird die Gruppe sofort erstellt. Die App fragt, ob du das Graduierungssystem jetzt oder später einrichten möchtest.',
      },
      {
        t: 'Mitglieder einladen',
        d: 'Nach dem Erstellen der Gruppe teile ihren Namen mit deinen Schülern. Sie suchen danach im Tab „Gruppen" → Verzeichnis und beantragen den Beitritt. Du kannst sie auch direkt aus deinem Schulverwaltungsbereich hinzufügen, oder sie verknüpfen sich während ihres eigenen Onboardings.',
        tip: 'Es gibt keinen Einladungscode: Der Standardablauf ist, dass Schüler dich im Verzeichnis finden oder du sie aus dem Schulbereich hinzufügst.',
      },
    ],
  },
  {
    id: 'manage-group',
    title: 'Deine Gruppe verwalten',
    category: 'Lehrer',
    intro: 'Wie du Mitglieder, Admin-Rollen und Gruppeninformationen verwaltest.',
    steps: [
      {
        t: 'Gruppen-Verwaltungsbereich',
        d: 'Gehe zu deinem Gruppenprofil und tippe auf den Verwaltungsbutton (nur für Admins und Co-Admins sichtbar). Du erhältst Zugriff auf Optionen zur Verwaltung von Mitgliedern, Rollen und Gruppenkonfiguration.',
        note: 'Als Ersteller der Gruppe bist du der Hauptadmin. Nur du kannst die vollständige Verwaltung an eine andere Person übertragen.',
      },
      {
        t: 'Beitrittsanfragen genehmigen oder ablehnen',
        d: 'Unter „Anfragen" im Gruppenbereich siehst du ausstehende Anfragen mit dem Namen des Antragstellers und seiner Nachricht, falls er die geführte Anfrage genutzt hat. Tippe auf „Genehmigen" oder „Ablehnen", um auf jede zu reagieren.',
      },
      {
        t: 'Rollen zuweisen: Admin und Co-Admin',
        d: 'Vom Profil eines Mitglieds im Gruppenbereich kannst du ihm die Rolle „Co-Admin" (Zugriff auf den Bereich) zuweisen oder es zum „Admin" befördern. Du kannst auch die Option „Admin-Rolle verlassen" nutzen, um die Rolle zu entfernen.',
        warn: '„Verwaltung übertragen" gibt die vollständige Kontrolle über die Gruppe an einen anderen Nutzer. Diese Aktion ist unwiderruflich: Du verlierst die Hauptadmin-Rolle.',
      },
      {
        t: 'Gruppeninformationen bearbeiten',
        d: 'Gehe zum Gruppenprofil → Bearbeitungssymbol. Du kannst Name, Beschreibung, Logo, Capoeira-Stil und Stadt ändern. Änderungen werden sofort übernommen und im öffentlichen Verzeichnis angezeigt.',
      },
      {
        t: 'Ein Mitglied entfernen',
        d: 'Tippe in der Mitgliederliste im Bereich auf den Namen eines Mitglieds und wähle „Aus Gruppe entfernen". Das Mitglied verliert den Zugriff auf Gruppeninhalte, behält aber seine Graduierungshistorie.',
        warn: 'Das Entfernen eines Mitglieds ist umkehrbar: Es kann erneut den Beitritt zur Gruppe beantragen.',
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: 'Pädagogische Aufsicht',
    category: 'Lehrer',
    intro: 'Wie du einen aufsichtführenden Lehrer für die Schüler deiner Schule zuweist und wie die Hierarchie funktioniert.',
    steps: [
      {
        t: 'Was pädagogische Aufsicht ist',
        d: 'Pädagogische Aufsicht ist die hierarchische Beziehung zwischen Lehrern derselben Gruppe. Ein erfahrenerer Lehrer kann den Fortschritt der Schüler eines anderen Lehrers überwachen, besonders nützlich, wenn sie sich in verschiedenen Städten oder Ländern befinden.',
        note: 'Der Aufsichtsbildschirm heißt im Schulbereich „PÄDAGOGISCHE AUFSICHT".',
      },
      {
        t: 'Automatische Aufsicht (gleiche Schule)',
        d: 'Wenn der Aufsichtführende und die Schüler dieselbe Schule teilen, ist die Aufsicht automatisch. Die App zeigt das Abzeichen „Gleiche Schule" im Profil des Schülers im Bereich des Aufsichtführenden.',
      },
      {
        t: 'Manuelle Aufsicht (außerhalb der Schule)',
        d: 'Wenn sich der Aufsichtführende in einer anderen Schule befindet, kannst du ihn manuell zuweisen. Tippe auf dem Aufsichtsbildschirm auf „Aufsichtführenden Lehrer auswählen" und suche nach Namen. Beaufsichtigte Schüler zeigen das Abzeichen „Außerhalb deiner Schule".',
        tip: 'Nur Lehrer derselben Gruppe können als Aufsichtführende zugewiesen werden. Es ist nicht möglich, Schüler aus anderen Gruppen zu beaufsichtigen.',
      },
      {
        t: 'Den Aufsichtsbaum ansehen',
        d: 'Der Aufsichtsbaum ist im Tab „Hierarchie" des Gruppenprofils sichtbar. Er zeigt die Beziehungen zwischen Lehrern und welche Schüler unter wessen Aufsicht stehen — der „Mestre-zu-Schüler"-Baum deiner Gruppe.',
      },
    ],
  },
  {
    id: 'school-setup',
    title: 'Deine Schule erstellen',
    category: 'Lehrer',
    intro: 'Wie du deine Schule erstellst, auf der Karte platzierst und Trainingszeiten einrichtest.',
    mockup: 'map',
    steps: [
      {
        t: 'Auf das Erstellungsformular zugreifen',
        d: 'Tippe auf den schwebenden „+"-Button auf dem Home-Bildschirm → „Schule erstellen". Du kannst auch zum Tab „Gruppen" → Profil deiner Gruppe → Tab „Schulen" → Button „Schule erstellen" gehen.',
        note: 'Du musst Admin oder Co-Admin einer Gruppe sein, um eine Schule zu erstellen. Wenn du gerade deine Gruppe erstellt hast, hast du diese Rolle bereits automatisch.',
      },
      {
        t: 'Name und Standort eingeben',
        d: 'Fülle die erforderlichen Felder aus: „Schulname" (z. B. Innenstadt-Schule), „Standort" (vollständige Adresse deines Trainingsorts), „Land" und „Stadt".',
        tip: 'Nach Eingabe der Adresse tippe auf die Karte, um die Standortauswahl zu öffnen, und ziehe den Marker an die genaue Stelle. Das erscheint im globalen Verzeichnis.',
      },
      {
        t: 'Trainingszeiten hinzufügen',
        d: 'Tippe im Bereich „Trainingszeiten" auf „Zeitplan hinzufügen". Wähle Wochentag, Start- und Endzeit. Füge so viele Zeitpläne hinzu, wie du brauchst. Mindestens ein Zeitplan ist erforderlich, um die Schule zu erstellen.',
        tip: 'Jeder Zeitplan kann mit einer Klassengruppe verknüpft werden. Wenn du verschiedene Niveaus zu verschiedenen Zeiten trainierst, füge sie separat hinzu.',
      },
      {
        t: 'Die Schule erstellen',
        d: 'Tippe auf „Schule erstellen". Wenn alle Felder vollständig sind, wird die Schule erstellt und erscheint auf der globalen Karte und im Verzeichnis. Du wirst automatisch zum Verwaltungsbereich der Schule weitergeleitet.',
      },
      {
        t: 'Bearbeiten oder deaktivieren',
        d: 'Um Name, Adresse oder Zeitpläne zu bearbeiten, gehe zum Schulprofil → Bearbeitungssymbol. Wenn du an diesem Ort nicht mehr trainierst, kannst du die Schule deaktivieren, damit sie nicht im Verzeichnis erscheint, ohne die Historie zu verlieren.',
      },
    ],
  },
  {
    id: 'co-educators',
    title: 'Co-Lehrer',
    category: 'Lehrer',
    intro: 'Wie du Co-Lehrer zu deiner Schule hinzufügst und ihre Berechtigungen verwaltest.',
    steps: [
      {
        t: 'Was ein Co-Lehrer ist',
        d: 'Ein Co-Lehrer ist ein Lehrer derselben Gruppe, der bei der Verwaltung deiner Schule hilft. Er hat Zugriff auf den Verwaltungsbereich: Er kann Klassen erfassen, Anwesenheit markieren und Zahlungen registrieren, aber die Schulkonfiguration nicht ändern oder die Verwaltung übertragen.',
      },
      {
        t: 'Einen Co-Lehrer hinzufügen',
        d: 'Gehe zum Profil deiner Schule → Bereich „Co-Lehrer" → tippe auf „Co-Lehrer hinzufügen". Suche den Lehrer nach Namen (er muss Mitglied derselben Gruppe mit der Rolle Lehrer sein). Tippe auf seinen Namen und bestätige.',
        note: 'Nur Nutzer mit der Rolle Lehrer innerhalb derselben Gruppe können Co-Lehrer sein.',
      },
      {
        t: 'Einen Co-Lehrer entfernen',
        d: 'Tippe im Bereich „Co-Lehrer" des Schulprofils auf den Namen des Co-Lehrers und wähle „Co-Lehrer entfernen". Die Aktion ist sofort wirksam und der Lehrer verliert den Zugriff auf den Schulbereich.',
        warn: 'Das Entfernen eines Co-Lehrers löscht keine Daten. Die gesamte Klassen- und Zahlungshistorie, die er erfasst hat, bleibt im System.',
      },
      {
        t: 'Die Co-Lehrer-Rolle verlassen',
        d: 'Wenn du Co-Lehrer an einer Schule bist und es nicht mehr sein möchtest, gehe zum Schulprofil → Bereich „Co-Lehrer" → „Co-Lehrer-Rolle verlassen". Du kannst dies auch unter „Profil → Verwaltung → [Schulname]" → „Rolle verlassen" tun.',
      },
      {
        t: 'Schulverwaltung übertragen',
        d: 'Um die vollständige Kontrolle über die Schule an einen anderen Lehrer zu übergeben, gehe zum Schulprofil → „Verwaltung übertragen". Der Empfänger muss ein aktiver Co-Lehrer der Schule sein.',
        warn: '„Verwaltung übertragen" ist unwiderruflich: Du gibst die vollständige Kontrolle an die andere Person. Der neue Admin kann alle Schuleinstellungen ändern.',
      },
    ],
  },
  {
    id: 'school-requests',
    title: 'Schul-Beitrittsanfragen',
    category: 'Lehrer',
    intro: 'Wie du Beitrittsanfragen zu deiner Schule aus dem Verwaltungsbereich verwaltest.',
    steps: [
      {
        t: 'Ausstehende Anfragen ansehen',
        d: 'Gehe zu deinem Schulprofil → Button „Verwalten" → Tab „Anfragen". Du siehst alle ausstehenden Beitrittsanfragen. Jede Karte zeigt Name, Foto, Datum und die Nachricht des Antragstellers (falls er die geführte Anfrage genutzt hat).',
      },
      {
        t: 'Eine Anfrage genehmigen',
        d: 'Tippe auf „Genehmigen" auf der Karte des Antragstellers. Der Schüler erhält eine Benachrichtigung, dass er akzeptiert wurde, und erscheint ab sofort in deiner Schülerliste. Du kannst ihn sofort einer Klassengruppe im Tab „Schüler" zuweisen.',
      },
      {
        t: 'Eine Anfrage ablehnen',
        d: 'Tippe auf „Ablehnen" auf der Karte des Antragstellers. Der Schüler erhält eine Benachrichtigung, dass seine Anfrage nicht genehmigt wurde.',
        tip: 'Wenn du jemanden versehentlich ablehnst, kann der Schüler eine neue Anfrage senden.',
      },
      {
        t: 'Historie bearbeiteter Anfragen',
        d: 'Unter den ausstehenden Anfragen findest du die Historie bereits bearbeiteter Anfragen: genehmigt (Abzeichen „Akzeptiert") und abgelehnt (Abzeichen „Abgelehnt"). Bearbeitete Anfragen bleiben in der Historie und können nicht gelöscht werden.',
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Schüler & Klassengruppen',
    category: 'Lehrer',
    intro: 'Wie du deine Schüler ansiehst, Mitglieder ohne Konto hinzufügst und sie nach Klassengruppe organisierst.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Der Schul-Verwaltungsbereich',
        d: 'Zugriff über „Profil" → Tab „Verwaltung" → deine Schule, oder über das Schulprofil durch Tippen auf den Verwaltungsbutton. Du findest vier Tabs: „Schüler", „Anwesenheit", „Zahlungen" und „Berichte".',
      },
      {
        t: 'Die Schülerliste ansehen',
        d: 'Im Tab „Schüler" siehst du alle mit deiner Schule verknüpften Mitglieder mit Name, aktuellem Gürtel und monatlichem Anwesenheitsprozentsatz. Wenn es keine Mitglieder gibt, zeigt die App „Keine Mitglieder".',
      },
      {
        t: 'Einen Schüler ohne Konto hinzufügen (Geister-Mitglied)',
        d: 'Scrolle im Tab „Schüler" zum Bereich „Schüler ohne Konto". Tippe auf „Schüler hinzufügen", um einen Schüler manuell zu registrieren, der die App nicht nutzt. Gib Name und grundlegende Details ein.',
        note: 'Geister-Mitglieder können Graduierungen erhalten und haben Anwesenheits- und Zahlungsdatensätze, können sich aber nicht in der App anmelden. Wenn sie sich registrieren, kannst du ihr Profil verknüpfen, um die vollständige Historie zu erhalten.',
      },
      {
        t: 'Klassengruppen erstellen und verwalten',
        d: 'Zugriff auf die Schulverwaltung (Zahnrad-Symbol oder Button „Verwalten"). Dort kannst du Klassengruppen erstellen — Sätze von Schülern, organisiert nach Zeitplan. Erstelle eine pro Zeitslot (z. B. „Mo & Mi 19 Uhr") und weise jeder Schüler zu.',
        tip: 'Die Organisation der Schüler in Klassengruppen macht die Anwesenheit viel schneller: Der Anwesenheitsbildschirm zeigt nur die Schüler des ausgewählten Zeitslots.',
      },
      {
        t: 'Das Profil eines einzelnen Schülers ansehen',
        d: 'Tippe auf den Namen eines Schülers, um sein Profil zu sehen: Name, Gürtel, Anwesenheitsprozentsatz des aktuellen Monats, monatliche Anwesenheitshistorie und Zahlungsdatensatz.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Anwesenheitserfassung',
    category: 'Lehrer',
    intro: 'Wie du die heutige Klasse erfasst, anwesend und abwesend markierst und die Historie einsiehst.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Die heutige Klasse erfassen',
        d: 'Im Schul-Verwaltungsbereich → Tab „Anwesenheit" siehst du „Noch keine Klassen diesen Monat", falls es die erste ist. Tippe auf „Heutige Klasse erfassen", um das Sitzungsformular zu öffnen.',
      },
      {
        t: 'Zeitplan und Klassengruppe auswählen',
        d: 'Wähle im Sitzungsformular den heutigen Zeitplan (einen der bei der Schulerstellung konfigurierten) und die entsprechende Klassengruppe. Die App lädt automatisch die Schüler dieser Gruppe.',
        tip: 'Wenn du keine Klassengruppen konfiguriert hast, zeigt die Liste alle Schüler der Schule.',
      },
      {
        t: 'Anwesend und abwesend markieren',
        d: 'Tippe auf den Namen jedes Schülers, um zwischen anwesend (✓ grün) und abwesend zu wechseln. Die Liste zeigt zuerst die Schüler der ausgewählten Klassengruppe, dann den Rest der Schule, damit sich Gruppen nicht mischen.',
      },
      {
        t: 'Die Klasse speichern',
        d: 'Tippe auf „Klasse speichern". Die App zeigt einen Bestätigungsdialog mit der Anzahl Anwesender und Abwesender. Tippe auf „Bestätigen", um die Sitzung in der Cloud zu erfassen. Der Anwesenheitsprozentsatz jedes Schülers wird automatisch aktualisiert.',
      },
      {
        t: 'Vorherige Sitzungen einsehen',
        d: 'Im Tab „Anwesenheit" erscheinen die Sitzungen in chronologischer Reihenfolge. Tippe auf eine vergangene Sitzung, um das vollständige Detail zu sehen: wer anwesend war, wer abwesend war, und Datum und Uhrzeit der Erfassung.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Zahlungen & Kasse',
    category: 'Lehrer',
    intro: 'Wie du monatliche Gebühren erfasst, verfolgst, wer schuldet, und Berichte exportierst.',
    mockup: 'finances',
    steps: [
      {
        t: 'Der Tab „Zahlungen"',
        d: 'Gehe im Schul-Verwaltungsbereich zum Tab „Zahlungen". Jeder Schüler erscheint mit seinem Zahlungsstatus für den aktuellen Monat: „Ausstehend", „Bezahlt", „Bezahlt (verspätet)", „Überfällig" oder „Kostenlos". Status werden automatisch nach Datum berechnet.',
        warn: 'Wenn der Monat begonnen hat und ein Schüler keine erfasste Zahlung hat, ändert sich sein Status automatisch zu „Ausstehend" und dann nach dem konfigurierten Fälligkeitsdatum zu „Überfällig".',
      },
      {
        t: 'Eine Schülerzahlung erfassen',
        d: 'Tippe auf den Namen des Schülers im Tab „Zahlungen" und dann auf „Zahlung erfassen". Gib den Betrag ein und wähle den entsprechenden Monat. Der Status des Schülers ändert sich sofort zu „Bezahlt".',
        tip: 'Du kannst Vorauszahlungen für Schüler erfassen, die im Voraus zahlen. Wähle einfach den entsprechenden zukünftigen Monat.',
      },
      {
        t: 'Sehen, wer ausstehende oder überfällige Zahlungen hat',
        d: 'In der Liste des Tabs „Zahlungen" siehst du alle Schülerstatus auf einen Blick. Die Status „Ausstehend" und „Überfällig" sind hervorgehoben. Du siehst auch den konfigurierten Fälligkeitstag.',
      },
      {
        t: 'Den Monatsbericht erstellen und exportieren',
        d: 'Gehe zum Tab „Berichte" des Schulbereichs. Wähle das Format (CSV für Excel oder Google Sheets, oder PDF zum Drucken oder Teilen) und tippe auf „Bericht erstellen".',
        tip: 'CSV ist ideal für die Tabellenanalyse. PDF ist nützlich, um es mit der Gruppenverwaltung zu teilen oder zu archivieren.',
      },
    ],
  },
  {
    id: 'graduations',
    title: 'Graduierungssystem',
    category: 'Lehrer',
    intro: 'Wie du die Gürtel deiner Gruppe einrichtest und Stufenwechsel erfasst.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Auf das Graduierungssystem zugreifen',
        d: 'Gehe zum Profil deiner Gruppe → Tab „Graduierungen". Wenn noch keine Stufen konfiguriert sind, siehst du „Keine Graduierungsstufen definiert" und einen Button „System jetzt einrichten".',
      },
      {
        t: 'Eine Gürtelstufe erstellen',
        d: 'Tippe auf „Stufe hinzufügen" oder „Stufe erstellen". Gib den Gürtelnamen ein (z. B. „Grün-Gelber Gürtel"), wähle die Farben, aus denen er besteht, und gib an, ob er bemalte Spitzen hat und wie viele. Speichere die Stufe.',
        tip: 'Die visuelle Farbe jeder Stufe erscheint in Schülerprofilen und im öffentlichen Verzeichnis. Konfiguriere sie genau passend zum echten Gürtel.',
      },
      {
        t: 'Nach Kategorie organisieren',
        d: 'Stufen werden automatisch in Bereiche organisiert: „Erwachsenensystem", „Jugendsystem", „Kindersystem", „Auszubildende Lehrer" und „Sonderstufen". Weise beim Erstellen oder Bearbeiten jeder Stufe die richtige Kategorie zu.',
      },
      {
        t: 'Die Lehrerstufe definieren',
        d: 'Du kannst festlegen, ab welchem Gürtel ein Schüler in der Gruppe als „Lehrer" gilt. Dies bestimmt, wer Zugriff auf das Erstellen von Schulen und die Verwaltungstools hat.',
      },
      {
        t: 'Eine Graduierung zuweisen',
        d: 'Im Gruppenprofil → „Graduierungen" → „Graduierung zuweisen". Finde den Schüler, wähle die neue Stufe und das Datum. Die Änderung wird dauerhaft in der Historie des Schülers erfasst, und der neue Gürtel erscheint sofort in seinem Profil.',
        tip: 'Du kannst Graduierungen für ein Batizado in großen Mengen zuweisen: Wähle mehrere Schüler gleichzeitig, wähle Stufe und Datum, und alle werden in einem Schritt graduiert.',
      },
      {
        t: 'Die Graduierungshistorie eines Schülers ansehen',
        d: 'Tippe auf den Namen eines beliebigen Gruppenmitglieds. Sein Profil zeigt den aktuellen Gürtel mit seiner Farbe. Tippe auf den Gürtel, um die vollständige Historie zu sehen: jeden Stufenwechsel mit Datum. Die Historie kann nicht gelöscht werden.',
      },
    ],
  },
  {
    id: 'manage-events',
    title: 'Events erstellen & verwalten',
    category: 'Lehrer',
    intro: 'Wie du ein Batizado, eine Roda oder einen Workshop für die Community veröffentlichst.',
    mockup: 'event',
    steps: [
      {
        t: 'Ein Event erstellen',
        d: 'Tippe auf den schwebenden „+"-Button auf dem Home-Bildschirm → „Neues Event". Du kannst auch zum Tab „Events" gehen und oben in der Ecke auf „Neues Event" tippen.',
      },
      {
        t: 'Die Event-Details ausfüllen',
        d: 'Das Formular umfasst: Event-Name, Kategorie (Batizado, Roda, offene Roda, Troca de Corda, Kurs, Klasse, Workshop, Seminar, Festival, Treffen, Intensivkurs oder Trainingssitzung), Datum, Start- und Endzeit.',
      },
      {
        t: 'Eine Beschreibung und ein Plakat hinzufügen',
        d: 'Gib die Beschreibung mit allen relevanten Details ein (Preis, Anforderungen, was mitzubringen ist usw.). Lade ein Titelbild (Plakat) aus deiner Galerie hoch, um dem Event Sichtbarkeit zu verleihen.',
        tip: 'Events mit Plakat erhalten höhere Sichtbarkeit in den Feeds der Mitglieder. Ein vertikales Bild mit guter Auflösung sieht am besten aus.',
      },
      {
        t: 'Den Standort auf der Karte markieren',
        d: 'Gib die Event-Adresse ein. Die App öffnet die Kartenauswahl, wo du den Marker an die genaue Stelle ziehen kannst. Teilnehmer sehen den Standort und können die Navigation direkt vom Event aus öffnen.',
      },
      {
        t: 'Mitorganisatoren und Teilnehmer verwalten',
        d: 'Nach dem Erstellen des Events kannst du im Bearbeitungsmenü → „Mitwirkende" Mitorganisatoren hinzufügen. Mitorganisatoren können das Event bearbeiten und die vollständige Liste sehen, wer „Bin dabei" oder „Interessiert" markiert hat.',
      },
    ],
  },
  {
    id: 'reports-kpi',
    title: 'Berichte & KPIs',
    category: 'Lehrer',
    intro: 'Wie du die Kennzahlen deiner Schule überprüfst und Daten für externe Analysen exportierst.',
    mockup: 'kpi',
    steps: [
      {
        t: 'Schnelle Kennzahlen-Leiste',
        d: 'Oben im Schul-Verwaltungsbereich siehst du eine KPI-Leiste: Anzahl Schüler, diesen Monat abgehaltene Klassen, durchschnittlicher Anwesenheitsprozentsatz, Anzahl bezahlter Schüler und Anzahl überfälliger.',
      },
      {
        t: 'Der Tab „Berichte"',
        d: 'Gehe zum Schulbereich → Tab „Berichte". Der Untertitel lautet „Anwesenheit, Zahlungen und Schulstatistiken". Hier erstellst du den Monatsbericht mit allen konsolidierten Informationen.',
      },
      {
        t: 'Das Berichtsformat wählen',
        d: 'Wähle das benötigte Format: „CSV" zum Öffnen in Excel oder Google Sheets für individuelle Analysen, oder „PDF" für ein fertig zu teilendes oder druckbares Dokument.',
      },
      {
        t: 'Erstellen und exportieren',
        d: 'Tippe auf „Bericht erstellen". Die App erstellt die Datei mit einer Monatszusammenfassung: aktive Schüler, abgehaltene Sitzungen, Gesamtanwesenheitsprozentsatz und Zahlungsstatus pro Schüler. Du kannst sie direkt vom Export-Bildschirm aus teilen.',
        tip: 'Erstelle den Bericht am Ende jedes Monats, um eine historische Aufzeichnung der Gesundheit deiner Schule zu führen.',
      },
    ],
  },
]

// ─── Italian ─────────────────────────────────────────────────────────────────

const SECTIONS_IT: Section[] = [
  {
    id: 'getting-started',
    title: 'Per iniziare',
    category: 'Generale',
    intro: 'Come creare il tuo account, completare il profilo e unirti alla tua comunità.',
    mockup: 'home',
    steps: [
      {
        t: "Installa l'app o usala come web app",
        d: "Scaricala da Google Play su Android, oppure apri agendacapoeiragem.com nel tuo browser e aggiungila alla schermata home come web app (PWA). Entrambe le opzioni funzionano allo stesso modo.",
        note: 'La versione nativa per iPhone è in sviluppo. Nel frattempo, usa Safari su iOS → "Aggiungi a Home".',
      },
      {
        t: 'Crea il tuo account',
        d: 'Quando apri l\'app vedrai la schermata "Crea account — Unisciti alla comunità della capoeira". Inserisci nome, cognome, soprannome (opzionale) ed email. Puoi anche registrarti con Google.',
        tip: 'Prima di continuare, l\'app ti chiederà il tuo ruolo: "Praticante" o "Educatore". Scegli "Educatore" se insegni già capoeira — questo sblocca subito gli strumenti di gestione.',
      },
      {
        t: 'Completa l\'onboarding',
        d: 'Dopo la registrazione, la schermata di onboarding ti guida ad aggiungere una foto profilo e trovare il tuo gruppo o scuola. Puoi saltare questo passaggio e farlo dopo, ma collegarti da subito attiva tutte le funzionalità della comunità.',
      },
      {
        t: 'Collega il tuo gruppo',
        d: 'Nella schermata Home vedrai la card "Nessun gruppo assegnato" con un pulsante "Trova gruppi". Cerca il tuo gruppo nella directory e invia una richiesta di adesione. Puoi anche chiedere al tuo educatore di aggiungerti direttamente dal suo pannello di amministrazione.',
        warn: 'Senza un gruppo collegato non puoi vedere gli eventi della tua comunità né la cronologia delle graduazioni. Anche le funzioni di presenza e pagamento non saranno disponibili.',
      },
    ],
  },
  {
    id: 'home-and-discovery',
    title: 'Home e scoperta',
    category: 'Generale',
    intro: 'Come navigare nella schermata principale e trovare rapidamente ciò di cui hai bisogno.',
    mockup: 'home',
    steps: [
      {
        t: 'La schermata Home',
        d: 'La scheda "Home" mostra un saluto personalizzato con il tuo nome, la card del tuo gruppo e la sezione "Prossimi eventi" con gli eventi della tua comunità in ordine cronologico. Un badge rosso sulla scheda "Profilo" indica notifiche in sospeso.',
        tip: 'Scorri verso il basso per aggiornare il feed in qualsiasi momento.',
      },
      {
        t: 'Filtra i prossimi eventi',
        d: 'Nella sezione "Prossimi eventi" troverai dei filtri rapidi: "Questa settimana" e "Questo mese". Toccali per restringere la vista.',
      },
      {
        t: 'Ricerca globale',
        d: 'Tocca la barra di ricerca nella schermata Home per aprire la ricerca globale. Digita un termine qualsiasi e vedrai i risultati organizzati in quattro sezioni: Eventi, Gruppi, Scuole e Utenti.',
      },
      {
        t: 'Il pulsante "+" (Educatori)',
        d: 'Se sei un educatore, vedrai un pulsante "+" flottante nella schermata Home. Toccalo per aprire un menu con tre opzioni: "Nuovo evento", "Crea gruppo" e "Crea scuola".',
        note: 'Il pulsante "+" appare solo se il tuo account ha il ruolo di Educatore. Controlla il tuo ruolo in Profilo → Impostazioni.',
      },
      {
        t: 'Mappa globale delle scuole',
        d: 'Nella scheda "Gruppi" troverai una mappa interattiva con tutte le scuole registrate nel mondo. Tocca qualsiasi marcatore per vedere il nome della scuola, il suo gruppo e i suoi orari. Utile per trovare un posto dove allenarsi quando viaggi.',
      },
    ],
  },
  {
    id: 'groups-and-community',
    title: 'Gruppi e comunità',
    category: 'Generale',
    intro: 'Come scoprire i gruppi, unirti a uno ed esplorare la gerarchia della tua comunità.',
    mockup: 'educator',
    steps: [
      {
        t: 'Cos\'è un gruppo e cos\'è una scuola (núcleo)?',
        d: 'Un **gruppo** è l\'organizzazione di capoeira nel suo insieme (es. Abadá Capoeira, Cordão de Ouro). Una **scuola** (núcleo) è un luogo di allenamento fisico specifico all\'interno di quel gruppo — un gruppo può avere molte scuole in città o paesi diversi. Appartieni a un gruppo e ti alleni in una scuola. Gli educatori creano scuole all\'interno del loro gruppo.',
        note: 'Quando l\'app dice "la tua scuola" si riferisce al luogo specifico dove ti alleni. Quando dice "il tuo gruppo" si riferisce all\'intera organizzazione.',
      },
      {
        t: 'Esplora i gruppi',
        d: 'La scheda "Gruppi" mostra tutti i gruppi pubblici sulla piattaforma. Usa la barra di ricerca ("Cerca gruppo...") per filtrare per nome, e i menu a discesa "Paese di presenza" e "Stile di capoeira" per restringere la ricerca.',
      },
      {
        t: 'Il profilo di un gruppo',
        d: 'Tocca un gruppo qualsiasi per vedere il suo profilo completo organizzato in schede: "Riepilogo" (descrizione e statistiche), "Eventi" (prossimi eventi del gruppo), "Gerarchia" (albero degli educatori), "Scuole" (elenco scuole attive) e "Graduazioni" (sistema delle corde).',
      },
      {
        t: 'Richiedi di unirti a un gruppo',
        d: 'Dal profilo del gruppo, tocca "Richiedi di unirti al gruppo". La tua richiesta mostrerà il badge "Richiesta in sospeso" finché l\'amministratore non l\'approva. Riceverai una notifica in "Profilo → Notifiche" quando viene accettata.',
        tip: 'Se vuoi farti conoscere dall\'amministratore, usa la "Richiesta guidata". Ti permette di inviare un messaggio insieme alla tua richiesta.',
      },
      {
        t: 'Visualizza la gerarchia del gruppo',
        d: 'Nella scheda "Gerarchia" del profilo del gruppo troverai l\'albero completo degli educatori. Puoi cercare per nome all\'interno della gerarchia. Tocca un educatore qualsiasi per vedere il suo profilo pubblico.',
      },
      {
        t: 'Visualizza il profilo di un membro',
        d: 'Tocca il nome di un educatore o membro qualsiasi per vedere il suo profilo: nome, soprannome, gruppo, corda attuale e scuole dove insegna o si allena. Anche la cronologia delle graduazioni è visibile pubblicamente.',
      },
    ],
  },
  {
    id: 'events',
    title: 'Eventi',
    category: 'Generale',
    intro: 'Come scoprire, filtrare e confermare il tuo interesse per batizados, rodas e altro.',
    mockup: 'event',
    steps: [
      {
        t: 'Esplora il calendario degli eventi',
        d: 'La scheda "Eventi" mostra in alto un calendario interattivo e sotto l\'elenco eventi. Tocca una data qualsiasi per vedere gli eventi di quel giorno. Puoi alternare tra vista calendario e vista elenco con il pulsante nell\'angolo.',
      },
      {
        t: 'Filtra per categoria e altro',
        d: 'Tocca "Filtri" per aprire le opzioni avanzate: Categoria (batizado, roda, roda aperta, troca de corda, corso, lezione, workshop, seminario, festival, incontro, intensivo, allenamento), Prezzo (gratuito o a pagamento), Formato (in presenza o online), Date, Gruppo e Posizione.',
        tip: 'Puoi combinare più filtri contemporaneamente. Un indicatore "Filtri attivi" appare vicino al pulsante quando i filtri sono applicati.',
      },
      {
        t: 'Dettaglio evento',
        d: 'Tocca un evento qualsiasi per vedere la descrizione completa, data e ora, posizione sulla mappa, tipo di evento, organizzatori e locandina se presente. Vedrai anche quante persone partecipano ("Partecipo") e quante hanno segnato interesse ("Interessato").',
      },
      {
        t: 'Conferma "Partecipo" o "Interessato"',
        d: 'Dal dettaglio dell\'evento, tocca "Interessato" per salvarlo nella tua lista, o "Partecipo" per confermare la presenza. Gli organizzatori possono vedere il conteggio totale per entrambi.',
        tip: 'Gli eventi che hai segnato come "Partecipo" appaiono evidenziati nella tua schermata Home nella sezione "Prossimi eventi".',
      },
      {
        t: 'Condividi un evento',
        d: 'Usa il pulsante di condivisione nel dettaglio dell\'evento per inviarlo via WhatsApp, Instagram o altre app. Vengono condivisi il nome dell\'evento, la data e un link diretto.',
      },
    ],
  },
  {
    id: 'your-profile',
    title: 'Il tuo profilo',
    category: 'Generale',
    intro: 'Come gestire la tua identità, le notifiche e le impostazioni di accesso.',
    steps: [
      {
        t: 'Le tre schede del profilo',
        d: 'La scheda "Profilo" ha tre sezioni interne: "Riepilogo" (i tuoi prossimi eventi e la tua bio), "Notifiche" (richieste in sospeso da gruppo, scuola o educatore), e "Gestione" (se sei educatore, accesso alle tue scuole; se sei alunno, le scuole dove ti alleni).',
      },
      {
        t: 'Modifica il tuo profilo',
        d: 'Tocca l\'icona di modifica (matita) sulla tua foto profilo o sul nome per aprire il modulo di modifica. Puoi cambiare foto, nome, cognome e soprannome. Salva toccando "Salva".',
        tip: 'Le foto vengono caricate dalla fotocamera o dalla galleria. Un\'immagine quadrata appare meglio nella foto profilo circolare.',
      },
      {
        t: 'La tua corda e le tue graduazioni',
        d: 'La tua corda attuale appare con il suo colore e nome sotto il tuo nome nel profilo. Se hai più di una graduazione registrata, tocca la tua corda per vedere la cronologia completa con la data di ogni cambio di livello.',
      },
      {
        t: 'Impostazioni: lingua e tema',
        d: 'Da "Profilo", tocca "Impostazioni". Lì puoi cambiare la lingua nella sezione "Lingua" e il tema visivo (chiaro o scuro) in "Modalità app". Le modifiche si applicano immediatamente.',
      },
      {
        t: 'Notifiche in sospeso',
        d: 'Nella scheda "Notifiche" del tuo profilo vedrai cinque tipi di richieste: "Richiesta di adesione al gruppo" (qualcuno vuole unirsi al tuo gruppo), "Richiesta educatore" (richiesta di relazione educatore-alunno), "Richiesta di adesione alla scuola" (qualcuno vuole unirsi alla tua scuola), "Richiesta di trasferimento scuola" (trasferimento di amministrazione in sospeso) e "Richiesta di collaborazione" (invito a co-organizzare un evento). Il badge rosso sulla scheda "Profilo" mostra quante non hai letto.',
      },
      {
        t: 'Segnala un problema',
        d: 'Vai su "Profilo" → "Impostazioni" → "Segnala un problema". La tua segnalazione va direttamente al team di sviluppo con le informazioni tecniche del dispositivo allegate automaticamente.',
      },
    ],
  },
  {
    id: 'premium',
    title: 'Piano Premium',
    category: 'Generale',
    intro: 'Cosa include il piano gratuito, cosa sblocca Premium e come abbonarsi.',
    steps: [
      {
        t: 'Limiti del piano gratuito',
        d: 'Con un account gratuito, gli educatori possono creare fino a 10 eventi al mese e gli alunni possono confermare la presenza a 1 roda al mese. Le funzioni di gestione scuola, presenze e pagamenti sono disponibili senza limiti per entrambi i ruoli.',
        note: 'Gli alunni con piano gratuito vedono pubblicità all\'interno dell\'app.',
      },
      {
        t: 'Cosa include Premium',
        d: 'Premium sblocca eventi illimitati per gli educatori, fino a 5 rodas al mese per gli alunni, supporto prioritario e un\'esperienza senza pubblicità.',
        tip: 'Il piano annuale è contrassegnato dal badge "MIGLIOR VALORE" ed è significativamente più economico del pagamento mensile.',
      },
      {
        t: 'Come abbonarsi',
        d: 'Vai su "Profilo" → "Abbonamento" oppure tocca il banner Premium che appare quando raggiungi un limite. Scegli il piano mensile o annuale e confirma il pagamento con il tuo account Google Play o App Store.',
        note: 'I pagamenti sono elaborati in modo sicuro tramite Google Play / App Store. Agenda Capoeiragem non memorizza i dati della carta.',
      },
      {
        t: 'Ripristina gli acquisti',
        d: 'Se cambi dispositivo o reinstalli l\'app, vai su "Profilo" → "Abbonamento" → "Ripristina acquisti" per recuperare il tuo piano attivo senza pagare di nuovo.',
        tip: 'Usa lo stesso account Google o Apple che hai usato per acquistare il piano.',
      },
    ],
  },
  {
    id: 'join-a-school',
    title: 'Unirsi a una scuola',
    category: 'Praticanti',
    intro: 'Come trovare una scuola vicina, inviare una richiesta e cosa succede dopo.',
    steps: [
      {
        t: 'Trova una scuola sulla mappa',
        d: 'Vai alla scheda "Gruppi" e usa la mappa interattiva per esplorare le scuole vicine a te. Tocca qualsiasi marcatore per vedere nome, gruppo, orari e l\'opzione per visualizzare il profilo completo.',
      },
      {
        t: 'Richiedi di unirti con la "Richiesta guidata"',
        d: 'Dal profilo della scuola, tocca "Richiesta guidata di adesione". Puoi includere un messaggio per presentarti all\'educatore. La tua richiesta apparirà nella sezione "Richieste" del pannello della scuola.',
        tip: 'Se ti alleni già con un educatore che usa Agenda Capoeiragem, chiedigli di aggiungerti direttamente dal suo pannello per saltare il processo di richiesta.',
      },
      {
        t: 'Attendi l\'approvazione',
        d: 'La tua richiesta resta "In sospeso" finché l\'educatore non la approva o la rifiuta. Riceverai una notifica in "Profilo → Notifiche" quando c\'è una risposta.',
        warn: 'Solo l\'educatore può approvare le richieste. Se non ricevi risposta entro pochi giorni, prova a contattare l\'educatore tramite un altro canale.',
      },
      {
        t: 'Accedi alle tue lezioni e al tuo monitoraggio',
        d: 'Una volta approvata, la scuola appare nella scheda "Profilo" → "Gestione". Lì vedrai la tua cronologia di presenze mese per mese e il tuo stato di pagamento se la scuola gestisce le quote.',
      },
    ],
  },
  {
    id: 'your-history',
    title: 'La tua storia personale',
    category: 'Praticanti',
    intro: 'Come visualizzare le tue presenze mensili, le tue graduazioni e gli eventi a cui hai partecipato.',
    steps: [
      {
        t: 'Presenze di questo mese',
        d: 'Vai su "Profilo" → scheda "Gestione" → la tua scuola. Vedrai la tua percentuale di presenza per il mese corrente e l\'elenco delle lezioni con un indicatore presente o assente per ciascuna.',
      },
      {
        t: 'Cronologia delle graduazioni',
        d: 'Dal tuo profilo, tocca la tua corda attuale per espandere la cronologia completa con la data di ogni cambio di livello. Il registro è permanente e visibile pubblicamente sul tuo profilo.',
      },
      {
        t: 'Stato di pagamento',
        d: 'Se la tua scuola gestisce i pagamenti, nella scheda "Gestione" vedrai il tuo stato di pagamento per il mese: "In sospeso", "Pagato" o "Scaduto". Solo l\'educatore può registrare i tuoi pagamenti.',
        note: 'Il tuo stato di pagamento è visibile solo a te e al tuo educatore. Non è un\'informazione pubblica.',
      },
      {
        t: 'Eventi confermati',
        d: 'Nella scheda "Riepilogo" del tuo profilo vedrai i prossimi eventi a cui hai confermato "Partecipo". Puoi visualizzare il dettaglio di ognuno toccando direttamente il nome dell\'evento dal tuo profilo.',
      },
    ],
  },
  {
    id: 'create-group',
    title: 'Creare il tuo gruppo',
    category: 'Educatori',
    intro: 'Come registrare il tuo gruppo di capoeira sulla piattaforma e configurare le sue informazioni.',
    steps: [
      {
        t: 'Accedi al modulo di creazione',
        d: 'Tocca il pulsante "+" flottante nella schermata Home → "Crea gruppo". Puoi anche andare alla scheda "Gruppi" e toccare "Crea gruppo" nell\'angolo superiore.',
        note: 'Solo gli utenti con il ruolo di Educatore possono creare gruppi. Controlla il tuo ruolo in "Profilo → Impostazioni".',
      },
      {
        t: 'Nome e descrizione',
        d: 'Inserisci il nome ufficiale del tuo gruppo e una descrizione. Entrambi sono obbligatori. Il nome apparirà nella directory globale, sui profili dei membri e su tutti gli eventi che organizzi.',
      },
      {
        t: 'Stile di capoeira (obbligatorio)',
        d: 'Nel campo "Stile di capoeira *", digita lo stile che praticate (es. Misto, Benguela, Angola, Regional). È un campo di testo libero ed è obbligatorio. Questo testo viene usato come nome del tuo sistema di graduazione e determina come vengono etichettate le tue corde.',
        tip: 'Il campo "Città" è opzionale — puoi compilarlo ora o dopo da "Modifica gruppo".',
      },
      {
        t: 'Logo del gruppo (opzionale)',
        d: 'Carica il logo del tuo gruppo dalla tua galleria. Apparirà nel profilo del gruppo, nelle scuole e nella card del gruppo che i tuoi alunni vedono nella schermata Home.',
      },
      {
        t: 'Crea il gruppo',
        d: 'Tocca "Crea". Se il nome non è duplicato, il gruppo viene creato immediatamente. L\'app chiederà se vuoi configurare il sistema di graduazione ora o dopo.',
      },
      {
        t: 'Invita membri',
        d: 'Dopo aver creato il gruppo, condividi il suo nome con i tuoi alunni. Lo cercheranno nella scheda "Gruppi" → directory e richiederanno di unirsi. Puoi anche aggiungerli direttamente dal pannello di amministrazione della tua scuola, oppure possono collegarsi durante il proprio onboarding.',
        tip: 'Non esiste un codice di invito: il flusso standard è che gli alunni ti trovino nella directory, o che tu li aggiunga dal pannello della scuola.',
      },
    ],
  },
  {
    id: 'manage-group',
    title: 'Gestire il tuo gruppo',
    category: 'Educatori',
    intro: 'Come gestire i membri, i ruoli di amministrazione e le informazioni del gruppo.',
    steps: [
      {
        t: 'Pannello di amministrazione del gruppo',
        d: 'Vai al profilo del tuo gruppo e tocca il pulsante di amministrazione (visibile solo agli admin e co-admin). Accederai alle opzioni per gestire membri, ruoli e configurazione del gruppo.',
        note: 'Come creatore del gruppo, sei l\'admin principale. Solo tu puoi trasferire l\'amministrazione completa a un\'altra persona.',
      },
      {
        t: 'Approva o rifiuta le richieste di adesione',
        d: 'In "Richieste" sul pannello del gruppo vedrai le richieste in sospeso con il nome del richiedente e il suo messaggio se ha usato la richiesta guidata. Tocca "Approva" o "Rifiuta" per rispondere a ciascuna.',
      },
      {
        t: 'Assegna ruoli: admin e co-admin',
        d: 'Dal profilo di un membro nel pannello del gruppo, puoi assegnargli il ruolo "Co-admin" (accesso al pannello) o promuoverlo ad "Admin". Puoi anche usare l\'opzione "Lascia ruolo admin" per rimuovere il ruolo.',
        warn: '"Trasferisci amministrazione" passa il controllo completo del gruppo a un altro utente. Questa azione è irreversibile: perderai il ruolo di admin principale.',
      },
      {
        t: 'Modifica le informazioni del gruppo',
        d: 'Vai al profilo del gruppo → icona di modifica. Puoi cambiare nome, descrizione, logo, stile di capoeira e città. Le modifiche si applicano immediatamente e si riflettono nella directory pubblica.',
      },
      {
        t: 'Rimuovi un membro',
        d: 'Dall\'elenco membri nel pannello, tocca il nome di un membro e scegli "Rimuovi dal gruppo". Il membro perde l\'accesso ai contenuti del gruppo ma conserva la sua cronologia delle graduazioni.',
        warn: 'Rimuovere un membro è reversibile: può richiedere di unirsi nuovamente al gruppo.',
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: 'Supervisione educativa',
    category: 'Educatori',
    intro: 'Come assegnare un educatore supervisore per gli alunni della tua scuola e come funziona la gerarchia.',
    steps: [
      {
        t: 'Cos\'è la supervisione educativa',
        d: 'La supervisione educativa è la relazione gerarchica tra educatori dello stesso gruppo. Un educatore più esperto può supervisionare il progresso degli alunni di un altro educatore, particolarmente utile quando si trovano in città o paesi diversi.',
        note: 'La schermata di supervisione si chiama "SUPERVISIONE EDUCATIVA" all\'interno del pannello della scuola.',
      },
      {
        t: 'Supervisione automatica (stessa scuola)',
        d: 'Se il supervisore e gli alunni condividono la stessa scuola, la supervisione è automatica. L\'app mostrerà il badge "Stessa scuola" nel profilo dell\'alunno all\'interno del pannello del supervisore.',
      },
      {
        t: 'Supervisione manuale (fuori dalla scuola)',
        d: 'Se il supervisore si trova in una scuola diversa, puoi assegnarlo manualmente. Nella schermata di supervisione, tocca "Seleziona educatore supervisore" e cerca per nome. Gli alunni supervisionati mostreranno il badge "Fuori dalla tua scuola".',
        tip: 'Solo gli educatori dello stesso gruppo possono essere assegnati come supervisori. Non è possibile supervisionare alunni di gruppi diversi.',
      },
      {
        t: 'Visualizza l\'albero di supervisione',
        d: 'L\'albero di supervisione è visibile nella scheda "Gerarchia" del profilo del gruppo. Mostra le relazioni tra educatori e quali alunni sono sotto la supervisione di ciascuno — l\'albero "da mestre ad apprendista" del tuo gruppo.',
      },
    ],
  },
  {
    id: 'school-setup',
    title: 'Creare la tua scuola',
    category: 'Educatori',
    intro: 'Come creare la tua scuola, posizionarla sulla mappa e configurare gli orari di allenamento.',
    mockup: 'map',
    steps: [
      {
        t: 'Accedi al modulo di creazione',
        d: 'Tocca il pulsante "+" flottante nella schermata Home → "Crea scuola". Puoi anche andare alla scheda "Gruppi" → profilo del tuo gruppo → scheda "Scuole" → pulsante "Crea scuola".',
        note: 'Devi essere admin o co-admin di un gruppo per creare una scuola. Se hai appena creato il tuo gruppo, hai già automaticamente quel ruolo.',
      },
      {
        t: 'Compila nome e posizione',
        d: 'Completa i campi obbligatori: "Nome scuola" (es. Scuola Centro), "Posizione" (indirizzo completo del tuo luogo di allenamento), "Paese" e "Città".',
        tip: 'Dopo aver inserito l\'indirizzo, tocca la mappa per aprire il selettore di posizione e trascina il marcatore nel punto esatto. Questo è ciò che appare nella directory globale.',
      },
      {
        t: 'Aggiungi orari di allenamento',
        d: 'Nella sezione "Orari di allenamento", tocca "Aggiungi orario". Seleziona il giorno della settimana, l\'orario di inizio e quello di fine. Aggiungi tutti gli orari di cui hai bisogno. È richiesto almeno un orario per creare la scuola.',
        tip: 'Ogni orario può essere collegato a un gruppo di lezione. Se ti alleni con livelli diversi in orari diversi, aggiungili separatamente.',
      },
      {
        t: 'Crea la scuola',
        d: 'Tocca "Crea scuola". Se tutti i campi sono completi, la scuola viene creata e apparirà sulla mappa globale e nella directory. Verrai portato automaticamente al pannello di amministrazione della scuola.',
      },
      {
        t: 'Modifica o disattiva',
        d: 'Per modificare nome, indirizzo o orari, vai al profilo della scuola → icona di modifica. Se smetti di allenarti in quel luogo, puoi disattivare la scuola in modo che non appaia nella directory senza perdere la cronologia.',
      },
    ],
  },
  {
    id: 'co-educators',
    title: 'Co-educatori',
    category: 'Educatori',
    intro: 'Come aggiungere co-educatori alla tua scuola e gestire i loro permessi.',
    steps: [
      {
        t: 'Cos\'è un co-educatore',
        d: 'Un co-educatore è un educatore dello stesso gruppo che aiuta a gestire la tua scuola. Ha accesso al pannello di amministrazione: può registrare lezioni, segnare presenze e registrare pagamenti, ma non può modificare la configurazione della scuola né trasferire l\'amministrazione.',
      },
      {
        t: 'Aggiungi un co-educatore',
        d: 'Vai al profilo della tua scuola → sezione "Co-educatori" → tocca "Aggiungi co-educatore". Cerca l\'educatore per nome (deve essere membro dello stesso gruppo con il ruolo di Educatore). Tocca il suo nome e confirma.',
        note: 'Solo gli utenti con il ruolo di Educatore all\'interno dello stesso gruppo possono essere co-educatori.',
      },
      {
        t: 'Rimuovi un co-educatore',
        d: 'Nella sezione "Co-educatori" del profilo della scuola, tocca il nome del co-educatore e scegli "Rimuovi co-educatore". L\'azione è immediata e l\'educatore perde l\'accesso al pannello della scuola.',
        warn: 'Rimuovere un co-educatore non elimina alcun dato. Tutta la cronologia di lezioni e pagamenti che ha registrato resta nel sistema.',
      },
      {
        t: 'Lascia il ruolo di co-educatore',
        d: 'Se sei co-educatore in una scuola e non vuoi più esserlo, vai al profilo della scuola → sezione "Co-educatori" → "Lascia ruolo co-educatore". Puoi farlo anche da "Profilo → Gestione → [nome scuola]" → "Lascia ruolo".',
      },
      {
        t: 'Trasferisci l\'amministrazione della scuola',
        d: 'Per passare il controllo completo della scuola a un altro educatore, vai al profilo della scuola → "Trasferisci amministrazione". Il destinatario deve essere un co-educatore attivo della scuola.',
        warn: '"Trasferisci amministrazione" è irreversibile: passi il controllo completo all\'altra persona. Il nuovo admin potrà modificare tutte le impostazioni della scuola.',
      },
    ],
  },
  {
    id: 'school-requests',
    title: 'Richieste di adesione alla scuola',
    category: 'Educatori',
    intro: 'Come gestire le richieste di adesione alla tua scuola dal pannello di amministrazione.',
    steps: [
      {
        t: 'Visualizza le richieste in sospeso',
        d: 'Vai al profilo della tua scuola → pulsante "Gestisci" → scheda "Richieste". Vedrai tutte le richieste di adesione in sospeso. Ogni card mostra nome, foto, data e il messaggio del richiedente (se ha usato la richiesta guidata).',
      },
      {
        t: 'Approva una richiesta',
        d: 'Tocca "Approva" sulla card del richiedente. L\'alunno riceverà una notifica di essere stato accettato e inizierà ad apparire nel tuo elenco alunni. Puoi assegnarlo immediatamente a un gruppo di lezione dalla scheda "Alunni".',
      },
      {
        t: 'Rifiuta una richiesta',
        d: 'Tocca "Rifiuta" sulla card del richiedente. L\'alunno riceverà una notifica che la sua richiesta non è stata approvata.',
        tip: 'Se rifiuti qualcuno per errore, l\'alunno può inviare una nuova richiesta.',
      },
      {
        t: 'Cronologia delle richieste elaborate',
        d: 'Sotto le richieste in sospeso troverai la cronologia delle richieste già elaborate: approvate (badge "Accettata") e rifiutate (badge "Rifiutata"). Le richieste elaborate restano nella cronologia e non possono essere eliminate.',
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Alunni e gruppi di lezione',
    category: 'Educatori',
    intro: 'Come visualizzare i tuoi alunni, aggiungere membri senza account e organizzarli per gruppo di lezione.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Il pannello di amministrazione della scuola',
        d: 'Accedi da "Profilo" → scheda "Gestione" → la tua scuola, oppure dal profilo della scuola toccando il pulsante admin. Troverai quattro schede: "Alunni", "Presenze", "Pagamenti" e "Report".',
      },
      {
        t: 'Visualizza l\'elenco alunni',
        d: 'Nella scheda "Alunni" vedrai tutti i membri collegati alla tua scuola con nome, corda attuale e percentuale di presenza mensile. Se non ci sono membri, l\'app mostra "Nessun membro".',
      },
      {
        t: 'Aggiungi un alunno senza account (membro fantasma)',
        d: 'Scorri nella scheda "Alunni" fino alla sezione "Alunni senza account". Tocca "Aggiungi alunno" per registrare manualmente un alunno che non usa l\'app. Inserisci il suo nome e i dettagli di base.',
        note: 'I membri fantasma possono ricevere graduazioni e avere registri di presenze e pagamenti, ma non possono accedere all\'app. Quando si registrano, puoi collegare il loro profilo per preservare la cronologia completa.',
      },
      {
        t: 'Crea e gestisci gruppi di lezione',
        d: 'Accedi alla gestione della scuola (icona ingranaggio o pulsante "Gestisci"). Lì puoi creare gruppi di lezione — insiemi di alunni organizzati per orario. Crea uno per ogni fascia orario (es. "Lun e Mer 19:00") e assegna gli alunni a ciascuno.',
        tip: 'Organizzare gli alunni in gruppi di lezione rende le presenze molto più veloci: la schermata presenze mostra solo gli alunni della fascia orario selezionata.',
      },
      {
        t: 'Visualizza il profilo di un singolo alunno',
        d: 'Tocca il nome di un alunno qualsiasi per vedere il suo profilo: nome, corda, percentuale di presenza del mese corrente, cronologia delle presenze mese per mese e registro pagamenti.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Controllo presenze',
    category: 'Educatori',
    intro: 'Come registrare la lezione di oggi, segnare presenti e assenti, e rivedere la cronologia.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Registra la lezione di oggi',
        d: 'Nel pannello di amministrazione della scuola → scheda "Presenze", vedrai "Nessuna lezione questo mese" se è la prima. Tocca "Registra lezione di oggi" per aprire il modulo della sessione.',
      },
      {
        t: 'Seleziona orario e gruppo di lezione',
        d: 'Nel modulo della sessione, seleziona l\'orario di oggi (uno di quelli configurati alla creazione della scuola) e il gruppo di lezione corrispondente. L\'app caricherà automaticamente gli alunni di quel gruppo.',
        tip: 'Se non hai gruppi di lezione configurati, l\'elenco mostrerà tutti gli alunni della scuola.',
      },
      {
        t: 'Segna presenti e assenti',
        d: 'Tocca il nome di ogni alunno per alternare tra presente (✓ verde) e assente. L\'elenco mostra prima gli alunni del gruppo di lezione selezionato, poi il resto della scuola, così i gruppi non si mescolano.',
      },
      {
        t: 'Salva la lezione',
        d: 'Tocca "Salva lezione". L\'app mostra una finestra di conferma con il conteggio di presenti e assenti. Tocca "Confirma" per registrare la sessione nel cloud. La percentuale di presenza di ogni alunno si aggiorna automaticamente.',
      },
      {
        t: 'Rivedi le sessioni precedenti',
        d: 'Nella scheda "Presenze", le sessioni appaiono in ordine cronologico. Tocca una sessione passata qualsiasi per vedere il dettaglio completo: chi era presente, chi era assente, e data e ora della registrazione.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Pagamenti e tesoreria',
    category: 'Educatori',
    intro: 'Come registrare le quote mensili, tracciare chi deve pagare ed esportare report.',
    mockup: 'finances',
    steps: [
      {
        t: 'La scheda "Pagamenti"',
        d: 'Nel pannello di amministrazione della scuola, vai alla scheda "Pagamenti". Ogni alunno appare con il suo stato di pagamento del mese corrente: "In sospeso", "Pagato", "Pagato (in ritardo)", "Scaduto" o "Gratuito". Gli stati sono calcolati automaticamente in base alla data.',
        warn: 'Se il mese è iniziato e un alunno non ha un pagamento registrato, il suo stato cambia automaticamente in "In sospeso" e poi in "Scaduto" dopo la data di scadenza configurata.',
      },
      {
        t: 'Registra il pagamento di un alunno',
        d: 'Tocca il nome dell\'alunno nella scheda "Pagamenti" e poi tocca "Registra pagamento". Inserisci l\'importo e seleziona il mese corrispondente. Lo stato dell\'alunno cambia immediatamente in "Pagato".',
        tip: 'Puoi registrare pagamenti anticipati per gli alunni che pagano in anticipo. Seleziona semplicemente il mese futuro corrispondente.',
      },
      {
        t: 'Vedi chi ha pagamenti in sospeso o scaduti',
        d: 'Nell\'elenco della scheda "Pagamenti" puoi vedere a colpo d\'occhio lo stato di tutti gli alunni. Gli stati "In sospeso" e "Scaduto" sono evidenziati. Vedrai anche il giorno di scadenza configurato.',
      },
      {
        t: 'Genera ed esporta il report mensile',
        d: 'Vai alla scheda "Report" del pannello della scuola. Seleziona il formato (CSV per Excel o Google Sheets, o PDF per stampare o condividere) e tocca "Genera report".',
        tip: 'CSV è ideale per l\'analisi su foglio di calcolo. PDF è utile per condividere con l\'amministrazione del gruppo o per archiviare.',
      },
    ],
  },
  {
    id: 'graduations',
    title: 'Sistema di graduazione',
    category: 'Educatori',
    intro: 'Come configurare le corde del tuo gruppo e registrare i cambi di livello.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Accedi al sistema di graduazione',
        d: 'Vai al profilo del tuo gruppo → scheda "Graduazioni". Se non ci sono ancora livelli configurati, vedrai "Nessun livello di graduazione definito" e un pulsante "Configura sistema ora".',
      },
      {
        t: 'Crea un livello di corda',
        d: 'Tocca "Aggiungi livello" o "Crea livello". Inserisci il nome della corda (es. "Corda Verde-Gialla"), seleziona i colori che la compongono e indica se ha punte colorate e quante. Salva il livello.',
        tip: 'Il colore visivo di ogni livello appare nei profili degli alunni e nella directory pubblica. Configuralo fedelmente in base alla corda reale.',
      },
      {
        t: 'Organizza per categoria',
        d: 'I livelli sono organizzati automaticamente in sezioni: "Sistema Adulti", "Sistema Giovani", "Sistema Bambini", "Istruttori in formazione" e "Livelli speciali". Assegna la categoria corretta quando crei o modifichi ogni livello.',
      },
      {
        t: 'Definisci il livello educatore',
        d: 'Puoi indicare a partire da quale corda un alunno è considerato "educatore" nel gruppo. Questo determina chi ha accesso alla creazione di scuole e agli strumenti di gestione.',
      },
      {
        t: 'Assegna una graduazione',
        d: 'Nel profilo del gruppo → "Graduazioni" → "Assegna graduazione". Trova l\'alunno, seleziona il nuovo livello e la data. La modifica viene registrata permanentemente nella cronologia dell\'alunno e la nuova corda appare immediatamente nel suo profilo.',
        tip: 'Puoi assegnare graduazioni in blocco per un batizado: seleziona più alunni contemporaneamente, scegli livello e data, e tutti vengono graduati in un unico passaggio.',
      },
      {
        t: 'Visualizza la cronologia delle graduazioni di un alunno',
        d: 'Tocca il nome di un membro qualsiasi del gruppo. Il suo profilo mostra la corda attuale con il suo colore. Tocca la corda per vedere la cronologia completa: ogni cambio di livello con data. La cronologia non può essere eliminata.',
      },
    ],
  },
  {
    id: 'manage-events',
    title: 'Creare e gestire eventi',
    category: 'Educatori',
    intro: 'Come pubblicare un batizado, una roda o un workshop per la comunità.',
    mockup: 'event',
    steps: [
      {
        t: 'Crea un evento',
        d: 'Tocca il pulsante "+" flottante nella schermata Home → "Nuovo evento". Puoi anche andare alla scheda "Eventi" e toccare "Nuovo evento" nell\'angolo superiore.',
      },
      {
        t: 'Compila i dettagli dell\'evento',
        d: 'Il modulo include: nome evento, categoria (batizado, roda, roda aperta, troca de corda, corso, lezione, workshop, seminario, festival, incontro, intensivo o sessione di allenamento), data, orario di inizio e di fine.',
      },
      {
        t: 'Aggiungi una descrizione e una locandina',
        d: 'Inserisci la descrizione con tutti i dettagli rilevanti (prezzo, requisiti, cosa portare, ecc.). Carica un\'immagine di copertina (locandina) dalla tua galleria per dare visibilità all\'evento.',
        tip: 'Gli eventi con locandina ottengono maggiore visibilità nei feed dei membri. Un\'immagine verticale con buona risoluzione appare meglio.',
      },
      {
        t: 'Posiziona la posizione sulla mappa',
        d: 'Inserisci l\'indirizzo dell\'evento. L\'app apre il selettore di mappa dove puoi trascinare il marcatore nella posizione esatta. I partecipanti vedranno la posizione e potranno aprire la navigazione direttamente dall\'evento.',
      },
      {
        t: 'Gestisci co-organizzatori e partecipanti',
        d: 'Dopo aver creato l\'evento, puoi aggiungere co-organizzatori nel menu di modifica → "Collaboratori". I co-organizzatori possono modificare l\'evento e vedere l\'elenco completo di chi ha segnato "Partecipo" o "Interessato".',
      },
    ],
  },
  {
    id: 'reports-kpi',
    title: 'Report e KPI',
    category: 'Educatori',
    intro: 'Come rivedere le metriche della tua scuola ed esportare dati per analisi esterne.',
    mockup: 'kpi',
    steps: [
      {
        t: 'Barra delle metriche rapide',
        d: 'In alto nel pannello di amministrazione della scuola vedrai una barra KPI: numero di alunni, lezioni svolte questo mese, percentuale media di presenza, numero di alunni pagati e numero di scaduti.',
      },
      {
        t: 'La scheda "Report"',
        d: 'Vai al pannello della scuola → scheda "Report". Il sottotitolo dice "Presenze, pagamenti e statistiche della scuola". Qui generi il report mensile con tutte le informazioni consolidate.',
      },
      {
        t: 'Scegli il formato del report',
        d: 'Seleziona il formato di cui hai bisogno: "CSV" per aprire in Excel o Google Sheets per un\'analisi personalizzata, o "PDF" per un documento pronto da condividere o stampare.',
      },
      {
        t: 'Genera ed esporta',
        d: 'Tocca "Genera report". L\'app crea il file con un riepilogo mensile: alunni attivi, sessioni svolte, percentuale di presenza complessiva e stato di pagamento per alunno. Puoi condividerlo direttamente dalla schermata di esportazione.',
        tip: 'Genera il report alla fine di ogni mese per mantenere una registrazione storica della salute della tua scuola.',
      },
    ],
  },
]

// ─── Copy per locale ──────────────────────────────────────────────────────────

const COPY = {
  es: {
    title: 'Tutoriales de Capoeira',
    eyebrow: 'Documentación',
    heroTitle: 'Tutoriales de Agenda Capoeiragem',
    heroSubtitle: 'Guías paso a paso para alumnos, viajeros y educadores. Aprende a usar cada función con los textos exactos que verás en la app.',
    sections: SECTIONS_ES,
  },
  pt: {
    title: 'Tutoriais de Capoeira',
    eyebrow: 'Documentação',
    heroTitle: 'Tutoriais do Agenda Capoeiragem',
    heroSubtitle: 'Guias passo a passo para alunos, viajantes e educadores. Aprenda a usar cada função com os textos exatos que você verá no app.',
    sections: SECTIONS_PT,
  },
  en: {
    title: 'Capoeira Tutorials',
    eyebrow: 'Documentation',
    heroTitle: 'Agenda Capoeiragem tutorials',
    heroSubtitle: 'Step-by-step guides for students, travelers, and educators. Learn every feature using the exact text you will see in the app.',
    sections: SECTIONS_EN,
  },
  fr: {
    title: 'Tutoriels de Capoeira',
    eyebrow: 'Documentation',
    heroTitle: 'Tutoriels Agenda Capoeiragem',
    heroSubtitle: 'Guides pas à pas pour les élèves, les voyageurs et les éducateurs. Apprenez chaque fonctionnalité avec les textes exacts que vous verrez dans l\'app.',
    sections: SECTIONS_FR,
  },
  de: {
    title: 'Capoeira Tutorials',
    eyebrow: 'Dokumentation',
    heroTitle: 'Agenda Capoeiragem Tutorials',
    heroSubtitle: 'Schritt-für-Schritt-Anleitungen für Schüler, Reisende und Lehrer. Lerne jede Funktion mit dem genauen Text, den du in der App siehst.',
    sections: SECTIONS_DE,
  },
  it: {
    title: 'Tutorial di Capoeira',
    eyebrow: 'Documentazione',
    heroTitle: 'Tutorial di Agenda Capoeiragem',
    heroSubtitle: 'Guide passo dopo passo per alunni, viaggiatori ed educatori. Impara ogni funzione con il testo esatto che vedrai nell\'app.',
    sections: SECTIONS_IT,
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)
  const description = getSiteDescription(locale)
  return {
    title: copy.title,
    description,
    keywords: [
      'cómo usar capoeira app', 'tutorial capoeira', 'guía capoeira', 'app capoeira',
      'gestión grupo capoeira', 'agenda capoeiragem tutorial', 'clases capoeira app',
      'how to use capoeira app', 'capoeira training management',
    ],
    alternates: { canonical: getLocalizedUrl(locale, '/tutoriales'), languages: getLanguageAlternateUrls('/tutoriales') },
    openGraph: {
      title: formatPageTitle(copy.title),
      description,
      url: getLocalizedUrl(locale, '/tutoriales'),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
    },
  }
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params
  const c = getCopy(locale)

  const navSections: NavSection[] = c.sections.map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
  }))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.sections.map((s) => ({
      '@type': 'Question',
      name: s.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: [s.intro, ...s.steps.map((step) => `${step.t}: ${step.d}`)].join(' '),
      },
    })),
  }

  const howToSchemas = c.sections.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: s.title,
    description: s.intro,
    step: s.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.t,
      text: step.d,
    })),
  }))

  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {howToSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <TutorialsHero copy={c} />

      <div className="page-shell pb-24 lg:pb-32">
        <div className="grid gap-8 pt-10 lg:grid-cols-[220px_1fr] lg:gap-12 lg:pt-12">
          <TutorialsNav sections={navSections} />

          <div>
            {c.sections.map((section) => (
              <TutorialSectionBlock
                key={section.id}
                id={section.id}
                title={section.title}
                category={section.category}
                intro={section.intro}
                steps={section.steps}
                mockup={section.mockup}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  )
}
