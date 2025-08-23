import { useState, useCallback } from 'react'
import { getRegionLabels } from '@/pages/map/api/map'
import type { RegionLabels } from '@/shared/types/map'

export const useRegionLabels = () => {
  const [regionLabels, setRegionLabels] = useState<RegionLabels[]>([])

  const fetchRegionLabels = useCallback(async (map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    try {
      const spots = await getRegionLabels({
        swLat: parseFloat(sw.getLat().toFixed(4)),
        swLng: parseFloat(sw.getLng().toFixed(4)),
        neLat: parseFloat(ne.getLat().toFixed(4)),
        neLng: parseFloat(ne.getLng().toFixed(4)),
      })
      setRegionLabels(spots)
    } catch (err) {
      console.error('지역 라벨 정보 불러오기 실패:', err)
    }
  }, [])

  return { regionLabels, fetchRegionLabels }
}
