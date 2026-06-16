import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
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
        d: 'Descárgala desde Google Play en Android, o ábrela en tu navegador en agendacapoeiragem.com y agrégala a tu pantalla de inicio para usarla como app web (PWA). En ambos casos funciona igual.',
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
        d: 'En la pantalla de inicio verás la tarjeta "Sin grupo asignado" con el botón "Buscar grupos". Desde ahí puedes buscar tu grupo y enviar una solicitud de ingreso, o pídele a tu educador que te comparta el código del grupo para vincularte directamente.',
        warn: 'Sin un grupo vinculado, no podrás ver los eventos ni el historial de graduaciones de tu comunidad. Las funciones de asistencia y pagos tampoco estarán disponibles.',
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
        d: 'Toca el ícono de editar (lápiz) sobre tu foto de perfil o tu nombre para abrir el formulario de edición. Puedes cambiar tu foto, nombre, apellido y apodo. Guarda los cambios tocando el botón "Guardar".',
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
        d: 'En la pestaña "Notificaciones" del perfil verás todas las solicitudes que requieren tu respuesta: invitaciones de grupo, solicitudes para unirse a tu núcleo o cambios de educador asignado. El badge rojo en la tab "Perfil" indica cuántas tienes sin revisar.',
      },
      {
        t: 'Reportar un problema',
        d: 'Ve a "Perfil" → "Configuración" → "Reportar un problema". Tu reporte llega directamente al equipo de desarrollo con información técnica de tu dispositivo adjunta automáticamente.',
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
        d: 'Toca el nombre de cada alumno para alternar entre presente (indicador verde) y ausente. También puedes usar los botones "Todos presentes" o "Todos ausentes" para marcar a todos de una vez y luego ajustar individualmente.',
      },
      {
        t: 'Guardar la clase',
        d: 'Toca "Guardar clase" para registrar la sesión. El registro se guarda en la nube de inmediato y queda disponible en el historial. El porcentaje de asistencia de cada alumno se actualiza automáticamente.',
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
        d: 'En el panel administrativo del núcleo, ve a la pestaña "Pagos". Cada alumno aparece con su estado de pago del mes: "Pendiente", "Pagado", "Pagado (tarde)", "Vencido" o "Gratis". Los estados se calculan automáticamente por fecha.',
        warn: 'Si el mes ya comenzó y un alumno no tiene pago registrado, su estado cambia automáticamente a "Pendiente" y luego a "Vencido" a partir del día que hayas configurado como fecha límite.',
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
        t: 'Gestiona co-organizadores y asistentes',
        d: 'Una vez creado el evento, puedes agregar co-organizadores desde el menú de edición → "Colaboradores". Los co-organizadores pueden editar el evento y ver la lista completa de quiénes marcaron "Voy" o "Me interesa".',
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
        d: 'Na tela inicial você verá o cartão "Sem grupo atribuído" com o botão "Buscar grupos". Procure seu grupo e envie uma solicitação, ou peça ao seu educador o código do grupo para se vincular diretamente.',
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
        d: 'Na aba "Notificações" do perfil você verá todas as solicitações que precisam da sua resposta. O badge vermelho na aba "Perfil" indica quantas você tem sem revisar.',
      },
      {
        t: 'Reportar um problema',
        d: 'Vá em "Perfil" → "Configurações" → "Reportar um problema". Seu relato vai diretamente à equipe de desenvolvimento com informações técnicas do seu dispositivo anexadas automaticamente.',
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
        d: 'Toque no nome de cada aluno para alternar entre presente (indicador verde) e ausente. Use também os botões "Todos presentes" ou "Todos ausentes" para marcar todos de uma vez e depois ajustar individualmente.',
      },
      {
        t: 'Salvar a aula',
        d: 'Toque "Salvar aula" para registrar a sessão. O registro é salvo na nuvem imediatamente e fica disponível no histórico. O porcentual de presença de cada aluno é atualizado automaticamente.',
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
        d: 'On the home screen you will see the card "No group assigned" with a "Find groups" button. Search for your group and send a join request, or ask your educator for the group code to link directly.',
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
        d: 'In the "Notifications" tab of your profile you will see all requests that need your response. The red badge on the "Profile" tab shows how many you have unread.',
      },
      {
        t: 'Report a problem',
        d: 'Go to "Profile" → "Settings" → "Report a problem". Your report goes directly to the development team with technical device information attached automatically.',
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
        d: 'Tap each student\'s name to toggle between present (green indicator) and absent. Use the "All present" or "All absent" buttons to mark everyone at once, then adjust individually.',
      },
      {
        t: 'Save the class',
        d: 'Tap "Save class" to record the session. The record is saved to the cloud immediately and appears in the history. Each student\'s attendance percentage is updated automatically.',
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

// ─── Copy per locale ──────────────────────────────────────────────────────────

const COPY = {
  es: {
    title: 'Tutoriales — Agenda Capoeiragem',
    eyebrow: 'Documentación',
    heroTitle: 'Tutoriales de Agenda Capoeiragem',
    heroSubtitle: 'Guías paso a paso para alumnos, viajeros y educadores. Aprende a usar cada función con los textos exactos que verás en la app.',
    sections: SECTIONS_ES,
  },
  pt: {
    title: 'Tutoriais — Agenda Capoeiragem',
    eyebrow: 'Documentação',
    heroTitle: 'Tutoriais do Agenda Capoeiragem',
    heroSubtitle: 'Guias passo a passo para alunos, viajantes e educadores. Aprenda a usar cada função com os textos exatos que você verá no app.',
    sections: SECTIONS_PT,
  },
  en: {
    title: 'Tutorials — Agenda Capoeiragem',
    eyebrow: 'Documentation',
    heroTitle: 'Agenda Capoeiragem tutorials',
    heroSubtitle: 'Step-by-step guides for students, travelers, and educators. Learn every feature using the exact text you will see in the app.',
    sections: SECTIONS_EN,
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)
  return {
    title: copy.title,
    description: getSiteDescription(locale),
    alternates: { canonical: getLocalizedPath(locale, 'tutoriales'), languages: getLanguageAlternates('tutoriales') },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: getSiteDescription(locale),
      url: getLocalizedPath(locale, 'tutoriales'),
      type: 'website',
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

  return (
    <main className="min-h-screen bg-bg">
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
