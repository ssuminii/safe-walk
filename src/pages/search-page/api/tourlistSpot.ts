import { apiClient } from '../../../shared/lib/apiClient'
import type { RegionLabels } from '../../../shared/types/map'

interface GetTouristSpotsParams {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
}

export const getRegionLabels = async ({ swLat, swLng, neLat, neLng }: GetTouristSpotsParams): Promise<RegionLabels[]> => {
  const response = await apiClient.get<RegionLabels[]>('/emd', {
    params: { swLat, swLng, neLat, neLng },
  })
  return response.data
}

