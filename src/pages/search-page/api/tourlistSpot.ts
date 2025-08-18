import { apiClient } from '../../../shared/lib/apiClient'
import type { RegionLabels } from '../../../shared/types/map'

interface GetTouristSpotsParams {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
}

// 지도 영역 법정동 조회
export const getRegionLabels = async ({ swLat, swLng, neLat, neLng }: GetTouristSpotsParams): Promise<RegionLabels[]> => {
  const response = await apiClient.get<RegionLabels[]>('/emd', {
    params: { swLat, swLng, neLat, neLng },
  })
  return response.data
}

// 법정동 상세 조회
export const getRegionInfo = async ({ regionId }: {regionId: string}) => {
  const response = await apiClient.get(`/emd/${regionId}`)
  return response.data
}