import React from 'react';
import { PolygonLoader } from './PolygonLoader';
import { usePolygonLoader } from '../hooks/usePolygonLoader';

const PolygonLoaderTest: React.FC = () => {
  const { getPolygonsInBounds, getPolygonByEmdCode } = usePolygonLoader();

  const handlePolygonsLoaded = (features: any[]) => {
    console.log(`${features.length}개 법정동 로드됨`);
  };

  const testBoundsQuery = async () => {
    // 경주 지역 조회
    const polygons = await getPolygonsInBounds(35.7, 129.0, 36.0, 129.4);
    console.log('경주 지역 Polygon:', polygons.length);
  };

  const testEmdQuery = async () => {
    // 특정 법정동 조회
    const polygon = await getPolygonByEmdCode('11110103');
    console.log('황남동 Polygon:', polygon);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SafeWalk Polygon Loader</h1>
      
      <PolygonLoader
        initialLat={35.8339}
        initialLng={129.2141}
        onPolygonsLoaded={handlePolygonsLoaded}
      />
      
      <div className="mt-4 space-x-2">
        <button 
          onClick={testBoundsQuery}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          경주 지역 조회 테스트
        </button>
        
        <button 
          onClick={testEmdQuery}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          궁정동 조회 테스트
        </button>
      </div>
    </div>
  );
};

export default PolygonLoaderTest;