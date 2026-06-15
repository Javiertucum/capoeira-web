const EARTH_RADIUS_KM = 6371

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function haversineDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}
