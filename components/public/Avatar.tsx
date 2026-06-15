export default function Avatar({
  name,
  surname,
  avatarUrl,
  size = 'md',
}: {
  name: string
  surname: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const dimension = size === 'sm' ? 'h-11 w-11' : size === 'lg' ? 'h-24 w-24' : 'h-14 w-14'
  const textSize = size === 'lg' ? 'text-2xl' : 'text-sm'
  const initials = `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase()

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${name} ${surname}`}
        className={`${dimension} shrink-0 rounded-full border border-border object-cover`}
      />
    )
  }
  return (
    <div className={`grid ${dimension} shrink-0 place-items-center rounded-full border border-border bg-surface font-bold text-text-secondary ${textSize}`}>
      {initials || '?'}
    </div>
  )
}
