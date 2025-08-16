import { useEffect, useState } from 'react'

export interface GeoPosition {
  lat: number
  lng: number
}

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('이 브라우저는 Geolocation을 지원하지 않습니다.')
      setLoading(false)
      return
    }
    const id = navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({lat: pos.coords.latitude, lng: pos.coords.longitude})
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000},
    )
    return () => { void id }
  }, [])

  return { position, error, loading }
}
