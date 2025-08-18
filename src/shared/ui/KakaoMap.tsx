import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'
import type { RegionLabels } from '../types/map'
import { MapRegionLabel } from './'
import { useCallback, useEffect, useRef, useState } from 'react'
import { regionAccidentInfo } from '../mocks'
import { getRegionLabels } from '../../pages/search-page/api/tourlistSpot'

interface KakaoMapProps {
  onSelectRegion: (regionId: string | null) => void
  selectedAccidentId: string | null
  onSelectAccident: (accidentId: string | null) => void
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({ onSelectRegion, selectedAccidentId }: KakaoMapProps) => {
  // const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState(HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)
  const [regionLabels, setRegionLabels] = useState<RegionLabels[]>([])
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const hasInitializedMapRef = useRef(false)

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      // setSelectedRegionId(regionId)
      onSelectRegion(regionId)
      console.log('regionId', regionId)
      console.log()
    },
    [onSelectRegion]
  )

  // const handleAccidentPinClick = useCallback(
  //   (accidentId: string) => {
  //     onSelectAccident(accidentId)
  //   },
  //   [onSelectAccident]
  // )

  // const handleZoomChanged = useCallback(
  //   (map: kakao.maps.Map) => {
  //     const currentLevel = map.getLevel()
  //     setMapLevel(currentLevel)

  //     if (currentLevel >= 7 && selectedRegionId) {
  //       setSelectedRegionId(null)
  //       onSelectRegion(null)
  //       onSelectAccident(null)
  //     }

  //     if (currentLevel === 7 && !hasFetchedTouristSpots) {
  //       fetchTouristSpots(map)
  //     }
  //   },
  //   [selectedRegionId, onSelectRegion, onSelectAccident, hasFetchedTouristSpots]
  // )

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
      const accidentInfo = regionAccidentInfo.accidents.find(
        (accident) => accident.id === selectedAccidentId
      )
      if (accidentInfo) {
        setMapCenter(accidentInfo.point)
        setMapLevel(3)
      }
    }
  }, [selectedAccidentId])

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
      // onZoomChanged={handleZoomChanged}
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

      {/* {selectedAccidentId &&
        touristSpots.map((accidentInfo) => (
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
        ))} */}
    </Map>
  )
}

export default KakaoMap
