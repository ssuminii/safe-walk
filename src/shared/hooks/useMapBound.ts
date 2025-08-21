import { useState, useCallback } from 'react'

export const useMapBounds = () => {
  const [boundsParams, setBoundsParams] = useState<{
    swLat: number
    swLng: number
    neLat: number
    neLng: number
  } | null>(null)

  const updateBoundsParams = useCallback((map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    setBoundsParams({
      swLat: parseFloat(sw.getLat().toFixed(4)),
      swLng: parseFloat(sw.getLng().toFixed(4)),
      neLat: parseFloat(ne.getLat().toFixed(4)),
      neLng: parseFloat(ne.getLng().toFixed(4)),
    })
  }, [])

  return { boundsParams, updateBoundsParams }
}
