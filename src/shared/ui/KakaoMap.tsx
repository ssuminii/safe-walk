import { Map } from 'react-kakao-maps-sdk'
import type { RegionInfoType } from '../types/map'
import { MapOverlays, RegionPolygon } from './'
import { useEffect } from 'react'
import {
  useAccidentData,
  useGeolocation,
  useMapBounds,
  useMapEventHandlers,
  useMapState,
  useRegionLabels,
} from '../hooks'
import type { PolygonFeature } from '../types/polygon'
import { usePolygonLoaderQuery } from '../hooks/query'

interface KakaoMapProps {
  accidentInfo: RegionInfoType | null
  onSelectRegion: (regionId: string | null) => void
  selectedAccidentId: string | null
  onSelectAccident: (accidentId: string | null) => void
  searchMapCenter: { lat: number; lng: number } | null
  onAccidentListChange: (list: RegionInfoType[]) => void
  searchedRegionId?: string | null
  useCurrentLocation?: boolean
}

const KakaoMap = ({
  accidentInfo,
  onSelectRegion,
  selectedAccidentId,
  onSelectAccident,
  searchMapCenter,
  onAccidentListChange,
  searchedRegionId,
  useCurrentLocation = true,
}: KakaoMapProps) => {
  const {
    mapCenter,
    setMapCenter,
    mapLevel,
    setMapLevel,
    selectedRegionId,
    setSelectedRegionId,
    isSearchMove,
    setIsSearchMove,
    mapRef,
    hasInitializedMapRef,
  } = useMapState(searchMapCenter)

  const { boundsParams, updateBoundsParams } = useMapBounds()
  const { regionLabels, fetchRegionLabels } = useRegionLabels()
  const { accidentList } = useAccidentData(boundsParams, mapLevel, onAccidentListChange)
  const { position: currentPosition, error: locationError } = useGeolocation()

  const { data: allPolygons = [] } = usePolygonLoaderQuery(
    boundsParams ?? { swLat: 0, swLng: 0, neLat: 0, neLng: 0 }
  )

  const { handleRegionSelect, handleAccidentPinClick, handleZoomChanged, handleCenterChanged } =
    useMapEventHandlers({
      onSelectRegion,
      onSelectAccident,
      setMapLevel,
      setSelectedRegionId,
      setMapCenter,
      isSearchMove,
      setIsSearchMove,
      fetchRegionLabels,
      updateBoundsParams,
    })

  // 선택된 지역 영역
  const selectedPolygons = selectedRegionId
    ? allPolygons.filter(
        (polygon) =>
          polygon.properties?.EMD_CD === selectedRegionId || polygon.id === selectedRegionId
      )
    : []

  useEffect(() => {
    if (searchMapCenter) {
      setMapCenter(searchMapCenter)
    } else if (useCurrentLocation && currentPosition && !locationError) {
      setMapCenter(currentPosition)
    } else {
      setMapCenter({ lat: 35.841442, lng: 129.216828 }) // HWANGNIDANGIL
    }
  }, [searchMapCenter, currentPosition, locationError, useCurrentLocation, setMapCenter])

  // 지도가 생성된 후 현재 위치로 이동했을 때 지역 라벨 데이터 로드
  useEffect(() => {
    if (
      mapRef.current &&
      useCurrentLocation &&
      currentPosition &&
      !locationError &&
      !searchMapCenter
    ) {
      const map = mapRef.current
      const targetLatLng = new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng)

      map.setCenter(targetLatLng)

      setTimeout(() => {
        if (mapRef.current) {
          fetchRegionLabels(mapRef.current)
          updateBoundsParams(mapRef.current)
        }
      }, 200)
    }
  }, [
    currentPosition,
    mapRef.current,
    useCurrentLocation,
    locationError,
    searchMapCenter,
    fetchRegionLabels,
    updateBoundsParams,
  ])

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
  }, [
    searchMapCenter,
    searchedRegionId,
    setSelectedRegionId,
    fetchRegionLabels,
    updateBoundsParams,
    setMapCenter,
  ])

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
  }, [
    selectedAccidentId,
    accidentInfo,
    accidentList,
    setMapCenter,
    setMapLevel,
    setSelectedRegionId,
  ])

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
      {selectedPolygons.map((polygon: PolygonFeature) =>
        mapRef.current ? (
          <RegionPolygon key={polygon.id} polygon={polygon} map={mapRef.current} />
        ) : null
      )}

      <MapOverlays
        selectedAccidentId={selectedAccidentId}
        mapLevel={mapLevel}
        regionLabels={regionLabels}
        selectedRegionId={selectedRegionId}
        accidentList={accidentList}
        accidentInfo={accidentInfo}
        onRegionSelect={handleRegionSelect}
        onAccidentPinClick={handleAccidentPinClick}
      />
    </Map>
  )
}

export default KakaoMap
