export default function ValueProposition() {
  return (
    <section className="py-20 bg-accent overflow-hidden relative">
       {/* Organic pattern overlay */}
       <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=')] mix-blend-overlay" />
       
       <div className="page-shell text-center relative z-10">
          <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-10">Impulsando la cultura capoeiragem</p>
          <div className="flex flex-wrap justify-center md:justify-between gap-8 opacity-90 transition-[opacity] duration-300">
             {['Agendamento', 'Financeiro', 'Graduação', 'Comunidade'].map(v => (
                <span key={v} className="text-white font-black text-2xl md:text-3xl tracking-tighter italic">{v}</span>
             ))}
          </div>
       </div>
    </section>
  )
}
