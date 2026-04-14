'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminUser } from '@/lib/admin-queries'

interface Props {
  user: AdminUser
  locale: string
}

export default function UserEditForm({ user, locale }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    name:       user.name,
    surname:    user.surname,
    nickname:   user.nickname ?? '',
    email:      user.email ?? '',
    role:       user.role,
    groupId:    user.groupId ?? '',
    bio:        user.bio ?? '',
    country:    user.country ?? '',
    disabled:   user.disabled,
    instagram:  user.socialLinks?.instagram ?? '',
    facebook:   user.socialLinks?.facebook ?? '',
    whatsapp:   user.socialLinks?.whatsapp ?? '',
    website:    user.socialLinks?.website ?? '',
    youtube:    user.socialLinks?.youtube ?? '',
    tiktok:     user.socialLinks?.tiktok ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const body = {
        name:       form.name,
        surname:    form.surname,
        nickname:   form.nickname || null,
        nameLower:  form.name.toLowerCase(),
        surnameLower: form.surname.toLowerCase(),
        nicknameLower: form.nickname?.toLowerCase() || null,
        email:      form.email,
        role:       form.role,
        groupId:    form.groupId || null,
        bio:        form.bio || null,
        country:    form.country || null,
        disabled:   form.disabled,
        socialLinks: {
          instagram: form.instagram || null,
          facebook:  form.facebook  || null,
          whatsapp:  form.whatsapp  || null,
          website:   form.website   || null,
          youtube:   form.youtube   || null,
          tiktok:    form.tiktok    || null,
        },
      }
      const res = await fetch(`/api/admin/users/${user.uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al guardar')
      }
      setMessage({ type: 'ok', text: 'Usuario actualizado correctamente' })
      router.refresh()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar cuenta de ${user.name} ${user.surname}? Esta acción es permanente.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${user.uid}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      router.push(`/${locale}/admin/users`)
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al eliminar' })
      setDeleting(false)
    }
  }

  const inputClass = "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent/40 transition-colors"
  const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-2xl border px-6 py-4 text-sm font-medium shadow-sm transition-all
          ${message.type === 'ok'
            ? 'bg-accent/10 text-accent border-accent/20'
            : 'bg-danger/10 text-danger border-danger/20'
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Información Personal</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Apellido</label>
                <input className={inputClass} value={form.surname} onChange={e => set('surname', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Apodo (nickname)</label>
              <input className={inputClass} value={form.nickname} onChange={e => set('nickname', e.target.value)} placeholder="Ej: Mestre Bimba" />
            </div>
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Rol y Ubicación</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Rol en la plataforma</label>
              <select className={inputClass} value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="student">Estudiante</option>
                <option value="educator">Educador</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>ID de grupo (Organization)</label>
              <input className={inputClass} value={form.groupId} onChange={e => set('groupId', e.target.value)} placeholder="vacio o groupId" />
            </div>
            <div>
              <label className={labelClass}>País</label>
              <input className={inputClass} value={form.country} onChange={e => set('country', e.target.value)} placeholder="Ej: España" />
            </div>
          </div>
        </section>
      </div>

      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Biografía</h3>
        <textarea 
          className={`${inputClass} min-h-[120px] resize-none`} 
          value={form.bio} 
          onChange={e => set('bio', e.target.value)} 
          placeholder="Escribe la biografía del usuario..."
        />
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Redes Sociales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['instagram', 'whatsapp', 'website', 'youtube', 'tiktok', 'facebook'].map(plat => (
            <div key={plat}>
              <label className={labelClass}>{plat}</label>
              <input className={inputClass} value={(form as any)[plat]} onChange={e => set(plat, e.target.value)} placeholder={`URL o @usuario`} />
            </div>
          ))}
        </div>
      </section>

      <div className="bg-card border border-rose-900/40 bg-[linear-gradient(135deg,rgba(15,10,10,1)_0%,rgba(28,15,15,1)_100%)] rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold text-rose-500 mb-2 uppercase tracking-widest">Zona de Peligro</h3>
            <p className="text-xs text-text-muted">Acciones administrativas de seguridad y eliminación de cuenta.</p>
          </div>
          <div className="flex flex-wrap gap-4">
             <label className="flex items-center gap-3 cursor-pointer bg-surface/40 hover:bg-surface/60 border border-border rounded-xl px-4 py-3 transition-colors">
                <input
                  type="checkbox"
                  checked={form.disabled}
                  onChange={e => set('disabled', e.target.checked)}
                  className="w-5 h-5 accent-danger rounded-lg"
                />
                <span className="text-sm font-semibold text-text">Bloquear Acceso</span>
              </label>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-rose-900/60 bg-rose-950/20 px-6 py-3 text-sm font-bold text-rose-500 transition-all hover:bg-rose-950/40 disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar Usuario'}
              </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-accent px-10 py-4 text-sm font-bold tracking-widest text-[#08110C] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-[0_8px_32px_-8px_rgba(102,187,106,0.3)]"
        >
          {saving ? 'Guardando Cambios...' : 'Guardar Actualizaciones'}
        </button>
      </div>
    </div>
  )
}
