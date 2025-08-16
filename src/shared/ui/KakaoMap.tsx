import { Map } from 'react-kakao-maps-sdk'
import { useGeolocation } from '../hooks'

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }

const KakaoMap = () => {
  const { position, loading, error } = useGeolocation()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>위치 접근에 실패했습니다: {error}</div>
  }

  return (
    <Map
      center={position ?? DEFAULT_CENTER}
      style={{ width: '100%', height: '100%' }}
      className='flex-3'
      level={7}
    />
  )
}

export default KakaoMap
