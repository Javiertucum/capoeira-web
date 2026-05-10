'use client'

import { useEffect, useRef, useState } from 'react'

type UserResult = {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
}

type Props = {
  selected: UserResult[]
  onAdd: (user: UserResult) => void
  onRemove: (uid: string) => void
  searchEndpoint?: string
  placeholder?: string
}

export default function UserSearchCombobox({
  selected,
  onAdd,
  onRemove,
  searchEndpoint = '/api/admin/users/search',
  placeholder = 'Buscar usuario por nombre...',
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedUids = new Set(selected.map((u) => u.uid))

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${searchEndpoint}?q=${encodeURIComponent(query)}`)
        const data = (await res.json()) as UserResult[]
        setResults(data.filter((u) => !selectedUids.has(u.uid)))
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query, searchEndpoint, selectedUids])

  function select(user: UserResult) {
    onAdd(user)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((user) => (
            <span
              key={user.uid}
              className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
            >
              {user.displayName || user.email}
              <button
                type="button"
                onClick={() => onRemove(user.uid)}
                className="ml-0.5 opacity-60 hover:opacity-100"
                aria-label={`Eliminar ${user.displayName}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            ...
          </span>
        )}

        {open && results.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
            {results.map((user) => (
              <li key={user.uid}>
                <button
                  type="button"
                  onMouseDown={() => select(user)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface/60"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                      {(user.displayName || user.email)[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text">{user.displayName}</p>
                    <p className="truncate text-xs text-text-muted">{user.email}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
