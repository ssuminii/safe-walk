import { useState, useCallback } from 'react'
import { getTouristSpots } from '@/pages/tourist-spot/api/tourist-spot'
import type { TouristSpotLabels } from '@/shared/types/tourist-spot'

export const useTouristLabels = () => {
  const [touristSpots, setTouristSpots] = useState<TouristSpotLabels[]>([])

  const fetchTouristLabels = useCallback(async (map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    try {
      const touristSpotsData = await getTouristSpots({
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
      })
      console.log('관광지 API 응답:', touristSpotsData)
      
      // 중복 id 제거
      const uniqueTouristSpots = touristSpotsData.filter(
        (spot, index, arr) => arr.findIndex((s) => s.id === spot.id) === index
      )
      
      setTouristSpots(uniqueTouristSpots)
    } catch (error) {
      console.error('관광지 라벨 로딩 실패:', error)
      setTouristSpots([])
    }
  }, [])

  return { touristSpots, fetchTouristLabels }
}
