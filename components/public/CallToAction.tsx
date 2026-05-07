import BetaRegistrationForm from '@/components/public/BetaRegistrationForm'

export default function CallToAction({ copy, locale }: { copy: any, locale: string }) {
  return (
    <section id="join" className="relative py-32 bg-surface overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="page-shell relative z-10">
        <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-xl shadow-ink/5 border border-border grid gap-16 lg:grid-cols-[1fr_450px] items-center">
          <div className="space-y-10 text-center lg:text-left">
             <div className="inline-flex px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-xs tracking-widest uppercase mx-auto lg:mx-0">
                Agenda Capoeiragem
             </div>
             <h2 className="text-ink font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
               {copy.betaTitle.split(' ')[0]} <br className="hidden lg:block"/>
               <span className="text-accent">{copy.betaTitle.split(' ').slice(1).join(' ')}</span>
             </h2>
             <p className="text-text-secondary text-lg lg:text-xl leading-relaxed max-w-[500px] mx-auto lg:mx-0">
               {copy.betaBody}
             </p>
             
             <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border">
                <div>
                   <p className="text-ink font-black text-3xl mb-1">100%</p>
                   <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Conexión Global</p>
                </div>
                <div>
                   <p className="text-ink font-black text-3xl mb-1">Global</p>
                   <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Comunidad Integrada</p>
                </div>
             </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-accent/10 blur-[50px] rounded-full opacity-50" />
             <div className="relative bg-card p-8 lg:p-10 rounded-[2.5rem] shadow-lg border border-border">
                <BetaRegistrationForm locale={locale} />
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
