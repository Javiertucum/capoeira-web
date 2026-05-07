import FeatureMockup from '@/components/public/FeatureMockup'
import TutorialSection from '@/components/public/TutorialSection'

export default function FeaturesShowcase({ copy, locale }: { copy: any, locale: string }) {
  return (
    <section id="features" className="page-shell py-40">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
        <div className="max-w-[800px]">
           <h2 className="text-[#10131A] font-black leading-none tracking-[-0.05em]" style={{ fontSize: 'clamp(48px, 6vw, 96px)' }}>
             {copy.showcaseTitle}
           </h2>
        </div>
        <p className="max-w-[400px] text-xl text-[#10131A]/60 leading-relaxed pb-2 font-medium">
          {copy.showcaseBody}
        </p>
      </div>

      {/* Educator Features */}
      <div className="mb-48">
        <div className="section-head mb-16">
          <span className="num text-[#10131A]/40">01</span>
          <h2 className="text-3xl font-black text-[#10131A] tracking-tight">{copy.educatorSubtitle}</h2>
          <div className="rule border-[#10131A]/10" />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-center">
          <div className="grid gap-6 sm:grid-cols-2">
            {copy.educatorFeatures.map((f: any, i: number) => (
              <div key={f.t} className={`rounded-[48px] border border-[#10131A]/10 bg-[#10131A]/5 p-10 hover-lift group emil-enter-stagger emil-stagger-${i % 7 + 1}`}>
                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-200 ease-[var(--ease-out)] shadow-soft">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <h3 className="text-2xl font-black text-[#10131A] mb-4 leading-tight">{f.t}</h3>
                <p className="text-base leading-relaxed text-[#10131A]/60 font-medium">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="floating" style={{ animationDelay: '1s' }}>
             <FeatureMockup type="attendance" />
          </div>
        </div>
      </div>

      {/* Student Features */}
      <div className="mb-48">
        <div className="section-head mb-16">
          <span className="num text-[#10131A]/40">02</span>
          <h2 className="text-3xl font-black text-[#10131A] tracking-tight">{copy.studentSubtitle}</h2>
          <div className="rule border-[#10131A]/10" />
        </div>
        <div className="grid gap-20 lg:grid-cols-[400px_1fr] items-center">
          <div className="floating">
             <FeatureMockup type="graduation" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {copy.studentFeatures.map((f: any, i: number) => (
              <div key={f.t} className={`rounded-[40px] border border-[#10131A]/10 bg-white/40 p-10 backdrop-blur-sm shadow-soft hover-lift group emil-enter-stagger emil-stagger-${i % 7 + 1}`}>
                <div className="mb-6 opacity-20 group-hover:opacity-100 transition-opacity duration-200 ease-[var(--ease-out)]">
                   <div className="h-1 w-12 bg-accent rounded-full" />
                </div>
                <h3 className="text-2xl font-black text-[#10131A] mb-4 leading-tight">{f.t}</h3>
                <p className="text-base leading-relaxed text-[#10131A]/60 font-medium">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Ecosystem */}
      <div className="mb-40">
         <div className="section-head mb-16">
           <span className="num text-[#10131A]/40">03</span>
           <h2 className="text-3xl font-black text-[#10131A] tracking-tight">{copy.advancedTitle}</h2>
           <div className="rule border-[#10131A]/10" />
         </div>
         <div className="grid gap-12 lg:grid-cols-3">
            {copy.advancedFeatures.map((f: any, i: number) => (
              <div key={f.t} className={`flex flex-col gap-8 emil-enter-stagger emil-stagger-${i % 7 + 1}`}>
                 <div className="rounded-[48px] border border-[#10131A]/10 bg-white p-8 hover-lift">
                    <h3 className="text-xl font-black text-[#10131A] mb-3 tracking-tight">{f.t}</h3>
                    <p className="text-sm text-[#10131A]/50 font-medium leading-relaxed mb-8">{f.d}</p>
                    <div className="relative overflow-hidden rounded-[32px] bg-[#0A0C10] aspect-[9/12] group/screen">
                       <div className="absolute inset-0 scale-[0.9] origin-top translate-y-4 group-hover/screen:scale-[0.95] group-hover/screen:translate-y-2 transition-all duration-300 ease-[var(--ease-out)]">
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
