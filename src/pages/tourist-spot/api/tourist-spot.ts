import { apiClient } from '../../../shared/lib/apiClient'
import type { RegionLabels } from '../../../shared/types/map'
import type { RegionLabelsParams } from '../../search/api/map'

// 지도 영역 관광지 조회
export const getTouristSpot = async ({
  swLat,
  swLng,
  neLat,
  neLng,
}: RegionLabelsParams): Promise<RegionLabels[]> => {
  const response = await apiClient.get<RegionLabels[]>('/tourist-spot', {
    params: { swLat, swLng, neLat, neLng },
  })
  return response.data
}
