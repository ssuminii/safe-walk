import type { RegionLabelsParams } from '@/pages/map/api/map'
import { apiClient } from '@/shared/lib/apiClient'
import type { PopularTouristSpots, TouristSpotLabels } from '@/shared/types/tourist-spot'

// 지도 영역 관광지 조회
export const getTouristSpots = async ({
  swLat,
  swLng,
  neLat,
  neLng,
}: RegionLabelsParams): Promise<TouristSpotLabels[]> => {
  const response = await apiClient.get<TouristSpotLabels[]>('/tourist-spots', {
    params: { swLat, swLng, neLat, neLng },
  })
  return response.data
}

// 특정 지역 관광지 조회 (인기관광지)
export const getState = async (
  code: string,
  mode: string = '인기관광지'
): Promise<PopularTouristSpots[]> => {
  const response = await apiClient.get<PopularTouristSpots[]>('/tourist-spots/state', {
    params: {
      code,
      mode,
    },
  })
  return response.data
}
