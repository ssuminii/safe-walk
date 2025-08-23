import axios from 'axios'
import type { PolygonCollection, PolygonIndex } from '@/shared/types/polygon'

const BASE_URL = 'https://yunrry.github.io/safewalk-polygon-data'

// 지역별 데이터 조회
export const getRegionPolygon = async (regionKey: string): Promise<PolygonCollection> => {
  const response = await axios.get<PolygonCollection>(`${BASE_URL}/regions/${regionKey}.json`)
  return response.data
}

// 메타데이터 조회
export const getPolygonIndex = async (): Promise<PolygonIndex> => {
  const response = await axios.get<PolygonIndex>(`${BASE_URL}/index.json`)
  return response.data
}