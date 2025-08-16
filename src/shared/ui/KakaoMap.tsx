import { Map } from 'react-kakao-maps-sdk'

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = () => {
  return (
    <Map
      center={HWANGNIDANGIL}
      style={{ width: '100%', height: '100%' }}
      className='flex-3'
      level={7}
    />
  )
}

export default KakaoMap
