import { useState, useRef } from 'react'

const HWANGNIDANGIL = { lat: 35.841442, lng: 129.216828 }

export const useMapState = (searchMapCenter: { lat: number; lng: number } | null) => {
  const [mapCenter, setMapCenter] = useState(searchMapCenter ?? HWANGNIDANGIL)
  const [mapLevel, setMapLevel] = useState(7)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [isSearchMove, setIsSearchMove] = useState(false)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const hasInitializedMapRef = useRef(false)

  return {
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
    HWANGNIDANGIL,
  }
}
