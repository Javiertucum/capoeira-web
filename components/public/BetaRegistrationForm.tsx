'use client'

import { useState } from 'react'

export default function BetaRegistrationForm({ locale }: { locale: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const copy = {
    es: {
      name: 'Nombre completo',
      email: 'Email (Google Play)',
      role: 'Tu rol en capoeira',
      group: 'Tu grupo (opcional)',
      message: '¿Por qué quieres participar?',
      submit: 'Solicitar acceso beta',
      loading: 'Enviando...',
      successTitle: '¡Solicitud recibida!',
      successBody: 'Revisaremos tu perfil y te enviaremos una invitación a través de Google Play Console.',
      error: 'Hubo un error. Inténtalo de nuevo.'
    },
    pt: {
      name: 'Nome completo',
      email: 'Email (Google Play)',
      role: 'Seu papel na capoeira',
      group: 'Seu grupo (opcional)',
      message: 'Por que você quer participar?',
      submit: 'Solicitar acesso beta',
      loading: 'Enviando...',
      successTitle: 'Solicitação recebida!',
      successBody: 'Revisaremos seu perfil e enviaremos um convite através do Google Play Console.',
      error: 'Ocorreu um erro. Tente novamente.'
    },
    en: {
      name: 'Full Name',
      email: 'Email (Google Play)',
      role: 'Your role in capoeira',
      group: 'Your group (optional)',
      message: 'Why do you want to join?',
      submit: 'Request Beta Access',
      loading: 'Sending...',
      successTitle: 'Request received!',
      successBody: 'We will review your profile and send an invitation via Google Play Console.',
      error: 'There was an error. Please try again.'
    }
  }

  const c = copy[locale as keyof typeof copy] ?? copy.en

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/beta-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[40px] bg-accent/5 border border-accent/20 p-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-white mb-8 shadow-lg shadow-accent/20 rotate-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 className="text-3xl font-black text-white leading-tight">{c.successTitle}</h3>
        <p className="mt-6 text-white/50 text-lg leading-relaxed max-w-[320px] mx-auto font-medium">{c.successBody}</p>
      </div>
    )
  }

  const inputClasses = "h-16 rounded-[24px] border border-white/5 bg-white/[0.03] px-8 text-white placeholder:text-white/30 focus:border-accent/50 focus:bg-white/[0.06] outline-none transition-all duration-300 font-medium"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <input
            required
            name="name"
            placeholder={c.name}
            className={`w-full ${inputClasses}`}
          />
        </div>
        <div className="space-y-2">
          <input
            required
            type="email"
            name="email"
            placeholder={c.email}
            className={`w-full ${inputClasses}`}
          />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <input
            name="role"
            placeholder={c.role}
            className={`w-full ${inputClasses}`}
          />
        </div>
        <div className="space-y-2">
          <input
            name="group"
            placeholder={c.group}
            className={`w-full ${inputClasses}`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <textarea
          name="message"
          rows={4}
          placeholder={c.message}
          className={`w-full rounded-[32px] border border-white/5 bg-white/[0.03] p-8 text-white placeholder:text-white/30 focus:border-accent/50 focus:bg-white/[0.06] outline-none transition-all duration-300 resize-none font-medium`}
        />
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-accent btn-lg w-full h-18 rounded-[24px] font-black text-xl shadow-vanguard disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        {status === 'loading' ? (
           <div className="flex items-center gap-3">
              <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{c.loading}</span>
           </div>
        ) : c.submit}
      </button>

      {status === 'error' && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center text-red-400 text-sm font-bold uppercase tracking-widest animate-in shake-1">
           {c.error}
        </div>
      )}
    </form>
  )
}
