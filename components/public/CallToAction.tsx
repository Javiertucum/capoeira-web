import BetaRegistrationForm from '@/components/public/BetaRegistrationForm'

export default function CallToAction({ copy, locale }: { copy: any, locale: string }) {
  return (
    <section id="join" className="relative py-40 overflow-hidden bg-[#0A0C10] selection:bg-accent/40">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 blur-[180px] rounded-full opacity-50" />
      </div>

      <div className="page-shell relative z-10">
        <div className="grid gap-20 lg:grid-cols-[1fr_500px] items-center">
          <div className="space-y-12 text-center lg:text-left">
             <div className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-accent text-xs font-black tracking-[0.2em] uppercase mx-auto lg:mx-0">
                Agenda Capoeiragem
             </div>
             <h2 className="text-white font-black leading-[0.85] tracking-[-0.05em]" style={{ fontSize: 'clamp(56px, 8vw, 100px)' }}>
               {copy.betaTitle.split(' ')[0]} <br />
               <span className="text-accent italic">{copy.betaTitle.split(' ').slice(1).join(' ')}</span>
             </h2>
             <p className="text-white/50 text-xl lg:text-2xl leading-relaxed max-w-[500px] font-medium mx-auto lg:mx-0">
               {copy.betaBody}
             </p>
             
             <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="space-y-3">
                   <p className="text-white font-black text-4xl tracking-tighter leading-none">100%</p>
                   <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Conexión Global</p>
                </div>
                <div className="space-y-3">
                   <p className="text-white font-black text-4xl tracking-tighter leading-none">Global</p>
                   <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Comunidad Integrada</p>
                </div>
             </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-20" />
             <div className="relative glass-dark p-1 rounded-[56px] shadow-vanguard border-white/5">
                <div className="p-8 lg:p-12">
                   <BetaRegistrationForm locale={locale} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
