import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'
import type { mapRegionLabel } from '../types/map'
import { MapRegionLabel } from './'

interface KakaoMapProps {
  mapRegionLabels: mapRegionLabel[]
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({ mapRegionLabels }: KakaoMapProps) => {
  return (
    <Map
      center={HWANGNIDANGIL}
      style={{ width: '100%', height: '100%' }}
      className='flex-3'
      level={7}
    >
      {mapRegionLabels.map((regionLabel) => (
        <CustomOverlayMap
          key={regionLabel.id}
          position={regionLabel.center}
          yAnchor={1}
          zIndex={10 + regionLabel.level}
        >
          <MapRegionLabel mapRegionLabel={regionLabel} />
        </CustomOverlayMap>
      ))}
    </Map>
  )
}

export default KakaoMap
