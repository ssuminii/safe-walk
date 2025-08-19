import React, { useState } from 'react';

interface PolygonFeature {
  id: string;
  type: "Feature";
  properties: {
    EMD_CD: string;
    EMD_ENG_NM: string;
    EMD_KOR_NM: string;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

const SimplePolygonTest: React.FC = () => {
  const [polygon, setPolygon] = useState<PolygonFeature | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testPolygonLoad = async () => {
    setLoading(true);
    setError(null);
    setPolygon(null);
    
    try {
      // 서울 지역 데이터 로드
      const response = await fetch(
        'https://yunrry.github.io/safewalk-polygon-data/regions/seoul.json'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('전체 데이터:', data);
      
      // 첫 번째 polygon 추출
      if (data.features && data.features.length > 0) {
        const firstPolygon = data.features[0];
        setPolygon(firstPolygon);
        console.log('첫 번째 Polygon:', firstPolygon);
      } else {
        throw new Error('Polygon 데이터가 없습니다');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Polygon 데이터 테스트</h1>
      
      <button 
        onClick={testPolygonLoad}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? '로딩 중...' : '서울 Polygon 데이터 로드'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>에러:</strong> {error}
        </div>
      )}

      {polygon && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Polygon 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-bold text-sm text-gray-600 mb-1">기본 정보</h3>
              <p><strong>ID:</strong> {polygon.id}</p>
              <p><strong>법정동코드:</strong> {polygon.properties.EMD_CD}</p>
              <p><strong>한글명:</strong> {polygon.properties.EMD_KOR_NM}</p>
              <p><strong>영문명:</strong> {polygon.properties.EMD_ENG_NM}</p>
            </div>
            
            <div>
              <h3 className="font-bold text-sm text-gray-600 mb-1">지오메트리 정보</h3>
              <p><strong>타입:</strong> {polygon.geometry.type}</p>
              <p><strong>좌표 개수:</strong> {polygon.geometry.coordinates[0]?.length || 0}개</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-bold text-sm text-gray-600 mb-2">좌표 미리보기 (처음 5개)</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
              {polygon.geometry.coordinates[0]?.slice(0, 5).map((coord, index) => (
                <div key={index}>
                  [{coord[0].toFixed(6)}, {coord[1].toFixed(6)}]
                </div>
              ))}
              {polygon.geometry.coordinates[0]?.length > 5 && (
                <div className="text-gray-500">... 총 {polygon.geometry.coordinates[0].length}개 좌표</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-bold text-sm text-gray-600 mb-2">전체 JSON 데이터</h3>
            <details className="bg-gray-100 p-3 rounded">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                JSON 데이터 보기/숨기기
              </summary>
              <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(polygon, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">테스트 정보</h3>
        <p className="text-sm text-gray-600">
          이 컴포넌트는 GitHub Pages에 배포된 polygon 데이터를 테스트합니다.<br/>
          URL: https://yunrry.github.io/safewalk-polygon-data/regions/seoul.json
        </p>
      </div>
    </div>
  );
};

export default SimplePolygonTest;