const ROW_1 = [
  'Asistencia', 'Financeiro', 'Graduação', 'Comunidade',
  'Batizado',   'Agendamento', 'Directorio', 'Eventos',
]

const ROW_2 = [
  'Corda',   'Nucleo',    'Roda',       'Grupo',
  'Mestre',  'Berimbau',  'Capoeiragem', 'Ginga',
]

function Separator() {
  return (
    <span
      aria-hidden
      className="mx-6 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
    />
  )
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[]
  reverse?: boolean
}) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden" aria-hidden>
      <div className={reverse ? 'marquee-track-r flex w-max' : 'marquee-track flex w-max'}>
        {doubled.map((term, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="whitespace-nowrap text-xl font-black uppercase tracking-[-0.02em] text-white/90 lg:text-2xl">
              {term}
            </span>
            <Separator />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ValueProposition() {
  return (
    <section className="overflow-hidden bg-ink py-12 lg:py-16">
      {/* Subtle dot-grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative space-y-5">
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  )
}
