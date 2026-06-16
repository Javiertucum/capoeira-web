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
    intro: 'Todo lo que necesitas para empezar a usar Agenda Capoeiragem en minutos.',
    mockup: 'home',
    steps: [
      {
        t: 'Instala la app',
        d: 'Descárgala desde Google Play en Android. También puedes abrirla desde el navegador en agendacapoeiragem.com y agregarla a tu pantalla de inicio como app web (PWA): funciona igual en ambos casos.',
        note: 'La versión para iOS está en desarrollo. Por ahora puedes usar la PWA desde Safari en iPhone.',
      },
      {
        t: 'Crea tu cuenta',
        d: 'Abre la app y elige "Registrarse". Puedes crear tu cuenta con correo y contraseña o con tu cuenta de Google. Si usas correo, revisa tu bandeja de entrada para confirmar tu email.',
        tip: 'Con Google Sign-In es más rápido y no tendrás que recordar una contraseña extra.',
      },
      {
        t: 'Completa tu perfil en el onboarding',
        d: 'Al entrar por primera vez, la app te guiará para agregar tu nombre, apellido y apodo (opcional). Elige también el idioma que prefieres — puedes cambiarlo después desde Perfil → Configuración.',
      },
      {
        t: 'Vincula tu grupo o núcleo',
        d: 'Busca tu grupo en el directorio o pídele a tu educador el código de grupo para vincularte automáticamente. Esto desbloquea las funciones de comunidad: historial de graduaciones, núcleos y eventos de tu grupo.',
        warn: 'Sin un grupo vinculado, las funciones de asistencia, pagos y graduaciones no estarán disponibles.',
      },
    ],
  },
  {
    id: 'inicio-y-exploracion',
    title: 'Inicio y exploración',
    category: 'General',
    intro: 'Tu dashboard personalizado y cómo navegar lo que la comunidad tiene para ofrecer.',
    mockup: 'map',
    steps: [
      {
        t: 'El dashboard de inicio',
        d: 'La pantalla de inicio muestra los próximos eventos de tu comunidad ordenados por fecha. Si hay novedades de la app (nuevas funciones), aparecerá una tarjeta "Novedades" en la parte superior.',
        tip: 'Desliza hacia abajo para actualizar el feed de eventos en cualquier momento.',
      },
      {
        t: 'Filtra los eventos',
        d: 'Usa los filtros de la pantalla de inicio para mostrar solo los eventos que te interesan: por tipo (batizado, roda, taller, encuentro), por fecha o por núcleo específico.',
      },
      {
        t: 'Búsqueda global',
        d: 'Toca el ícono de lupa para buscar por nombre en toda la plataforma: grupos, eventos, educadores y núcleos. Los resultados se muestran organizados por tipo.',
      },
      {
        t: 'Mapa global de núcleos',
        d: 'Desde la pestaña Grupos → Mapa puedes ver todos los núcleos registrados en el mundo. Útil para encontrar dónde entrenar cuando viajas.',
        tip: 'El mapa también está disponible en el sitio web agendacapoeiragem.com sin necesitar la app.',
      },
    ],
  },
  {
    id: 'grupos-y-comunidad',
    title: 'Grupos y comunidad',
    category: 'General',
    intro: 'Cómo descubrir tu comunidad, unirte a un grupo y conectar con otros practicantes.',
    mockup: 'educator',
    steps: [
      {
        t: 'Explora la lista de grupos',
        d: 'En la pestaña "Grupos" verás todos los grupos públicos registrados en la plataforma. Puedes filtrar por país o buscar por nombre.',
      },
      {
        t: 'Ver el perfil de un grupo',
        d: 'Toca cualquier grupo para ver su descripción, cantidad de miembros, núcleos activos, sistema de graduación y educadores. También puedes ver el mapa con la ubicación de sus núcleos.',
      },
      {
        t: 'Solicitar unirse a un grupo',
        d: 'Desde el perfil del grupo, toca "Solicitar ingreso". Tu solicitud quedará pendiente hasta que el administrador del grupo la apruebe. Recibirás una notificación cuando te acepten.',
        note: 'Si ya tienes el código de invitación de tu educador, úsalo directamente en Perfil → Mi grupo para vincularte sin esperar aprobación.',
      },
      {
        t: 'Ver la jerarquía de graduación',
        d: 'En el perfil del grupo encontrarás el sistema de graduación completo: todas las cordas con su nombre, colores y orden jerárquico tal como lo definió el grupo.',
      },
      {
        t: 'Ver perfiles de otros miembros',
        d: 'Toca el nombre de cualquier educador o miembro para ver su perfil público: nombre, apodo, grupo, corda actual e historial de graduaciones.',
      },
    ],
  },
  {
    id: 'eventos',
    title: 'Eventos',
    category: 'General',
    intro: 'Descubre batizados, rodas y talleres, y mantén un registro de los que te interesan.',
    mockup: 'event',
    steps: [
      {
        t: 'Calendario de eventos',
        d: 'La pestaña "Eventos" muestra todos los eventos públicos y los de tu comunidad en orden cronológico. El punto verde indica eventos hoy; los próximos aparecen con la fecha destacada.',
      },
      {
        t: 'Detalle de un evento',
        d: 'Toca cualquier evento para ver la fecha, hora, tipo, descripción completa, ubicación en el mapa y quiénes son los organizadores. Si el evento tiene póster, lo verás en grande.',
      },
      {
        t: 'Confirmar interés o asistencia',
        d: 'Desde el detalle del evento, toca "Me interesa" para guardarlo en tu lista o "Asistiré" para confirmar presencia. Los organizadores pueden ver el conteo de confirmaciones.',
        tip: 'Tus eventos marcados como "Asistiré" aparecen destacados en tu dashboard de inicio.',
      },
      {
        t: 'Compartir un evento',
        d: 'Usa el botón compartir en el detalle del evento para enviarlo por WhatsApp, Instagram u otras apps. Se comparte el nombre, fecha y un enlace directo al evento.',
      },
    ],
  },
  {
    id: 'tu-perfil',
    title: 'Tu perfil',
    category: 'General',
    intro: 'Gestiona tu identidad en la comunidad y personaliza la experiencia.',
    steps: [
      {
        t: 'Editar tu perfil',
        d: 'Ve a la pestaña Perfil y toca el ícono de editar (lápiz). Puedes cambiar tu foto de perfil, nombre, apellido y apodo en cualquier momento.',
        tip: 'Las fotos se suben directamente desde tu cámara o galería. Se recomienda una foto cuadrada para que se vea bien.',
      },
      {
        t: 'Tu historial de graduaciones',
        d: 'En tu perfil verás tu corda actual con su color y nombre. Si tienes varias graduaciones registradas, podrás ver el historial completo con fechas.',
      },
      {
        t: 'Idioma y tema visual',
        d: 'Ve a Perfil → Configuración para cambiar el idioma (español, portugués, inglés) y el tema de la app (claro u oscuro). Los cambios aplican inmediatamente.',
      },
      {
        t: 'Notificaciones',
        d: 'En Configuración puedes activar o desactivar las notificaciones de la app: mensajes de tu educador, confirmaciones de eventos y novedades de la comunidad.',
        note: 'Si desactivaste los permisos de notificación en tu teléfono, debes reactivarlos desde la configuración del sistema.',
      },
      {
        t: 'Reportar un problema',
        d: 'Si encuentras un error o comportamiento inesperado, ve a Perfil → Reportar un problema. Tu reporte llega directamente al equipo de desarrollo con información técnica adjunta.',
      },
    ],
  },
  {
    id: 'nucleo-configuracion',
    title: 'Configurar tu núcleo',
    category: 'Educadores',
    intro: 'Cómo crear tu núcleo, ubicarlo en el mapa y configurar sus horarios.',
    mockup: 'map',
    steps: [
      {
        t: 'Crear un núcleo',
        d: 'Desde el panel de administración de tu grupo (menú superior en el perfil del grupo), toca "Nuevo núcleo". Ingresa el nombre, la dirección y el país.',
        note: 'Para crear un núcleo necesitas ser administrador o co-administrador del grupo.',
      },
      {
        t: 'Ubicar el núcleo en el mapa',
        d: 'Después de ingresar la dirección, usa el selector de mapa para fijar la ubicación exacta del lugar donde entrenas. Esto hace que tu núcleo aparezca en el directorio global.',
        tip: 'Puedes mover el marcador en el mapa para ajustar la ubicación si la dirección no coincide exactamente.',
      },
      {
        t: 'Agregar horarios de sesión',
        d: 'En la configuración del núcleo, agrega los días y horarios en que entrenas: selecciona el día de la semana, la hora de inicio y la hora de fin. Puedes tener múltiples horarios.',
        tip: 'Cada horario puede estar asociado a una turma (grupo de alumnos). Si tienes clases para distintos niveles en distintos horarios, agrégalos por separado.',
      },
      {
        t: 'Editar y desactivar el núcleo',
        d: 'Puedes editar el nombre, dirección y horarios del núcleo desde el panel de administración. Si dejas de entrenar en ese lugar, puedes desactivarlo para que no aparezca en el directorio.',
      },
    ],
  },
  {
    id: 'nucleo-alumnos',
    title: 'Alumnos y turmas',
    category: 'Educadores',
    intro: 'Gestiona quiénes son tus alumnos y organízalos por horario de clase.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Ver los miembros del núcleo',
        d: 'Accede a tu núcleo y ve a la pestaña "Alumnos". Aquí verás todos los miembros del grupo que están vinculados a tu núcleo, con su nombre, corda actual y porcentaje de asistencia del mes.',
      },
      {
        t: 'Agregar un ghost member',
        d: 'Los alumnos que no tienen cuenta en la app se pueden registrar manualmente como "ghost members". Ve a Alumnos → Agregar alumno sin cuenta. Puedes ingresar su nombre y datos básicos.',
        note: 'Los ghost members pueden recibir graduaciones y tener registro de asistencia y pagos, pero no pueden iniciar sesión en la app.',
      },
      {
        t: 'Vincular un ghost member con su cuenta',
        d: 'Cuando un alumno ghost member se registra en la app, puedes vincular su registro manual con su nueva cuenta para conservar todo su historial. Ve al perfil del ghost member → "Vincular cuenta".',
      },
      {
        t: 'Crear turmas',
        d: 'Las turmas agrupan a los alumnos por horario de clase. En Alumnos → Turmas, crea una turma por cada horario que tengas (ej: "Lunes y Miércoles 19h"). Luego asigna los alumnos a cada turma.',
        tip: 'Organizar alumnos en turmas hace que pasar lista sea mucho más rápido: solo ves los alumnos de esa sesión.',
      },
      {
        t: 'Eliminar o transferir un alumno',
        d: 'Puedes eliminar a un alumno de tu núcleo deslizando su nombre a la izquierda en la lista. Si se cambia a otro núcleo del mismo grupo, su historial se conserva.',
      },
    ],
  },
  {
    id: 'asistencia',
    title: 'Control de asistencia',
    category: 'Educadores',
    intro: 'Pasa lista en cada sesión y lleva un registro automático en la nube.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Abrir la sesión del día',
        d: 'Ve a tu núcleo → pestaña "Asistencia". Verás los horarios configurados. Toca el horario correspondiente a la clase de hoy para abrir la lista de alumnos de esa sesión.',
      },
      {
        t: 'Marcar presentes y ausentes',
        d: 'Toca el nombre de cada alumno para alternar entre presente (verde) y ausente. El registro se guarda automáticamente en la nube al instante, sin necesidad de confirmar.',
        tip: 'Si todos los alumnos van a estar presentes, usa el botón "Marcar todos presentes" y luego desmarca los que faltan — es más rápido.',
      },
      {
        t: 'Revisar sesiones anteriores',
        d: 'En la pestaña Asistencia, desliza hacia atrás para ver las sesiones de días anteriores. Cada sesión muestra el porcentaje de asistencia y el listado detallado.',
      },
      {
        t: 'Porcentaje de asistencia por alumno',
        d: 'En la ficha de cada alumno (toca su nombre en la lista) verás su porcentaje de asistencia del mes actual y el historial por mes. Esto te ayuda a identificar alumnos con baja presencia.',
      },
    ],
  },
  {
    id: 'pagos',
    title: 'Pagos y tesorería',
    category: 'Educadores',
    intro: 'Registra mensualidades, pagos por clase y lleva el control financiero de tu núcleo.',
    mockup: 'finances',
    steps: [
      {
        t: 'Configurar las opciones de cobro',
        d: 'Desde el panel del núcleo → "Configuración" → "Opciones de cobro", define si cobras mensualidad fija, por clase, en packs o una combinación. Establece el monto y la moneda (CLP, USD, EUR, BRL y otras).',
      },
      {
        t: 'Registrar el pago de un alumno',
        d: 'Ve a la ficha del alumno → pestaña "Pagos". Toca "Registrar pago", elige el mes y el monto. El estado cambia automáticamente a "Al día" y queda registrado con fecha y hora.',
        tip: 'Puedes registrar pagos con anticipación para los alumnos que pagan por adelantado.',
      },
      {
        t: 'Aplicar descuentos',
        d: 'Al registrar un pago, toca "Agregar descuento" para ingresar el porcentaje o monto descontado y una nota explicativa (ej: "Descuento familiar"). El monto final queda registrado.',
      },
      {
        t: 'Ver quién tiene pagos pendientes',
        d: 'En la pestaña Alumnos, filtra por "Pago pendiente" para ver de un vistazo quiénes no han pagado el mes actual. La lista muestra el monto adeudado y desde cuándo está pendiente.',
        warn: 'El estado de pago se calcula automáticamente según la fecha actual. Si el mes ya comenzó y un alumno no ha pagado, su estado aparece como "Pendiente".',
      },
      {
        t: 'Exportar el reporte mensual',
        d: 'Ve a la pestaña "Reportes" de tu núcleo y elige el mes. Puedes exportar el reporte de pagos en CSV para compartirlo por email o guardarlo como respaldo.',
      },
    ],
  },
  {
    id: 'graduaciones',
    title: 'Sistema de graduación',
    category: 'Educadores',
    intro: 'Configura la jerarquía de cordas de tu grupo y registra cada cambio de nivel.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Crear el sistema de graduación',
        d: 'Desde el menú de administración de tu grupo, ve a "Graduaciones". Toca "Nueva corda" y define su nombre, color (o colores combinados), y el orden en la jerarquía.',
        tip: 'El color visual de cada corda se muestra en el perfil de los alumnos y en el directorio público. Asegúrate de que los colores reflejen fielmente la corda real.',
      },
      {
        t: 'Definir nivel de educador',
        d: 'En la configuración de graduación, marca a partir de qué corda un alumno se considera "educador" dentro del grupo. Esto determina quién puede tener núcleos propios y acceso a las herramientas de gestión.',
      },
      {
        t: 'Asignar una graduación individual',
        d: 'Ve a la ficha del alumno → "Historial de graduaciones" → "Nueva graduación". Elige la nueva corda, la fecha de la graduación y opcionalmente una nota. El historial queda registrado permanentemente.',
      },
      {
        t: 'Asignación masiva para un batizado',
        d: 'Desde el panel del grupo → "Graduaciones" → "Asignación masiva", selecciona varios alumnos a la vez, elige la nueva corda y la fecha del batizado. Todos quedan graduados en un solo paso.',
        tip: 'Esta función es ideal para batizados con muchos alumnos. Guarda tiempo y evita errores de registro.',
      },
      {
        t: 'Ver el historial de un alumno',
        d: 'En la ficha de cada alumno, la pestaña "Graduaciones" muestra todas las graduaciones registradas con fecha, nivel anterior y nuevo. El historial no puede eliminarse.',
      },
    ],
  },
  {
    id: 'eventos-educador',
    title: 'Crear y gestionar eventos',
    category: 'Educadores',
    intro: 'Organiza batizados, rodas y talleres para que toda la comunidad pueda verlos y confirmar asistencia.',
    mockup: 'event',
    steps: [
      {
        t: 'Crear un evento',
        d: 'Ve a la pestaña Eventos → botón "+" (esquina superior). Ingresa el nombre, tipo de evento (batizado, roda, taller, encuentro, otro), fecha, hora de inicio y hora de fin.',
      },
      {
        t: 'Agregar descripción y póster',
        d: 'Completa la descripción del evento con todos los detalles relevantes. Sube una imagen de portada (póster) desde tu galería para darle más visibilidad.',
        tip: 'Los eventos con póster tienen mayor visibilidad en el feed de los miembros. Se recomienda una imagen vertical de buena resolución.',
      },
      {
        t: 'Ubicar el evento en el mapa',
        d: 'Ingresa la dirección del evento y ajusta el marcador en el mapa integrado. Los asistentes podrán ver la ubicación exacta y abrir la navegación directamente desde el evento.',
      },
      {
        t: 'Agregar colaboradores',
        d: 'En la edición del evento, busca y agrega a otros educadores como co-organizadores. Ellos podrán editar el evento y ver la lista de asistentes.',
      },
      {
        t: 'Ver asistentes y confirmaciones',
        d: 'Desde el detalle del evento (accesible como organizador), toca "Ver asistentes" para ver quiénes confirmaron asistencia y quiénes marcaron interés, con sus nombres y fotos de perfil.',
      },
    ],
  },
  {
    id: 'dashboard-reportes',
    title: 'Dashboard y reportes',
    category: 'Educadores',
    intro: 'Visualiza el estado de tu núcleo y exporta información para análisis externos.',
    mockup: 'kpi',
    steps: [
      {
        t: 'Dashboard de KPIs',
        d: 'Accede al panel de KPIs de tu núcleo desde el menú superior del panel de administración. Muestra alumnos activos este mes, porcentaje de retención versus el mes anterior, sesiones realizadas y total recaudado.',
      },
      {
        t: 'Tendencia de asistencia',
        d: 'El gráfico de tendencia de asistencia muestra el porcentaje de presencia promedio semana a semana en los últimos meses. Útil para detectar épocas de baja.',
        tip: 'Una caída sostenida en asistencia puede indicar que hay un horario que no funciona o una época de menor actividad. Úsalo para tomar decisiones informadas.',
      },
      {
        t: 'Reporte mensual de pagos',
        d: 'En la pestaña Reportes → selecciona un mes → "Generar reporte". El reporte incluye el total recaudado, el detalle por alumno, descuentos aplicados y el porcentaje de cobro efectivo.',
      },
      {
        t: 'Exportar en CSV',
        d: 'Desde el reporte mensual, toca "Exportar CSV" para generar un archivo compatible con Excel o Google Sheets. Puedes compartirlo por email, WhatsApp o guardarlo en tu nube.',
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
    intro: 'Tudo que você precisa para começar a usar o Agenda Capoeiragem em minutos.',
    mockup: 'home',
    steps: [
      {
        t: 'Instale o app',
        d: 'Baixe na Google Play no Android. Você também pode abrir pelo navegador em agendacapoeiragem.com e adicionar à tela inicial como app web (PWA): funciona igual nos dois casos.',
        note: 'A versão iOS está em desenvolvimento. Por enquanto, você pode usar a PWA pelo Safari no iPhone.',
      },
      {
        t: 'Crie sua conta',
        d: 'Abra o app e escolha "Cadastrar". Você pode criar sua conta com e-mail e senha ou com sua conta Google. Se usar e-mail, verifique sua caixa de entrada para confirmar.',
        tip: 'Com o Google Sign-In é mais rápido e você não precisa lembrar de uma senha extra.',
      },
      {
        t: 'Complete seu perfil no onboarding',
        d: 'Ao entrar pela primeira vez, o app vai guiá-lo para adicionar nome, sobrenome e apelido (opcional). Escolha também o idioma preferido — você pode mudar depois em Perfil → Configurações.',
      },
      {
        t: 'Vincule seu grupo ou núcleo',
        d: 'Busque seu grupo no diretório ou peça ao seu educador o código do grupo para se vincular automaticamente. Isso desbloqueia as funções de comunidade: histórico de graduações, núcleos e eventos do seu grupo.',
        warn: 'Sem um grupo vinculado, as funções de presença, pagamentos e graduações não estarão disponíveis.',
      },
    ],
  },
  {
    id: 'inicio-e-exploracao',
    title: 'Início e exploração',
    category: 'Geral',
    intro: 'Seu painel personalizado e como navegar pelo que a comunidade tem a oferecer.',
    mockup: 'map',
    steps: [
      {
        t: 'O painel de início',
        d: 'A tela inicial mostra os próximos eventos da sua comunidade em ordem cronológica. Se houver novidades do app (novas funções), um card "Novidades" aparecerá no topo.',
        tip: 'Deslize para baixo para atualizar o feed de eventos a qualquer momento.',
      },
      {
        t: 'Filtre os eventos',
        d: 'Use os filtros da tela inicial para mostrar apenas os eventos que interessam a você: por tipo (batizado, roda, oficina, encontro), por data ou por núcleo específico.',
      },
      {
        t: 'Busca global',
        d: 'Toque no ícone de lupa para buscar por nome em toda a plataforma: grupos, eventos, educadores e núcleos. Os resultados aparecem organizados por tipo.',
      },
      {
        t: 'Mapa global de núcleos',
        d: 'Na aba Grupos → Mapa você pode ver todos os núcleos registrados no mundo. Útil para encontrar onde treinar quando você viaja.',
        tip: 'O mapa também está disponível no site agendacapoeiragem.com sem precisar do app.',
      },
    ],
  },
  {
    id: 'grupos-e-comunidade',
    title: 'Grupos e comunidade',
    category: 'Geral',
    intro: 'Como descobrir sua comunidade, entrar em um grupo e conectar-se com outros praticantes.',
    mockup: 'educator',
    steps: [
      {
        t: 'Explore a lista de grupos',
        d: 'Na aba "Grupos" você verá todos os grupos públicos registrados na plataforma. Pode filtrar por país ou buscar por nome.',
      },
      {
        t: 'Ver o perfil de um grupo',
        d: 'Toque em qualquer grupo para ver a descrição, número de membros, núcleos ativos, sistema de graduação e educadores. Você também pode ver o mapa com a localização dos núcleos.',
      },
      {
        t: 'Solicitar entrada em um grupo',
        d: 'No perfil do grupo, toque "Solicitar entrada". Seu pedido ficará pendente até o administrador aprovar. Você receberá uma notificação quando for aceito.',
        note: 'Se você já tem o código de convite do seu educador, use-o em Perfil → Meu grupo para se vincular sem esperar aprovação.',
      },
      {
        t: 'Ver a hierarquia de graduação',
        d: 'No perfil do grupo você encontrará o sistema de graduação completo: todas as cordas com nome, cores e ordem hierárquica como definido pelo grupo.',
      },
      {
        t: 'Ver perfis de outros membros',
        d: 'Toque no nome de qualquer educador ou membro para ver seu perfil público: nome, apelido, grupo, corda atual e histórico de graduações.',
      },
    ],
  },
  {
    id: 'eventos',
    title: 'Eventos',
    category: 'Geral',
    intro: 'Descubra batizados, rodas e oficinas, e acompanhe os que lhe interessam.',
    mockup: 'event',
    steps: [
      {
        t: 'Calendário de eventos',
        d: 'A aba "Eventos" mostra todos os eventos públicos e os da sua comunidade em ordem cronológica. O ponto verde indica eventos hoje; os próximos aparecem com a data destacada.',
      },
      {
        t: 'Detalhes de um evento',
        d: 'Toque em qualquer evento para ver data, horário, tipo, descrição completa, localização no mapa e os organizadores. Se o evento tem pôster, você o verá em destaque.',
      },
      {
        t: 'Confirmar interesse ou presença',
        d: 'No detalhe do evento, toque "Tenho interesse" para salvá-lo ou "Vou participar" para confirmar presença. Os organizadores podem ver o total de confirmações.',
        tip: 'Eventos marcados como "Vou participar" aparecem em destaque no seu painel inicial.',
      },
      {
        t: 'Compartilhar um evento',
        d: 'Use o botão compartilhar no detalhe do evento para enviá-lo pelo WhatsApp, Instagram ou outras apps. É compartilhado o nome, data e um link direto para o evento.',
      },
    ],
  },
  {
    id: 'seu-perfil',
    title: 'Seu perfil',
    category: 'Geral',
    intro: 'Gerencie sua identidade na comunidade e personalize sua experiência.',
    steps: [
      {
        t: 'Editar seu perfil',
        d: 'Vá até a aba Perfil e toque no ícone de editar (lápis). Você pode mudar sua foto, nome, sobrenome e apelido a qualquer momento.',
        tip: 'As fotos são enviadas diretamente da câmera ou galeria. Recomenda-se uma foto quadrada para melhor resultado.',
      },
      {
        t: 'Histórico de graduações',
        d: 'No seu perfil você verá sua corda atual com cor e nome. Se tiver várias graduações registradas, o histórico completo estará disponível com as datas.',
      },
      {
        t: 'Idioma e tema visual',
        d: 'Vá em Perfil → Configurações para mudar o idioma (português, espanhol, inglês) e o tema (claro ou escuro). As mudanças são aplicadas imediatamente.',
      },
      {
        t: 'Notificações',
        d: 'Em Configurações você pode ativar ou desativar as notificações: mensagens do seu educador, confirmações de eventos e novidades da comunidade.',
        note: 'Se você desativou as permissões de notificação no seu celular, precisa reativá-las nas configurações do sistema.',
      },
      {
        t: 'Reportar um problema',
        d: 'Se encontrar um erro, vá em Perfil → Reportar problema. Seu relato chega diretamente à equipe de desenvolvimento com informações técnicas anexadas.',
      },
    ],
  },
  {
    id: 'nucleo-configuracao',
    title: 'Configurar seu núcleo',
    category: 'Educadores',
    intro: 'Como criar seu núcleo, posicioná-lo no mapa e configurar os horários.',
    mockup: 'map',
    steps: [
      {
        t: 'Criar um núcleo',
        d: 'No painel de administração do seu grupo (menu superior no perfil do grupo), toque "Novo núcleo". Informe o nome, endereço e país.',
        note: 'Para criar um núcleo você precisa ser administrador ou co-administrador do grupo.',
      },
      {
        t: 'Posicionar no mapa',
        d: 'Após inserir o endereço, use o seletor de mapa para fixar a localização exata do local de treino. Isso faz seu núcleo aparecer no diretório global.',
        tip: 'Você pode mover o marcador no mapa para ajustar a posição caso o endereço não corresponda exatamente.',
      },
      {
        t: 'Adicionar horários de sessão',
        d: 'Na configuração do núcleo, adicione os dias e horários de treino: selecione o dia da semana, horário de início e fim. Você pode ter múltiplos horários.',
        tip: 'Cada horário pode ser associado a uma turma. Se você tem aulas para diferentes níveis em horários diferentes, adicione-os separadamente.',
      },
      {
        t: 'Editar e desativar o núcleo',
        d: 'Você pode editar nome, endereço e horários a qualquer momento. Se parar de treinar naquele local, pode desativá-lo para que não apareça no diretório.',
      },
    ],
  },
  {
    id: 'nucleo-alunos',
    title: 'Alunos e turmas',
    category: 'Educadores',
    intro: 'Gerencie seus alunos e os organize por horário de aula.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Ver os membros do núcleo',
        d: 'Acesse seu núcleo e vá à aba "Alunos". Você verá todos os membros do grupo vinculados ao seu núcleo, com nome, corda atual e percentual de presença do mês.',
      },
      {
        t: 'Adicionar um ghost member',
        d: 'Alunos que não têm conta no app podem ser registrados manualmente como "ghost members". Vá em Alunos → Adicionar aluno sem conta e insira o nome e dados básicos.',
        note: 'Ghost members podem receber graduações e ter registro de presença e pagamentos, mas não podem fazer login no app.',
      },
      {
        t: 'Vincular um ghost member à sua conta',
        d: 'Quando um ghost member se cadastrar no app, você pode vincular o registro manual à nova conta para preservar todo o histórico. Vá ao perfil do ghost member → "Vincular conta".',
      },
      {
        t: 'Criar turmas',
        d: 'As turmas agrupam alunos por horário de aula. Em Alunos → Turmas, crie uma turma para cada horário (ex: "Segunda e Quarta 19h") e atribua os alunos.',
        tip: 'Organizar alunos em turmas torna a chamada muito mais rápida: você vê apenas os alunos daquela sessão.',
      },
      {
        t: 'Remover ou transferir um aluno',
        d: 'Você pode remover um aluno do seu núcleo deslizando o nome para a esquerda na lista. Se ele mudar para outro núcleo do mesmo grupo, o histórico é preservado.',
      },
    ],
  },
  {
    id: 'presenca',
    title: 'Controle de presença',
    category: 'Educadores',
    intro: 'Faça a chamada em cada sessão e mantenha um registro automático na nuvem.',
    mockup: 'attendance',
    steps: [
      {
        t: 'Abrir a sessão do dia',
        d: 'Vá ao seu núcleo → aba "Presença". Você verá os horários configurados. Toque no horário correspondente à aula de hoje para abrir a lista de alunos daquela sessão.',
      },
      {
        t: 'Marcar presentes e ausentes',
        d: 'Toque no nome de cada aluno para alternar entre presente (verde) e ausente. O registro é salvo automaticamente na nuvem ao instante, sem necessidade de confirmar.',
        tip: 'Se todos os alunos vão estar presentes, use o botão "Marcar todos presentes" e depois desmarque quem faltou — é mais rápido.',
      },
      {
        t: 'Revisar sessões anteriores',
        d: 'Na aba Presença, deslize para trás para ver as sessões anteriores. Cada sessão mostra o percentual de presença e o listado detalhado.',
      },
      {
        t: 'Percentual de presença por aluno',
        d: 'No perfil de cada aluno você verá o percentual de presença do mês atual e o histórico por mês. Isso ajuda a identificar alunos com baixa frequência.',
      },
    ],
  },
  {
    id: 'pagamentos',
    title: 'Pagamentos e tesouraria',
    category: 'Educadores',
    intro: 'Registre mensalidades, pagamentos por aula e mantenha o controle financeiro do seu núcleo.',
    mockup: 'finances',
    steps: [
      {
        t: 'Configurar as opções de cobrança',
        d: 'No painel do núcleo → "Configurações" → "Opções de cobrança", defina se você cobra mensalidade fixa, por aula, em pacotes ou uma combinação. Estabeleça o valor e a moeda.',
      },
      {
        t: 'Registrar o pagamento de um aluno',
        d: 'Vá ao perfil do aluno → aba "Pagamentos". Toque "Registrar pagamento", escolha o mês e o valor. O status muda automaticamente para "Em dia".',
        tip: 'Você pode registrar pagamentos antecipados para alunos que pagam adiantado.',
      },
      {
        t: 'Aplicar descontos',
        d: 'Ao registrar um pagamento, toque "Adicionar desconto" para informar o percentual ou valor descontado e uma nota explicativa. O valor final fica registrado.',
      },
      {
        t: 'Ver quem tem pagamentos pendentes',
        d: 'Na aba Alunos, filtre por "Pagamento pendente" para ver de uma só vez quem não pagou o mês atual.',
        warn: 'O status de pagamento é calculado automaticamente pela data atual. Se o mês já começou e o aluno não pagou, o status aparece como "Pendente".',
      },
      {
        t: 'Exportar o relatório mensal',
        d: 'Vá à aba "Relatórios" do seu núcleo, escolha o mês e toque "Exportar CSV". O arquivo pode ser compartilhado por e-mail ou salvo em nuvem.',
      },
    ],
  },
  {
    id: 'graduacoes',
    title: 'Sistema de graduação',
    category: 'Educadores',
    intro: 'Configure a hierarquia de cordas do seu grupo e registre cada mudança de nível.',
    mockup: 'graduation',
    steps: [
      {
        t: 'Criar o sistema de graduação',
        d: 'No menu de administração do seu grupo, vá em "Graduações". Toque "Nova corda" e defina nome, cor (ou cores combinadas) e a ordem na hierarquia.',
        tip: 'A cor visual de cada corda aparece no perfil dos alunos e no diretório público. Certifique-se de que as cores refletem fielmente a corda real.',
      },
      {
        t: 'Definir nível de educador',
        d: 'Na configuração de graduação, marque a partir de qual corda um aluno é considerado "educador" dentro do grupo. Isso determina quem pode ter núcleos e acesso às ferramentas de gestão.',
      },
      {
        t: 'Atribuir uma graduação individual',
        d: 'Vá ao perfil do aluno → "Histórico de graduações" → "Nova graduação". Escolha a nova corda, a data e opcionalmente uma nota. O histórico fica registrado permanentemente.',
      },
      {
        t: 'Atribuição em massa para um batizado',
        d: 'No painel do grupo → "Graduações" → "Atribuição em massa", selecione vários alunos de uma vez, escolha a nova corda e a data. Todos são graduados em um único passo.',
        tip: 'Ideal para batizados com muitos alunos. Economiza tempo e evita erros de registro.',
      },
      {
        t: 'Ver o histórico de um aluno',
        d: 'No perfil de cada aluno, a aba "Graduações" mostra todas as graduações registradas com data, nível anterior e novo. O histórico não pode ser excluído.',
      },
    ],
  },
  {
    id: 'eventos-educador',
    title: 'Criar e gerenciar eventos',
    category: 'Educadores',
    intro: 'Organize batizados, rodas e oficinas para que toda a comunidade possa ver e confirmar presença.',
    mockup: 'event',
    steps: [
      {
        t: 'Criar um evento',
        d: 'Vá à aba Eventos → botão "+" (canto superior). Informe nome, tipo (batizado, roda, oficina, encontro, outro), data, horário de início e fim.',
      },
      {
        t: 'Adicionar descrição e pôster',
        d: 'Preencha a descrição do evento com todos os detalhes relevantes. Envie uma imagem de capa (pôster) da sua galeria para dar mais visibilidade.',
        tip: 'Eventos com pôster têm maior visibilidade no feed dos membros. Recomenda-se uma imagem vertical de boa resolução.',
      },
      {
        t: 'Posicionar no mapa',
        d: 'Informe o endereço do evento e ajuste o marcador no mapa. Os participantes poderão ver a localização e abrir a navegação diretamente do evento.',
      },
      {
        t: 'Adicionar colaboradores',
        d: 'Na edição do evento, busque e adicione outros educadores como co-organizadores. Eles poderão editar o evento e ver a lista de participantes.',
      },
      {
        t: 'Ver participantes e confirmações',
        d: 'No detalhe do evento (como organizador), toque "Ver participantes" para ver quem confirmou presença ou demonstrou interesse.',
      },
    ],
  },
  {
    id: 'painel-relatorios',
    title: 'Painel e relatórios',
    category: 'Educadores',
    intro: 'Visualize o estado do seu núcleo e exporte informações para análise externa.',
    mockup: 'kpi',
    steps: [
      {
        t: 'Painel de KPIs',
        d: 'Acesse o painel de KPIs do seu núcleo no menu superior do painel de administração. Mostra alunos ativos no mês, percentual de retenção versus o mês anterior, sessões realizadas e total arrecadado.',
      },
      {
        t: 'Tendência de presença',
        d: 'O gráfico de tendência mostra o percentual médio de presença semana a semana nos últimos meses. Útil para detectar períodos de baixa.',
        tip: 'Uma queda sustentada pode indicar um horário que não funciona ou uma época de menor atividade. Use os dados para tomar decisões informadas.',
      },
      {
        t: 'Relatório mensal de pagamentos',
        d: 'Em Relatórios → selecione um mês → "Gerar relatório". O relatório inclui total arrecadado, detalhamento por aluno, descontos aplicados e percentual de cobrança efetiva.',
      },
      {
        t: 'Exportar em CSV',
        d: 'No relatório mensal, toque "Exportar CSV" para gerar um arquivo compatível com Excel ou Google Sheets. Compartilhe por e-mail ou salve em nuvem.',
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
    intro: 'Everything you need to start using Agenda Capoeiragem in minutes.',
    mockup: 'home',
    steps: [
      {
        t: 'Install the app',
        d: 'Download it from Google Play on Android. You can also open it from your browser at agendacapoeiragem.com and add it to your home screen as a web app (PWA) — both work exactly the same.',
        note: 'The iOS version is under development. For now you can use the PWA from Safari on iPhone.',
      },
      {
        t: 'Create your account',
        d: 'Open the app and choose "Sign up". You can create an account with email and password or with your Google account. If you use email, check your inbox to confirm it.',
        tip: 'Google Sign-In is faster and means one fewer password to remember.',
      },
      {
        t: 'Complete your profile in onboarding',
        d: 'When you first open the app, it will guide you to add your first name, last name, and nickname (optional). Choose your preferred language — you can change it later from Profile → Settings.',
      },
      {
        t: 'Link your group or school',
        d: "Search for your group in the directory or ask your educator for the group code to link your account automatically. This unlocks community features: graduation history, schools, and your group's events.",
        warn: 'Without a linked group, attendance, payment, and graduation tools will not be available.',
      },
    ],
  },
  {
    id: 'home-and-discovery',
    title: 'Home & discovery',
    category: 'General',
    intro: 'Your personalized dashboard and how to explore what the community has to offer.',
    mockup: 'map',
    steps: [
      {
        t: 'The home dashboard',
        d: "The home screen shows upcoming events from your community in chronological order. If there are app updates, a \"What's New\" card appears at the top.",
        tip: 'Pull down to refresh the events feed at any time.',
      },
      {
        t: 'Filter events',
        d: 'Use the home screen filters to show only the events that interest you: by type (batizado, roda, workshop, meetup), by date, or by a specific school.',
      },
      {
        t: 'Global search',
        d: 'Tap the magnifying glass icon to search by name across the entire platform: groups, events, educators, and schools. Results are organized by type.',
      },
      {
        t: 'Global map of schools',
        d: "In the Groups tab → Map, you can see all registered schools worldwide. Great for finding a place to train when you're traveling.",
        tip: 'The map is also available at agendacapoeiragem.com without the app.',
      },
    ],
  },
  {
    id: 'groups-and-community',
    title: 'Groups & community',
    category: 'General',
    intro: 'How to discover your community, join a group, and connect with other practitioners.',
    mockup: 'educator',
    steps: [
      {
        t: 'Browse the groups list',
        d: "In the \"Groups\" tab you'll see all public groups registered on the platform. You can filter by country or search by name.",
      },
      {
        t: 'View a group profile',
        d: "Tap any group to see its description, member count, active schools, graduation system, and educators. You can also see a map with the schools' locations.",
      },
      {
        t: 'Request to join a group',
        d: "From the group profile, tap \"Request to join\". Your request stays pending until the group admin approves it. You'll get a notification when you're accepted.",
        note: "If you already have your educator's invite code, use it in Profile → My group to link directly without waiting for approval.",
      },
      {
        t: 'View the graduation hierarchy',
        d: "In the group profile you'll find the full graduation system: all belts with their names, colors, and hierarchy as defined by the group.",
      },
      {
        t: "View other members' profiles",
        d: 'Tap the name of any educator or member to see their public profile: name, nickname, group, current belt, and graduation history.',
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    category: 'General',
    intro: 'Discover batizados, rodas, and workshops, and keep track of the ones that interest you.',
    mockup: 'event',
    steps: [
      {
        t: 'Events calendar',
        d: "The \"Events\" tab shows all public events and those from your community in chronological order. A green dot marks today's events; upcoming ones show the date prominently.",
      },
      {
        t: 'Event detail',
        d: 'Tap any event to see the date, time, type, full description, map location, and organizers. If the event has a poster, it will be displayed prominently.',
      },
      {
        t: 'Confirm interest or attendance',
        d: 'From the event detail, tap "Interested" to save it or "Going" to confirm attendance. Organizers can see the total number of confirmations.',
        tip: "Events you mark as \"Going\" appear highlighted on your home dashboard.",
      },
      {
        t: 'Share an event',
        d: 'Use the share button in the event detail to send it via WhatsApp, Instagram, or other apps. The name, date, and a direct link to the event are shared.',
      },
    ],
  },
  {
    id: 'your-profile',
    title: 'Your profile',
    category: 'General',
    intro: 'Manage your community identity and personalize your experience.',
    steps: [
      {
        t: 'Edit your profile',
        d: 'Go to the Profile tab and tap the edit icon (pencil). You can change your profile photo, name, surname, and nickname at any time.',
        tip: 'Photos are uploaded directly from your camera or gallery. A square photo is recommended for best results.',
      },
      {
        t: 'Graduation history',
        d: 'Your profile shows your current belt with its color and name. If you have multiple recorded graduations, the full history with dates is available.',
      },
      {
        t: 'Language and visual theme',
        d: 'Go to Profile → Settings to change the language (English, Spanish, Portuguese) and theme (light or dark). Changes apply immediately.',
      },
      {
        t: 'Notifications',
        d: "In Settings you can turn app notifications on or off: messages from your educator, event confirmations, and community news.",
        note: "If you've disabled notification permissions on your phone, you need to re-enable them from system settings.",
      },
      {
        t: 'Report a problem',
        d: 'If you find a bug, go to Profile → Report a problem. Your report goes directly to the development team with technical details attached.',
      },
    ],
  },
  {
    id: 'school-setup',
    title: 'Setting up your school',
    category: 'Educators',
    intro: 'How to create your school, place it on the map, and configure schedules.',
    mockup: 'map',
    steps: [
      {
        t: 'Create a school',
        d: "From your group's admin panel (top menu on the group profile), tap \"New school\". Enter the name, address, and country.",
        note: 'You need to be an admin or co-admin of the group to create a school.',
      },
      {
        t: 'Place it on the map',
        d: 'After entering the address, use the map picker to pin the exact training location. This makes your school appear in the global directory.',
        tip: 'You can move the marker to fine-tune the position if the address is not exact.',
      },
      {
        t: 'Add session schedules',
        d: "In the school settings, add your training days and times: select the weekday, start time, and end time. You can have multiple schedules.",
        tip: 'Each schedule can be linked to a class group. If you teach different levels at different times, add them separately.',
      },
      {
        t: 'Edit and deactivate',
        d: "You can edit the name, address, and schedules at any time. If you stop training at that location, you can deactivate the school so it doesn't appear in the directory.",
      },
    ],
  },
  {
    id: 'students-and-classes',
    title: 'Students & class groups',
    category: 'Educators',
    intro: 'Manage your students and organize them by class schedule.',
    mockup: 'attendance',
    steps: [
      {
        t: 'View school members',
        d: "Access your school and go to the \"Students\" tab. You'll see all group members linked to your school, with their name, current belt, and monthly attendance percentage.",
      },
      {
        t: 'Add a ghost member',
        d: 'Students without an app account can be manually registered as "ghost members". Go to Students → Add student without account and enter their name and basic details.',
        note: 'Ghost members can receive graduations and have attendance and payment records, but cannot log in to the app.',
      },
      {
        t: 'Link a ghost member to their account',
        d: "When a ghost member signs up in the app, you can link their manual record to their new account to preserve all history. Go to the ghost member's profile → \"Link account\".",
      },
      {
        t: 'Create class groups',
        d: 'Class groups organize students by schedule. In Students → Class groups, create one for each time slot (e.g., "Mon & Wed 7pm") and assign students to each.',
        tip: 'Organizing students into class groups makes taking attendance much faster — you only see the students for that session.',
      },
      {
        t: 'Remove or transfer a student',
        d: 'You can remove a student from your school by swiping their name to the left in the list. If they move to another school in the same group, their history is preserved.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Attendance tracking',
    category: 'Educators',
    intro: 'Take roll in each session and keep automatic records synced to the cloud.',
    mockup: 'attendance',
    steps: [
      {
        t: "Open today's session",
        d: "Go to your school → \"Attendance\" tab. You'll see your configured time slots. Tap the one matching today's class to open the student list for that session.",
      },
      {
        t: 'Mark present and absent',
        d: "Tap each student's name to toggle between present (green) and absent. The record is saved automatically to the cloud instantly, no confirmation needed.",
        tip: "If all students are present, use \"Mark all present\" and then untick who is missing — it's faster.",
      },
      {
        t: 'Review previous sessions',
        d: 'In the Attendance tab, scroll back to view previous sessions. Each session shows the attendance percentage and a detailed list.',
      },
      {
        t: 'Attendance rate per student',
        d: "In each student's profile you'll see their current month's attendance percentage and a month-by-month history. This helps you spot students with low participation.",
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & treasury',
    category: 'Educators',
    intro: "Record monthly fees and per-class payments, and keep your school's finances under control.",
    mockup: 'finances',
    steps: [
      {
        t: 'Configure billing options',
        d: "In your school's panel → Settings → Billing options, define whether you charge a fixed monthly fee, per class, in packs, or a combination. Set the amount and currency (CLP, USD, EUR, BRL, and others).",
      },
      {
        t: 'Record a student payment',
        d: "Go to the student's profile → \"Payments\" tab. Tap \"Record payment\", choose the month and amount. The status automatically changes to \"Up to date\".",
        tip: 'You can record advance payments for students who pay ahead of time.',
      },
      {
        t: 'Apply discounts',
        d: 'When recording a payment, tap "Add discount" to enter the percentage or amount discounted and an explanatory note. The final amount is what gets recorded.',
      },
      {
        t: 'See who has pending payments',
        d: "In the Students tab, filter by \"Pending payment\" to see at a glance who hasn't paid the current month.",
        warn: "Payment status is calculated automatically based on the current date. If the month has started and a student hasn't paid, their status shows as \"Pending\".",
      },
      {
        t: 'Export the monthly report',
        d: "Go to your school's \"Reports\" tab, pick the month, and tap \"Export CSV\". The file can be shared via email or saved to cloud storage.",
      },
    ],
  },
  {
    id: 'graduations',
    title: 'Graduation system',
    category: 'Educators',
    intro: "Set up your group's belt hierarchy and record every level change.",
    mockup: 'graduation',
    steps: [
      {
        t: 'Create the graduation system',
        d: "In your group's admin menu, go to \"Graduations\". Tap \"New belt\" and define its name, color (or color combination), and its position in the hierarchy.",
        tip: "The visual color of each belt appears on student profiles and in the public directory. Make sure the colors faithfully reflect the real belt.",
      },
      {
        t: 'Define the educator level',
        d: "In the graduation settings, mark from which belt a student is considered an \"educator\" in the group. This determines who can have their own school and access management tools.",
      },
      {
        t: 'Assign an individual graduation',
        d: "Go to the student's profile → \"Graduation history\" → \"New graduation\". Choose the new belt, the date, and optionally a note. The history is recorded permanently.",
      },
      {
        t: 'Bulk assignment for a batizado',
        d: 'In the group panel → "Graduations" → "Bulk assignment", select multiple students at once, choose the new belt and date. Everyone is graduated in a single step.',
        tip: 'Ideal for batizados with many students. Saves time and avoids recording errors.',
      },
      {
        t: "View a student's history",
        d: "In each student's profile, the \"Graduations\" tab shows all recorded graduations with date, previous level, and new level. The history cannot be deleted.",
      },
    ],
  },
  {
    id: 'manage-events',
    title: 'Create & manage events',
    category: 'Educators',
    intro: 'Organize batizados, rodas, and workshops so the whole community can see and confirm attendance.',
    mockup: 'event',
    steps: [
      {
        t: 'Create an event',
        d: 'Go to the Events tab → "+" button (top corner). Enter the name, type (batizado, roda, workshop, meetup, other), date, start time, and end time.',
      },
      {
        t: 'Add a description and poster',
        d: 'Fill in the event description with all relevant details. Upload a cover image (poster) from your gallery to give it more visibility.',
        tip: "Events with a poster get higher visibility in members' feeds. A vertical image with good resolution is recommended.",
      },
      {
        t: 'Pin the location on the map',
        d: 'Enter the event address and adjust the marker on the integrated map. Attendees will be able to see the exact location and open navigation directly from the event.',
      },
      {
        t: 'Add collaborators',
        d: 'In the event editor, search for and add other educators as co-organizers. They will be able to edit the event and view the attendee list.',
      },
      {
        t: 'View attendees and confirmations',
        d: 'From the event detail (as organizer), tap "View attendees" to see who confirmed attendance or showed interest, with their names and profile photos.',
      },
    ],
  },
  {
    id: 'dashboard-reports',
    title: 'Dashboard & reports',
    category: 'Educators',
    intro: "Visualize your school's health and export data for external analysis.",
    mockup: 'kpi',
    steps: [
      {
        t: 'KPI dashboard',
        d: "Access your school's KPI dashboard from the top menu of the admin panel. It shows active students this month, retention rate vs. last month, sessions held, and total collected.",
      },
      {
        t: 'Attendance trend',
        d: 'The attendance trend chart shows the average attendance percentage week by week over the last few months. Useful for spotting low-activity periods.',
        tip: "A sustained drop can indicate a time slot that isn't working or a low-activity season. Use the data to make informed decisions.",
      },
      {
        t: 'Monthly payment report',
        d: 'In Reports → select a month → "Generate report". The report includes total collected, per-student breakdown, applied discounts, and the effective collection percentage.',
      },
      {
        t: 'Export to CSV',
        d: 'From the monthly report, tap "Export CSV" to generate a file compatible with Excel or Google Sheets. Share by email or save to cloud storage.',
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
    heroSubtitle: 'Guías paso a paso para alumnos, viajeros y educadores. Aprende a usar cada función desde el primer día.',
    sections: SECTIONS_ES,
  },
  pt: {
    title: 'Tutoriais — Agenda Capoeiragem',
    eyebrow: 'Documentação',
    heroTitle: 'Tutoriais do Agenda Capoeiragem',
    heroSubtitle: 'Guias passo a passo para alunos, viajantes e educadores. Aprenda a usar cada função desde o primeiro dia.',
    sections: SECTIONS_PT,
  },
  en: {
    title: 'Tutorials — Agenda Capoeiragem',
    eyebrow: 'Documentation',
    heroTitle: 'Agenda Capoeiragem tutorials',
    heroSubtitle: 'Step-by-step guides for students, travelers, and educators. Learn how to use every feature from day one.',
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
