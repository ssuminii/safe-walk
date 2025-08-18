import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'
import type { Emd } from '../types/map'
import { MapRegionLabel } from './'
import { useCallback, useEffect, useRef, useState } from 'react'
import { regionAccidentInfo } from '../mocks'
import { getTouristSpots } from '../../pages/search-page/api/tourlistSpot'

interface KakaoMapProps {
  onSelectRegion: (regionId: string | null) => void
  selectedAccidentId: string | null
  onSelectAccident: (accidentId: string | null) => void
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({ onSelectRegion, selectedAccidentId, onSelectAccident }: KakaoMapProps) => {
  // const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState(HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)
  const [touristSpots, setTouristSpots] = useState<Emd[]>([])
  // const [hasFetchedTouristSpots, setHasFetchedTouristSpots] = useState(false)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const hasInitializedMapRef = useRef(false)

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      // setSelectedRegionId(regionId)
      onSelectRegion(regionId)
      console.log('regionId', regionId)
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

  const fetchTouristSpots = async (map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    try {
      const spots = await getTouristSpots({
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
      })
      setTouristSpots(spots)
      // setHasFetchedTouristSpots(true)
    } catch (err) {
      console.error('관광지 불러오기 실패:', err)
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
          fetchTouristSpots(map)
        }
      }}
    >
      {!selectedAccidentId &&
        touristSpots.map((touristSpot) => (
          <CustomOverlayMap
            key={touristSpot.EMD_CD}
            position={{ lat: touristSpot.latitude, lng: touristSpot.longitude }}
            yAnchor={1}
          >
            <MapRegionLabel
              regionLabel={touristSpot.name}
              accidentCount={touristSpot.totalAccident}
              onSelect={() => handleRegionSelect(touristSpot.EMD_CD)}
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
