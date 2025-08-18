import React, { useState } from 'react';

interface EmdData {
  name: string;
  totalAccident: number;
  EMD_CD: string;
  latitude: number;
  longitude: number;
}

interface ApiResponse extends Array<EmdData> {}

const EmdApiComponent: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmdData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://3.37.162.146/api/v1/emd?swLat=33.2&swLng=126.1&neLat=33.6&neLng=126.9' // 제주
        // 'ttps://3.37.162.146/api/v1/emd?swLat=35.8&swLng=129.1&neLat=35.9&neLng=129.3' //경주
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">국내 지역 법정동 조회</h1>
      
      <button 
        onClick={fetchEmdData}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? '로딩 중...' : '법정동 데이터 조회'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          에러: {error}
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-3">
            조회 결과 ({data.length}개)
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((emd, index) => (
            <div 
                key={`${emd.EMD_CD}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
                <h3 className="font-bold text-lg mb-2">{emd.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>법정동코드: {emd.EMD_CD}</p>
                  <p>총 사고건수: <span className="font-semibold text-red-600">{emd.totalAccident}</span></p>
                  <p>위도: {emd.latitude}</p>
                  <p>경도: {emd.longitude}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmdApiComponent;