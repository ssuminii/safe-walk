import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'
import type { RegionInfoType, RegionLabels, Accident } from '../types/map'
import { AccidentPin, AccidentSelectedPin, MapRegionLabel } from './'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getRegionLabels } from '../../pages/search-page/api/tourlistSpot'

interface KakaoMapProps {
  accidentInfo: RegionInfoType | null
  onSelectRegion: (regionId: string | null) => void
  selectedAccidentId: string | null
  onSelectAccident: (accidentId: string | null) => void
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({
  accidentInfo,
  onSelectRegion,
  selectedAccidentId,
  onSelectAccident,
}: KakaoMapProps) => {
  const [mapCenter, setMapCenter] = useState(HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)
  const [regionLabels, setRegionLabels] = useState<RegionLabels[]>([])
  const [targetAccident, setTargetAccident] = useState<Accident>()
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const hasInitializedMapRef = useRef(false)

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      onSelectRegion(regionId)
      console.log('regionId', regionId)
    },
    [onSelectRegion]
  )

  const handleAccidentPinClick = useCallback(
    (accidentId: string) => {
      onSelectAccident(accidentId)
    },
    [onSelectAccident]
  )

  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      const currentLevel = map.getLevel()
      setMapLevel(currentLevel)

      if (currentLevel >= 7) {
        onSelectRegion(null)
        onSelectAccident(null)
      }
    },
    [onSelectRegion, onSelectAccident]
  )

  const fetchRegionLabels = async (map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    try {
      const spots = await getRegionLabels({
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
      })
      setRegionLabels(spots)
    } catch (err) {
      console.error('지역 라벨 정보 불러오기 실패:', err)
    }
  }

  useEffect(() => {
    if (selectedAccidentId) {
      const targetAccidentId = accidentInfo?.accidents.find(
        (accident) => accident.id === selectedAccidentId
      )

      setTargetAccident(targetAccidentId)

      if (targetAccident) {
        setMapCenter(targetAccident.point)
        setMapLevel(3)
      }
    }
  }, [selectedAccidentId, targetAccident])

  const handleCenterChanged = useCallback((map: kakao.maps.Map) => {
    const center = map.getCenter()
    setMapCenter({
      lat: center.getLat(),
      lng: center.getLng(),
    })
  }, [])

  return (
    <Map
      ref={mapRef}
      center={mapCenter}
      style={{ width: '100%', height: '100%' }}
      className='flex-3'
      level={mapLevel}
      onZoomChanged={handleZoomChanged}
      onCenterChanged={handleCenterChanged}
      onCreate={(map) => {
        if (hasInitializedMapRef.current) return
        hasInitializedMapRef.current = true

        mapRef.current = map
        if (map.getLevel() === 7) {
          fetchRegionLabels(map)
        }
      }}
    >
      {!selectedAccidentId &&
        regionLabels.map((regionLabel) => (
          <CustomOverlayMap
            key={regionLabel.EMD_CD}
            position={{ lat: regionLabel.latitude, lng: regionLabel.longitude }}
            yAnchor={1}
          >
            <MapRegionLabel
              regionLabel={regionLabel.name}
              accidentCount={regionLabel.totalAccident}
              onSelect={() => handleRegionSelect(regionLabel.EMD_CD)}
            />
          </CustomOverlayMap>
        ))}

      {selectedAccidentId &&
        accidentInfo?.accidents.map((accident) => (
          <CustomOverlayMap key={accident.id} position={accident.point}>
            {selectedAccidentId === accident.id ? (
              <AccidentSelectedPin accidentCount={accident.accidentCount} />
            ) : (
              <AccidentPin
                accidentCount={accident.accidentCount}
                onClick={() => handleAccidentPinClick(accident.id)}
              />
            )}
          </CustomOverlayMap>
        ))}
    </Map>
  )
}

export default KakaoMap
