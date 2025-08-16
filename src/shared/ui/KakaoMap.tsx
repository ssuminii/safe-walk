import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk'
import type { mapRegionLabel } from '../types/map'
import { MapRegionLabel } from './'
import { useCallback, useState } from 'react'
import { regionAccidentInfo } from '../mocks'

interface KakaoMapProps {
  mapRegionLabels: mapRegionLabel[]
  onSelectRegion: (regionId: string | null) => void
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({ mapRegionLabels, onSelectRegion }: KakaoMapProps) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState(HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      const selectedRegion = mapRegionLabels.find((region) => region.id === regionId)

      if (selectedRegion) {
        setSelectedRegionId(regionId)
        setMapCenter(selectedRegion.center)
        setMapLevel(3)
        onSelectRegion(regionId)
      }
    },
    [mapRegionLabels, onSelectRegion]
  )

  const handleMapClick = useCallback(() => {
    setSelectedRegionId(null)
    setMapCenter(HWANGNIDANGIL)
    setMapLevel(7)
    onSelectRegion(null)
  }, [onSelectRegion])

  const selectedAccidentInfo =
    selectedRegionId === 'GJ-Hwangnam' ? regionAccidentInfo.accidents : []

  return (
    <Map
      center={mapCenter}
      style={{ width: '100%', height: '100%' }}
      className='flex-3'
      level={mapLevel}
      onClick={handleMapClick}
    >
      {!selectedRegionId &&
        mapRegionLabels.map((regionLabel) => (
          <CustomOverlayMap
            key={regionLabel.id}
            position={regionLabel.center}
            yAnchor={1}
            zIndex={10 + regionLabel.level}
          >
            <MapRegionLabel
              mapRegionLabel={regionLabel}
              onSelect={() => handleRegionSelect(regionLabel.id)}
            />
          </CustomOverlayMap>
        ))}

      {selectedRegionId === 'GJ-Hwangnam' &&
        selectedAccidentInfo.map((accidentInfo) => {
          console.log(accidentInfo)
          return (
            <MapMarker
              key={accidentInfo.id}
              position={accidentInfo.point}
              image={{
                src: '/accident-pin.svg',
                size: { width: 60, height: 68 },
                options: { offset: { x: 24, y: 48 } },
              }}
            />
          )
        })}
    </Map>
  )
}

export default KakaoMap
