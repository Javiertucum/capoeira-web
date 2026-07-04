import type { Metadata } from 'next'
import { escapeJsonLd, formatPageTitle, getLanguageAlternates, getLanguageAlternateUrls, getLocalizedPath, getLocalizedUrl, getOgLocale, getSiteDescription, SITE_NAME } from '@/lib/site'
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
        d: 'Completa nombre, apellido, apodo (opcional), país (detectado automáticamente), tu rol (Practicante o Educador — es un campo más del mismo formulario), correo y contraseña.',
        tip: 'Elige "Educador" si ya enseñas capoeira — esto desbloquea las herramientas de gestión desde el inicio. Puedes cambiarlo después.',
        note: 'Para registrarte con Google en vez de llenar el formulario, hazlo desde la pantalla de inicio de sesión (no disponible en la versión web).',
      },
      {
        t: 'Completa el onboarding',
        d: 'Tras el registro, un asistente te guía paso a paso. Si eres alumno: completa tu perfil, busca tu grupo y elige tu núcleo. Si eres educador: completa tu perfil, elige si te unes a un grupo existente o creas el tuyo, y termina creando tu núcleo.',
        note: 'El paso de perfil te pide elegir un género antes de poder continuar.',
      },
      {
        t: 'Vincula tu grupo',
        d: 'Si terminaste el onboarding sin unirte a un grupo, verás en Inicio la tarjeta "Aún no perteneces a un grupo" con los botones "Buscar grupo" y "Solicitud guiada" (y "Crear grupo" si eres educador).',
        warn: 'Sin un grupo vinculado, no podrás ver los eventos ni el historial de graduaciones de tu comunidad. Las funciones de asistencia y pagos tampoco estarán disponibles.',
      },
      {
        t: '¿Olvidaste tu contraseña?',
        d: 'En la pantalla de inicio de sesión, toca "¿Olvidaste tu contraseña?". Ingresa tu correo y toca "Enviar enlace". Recibirás un correo con el enlace — tócalo para crear una nueva contraseña. Luego regresa a la app y toca "Volver al login".',
        note: 'Si el correo no llega en unos minutos, revisa la carpeta de spam.',
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
        d: 'La pestaña "Inicio" muestra un saludo personalizado con tu nombre y la sección "Próximos eventos" con los eventos de tu comunidad en orden cronológico. Si tienes notificaciones pendientes, aparece un badge rojo en la pestaña "Perfil".',
        tip: 'Desliza hacia abajo para actualizar el feed en cualquier momento.',
      },
      {
        t: 'Filtra los próximos eventos',
        d: 'En la sección "Próximos eventos" encontrarás chips de filtro: "Todos", "Hoy", "Esta semana" y "Este mes". Tócalos para acotar la vista.',
      },
      {
        t: 'Búsqueda global',
        d: 'Toca la barra de búsqueda en la pantalla de Inicio para abrir la búsqueda global. Escribe cualquier término y verás resultados organizados en cuatro secciones: Eventos, Grupos, Núcleos y Usuarios.',
      },
      {
        t: 'Tarjetas y avisos de Inicio',
        d: 'Encima de "Próximos eventos" pueden aparecer tarjetas según tu situación: una solicitud tuya pendiente de aprobación, tu próxima clase (si entrenas en un núcleo) con tu racha de asistencia, o — si eres educador — un acceso directo para registrar la asistencia de hoy.',
      },
      {
        t: 'Accesos rápidos de educador',
        d: 'Si administras un solo núcleo, verás dos chips fijos debajo de los filtros: "Panel del núcleo" y "Registrar clase", para entrar directo a esas pantallas.',
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
        d: 'Toca cualquier grupo para ver su perfil. Es una sola pantalla con scroll: descripción, sección colapsable "Sistema de graduaciones", una tarjeta "Jerarquía" (abre el árbol de educadores en una pantalla aparte) y los próximos eventos del grupo.',
      },
      {
        t: 'Solicitar unirse a un grupo',
        d: 'El botón "Solicitar unirse al grupo" aparece en el perfil solo si eres educador (o tienes graduación de educador) sin grupo todavía. Tu solicitud queda con el badge "Solicitud pendiente de aprobación".',
        tip: 'Si eres alumno sin grupo, usa "Solicitud guiada": te lleva paso a paso a elegir el núcleo (y su educador) antes de enviar la solicitud.',
      },
      {
        t: 'Ver la jerarquía del grupo',
        d: 'Toca la tarjeta "Jerarquía" en el perfil del grupo para abrir el árbol completo de educadores, con buscador por nombre. Toca cualquier educador para ver su perfil público.',
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
        d: 'Junto al toggle de vista tienes 3 chips rápidos: "Gratis", "Online" y "Este finde". Para más opciones, toca "Filtros": categoría (batizado, roda, roda abierta, troca de corda, curso, workshop, seminario, festival, encuentro, intensivo, treino, o una categoría personalizada), precio, formato, fechas, grupo y ubicación.',
        tip: 'Puedes combinar varios filtros al mismo tiempo.',
      },
      {
        t: 'Detalle de un evento',
        d: 'Toca cualquier evento para ver la descripción completa, fecha y hora, ubicación en el mapa, organizadores y el póster si tiene. También verás cuántas personas van ("Voy") y cuántas marcaron interés ("Me interesa"), con una tira de avatares de quién va.',
      },
      {
        t: 'Confirmar "Voy" o "Me interesa"',
        d: 'Desde el detalle del evento, toca "Me interesa" para guardarlo en tu lista, o "Voy" para confirmar tu asistencia. Tocar de nuevo el mismo botón quita tu confirmación.',
        tip: 'Los eventos que marcaste como "Voy" aparecen destacados en tu pantalla de Inicio.',
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
        t: 'Cómo está organizado tu perfil',
        d: 'La pestaña "Perfil" es una sola pantalla (sin pestañas internas): arriba tu foto, rol y grupo; luego un botón de "Actividad"; y más abajo las secciones según tu rol — "Gestión" (educadores, sus núcleos) o "Donde entreno" (alumnos, su asistencia y pagos).',
      },
      {
        t: 'Editar tu perfil',
        d: 'Toca el ícono de editar (lápiz) sobre tu foto o tu nombre. Puedes cambiar tu foto, nombre, apellido, apodo, una breve bio, país, fecha de nacimiento, género (obligatorio) y links a tus redes sociales (Instagram, Facebook, WhatsApp, YouTube, TikTok y sitio web). Guarda con "Guardar".',
        tip: 'Una imagen cuadrada se ve mejor en el círculo de perfil.',
      },
      {
        t: 'Tu corda',
        d: 'Tu corda actual aparece con su color y nombre debajo de tu nombre en el perfil. Tocarla te lleva al sistema de graduación completo de tu grupo (todos los niveles), no a un historial personal de tus propios ascensos.',
      },
      {
        t: 'Configuración: idioma y tema',
        d: 'Desde "Perfil" toca "Configuración". Ahí cambias el idioma (español, portugués, inglés, francés, alemán, italiano) y el tema visual (claro u oscuro). Los cambios se aplican de inmediato.',
      },
      {
        t: 'Notificaciones push: elige qué quieres recibir',
        d: 'En "Configuración → Notificaciones" activa o desactiva cada tipo por separado: recordatorios de evento, eventos nuevos de tu grupo, eventos cerca de ti, resumen semanal y novedades de tu comunidad.',
        tip: 'Si activas la ubicación por GPS, la app detecta tu país actual para avisarte de eventos relevantes aunque estés de viaje.',
      },
      {
        t: 'Actividad: solicitudes y próximos eventos',
        d: 'Toca el botón "Actividad" en tu perfil para ver tus próximos eventos confirmados y tus solicitudes pendientes: de grupo, de núcleo, de educador, de transferencia de núcleo y de colaboración en eventos. El badge rojo en la pestaña "Perfil" indica cuántas tienes sin revisar.',
      },
      {
        t: 'Tutoriales y reportar un problema',
        d: 'Ve a "Perfil" → "Configuración" → "Soporte". Ahí encuentras "Tutoriales" (te trae de vuelta a esta página) y "Reportar un problema" — tu reporte llega directamente al equipo de desarrollo con información técnica de tu dispositivo adjunta automáticamente.',
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
        d: 'Si cambias de dispositivo o reinstalas la app, ve a "Perfil" → "Suscripción" → "Restaurar compras" para recuperar tu plan activo sin pagar nuevamente.',
        tip: 'Usa la misma cuenta de Google o Apple que usaste para comprar el plan.',
      },
    ],
  },
  {
    id: 'unirte-a-un-nucleo',
    title: 'Unirte a un núcleo',
    category: 'Practicantes',
    intro: 'Cómo encontrar un núcleo, enviar una solicitud y qué ocurre después.',
    steps: [
      {
        t: 'Busca tu núcleo',
        d: 'Ve a la pestaña "Grupos", busca tu grupo por nombre (o filtra por país/estilo) y entra a su perfil. Desde ahí puedes llegar al núcleo donde entrenas.',
      },
      {
        t: 'Únete al núcleo',
        d: 'En el perfil del núcleo, toca "Unirse". Tu solicitud queda pendiente hasta que el educador la apruebe.',
        tip: 'Si todavía no tienes grupo, usa "Solicitud guiada" desde el perfil del grupo: te lleva paso a paso a elegir tu núcleo antes de enviar la solicitud.',
      },
      {
        t: 'Espera la aprobación',
        d: 'Tu solicitud queda como "Pendiente" hasta que el educador la apruebe o rechace. Recibirás una notificación cuando haya respuesta.',
        warn: 'Solo el educador responsable (o un co-educador) puede aprobar solicitudes.',
      },
      {
        t: 'Accede a tu actividad',
        d: 'Una vez aprobado, el núcleo aparece en tu perfil, en la sección "Donde entreno" — con tu estado de pago y acceso a tus estadísticas de entrenamiento.',
      },
    ],
  },
  {
    id: 'tu-historial',
    title: 'Tu historial personal',
    category: 'Practicantes',
    intro: 'Cómo ver tu asistencia, tu racha de entrenamiento y el estado de tus pagos.',
    steps: [
      {
        t: 'Donde entreno',
        d: 'En tu perfil, la sección "Donde entreno" lista cada núcleo al que perteneces con un badge de estado de pago (Pagado, Pendiente, Vencido, Gratis...) y, si tienes un pago pendiente, un botón "Reportar pago".',
        note: 'El estado de pago solo es visible para ti y tu educador.',
      },
      {
        t: 'Mi actividad',
        d: 'Toca "Ver estadísticas" en cualquiera de tus núcleos para abrir "Mi actividad": tu racha de clases seguidas, cuántas clases llevas este mes / en los últimos 30 días / en el año, un gráfico de frecuencia, tus sesiones recientes y tu historial de pagos. Puedes compartir tus estadísticas con el botón dedicado.',
      },
      {
        t: 'Tu corda',
        d: 'Tu corda actual aparece en tu perfil. Tocarla te lleva al sistema de graduación completo de tu grupo — no existe un historial personal separado de tus propios ascensos, pero tu corda vigente siempre está visible ahí.',
      },
      {
        t: 'Eventos confirmados',
        d: 'Toca "Actividad" en tu perfil para ver los próximos eventos a los que confirmaste "Voy".',
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
        d: 'Si eres educador y todavía no tienes grupo, verás un banner "Crear grupo" en Inicio o "Crear nuevo grupo" en la pestaña "Grupos". Tócalo para abrir el formulario.',
        note: 'Solo los usuarios con rol de Educador pueden crear grupos.',
      },
      {
        t: 'Nombre y descripción',
        d: 'Ingresa el nombre oficial de tu grupo y una descripción. Ambos son obligatorios. El nombre aparecerá en el directorio, en los perfiles de los miembros y en tus eventos.',
      },
      {
        t: 'Estilo de capoeira (obligatorio)',
        d: 'En el campo "Estilo de capoeira *" escribe el estilo que practicas (ej: Mixta, Benguela, Angola, Regional). Es texto libre y obligatorio — se usa como nombre de tu sistema de graduación.',
        tip: 'El campo "Ciudad" es opcional.',
      },
      {
        t: 'Logo del grupo (opcional)',
        d: 'Sube el logo desde tu galería. Aparecerá en el perfil del grupo, en sus núcleos y en la tarjeta que ven tus alumnos en Inicio.',
      },
      {
        t: 'Crear el grupo',
        d: 'Toca "Crear". Si el nombre no está duplicado, el grupo queda creado de inmediato y entras directo a su perfil.',
      },
      {
        t: 'Invitar miembros',
        d: 'No hay código de invitación. Comparte el nombre de tu grupo con tus alumnos: ellos lo buscan en la pestaña "Grupos" y solicitan ingreso. También puedes agregarlos directamente desde el panel de tu núcleo.',
      },
    ],
  },
  {
    id: 'administrar-grupo',
    title: 'Administrar tu grupo',
    category: 'Educadores',
    intro: 'Cómo gestionar solicitudes, roles de administrador y la información del grupo.',
    steps: [
      {
        t: 'Aprobar o rechazar solicitudes de ingreso al grupo',
        d: 'Las solicitudes de ingreso al grupo se responden desde "Actividad" en tu perfil, junto con las demás notificaciones. Toca la solicitud para aprobarla o rechazarla.',
        note: 'Solo ves estas solicitudes si administras el grupo.',
      },
      {
        t: 'Asignar roles: admin y co-admin',
        d: 'Desde el perfil del grupo, entra al panel de administración (visible solo para administradores y co-administradores). Ahí puedes activar o quitar el rol "Administrador" o "Co-administrador" a cualquier miembro, o quitarte tu propio rol con "Dejar admin".',
        note: 'Estos cambios son reversibles.',
      },
      {
        t: 'Editar la información del grupo',
        d: 'Ve al perfil del grupo → ícono de editar. Puedes cambiar el logo, nombre, descripción y estilo de capoeira. Los cambios se reflejan de inmediato en el directorio público.',
      },
    ],
  },
  {
    id: 'supervision-educativa',
    title: 'Supervisión educativa',
    category: 'Educadores',
    intro: 'Cómo asignar un educador supervisor para los alumnos de tu núcleo.',
    steps: [
      {
        t: 'Qué es la supervisión educativa',
        d: 'La supervisión educativa es la relación jerárquica entre educadores de un mismo grupo. Un educador más experimentado puede supervisar el progreso de los alumnos de otro educador, especialmente en distintas ciudades o países.',
      },
      {
        t: 'Supervisión automática (mismo núcleo)',
        d: 'Si el supervisor y los alumnos comparten el mismo núcleo, la supervisión es automática — verás el badge "Comparte núcleo" en el perfil del alumno.',
      },
      {
        t: 'Supervisión manual (fuera del núcleo)',
        d: 'Si no tienes núcleo propio, elige supervisores manualmente: en la pantalla de supervisión, toca directamente al educador en la lista de "Supervisores sugeridos" y luego "Guardar cambios". Los alumnos supervisados así aparecen con el badge "Fuera de tu núcleo".',
        tip: 'Solo los educadores del mismo grupo pueden asignarse como supervisores.',
      },
      {
        t: 'Ver el árbol de supervisión',
        d: 'En el perfil del grupo, toca la tarjeta "Jerarquía" para abrir el árbol completo de educadores y quién supervisa a quién.',
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
        d: 'Ve a "Perfil" → sección "Gestión" → botón "Crear núcleo". Si estás creando tu primer grupo, este paso también aparece dentro del asistente de configuración inicial.',
        note: 'Necesitas ser educador de un grupo para crear un núcleo. Si acabas de crear tu grupo, ya tienes ese rol.',
      },
      {
        t: 'Ingresa el nombre y la ubicación',
        d: 'Completa "Nombre del núcleo" (ej: Núcleo Centro), "Ubicación" (dirección completa), "País" y "Ciudad". Todos son obligatorios.',
        tip: 'Después de ingresar la dirección, toca el mapa para mover el marcador a la posición exacta.',
      },
      {
        t: 'Agrega los horarios de entrenamiento',
        d: 'En "Horarios de entrenamiento", toca "Agregar horario": día de la semana, hora de inicio y hora de fin. Al menos un horario es obligatorio.',
        warn: 'Las turmas (grupos de alumnos por horario) solo se pueden configurar en este momento — no hay forma de agregarlas más adelante. Si entrenas con niveles distintos en horarios distintos, defínelo ahora.',
      },
      {
        t: 'Crea el núcleo',
        d: 'Toca "Crear núcleo". Si todos los campos están completos, el núcleo queda creado y visible en el directorio.',
      },
      {
        t: 'Editar o eliminar el núcleo',
        d: 'Para editar nombre, dirección u horarios, ve al perfil del núcleo → ícono de editar. "Eliminar núcleo" es un borrado permanente, disponible solo para el educador responsable — no existe una opción para solo ocultarlo del directorio.',
        warn: 'Eliminar un núcleo es irreversible.',
      },
      {
        t: 'Configurar el sistema de cobros',
        d: 'Dentro de "Editar núcleo" encontrarás la sección de cobros. Activa "Clases gratuitas" si no cobras mensualidad. Si cobras, ingresa el precio mensual, la moneda y el día del mes en que vence el pago.',
        tip: 'Si tienes alumnos con tarifas distintas por horario, cada turma puede tener su propio precio.',
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
        d: 'Un co-educador es un educador del mismo grupo que ayuda a gestionar tu núcleo: registra clases, marca asistencia, registra pagos y puede editar los datos del núcleo. Solo eliminar el núcleo o transferir la responsabilidad quedan reservados al educador responsable.',
      },
      {
        t: 'Agregar un co-educador',
        d: 'Ve al panel administrativo de tu núcleo → pestaña "Equipo" (solo visible para el educador responsable). Elige de la lista de educadores del grupo y confirma.',
      },
      {
        t: 'Quitar un co-educador',
        d: 'En la pestaña "Equipo", toca el nombre del co-educador y elige "Quitar co-educador".',
        warn: 'Quitar un co-educador no borra ningún dato: todo lo que registró permanece en el sistema.',
      },
      {
        t: 'Salir del rol de co-educador',
        d: 'Si eres co-educador de un núcleo y ya no quieres serlo, ve al perfil público del núcleo y toca "Salir del rol".',
      },
      {
        t: 'Transferir la responsabilidad del núcleo',
        d: 'Desde la pestaña "Equipo", el educador responsable puede transferir la responsabilidad a un co-educador activo. Quien transfiere queda como co-educador del núcleo.',
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
        d: 'Ve al panel administrativo de tu núcleo → pestaña "Solicitudes". Verás todas las solicitudes de ingreso pendientes, con el nombre del solicitante, su foto y la fecha.',
      },
      {
        t: 'Aprobar o rechazar una solicitud',
        d: 'En cada tarjeta, toca el ícono ✓ para aprobar o el ícono ✕ para rechazar. El solicitante recibe una notificación con la respuesta, y si lo apruebas, aparece de inmediato en tu lista de alumnos.',
        tip: 'Si rechazas a alguien por error, puede volver a enviar una solicitud.',
      },
    ],
  },
  {
    id: 'nucleo-alumnos',
    title: 'Alumnos y turmas',
    category: 'Educadores',
    intro: 'Cómo ver tus alumnos y agregar miembros sin cuenta en la app.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Panel administrativo del núcleo',
        d: 'Desde "Perfil" → sección "Gestión" → tu núcleo, o desde el perfil del núcleo tocando el botón de administración. Encontrarás las pestañas "Asistencia" (la que abre por defecto), "Alumnos", "Pagos" y "Reportes".',
      },
      {
        t: 'Ver la lista de alumnos',
        d: 'En la pestaña "Alumnos" verás todos los miembros vinculados a tu núcleo con su nombre, corda actual y porcentaje de asistencia del mes.',
      },
      {
        t: 'Agregar un alumno sin cuenta (ghost member)',
        d: 'En la pestaña "Alumnos", toca el ícono "+" para registrar manualmente a un alumno que no usa la app. Ingresa su nombre y datos básicos.',
        note: 'Los alumnos sin cuenta pueden recibir graduaciones y tener registro de asistencia y pagos igual que cualquier otro alumno. Cuando se registren en la app, puedes vincular su perfil para conservar todo el historial.',
      },
      {
        t: 'Turmas',
        d: 'Las turmas (grupos de alumnos por horario) se definen una sola vez, al crear el núcleo — no hay una pantalla para agregar turmas nuevas después.',
        tip: 'Tener turmas hace que pasar lista sea más rápido: en la pantalla de asistencia solo ves los alumnos del horario seleccionado.',
      },
      {
        t: 'Ver el perfil individual de un alumno',
        d: 'Toca el nombre de cualquier alumno para ver su ficha: corda, porcentaje de asistencia del mes, historial de asistencia y registro de pagos.',
      },
    ],
  },
  {
    id: 'asistencia',
    title: 'Control de asistencia',
    category: 'Educadores',
    intro: 'Cómo registrar una clase, marcar presentes y revisar el historial.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Registrar una clase',
        d: 'En el panel del núcleo → pestaña "Asistencia", toca "Registrar clase de hoy". Puedes cambiar la fecha en el formulario para registrar una clase de otro día — la app ajusta los horarios disponibles según la fecha elegida.',
      },
      {
        t: 'Seleccionar horario y turma',
        d: 'En el formulario de sesión, selecciona el horario correspondiente. La app carga automáticamente la lista de alumnos de esa turma.',
        tip: 'Si no tienes turmas configuradas, la lista mostrará todos los alumnos del núcleo.',
      },
      {
        t: 'Marcar presentes y ausentes',
        d: 'Toca el nombre de cada alumno para alternar entre presente y ausente.',
      },
      {
        t: 'Suspender una clase',
        d: 'Si la clase no se dictó (feriado, lluvia, etc.), activa "Suspender clase" antes de guardar. Queda registrada con el badge "Suspendida" y no cuenta en la asistencia ni en los cobros.',
      },
      {
        t: 'Guardar la clase',
        d: 'Toca "Guardar clase". La app muestra un diálogo con el conteo de presentes y ausentes — toca "Confirmar" para registrar la sesión.',
      },
      {
        t: 'Revisar sesiones anteriores',
        d: 'En la pestaña "Asistencia", las clases aparecen en orden cronológico. Toca cualquier sesión pasada para ver el detalle o editarla.',
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
        d: 'En el panel administrativo del núcleo, ve a la pestaña "Pagos". Cada alumno aparece con su estado del mes: Pendiente, Pagado, Pagado (tarde), Vencido, Gratis, Reportado (el alumno avisó que pagó) o Duplicado.',
        warn: 'La pestaña "Pagos" solo aparece si el núcleo tiene "Clases gratuitas" desactivado.',
      },
      {
        t: 'Registrar el pago de un alumno',
        d: 'Toca el nombre de un alumno en la pestaña "Pagos" y luego "Registrar pago". Ingresa el monto, el mes correspondiente y, si aplica, un descuento (monto fijo o porcentaje) — útil para becas.',
        tip: 'Puedes registrar pagos adelantados: solo selecciona el mes futuro correspondiente.',
      },
      {
        t: 'Revisar un pago reportado por el alumno',
        d: 'Cuando un alumno reporta su pago desde su propio perfil, aparece en tu pestaña "Pagos" con la etiqueta "Reportado". Tócalo y edítalo como cualquier otro pago para cambiar su estado a "Pagado".',
      },
      {
        t: 'Ver quién tiene pagos pendientes o vencidos',
        d: 'En la lista de la pestaña "Pagos" verás de un vistazo el estado de todos los alumnos, incluido el día límite de pago configurado.',
      },
      {
        t: 'Generar y exportar el reporte mensual',
        d: 'Ve a la pestaña "Reportes" del panel del núcleo. Selecciona el formato (CSV o PDF) y toca "Generar reporte". Incluye el resumen de pagos y asistencia del mes.',
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
        d: 'Ve al perfil de tu grupo → sección colapsable "Sistema de graduaciones" → "Gestionar sistema completo" (o "Configurar sistema ahora" si aún no tienes niveles).',
      },
      {
        t: 'Crear un nivel de corda',
        d: 'Toca "Agregar nivel". Ingresa el nombre de la corda, selecciona los colores que la componen, e indica si tiene puntas pintadas y cuántas.',
      },
      {
        t: 'Organizar por categoría',
        d: 'Los niveles se organizan en secciones: adultos, juveniles, infantiles, estagiarios y niveles especiales. Asigna la categoría correcta al crear o editar cada nivel.',
      },
      {
        t: 'Definir el nivel de educador',
        d: 'Puedes marcar a partir de qué corda un alumno se considera "educador" en el grupo — esto determina quién tiene acceso a crear núcleos y a las herramientas de gestión.',
      },
      {
        t: 'Asignar una graduación',
        d: 'Desde la pantalla del sistema de graduación, toca "Asignar graduación a miembros". Busca al alumno, selecciona el nuevo nivel y la fecha. El cambio se muestra de inmediato en su perfil.',
      },
      {
        t: 'Ver la corda de un alumno',
        d: 'Toca el nombre de cualquier alumno de tu grupo para ver su corda actual con su color.',
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
        d: 'Ve a la pestaña "Eventos" y toca el botón flotante "+".',
      },
      {
        t: 'Completa los datos básicos',
        d: 'Ingresa el nombre del evento, la descripción y la categoría (batizado, roda, roda abierta, troca de corda, curso, workshop, seminario, festival, encuentro, intensivo, treino, o una categoría personalizada).',
      },
      {
        t: 'Fecha, póster y documentos',
        d: 'Define fecha de inicio y fin (con opción de recurrencia), sube una imagen de portada (póster) y, si necesitas compartir bases o reglamentos, adjunta un PDF de hasta 10MB.',
        tip: 'Los eventos con póster tienen mayor visibilidad en el feed de los miembros.',
      },
      {
        t: 'Precio y cronograma',
        d: 'Si el evento tiene costo, ingresa el precio y los métodos de pago aceptados (transferencia, efectivo, Mercado Pago, PayPal u otro). Si el evento tiene varias actividades, agrégalas en "Agenda" — cada bloque con su propio horario, descripción y lugar.',
        tip: 'Al agregar un bloque de agenda con lugar, la ubicación general del evento se deriva automáticamente de esos bloques.',
      },
      {
        t: 'Ubicación',
        d: 'Si no usaste el cronograma con lugares por bloque, ingresa la dirección del evento al final del formulario. La app abre el selector de mapa para ubicar el marcador exacto.',
      },
      {
        t: 'Editar un evento ya creado',
        d: 'Ve al detalle del evento → ícono de editar (disponible para el organizador y co-organizadores). Los cambios se ven de inmediato para todos.',
        warn: 'Quienes ya confirmaron "Voy" no reciben notificación automática si cambias la fecha o la ubicación.',
      },
      {
        t: 'Gestiona co-organizadores e invitados especiales',
        d: 'Desde el menú de edición del evento toca "Colaboradores". Elige el rol antes de invitar: "Coorganizador" (puede editar el evento) o "Invitado especial" (aparece destacado, sin permiso de edición). Busca por nombre y envía la invitación.',
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
        d: 'En la parte superior del panel administrativo del núcleo verás una franja con 3 datos: cantidad de alumnos, porcentaje de asistencia promedio y alumnos pagados sobre el total.',
      },
      {
        t: 'Saltar a otro mes desde el KPI',
        d: 'Toca la etiqueta del mes en esa franja para abrir un selector y saltar directamente a cualquier mes anterior.',
      },
      {
        t: 'La pestaña "Reportes"',
        d: 'Ve al panel del núcleo → pestaña "Reportes". Si tienes turmas configuradas, puedes filtrar todo el reporte por una turma específica usando los chips en la parte superior.',
      },
      {
        t: 'Elegir el formato y exportar',
        d: 'Selecciona "CSV" (para abrir en Excel o Google Sheets) o "PDF" (para compartir o imprimir) y toca "Generar reporte". Incluye alumnos activos, sesiones realizadas, porcentaje de asistencia y estado de pagos por alumno.',
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
        d: 'Preencha nome, sobrenome, apelido (opcional), país (detectado automaticamente), seu papel (Praticante ou Educador — é mais um campo do mesmo formulário), e-mail e senha.',
        tip: 'Escolha "Educador" se você já ensina capoeira — isso libera as ferramentas de gestão desde o início. Pode mudar depois.',
        note: 'Para se registrar com o Google em vez de preencher o formulário, faça isso na tela de login (não disponível na versão web).',
      },
      {
        t: 'Complete o onboarding',
        d: 'Após o cadastro, um assistente te guia passo a passo. Se você é aluno: complete seu perfil, busque seu grupo e escolha seu núcleo. Se é educador: complete seu perfil, escolha entrar em um grupo existente ou criar o seu, e termine criando seu núcleo.',
        note: 'A etapa de perfil pede para escolher um gênero antes de continuar.',
      },
      {
        t: 'Vincule seu grupo',
        d: 'Se você terminou o onboarding sem entrar em um grupo, verá na tela de Início o cartão "Você ainda não pertence a um grupo" com os botões "Buscar grupo" e "Solicitação guiada" (e "Criar grupo" se for educador).',
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
        d: 'A aba "Início" mostra uma saudação personalizada com seu nome e a seção "Próximos eventos" com os eventos da sua comunidade em ordem cronológica. Se houver notificações pendentes, aparece um badge vermelho na aba "Perfil".',
        tip: 'Deslize para baixo para atualizar o feed a qualquer momento.',
      },
      {
        t: 'Filtre os próximos eventos',
        d: 'Na seção "Próximos eventos" você encontrará chips de filtro: "Todos", "Hoje", "Esta semana" e "Este mês". Toque neles para refinar a visualização.',
      },
      {
        t: 'Busca global',
        d: 'Toque na barra de busca na tela de Início para abrir a busca global. Digite qualquer termo e verá resultados em quatro seções: Eventos, Grupos, Núcleos e Usuários.',
      },
      {
        t: 'Cartões e avisos da Início',
        d: 'Acima de "Próximos eventos" podem aparecer cartões conforme sua situação: uma solicitação sua pendente de aprovação, sua próxima aula (se você treina em um núcleo) com sua sequência de presença, ou — se você é educador — um acesso direto para registrar a presença de hoje.',
      },
      {
        t: 'Acessos rápidos de educador',
        d: 'Se você administra apenas um núcleo, verá dois chips fixos abaixo dos filtros: "Painel do núcleo" e "Registrar aula", para entrar direto nessas telas.',
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
        d: 'Um **grupo** é a organização de capoeira (a "escola" no sentido amplo, ex: Abadá Capoeira, Cordão de Ouro). Um **núcleo** é o local físico específico onde se treina dentro desse grupo — pode haver vários núcleos em cidades ou países diferentes. Você pertence a um grupo e treina em um núcleo.',
        note: 'Quando o app fala "seu núcleo" se refere ao local específico onde você treina. Quando fala "seu grupo" se refere à organização completa.',
      },
      {
        t: 'Explore os grupos',
        d: 'A aba "Grupos" mostra todos os grupos públicos registrados. Use a barra de busca ("Buscar grupo...") para filtrar por nome, e os menus de "País de presença" e "Estilo de capoeira" para refinar.',
      },
      {
        t: 'O perfil de um grupo',
        d: 'Toque em qualquer grupo para ver seu perfil. É uma única tela com rolagem: descrição, seção recolhível "Sistema de graduações", um cartão "Hierarquia" (abre a árvore de educadores em uma tela separada) e os próximos eventos do grupo.',
      },
      {
        t: 'Solicitar entrada em um grupo',
        d: 'O botão "Solicitar entrada no grupo" aparece no perfil só se você for educador (ou tiver graduação de educador) sem grupo ainda. Sua solicitação fica com o badge "Solicitação pendente de aprovação".',
        tip: 'Se você é aluno sem grupo, use "Solicitação guiada": ela te leva passo a passo a escolher o núcleo (e seu educador) antes de enviar a solicitação.',
      },
      {
        t: 'Ver a hierarquia do grupo',
        d: 'Toque no cartão "Hierarquia" no perfil do grupo para abrir a árvore completa de educadores, com busca por nome. Toque em qualquer educador para ver seu perfil público.',
      },
      {
        t: 'Ver o perfil de um membro',
        d: 'Toque no nome de qualquer educador ou membro para ver seu perfil: nome, apelido, grupo, corda atual e núcleos onde ensina ou treina.',
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
        d: 'A aba "Eventos" mostra um calendário interativo no topo e a lista de eventos abaixo. Toque em qualquer data para ver os eventos daquele dia, ou alterne entre visão de calendário e de lista com o botão no canto.',
      },
      {
        t: 'Filtre por categoria e mais',
        d: 'Ao lado do botão de alternar visão há 3 chips rápidos: "Grátis", "Online" e "Este fim de semana". Para mais opções, toque em "Filtros": categoria (batizado, roda, roda aberta, troca de corda, curso, workshop, seminário, festival, encontro, intensivo, treino, ou uma categoria personalizada), preço, formato, datas, grupo e localização.',
        tip: 'Você pode combinar vários filtros ao mesmo tempo.',
      },
      {
        t: 'Detalhes de um evento',
        d: 'Toque em qualquer evento para ver descrição completa, data e hora, localização no mapa, organizadores e o pôster. Você verá quantas pessoas vão ("Vou") e quantas marcaram interesse ("Tenho interesse"), com uma fileira de avatares de quem vai.',
      },
      {
        t: 'Confirmar "Vou" ou "Tenho interesse"',
        d: 'No detalhe do evento, toque "Tenho interesse" para salvá-lo na sua lista, ou "Vou" para confirmar presença. Tocar novamente no mesmo botão remove sua confirmação.',
        tip: 'Os eventos que você marcou como "Vou" aparecem em destaque na sua tela de Início.',
      },
      {
        t: 'Compartilhar um evento',
        d: 'Use o botão compartilhar no detalhe do evento para enviá-lo pelo WhatsApp, Instagram ou outros apps.',
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
        t: 'Como seu perfil está organizado',
        d: 'A aba "Perfil" é uma única tela (sem abas internas): no topo sua foto, papel e grupo; depois um botão de "Atividade"; e mais abaixo as seções conforme seu papel — "Gestão" (educadores, seus núcleos) ou "Onde treino" (alunos, presença e pagamentos).',
      },
      {
        t: 'Editar seu perfil',
        d: 'Toque no ícone de editar (lápis) sobre sua foto ou nome. Você pode mudar foto, nome, sobrenome, apelido, uma breve bio, país, data de nascimento, gênero (obrigatório) e links das suas redes sociais (Instagram, Facebook, WhatsApp, YouTube, TikTok e site). Salve tocando "Salvar".',
        tip: 'Uma imagem quadrada fica melhor no círculo de perfil.',
      },
      {
        t: 'Sua corda',
        d: 'Sua corda atual aparece com cor e nome abaixo do seu nome no perfil. Tocar nela leva ao sistema de graduação completo do seu grupo (todos os níveis), não a um histórico pessoal das suas próprias promoções.',
      },
      {
        t: 'Configurações: idioma e tema',
        d: 'Em "Perfil", toque "Configurações". Lá você muda o idioma (espanhol, português, inglês, francês, alemão, italiano) e o tema visual (claro ou escuro). As mudanças se aplicam imediatamente.',
      },
      {
        t: 'Notificações push: escolha o que quer receber',
        d: 'Em "Configurações → Notificações" ative ou desative cada tipo separadamente: lembretes de evento, novos eventos do seu grupo, eventos perto de você, resumo semanal e novidades da sua comunidade.',
        tip: 'Se ativar a localização por GPS, o app detecta seu país atual para avisar sobre eventos relevantes mesmo em viagem.',
      },
      {
        t: 'Atividade: solicitações e próximos eventos',
        d: 'Toque no botão "Atividade" no seu perfil para ver seus próximos eventos confirmados e suas solicitações pendentes: de grupo, de núcleo, de educador, de transferência de núcleo e de colaboração em eventos. O badge vermelho na aba "Perfil" indica quantas você tem sem revisar.',
      },
      {
        t: 'Reportar um problema',
        d: 'Vá em "Perfil" → "Configurações" → "Reportar um problema". Seu relato vai diretamente à equipe de desenvolvimento.',
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
    intro: 'Como encontrar um núcleo, enviar uma solicitação e o que acontece depois.',
    steps: [
      {
        t: 'Busque seu núcleo',
        d: 'Vá à aba "Grupos", busque seu grupo pelo nome (ou filtre por país/estilo) e entre no perfil dele. De lá você pode chegar ao núcleo onde treina.',
      },
      {
        t: 'Entre no núcleo',
        d: 'No perfil do núcleo, toque "Entrar". Sua solicitação fica pendente até o educador aprovar.',
        tip: 'Se você ainda não tem grupo, use "Solicitação guiada" no perfil do grupo: ela te leva passo a passo a escolher seu núcleo antes de enviar a solicitação.',
      },
      {
        t: 'Aguarde a aprovação',
        d: 'Sua solicitação fica como "Pendente" até o educador aprovar ou rejeitar. Você receberá uma notificação quando houver resposta.',
        warn: 'Só o educador responsável (ou um co-educador) pode aprovar solicitações.',
      },
      {
        t: 'Acesse sua atividade',
        d: 'Após a aprovação, o núcleo aparece no seu perfil, na seção "Onde treino" — com seu status de pagamento e acesso às suas estatísticas de treino.',
      },
    ],
  },
  {
    id: 'seu-historico',
    title: 'Seu histórico pessoal',
    category: 'Praticantes',
    intro: 'Como ver sua presença, sua sequência de treino e o status dos seus pagamentos.',
    steps: [
      {
        t: 'Onde treino',
        d: 'No seu perfil, a seção "Onde treino" lista cada núcleo ao qual você pertence com um badge de status de pagamento (Pago, Pendente, Vencido, Gratuito...) e, se tiver um pagamento pendente, um botão "Reportar pagamento".',
        note: 'O status de pagamento é visível apenas para você e seu educador.',
      },
      {
        t: 'Minha atividade',
        d: 'Toque em "Ver estatísticas" em qualquer um dos seus núcleos para abrir "Minha atividade": sua sequência de aulas seguidas, quantas aulas você fez este mês / nos últimos 30 dias / no ano, um gráfico de frequência, suas sessões recentes e seu histórico de pagamentos. Você pode compartilhar suas estatísticas com o botão dedicado.',
      },
      {
        t: 'Sua corda',
        d: 'Sua corda atual aparece no seu perfil. Tocar nela leva ao sistema de graduação completo do seu grupo — não existe um histórico pessoal separado das suas próprias promoções, mas sua corda vigente está sempre visível ali.',
      },
      {
        t: 'Eventos confirmados',
        d: 'Toque em "Atividade" no seu perfil para ver os próximos eventos nos quais confirmou "Vou".',
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
        d: 'Se você é educador e ainda não tem grupo, verá um banner "Criar grupo" na Início ou "Criar novo grupo" na aba "Grupos". Toque para abrir o formulário.',
        note: 'Apenas usuários com o papel de Educador podem criar grupos.',
      },
      {
        t: 'Nome e descrição',
        d: 'Insira o nome oficial do seu grupo e uma descrição. Ambos são obrigatórios. O nome aparecerá no diretório, nos perfis dos membros e nos seus eventos.',
      },
      {
        t: 'Estilo de capoeira (obrigatório)',
        d: 'No campo "Estilo de capoeira *" escreva o estilo que você pratica (ex: Mista, Benguela, Angola, Regional). É texto livre e obrigatório — usado como nome do seu sistema de graduação.',
        tip: 'O campo "Cidade" é opcional.',
      },
      {
        t: 'Logo do grupo (opcional)',
        d: 'Envie o logo da galeria. Aparecerá no perfil do grupo, nos núcleos e no cartão que seus alunos veem na Início.',
      },
      {
        t: 'Criar o grupo',
        d: 'Toque "Criar". Se o nome não estiver duplicado, o grupo é criado imediatamente e você entra direto no perfil dele.',
      },
      {
        t: 'Convidar membros',
        d: 'Não há código de convite. Compartilhe o nome do seu grupo com seus alunos: eles buscam na aba "Grupos" e solicitam entrada. Você também pode adicioná-los diretamente pelo painel do seu núcleo.',
      },
    ],
  },
  {
    id: 'administrar-grupo',
    title: 'Administrar seu grupo',
    category: 'Educadores',
    intro: 'Como gerenciar solicitações, papéis de administrador e as informações do grupo.',
    steps: [
      {
        t: 'Aprovar ou rejeitar solicitações de entrada no grupo',
        d: 'As solicitações de entrada no grupo são respondidas em "Atividade" no seu perfil, junto com as demais notificações. Toque na solicitação para aprovar ou rejeitar.',
        note: 'Você só vê essas solicitações se administra o grupo.',
      },
      {
        t: 'Atribuir papéis: admin e co-admin',
        d: 'No perfil do grupo, entre no painel de administração (visível apenas para administradores e co-administradores). Lá você pode ativar ou remover o papel "Administrador" ou "Co-administrador" de qualquer membro, ou remover o seu próprio com "Deixar admin".',
        note: 'Essas mudanças são reversíveis.',
      },
      {
        t: 'Editar as informações do grupo',
        d: 'Vá ao perfil do grupo → ícone de editar. Você pode mudar o logo, nome, descrição e estilo de capoeira. As mudanças refletem imediatamente no diretório público.',
      },
    ],
  },
  {
    id: 'supervisao-educativa',
    title: 'Supervisão educativa',
    category: 'Educadores',
    intro: 'Como atribuir um educador supervisor para os alunos do seu núcleo.',
    steps: [
      {
        t: 'O que é a supervisão educativa',
        d: 'A supervisão educativa é a relação hierárquica entre educadores de um mesmo grupo. Um educador mais experiente pode supervisionar o progresso dos alunos de outro educador, especialmente útil quando estão em cidades ou países diferentes.',
      },
      {
        t: 'Supervisão automática (mesmo núcleo)',
        d: 'Se o supervisor e os alunos compartilham o mesmo núcleo, a supervisão é automática — você verá o badge "Compartilha núcleo" no perfil do aluno.',
      },
      {
        t: 'Supervisão manual (fora do núcleo)',
        d: 'Se você não tem núcleo próprio, escolha supervisores manualmente: na tela de supervisão, toque diretamente no educador na lista de "Supervisores sugeridos" e depois em "Salvar alterações". Os alunos supervisionados assim aparecem com o badge "Fora do seu núcleo".',
        tip: 'Apenas educadores do mesmo grupo podem ser atribuídos como supervisores.',
      },
      {
        t: 'Ver a árvore de supervisão',
        d: 'No perfil do grupo, toque no cartão "Hierarquia" para abrir a árvore completa de educadores e quem supervisiona quem.',
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
        d: 'Vá em "Perfil" → seção "Gestão" → botão "Criar núcleo". Se você estiver criando seu primeiro grupo, essa etapa também aparece dentro do assistente de configuração inicial.',
        note: 'Você precisa ser educador de um grupo para criar um núcleo. Se acabou de criar seu grupo, já tem esse papel.',
      },
      {
        t: 'Preencha nome e localização',
        d: 'Complete "Nome do núcleo" (ex: Núcleo Centro), "Localização" (endereço completo), "País" e "Cidade". Todos são obrigatórios.',
        tip: 'Após inserir o endereço, toque no mapa para mover o marcador para o ponto exato.',
      },
      {
        t: 'Adicione os horários de treino',
        d: 'Em "Horários de treinamento", toque "Adicionar horário": dia da semana, hora de início e hora de fim. Pelo menos um horário é obrigatório.',
        warn: 'As turmas (grupos de alunos por horário) só podem ser configuradas neste momento — não há como adicioná-las depois. Se você treina níveis diferentes em horários distintos, defina isso agora.',
      },
      {
        t: 'Crie o núcleo',
        d: 'Toque "Criar núcleo". Se todos os campos estão preenchidos, o núcleo é criado e fica visível no diretório.',
      },
      {
        t: 'Editar ou excluir o núcleo',
        d: 'Para editar nome, endereço ou horários, vá ao perfil do núcleo → ícone de editar. "Excluir núcleo" é uma exclusão permanente, disponível apenas para o educador responsável — não existe uma opção para apenas ocultá-lo do diretório.',
        warn: 'Excluir um núcleo é irreversível.',
      },
      {
        t: 'Configurar o sistema de cobrança',
        d: 'Dentro de "Editar núcleo" você encontra a seção de cobrança. Ative "Aulas gratuitas" se não cobra mensalidade. Se cobra, insira o valor mensal, a moeda e o dia do mês em que vence o pagamento.',
        tip: 'Se você tem alunos com valores diferentes por horário, cada turma pode ter seu próprio preço.',
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
        d: 'Um co-educador é um educador do mesmo grupo que ajuda a gerenciar seu núcleo: registra aulas, marca presença, registra pagamentos e pode editar os dados do núcleo. Apenas excluir o núcleo ou transferir a responsabilidade ficam reservados ao educador responsável.',
      },
      {
        t: 'Adicionar um co-educador',
        d: 'Vá ao painel administrativo do seu núcleo → aba "Equipe" (visível apenas para o educador responsável). Escolha na lista de educadores do grupo e confirme.',
      },
      {
        t: 'Remover um co-educador',
        d: 'Na aba "Equipe", toque no nome do co-educador e escolha "Remover co-educador".',
        warn: 'Remover um co-educador não apaga nenhum dado: tudo o que ele registrou permanece no sistema.',
      },
      {
        t: 'Sair do papel de co-educador',
        d: 'Se você é co-educador de um núcleo e não quer mais ser, vá ao perfil público do núcleo e toque "Sair do papel".',
      },
      {
        t: 'Transferir a responsabilidade do núcleo',
        d: 'Pela aba "Equipe", o educador responsável pode transferir a responsabilidade para um co-educador ativo. Quem transfere fica como co-educador do núcleo.',
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
        d: 'Vá ao painel administrativo do seu núcleo → aba "Solicitações". Você verá todas as solicitações de entrada pendentes, com o nome do solicitante, sua foto e a data.',
      },
      {
        t: 'Aprovar ou rejeitar uma solicitação',
        d: 'Em cada cartão, toque no ícone ✓ para aprovar ou no ícone ✕ para rejeitar. O solicitante recebe uma notificação com a resposta, e se você aprovar, ele aparece imediatamente na sua lista de alunos.',
        tip: 'Se rejeitar alguém por engano, ele pode enviar uma nova solicitação.',
      },
    ],
  },
  {
    id: 'nucleo-alunos',
    title: 'Alunos e turmas',
    category: 'Educadores',
    intro: 'Como ver seus alunos e adicionar membros sem conta no app.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Painel administrativo do núcleo',
        d: 'Acesse em "Perfil" → seção "Gestão" → seu núcleo, ou pelo perfil do núcleo tocando o botão de administração. Você encontrará as abas "Presença" (a que abre por padrão), "Alunos", "Pagamentos" e "Relatórios".',
      },
      {
        t: 'Ver a lista de alunos',
        d: 'Na aba "Alunos" você verá todos os membros vinculados ao seu núcleo, com nome, corda atual e porcentual de presença do mês.',
      },
      {
        t: 'Adicionar um aluno sem conta (ghost member)',
        d: 'Na aba "Alunos", toque no ícone "+" para registrar manualmente um aluno que não usa o app. Insira o nome e os dados básicos.',
        note: 'Alunos sem conta podem receber graduações e ter registro de presença e pagamentos como qualquer outro aluno. Quando se cadastrarem no app, você pode vincular o perfil para preservar todo o histórico.',
      },
      {
        t: 'Turmas',
        d: 'As turmas (grupos de alunos por horário) são definidas uma única vez, ao criar o núcleo — não há uma tela para adicionar turmas novas depois.',
        tip: 'Ter turmas torna a chamada mais rápida: na tela de presença você vê apenas os alunos do horário selecionado.',
      },
      {
        t: 'Ver o perfil individual de um aluno',
        d: 'Toque no nome de qualquer aluno para ver sua ficha: corda, porcentual de presença do mês, histórico de presença e registro de pagamentos.',
      },
    ],
  },
  {
    id: 'presenca',
    title: 'Controle de presença',
    category: 'Educadores',
    intro: 'Como registrar uma aula, marcar presentes e revisar o histórico.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Registrar uma aula',
        d: 'No painel do núcleo → aba "Presença", toque "Registrar aula de hoje". Você pode mudar a data no formulário para registrar uma aula de outro dia — o app ajusta os horários disponíveis conforme a data escolhida.',
      },
      {
        t: 'Selecionar horário e turma',
        d: 'No formulário de sessão, selecione o horário correspondente. O app carrega automaticamente a lista de alunos daquela turma.',
        tip: 'Se não tiver turmas configuradas, a lista mostrará todos os alunos do núcleo.',
      },
      {
        t: 'Marcar presentes e ausentes',
        d: 'Toque no nome de cada aluno para alternar entre presente e ausente.',
      },
      {
        t: 'Suspender uma aula',
        d: 'Se a aula não aconteceu (feriado, chuva, etc.), ative "Suspender aula" antes de salvar. Ela fica registrada com o badge "Suspensa" e não conta na presença nem nas cobranças.',
      },
      {
        t: 'Salvar a aula',
        d: 'Toque "Salvar aula". O app mostra um diálogo com o total de presentes e ausentes — toque "Confirmar" para registrar a sessão.',
      },
      {
        t: 'Revisar sessões anteriores',
        d: 'Na aba "Presença", as aulas aparecem em ordem cronológica. Toque em qualquer sessão passada para ver o detalhe ou editá-la.',
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
        d: 'No painel administrativo do núcleo, vá à aba "Pagamentos". Cada aluno aparece com seu status do mês: Pendente, Pago, Pago (atrasado), Vencido, Gratuito, Reportado (o aluno avisou que pagou) ou Duplicado.',
        warn: 'A aba "Pagamentos" só aparece se o núcleo tiver "Aulas gratuitas" desativado.',
      },
      {
        t: 'Registrar o pagamento de um aluno',
        d: 'Toque no nome do aluno na aba "Pagamentos" e depois em "Registrar pagamento". Insira o valor, o mês correspondente e, se aplicável, um desconto (valor fixo ou porcentagem) — útil para bolsas.',
        tip: 'Você pode registrar pagamentos antecipados: basta selecionar o mês futuro correspondente.',
      },
      {
        t: 'Revisar um pagamento reportado pelo aluno',
        d: 'Quando um aluno reporta seu pagamento pelo próprio perfil, ele aparece na sua aba "Pagamentos" com a etiqueta "Reportado". Toque e edite como qualquer outro pagamento para mudar o status para "Pago".',
      },
      {
        t: 'Ver quem tem pagamentos pendentes ou vencidos',
        d: 'Na lista da aba "Pagamentos" você vê de uma vez o status de todos os alunos, incluindo o dia limite de pagamento configurado.',
      },
      {
        t: 'Gerar e exportar o relatório mensal',
        d: 'Vá à aba "Relatórios" do painel do núcleo. Selecione o formato (CSV ou PDF) e toque "Gerar relatório". Inclui o resumo de pagamentos e presença do mês.',
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
        d: 'Vá ao perfil do seu grupo → seção recolhível "Sistema de graduações" → "Gerenciar sistema completo" (ou "Configurar sistema agora" se ainda não tiver níveis).',
      },
      {
        t: 'Criar um nível de corda',
        d: 'Toque "Adicionar nível". Insira o nome da corda, selecione as cores que a compõem, e indique se tem pontas pintadas e quantas.',
      },
      {
        t: 'Organizar por categoria',
        d: 'Os níveis se organizam em seções: adultos, juvenis, infantis, estagiários e níveis especiais. Atribua a categoria correta ao criar ou editar cada nível.',
      },
      {
        t: 'Definir o nível de educador',
        d: 'Você pode marcar a partir de qual corda um aluno é considerado "educador" no grupo — isso determina quem tem acesso a criar núcleos e às ferramentas de gestão.',
      },
      {
        t: 'Atribuir uma graduação',
        d: 'Na tela do sistema de graduação, toque "Atribuir graduação aos membros". Busque o aluno, selecione o novo nível e a data. A mudança aparece imediatamente no perfil dele.',
      },
      {
        t: 'Ver a corda de um aluno',
        d: 'Toque no nome de qualquer aluno do seu grupo para ver sua corda atual com a cor.',
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
        d: 'Vá à aba "Eventos" e toque no botão flutuante "+".',
      },
      {
        t: 'Preencha os dados básicos',
        d: 'Insira o nome do evento, a descrição e a categoria (batizado, roda, roda aberta, troca de corda, curso, workshop, seminário, festival, encontro, intensivo, treino, ou uma categoria personalizada).',
      },
      {
        t: 'Data, pôster e documentos',
        d: 'Defina data de início e fim (com opção de recorrência), envie uma imagem de capa (pôster) e, se precisar compartilhar regras ou regulamentos, anexe um PDF de até 10MB.',
        tip: 'Eventos com pôster têm maior visibilidade no feed dos membros.',
      },
      {
        t: 'Preço e cronograma',
        d: 'Se o evento tiver custo, insira o preço e os métodos de pagamento aceitos (transferência, dinheiro, Mercado Pago, PayPal ou outro). Se o evento tiver várias atividades, adicione-as em "Agenda" — cada bloco com seu próprio horário, descrição e local.',
        tip: 'Ao adicionar um bloco de agenda com local, a localização geral do evento é derivada automaticamente desses blocos.',
      },
      {
        t: 'Localização',
        d: 'Se você não usou o cronograma com locais por bloco, insira o endereço do evento no final do formulário. O app abre o seletor de mapa para posicionar o marcador exato.',
      },
      {
        t: 'Editar um evento já criado',
        d: 'Vá ao detalhe do evento → ícone de editar (disponível para o organizador e co-organizadores). As mudanças aparecem imediatamente para todos.',
        warn: 'Quem já confirmou "Vou" não recebe notificação automática se você mudar a data ou a localização.',
      },
      {
        t: 'Gerencie co-organizadores e convidados especiais',
        d: 'No menu de edição do evento toque "Colaboradores". Escolha o papel antes de convidar: "Co-organizador" (pode editar o evento) ou "Convidado especial" (aparece em destaque, sem permissão de edição). Busque pelo nome e envie o convite.',
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
        d: 'Na parte superior do painel administrativo do núcleo você verá uma faixa com 3 dados: quantidade de alunos, porcentual médio de presença e alunos pagos sobre o total.',
      },
      {
        t: 'Saltar para outro mês pelo KPI',
        d: 'Toque na etiqueta do mês nessa faixa para abrir um seletor e saltar direto para qualquer mês anterior.',
      },
      {
        t: 'A aba "Relatórios"',
        d: 'Vá ao painel do núcleo → aba "Relatórios". Se você tiver turmas configuradas, pode filtrar todo o relatório por uma turma específica usando os chips no topo.',
      },
      {
        t: 'Escolha o formato e exporte',
        d: 'Selecione "CSV" (para abrir no Excel ou Google Sheets) ou "PDF" (para compartilhar ou imprimir) e toque "Gerar relatório". Inclui alunos ativos, sessões realizadas, porcentual de presença e status de pagamentos por aluno.',
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
        d: 'Fill in your first name, last name, optional nickname, country (auto-detected), your role (Practitioner or Educator — just another field on the same form), email, and password.',
        tip: 'Choose "Educator" if you already teach capoeira — this unlocks the management tools from the start. You can change it later.',
        note: 'To sign up with Google instead of filling in the form, do it from the login screen (not available on web).',
      },
      {
        t: 'Complete the onboarding',
        d: 'After registration, a wizard guides you step by step. If you are a student: complete your profile, find your group, and pick your school. If you are an educator: complete your profile, choose whether to join an existing group or create your own, and finish by creating your school.',
        note: 'The profile step requires selecting a gender before you can continue.',
      },
      {
        t: 'Link your group',
        d: 'If you finished onboarding without joining a group, you will see the "You don\'t belong to a group yet" card on Home with "Find group" and "Guided request" buttons (and "Create group" if you are an educator).',
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
        d: 'The "Home" tab shows a personalized greeting with your name and the "Upcoming events" section with your community\'s events in chronological order. A red badge on the "Profile" tab indicates pending notifications.',
        tip: 'Pull down to refresh the feed at any time.',
      },
      {
        t: 'Filter upcoming events',
        d: 'In the "Upcoming events" section you will find filter chips: "All", "Today", "This week", and "This month". Tap them to narrow the view.',
      },
      {
        t: 'Global search',
        d: 'Tap the search bar on the Home screen to open global search. Type any term and you will see results organized in four sections: Events, Groups, Schools, and Users.',
      },
      {
        t: 'Home cards and reminders',
        d: 'Above "Upcoming events" you may see contextual cards: a request of yours pending approval, your next class (if you train at a school) with your attendance streak, or — if you are an educator — a quick shortcut to record today\'s attendance.',
      },
      {
        t: 'Educator quick actions',
        d: 'If you manage a single school, you\'ll see two fixed chips below the filters: "School panel" and "Record class", to jump straight into those screens.',
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
        d: 'Tap any group to see its profile. It\'s a single scrolling screen: description, a collapsible "Graduation system" section, a "Hierarchy" card (opens the educator tree on a separate screen), and the group\'s upcoming events.',
      },
      {
        t: 'Request to join a group',
        d: 'The "Request to join the group" button appears on the profile only if you are an educator (or hold educator-level graduation) without a group yet. Your request will show the badge "Request pending approval".',
        tip: 'If you are a student without a group, use "Guided request" instead: it walks you step by step through picking your school (and its educator) before sending the request.',
      },
      {
        t: 'View the group hierarchy',
        d: 'Tap the "Hierarchy" card on the group profile to open the full educator tree, with search by name. Tap any educator to see their public profile.',
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
        d: 'Next to the view toggle there are 3 quick chips: "Free", "Online", and "This weekend". For more options, tap "Filters": category (batizado, roda, open roda, troca de corda, course, workshop, seminar, festival, meetup, intensive, training, or a custom category), price, format, dates, group, and location.',
        tip: 'You can combine multiple filters at once.',
      },
      {
        t: 'Event detail',
        d: 'Tap any event to see the full description, date and time, map location, organizers, and poster if it has one. You will also see how many people are going ("Going") and how many marked interest ("Interested"), with a strip of avatars of who\'s going.',
      },
      {
        t: 'Confirm "Going" or "Interested"',
        d: 'From the event detail, tap "Interested" to save it to your list, or "Going" to confirm attendance. Tapping the same button again removes your confirmation.',
        tip: 'Events you marked as "Going" appear highlighted on your Home screen.',
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
        t: 'How your profile is organized',
        d: 'The "Profile" tab is a single screen (no internal tabs): your photo, role, and group at the top; then an "Activity" button; and further down the sections for your role — "Management" (educators, their schools) or "Where I train" (students, attendance and payments).',
      },
      {
        t: 'Edit your profile',
        d: 'Tap the edit icon (pencil) on your profile photo or name. You can change your photo, first name, last name, nickname, a short bio, country, date of birth, gender (required), and your social links (Instagram, Facebook, WhatsApp, YouTube, TikTok, and website). Save by tapping "Save".',
        tip: 'A square image looks best in the circular profile picture.',
      },
      {
        t: 'Your belt',
        d: 'Your current belt appears with its color and name below your name in the profile. Tapping it takes you to your group\'s full graduation system (all levels), not a personal history of your own promotions.',
      },
      {
        t: 'Settings: language and theme',
        d: 'From "Profile", tap "Settings". There you can change the language (Spanish, Portuguese, English, French, German, Italian) and the visual theme (light or dark). Changes apply immediately.',
      },
      {
        t: 'Push notifications: choose what you want to receive',
        d: 'In "Settings → Notifications" turn each type on or off separately: event reminders, new events from your group, events near you, weekly digest, and community news.',
        tip: 'If you enable GPS location, the app detects your current country to notify you of relevant events even while traveling.',
      },
      {
        t: 'Activity: requests and upcoming events',
        d: 'Tap the "Activity" button on your profile to see your confirmed upcoming events and your pending requests: group, school, educator, school transfer, and event collaboration. The red badge on the "Profile" tab shows how many you have unread.',
      },
      {
        t: 'Report a problem',
        d: 'Go to "Profile" → "Settings" → "Report a problem". Your report goes directly to the development team.',
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
    intro: 'How to find a school, send a request, and what happens next.',
    steps: [
      {
        t: 'Find your school',
        d: 'Go to the "Groups" tab, search for your group by name (or filter by country/style), and open its profile. From there you can reach the school where you train.',
      },
      {
        t: 'Join the school',
        d: 'On the school profile, tap "Join". Your request stays pending until the educator approves it.',
        tip: 'If you don\'t have a group yet, use "Guided request" from the group profile: it walks you step by step through picking your school before sending the request.',
      },
      {
        t: 'Wait for approval',
        d: 'Your request stays as "Pending" until the educator approves or rejects it. You will receive a notification when there is a response.',
        warn: 'Only the responsible educator (or a co-educator) can approve requests.',
      },
      {
        t: 'Access your activity',
        d: 'Once approved, the school appears in your profile, in the "Where I train" section — with your payment status and access to your training stats.',
      },
    ],
  },
  {
    id: 'your-history',
    title: 'Your personal history',
    category: 'Practitioners',
    intro: 'How to view your attendance, your training streak, and your payment status.',
    steps: [
      {
        t: 'Where I train',
        d: 'In your profile, the "Where I train" section lists every school you belong to with a payment status badge (Paid, Pending, Overdue, Free...) and, if you have a pending payment, a "Report payment" button.',
        note: 'Your payment status is visible only to you and your educator.',
      },
      {
        t: 'My activity',
        d: 'Tap "View stats" on any of your schools to open "My activity": your streak of consecutive classes, how many classes you\'ve done this month / in the last 30 days / this year, a frequency chart, your recent sessions, and your payment history. You can share your stats with the dedicated button.',
      },
      {
        t: 'Your belt',
        d: 'Your current belt appears on your profile. Tapping it takes you to your group\'s full graduation system — there is no separate personal history of your own promotions, but your current belt is always visible there.',
      },
      {
        t: 'Confirmed events',
        d: 'Tap "Activity" on your profile to see upcoming events you confirmed "Going" to.',
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
        d: 'If you are an educator without a group yet, you\'ll see a "Create group" banner on Home or "Create new group" on the "Groups" tab. Tap it to open the form.',
        note: 'Only users with the Educator role can create groups.',
      },
      {
        t: 'Name and description',
        d: 'Enter your group\'s official name and a description. Both are required. The name will appear in the directory, on member profiles, and on your events.',
      },
      {
        t: 'Capoeira style (required)',
        d: 'In the "Capoeira style *" field, type the style you practice (e.g. Mixed, Benguela, Angola, Regional). It is free text and required — it\'s used as the name of your graduation system.',
        tip: 'The "City" field is optional.',
      },
      {
        t: 'Group logo (optional)',
        d: 'Upload your logo from your gallery. It will appear on the group profile, in its schools, and on the card your students see on Home.',
      },
      {
        t: 'Create the group',
        d: 'Tap "Create". If the name is not a duplicate, the group is created immediately and you go straight into its profile.',
      },
      {
        t: 'Invite members',
        d: 'There is no invite code. Share your group\'s name with your students: they search for it in the "Groups" tab and request to join. You can also add them directly from your school admin panel.',
      },
    ],
  },
  {
    id: 'manage-group',
    title: 'Managing your group',
    category: 'Educators',
    intro: 'How to manage requests, admin roles, and group information.',
    steps: [
      {
        t: 'Approve or reject group join requests',
        d: 'Group join requests are answered from "Activity" on your profile, along with your other notifications. Tap the request to approve or reject it.',
        note: 'You only see these requests if you manage the group.',
      },
      {
        t: 'Assign roles: admin and co-admin',
        d: 'From the group profile, open the administration panel (visible only to admins and co-admins). There you can grant or remove the "Admin" or "Co-admin" role for any member, or remove your own with "Leave admin".',
        note: 'These changes are reversible.',
      },
      {
        t: 'Edit group information',
        d: 'Go to the group profile → edit icon. You can change the logo, name, description, and capoeira style. Changes are reflected immediately in the public directory.',
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: 'Educational supervision',
    category: 'Educators',
    intro: 'How to assign a supervising educator for your school\'s students.',
    steps: [
      {
        t: 'What educational supervision is',
        d: 'Educational supervision is the hierarchical relationship between educators in the same group. A more experienced educator can oversee the progress of another educator\'s students, especially useful across different cities or countries.',
      },
      {
        t: 'Automatic supervision (same school)',
        d: 'If the supervisor and students share the same school, supervision is automatic — you\'ll see the "Same school" badge on the student\'s profile.',
      },
      {
        t: 'Manual supervision (outside the school)',
        d: 'If you don\'t have your own school, choose supervisors manually: on the supervision screen, tap directly on the educator in the "Suggested supervisors" list, then "Save changes". Students supervised this way show the "Outside your school" badge.',
        tip: 'Only educators from the same group can be assigned as supervisors.',
      },
      {
        t: 'View the supervision tree',
        d: 'On the group profile, tap the "Hierarchy" card to open the full educator tree and who supervises whom.',
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
        d: 'Go to "Profile" → "Management" section → "Create school" button. If you are creating your first group, this step also appears inside the initial setup wizard.',
        note: 'You need to be an educator in a group to create a school. If you just created your group, you already have that role.',
      },
      {
        t: 'Fill in the name and location',
        d: 'Complete "School name" (e.g. Downtown School), "Location" (full address), "Country", and "City". All are required.',
        tip: 'After entering the address, tap the map to drag the marker to the exact spot.',
      },
      {
        t: 'Add training schedules',
        d: 'In "Training schedules", tap "Add schedule": weekday, start time, and end time. At least one schedule is required.',
        warn: 'Class groups (students grouped by time slot) can only be set up at this point — there is no way to add them later. If you train different levels at different times, define it now.',
      },
      {
        t: 'Create the school',
        d: 'Tap "Create school". If all fields are complete, the school is created and visible in the directory.',
      },
      {
        t: 'Edit or delete the school',
        d: 'To edit the name, address, or schedules, go to the school profile → edit icon. "Delete school" is permanent and only available to the responsible educator — there is no option to just hide it from the directory.',
        warn: 'Deleting a school is irreversible.',
      },
      {
        t: 'Set up the billing system',
        d: 'Inside "Edit school" you\'ll find the billing section. Turn on "Free classes" if you don\'t charge a monthly fee. If you do, enter the monthly price, currency, and the day of the month payment is due.',
        tip: 'If you have students with different rates by time slot, each class group can have its own price.',
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
        d: 'A co-educator is an educator from the same group who helps manage your school: they record classes, mark attendance, register payments, and can edit the school\'s settings. Only deleting the school or transferring responsibility are reserved for the responsible educator.',
      },
      {
        t: 'Add a co-educator',
        d: 'Go to your school\'s admin panel → "Team" tab (visible only to the responsible educator). Pick from the list of the group\'s educators and confirm.',
      },
      {
        t: 'Remove a co-educator',
        d: 'In the "Team" tab, tap the co-educator\'s name and choose "Remove co-educator".',
        warn: 'Removing a co-educator does not delete any data: everything they recorded remains in the system.',
      },
      {
        t: 'Leave the co-educator role',
        d: 'If you are a co-educator at a school and no longer want to be, go to the school\'s public profile and tap "Leave role".',
      },
      {
        t: 'Transfer school responsibility',
        d: 'From the "Team" tab, the responsible educator can transfer responsibility to an active co-educator. Whoever transfers becomes a co-educator of the school.',
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
        d: 'Go to your school\'s admin panel → "Requests" tab. You will see all pending join requests, with the applicant\'s name, photo, and date.',
      },
      {
        t: 'Approve or reject a request',
        d: 'On each card, tap the ✓ icon to approve or the ✕ icon to reject. The applicant gets a notification with the response, and if approved, they immediately appear in your student list.',
        tip: 'If you reject someone by mistake, they can send a new request.',
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Students & class groups',
    category: 'Educators',
    intro: 'How to view your students and add members without an app account.',
    mockup: 'attendance',
    steps: [
      {
        t: 'The school admin panel',
        d: 'Access it from "Profile" → "Management" section → your school, or from the school profile by tapping the admin button. You will find "Attendance" (opens by default), "Students", "Payments", and "Reports".',
      },
      {
        t: 'View the student list',
        d: 'In the "Students" tab you will see all members linked to your school with their name, current belt, and monthly attendance percentage.',
      },
      {
        t: 'Add a student without an account (ghost member)',
        d: 'In the "Students" tab, tap the "+" icon to manually register a student who doesn\'t use the app. Enter their name and basic details.',
        note: 'Students without an account can receive graduations and have attendance and payment records just like any other student. Once they sign up in the app, you can link their profile to preserve the full history.',
      },
      {
        t: 'Class groups',
        d: 'Class groups (students organized by schedule) are defined once, when creating the school — there is no screen to add new ones afterward.',
        tip: 'Having class groups makes attendance faster: the attendance screen only shows the students for the selected time slot.',
      },
      {
        t: 'View an individual student\'s profile',
        d: 'Tap any student\'s name to see their record: belt, monthly attendance percentage, attendance history, and payment record.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Attendance tracking',
    category: 'Educators',
    intro: 'How to record a class, mark present and absent, and review history.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Record a class',
        d: 'In the school admin panel → "Attendance" tab, tap "Record today\'s class". You can change the date in the form to record a class for a different day — the app adjusts the available schedules based on the chosen date.',
      },
      {
        t: 'Select schedule and class group',
        d: 'In the session form, select the matching schedule. The app automatically loads the students for that group.',
        tip: 'If you have no class groups configured, the list will show all students in the school.',
      },
      {
        t: 'Mark present and absent',
        d: 'Tap each student\'s name to toggle between present and absent.',
      },
      {
        t: 'Suspend a class',
        d: 'If the class didn\'t happen (holiday, rain, etc.), turn on "Suspend class" before saving. It\'s recorded with a "Suspended" badge and doesn\'t count toward attendance or billing.',
      },
      {
        t: 'Save the class',
        d: 'Tap "Save class". The app shows a dialog with the present and absent counts — tap "Confirm" to record the session.',
      },
      {
        t: 'Review previous sessions',
        d: 'In the "Attendance" tab, sessions appear in chronological order. Tap any past session to see the detail or edit it.',
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
        d: 'In the school admin panel, go to the "Payments" tab. Each student appears with their current month\'s status: Pending, Paid, Paid (late), Overdue, Free, Reported (the student flagged they paid), or Duplicate.',
        warn: 'The "Payments" tab only appears if the school has "Free classes" turned off.',
      },
      {
        t: 'Record a student payment',
        d: 'Tap the student\'s name in the "Payments" tab and then "Record payment". Enter the amount, the corresponding month, and, if applicable, a discount (fixed amount or percentage) — handy for scholarships.',
        tip: 'You can record advance payments: just select the corresponding future month.',
      },
      {
        t: 'Review a payment reported by a student',
        d: 'When a student reports their payment from their own profile, it shows up in your "Payments" tab tagged "Reported". Tap it and edit it like any other payment to change its status to "Paid".',
      },
      {
        t: 'See who has pending or overdue payments',
        d: 'In the "Payments" tab list you can see all students\' statuses at a glance, including the configured payment due day.',
      },
      {
        t: 'Generate and export the monthly report',
        d: 'Go to the "Reports" tab of the school panel. Select the format (CSV or PDF) and tap "Generate report". It includes the month\'s payment and attendance summary.',
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
        d: 'Go to your group\'s profile → collapsible "Graduation system" section → "Manage full system" (or "Set up system now" if you don\'t have levels yet).',
      },
      {
        t: 'Create a belt level',
        d: 'Tap "Add level". Enter the belt name, select the colors that compose it, and indicate whether it has painted tips and how many.',
      },
      {
        t: 'Organize by category',
        d: 'Levels are organized into sections: adult, youth, children\'s, trainee instructors, and special levels. Assign the correct category when creating or editing each level.',
      },
      {
        t: 'Define the educator level',
        d: 'You can mark from which belt a student is considered an "educator" in the group — this determines who has access to create schools and use management tools.',
      },
      {
        t: 'Assign a graduation',
        d: 'From the graduation system screen, tap "Assign graduation to members". Find the student, select the new level and date. The change shows on their profile immediately.',
      },
      {
        t: "View a student's belt",
        d: "Tap any group member's name to see their current belt with its color.",
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
        d: 'Go to the "Events" tab and tap the floating "+" button.',
      },
      {
        t: 'Fill in the basic details',
        d: 'Enter the event name, description, and category (batizado, roda, open roda, troca de corda, course, workshop, seminar, festival, meetup, intensive, training, or a custom category).',
      },
      {
        t: 'Date, poster, and documents',
        d: 'Set a start and end date (with a recurrence option), upload a cover image (poster), and, if you need to share rules or regulations, attach a PDF up to 10MB.',
        tip: 'Events with a poster get higher visibility in members\' feeds.',
      },
      {
        t: 'Price and schedule',
        d: 'If the event has a cost, enter the price and accepted payment methods (bank transfer, cash, Mercado Pago, PayPal, or other). If the event has several activities, add them under "Agenda" — each block with its own time, description, and location.',
        tip: 'When you add an agenda block with a location, the event\'s general location is derived automatically from those blocks.',
      },
      {
        t: 'Location',
        d: 'If you didn\'t use the agenda with per-block locations, enter the event address at the end of the form. The app opens the map picker to place the exact marker.',
      },
      {
        t: 'Edit an existing event',
        d: 'Go to the event detail → edit icon (available to the organizer and co-organizers). Changes are visible to everyone immediately.',
        warn: 'People who already confirmed "Going" don\'t get an automatic notification if you change the date or location.',
      },
      {
        t: 'Manage co-organizers and special guests',
        d: 'From the event\'s edit menu, tap "Collaborators". Choose the role before inviting: "Co-organizer" (can edit the event) or "Special guest" (shown featured, no edit rights). Search by name and send the invite.',
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
        d: 'At the top of the school admin panel you will see a strip with 3 figures: number of students, average attendance percentage, and paid students over the total.',
      },
      {
        t: 'Jump to another month from the KPI strip',
        d: 'Tap the month label in the strip to open a picker and jump directly to any past month.',
      },
      {
        t: 'The "Reports" tab',
        d: 'Go to the school panel → "Reports" tab. If you have class groups configured, you can filter the whole report by a specific group using the chips at the top.',
      },
      {
        t: 'Choose the format and export',
        d: 'Select "CSV" (to open in Excel or Google Sheets) or "PDF" (to share or print) and tap "Generate report". It includes active students, sessions held, attendance percentage, and per-student payment status.',
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
        d: `Renseignez votre prénom, votre nom, un surnom facultatif, votre pays (détecté automatiquement), votre rôle (Pratiquant ou Éducateur — un simple champ du même formulaire), votre e-mail et un mot de passe.`,
        tip: `Choisissez « Éducateur » si vous enseignez déjà la capoeira — cela débloque les outils de gestion dès le départ. Vous pourrez le changer plus tard.`,
        note: `Pour vous inscrire avec Google plutôt que de remplir le formulaire, faites-le depuis l'écran de connexion (non disponible sur la version web).`,
      },
      {
        t: `Complétez l'onboarding`,
        d: `Après l'inscription, un assistant vous guide étape par étape. Si vous êtes élève : complétez votre profil, cherchez votre groupe et choisissez votre noyau. Si vous êtes éducateur : complétez votre profil, choisissez de rejoindre un groupe existant ou d'en créer un, puis terminez en créant votre noyau.`,
        note: `L'étape de profil demande de choisir un genre avant de pouvoir continuer.`,
      },
      {
        t: `Reliez votre groupe`,
        d: `Si vous avez terminé l'onboarding sans rejoindre de groupe, vous verrez sur l'écran d'accueil la carte « Vous n'appartenez à aucun groupe » avec les boutons « Trouver un groupe » et « Demande guidée » (et « Créer un groupe » si vous êtes éducateur).`,
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
        d: `L'onglet « Accueil » affiche un message de bienvenue personnalisé avec votre nom et la section « Événements à venir » avec les événements de votre communauté dans l'ordre chronologique. Un badge rouge sur l'onglet « Profil » indique des notifications en attente.`,
        tip: `Tirez vers le bas pour rafraîchir le fil à tout moment.`,
      },
      {
        t: `Filtrez les événements à venir`,
        d: `Dans la section « Événements à venir », vous trouverez des puces de filtre : « Tous », « Aujourd'hui », « Cette semaine » et « Ce mois-ci ». Touchez-les pour affiner l'affichage.`,
      },
      {
        t: `Recherche globale`,
        d: `Touchez la barre de recherche sur l'écran d'accueil pour ouvrir la recherche globale. Tapez n'importe quel terme et vous verrez les résultats organisés en quatre sections : Événements, Groupes, Noyaux et Utilisateurs.`,
      },
      {
        t: `Cartes et rappels sur l'accueil`,
        d: `Au-dessus de « Événements à venir », des cartes contextuelles peuvent apparaître : une de vos demandes en attente d'approbation, votre prochain cours (si vous vous entraînez dans un noyau) avec votre série de présence, ou — si vous êtes éducateur — un accès rapide pour enregistrer la présence du jour.`,
      },
      {
        t: `Accès rapides pour éducateur`,
        d: `Si vous gérez un seul noyau, vous verrez deux puces fixes sous les filtres : « Panneau du noyau » et « Enregistrer le cours », pour accéder directement à ces écrans.`,
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
        d: `Touchez un groupe pour voir son profil. C'est un seul écran défilant : description, section repliable « Système de graduation », une carte « Hiérarchie » (ouvre l'arbre des éducateurs sur un écran séparé) et les événements à venir du groupe.`,
      },
      {
        t: `Demander à rejoindre un groupe`,
        d: `Le bouton « Demander à rejoindre le groupe » n'apparaît sur le profil que si vous êtes éducateur (ou avez une graduation d'éducateur) sans groupe. Votre demande affichera le badge « Demande en attente d'approbation ».`,
        tip: `Si vous êtes élève sans groupe, utilisez plutôt « Demande guidée » : elle vous guide étape par étape pour choisir votre noyau (et son éducateur) avant d'envoyer la demande.`,
      },
      {
        t: `Voir la hiérarchie du groupe`,
        d: `Touchez la carte « Hiérarchie » sur le profil du groupe pour ouvrir l'arbre complet des éducateurs, avec recherche par nom. Touchez un éducateur pour voir son profil public.`,
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
        d: `À côté du bouton de bascule d'affichage se trouvent 3 puces rapides : « Gratuit », « En ligne » et « Ce week-end ». Pour plus d'options, touchez « Filtres » : catégorie (batizado, roda, roda ouverte, troca de corda, cours, atelier, séminaire, festival, rencontre, intensif, entraînement, ou une catégorie personnalisée), prix, format, dates, groupe et lieu.`,
        tip: `Vous pouvez combiner plusieurs filtres à la fois.`,
      },
      {
        t: `Détail de l'événement`,
        d: `Touchez un événement pour voir la description complète, la date et l'heure, l'emplacement sur la carte, les organisateurs et l'affiche s'il y en a une. Vous verrez aussi combien de personnes y vont (« J'y vais ») et combien ont marqué leur intérêt (« Intéressé »), avec une rangée d'avatars des participants.`,
      },
      {
        t: `Confirmer « J'y vais » ou « Intéressé »`,
        d: `Depuis le détail de l'événement, touchez « Intéressé » pour l'enregistrer dans votre liste, ou « J'y vais » pour confirmer votre présence. Toucher à nouveau le même bouton retire votre confirmation.`,
        tip: `Les événements que vous avez marqués « J'y vais » apparaissent en surbrillance sur votre écran d'accueil.`,
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
        t: `Comment votre profil est organisé`,
        d: `L'onglet « Profil » est un seul écran (sans onglets internes) : en haut votre photo, votre rôle et votre groupe ; puis un bouton « Activité » ; et plus bas les sections selon votre rôle — « Gestion » (éducateurs, leurs noyaux) ou « Où je m'entraîne » (élèves, présence et paiements).`,
      },
      {
        t: `Modifier votre profil`,
        d: `Touchez l'icône de modification (crayon) sur votre photo ou votre nom. Vous pouvez changer votre photo, prénom, nom, surnom, une courte bio, votre pays, votre date de naissance, votre genre (obligatoire) et vos liens vers les réseaux sociaux (Instagram, Facebook, WhatsApp, YouTube, TikTok et site web). Enregistrez en touchant « Enregistrer ».`,
        tip: `Une image carrée rend le mieux dans la photo de profil circulaire.`,
      },
      {
        t: `Votre corde`,
        d: `Votre corde actuelle apparaît avec sa couleur et son nom sous votre nom dans le profil. La toucher vous amène au système de graduation complet de votre groupe (tous les niveaux), pas à un historique personnel de vos propres promotions.`,
      },
      {
        t: `Réglages : langue et thème`,
        d: `Depuis « Profil », touchez « Réglages ». Vous pouvez y changer la langue (espagnol, portugais, anglais, français, allemand, italien) et le thème visuel (clair ou sombre). Les changements s'appliquent immédiatement.`,
      },
      {
        t: `Notifications push : choisissez ce que vous voulez recevoir`,
        d: `Dans « Réglages → Notifications », activez ou désactivez chaque type séparément : rappels d'événement, nouveaux événements de votre groupe, événements près de chez vous, résumé hebdomadaire et actualités de votre communauté.`,
        tip: `Si vous activez la localisation GPS, l'app détecte votre pays actuel pour vous avertir des événements pertinents même en voyage.`,
      },
      {
        t: `Activité : demandes et événements à venir`,
        d: `Touchez le bouton « Activité » sur votre profil pour voir vos événements à venir confirmés et vos demandes en attente : de groupe, de noyau, d'éducateur, de transfert de noyau et de collaboration à un événement. Le badge rouge sur l'onglet « Profil » indique combien vous en avez de non lues.`,
      },
      {
        t: `Signaler un problème`,
        d: `Allez dans « Profil » → « Réglages » → « Signaler un problème ». Votre signalement est envoyé directement à l'équipe de développement.`,
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
    intro: `Comment trouver un noyau, envoyer une demande et ce qui se passe ensuite.`,
    steps: [
      {
        t: `Trouvez votre noyau`,
        d: `Allez dans l'onglet « Groupes », cherchez votre groupe par nom (ou filtrez par pays/style) et ouvrez son profil. De là, vous pouvez accéder au noyau où vous vous entraînez.`,
      },
      {
        t: `Rejoignez le noyau`,
        d: `Sur le profil du noyau, touchez « Rejoindre ». Votre demande reste en attente jusqu'à ce que l'éducateur l'approuve.`,
        tip: `Si vous n'avez pas encore de groupe, utilisez « Demande guidée » depuis le profil du groupe : elle vous guide étape par étape pour choisir votre noyau avant d'envoyer la demande.`,
      },
      {
        t: `Attendre l'approbation`,
        d: `Votre demande reste « En attente » jusqu'à ce que l'éducateur l'approuve ou la rejette. Vous recevrez une notification lorsqu'il y aura une réponse.`,
        warn: `Seul l'éducateur responsable (ou un co-éducateur) peut approuver les demandes.`,
      },
      {
        t: `Accédez à votre activité`,
        d: `Une fois approuvé, le noyau apparaît sur votre profil, dans la section « Où je m'entraîne » — avec votre statut de paiement et l'accès à vos statistiques d'entraînement.`,
      },
    ],
  },
  {
    id: 'your-history',
    title: `Votre historique personnel`,
    category: `Pratiquants`,
    intro: `Comment consulter votre présence, votre série d'entraînement et le statut de vos paiements.`,
    steps: [
      {
        t: `Où je m'entraîne`,
        d: `Sur votre profil, la section « Où je m'entraîne » liste chaque noyau auquel vous appartenez avec un badge de statut de paiement (Payé, En attente, En retard, Gratuit...) et, si vous avez un paiement en attente, un bouton « Signaler un paiement ».`,
        note: `Votre statut de paiement n'est visible que par vous et votre éducateur.`,
      },
      {
        t: `Mon activité`,
        d: `Touchez « Voir les statistiques » sur l'un de vos noyaux pour ouvrir « Mon activité » : votre série de cours consécutifs, combien de cours vous avez faits ce mois-ci / ces 30 derniers jours / cette année, un graphique de fréquence, vos sessions récentes et votre historique de paiements. Vous pouvez partager vos statistiques avec le bouton dédié.`,
      },
      {
        t: `Votre corde`,
        d: `Votre corde actuelle apparaît sur votre profil. La toucher vous amène au système de graduation complet de votre groupe — il n'existe pas d'historique personnel séparé de vos propres promotions, mais votre corde actuelle y est toujours visible.`,
      },
      {
        t: `Événements confirmés`,
        d: `Touchez « Activité » sur votre profil pour voir les événements à venir auxquels vous avez confirmé « J'y vais ».`,
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
        d: `Si vous êtes éducateur sans groupe, vous verrez une bannière « Créer un groupe » sur l'accueil ou « Créer un nouveau groupe » dans l'onglet « Groupes ». Touchez-la pour ouvrir le formulaire.`,
        note: `Seuls les utilisateurs ayant le rôle Éducateur peuvent créer des groupes.`,
      },
      {
        t: `Nom et description`,
        d: `Saisissez le nom officiel de votre groupe et une description. Les deux sont obligatoires. Le nom apparaîtra dans l'annuaire, sur les profils des membres et sur vos événements.`,
      },
      {
        t: `Style de capoeira (obligatoire)`,
        d: `Dans le champ « Style de capoeira * », tapez le style que vous pratiquez (par ex. Mixte, Benguela, Angola, Regional). C'est un texte libre et obligatoire — utilisé comme nom de votre système de graduation.`,
        tip: `Le champ « Ville » est facultatif.`,
      },
      {
        t: `Logo du groupe (facultatif)`,
        d: `Importez le logo depuis votre galerie. Il apparaîtra sur le profil du groupe, dans ses noyaux et sur la carte que vos élèves voient sur l'accueil.`,
      },
      {
        t: `Créer le groupe`,
        d: `Touchez « Créer ». Si le nom n'est pas un doublon, le groupe est créé immédiatement et vous accédez directement à son profil.`,
      },
      {
        t: `Inviter des membres`,
        d: `Il n'y a pas de code d'invitation. Partagez le nom de votre groupe avec vos élèves : ils le recherchent dans l'onglet « Groupes » et demandent à le rejoindre. Vous pouvez aussi les ajouter directement depuis le panneau de votre noyau.`,
      },
    ],
  },
  {
    id: 'manage-group',
    title: `Gérer votre groupe`,
    category: `Éducateurs`,
    intro: `Comment gérer les demandes, les rôles d'administration et les informations du groupe.`,
    steps: [
      {
        t: `Approuver ou rejeter les demandes d'adhésion au groupe`,
        d: `Les demandes d'adhésion au groupe sont traitées depuis « Activité » sur votre profil, avec vos autres notifications. Touchez la demande pour l'approuver ou la rejeter.`,
        note: `Vous ne voyez ces demandes que si vous administrez le groupe.`,
      },
      {
        t: `Attribuer des rôles : admin et co-admin`,
        d: `Depuis le profil du groupe, ouvrez le panneau d'administration (visible uniquement par les administrateurs et co-administrateurs). Vous pouvez y activer ou retirer le rôle « Administrateur » ou « Co-administrateur » de n'importe quel membre, ou retirer le vôtre avec « Quitter le rôle d'admin ».`,
        note: `Ces changements sont réversibles.`,
      },
      {
        t: `Modifier les informations du groupe`,
        d: `Allez sur le profil du groupe → icône de modification. Vous pouvez changer le logo, le nom, la description et le style de capoeira. Les changements se reflètent immédiatement dans l'annuaire public.`,
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: `Supervision pédagogique`,
    category: `Éducateurs`,
    intro: `Comment assigner un éducateur superviseur pour les élèves de votre noyau.`,
    steps: [
      {
        t: `Ce qu'est la supervision pédagogique`,
        d: `La supervision pédagogique est la relation hiérarchique entre éducateurs d'un même groupe. Un éducateur plus expérimenté peut suivre la progression des élèves d'un autre éducateur, ce qui est particulièrement utile lorsqu'ils sont dans des villes ou des pays différents.`,
      },
      {
        t: `Supervision automatique (même noyau)`,
        d: `Si le superviseur et les élèves partagent le même noyau, la supervision est automatique — vous verrez le badge « Même noyau » sur le profil de l'élève.`,
      },
      {
        t: `Supervision manuelle (hors du noyau)`,
        d: `Si vous n'avez pas votre propre noyau, choisissez des superviseurs manuellement : sur l'écran de supervision, touchez directement l'éducateur dans la liste « Superviseurs suggérés », puis « Enregistrer les modifications ». Les élèves ainsi supervisés affichent le badge « Hors de votre noyau ».`,
        tip: `Seuls les éducateurs du même groupe peuvent être assignés comme superviseurs.`,
      },
      {
        t: `Voir l'arbre de supervision`,
        d: `Sur le profil du groupe, touchez la carte « Hiérarchie » pour ouvrir l'arbre complet des éducateurs et qui supervise qui.`,
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
        d: `Allez dans « Profil » → section « Gestion » → bouton « Créer un noyau ». Si vous créez votre premier groupe, cette étape apparaît aussi dans l'assistant de configuration initiale.`,
        note: `Vous devez être éducateur d'un groupe pour créer un noyau. Si vous venez de créer votre groupe, vous avez déjà ce rôle.`,
      },
      {
        t: `Renseigner le nom et l'emplacement`,
        d: `Complétez « Nom du noyau » (par ex. Noyau Centre-ville), « Emplacement » (adresse complète), « Pays » et « Ville ». Tous sont obligatoires.`,
        tip: `Après avoir saisi l'adresse, touchez la carte pour faire glisser le marqueur à l'endroit exact.`,
      },
      {
        t: `Ajouter des horaires d'entraînement`,
        d: `Dans « Horaires d'entraînement », touchez « Ajouter un horaire » : jour de la semaine, heure de début et heure de fin. Au moins un horaire est requis.`,
        warn: `Les turmas (groupes d'élèves par horaire) ne peuvent être configurées qu'à ce moment-là — impossible d'en ajouter plus tard. Si vous entraînez différents niveaux à des horaires différents, définissez-le maintenant.`,
      },
      {
        t: `Créer le noyau`,
        d: `Touchez « Créer le noyau ». Si tous les champs sont complets, le noyau est créé et visible dans l'annuaire.`,
      },
      {
        t: `Modifier ou supprimer le noyau`,
        d: `Pour modifier le nom, l'adresse ou les horaires, allez sur le profil du noyau → icône de modification. « Supprimer le noyau » est une suppression définitive, réservée à l'éducateur responsable — il n'existe pas d'option pour seulement le masquer de l'annuaire.`,
        warn: `Supprimer un noyau est irréversible.`,
      },
      {
        t: `Configurer le système de facturation`,
        d: `Dans « Modifier le noyau », vous trouverez la section facturation. Activez « Cours gratuits » si vous ne facturez pas de cotisation. Sinon, saisissez le tarif mensuel, la devise et le jour du mois où le paiement est dû.`,
        tip: `Si vos élèves ont des tarifs différents selon l'horaire, chaque turma peut avoir son propre tarif.`,
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
        d: `Un co-éducateur est un éducateur du même groupe qui aide à gérer votre noyau : il enregistre des cours, marque la présence, enregistre des paiements et peut modifier les données du noyau. Seules la suppression du noyau et le transfert de responsabilité restent réservés à l'éducateur responsable.`,
      },
      {
        t: `Ajouter un co-éducateur`,
        d: `Allez dans le panneau d'administration de votre noyau → onglet « Équipe » (visible uniquement par l'éducateur responsable). Choisissez dans la liste des éducateurs du groupe et confirmez.`,
      },
      {
        t: `Retirer un co-éducateur`,
        d: `Dans l'onglet « Équipe », touchez le nom du co-éducateur et choisissez « Retirer le co-éducateur ».`,
        warn: `Retirer un co-éducateur ne supprime aucune donnée : tout ce qu'il a enregistré reste dans le système.`,
      },
      {
        t: `Quitter le rôle de co-éducateur`,
        d: `Si vous êtes co-éducateur dans un noyau et ne souhaitez plus l'être, allez sur le profil public du noyau et touchez « Quitter le rôle ».`,
      },
      {
        t: `Transférer la responsabilité du noyau`,
        d: `Depuis l'onglet « Équipe », l'éducateur responsable peut transférer la responsabilité à un co-éducateur actif. Celui qui transfère devient co-éducateur du noyau.`,
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
        d: `Allez dans le panneau d'administration de votre noyau → onglet « Demandes ». Vous verrez toutes les demandes d'adhésion en attente, avec le nom du demandeur, sa photo et la date.`,
      },
      {
        t: `Approuver ou rejeter une demande`,
        d: `Sur chaque carte, touchez l'icône ✓ pour approuver ou l'icône ✕ pour rejeter. Le demandeur reçoit une notification avec la réponse, et si vous approuvez, il apparaît immédiatement dans votre liste d'élèves.`,
        tip: `Si vous rejetez quelqu'un par erreur, il peut envoyer une nouvelle demande.`,
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: `Élèves et turmas`,
    category: `Éducateurs`,
    intro: `Comment voir vos élèves et ajouter des membres sans compte dans l'app.`,
    mockup: 'attendance',
    steps: [
      {
        t: `Le panneau d'administration du noyau`,
        d: `Accédez-y depuis « Profil » → section « Gestion » → votre noyau, ou depuis le profil du noyau en touchant le bouton d'administration. Vous trouverez « Présence » (ouvert par défaut), « Élèves », « Paiements » et « Rapports ».`,
      },
      {
        t: `Voir la liste des élèves`,
        d: `Dans l'onglet « Élèves », vous verrez tous les membres reliés à votre noyau avec leur nom, leur corde actuelle et leur pourcentage de présence mensuel.`,
      },
      {
        t: `Ajouter un élève sans compte (membre fantôme)`,
        d: `Dans l'onglet « Élèves », touchez l'icône « + » pour enregistrer manuellement un élève qui n'utilise pas l'app. Saisissez son nom et ses informations de base.`,
        note: `Les élèves sans compte peuvent recevoir des graduations et avoir des enregistrements de présence et de paiement comme tout autre élève. Lorsqu'ils s'inscrivent dans l'app, vous pouvez relier leur profil pour préserver tout l'historique.`,
      },
      {
        t: `Turmas`,
        d: `Les turmas (groupes d'élèves par horaire) sont définies une seule fois, à la création du noyau — il n'y a pas d'écran pour en ajouter de nouvelles ensuite.`,
        tip: `Avoir des turmas rend la prise de présence plus rapide : l'écran de présence n'affiche que les élèves du créneau sélectionné.`,
      },
      {
        t: `Voir le profil d'un élève`,
        d: `Touchez le nom d'un élève pour voir son profil : corde, pourcentage de présence du mois, historique de présence et historique de paiements.`,
      },
    ],
  },
  {
    id: 'attendance',
    title: `Suivi de présence`,
    category: `Éducateurs`,
    intro: `Comment enregistrer un cours, marquer présents et absents, et consulter l'historique.`,
    mockup: 'attendance',
    steps: [
      {
        t: `Enregistrer un cours`,
        d: `Dans le panneau d'administration du noyau → onglet « Présence », touchez « Enregistrer le cours du jour ». Vous pouvez changer la date dans le formulaire pour enregistrer un cours d'un autre jour — l'app ajuste les horaires disponibles selon la date choisie.`,
      },
      {
        t: `Sélectionner l'horaire et la turma`,
        d: `Dans le formulaire de session, sélectionnez l'horaire correspondant. L'app charge automatiquement les élèves de cette turma.`,
        tip: `Si vous n'avez pas de turma configurée, la liste affichera tous les élèves du noyau.`,
      },
      {
        t: `Marquer présents et absents`,
        d: `Touchez le nom de chaque élève pour basculer entre présent et absent.`,
      },
      {
        t: `Suspendre un cours`,
        d: `Si le cours n'a pas eu lieu (jour férié, pluie, etc.), activez « Suspendre le cours » avant d'enregistrer. Il est marqué du badge « Suspendu » et ne compte ni dans la présence ni dans la facturation.`,
      },
      {
        t: `Enregistrer le cours`,
        d: `Touchez « Enregistrer le cours ». L'app affiche une boîte avec le nombre de présents et d'absents — touchez « Confirmer » pour enregistrer la session.`,
      },
      {
        t: `Consulter les sessions précédentes`,
        d: `Dans l'onglet « Présence », les sessions apparaissent dans l'ordre chronologique. Touchez une session passée pour voir le détail ou la modifier.`,
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
        d: `Dans le panneau d'administration du noyau, allez dans l'onglet « Paiements ». Chaque élève apparaît avec son statut du mois : En attente, Payé, Payé (en retard), En retard, Gratuit, Signalé (l'élève a indiqué avoir payé) ou Doublon.`,
        warn: `L'onglet « Paiements » n'apparaît que si le noyau a désactivé « Cours gratuits ».`,
      },
      {
        t: `Enregistrer le paiement d'un élève`,
        d: `Touchez le nom de l'élève dans l'onglet « Paiements » puis « Enregistrer un paiement ». Saisissez le montant, le mois correspondant et, le cas échéant, une remise (montant fixe ou pourcentage) — utile pour les bourses.`,
        tip: `Vous pouvez enregistrer des paiements anticipés : sélectionnez simplement le mois futur correspondant.`,
      },
      {
        t: `Vérifier un paiement signalé par un élève`,
        d: `Quand un élève signale son paiement depuis son propre profil, il apparaît dans votre onglet « Paiements » avec l'étiquette « Signalé ». Touchez-le et modifiez-le comme n'importe quel paiement pour passer son statut à « Payé ».`,
      },
      {
        t: `Voir qui a des paiements en attente ou en retard`,
        d: `Dans la liste de l'onglet « Paiements », vous voyez d'un coup d'œil le statut de tous les élèves, y compris le jour d'échéance configuré.`,
      },
      {
        t: `Générer et exporter le rapport mensuel`,
        d: `Allez dans l'onglet « Rapports » du panneau du noyau. Sélectionnez le format (CSV ou PDF) et touchez « Générer le rapport ». Il inclut le résumé des paiements et de la présence du mois.`,
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
        d: `Allez sur le profil de votre groupe → section repliable « Système de graduation » → « Gérer le système complet » (ou « Configurer le système maintenant » si vous n'avez pas encore de niveaux).`,
      },
      {
        t: `Créer un niveau de corde`,
        d: `Touchez « Ajouter un niveau ». Saisissez le nom de la corde, sélectionnez les couleurs qui la composent, et indiquez si elle a des pointes peintes et combien.`,
      },
      {
        t: `Organiser par catégorie`,
        d: `Les niveaux sont organisés en sections : adultes, jeunes, enfants, instructeurs stagiaires et niveaux spéciaux. Attribuez la bonne catégorie à la création ou à la modification de chaque niveau.`,
      },
      {
        t: `Définir le niveau d'éducateur`,
        d: `Vous pouvez indiquer à partir de quelle corde un élève est considéré comme « éducateur » dans le groupe — cela détermine qui a accès à la création de noyaux et aux outils de gestion.`,
      },
      {
        t: `Attribuer une graduation`,
        d: `Depuis l'écran du système de graduation, touchez « Attribuer une graduation aux membres ». Trouvez l'élève, sélectionnez le nouveau niveau et la date. Le changement apparaît immédiatement sur son profil.`,
      },
      {
        t: `Voir la corde d'un élève`,
        d: `Touchez le nom d'un membre du groupe pour voir sa corde actuelle avec sa couleur.`,
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
        d: `Allez dans l'onglet « Événements » et touchez le bouton flottant « + ».`,
      },
      {
        t: `Renseignez les détails de base`,
        d: `Saisissez le nom de l'événement, la description et la catégorie (batizado, roda, roda ouverte, troca de corda, cours, atelier, séminaire, festival, rencontre, intensif, entraînement, ou une catégorie personnalisée).`,
      },
      {
        t: `Date, affiche et documents`,
        d: `Définissez une date de début et de fin (avec une option de récurrence), importez une image de couverture (affiche) et, si besoin de partager des règles ou règlements, joignez un PDF jusqu'à 10 Mo.`,
        tip: `Les événements avec une affiche obtiennent une meilleure visibilité dans les fils des membres.`,
      },
      {
        t: `Prix et programme`,
        d: `Si l'événement a un coût, saisissez le prix et les moyens de paiement acceptés (virement, espèces, Mercado Pago, PayPal ou autre). Si l'événement comporte plusieurs activités, ajoutez-les dans « Programme » — chaque bloc avec son propre horaire, sa description et son lieu.`,
        tip: `Quand vous ajoutez un bloc de programme avec un lieu, l'emplacement général de l'événement est déduit automatiquement de ces blocs.`,
      },
      {
        t: `Lieu`,
        d: `Si vous n'avez pas utilisé le programme avec des lieux par bloc, saisissez l'adresse de l'événement à la fin du formulaire. L'app ouvre le sélecteur de carte pour placer le marqueur exact.`,
      },
      {
        t: `Modifier un événement déjà créé`,
        d: `Allez sur le détail de l'événement → icône de modification (disponible pour l'organisateur et les co-organisateurs). Les changements sont visibles immédiatement pour tous.`,
        warn: `Les personnes ayant déjà confirmé « J'y vais » ne reçoivent pas de notification automatique si vous changez la date ou le lieu.`,
      },
      {
        t: `Gérer les co-organisateurs et invités spéciaux`,
        d: `Depuis le menu de modification de l'événement, touchez « Collaborateurs ». Choisissez le rôle avant d'inviter : « Co-organisateur » (peut modifier l'événement) ou « Invité spécial » (mis en avant, sans droit de modification). Cherchez par nom et envoyez l'invitation.`,
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
        d: `En haut du panneau d'administration du noyau, vous verrez un bandeau avec 3 données : nombre d'élèves, pourcentage de présence moyen et élèves ayant payé sur le total.`,
      },
      {
        t: `Sauter à un autre mois depuis le KPI`,
        d: `Touchez l'étiquette du mois dans ce bandeau pour ouvrir un sélecteur et sauter directement à n'importe quel mois passé.`,
      },
      {
        t: `L'onglet « Rapports »`,
        d: `Allez dans le panneau du noyau → onglet « Rapports ». Si vous avez des turmas configurées, vous pouvez filtrer tout le rapport par une turma spécifique grâce aux puces en haut de l'écran.`,
      },
      {
        t: `Choisir le format et exporter`,
        d: `Sélectionnez « CSV » (pour ouvrir dans Excel ou Google Sheets) ou « PDF » (pour partager ou imprimer) et touchez « Générer le rapport ». Il inclut les élèves actifs, les sessions données, le pourcentage de présence et le statut de paiement par élève.`,
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
        d: 'Gib Vorname, Nachname, optional einen Spitznamen, dein Land (automatisch erkannt), deine Rolle (Praktizierende/r oder Lehrer — nur ein weiteres Feld im selben Formular), E-Mail und Passwort ein.',
        tip: 'Wähle „Lehrer", wenn du bereits Capoeira unterrichtest — das schaltet von Anfang an die Verwaltungstools frei. Du kannst es später ändern.',
        note: 'Um dich stattdessen mit Google zu registrieren, mach das auf dem Login-Bildschirm (in der Web-Version nicht verfügbar).',
      },
      {
        t: 'Schließe das Onboarding ab',
        d: 'Nach der Registrierung führt dich ein Assistent Schritt für Schritt. Als Schüler: vervollständige dein Profil, suche deine Gruppe und wähle deine Schule. Als Lehrer: vervollständige dein Profil, entscheide dich für den Beitritt zu einer bestehenden Gruppe oder das Erstellen einer eigenen, und erstelle abschließend deine Schule.',
        note: 'Im Profilschritt musst du ein Geschlecht auswählen, bevor du fortfahren kannst.',
      },
      {
        t: 'Verknüpfe deine Gruppe',
        d: 'Wenn du das Onboarding ohne Gruppenbeitritt beendet hast, siehst du auf dem Home-Bildschirm die Karte „Du gehörst noch keiner Gruppe an" mit den Buttons „Gruppe finden" und „Geführte Anfrage" (und „Gruppe erstellen", falls du Lehrer bist).',
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
        d: 'Der Tab „Home" zeigt eine personalisierte Begrüßung mit deinem Namen und den Bereich „Anstehende Events" mit den Events deiner Community in chronologischer Reihenfolge. Ein rotes Abzeichen am Tab „Profil" zeigt ausstehende Benachrichtigungen an.',
        tip: 'Ziehe nach unten, um den Feed jederzeit zu aktualisieren.',
      },
      {
        t: 'Anstehende Events filtern',
        d: 'Im Bereich „Anstehende Events" findest du Filter-Chips: „Alle", „Heute", „Diese Woche" und „Diesen Monat". Tippe darauf, um die Ansicht einzugrenzen.',
      },
      {
        t: 'Globale Suche',
        d: 'Tippe auf die Suchleiste auf dem Home-Bildschirm, um die globale Suche zu öffnen. Gib einen beliebigen Begriff ein und du siehst Ergebnisse in vier Bereichen: Events, Gruppen, Schulen und Nutzer.',
      },
      {
        t: 'Karten und Hinweise auf der Startseite',
        d: 'Über „Anstehende Events" können kontextbezogene Karten erscheinen: eine deiner Anfragen, die auf Genehmigung wartet, deine nächste Klasse (wenn du an einer Schule trainierst) mit deiner Anwesenheitsserie, oder — wenn du Lehrer bist — ein schneller Zugriff, um die heutige Anwesenheit zu erfassen.',
      },
      {
        t: 'Schnellzugriffe für Lehrer',
        d: 'Wenn du nur eine Schule verwaltest, siehst du unter den Filtern zwei feste Chips: „Schulbereich" und „Klasse erfassen", um direkt zu diesen Bildschirmen zu springen.',
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
        d: 'Tippe auf eine Gruppe, um ihr Profil zu sehen. Es ist ein einziger scrollbarer Bildschirm: Beschreibung, ein einklappbarer Bereich „Graduierungssystem", eine Karte „Hierarchie" (öffnet den Lehrer-Baum auf einem separaten Bildschirm) und die anstehenden Events der Gruppe.',
      },
      {
        t: 'Beitrittsanfrage für eine Gruppe',
        d: 'Der Button „Beitritt zur Gruppe anfragen" erscheint im Profil nur, wenn du Lehrer bist (oder eine Lehrer-Graduierung hast) und noch keine Gruppe hast. Deine Anfrage zeigt das Abzeichen „Anfrage wartet auf Genehmigung".',
        tip: 'Wenn du Schüler ohne Gruppe bist, nutze stattdessen „Geführte Anfrage": Sie führt dich Schritt für Schritt zur Auswahl deiner Schule (und deren Lehrer), bevor die Anfrage gesendet wird.',
      },
      {
        t: 'Die Gruppenhierarchie ansehen',
        d: 'Tippe auf die Karte „Hierarchie" im Gruppenprofil, um den vollständigen Lehrer-Baum mit Namenssuche zu öffnen. Tippe auf einen Lehrer, um sein öffentliches Profil zu sehen.',
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
        d: 'Neben dem Ansicht-Umschalter gibt es 3 Schnell-Chips: „Kostenlos", „Online" und „Dieses Wochenende". Für weitere Optionen tippe auf „Filter": Kategorie (Batizado, Roda, offene Roda, Troca de Corda, Kurs, Workshop, Seminar, Festival, Treffen, Intensivkurs, Training, oder eine eigene Kategorie), Preis, Format, Termine, Gruppe und Standort.',
        tip: 'Du kannst mehrere Filter gleichzeitig kombinieren.',
      },
      {
        t: 'Event-Detail',
        d: 'Tippe auf ein Event, um die vollständige Beschreibung, Datum und Uhrzeit, Standort auf der Karte, Organisatoren und Plakat (falls vorhanden) zu sehen. Du siehst auch, wie viele Personen teilnehmen („Bin dabei") und wie viele Interesse markiert haben („Interessiert"), mit einer Reihe von Avataren der Teilnehmer.',
      },
      {
        t: '„Bin dabei" oder „Interessiert" bestätigen',
        d: 'Tippe im Event-Detail auf „Interessiert", um es in deiner Liste zu speichern, oder auf „Bin dabei", um die Teilnahme zu bestätigen. Erneutes Tippen auf denselben Button entfernt deine Bestätigung.',
        tip: 'Events, die du mit „Bin dabei" markiert hast, werden auf deinem Home-Bildschirm hervorgehoben angezeigt.',
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
        t: 'Wie dein Profil aufgebaut ist',
        d: 'Der Tab „Profil" ist ein einziger Bildschirm (ohne interne Tabs): oben dein Foto, deine Rolle und Gruppe; dann ein Button „Aktivität"; und weiter unten die Bereiche je nach deiner Rolle — „Verwaltung" (Lehrer, ihre Schulen) oder „Wo ich trainiere" (Schüler, Anwesenheit und Zahlungen).',
      },
      {
        t: 'Bearbeite dein Profil',
        d: 'Tippe auf das Bearbeitungssymbol (Stift) bei deinem Profilfoto oder Namen. Du kannst Foto, Vorname, Nachname, Spitzname, eine kurze Bio, Land, Geburtsdatum, Geschlecht (erforderlich) und deine Social-Media-Links (Instagram, Facebook, WhatsApp, YouTube, TikTok und Website) ändern. Speichere mit „Speichern".',
        tip: 'Ein quadratisches Bild sieht im runden Profilfoto am besten aus.',
      },
      {
        t: 'Dein Gürtel',
        d: 'Dein aktueller Gürtel erscheint mit Farbe und Name unter deinem Namen im Profil. Tippen darauf führt zum vollständigen Graduierungssystem deiner Gruppe (alle Stufen), nicht zu einer persönlichen Historie deiner eigenen Beförderungen.',
      },
      {
        t: 'Einstellungen: Sprache und Theme',
        d: 'Tippe unter „Profil" auf „Einstellungen". Dort änderst du die Sprache (Spanisch, Portugiesisch, Englisch, Französisch, Deutsch, Italienisch) und das visuelle Theme (hell oder dunkel). Änderungen werden sofort übernommen.',
      },
      {
        t: 'Push-Benachrichtigungen: wähle, was du erhalten möchtest',
        d: 'Aktiviere oder deaktiviere unter „Einstellungen → Benachrichtigungen" jeden Typ einzeln: Event-Erinnerungen, neue Events deiner Gruppe, Events in deiner Nähe, wöchentliche Zusammenfassung und Neuigkeiten deiner Community.',
        tip: 'Wenn du den GPS-Standort aktivierst, erkennt die App dein aktuelles Land, um dich auch auf Reisen über relevante Events zu informieren.',
      },
      {
        t: 'Aktivität: Anfragen und anstehende Events',
        d: 'Tippe auf den Button „Aktivität" in deinem Profil, um deine bestätigten anstehenden Events und deine ausstehenden Anfragen zu sehen: Gruppe, Schule, Lehrer, Schulübertragung und Event-Kooperation. Das rote Abzeichen am Tab „Profil" zeigt, wie viele du ungelesen hast.',
      },
      {
        t: 'Ein Problem melden',
        d: 'Gehe zu „Profil" → „Einstellungen" → „Problem melden". Dein Bericht geht direkt an das Entwicklungsteam.',
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
    intro: 'Wie du eine Schule findest, eine Anfrage sendest, und was danach passiert.',
    steps: [
      {
        t: 'Finde deine Schule',
        d: 'Gehe zum Tab „Gruppen", suche deine Gruppe nach Namen (oder filtere nach Land/Stil) und öffne ihr Profil. Von dort gelangst du zu der Schule, an der du trainierst.',
      },
      {
        t: 'Tritt der Schule bei',
        d: 'Tippe im Schulprofil auf „Beitreten". Deine Anfrage bleibt ausstehend, bis der Lehrer sie genehmigt.',
        tip: 'Wenn du noch keine Gruppe hast, nutze „Geführte Anfrage" im Gruppenprofil: Sie führt dich Schritt für Schritt zur Auswahl deiner Schule, bevor die Anfrage gesendet wird.',
      },
      {
        t: 'Auf Genehmigung warten',
        d: 'Deine Anfrage bleibt „Ausstehend", bis der Lehrer sie genehmigt oder ablehnt. Du erhältst eine Benachrichtigung, wenn es eine Antwort gibt.',
        warn: 'Nur der verantwortliche Lehrer (oder ein Co-Lehrer) kann Anfragen genehmigen.',
      },
      {
        t: 'Zugriff auf deine Aktivität',
        d: 'Nach der Genehmigung erscheint die Schule in deinem Profil, im Bereich „Wo ich trainiere" — mit deinem Zahlungsstatus und Zugriff auf deine Trainingsstatistiken.',
      },
    ],
  },
  {
    id: 'your-history',
    title: 'Deine persönliche Historie',
    category: 'Praktizierende',
    intro: 'Wie du deine Anwesenheit, deine Trainingsserie und deinen Zahlungsstatus einsiehst.',
    steps: [
      {
        t: 'Wo ich trainiere',
        d: 'In deinem Profil listet der Bereich „Wo ich trainiere" jede Schule auf, der du angehörst, mit einem Zahlungsstatus-Abzeichen (Bezahlt, Ausstehend, Überfällig, Kostenlos...) und, falls eine Zahlung aussteht, einem Button „Zahlung melden".',
        note: 'Dein Zahlungsstatus ist nur für dich und deinen Lehrer sichtbar.',
      },
      {
        t: 'Meine Aktivität',
        d: 'Tippe auf „Statistiken ansehen" bei einer deiner Schulen, um „Meine Aktivität" zu öffnen: deine Serie aufeinanderfolgender Klassen, wie viele Klassen du diesen Monat / in den letzten 30 Tagen / dieses Jahr gemacht hast, ein Häufigkeitsdiagramm, deine letzten Sitzungen und deine Zahlungshistorie. Mit dem eigenen Button kannst du deine Statistiken teilen.',
      },
      {
        t: 'Dein Gürtel',
        d: 'Dein aktueller Gürtel erscheint in deinem Profil. Tippen darauf führt zum vollständigen Graduierungssystem deiner Gruppe — es gibt keine separate persönliche Historie deiner eigenen Beförderungen, aber dein aktueller Gürtel ist dort immer sichtbar.',
      },
      {
        t: 'Bestätigte Events',
        d: 'Tippe auf „Aktivität" in deinem Profil, um anstehende Events zu sehen, bei denen du „Bin dabei" bestätigt hast.',
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
        d: 'Wenn du Lehrer ohne Gruppe bist, siehst du ein Banner „Gruppe erstellen" auf der Startseite oder „Neue Gruppe erstellen" im Tab „Gruppen". Tippe darauf, um das Formular zu öffnen.',
        note: 'Nur Nutzer mit der Rolle Lehrer können Gruppen erstellen.',
      },
      {
        t: 'Name und Beschreibung',
        d: 'Gib den offiziellen Namen deiner Gruppe und eine Beschreibung ein. Beides ist erforderlich. Der Name erscheint im Verzeichnis, auf Mitgliedsprofilen und bei deinen Events.',
      },
      {
        t: 'Capoeira-Stil (erforderlich)',
        d: 'Gib im Feld „Capoeira-Stil *" den Stil ein, den du praktizierst (z. B. Gemischt, Benguela, Angola, Regional). Es ist Freitext und erforderlich — wird als Name deines Graduierungssystems verwendet.',
        tip: 'Das Feld „Stadt" ist optional.',
      },
      {
        t: 'Gruppenlogo (optional)',
        d: 'Lade das Logo aus deiner Galerie hoch. Es erscheint im Gruppenprofil, in ihren Schulen und auf der Karte, die deine Schüler auf der Startseite sehen.',
      },
      {
        t: 'Die Gruppe erstellen',
        d: 'Tippe auf „Erstellen". Wenn der Name nicht doppelt vorhanden ist, wird die Gruppe sofort erstellt und du gelangst direkt zu ihrem Profil.',
      },
      {
        t: 'Mitglieder einladen',
        d: 'Es gibt keinen Einladungscode. Teile den Namen deiner Gruppe mit deinen Schülern: Sie suchen danach im Tab „Gruppen" und beantragen den Beitritt. Du kannst sie auch direkt aus deinem Schulbereich hinzufügen.',
      },
    ],
  },
  {
    id: 'manage-group',
    title: 'Deine Gruppe verwalten',
    category: 'Lehrer',
    intro: 'Wie du Anfragen, Admin-Rollen und Gruppeninformationen verwaltest.',
    steps: [
      {
        t: 'Gruppenbeitrittsanfragen genehmigen oder ablehnen',
        d: 'Gruppenbeitrittsanfragen werden unter „Aktivität" in deinem Profil beantwortet, zusammen mit deinen anderen Benachrichtigungen. Tippe auf die Anfrage, um sie zu genehmigen oder abzulehnen.',
        note: 'Du siehst diese Anfragen nur, wenn du die Gruppe verwaltest.',
      },
      {
        t: 'Rollen zuweisen: Admin und Co-Admin',
        d: 'Öffne vom Gruppenprofil aus den Verwaltungsbereich (nur für Admins und Co-Admins sichtbar). Dort kannst du jedem Mitglied die Rolle „Admin" oder „Co-Admin" zuweisen oder entziehen, oder deine eigene mit „Admin-Rolle verlassen" entfernen.',
        note: 'Diese Änderungen sind umkehrbar.',
      },
      {
        t: 'Gruppeninformationen bearbeiten',
        d: 'Gehe zum Gruppenprofil → Bearbeitungssymbol. Du kannst Logo, Name, Beschreibung und Capoeira-Stil ändern. Änderungen werden sofort im öffentlichen Verzeichnis angezeigt.',
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: 'Pädagogische Aufsicht',
    category: 'Lehrer',
    intro: 'Wie du einen aufsichtführenden Lehrer für die Schüler deiner Schule zuweist.',
    steps: [
      {
        t: 'Was pädagogische Aufsicht ist',
        d: 'Pädagogische Aufsicht ist die hierarchische Beziehung zwischen Lehrern derselben Gruppe. Ein erfahrenerer Lehrer kann den Fortschritt der Schüler eines anderen Lehrers überwachen, besonders nützlich in verschiedenen Städten oder Ländern.',
      },
      {
        t: 'Automatische Aufsicht (gleiche Schule)',
        d: 'Wenn der Aufsichtführende und die Schüler dieselbe Schule teilen, ist die Aufsicht automatisch — du siehst das Abzeichen „Gleiche Schule" im Profil des Schülers.',
      },
      {
        t: 'Manuelle Aufsicht (außerhalb der Schule)',
        d: 'Wenn du keine eigene Schule hast, wähle Aufsichtführende manuell: Tippe auf dem Aufsichtsbildschirm direkt auf den Lehrer in der Liste „Vorgeschlagene Aufsichtführende" und dann auf „Änderungen speichern". So beaufsichtigte Schüler zeigen das Abzeichen „Außerhalb deiner Schule".',
        tip: 'Nur Lehrer derselben Gruppe können als Aufsichtführende zugewiesen werden.',
      },
      {
        t: 'Den Aufsichtsbaum ansehen',
        d: 'Tippe im Gruppenprofil auf die Karte „Hierarchie", um den vollständigen Lehrer-Baum zu öffnen und zu sehen, wer wen beaufsichtigt.',
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
        d: 'Gehe zu „Profil" → Bereich „Verwaltung" → Button „Schule erstellen". Wenn du deine erste Gruppe erstellst, erscheint dieser Schritt auch im ersten Einrichtungsassistenten.',
        note: 'Du musst Lehrer in einer Gruppe sein, um eine Schule zu erstellen. Wenn du gerade deine Gruppe erstellt hast, hast du diese Rolle bereits.',
      },
      {
        t: 'Name und Standort eingeben',
        d: 'Fülle „Schulname" (z. B. Innenstadt-Schule), „Standort" (vollständige Adresse), „Land" und „Stadt" aus. Alle sind erforderlich.',
        tip: 'Nach Eingabe der Adresse tippe auf die Karte, um den Marker an die genaue Stelle zu ziehen.',
      },
      {
        t: 'Trainingszeiten hinzufügen',
        d: 'Tippe unter „Trainingszeiten" auf „Zeitplan hinzufügen": Wochentag, Start- und Endzeit. Mindestens ein Zeitplan ist erforderlich.',
        warn: 'Klassengruppen (Schüler nach Zeitslot) können nur zu diesem Zeitpunkt eingerichtet werden — später gibt es keine Möglichkeit, sie hinzuzufügen. Wenn du verschiedene Niveaus zu verschiedenen Zeiten trainierst, lege das jetzt fest.',
      },
      {
        t: 'Die Schule erstellen',
        d: 'Tippe auf „Schule erstellen". Wenn alle Felder vollständig sind, wird die Schule erstellt und ist im Verzeichnis sichtbar.',
      },
      {
        t: 'Bearbeiten oder löschen',
        d: 'Um Name, Adresse oder Zeitpläne zu bearbeiten, gehe zum Schulprofil → Bearbeitungssymbol. „Schule löschen" ist endgültig und nur für den verantwortlichen Lehrer verfügbar — es gibt keine Option, sie nur aus dem Verzeichnis auszublenden.',
        warn: 'Das Löschen einer Schule ist unwiderruflich.',
      },
      {
        t: 'Das Abrechnungssystem einrichten',
        d: 'Unter „Schule bearbeiten" findest du den Abrechnungsbereich. Aktiviere „Kostenlose Klassen", wenn du keine monatliche Gebühr erhebst. Falls doch, gib den Monatspreis, die Währung und den Tag im Monat ein, an dem die Zahlung fällig ist.',
        tip: 'Wenn deine Schüler unterschiedliche Tarife je Zeitslot haben, kann jede Klassengruppe ihren eigenen Preis haben.',
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
        d: 'Ein Co-Lehrer ist ein Lehrer derselben Gruppe, der bei der Verwaltung deiner Schule hilft: er erfasst Klassen, markiert Anwesenheit, registriert Zahlungen und kann die Schuldaten bearbeiten. Nur das Löschen der Schule oder die Übertragung der Verantwortung bleiben dem verantwortlichen Lehrer vorbehalten.',
      },
      {
        t: 'Einen Co-Lehrer hinzufügen',
        d: 'Gehe zum Verwaltungsbereich deiner Schule → Tab „Team" (nur für den verantwortlichen Lehrer sichtbar). Wähle aus der Liste der Lehrer der Gruppe und bestätige.',
      },
      {
        t: 'Einen Co-Lehrer entfernen',
        d: 'Tippe im Tab „Team" auf den Namen des Co-Lehrers und wähle „Co-Lehrer entfernen".',
        warn: 'Das Entfernen eines Co-Lehrers löscht keine Daten: alles, was er erfasst hat, bleibt im System.',
      },
      {
        t: 'Die Co-Lehrer-Rolle verlassen',
        d: 'Wenn du Co-Lehrer an einer Schule bist und es nicht mehr sein möchtest, gehe zum öffentlichen Profil der Schule und tippe auf „Rolle verlassen".',
      },
      {
        t: 'Die Verantwortung für die Schule übertragen',
        d: 'Im Tab „Team" kann der verantwortliche Lehrer die Verantwortung an einen aktiven Co-Lehrer übertragen. Wer überträgt, wird zum Co-Lehrer der Schule.',
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
        d: 'Gehe zum Verwaltungsbereich deiner Schule → Tab „Anfragen". Du siehst alle ausstehenden Beitrittsanfragen mit Name, Foto und Datum des Antragstellers.',
      },
      {
        t: 'Eine Anfrage genehmigen oder ablehnen',
        d: 'Tippe auf jeder Karte auf das ✓-Symbol zum Genehmigen oder auf das ✕-Symbol zum Ablehnen. Der Antragsteller erhält eine Benachrichtigung mit der Antwort, und bei Genehmigung erscheint er sofort in deiner Schülerliste.',
        tip: 'Wenn du jemanden versehentlich ablehnst, kann er eine neue Anfrage senden.',
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Schüler & Klassengruppen',
    category: 'Lehrer',
    intro: 'Wie du deine Schüler ansiehst und Mitglieder ohne App-Konto hinzufügst.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Der Schul-Verwaltungsbereich',
        d: 'Zugriff über „Profil" → Bereich „Verwaltung" → deine Schule, oder über das Schulprofil durch Tippen auf den Verwaltungsbutton. Du findest „Anwesenheit" (standardmäßig geöffnet), „Schüler", „Zahlungen" und „Berichte".',
      },
      {
        t: 'Die Schülerliste ansehen',
        d: 'Im Tab „Schüler" siehst du alle mit deiner Schule verknüpften Mitglieder mit Name, aktuellem Gürtel und monatlichem Anwesenheitsprozentsatz.',
      },
      {
        t: 'Einen Schüler ohne Konto hinzufügen (Geister-Mitglied)',
        d: 'Tippe im Tab „Schüler" auf das „+"-Symbol, um einen Schüler manuell zu registrieren, der die App nicht nutzt. Gib Name und grundlegende Details ein.',
        note: 'Schüler ohne Konto können Graduierungen erhalten und haben Anwesenheits- und Zahlungsdatensätze wie jeder andere Schüler. Sobald sie sich in der App registrieren, kannst du ihr Profil verknüpfen, um die vollständige Historie zu erhalten.',
      },
      {
        t: 'Klassengruppen',
        d: 'Klassengruppen (Schüler nach Zeitplan organisiert) werden einmalig bei der Schulerstellung festgelegt — es gibt keinen Bildschirm, um später neue hinzuzufügen.',
        tip: 'Klassengruppen machen die Anwesenheit schneller: Der Anwesenheitsbildschirm zeigt nur die Schüler des ausgewählten Zeitslots.',
      },
      {
        t: 'Das Profil eines einzelnen Schülers ansehen',
        d: 'Tippe auf den Namen eines Schülers, um sein Profil zu sehen: Gürtel, Anwesenheitsprozentsatz des Monats, Anwesenheitshistorie und Zahlungsdatensatz.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Anwesenheitserfassung',
    category: 'Lehrer',
    intro: 'Wie du eine Klasse erfasst, anwesend und abwesend markierst und die Historie einsiehst.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Eine Klasse erfassen',
        d: 'Tippe im Schul-Verwaltungsbereich → Tab „Anwesenheit" auf „Heutige Klasse erfassen". Du kannst im Formular das Datum ändern, um eine Klasse für einen anderen Tag zu erfassen — die App passt die verfügbaren Zeitpläne entsprechend an.',
      },
      {
        t: 'Zeitplan und Klassengruppe auswählen',
        d: 'Wähle im Sitzungsformular den passenden Zeitplan. Die App lädt automatisch die Schüler dieser Gruppe.',
        tip: 'Wenn du keine Klassengruppen konfiguriert hast, zeigt die Liste alle Schüler der Schule.',
      },
      {
        t: 'Anwesend und abwesend markieren',
        d: 'Tippe auf den Namen jedes Schülers, um zwischen anwesend und abwesend zu wechseln.',
      },
      {
        t: 'Eine Klasse aussetzen',
        d: 'Wenn die Klasse nicht stattgefunden hat (Feiertag, Regen usw.), aktiviere „Klasse aussetzen", bevor du speicherst. Sie wird mit dem Abzeichen „Ausgesetzt" erfasst und zählt weder zur Anwesenheit noch zur Abrechnung.',
      },
      {
        t: 'Die Klasse speichern',
        d: 'Tippe auf „Klasse speichern". Die App zeigt einen Dialog mit der Anzahl Anwesender und Abwesender — tippe auf „Bestätigen", um die Sitzung zu erfassen.',
      },
      {
        t: 'Vorherige Sitzungen einsehen',
        d: 'Im Tab „Anwesenheit" erscheinen die Sitzungen in chronologischer Reihenfolge. Tippe auf eine vergangene Sitzung, um das Detail zu sehen oder sie zu bearbeiten.',
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
        d: 'Gehe im Schul-Verwaltungsbereich zum Tab „Zahlungen". Jeder Schüler erscheint mit seinem Status für den Monat: Ausstehend, Bezahlt, Bezahlt (verspätet), Überfällig, Kostenlos, Gemeldet (der Schüler hat die Zahlung gemeldet) oder Doppelt.',
        warn: 'Der Tab „Zahlungen" erscheint nur, wenn die Schule „Kostenlose Klassen" deaktiviert hat.',
      },
      {
        t: 'Eine Schülerzahlung erfassen',
        d: 'Tippe auf den Namen des Schülers im Tab „Zahlungen" und dann auf „Zahlung erfassen". Gib den Betrag, den entsprechenden Monat und, falls zutreffend, einen Rabatt (fester Betrag oder Prozentsatz) ein — nützlich für Stipendien.',
        tip: 'Du kannst Vorauszahlungen erfassen: Wähle einfach den entsprechenden zukünftigen Monat.',
      },
      {
        t: 'Eine von einem Schüler gemeldete Zahlung prüfen',
        d: 'Wenn ein Schüler seine Zahlung über sein eigenes Profil meldet, erscheint sie in deinem Tab „Zahlungen" mit der Kennzeichnung „Gemeldet". Tippe darauf und bearbeite sie wie jede andere Zahlung, um den Status auf „Bezahlt" zu ändern.',
      },
      {
        t: 'Sehen, wer ausstehende oder überfällige Zahlungen hat',
        d: 'In der Liste des Tabs „Zahlungen" siehst du auf einen Blick den Status aller Schüler, einschließlich des konfigurierten Fälligkeitstags.',
      },
      {
        t: 'Den Monatsbericht erstellen und exportieren',
        d: 'Gehe zum Tab „Berichte" des Schulbereichs. Wähle das Format (CSV oder PDF) und tippe auf „Bericht erstellen". Er enthält die Zusammenfassung von Zahlungen und Anwesenheit des Monats.',
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
        d: 'Gehe zum Profil deiner Gruppe → einklappbarer Bereich „Graduierungssystem" → „Vollständiges System verwalten" (oder „System jetzt einrichten", falls du noch keine Stufen hast).',
      },
      {
        t: 'Eine Gürtelstufe erstellen',
        d: 'Tippe auf „Stufe hinzufügen". Gib den Gürtelnamen ein, wähle die Farben, aus denen er besteht, und gib an, ob er bemalte Spitzen hat und wie viele.',
      },
      {
        t: 'Nach Kategorie organisieren',
        d: 'Stufen werden in Bereiche organisiert: Erwachsene, Jugendliche, Kinder, Auszubildende Lehrer und Sonderstufen. Weise beim Erstellen oder Bearbeiten jeder Stufe die richtige Kategorie zu.',
      },
      {
        t: 'Die Lehrerstufe definieren',
        d: 'Du kannst festlegen, ab welchem Gürtel ein Schüler in der Gruppe als „Lehrer" gilt — dies bestimmt, wer Zugriff auf das Erstellen von Schulen und die Verwaltungstools hat.',
      },
      {
        t: 'Eine Graduierung zuweisen',
        d: 'Tippe auf dem Bildschirm des Graduierungssystems auf „Graduierung an Mitglieder vergeben". Finde den Schüler, wähle die neue Stufe und das Datum. Die Änderung erscheint sofort in seinem Profil.',
      },
      {
        t: 'Den Gürtel eines Schülers ansehen',
        d: 'Tippe auf den Namen eines beliebigen Gruppenmitglieds, um seinen aktuellen Gürtel mit Farbe zu sehen.',
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
        d: 'Gehe zum Tab „Events" und tippe auf den schwebenden „+"-Button.',
      },
      {
        t: 'Fülle die Grunddaten aus',
        d: 'Gib den Event-Namen, die Beschreibung und die Kategorie ein (Batizado, Roda, offene Roda, Troca de Corda, Kurs, Workshop, Seminar, Festival, Treffen, Intensivkurs, Training, oder eine eigene Kategorie).',
      },
      {
        t: 'Datum, Plakat und Dokumente',
        d: 'Lege Start- und Enddatum fest (mit Wiederholungsoption), lade ein Titelbild (Plakat) hoch und füge, falls du Regeln oder Reglements teilen musst, ein PDF bis zu 10 MB an.',
        tip: 'Events mit Plakat erhalten höhere Sichtbarkeit in den Feeds der Mitglieder.',
      },
      {
        t: 'Preis und Programm',
        d: 'Falls das Event Kosten verursacht, gib den Preis und die akzeptierten Zahlungsmethoden ein (Überweisung, Bar, Mercado Pago, PayPal oder andere). Wenn das Event mehrere Aktivitäten hat, füge sie unter „Programm" hinzu — jeder Block mit eigener Zeit, Beschreibung und Ort.',
        tip: 'Wenn du einen Programmblock mit Ort hinzufügst, wird der allgemeine Standort des Events automatisch aus diesen Blöcken abgeleitet.',
      },
      {
        t: 'Standort',
        d: 'Falls du das Programm mit Orten pro Block nicht genutzt hast, gib die Event-Adresse am Ende des Formulars ein. Die App öffnet die Kartenauswahl, um den genauen Marker zu platzieren.',
      },
      {
        t: 'Ein bestehendes Event bearbeiten',
        d: 'Gehe zum Event-Detail → Bearbeitungssymbol (verfügbar für Organisator und Mitorganisatoren). Änderungen sind sofort für alle sichtbar.',
        warn: 'Personen, die bereits „Bin dabei" bestätigt haben, erhalten keine automatische Benachrichtigung, wenn du Datum oder Standort änderst.',
      },
      {
        t: 'Mitorganisatoren und besondere Gäste verwalten',
        d: 'Tippe im Bearbeitungsmenü des Events auf „Mitwirkende". Wähle vor der Einladung die Rolle: „Mitorganisator" (kann das Event bearbeiten) oder „Besonderer Gast" (wird hervorgehoben angezeigt, ohne Bearbeitungsrecht). Suche nach Namen und sende die Einladung.',
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
        d: 'Oben im Schul-Verwaltungsbereich siehst du eine Leiste mit 3 Werten: Anzahl Schüler, durchschnittlicher Anwesenheitsprozentsatz und bezahlte Schüler im Verhältnis zur Gesamtzahl.',
      },
      {
        t: 'Zu einem anderen Monat springen',
        d: 'Tippe auf die Monatsbezeichnung in dieser Leiste, um eine Auswahl zu öffnen und direkt zu einem beliebigen vergangenen Monat zu springen.',
      },
      {
        t: 'Der Tab „Berichte"',
        d: 'Gehe zum Schulbereich → Tab „Berichte". Wenn du Klassengruppen konfiguriert hast, kannst du den gesamten Bericht mit den Chips oben nach einer bestimmten Gruppe filtern.',
      },
      {
        t: 'Format wählen und exportieren',
        d: 'Wähle „CSV" (zum Öffnen in Excel oder Google Sheets) oder „PDF" (zum Teilen oder Drucken) und tippe auf „Bericht erstellen". Enthält aktive Schüler, abgehaltene Sitzungen, Anwesenheitsprozentsatz und Zahlungsstatus pro Schüler.',
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
        d: 'Inserisci nome, cognome, soprannome (opzionale), paese (rilevato automaticamente), il tuo ruolo (Praticante o Educatore — solo un altro campo dello stesso modulo), email e password.',
        tip: 'Scegli "Educatore" se insegni già capoeira — questo sblocca subito gli strumenti di gestione. Puoi cambiarlo dopo.',
        note: 'Per registrarti con Google invece di compilare il modulo, fallo dalla schermata di accesso (non disponibile nella versione web).',
      },
      {
        t: 'Completa l\'onboarding',
        d: 'Dopo la registrazione, una procedura guidata ti accompagna passo dopo passo. Se sei alunno: completa il profilo, cerca il tuo gruppo e scegli la tua scuola. Se sei educatore: completa il profilo, scegli se unirti a un gruppo esistente o crearne uno tuo, e concludi creando la tua scuola.',
        note: 'Il passaggio del profilo richiede di scegliere un genere prima di poter continuare.',
      },
      {
        t: 'Collega il tuo gruppo',
        d: 'Se hai finito l\'onboarding senza unirti a un gruppo, vedrai nella schermata Home la card "Non appartieni ancora a un gruppo" con i pulsanti "Trova gruppo" e "Richiesta guidata" (e "Crea gruppo" se sei educatore).',
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
        d: 'La scheda "Home" mostra un saluto personalizzato con il tuo nome e la sezione "Prossimi eventi" con gli eventi della tua comunità in ordine cronologico. Un badge rosso sulla scheda "Profilo" indica notifiche in sospeso.',
        tip: 'Scorri verso il basso per aggiornare il feed in qualsiasi momento.',
      },
      {
        t: 'Filtra i prossimi eventi',
        d: 'Nella sezione "Prossimi eventi" troverai dei filtri rapidi: "Tutti", "Oggi", "Questa settimana" e "Questo mese". Toccali per restringere la vista.',
      },
      {
        t: 'Ricerca globale',
        d: 'Tocca la barra di ricerca nella schermata Home per aprire la ricerca globale. Digita un termine qualsiasi e vedrai i risultati organizzati in quattro sezioni: Eventi, Gruppi, Scuole e Utenti.',
      },
      {
        t: 'Card e promemoria in Home',
        d: 'Sopra "Prossimi eventi" possono apparire card contestuali: una tua richiesta in attesa di approvazione, la tua prossima lezione (se ti alleni in una scuola) con la tua serie di presenze, oppure — se sei educatore — un accesso rapido per registrare la presenza di oggi.',
      },
      {
        t: 'Accessi rapidi per educatori',
        d: 'Se gestisci una sola scuola, vedrai due chip fissi sotto i filtri: "Pannello scuola" e "Registra lezione", per accedere direttamente a quelle schermate.',
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
        d: 'Tocca un gruppo qualsiasi per vedere il suo profilo. È un\'unica schermata scorrevole: descrizione, una sezione comprimibile "Sistema di graduazione", una card "Gerarchia" (apre l\'albero degli educatori in una schermata separata) e i prossimi eventi del gruppo.',
      },
      {
        t: 'Richiedi di unirti a un gruppo',
        d: 'Il pulsante "Richiedi di unirti al gruppo" appare nel profilo solo se sei educatore (o hai una graduazione da educatore) e non hai ancora un gruppo. La tua richiesta mostrerà il badge "Richiesta in attesa di approvazione".',
        tip: 'Se sei un alunno senza gruppo, usa invece la "Richiesta guidata": ti accompagna passo dopo passo nella scelta della scuola (e del suo educatore) prima di inviare la richiesta.',
      },
      {
        t: 'Visualizza la gerarchia del gruppo',
        d: 'Tocca la card "Gerarchia" nel profilo del gruppo per aprire l\'albero completo degli educatori, con ricerca per nome. Tocca un educatore qualsiasi per vedere il suo profilo pubblico.',
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
        d: 'Accanto al pulsante di alternanza vista trovi 3 chip rapidi: "Gratis", "Online" e "Questo weekend". Per altre opzioni, tocca "Filtri": categoria (batizado, roda, roda aperta, troca de corda, corso, workshop, seminario, festival, incontro, intensivo, allenamento, o una categoria personalizzata), prezzo, formato, date, gruppo e posizione.',
        tip: 'Puoi combinare più filtri contemporaneamente.',
      },
      {
        t: 'Dettaglio evento',
        d: 'Tocca un evento qualsiasi per vedere la descrizione completa, data e ora, posizione sulla mappa, organizzatori e locandina se presente. Vedrai anche quante persone partecipano ("Partecipo") e quante hanno segnato interesse ("Interessato"), con una fila di avatar di chi partecipa.',
      },
      {
        t: 'Conferma "Partecipo" o "Interessato"',
        d: 'Dal dettaglio dell\'evento, tocca "Interessato" per salvarlo nella tua lista, o "Partecipo" per confermare la presenza. Toccare di nuovo lo stesso pulsante rimuove la tua conferma.',
        tip: 'Gli eventi che hai segnato come "Partecipo" appaiono evidenziati nella tua schermata Home.',
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
        t: 'Come è organizzato il tuo profilo',
        d: 'La scheda "Profilo" è un\'unica schermata (senza schede interne): in alto la tua foto, il ruolo e il gruppo; poi un pulsante "Attività"; e più in basso le sezioni in base al tuo ruolo — "Gestione" (educatori, le loro scuole) o "Dove mi alleno" (alunni, presenze e pagamenti).',
      },
      {
        t: 'Modifica il tuo profilo',
        d: 'Tocca l\'icona di modifica (matita) sulla tua foto o sul nome. Puoi cambiare foto, nome, cognome, soprannome, una breve bio, paese, data di nascita, genere (obbligatorio) e i link ai tuoi social (Instagram, Facebook, WhatsApp, YouTube, TikTok e sito web). Salva toccando "Salva".',
        tip: 'Un\'immagine quadrata appare meglio nella foto profilo circolare.',
      },
      {
        t: 'La tua corda',
        d: 'La tua corda attuale appare con il suo colore e nome sotto il tuo nome nel profilo. Toccarla ti porta al sistema di graduazione completo del tuo gruppo (tutti i livelli), non a una cronologia personale delle tue promozioni.',
      },
      {
        t: 'Impostazioni: lingua e tema',
        d: 'Da "Profilo", tocca "Impostazioni". Lì cambi la lingua (spagnolo, portoghese, inglese, francese, tedesco, italiano) e il tema visivo (chiaro o scuro). Le modifiche si applicano immediatamente.',
      },
      {
        t: 'Notifiche push: scegli cosa vuoi ricevere',
        d: 'In "Impostazioni → Notifiche" attiva o disattiva ogni tipo separatamente: promemoria evento, nuovi eventi del tuo gruppo, eventi vicino a te, riepilogo settimanale e novità della tua comunità.',
        tip: 'Se attivi la posizione GPS, l\'app rileva il tuo paese attuale per avvisarti di eventi rilevanti anche in viaggio.',
      },
      {
        t: 'Attività: richieste e prossimi eventi',
        d: 'Tocca il pulsante "Attività" nel tuo profilo per vedere i tuoi prossimi eventi confermati e le tue richieste in sospeso: di gruppo, di scuola, di educatore, di trasferimento scuola e di collaborazione a un evento. Il badge rosso sulla scheda "Profilo" mostra quante non hai letto.',
      },
      {
        t: 'Segnala un problema',
        d: 'Vai su "Profilo" → "Impostazioni" → "Segnala un problema". La tua segnalazione va direttamente al team di sviluppo.',
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
    intro: 'Come trovare una scuola, inviare una richiesta e cosa succede dopo.',
    steps: [
      {
        t: 'Trova la tua scuola',
        d: 'Vai alla scheda "Gruppi", cerca il tuo gruppo per nome (o filtra per paese/stile) ed entra nel suo profilo. Da lì puoi raggiungere la scuola dove ti alleni.',
      },
      {
        t: 'Unisciti alla scuola',
        d: 'Nel profilo della scuola, tocca "Unisciti". La tua richiesta resta in sospeso finché l\'educatore non la approva.',
        tip: 'Se non hai ancora un gruppo, usa "Richiesta guidata" dal profilo del gruppo: ti accompagna passo dopo passo nella scelta della scuola prima di inviare la richiesta.',
      },
      {
        t: 'Attendi l\'approvazione',
        d: 'La tua richiesta resta "In sospeso" finché l\'educatore non la approva o la rifiuta. Riceverai una notifica quando c\'è una risposta.',
        warn: 'Solo l\'educatore responsabile (o un co-educatore) può approvare le richieste.',
      },
      {
        t: 'Accedi alla tua attività',
        d: 'Una volta approvata, la scuola appare nel tuo profilo, nella sezione "Dove mi alleno" — con il tuo stato di pagamento e l\'accesso alle tue statistiche di allenamento.',
      },
    ],
  },
  {
    id: 'your-history',
    title: 'La tua storia personale',
    category: 'Praticanti',
    intro: 'Come visualizzare le tue presenze, la tua serie di allenamenti e lo stato dei tuoi pagamenti.',
    steps: [
      {
        t: 'Dove mi alleno',
        d: 'Nel tuo profilo, la sezione "Dove mi alleno" elenca ogni scuola a cui appartieni con un badge di stato pagamento (Pagato, In sospeso, Scaduto, Gratuito...) e, se hai un pagamento in sospeso, un pulsante "Segnala pagamento".',
        note: 'Il tuo stato di pagamento è visibile solo a te e al tuo educatore.',
      },
      {
        t: 'La mia attività',
        d: 'Tocca "Vedi statistiche" su una delle tue scuole per aprire "La mia attività": la tua serie di lezioni consecutive, quante lezioni hai fatto questo mese / negli ultimi 30 giorni / quest\'anno, un grafico di frequenza, le tue sessioni recenti e la tua cronologia pagamenti. Puoi condividere le tue statistiche con il pulsante dedicato.',
      },
      {
        t: 'La tua corda',
        d: 'La tua corda attuale appare nel tuo profilo. Toccarla ti porta al sistema di graduazione completo del tuo gruppo — non esiste una cronologia personale separata delle tue promozioni, ma la tua corda attuale è sempre visibile lì.',
      },
      {
        t: 'Eventi confermati',
        d: 'Tocca "Attività" nel tuo profilo per vedere i prossimi eventi a cui hai confermato "Partecipo".',
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
        d: 'Se sei educatore e non hai ancora un gruppo, vedrai un banner "Crea gruppo" in Home o "Crea nuovo gruppo" nella scheda "Gruppi". Toccalo per aprire il modulo.',
        note: 'Solo gli utenti con il ruolo di Educatore possono creare gruppi.',
      },
      {
        t: 'Nome e descrizione',
        d: 'Inserisci il nome ufficiale del tuo gruppo e una descrizione. Entrambi sono obbligatori. Il nome apparirà nella directory, sui profili dei membri e sui tuoi eventi.',
      },
      {
        t: 'Stile di capoeira (obbligatorio)',
        d: 'Nel campo "Stile di capoeira *", digita lo stile che praticate (es. Misto, Benguela, Angola, Regional). È testo libero ed è obbligatorio — usato come nome del tuo sistema di graduazione.',
        tip: 'Il campo "Città" è opzionale.',
      },
      {
        t: 'Logo del gruppo (opzionale)',
        d: 'Carica il logo dalla tua galleria. Apparirà nel profilo del gruppo, nelle sue scuole e nella card che i tuoi alunni vedono in Home.',
      },
      {
        t: 'Crea il gruppo',
        d: 'Tocca "Crea". Se il nome non è duplicato, il gruppo viene creato immediatamente ed entri direttamente nel suo profilo.',
      },
      {
        t: 'Invita membri',
        d: 'Non esiste un codice di invito. Condividi il nome del tuo gruppo con i tuoi alunni: lo cercheranno nella scheda "Gruppi" e richiederanno di unirsi. Puoi anche aggiungerli direttamente dal pannello della tua scuola.',
      },
    ],
  },
  {
    id: 'manage-group',
    title: 'Gestire il tuo gruppo',
    category: 'Educatori',
    intro: 'Come gestire richieste, ruoli di amministrazione e informazioni del gruppo.',
    steps: [
      {
        t: 'Approva o rifiuta le richieste di adesione al gruppo',
        d: 'Le richieste di adesione al gruppo si gestiscono da "Attività" nel tuo profilo, insieme alle altre notifiche. Tocca la richiesta per approvarla o rifiutarla.',
        note: 'Vedi queste richieste solo se amministri il gruppo.',
      },
      {
        t: 'Assegna ruoli: admin e co-admin',
        d: 'Dal profilo del gruppo, apri il pannello di amministrazione (visibile solo agli admin e co-admin). Lì puoi attivare o rimuovere il ruolo "Admin" o "Co-admin" per qualsiasi membro, o rimuovere il tuo con "Lascia ruolo admin".',
        note: 'Queste modifiche sono reversibili.',
      },
      {
        t: 'Modifica le informazioni del gruppo',
        d: 'Vai al profilo del gruppo → icona di modifica. Puoi cambiare logo, nome, descrizione e stile di capoeira. Le modifiche si riflettono immediatamente nella directory pubblica.',
      },
    ],
  },
  {
    id: 'educational-supervision',
    title: 'Supervisione educativa',
    category: 'Educatori',
    intro: 'Come assegnare un educatore supervisore per gli alunni della tua scuola.',
    steps: [
      {
        t: 'Cos\'è la supervisione educativa',
        d: 'La supervisione educativa è la relazione gerarchica tra educatori dello stesso gruppo. Un educatore più esperto può supervisionare il progresso degli alunni di un altro educatore, particolarmente utile quando si trovano in città o paesi diversi.',
      },
      {
        t: 'Supervisione automatica (stessa scuola)',
        d: 'Se il supervisore e gli alunni condividono la stessa scuola, la supervisione è automatica — vedrai il badge "Stessa scuola" nel profilo dell\'alunno.',
      },
      {
        t: 'Supervisione manuale (fuori dalla scuola)',
        d: 'Se non hai una scuola tua, scegli i supervisori manualmente: nella schermata di supervisione, tocca direttamente l\'educatore nell\'elenco "Supervisori suggeriti" e poi "Salva modifiche". Gli alunni supervisionati così mostreranno il badge "Fuori dalla tua scuola".',
        tip: 'Solo gli educatori dello stesso gruppo possono essere assegnati come supervisori.',
      },
      {
        t: 'Visualizza l\'albero di supervisione',
        d: 'Nel profilo del gruppo, tocca la card "Gerarchia" per aprire l\'albero completo degli educatori e chi supervisiona chi.',
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
        d: 'Vai su "Profilo" → sezione "Gestione" → pulsante "Crea scuola". Se stai creando il tuo primo gruppo, questo passaggio appare anche nella procedura guidata iniziale.',
        note: 'Devi essere educatore di un gruppo per creare una scuola. Se hai appena creato il tuo gruppo, hai già quel ruolo.',
      },
      {
        t: 'Compila nome e posizione',
        d: 'Completa "Nome scuola" (es. Scuola Centro), "Posizione" (indirizzo completo), "Paese" e "Città". Tutti sono obbligatori.',
        tip: 'Dopo aver inserito l\'indirizzo, tocca la mappa per trascinare il marcatore nel punto esatto.',
      },
      {
        t: 'Aggiungi orari di allenamento',
        d: 'In "Orari di allenamento", tocca "Aggiungi orario": giorno della settimana, orario di inizio e di fine. È richiesto almeno un orario.',
        warn: 'I gruppi di lezione (alunni per fascia oraria) possono essere configurati solo in questo momento — non c\'è modo di aggiungerli dopo. Se ti alleni con livelli diversi in orari diversi, definiscilo ora.',
      },
      {
        t: 'Crea la scuola',
        d: 'Tocca "Crea scuola". Se tutti i campi sono completi, la scuola viene creata e visibile nella directory.',
      },
      {
        t: 'Modifica o elimina la scuola',
        d: 'Per modificare nome, indirizzo o orari, vai al profilo della scuola → icona di modifica. "Elimina scuola" è una cancellazione permanente, disponibile solo per l\'educatore responsabile — non esiste un\'opzione per nasconderla solo dalla directory.',
        warn: 'Eliminare una scuola è irreversibile.',
      },
      {
        t: 'Configura il sistema di pagamento',
        d: 'In "Modifica scuola" trovi la sezione pagamenti. Attiva "Lezioni gratuite" se non fai pagare una quota mensile. Se la fai pagare, inserisci il prezzo mensile, la valuta e il giorno del mese in cui il pagamento è dovuto.',
        tip: 'Se hai alunni con tariffe diverse per fascia oraria, ogni gruppo di lezione può avere il proprio prezzo.',
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
        d: 'Un co-educatore è un educatore dello stesso gruppo che aiuta a gestire la tua scuola: registra lezioni, segna presenze, registra pagamenti e può modificare i dati della scuola. Solo eliminare la scuola o trasferire la responsabilità restano riservati all\'educatore responsabile.',
      },
      {
        t: 'Aggiungi un co-educatore',
        d: 'Vai al pannello di amministrazione della tua scuola → scheda "Team" (visibile solo all\'educatore responsabile). Scegli dall\'elenco degli educatori del gruppo e conferma.',
      },
      {
        t: 'Rimuovi un co-educatore',
        d: 'Nella scheda "Team", tocca il nome del co-educatore e scegli "Rimuovi co-educatore".',
        warn: 'Rimuovere un co-educatore non elimina alcun dato: tutto ciò che ha registrato resta nel sistema.',
      },
      {
        t: 'Lascia il ruolo di co-educatore',
        d: 'Se sei co-educatore in una scuola e non vuoi più esserlo, vai al profilo pubblico della scuola e tocca "Lascia ruolo".',
      },
      {
        t: 'Trasferisci la responsabilità della scuola',
        d: 'Dalla scheda "Team", l\'educatore responsabile può trasferire la responsabilità a un co-educatore attivo. Chi trasferisce diventa co-educatore della scuola.',
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
        d: 'Vai al pannello di amministrazione della tua scuola → scheda "Richieste". Vedrai tutte le richieste di adesione in sospeso, con nome, foto e data del richiedente.',
      },
      {
        t: 'Approva o rifiuta una richiesta',
        d: 'Su ogni card, tocca l\'icona ✓ per approvare o l\'icona ✕ per rifiutare. Il richiedente riceve una notifica con la risposta, e se approvi, appare subito nel tuo elenco alunni.',
        tip: 'Se rifiuti qualcuno per errore, può inviare una nuova richiesta.',
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Alunni e gruppi di lezione',
    category: 'Educatori',
    intro: 'Come visualizzare i tuoi alunni e aggiungere membri senza account nell\'app.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Il pannello di amministrazione della scuola',
        d: 'Accedi da "Profilo" → sezione "Gestione" → la tua scuola, oppure dal profilo della scuola toccando il pulsante admin. Troverai "Presenze" (aperta di default), "Alunni", "Pagamenti" e "Report".',
      },
      {
        t: 'Visualizza l\'elenco alunni',
        d: 'Nella scheda "Alunni" vedrai tutti i membri collegati alla tua scuola con nome, corda attuale e percentuale di presenza mensile.',
      },
      {
        t: 'Aggiungi un alunno senza account (membro fantasma)',
        d: 'Nella scheda "Alunni", tocca l\'icona "+" per registrare manualmente un alunno che non usa l\'app. Inserisci il suo nome e i dettagli di base.',
        note: 'Gli alunni senza account possono ricevere graduazioni e avere registri di presenze e pagamenti come qualsiasi altro alunno. Quando si registrano nell\'app, puoi collegare il loro profilo per preservare la cronologia completa.',
      },
      {
        t: 'Gruppi di lezione',
        d: 'I gruppi di lezione (alunni organizzati per orario) si definiscono una sola volta, alla creazione della scuola — non c\'è una schermata per aggiungerne di nuovi dopo.',
        tip: 'Avere gruppi di lezione rende le presenze più veloci: la schermata presenze mostra solo gli alunni della fascia oraria selezionata.',
      },
      {
        t: 'Visualizza il profilo di un singolo alunno',
        d: 'Tocca il nome di un alunno qualsiasi per vedere la sua scheda: corda, percentuale di presenza del mese, cronologia delle presenze e registro pagamenti.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Controllo presenze',
    category: 'Educatori',
    intro: 'Come registrare una lezione, segnare presenti e assenti, e rivedere la cronologia.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Registra una lezione',
        d: 'Nel pannello di amministrazione della scuola → scheda "Presenze", tocca "Registra lezione di oggi". Puoi cambiare la data nel modulo per registrare una lezione di un altro giorno — l\'app adatta gli orari disponibili in base alla data scelta.',
      },
      {
        t: 'Seleziona orario e gruppo di lezione',
        d: 'Nel modulo della sessione, seleziona l\'orario corrispondente. L\'app carica automaticamente gli alunni di quel gruppo.',
        tip: 'Se non hai gruppi di lezione configurati, l\'elenco mostrerà tutti gli alunni della scuola.',
      },
      {
        t: 'Segna presenti e assenti',
        d: 'Tocca il nome di ogni alunno per alternare tra presente e assente.',
      },
      {
        t: 'Sospendi una lezione',
        d: 'Se la lezione non si è svolta (festività, pioggia, ecc.), attiva "Sospendi lezione" prima di salvare. Viene registrata con il badge "Sospesa" e non conta né nelle presenze né nei pagamenti.',
      },
      {
        t: 'Salva la lezione',
        d: 'Tocca "Salva lezione". L\'app mostra una finestra con il conteggio di presenti e assenti — tocca "Conferma" per registrare la sessione.',
      },
      {
        t: 'Rivedi le sessioni precedenti',
        d: 'Nella scheda "Presenze", le sessioni appaiono in ordine cronologico. Tocca una sessione passata qualsiasi per vedere il dettaglio o modificarla.',
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
        d: 'Nel pannello di amministrazione della scuola, vai alla scheda "Pagamenti". Ogni alunno appare con il suo stato del mese: In sospeso, Pagato, Pagato (in ritardo), Scaduto, Gratuito, Segnalato (l\'alunno ha indicato di aver pagato) o Duplicato.',
        warn: 'La scheda "Pagamenti" appare solo se la scuola ha disattivato "Lezioni gratuite".',
      },
      {
        t: 'Registra il pagamento di un alunno',
        d: 'Tocca il nome dell\'alunno nella scheda "Pagamenti" e poi "Registra pagamento". Inserisci l\'importo, il mese corrispondente e, se applicabile, uno sconto (importo fisso o percentuale) — utile per le borse di studio.',
        tip: 'Puoi registrare pagamenti anticipati: seleziona semplicemente il mese futuro corrispondente.',
      },
      {
        t: 'Verifica un pagamento segnalato da un alunno',
        d: 'Quando un alunno segnala il suo pagamento dal proprio profilo, appare nella tua scheda "Pagamenti" con l\'etichetta "Segnalato". Toccalo e modificalo come qualsiasi altro pagamento per cambiarne lo stato in "Pagato".',
      },
      {
        t: 'Vedi chi ha pagamenti in sospeso o scaduti',
        d: 'Nell\'elenco della scheda "Pagamenti" vedi a colpo d\'occhio lo stato di tutti gli alunni, incluso il giorno di scadenza configurato.',
      },
      {
        t: 'Genera ed esporta il report mensile',
        d: 'Vai alla scheda "Report" del pannello della scuola. Seleziona il formato (CSV o PDF) e tocca "Genera report". Include il riepilogo di pagamenti e presenze del mese.',
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
        d: 'Vai al profilo del tuo gruppo → sezione comprimibile "Sistema di graduazione" → "Gestisci sistema completo" (o "Configura sistema ora" se non hai ancora livelli).',
      },
      {
        t: 'Crea un livello di corda',
        d: 'Tocca "Aggiungi livello". Inserisci il nome della corda, seleziona i colori che la compongono e indica se ha punte colorate e quante.',
      },
      {
        t: 'Organizza per categoria',
        d: 'I livelli sono organizzati in sezioni: adulti, giovani, bambini, istruttori in formazione e livelli speciali. Assegna la categoria corretta quando crei o modifichi ogni livello.',
      },
      {
        t: 'Definisci il livello educatore',
        d: 'Puoi indicare a partire da quale corda un alunno è considerato "educatore" nel gruppo — questo determina chi ha accesso alla creazione di scuole e agli strumenti di gestione.',
      },
      {
        t: 'Assegna una graduazione',
        d: 'Dalla schermata del sistema di graduazione, tocca "Assegna graduazione ai membri". Trova l\'alunno, seleziona il nuovo livello e la data. La modifica appare subito nel suo profilo.',
      },
      {
        t: 'Visualizza la corda di un alunno',
        d: 'Tocca il nome di un membro qualsiasi del gruppo per vedere la sua corda attuale con il colore.',
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
        d: 'Vai alla scheda "Eventi" e tocca il pulsante "+" flottante.',
      },
      {
        t: 'Compila i dati di base',
        d: 'Inserisci il nome dell\'evento, la descrizione e la categoria (batizado, roda, roda aperta, troca de corda, corso, workshop, seminario, festival, incontro, intensivo, allenamento, o una categoria personalizzata).',
      },
      {
        t: 'Data, locandina e documenti',
        d: 'Imposta data di inizio e fine (con opzione di ricorrenza), carica un\'immagine di copertina (locandina) e, se devi condividere regole o regolamenti, allega un PDF fino a 10 MB.',
        tip: 'Gli eventi con locandina ottengono maggiore visibilità nei feed dei membri.',
      },
      {
        t: 'Prezzo e programma',
        d: 'Se l\'evento ha un costo, inserisci il prezzo e i metodi di pagamento accettati (bonifico, contanti, Mercado Pago, PayPal o altro). Se l\'evento ha più attività, aggiungile in "Programma" — ogni blocco con il proprio orario, descrizione e luogo.',
        tip: 'Quando aggiungi un blocco del programma con un luogo, la posizione generale dell\'evento viene dedotta automaticamente da questi blocchi.',
      },
      {
        t: 'Posizione',
        d: 'Se non hai usato il programma con luoghi per blocco, inserisci l\'indirizzo dell\'evento alla fine del modulo. L\'app apre il selettore di mappa per posizionare il marcatore esatto.',
      },
      {
        t: 'Modifica un evento già creato',
        d: 'Vai al dettaglio dell\'evento → icona di modifica (disponibile per l\'organizzatore e i co-organizzatori). Le modifiche sono visibili immediatamente a tutti.',
        warn: 'Chi ha già confermato "Partecipo" non riceve una notifica automatica se cambi data o posizione.',
      },
      {
        t: 'Gestisci co-organizzatori e ospiti speciali',
        d: 'Dal menu di modifica dell\'evento, tocca "Collaboratori". Scegli il ruolo prima di invitare: "Co-organizzatore" (può modificare l\'evento) o "Ospite speciale" (mostrato in evidenza, senza diritti di modifica). Cerca per nome e invia l\'invito.',
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
        d: 'In alto nel pannello di amministrazione della scuola vedrai una barra con 3 dati: numero di alunni, percentuale media di presenza e alunni pagati sul totale.',
      },
      {
        t: 'Salta a un altro mese dal KPI',
        d: 'Tocca l\'etichetta del mese in quella barra per aprire un selettore e saltare direttamente a qualsiasi mese precedente.',
      },
      {
        t: 'La scheda "Report"',
        d: 'Vai al pannello della scuola → scheda "Report". Se hai gruppi di lezione configurati, puoi filtrare l\'intero report per un gruppo specifico usando i chip in alto.',
      },
      {
        t: 'Scegli il formato ed esporta',
        d: 'Seleziona "CSV" (per aprire in Excel o Google Sheets) o "PDF" (per condividere o stampare) e tocca "Genera report". Include alunni attivi, sessioni svolte, percentuale di presenza e stato di pagamento per alunno.',
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
    calloutLabels: { tip: 'Tip', note: 'Nota', warning: 'Atención' },
  },
  pt: {
    title: 'Tutoriais de Capoeira',
    eyebrow: 'Documentação',
    heroTitle: 'Tutoriais do Agenda Capoeiragem',
    heroSubtitle: 'Guias passo a passo para alunos, viajantes e educadores. Aprenda a usar cada função com os textos exatos que você verá no app.',
    sections: SECTIONS_PT,
    calloutLabels: { tip: 'Dica', note: 'Nota', warning: 'Atenção' },
  },
  en: {
    title: 'Capoeira Tutorials',
    eyebrow: 'Documentation',
    heroTitle: 'Agenda Capoeiragem tutorials',
    heroSubtitle: 'Step-by-step guides for students, travelers, and educators. Learn every feature using the exact text you will see in the app.',
    sections: SECTIONS_EN,
    calloutLabels: { tip: 'Tip', note: 'Note', warning: 'Warning' },
  },
  fr: {
    title: 'Tutoriels de Capoeira',
    eyebrow: 'Documentation',
    heroTitle: 'Tutoriels Agenda Capoeiragem',
    heroSubtitle: 'Guides pas à pas pour les élèves, les voyageurs et les éducateurs. Apprenez chaque fonctionnalité avec les textes exacts que vous verrez dans l\'app.',
    sections: SECTIONS_FR,
    calloutLabels: { tip: 'Astuce', note: 'Remarque', warning: 'Attention' },
  },
  de: {
    title: 'Capoeira Tutorials',
    eyebrow: 'Dokumentation',
    heroTitle: 'Agenda Capoeiragem Tutorials',
    heroSubtitle: 'Schritt-für-Schritt-Anleitungen für Schüler, Reisende und Lehrer. Lerne jede Funktion mit dem genauen Text, den du in der App siehst.',
    sections: SECTIONS_DE,
    calloutLabels: { tip: 'Tipp', note: 'Hinweis', warning: 'Achtung' },
  },
  it: {
    title: 'Tutorial di Capoeira',
    eyebrow: 'Documentazione',
    heroTitle: 'Tutorial di Agenda Capoeiragem',
    heroSubtitle: 'Guide passo dopo passo per alunni, viaggiatori ed educatori. Impara ogni funzione con il testo esatto che vedrai nell\'app.',
    sections: SECTIONS_IT,
    calloutLabels: { tip: 'Consiglio', note: 'Nota', warning: 'Attenzione' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqSchema) }} />
      {howToSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }} />
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
                calloutLabels={c.calloutLabels}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  )
}
