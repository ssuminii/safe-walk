import { useState, useEffect, useCallback } from 'react';
import type { PolygonCollection, PolygonFeature, RegionBounds } from '../types/polygon';
import { REGIONS, DEFAULT_CENTER } from '../constants/regions';

export const usePolygonLoader = () => {
  const [cache, setCache] = useState<Map<string, PolygonCollection>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const BASE_URL = 'https://yunrry.github.io/safewalk-polygon-data';

  // 좌표로 지역 결정
  const determineRegionByCoords = useCallback((lat: number, lng: number): string => {
    for (const [regionKey, region] of Object.entries(REGIONS)) {
      const { bounds } = region;
      if (lat >= bounds.minLat && lat <= bounds.maxLat && 
          lng >= bounds.minLng && lng <= bounds.maxLng) {
        return regionKey;
      }
    }
    return 'gyeongbuk'; // 기본값
  }, []);

  // 지역 데이터 로드
  const loadRegionData = useCallback(async (regionKey: string): Promise<PolygonCollection | null> => {
    if (cache.has(regionKey)) {
      return cache.get(regionKey)!;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/regions/${regionKey}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${regionKey} data: ${response.statusText}`);
      }
      
      const data: PolygonCollection = await response.json();
      
      // 캐시에 저장 (최대 3개 지역만 보관)
      setCache(prev => {
        const newCache = new Map(prev);
        if (newCache.size >= 3) {
            const firstKey = newCache.keys().next().value!;
            newCache.delete(firstKey);
          }
        newCache.set(regionKey, data);
        return newCache;
      });
      
      setCurrentRegion(regionKey);
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load polygon data';
      setError(errorMessage);
      console.error('Polygon loading error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // 초기 로드 (기본 중심좌표 기준)
  useEffect(() => {
    const initialRegion = determineRegionByCoords(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
    loadRegionData(initialRegion);
  }, [determineRegionByCoords, loadRegionData]);

  // 좌표 변경 시 지역 자동 로드
  const loadRegionByCoords = useCallback(async (lat: number, lng: number): Promise<PolygonCollection | null> => {
    const region = determineRegionByCoords(lat, lng);
    return await loadRegionData(region);
  }, [determineRegionByCoords, loadRegionData]);

  // EMD_CD로 특정 polygon 찾기
  const getPolygonByEmdCode = useCallback(async (emdCode: string): Promise<PolygonFeature | null> => {
    const regionCode = emdCode.substring(0, 2);
    const regionKey = Object.keys(REGIONS).find(key => REGIONS[key].code === regionCode);
    
    if (!regionKey) {
      setError(`Unknown region code: ${regionCode}`);
      return null;
    }

    const regionData = await loadRegionData(regionKey);
    if (!regionData) return null;

    return regionData.features.find(
      feature => feature.properties.EMD_CD === emdCode
    ) || null;
  }, [loadRegionData]);

  // 경계 내 polygon들 가져오기
  const getPolygonsInBounds = useCallback(async (
    swLat: number, swLng: number, 
    neLat: number, neLng: number
  ): Promise<PolygonFeature[]> => {
    try {
      // 1. API에서 해당 범위 내 법정동 정보 가져오기
      const apiResponse = await fetch(
        `https://3.37.162.146/api/v1/emd?swLat=${swLat}&swLng=${swLng}&neLat=${neLat}&neLng=${neLng}`
      );
      
      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }
      
      const emdList = await apiResponse.json();
      console.log('API 응답:', emdList);
      
      if (!Array.isArray(emdList) || emdList.length === 0) {
        return [];
      }
      
      // 2. EMD_CD 목록 추출
      const emdCodes = emdList.map(emd => emd.EMD_CD);
      console.log('EMD_CD 목록:', emdCodes);
      
      // 3. 각 EMD_CD에 대해 polygon 데이터 가져오기
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
      setError(err instanceof Error ? err.message : 'Failed to get polygons');
      return [];
    }
  }, [getPolygonByEmdCode]);

  // 캐시 정리
  const clearCache = useCallback(() => {
    setCache(new Map());
    setCurrentRegion(null);
  }, []);

  return {
    // 상태
    loading,
    error,
    currentRegion,
    cacheSize: cache.size,
    
    // 메서드
    loadRegionData,
    loadRegionByCoords,
    getPolygonByEmdCode,
    getPolygonsInBounds,
    determineRegionByCoords,
    clearCache,
    
    // 유틸리티
    regions: REGIONS,
    defaultCenter: DEFAULT_CENTER
  };
};