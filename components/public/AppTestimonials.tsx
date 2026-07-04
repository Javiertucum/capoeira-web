const COPY = {
  es: {
    label: 'La comunidad lo usa',
    starsLabel: '5 estrellas',
    items: [
      {
        quote: 'Antes llevaba la asistencia en papel. Ahora lo hago en 30 segundos desde el teléfono y mis alumnos ven su historial al instante.',
        name: 'Grilo Mané',
        role: 'Educador · Santiago, Chile',
        initials: 'GM',
      },
      {
        quote: 'Viajé seis meses y encontré capoeira en cada ciudad usando el mapa. Para un capoeirista en movimiento no hay mejor herramienta.',
        name: 'Mariposa',
        role: 'Practicante · Buenos Aires',
        initials: 'MA',
      },
      {
        quote: 'El sistema de graduación tardó 20 minutos en configurar. Compatible con Angola, Regional y sistemas mixtos sin ningún problema.',
        name: 'Gavião',
        role: 'Contramestre · São Paulo',
        initials: 'GA',
      },
    ],
  },
  pt: {
    label: 'A comunidade usa',
    starsLabel: '5 estrelas',
    items: [
      {
        quote: 'Antes fazíamos a chamada em papel. Agora leva 30 segundos e meus alunos veem o histórico na hora.',
        name: 'Grilo Mané',
        role: 'Educador · Santiago, Chile',
        initials: 'GM',
      },
      {
        quote: 'Viajei seis meses e encontrei capoeira em cada cidade com o mapa. Para um capoeirista em movimento não há ferramenta melhor.',
        name: 'Mariposa',
        role: 'Praticante · Buenos Aires',
        initials: 'MA',
      },
      {
        quote: 'O sistema de graduação ficou configurado em 20 minutos. Compatível com Angola, Regional e sistemas mistos sem nenhum problema.',
        name: 'Gavião',
        role: 'Contramestre · São Paulo',
        initials: 'GA',
      },
    ],
  },
  en: {
    label: 'The community uses it',
    starsLabel: '5 stars',
    items: [
      {
        quote: 'We used to take attendance on paper. Now it takes 30 seconds from my phone and my students can see their history instantly.',
        name: 'Grilo Mané',
        role: 'Educator · Santiago, Chile',
        initials: 'GM',
      },
      {
        quote: 'I traveled six months and found capoeira in every city using the map. For a capoeirista on the move, nothing comes close.',
        name: 'Mariposa',
        role: 'Practitioner · Buenos Aires',
        initials: 'MA',
      },
      {
        quote: 'We set up the graduation system in 20 minutes. Compatible with Angola, Regional and mixed systems without any issues.',
        name: 'Gavião',
        role: 'Contramestre · São Paulo',
        initials: 'GA',
      },
    ],
  },
  fr: {
    label: 'La communauté l\'utilise',
    starsLabel: '5 étoiles',
    items: [
      {
        quote: 'Avant, je faisais l\'appel sur papier. Maintenant ça me prend 30 secondes depuis mon téléphone et mes élèves voient leur historique à l\'instant.',
        name: 'Grilo Mané',
        role: 'Éducateur · Santiago, Chili',
        initials: 'GM',
      },
      {
        quote: 'J\'ai voyagé six mois et j\'ai trouvé de la capoeira dans chaque ville grâce à la carte. Pour un capoeirista en déplacement, il n\'y a pas mieux.',
        name: 'Mariposa',
        role: 'Pratiquante · Buenos Aires',
        initials: 'MA',
      },
      {
        quote: 'Le système de graduation a pris 20 minutes à configurer. Compatible avec l\'Angola, le Regional et les systèmes mixtes sans aucun problème.',
        name: 'Gavião',
        role: 'Contramestre · São Paulo',
        initials: 'GA',
      },
    ],
  },
  de: {
    label: 'Die Community nutzt es',
    starsLabel: '5 Sterne',
    items: [
      {
        quote: 'Früher habe ich die Anwesenheit auf Papier erfasst. Jetzt dauert es 30 Sekunden auf dem Handy und meine Schüler sehen ihre Historie sofort.',
        name: 'Grilo Mané',
        role: 'Lehrer · Santiago, Chile',
        initials: 'GM',
      },
      {
        quote: 'Ich war sechs Monate unterwegs und habe mit der Karte in jeder Stadt Capoeira gefunden. Für einen Capoeirista auf Reisen gibt es nichts Besseres.',
        name: 'Mariposa',
        role: 'Praktizierende · Buenos Aires',
        initials: 'MA',
      },
      {
        quote: 'Das Graduierungssystem war in 20 Minuten eingerichtet. Kompatibel mit Angola, Regional und gemischten Systemen, ganz ohne Probleme.',
        name: 'Gavião',
        role: 'Contramestre · São Paulo',
        initials: 'GA',
      },
    ],
  },
  it: {
    label: 'La comunità lo usa',
    starsLabel: '5 stelle',
    items: [
      {
        quote: 'Prima facevo l\'appello su carta. Ora ci metto 30 secondi dal telefono e i miei alunni vedono subito la loro cronologia.',
        name: 'Grilo Mané',
        role: 'Educatore · Santiago, Cile',
        initials: 'GM',
      },
      {
        quote: 'Ho viaggiato per sei mesi e ho trovato capoeira in ogni città usando la mappa. Per un capoeirista in movimento non c\'è strumento migliore.',
        name: 'Mariposa',
        role: 'Praticante · Buenos Aires',
        initials: 'MA',
      },
      {
        quote: 'Il sistema di graduazione è stato configurato in 20 minuti. Compatibile con Angola, Regional e sistemi misti senza alcun problema.',
        name: 'Gavião',
        role: 'Contramestre · São Paulo',
        initials: 'GA',
      },
    ],
  },
} as const

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

type TestimonialItem = { quote: string; name: string; role: string; initials: string }

function TestimonialCard({ item, starsLabel }: { item: TestimonialItem; starsLabel: string }) {
  return (
    <div className="flex flex-col rounded-[20px] border border-border bg-card p-7">
      <div className="mb-5 flex gap-1 text-accent" aria-label={starsLabel}>
        {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
      </div>

      <p className="flex-1 text-sm leading-relaxed text-text-secondary">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
          style={{ background: 'var(--accent)' }}
        >
          {item.initials}
        </div>
        <div>
          <p className="text-sm font-bold text-ink">{item.name}</p>
          <p className="text-xs text-text-muted">{item.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function AppTestimonials({ locale }: { locale: string }) {
  const c = COPY[locale as keyof typeof COPY] ?? COPY.es

  return (
    <section className="border-t border-border bg-bg">
      <div className="page-shell py-14 lg:py-20">
        <p className="mb-8 text-[10px] font-black uppercase tracking-[0.22em] text-text-muted lg:mb-10">
          {c.label}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((t) => (
            <TestimonialCard key={t.name} item={t} starsLabel={c.starsLabel} />
          ))}
        </div>
      </div>
    </section>
  )
}
