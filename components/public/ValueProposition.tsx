export default function ValueProposition() {
  return (
    <section className="py-24 border-y border-bg/10 glass-dark">
       <div className="page-shell text-center">
          <p className="eyebrow acc mb-12 opacity-60">Impulsando la cultura capoeiragem</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-[filter,opacity] duration-200 ease-[var(--ease-out)]">
             {['Agendamento', 'Financeiro', 'Graduação', 'Comunidade'].map(v => (
                <span key={v} className="text-white font-black text-2xl tracking-tighter italic">{v}</span>
             ))}
          </div>
       </div>
    </section>
  )
}
