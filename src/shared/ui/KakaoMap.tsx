import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'
import type { mapRegionLabel } from '../types/map'
import { AccidentPin, AccidentSelectedPin, MapRegionLabel } from './'
import { useCallback, useState } from 'react'
import { regionAccidentInfo } from '../mocks'

interface KakaoMapProps {
  mapRegionLabels: mapRegionLabel[]
  onSelectRegion: (regionId: string | null) => void
  onSelectAccident: (accidentId: string | null) => void
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({ mapRegionLabels, onSelectRegion, onSelectAccident }: KakaoMapProps) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState(HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      const selectedRegion = mapRegionLabels.find((region) => region.id === regionId)

      if (selectedRegion) {
        setSelectedRegionId(regionId)
        setSelectedAccidentId(null)
        onSelectAccident(null)
        setMapCenter(selectedRegion.center)
        setMapLevel(3)
        onSelectRegion(regionId)
      }
    },
    [mapRegionLabels, onSelectRegion, onSelectAccident]
  )

  const handleAccidentPinClick = useCallback(
    (accidentId: string) => {
      setSelectedAccidentId(accidentId)
      onSelectAccident(accidentId)
    },
    [onSelectAccident]
  )

  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      const currentLevel = map.getLevel()
      setMapLevel(currentLevel)

      if (currentLevel >= 7 && selectedRegionId) {
        setSelectedRegionId(null)
        setSelectedAccidentId(null)
        onSelectRegion(null)
        onSelectAccident(null)
      }
    },
    [selectedRegionId, onSelectRegion, onSelectAccident]
  )

  const handleCenterChanged = useCallback((map: kakao.maps.Map) => {
    const center = map.getCenter()
    setMapCenter({
      lat: center.getLat(),
      lng: center.getLng(),
    })
  }, [])

  const selectedAccidentInfo =
    selectedRegionId === 'GJ-Hwangnam' ? regionAccidentInfo.accidents : []

  return (
    <Map
      center={mapCenter}
      style={{ width: '100%', height: '100%' }}
      className='flex-3'
      level={mapLevel}
      onZoomChanged={handleZoomChanged}
      onCenterChanged={handleCenterChanged}
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
        selectedAccidentInfo.map((accidentInfo) => (
          <CustomOverlayMap key={accidentInfo.id} position={accidentInfo.point}>
            {selectedAccidentId === accidentInfo.id ? (
              <AccidentSelectedPin accidentCount={accidentInfo.accidentCount} />
            ) : (
              <AccidentPin
                accidentCount={accidentInfo.accidentCount}
                onClick={() => handleAccidentPinClick(accidentInfo.id)}
              />
            )}
          </CustomOverlayMap>
        ))}
    </Map>
  )
}

export default KakaoMap
