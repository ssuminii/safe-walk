import { useState } from 'react'
import EmdApiComponent from '../../shared/components/EmdApiComponent'
import SimplePolygonTest from '../../shared/components/SimplePolygonTest'
import PolygonLoaderTest from '../../shared/components/PolygonLoaderTest'

interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers: string
  body: string
  useProxy?: boolean // EmdApiComponent에서 사용할 수 있도록 추가
}

interface ApiResponse {
  status: number
  statusText: string
  data: any
  headers: any
}

const ApiTestPage = () => {
  const [request, setRequest] = useState<ApiRequest>({
    method: 'GET',
    url: '',
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  \n}'
  })
  
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!request.url.trim()) {
      setError('URL을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // EmdApiComponent와 동일한 방식으로 단순화
      if (request.url === 'https://3.37.162.146/api/v1/emd?swLat=33.2&swLng=126.1&neLat=33.6&neLng=126.9') {
        // EMD API의 경우 EmdApiComponent와 동일한 방식 사용
        const res = await fetch(request.url)
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        
        setResponse({
          status: res.status,
          statusText: res.statusText,
          data,
          headers: Object.fromEntries(res.headers.entries())
        })
        return
      }

      // 기존 로직 (다른 API들을 위한)
      let headers: any = {}
      if (request.headers.trim()) {
        try {
          headers = JSON.parse(request.headers)
        } catch {
          setError('Headers JSON 형식이 올바르지 않습니다.')
          setLoading(false)
          return
        }
      }

      let url = request.url
      
      // CORS 우회를 위한 프록시 사용
      if (request.useProxy) {
        url = `https://cors-anywhere.herokuapp.com/${request.url}`
        headers['X-Requested-With'] = 'XMLHttpRequest'
      }

      const options: RequestInit = {
        method: request.method,
        headers,
        mode: 'cors',
      }

      if (request.method !== 'GET' && request.body.trim()) {
        try {
          JSON.parse(request.body) // JSON 유효성 검사
          options.body = request.body
        } catch {
          setError('Body JSON 형식이 올바르지 않습니다.')
          setLoading(false)
          return
        }
      }

      const res = await fetch(url, options)
      
      let data = null
      const contentType = res.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        headers: Object.fromEntries(res.headers.entries())
      })
    } catch (err) {
      console.error('API 요청 에러:', err)
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('CORS 에러가 발생했습니다. "CORS 우회 사용" 옵션을 체크해보세요. 또는 서버에서 CORS 설정이 필요합니다.')
      } else {
        setError(err instanceof Error ? err.message : '요청 중 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex-1 p-6 bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>API 테스트</h1>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Request Section */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-semibold mb-4'>요청 (Request)</h2>
            
            <div className='space-y-4'>
              {/* Method & URL */}
              <div className='flex gap-2'>
                <select
                  value={request.method}
                  onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value as any }))}
                  className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='GET'>GET</option>
                  <option value='POST'>POST</option>
                  <option value='PUT'>PUT</option>
                  <option value='DELETE'>DELETE</option>
                </select>
                <input
                  type='text'
                  placeholder='https://api.example.com/endpoint'
                  value={request.url}
                  onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Headers */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Headers (JSON)
                </label>
                <textarea
                  value={request.headers}
                  onChange={(e) => setRequest(prev => ({ ...prev, headers: e.target.value }))}
                  className='w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm'
                  placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
                />
              </div>

              {/* Body */}
              {request.method !== 'GET' && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Body (JSON)
                  </label>
                  <textarea
                    value={request.body}
                    onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                    className='w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm'
                    placeholder='{\n  "key": "value"\n}'
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors'
              >
                {loading ? '요청 중...' : '요청 보내기'}
              </button>

              {/* Error */}
              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-red-600 text-sm'>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Response Section */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-semibold mb-4'>응답 (Response)</h2>
            
            {response ? (
              <div className='space-y-4'>
                {/* Status */}
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-gray-700'>Status:</span>
                  <span 
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      response.status >= 200 && response.status < 300 
                        ? 'bg-green-100 text-green-800' 
                        : response.status >= 400 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {response.status} {response.statusText}
                  </span>
                </div>

                {/* Response Headers */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Response Headers
                  </label>
                  <textarea
                    value={JSON.stringify(response.headers, null, 2)}
                    readOnly
                    className='w-full h-24 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm'
                  />
                </div>

                {/* Response Body */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Response Body
                  </label>
                  <textarea
                    value={response.data ? JSON.stringify(response.data, null, 2) : 'No response body'}
                    readOnly
                    className='w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm'
                  />
                </div>
              </div>
            ) : (
              <div className='text-center text-gray-500 py-12'>
                요청을 보내면 응답이 여기에 표시됩니다.
              </div>
            )}
          </div>
        </div>
      </div>

      <EmdApiComponent />
      <SimplePolygonTest />
      <PolygonLoaderTest />
    </div>
  )
}

export default ApiTestPage