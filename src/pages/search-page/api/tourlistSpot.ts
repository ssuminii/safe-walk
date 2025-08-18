import { apiClient } from '../../../shared/lib/apiClient'
import type { Emd } from '../../../shared/types/map'

interface GetTouristSpotsParams {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
}

export const getTouristSpots = async ({ swLat, swLng, neLat, neLng }: GetTouristSpotsParams): Promise<Emd[]> => {
  const response = await apiClient.get<Emd[]>('/emd', {
    params: { swLat, swLng, neLat, neLng },
  })
  return response.data
}
