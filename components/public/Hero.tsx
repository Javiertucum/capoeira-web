import Link from 'next/link'
import FeatureMockup from '@/components/public/FeatureMockup'

export default function Hero({ copy, stats }: { copy: any, stats: any }) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1440px] pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <div className="page-shell relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/40 shadow-soft emil-enter mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent-ink">{copy.eyebrow}</span>
            </div>
            
            <h1 className="text-[#10131A] font-black leading-[0.85] tracking-[-0.05em] emil-enter-stagger emil-stagger-1" style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}>
              {copy.heroLine1} <br />
              <span className="text-gradient italic">{copy.heroEm}</span> <br/>
              {copy.heroLine3}
            </h1>

            <p className="max-w-[540px] text-xl lg:text-2xl text-[#10131A]/60 leading-relaxed font-medium emil-enter-stagger emil-stagger-2 mx-auto lg:mx-0">
              {copy.body}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 emil-enter-stagger emil-stagger-3">
              <Link href="#join" className="btn btn-accent btn-lg shadow-vanguard hover:scale-105 transition-transform px-10 h-16 text-lg font-black">
                {copy.ctaHero}
              </Link>
              
              <div className="flex gap-8 border-l border-[#10131A]/10 pl-8">
                <div>
                  <div className="text-2xl font-black text-[#10131A] tracking-tighter leading-none">{stats.educators.toLocaleString()}</div>
                  <div className="eyebrow text-[9px] mt-1 text-[#10131A]/40">{copy.statsLabel1}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#10131A] tracking-tighter leading-none">{stats.nucleos.toLocaleString()}</div>
                  <div className="eyebrow text-[9px] mt-1 text-[#10131A]/40">{copy.statsLabel2}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative emil-enter-stagger emil-stagger-4">
             <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-40 floating" />
             <FeatureMockup type="home" />
          </div>
        </div>
      </div>
    </section>
  )
}
