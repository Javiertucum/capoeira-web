import FeatureMockup from '@/components/public/FeatureMockup'
import TutorialSection from '@/components/public/TutorialSection'

export default function FeaturesShowcase({ copy, locale }: { copy: any, locale: string }) {
  return (
    <section id="features" className="page-shell py-32 bg-bg">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
        <div className="max-w-[800px]">
           <h2 className="text-ink font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}>
             {copy.showcaseTitle}
           </h2>
        </div>
        <p className="max-w-[400px] text-lg lg:text-xl text-text-secondary leading-relaxed pb-2 font-medium">
          {copy.showcaseBody}
        </p>
      </div>

      {/* Educator Features - Clean Solid Bento */}
      <div className="mb-40">
        <div className="flex items-center gap-4 mb-12">
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 text-accent font-black text-sm">01</span>
          <h2 className="text-3xl font-black text-ink tracking-tight">{copy.educatorSubtitle}</h2>
          <div className="flex-1 h-px bg-border ml-4 hidden sm:block" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-center">
          <div className="grid gap-6 sm:grid-cols-2">
            {copy.educatorFeatures.map((f: any, i: number) => (
              <div key={f.t} className={`rounded-3xl border border-border bg-card p-8 hover:-translate-y-2 group transition-all duration-300 emil-enter-stagger emil-stagger-${i % 7 + 1} hover:shadow-lg`}>
                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{f.t}</h3>
                <p className="text-base leading-relaxed text-text-secondary font-medium">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="floating bg-surface rounded-[2.5rem] p-4 border border-border">
             <div className="rounded-[2rem] overflow-hidden shadow-sm">
               <FeatureMockup type="attendance" />
             </div>
          </div>
        </div>
      </div>

      {/* Student Features */}
      <div className="mb-40">
        <div className="flex items-center gap-4 mb-12">
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10 text-gold font-black text-sm">02</span>
          <h2 className="text-3xl font-black text-ink tracking-tight">{copy.studentSubtitle}</h2>
          <div className="flex-1 h-px bg-border ml-4 hidden sm:block" />
        </div>
        <div className="grid gap-16 lg:grid-cols-[400px_1fr] items-center">
          <div className="floating bg-surface rounded-[2.5rem] p-4 border border-border order-last lg:order-first">
             <div className="rounded-[2rem] overflow-hidden shadow-sm">
               <FeatureMockup type="graduation" />
             </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {copy.studentFeatures.map((f: any, i: number) => (
              <div key={f.t} className={`rounded-3xl border border-border bg-white p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 emil-enter-stagger emil-stagger-${i % 7 + 1}`}>
                <div className="w-10 h-1 bg-gold rounded-full mb-6 opacity-80" />
                <h3 className="text-xl font-bold text-ink mb-3">{f.t}</h3>
                <p className="text-base leading-relaxed text-text-secondary font-medium">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Ecosystem */}
      <div className="mb-32">
         <div className="flex items-center gap-4 mb-12">
           <span className="flex items-center justify-center h-10 w-10 rounded-full bg-ink/5 text-ink font-black text-sm">03</span>
           <h2 className="text-3xl font-black text-ink tracking-tight">{('advancedTitle' in copy) ? (copy as any).advancedTitle : 'Ecosistema Avanzado'}</h2>
           <div className="flex-1 h-px bg-border ml-4 hidden sm:block" />
         </div>
         <div className="grid gap-8 lg:grid-cols-3">
            {(('advancedFeatures' in copy) ? (copy as any).advancedFeatures : []).map((f: any, i: number) => (
              <div key={f.t} className={`flex flex-col emil-enter-stagger emil-stagger-${i % 7 + 1}`}>
                 <div className="rounded-3xl border border-border bg-white p-8 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <h3 className="text-xl font-bold text-ink mb-3">{f.t}</h3>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 flex-1">{f.d}</p>
                    <div className="relative overflow-hidden rounded-2xl bg-surface aspect-[9/12] group border border-border/50">
                       <div className="absolute inset-0 scale-[0.92] origin-top translate-y-4 group-hover:scale-95 group-hover:translate-y-2 transition-all duration-500 ease-out">
                          <FeatureMockup type={f.mockup} />
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Tutorials */}
      <TutorialSection locale={locale} />
    </section>
  )
}
