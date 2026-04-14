'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/auth/client'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'es'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await credential.user.getIdToken()

      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al iniciar sesión')
      }

      router.push(`/${locale}/admin/dashboard`)
    } catch (err: unknown) {
      console.error('[AdminLogin] error:', err)
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        setError('Correo o contraseña incorrectos')
      } else if (msg.includes('Not admin')) {
        setError('Esta cuenta no tiene permisos de administrador')
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5">
      <div className="w-full max-w-[400px] rounded-[28px] border border-border bg-card p-8 shadow-[0_24px_80px_var(--shadow)] sm:p-10">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
            Agenda Capoeiragem
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Solo personal autorizado. Ingresa tus credenciales para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Correo electrónico
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors hover:border-[#374555] focus:border-accent/50"
              placeholder="admin@capoeira.app"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors hover:border-[#374555] focus:border-accent/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-xs text-danger">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-[#08110C] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#08110C]/30 border-t-[#08110C]" />
                Ingresando...
              </>
            ) : (
              'Entrar al Panel'
            )}
          </button>
        </form>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-text-muted">
            ¿Olvidaste tu contraseña? Contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  )
}
