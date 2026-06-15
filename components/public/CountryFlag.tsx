import { flagUrlForCountry } from '@/lib/country-flags'

export default function CountryFlag({ country, className }: { country?: string | null; className?: string }) {
  const url = flagUrlForCountry(country)
  if (!url) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={20}
      height={15}
      className={`inline-block rounded-[2px] ${className ?? ''}`}
    />
  )
}
