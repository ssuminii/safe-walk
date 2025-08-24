import type { RegionLabelsParams } from '@/pages/map/api/map'
import { apiClient } from '@/shared/lib/apiClient'
import type { TouristSpotLabels } from '@/shared/types/tourist-spot'

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
