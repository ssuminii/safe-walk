import { useCallback } from 'react'

interface UseMapEventHandlersProps {
  onSelectRegion: (regionId: string | null) => void
  onSelectAccident: (accidentId: string | null) => void
  setMapLevel: (level: number) => void
  setSelectedRegionId: (regionId: string | null) => void
  setMapCenter: (center: { lat: number; lng: number }) => void
  isSearchMove: boolean
  setIsSearchMove: (value: boolean) => void
  fetchRegionLabels: (map: kakao.maps.Map) => Promise<void>
  updateBoundsParams: (map: kakao.maps.Map) => void
}

export const useMapEventHandlers = ({
  onSelectRegion,
  onSelectAccident,
  setMapLevel,
  setSelectedRegionId,
  setMapCenter,
  isSearchMove,
  setIsSearchMove,
  fetchRegionLabels,
  updateBoundsParams,
}: UseMapEventHandlersProps) => {
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
      } else if (currentLevel < 5) {
        setSelectedRegionId(null)
      }
    },
    [onSelectRegion, onSelectAccident, setSelectedRegionId, setMapLevel]
  )

  // 지도 중심 좌표 업데이트
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
    [isSearchMove, setMapCenter, fetchRegionLabels, updateBoundsParams, setIsSearchMove]
  )

  return {
    handleRegionSelect,
    handleAccidentPinClick,
    handleZoomChanged,
    handleCenterChanged,
  }
}
