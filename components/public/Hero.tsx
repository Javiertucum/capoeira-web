import Link from 'next/link'
import FeatureMockup from '@/components/public/FeatureMockup'

export default function Hero({ copy, stats }: { copy: any, stats: any }) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-bg">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {/* Top right organic shape */}
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-70 mix-blend-multiply" />
         {/* Bottom left organic shape */}
         <div className="absolute top-1/2 -left-24 w-72 h-72 bg-gold/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
         {/* Grid pattern overlay for texture */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNFMUUyRTYiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-50" />
      </div>

      <div className="page-shell relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-border emil-enter mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-2">{copy.eyebrow}</span>
            </div>
            
            <h1 className="text-ink font-black leading-[1.1] tracking-tight emil-enter-stagger emil-stagger-1" style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>
              {copy.heroLine1} <br />
              <span className="text-accent">{copy.heroEm}</span> {copy.heroLine2} <br/>
              {copy.heroLine3}
            </h1>

            <p className="max-w-[540px] text-lg lg:text-xl text-text-secondary leading-relaxed font-medium emil-enter-stagger emil-stagger-2 mx-auto lg:mx-0">
              {copy.body}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 emil-enter-stagger emil-stagger-3">
              <Link href="#beta" className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent-ink transition-all duration-300 px-10 h-16 rounded-2xl text-lg font-bold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1">
                {copy.ctaHero}
              </Link>
              
              <div className="flex gap-6 sm:border-l sm:border-border sm:pl-6 text-left">
                <div>
                  <div className="text-2xl font-black text-ink leading-none">{stats.educators.toLocaleString()}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted mt-1">{copy.statsLabel1}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-ink leading-none">{stats.nucleos.toLocaleString()}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted mt-1">{copy.statsLabel2}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative emil-enter-stagger emil-stagger-4 perspective-1000">
             <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full opacity-30 transform -rotate-12 scale-110" />
             {/* Mockup wrapper with clean shadow and rotation */}
             <div className="relative floating transform rotate-2 hover:rotate-0 transition-transform duration-500 rounded-[2.5rem] bg-white p-2 shadow-vanguard border border-border">
               <div className="overflow-hidden rounded-[2rem] bg-card">
                 <FeatureMockup type="home" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
