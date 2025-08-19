import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'
import type { RegionInfoType, RegionLabels } from '../types/map'
import { AccidentPin, AccidentSelectedPin, MapRegionLabel, RegionPolygon } from './'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getRegionLabels } from '../../pages/search-page/api/map'
import { usePolygonLoaderQuery, useRegionAccidentListQuery } from '../hooks/query'

interface KakaoMapProps {
  accidentInfo: RegionInfoType | null
  onSelectRegion: (regionId: string | null) => void
  selectedAccidentId: string | null
  onSelectAccident: (accidentId: string | null) => void
  searchMapCenter: { lat: number; lng: number } | null
  onAccidentListChange: (list: RegionInfoType[]) => void
  searchedRegionId?: string | null
}

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

const KakaoMap = ({
  accidentInfo,
  onSelectRegion,
  selectedAccidentId,
  onSelectAccident,
  searchMapCenter,
  onAccidentListChange,
  searchedRegionId,
}: KakaoMapProps) => {
  const [mapCenter, setMapCenter] = useState(searchMapCenter ?? HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)
  const [regionLabels, setRegionLabels] = useState<RegionLabels[]>([])
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const [isSearchMove, setIsSearchMove] = useState(false)
  const hasInitializedMapRef = useRef(false)

  const [accidentList, setAccidentList] = useState<RegionInfoType[]>([])

  const [boundsParams, setBoundsParams] = useState<{
    swLat: number
    swLng: number
    neLat: number
    neLng: number
  } | null>(null)

  const { data: allPolygons = [] } = usePolygonLoaderQuery(
    boundsParams ?? {
      swLat: 0,
      swLng: 0,
      neLat: 0,
      neLng: 0,
    }
  )

  const { data: regionAccidentList = [] } = useRegionAccidentListQuery(
    boundsParams ?? {
      swLat: 0,
      swLng: 0,
      neLat: 0,
      neLng: 0,
    }
  )

  // 선택된 지역 영역
  const selectedPolygons = selectedRegionId
    ? allPolygons.filter(
        (polygon) =>
          polygon.properties?.EMD_CD === selectedRegionId || polygon.id === selectedRegionId
      )
    : []

  // 지역 라벨 선택
  const handleRegionSelect = useCallback(
    async (regionId: string) => {
      setSelectedRegionId(regionId)
      onSelectRegion(regionId)
    },
    [onSelectRegion, setSelectedRegionId]
  )

  // 사고 핀 클릭
  const handleAccidentPinClick = useCallback(
    (accidentId: string) => {
      onSelectAccident(accidentId)
    },
    [onSelectAccident]
  )

  // 지도 확대 및 축소
  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      const currentLevel = map.getLevel()
      setMapLevel(currentLevel)

      if (currentLevel >= 5) {
        onSelectRegion(null)
        onSelectAccident(null)
      }
    },
    [onSelectRegion, onSelectAccident]
  )

  // 사고 데이터 업데이트
  useEffect(() => {
    if (mapLevel < 5 && regionAccidentList.length > 0) {
      setAccidentList(regionAccidentList)
      onAccidentListChange(regionAccidentList)
    } else {
      setAccidentList([])
      onAccidentListChange([])
    }
  }, [regionAccidentList, mapLevel])

  // 검색 결과 위치로 지도 중심 이동
  useEffect(() => {
    if (!searchMapCenter || !mapRef.current) return

    const map = mapRef.current
    const targetLatLng = new kakao.maps.LatLng(searchMapCenter.lat, searchMapCenter.lng)

    map.setCenter(targetLatLng)
    map.setLevel(7)

    setSelectedRegionId(searchedRegionId ?? '')

    fetchRegionLabels(map)
    updateBoundsParams(map)

    setMapCenter(searchMapCenter)
  }, [searchMapCenter])

  // 지도 화면 영역 법정동 전체 조회
  const fetchRegionLabels = async (map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    try {
      const spots = await getRegionLabels({
        swLat: parseFloat(sw.getLat().toFixed(4)),
        swLng: parseFloat(sw.getLng().toFixed(4)),
        neLat: parseFloat(ne.getLat().toFixed(4)),
        neLng: parseFloat(ne.getLng().toFixed(4)),
      })
      setRegionLabels(spots)
    } catch (err) {
      console.error('지역 라벨 정보 불러오기 실패:', err)
    }
  }

  // polygon
  const updateBoundsParams = (map: kakao.maps.Map) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    setBoundsParams({
      swLat: parseFloat(sw.getLat().toFixed(4)),
      swLng: parseFloat(sw.getLng().toFixed(4)),
      neLat: parseFloat(ne.getLat().toFixed(4)),
      neLng: parseFloat(ne.getLng().toFixed(4)),
    })
  }

  // 사이드바에서 선택된 사고와 일치되는 위치 설정
  useEffect(() => {
    if (!selectedAccidentId) return

    let accident = null

    if (accidentInfo) {
      accident = accidentInfo.accidents.find((a) => a.id === selectedAccidentId)
    }

    if (!accident && accidentList.length > 0) {
      for (const region of accidentList) {
        accident = region.accidents?.find((a) => a.id === selectedAccidentId)
        if (accident) break
      }
    }

    if (accident) {
      setMapCenter(accident.point)
      setMapLevel(4)
      setSelectedRegionId(null)
    }
  }, [selectedAccidentId, accidentInfo, accidentList])

  const handleCenterChanged = useCallback(
    (map: kakao.maps.Map) => {
      const center = map.getCenter()
      setMapCenter({
        lat: center.getLat(),
        lng: center.getLng(),
      })

      if (isSearchMove) {
        fetchRegionLabels(map)
        updateBoundsParams(map)
        setIsSearchMove(false)
      }
    },
    [isSearchMove]
  )

  return (
    <Map
      ref={mapRef}
      center={mapCenter}
      style={{ width: '100%', height: 'calc(100dvh - 75px)' }}
      className='flex-3'
      level={mapLevel}
      onBoundsChanged={handleZoomChanged}
      onCenterChanged={handleCenterChanged}
      onCreate={(map) => {
        if (hasInitializedMapRef.current) return
        hasInitializedMapRef.current = true

        mapRef.current = map
        if (map.getLevel() >= 6) {
          fetchRegionLabels(map)
          updateBoundsParams(map)
        }
      }}
    >
      {selectedPolygons.map((polygon) =>
        mapRef.current ? (
          <RegionPolygon key={polygon.id} polygon={polygon} map={mapRef.current} />
        ) : null
      )}

      {!selectedAccidentId &&
        mapLevel >= 5 &&
        regionLabels.length > 0 &&
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

      {mapLevel < 5 &&
        accidentList?.flatMap(
          (region) =>
            region.accidents?.map((accident) => (
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
            )) ?? []
        )}

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
