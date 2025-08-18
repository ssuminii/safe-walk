import React, { useEffect } from 'react';
import { usePolygonLoader } from '../hooks/usePolygonLoader';

interface PolygonLoaderProps {
  initialLat?: number;
  initialLng?: number;
  onPolygonsLoaded?: (features: any[]) => void;
}

export const PolygonLoader: React.FC<PolygonLoaderProps> = ({
  initialLat = 36.5,
  initialLng = 127.5,
  onPolygonsLoaded
}) => {
  const {
    loading,
    error,
    currentRegion,
    cacheSize,
    loadRegionByCoords,
    regions
  } = usePolygonLoader();

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await loadRegionByCoords(initialLat, initialLng);
      if (data && onPolygonsLoaded) {
        onPolygonsLoaded(data.features);
      }
    };

    loadInitialData();
  }, [initialLat, initialLng, loadRegionByCoords, onPolygonsLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Polygon 데이터 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        에러: {error}
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <p>현재 지역: {currentRegion ? regions[currentRegion]?.name : '없음'}</p>
      <p>캐시된 지역: {cacheSize}개</p>
    </div>
  );
};