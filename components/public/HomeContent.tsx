import React from 'react'

function AccordionItem({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-border/50 py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-ink outline-none transition-colors hover:text-brand-primary">
        {title}
        <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-ink transition-transform duration-300 group-open:rotate-180">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </summary>
      <div className="pt-4 pb-2 text-text-secondary">
        {children}
      </div>
    </details>
  )
}

const CONTENT: Record<string, { title: string, intro: React.ReactNode, sections: React.ReactNode }> = {
  en: {
    title: 'The Ultimate Global Capoeira Directory',
    intro: (
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        Welcome to the most comprehensive <strong>Global Capoeira Directory</strong>. Whether you are looking for "capoeira classes near me" to start your journey as a beginner, or you are an experienced <em>capoeirista</em> traveling and searching for an open <em>Roda</em>, our platform connects you instantly with academies, groups, and renowned educators worldwide.
      </p>
    ),
    sections: (
      <>
        <AccordionItem title="What is Capoeira? History and Origins" defaultOpen={true}>
          <p className="leading-relaxed">
            <strong>Capoeira</strong> is a unique Afro-Brazilian martial art that seamlessly blends elements of combat, acrobatics, dance, and music. Originating in Brazil during the 16th century, it was developed by enslaved Africans as a disguised form of self-defense. Today, Capoeira is recognized globally as an intangible cultural heritage by UNESCO, celebrated for its dynamic movements, community spirit, and rich cultural traditions.
          </p>
        </AccordionItem>
        <AccordionItem title="Main Styles of Capoeira">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Angola:</strong> The traditional style characterized by slower, strategic movements, played closer to the ground with a strong emphasis on rituals and the original musical rhythms.</li>
            <li><strong>Capoeira Regional:</strong> Created by Mestre Bimba, this style incorporates faster, more athletic movements and high kicks, structured with a specific teaching methodology and grading system.</li>
            <li><strong>Capoeira Contemporânea:</strong> A modern evolution that integrates techniques from both Angola and Regional, adapting to contemporary martial arts practices.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Benefits of Training Capoeira">
          <p className="leading-relaxed mb-3">
            Practicing Capoeira is a full-body workout that goes beyond physical fitness. The top benefits include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Physical Fitness:</strong> Drastically improves flexibility, core strength, agility, and cardiovascular endurance through movements like the <em>Ginga</em>, dodges (<em>esquivas</em>), and acrobatics (<em>floreios</em>).</li>
            <li><strong>Mental & Emotional Health:</strong> Builds self-confidence, discipline, and stress relief through physical expression.</li>
            <li><strong>Cultural Immersion:</strong> Students learn the Portuguese language, traditional songs, and how to play instruments like the <em>Berimbau</em>, <em>Pandeiro</em>, and <em>Atabaque</em>.</li>
            <li><strong>Global Community:</strong> Joining a Capoeira group (<em>Núcleo</em>) connects you to a worldwide family that shares the same passion and philosophy.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="How to Use the Directory">
          <p className="leading-relaxed mb-3">
            Our interactive map and database are optimized to help you discover the Capoeira ecosystem. Use the filters to search for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Groups & Academies:</strong> Find verified training locations with up-to-date schedules and addresses.</li>
            <li><strong>Educators and Mestres:</strong> Connect directly with certified teachers, instructors, and Masters (<em>Mestres</em>) of the art.</li>
            <li><strong>Events & Workshops:</strong> Stay updated on upcoming <em>Batizados</em> (grading ceremonies), workshops, and open <em>Rodas</em> in your city or travel destination.</li>
          </ul>
        </AccordionItem>
      </>
    )
  },
  es: {
    title: 'El Mejor Directorio Mundial de Capoeira',
    intro: (
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        Bienvenido al <strong>Directorio Global de Capoeira</strong> más completo de internet. Ya sea que estés buscando "clases de capoeira cerca de mí" para empezar desde cero, o seas un <em>capoeirista</em> experimentado viajando y buscando una <em>Roda</em> abierta, nuestra plataforma te conecta al instante con academias, grupos y educadores reconocidos en todo el mundo.
      </p>
    ),
    sections: (
      <>
        <AccordionItem title="¿Qué es la Capoeira? Historia y Origen" defaultOpen={true}>
          <p className="leading-relaxed">
            La <strong>Capoeira</strong> es un arte marcial afrobrasileño único que combina magistralmente elementos de combate, acrobacias, danza y música. Originada en Brasil a principios del siglo XVI por africanos esclavizados como una forma oculta de defensa personal, hoy en día es Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO. Destaca por sus movimientos dinámicos, el espíritu de comunidad y su rica tradición.
          </p>
        </AccordionItem>
        <AccordionItem title="Principales Estilos de Capoeira">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Angola:</strong> El estilo tradicional, caracterizado por movimientos estratégicos más lentos, jugados cerca del suelo, con un fuerte énfasis en los rituales y la música original.</li>
            <li><strong>Capoeira Regional:</strong> Creado por Mestre Bimba, este estilo incorpora movimientos más rápidos y atléticos, patadas altas y un sistema estructurado de enseñanza y graduación (cordas).</li>
            <li><strong>Capoeira Contemporánea:</strong> Una evolución moderna que integra técnicas tanto de Angola como de Regional, adaptándose a las prácticas marciales contemporáneas.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Beneficios de Entrenar Capoeira">
          <p className="leading-relaxed mb-3">
            Practicar Capoeira es un entrenamiento de cuerpo completo que va mucho más allá de la aptitud física. Los principales beneficios incluyen:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Acondicionamiento Físico:</strong> Mejora drásticamente la flexibilidad, la fuerza del core, la agilidad y la resistencia cardiovascular mediante la <em>Ginga</em>, las esquivas y los floreios (acrobacias).</li>
            <li><strong>Salud Mental y Emocional:</strong> Aumenta la confianza en uno mismo, la disciplina y ayuda a liberar el estrés a través de la expresión física.</li>
            <li><strong>Inmersión Cultural:</strong> Aprenderás portugués básico, canciones tradicionales y a tocar instrumentos afrobrasileños como el <em>Berimbau</em>, el <em>Pandeiro</em> y el <em>Atabaque</em>.</li>
            <li><strong>Comunidad Global:</strong> Unirte a un grupo de capoeira (<em>Núcleo</em>) te conecta con una red de amigos en todo el mundo que comparte la misma filosofía.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Cómo usar el buscador">
          <p className="leading-relaxed mb-3">
            Nuestro mapa interactivo y base de datos están diseñados para facilitar tu búsqueda en el ecosistema capoeirístico. Usa los filtros para encontrar:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Núcleos y Academias:</strong> Lugares de entrenamiento verificados con horarios de clases actualizados y direcciones exactas.</li>
            <li><strong>Educadores y Profesores:</strong> Contacta directamente con instructores certificados, profesores y Maestros (<em>Mestres</em>) del arte marcial.</li>
            <li><strong>Eventos y Batizados:</strong> Mantente al día sobre los próximos encuentros, talleres y ceremonias de cambio de cuerda en tu ciudad.</li>
          </ul>
        </AccordionItem>
      </>
    )
  },
  pt: {
    title: 'O Maior Diretório Global de Capoeira',
    intro: (
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        Bem-vindo ao <strong>Diretório Global de Capoeira</strong> mais completo. Se você está procurando "aulas de capoeira perto de mim" para dar os primeiros passos, ou é um <em>capoeirista</em> experiente em viagem procurando uma <em>Roda</em>, nossa plataforma conecta você instantaneamente a academias, grupos e educadores renomados no mundo todo.
      </p>
    ),
    sections: (
      <>
        <AccordionItem title="O que é a Capoeira? História e Origem" defaultOpen={true}>
          <p className="leading-relaxed">
            A <strong>Capoeira</strong> é uma arte marcial afro-brasileira singular que mistura perfeitamente elementos de luta, acrobacia, dança e música. Criada no Brasil no século XVI por africanos escravizados como uma forma disfarçada de defesa pessoal, hoje é reconhecida como Patrimônio Cultural Imaterial da Humanidade pela UNESCO. É celebrada por seus movimentos dinâmicos, rituais e musicalidade.
          </p>
        </AccordionItem>
        <AccordionItem title="Principais Estilos de Capoeira">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Angola:</strong> O estilo mais tradicional, focado em movimentos mais lentos, maliciosos e estratégicos perto do chão, com ênfase na ritualística e na musicalidade de raiz.</li>
            <li><strong>Capoeira Regional:</strong> Desenvolvida por Mestre Bimba, incorpora golpes mais rápidos, altos e atléticos, além de uma metodologia de ensino estruturada e um sistema de graduação (cordas).</li>
            <li><strong>Capoeira Contemporânea:</strong> A vertente mais praticada hoje, que mescla fundamentos da Angola e da Regional, criando um jogo moderno e versátil.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Benefícios de Treinar Capoeira">
          <p className="leading-relaxed mb-3">
            A prática da Capoeira trabalha o corpo e a mente de forma integral. Os maiores benefícios são:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Condicionamento Físico:</strong> Desenvolve força, flexibilidade, equilíbrio e resistência cardiovascular através da <em>Ginga</em>, esquivas e floreios (movimentos acrobáticos).</li>
            <li><strong>Saúde Mental:</strong> Fortalece a autoestima, o controle emocional e alivia o estresse.</li>
            <li><strong>Riqueza Cultural:</strong> Envolve o aprendizado do idioma português, da musicalidade e o toque de instrumentos clássicos como <em>Berimbau</em>, <em>Pandeiro</em> e <em>Atabaque</em>.</li>
            <li><strong>Comunidade Global:</strong> Ao entrar em um grupo (<em>Núcleo</em>), você faz parte de uma imensa rede global de amizade e suporte mútuo.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Como usar o portal">
          <p className="leading-relaxed mb-3">
            Nosso mapa interativo e banco de dados foram otimizados para facilitar sua conexão com a comunidade. Use nossos filtros para achar:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Grupos e Academias:</strong> Locais de treino validados com informações de dias e horários das aulas.</li>
            <li><strong>Educadores e Mestres:</strong> Entre em contato direto com instrutores, contramestres e Mestres de capoeira.</li>
            <li><strong>Eventos e Rodas:</strong> Descubra onde vai acontecer o próximo <em>Batizado</em>, workshop ou roda de rua na sua região.</li>
          </ul>
        </AccordionItem>
      </>
    )
  },
  fr: {
    title: 'L\'Annuaire Mondial de Capoeira',
    intro: (
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        Bienvenue dans le plus grand <strong>Annuaire Mondial de Capoeira</strong>. Que vous cherchiez des "cours de capoeira près de chez moi" pour commencer, ou que vous soyez un <em>capoeiriste</em> expérimenté en voyage cherchant une <em>Roda</em>, notre plateforme vous connecte instantanément aux académies, groupes et éducateurs du monde entier.
      </p>
    ),
    sections: (
      <>
        <AccordionItem title="Qu'est-ce que la Capoeira ? Histoire et Origines" defaultOpen={true}>
          <p className="leading-relaxed">
            La <strong>Capoeira</strong> est un art martial afro-brésilien unique qui mélange parfaitement combat, acrobatie, danse et musique. Créée au Brésil au XVIe siècle par des Africains réduits en esclavage, elle est aujourd'hui reconnue comme Patrimoine Culturel Immatériel de l'Humanité par l'UNESCO, célèbre pour ses mouvements dynamiques et sa richesse culturelle.
          </p>
        </AccordionItem>
        <AccordionItem title="Principaux Styles de Capoeira">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Angola :</strong> Le style traditionnel, caractérisé par des mouvements stratégiques plus lents et plus près du sol, avec un fort accent sur les rituels et la musique d'origine.</li>
            <li><strong>Capoeira Regional :</strong> Créé par Mestre Bimba, ce style intègre des mouvements plus rapides et athlétiques, ainsi qu'une méthodologie d'enseignement structurée (cordes).</li>
            <li><strong>Capoeira Contemporânea :</strong> Une évolution moderne qui intègre des techniques d'Angola et de Regional, s'adaptant aux pratiques martiales contemporaines.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Avantages de Pratiquer la Capoeira">
          <p className="leading-relaxed mb-3">
            La Capoeira est un entraînement complet pour le corps et l'esprit :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Condition Physique :</strong> Améliore la flexibilité, la force, l'agilité et l'endurance cardiovasculaire avec la <em>Ginga</em> et les acrobaties (floreios).</li>
            <li><strong>Santé Mentale :</strong> Renforce la confiance en soi, la discipline et réduit le stress par l'expression physique.</li>
            <li><strong>Immersion Culturelle :</strong> Apprentissage du portugais, des chants traditionnels et des instruments comme le <em>Berimbau</em>, <em>Pandeiro</em> et <em>Atabaque</em>.</li>
            <li><strong>Communauté Mondiale :</strong> Rejoindre un groupe (<em>Núcleo</em>) vous connecte à un réseau mondial d'amis partageant la même passion.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Comment utiliser le portail">
          <p className="leading-relaxed mb-3">
            Notre carte interactive et notre base de données sont optimisées pour faciliter vos recherches :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Groupes et Académies :</strong> Lieux d'entraînement vérifiés avec adresses et horaires de cours.</li>
            <li><strong>Éducateurs et Mestres :</strong> Contactez directement les instructeurs certifiés et Maîtres de capoeira.</li>
            <li><strong>Événements et Batizados :</strong> Restez informé des prochains événements, ateliers et <em>Rodas</em> ouverts dans votre ville.</li>
          </ul>
        </AccordionItem>
      </>
    )
  },
  de: {
    title: 'Das Ultimative Globale Capoeira-Verzeichnis',
    intro: (
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        Willkommen beim umfangreichsten <strong>globalen Capoeira-Verzeichnis</strong>. Egal, ob du nach "Capoeira-Kursen in meiner Nähe" suchst, um anzufangen, oder ein erfahrener <em>Capoeirista</em> auf Reisen bist, der nach einer offenen <em>Roda</em> sucht – unsere Plattform verbindet dich sofort mit Akademien, Gruppen und Lehrern weltweit.
      </p>
    ),
    sections: (
      <>
        <AccordionItem title="Was ist Capoeira? Geschichte und Herkunft" defaultOpen={true}>
          <p className="leading-relaxed">
            <strong>Capoeira</strong> ist eine einzigartige afrobrasilianische Kampfkunst, die Elemente aus Kampf, Akrobatik, Tanz und Musik nahtlos miteinander verbindet. Sie wurde im 16. Jahrhundert in Brasilien von versklavten Afrikanern entwickelt. Heute ist Capoeira als immaterielles Kulturerbe der UNESCO anerkannt und wird für ihre dynamischen Bewegungen und reichen Traditionen gefeiert.
          </p>
        </AccordionItem>
        <AccordionItem title="Hauptstile der Capoeira">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Angola:</strong> Der traditionelle Stil, gekennzeichnet durch langsamere, strategische Bewegungen nah am Boden, mit starker Betonung von Ritualen und der ursprünglichen Musik.</li>
            <li><strong>Capoeira Regional:</strong> Von Mestre Bimba entwickelt, beinhaltet dieser Stil schnellere, athletischere Bewegungen sowie eine strukturierte Lehrmethodik (Kordelsystem).</li>
            <li><strong>Capoeira Contemporânea:</strong> Eine moderne Entwicklung, die Techniken aus Angola und Regional kombiniert und sich an zeitgenössische Kampfkünste anpasst.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Vorteile des Capoeira-Trainings">
          <p className="leading-relaxed mb-3">
            Capoeira ist ein Ganzkörpertraining für Körper und Geist:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Fitness:</strong> Verbessert Flexibilität, Rumpfstabilität, Agilität und Ausdauer durch die <em>Ginga</em> und Akrobatik (Floreios).</li>
            <li><strong>Mentale Gesundheit:</strong> Stärkt das Selbstbewusstsein, die Disziplin und hilft beim Stressabbau.</li>
            <li><strong>Kulturelles Eintauchen:</strong> Lerne Portugiesisch, traditionelle Lieder und Instrumente wie das <em>Berimbau</em>, <em>Pandeiro</em> und <em>Atabaque</em> kennen.</li>
            <li><strong>Weltweite Gemeinschaft:</strong> Durch den Beitritt zu einer Gruppe (<em>Núcleo</em>) wirst du Teil einer globalen Familie.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="So nutzt du das Verzeichnis">
          <p className="leading-relaxed mb-3">
            Unsere interaktive Karte und Datenbank sind dafür optimiert, dir das Finden der Capoeira-Community zu erleichtern:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Gruppen und Akademien:</strong> Verifizierte Trainingsorte mit aktuellen Stundenplänen und Adressen.</li>
            <li><strong>Lehrer und Mestres:</strong> Nimm direkt Kontakt mit zertifizierten Ausbildern und Meistern auf.</li>
            <li><strong>Events und Batizados:</strong> Bleibe auf dem Laufenden über bevorstehende Treffen, Workshops und offene <em>Rodas</em> in deiner Stadt.</li>
          </ul>
        </AccordionItem>
      </>
    )
  },
  it: {
    title: 'La Directory Globale Definitiva della Capoeira',
    intro: (
      <p className="text-lg text-text-secondary leading-relaxed mb-6">
        Benvenuto nella più completa <strong>Directory Globale di Capoeira</strong>. Che tu stia cercando "corsi di capoeira vicino a me" per iniziare o che tu sia un <em>capoeirista</em> esperto in viaggio in cerca di una <em>Roda</em> aperta, la nostra piattaforma ti connette istantaneamente con accademie, gruppi e istruttori in tutto il mondo.
      </p>
    ),
    sections: (
      <>
        <AccordionItem title="Cos'è la Capoeira? Storia e Origini" defaultOpen={true}>
          <p className="leading-relaxed">
            La <strong>Capoeira</strong> è un'arte marziale afro-brasiliana unica che unisce magistralmente elementi di combattimento, acrobazie, danza e musica. Sviluppata in Brasile nel XVI secolo dagli africani ridotti in schiavitù, oggi è riconosciuta come Patrimonio Culturale Immateriale dell'Umanità dall'UNESCO, celebrata per i suoi movimenti dinamici e le sue tradizioni culturali.
          </p>
        </AccordionItem>
        <AccordionItem title="Stili Principali della Capoeira">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capoeira Angola:</strong> Lo stile tradizionale, caratterizzato da movimenti strategici più lenti vicino a terra, con una forte enfasi sui rituali e sui ritmi musicali originali.</li>
            <li><strong>Capoeira Regional:</strong> Creato da Mestre Bimba, questo stile incorpora movimenti più veloci e atletici, calci alti e una metodologia di insegnamento strutturata con un sistema di gradi (corde).</li>
            <li><strong>Capoeira Contemporânea:</strong> Un'evoluzione moderna che integra tecniche dell'Angola e della Regional, adattandosi alle pratiche marziali contemporanee.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Benefici dell'Allenamento di Capoeira">
          <p className="leading-relaxed mb-3">
            La Capoeira è un allenamento completo che va oltre la forma fisica:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Forma Fisica:</strong> Migliora drasticamente la flessibilità, la forza del core, l'agilità e la resistenza cardiovascolare grazie alla <em>Ginga</em>, alle schivate e alle acrobazie (floreios).</li>
            <li><strong>Salute Mentale:</strong> Aumenta la fiducia in se stessi, la disciplina e aiuta a scaricare lo stress attraverso l'espressione fisica.</li>
            <li><strong>Immersione Culturale:</strong> Imparerai il portoghese, i canti tradizionali e a suonare strumenti afro-brasiliani come il <em>Berimbau</em>, il <em>Pandeiro</em> e l'<em>Atabaque</em>.</li>
            <li><strong>Comunità Globale:</strong> Unendoti a un gruppo (<em>Núcleo</em>), entri a far parte di una famiglia mondiale che condivide la stessa passione.</li>
          </ul>
        </AccordionItem>
        <AccordionItem title="Come usare il portale">
          <p className="leading-relaxed mb-3">
            La nostra mappa interattiva e il database sono ottimizzati per facilitare la tua ricerca:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Gruppi e Accademie:</strong> Luoghi di allenamento verificati con orari aggiornati e indirizzi esatti.</li>
            <li><strong>Istruttori e Mestres:</strong> Contatta direttamente gli istruttori certificati e i Maestri dell'arte.</li>
            <li><strong>Eventos e Batizados:</strong> Tieniti aggiornato sui prossimi incontri, workshop e <em>Rodas</em> aperte nella tua città.</li>
          </ul>
        </AccordionItem>
      </>
    )
  }
}

export default function HomeContent({ locale }: { locale: string }) {
  const data = CONTENT[locale] || CONTENT['en']

  return (
    <section className="bg-surface py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-[clamp(28px,3vw,36px)] font-black text-ink tracking-tight leading-tight text-center sm:text-left">
          {data.title}
        </h2>
        
        {data.intro}

        <div className="mt-8 bg-surface-alt rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
          {data.sections}
        </div>
      </div>
    </section>
  )
}
