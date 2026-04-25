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
      <div className="rounded-[40px] bg-accent/10 border border-accent/20 p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 className="text-2xl font-black text-bg">{c.successTitle}</h3>
        <p className="mt-4 text-bg/70 leading-relaxed max-w-[320px] mx-auto">{c.successBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder={c.name}
          className="h-14 rounded-2xl border border-bg/10 bg-bg/5 px-6 text-bg placeholder:text-bg/30 focus:border-accent/50 outline-none transition-all"
        />
        <input
          required
          type="email"
          name="email"
          placeholder={c.email}
          className="h-14 rounded-2xl border border-bg/10 bg-bg/5 px-6 text-bg placeholder:text-bg/30 focus:border-accent/50 outline-none transition-all"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="role"
          placeholder={c.role}
          className="h-14 rounded-2xl border border-bg/10 bg-bg/5 px-6 text-bg placeholder:text-bg/30 focus:border-accent/50 outline-none transition-all"
        />
        <input
          name="group"
          placeholder={c.group}
          className="h-14 rounded-2xl border border-bg/10 bg-bg/5 px-6 text-bg placeholder:text-bg/30 focus:border-accent/50 outline-none transition-all"
        />
      </div>
      <textarea
        name="message"
        rows={3}
        placeholder={c.message}
        className="w-full rounded-2xl border border-bg/10 bg-bg/5 p-6 text-bg placeholder:text-bg/30 focus:border-accent/50 outline-none transition-all resize-none"
      />
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-accent btn-lg w-full h-16 rounded-full font-black text-lg disabled:opacity-50"
      >
        {status === 'loading' ? c.loading : c.submit}
      </button>

      {status === 'error' && (
        <p className="text-center text-red-400 text-sm font-medium">{c.error}</p>
      )}
    </form>
  )
}
