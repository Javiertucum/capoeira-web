import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-20 border-t border-border bg-bg">
      <div className="page-shell flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-6">
           <div className="h-12 w-12 rounded-2xl bg-accent shadow-md shadow-accent/20 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-white/90 rounded-lg" />
           </div>
           <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Agenda Capoeiragem © 2026</p>
        </div>
        <div className="flex gap-10 text-[14px] font-bold text-text-secondary uppercase tracking-tight">
           <Link href="#features" className="hover:text-accent transition-colors">Funcionalidades</Link>
           <Link href="#tutorials" className="hover:text-accent transition-colors">Tutoriales</Link>
           <Link href="#join" className="hover:text-accent transition-colors">Comunidad</Link>
        </div>
      </div>
    </footer>
  )
}
