import { useCallback } from 'react';
import type {  PolygonFeature } from '../types/polygon';
import { getRegionLabels, type RegionLabelsParams } from '../../pages/search-page/api/map';
import { getRegionPolygon } from '../../pages/search-page/api/polygon';
import { REGIONS } from '../constants/region';
import { useQueryClient } from '@tanstack/react-query';

export const usePolygonLoader = () => {
  const queryClient = useQueryClient()

  const findRegionKeyByCode = (code: string): string | null => {
    return Object.entries(REGIONS).find(([, region]) => region.code === code)?.[0] ?? null
  }

  // EMD_CD로 특정 polygon 찾기
const getPolygonByEmdCode = useCallback(
    async (emdCode: string): Promise<PolygonFeature | null> => {
      const regionCode = emdCode.substring(0, 2)
      const regionKey = findRegionKeyByCode(regionCode)

      if (!regionKey) {
        console.error(`Unknown region code: ${regionCode}`)
        return null
      }

      const cacheKey = ['regionPolygon', regionKey]
      let regionData = queryClient.getQueryData<{ features: PolygonFeature[] }>(cacheKey)

      if (!regionData) {
        regionData = await getRegionPolygon(regionKey)
        queryClient.setQueryData(cacheKey, regionData) 
      }

      return regionData.features.find(feature => feature.properties.EMD_CD === emdCode) || null
    },
    [queryClient]
  )

  // 경계 내 polygon들 가져오기
  const getPolygonsInBounds = useCallback(async ({ swLat, swLng, neLat, neLng }: RegionLabelsParams): Promise<PolygonFeature[]> => {
    try {
      const emdList = await getRegionLabels({ swLat, swLng, neLat, neLng });
      
      if (!Array.isArray(emdList) || emdList.length === 0) {
        return [];
      }

      const emdCodes = emdList.map((emd) => emd.EMD_CD);
      // console.log('EMD_CD 목록:', emdCodes);

      // 각 EMD_CD에 대해 polygon 가져오기
      const polygons: PolygonFeature[] = [];

      for (const emdCode of emdCodes) {
        const polygon = await getPolygonByEmdCode(emdCode);
        if (polygon) {
          polygons.push(polygon);
        }
      }
      return polygons;
    } catch (err) {
      console.error('Error in getPolygonsInBounds:', err);
      return [];
    }
  }, [getPolygonByEmdCode]);

  return { getPolygonByEmdCode, getPolygonsInBounds };
};