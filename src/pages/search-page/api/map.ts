import { apiClient } from '../../../shared/lib/apiClient'
import type { EmnSearchResult, RegionInfoType, RegionLabels } from '../../../shared/types/map'

export interface RegionLabelsParams {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
}

// 지도 영역 법정동 조회
export const getRegionLabels = async ({ swLat, swLng, neLat, neLng }: RegionLabelsParams): Promise<RegionLabels[]> => {
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

// 단일 검색 조회
export const searchRegionInfoByName = async (name: string): Promise<EmnSearchResult[]> => {
  const response = await apiClient.get<EmnSearchResult[]>('/emd/search/name', {
    params: { name },
  })
  return response.data
}

// 지도 영역 사고 상세 데이터 조회
export const getRegionAccidentList = async ({ swLat, swLng, neLat, neLng }: RegionLabelsParams): Promise<RegionInfoType[]> => {
  const response = await apiClient.get<RegionInfoType[]>('/emd/details', {
    params: { swLat, swLng, neLat, neLng },
  })
  return response.data
}
