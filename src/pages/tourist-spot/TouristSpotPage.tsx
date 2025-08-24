import { KakaoMap, SideBar, TouristSideBar } from '@/shared/ui'
import { useState } from 'react'
import type { RegionInfoType } from '@/shared/types/map'
import type {
  PopularTouristSpots,
  TouristSpotAccident,
  TouristSpotLabels,
} from '@/shared/types/tourist-spot'
import { getTouristSpotAccidents } from '@/pages/tourist-spot/api/tourist-spot'

export default function TouristSpotPage() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [mapLevel, setMapLevel] = useState<number>(7)

  const handleTouristSpotSelect = (
    spot: PopularTouristSpots,
    accidentData: TouristSpotAccident
  ) => {
    setMapCenter({
      lat: spot.coordinate.latitude,
      lng: spot.coordinate.longitude,
    })
    setMapLevel(4)

    const accidents = accidentData.accidents || []

    // TouristSpotAccident -> RegionInfoType으로 변환
    const convertedAccidentInfo: RegionInfoType = {
      emd_CD: spot.id,
      name: spot.spot_name,
      totalAccident: accidentData.totalAccident || 0,
      accidents: Array.from(accidents).map((accident) => ({
        id: accident.id,
        location: accident.location,
        accidentCount: accident.accidentCount,
        casualties: accident.casualties,
        point: {
          lat: accident.point?.latitude || 0,
          lng: accident.point?.longitude || 0,
        },
      })),
    }

    setAccidentInfo(convertedAccidentInfo)
    setSelectedRegionId(spot.id)
  }

  const handleTouristSpotLabelClick = async (spot: TouristSpotLabels) => {
    setSelectedAccidentId(null)

    try {
      const accidentData = await getTouristSpotAccidents(spot.id)

      setMapCenter({
        lat: spot.Coordinate.latitude,
        lng: spot.Coordinate.longitude,
      })
      setMapLevel(4)

      const accidents = accidentData.accidents || []

      const convertedAccidentInfo: RegionInfoType = {
        emd_CD: spot.id,
        name: spot.spot_name,
        totalAccident: accidentData.totalAccident || 0,
        accidents: Array.from(accidents).map((accident) => ({
          id: accident.id,
          location: accident.location,
          accidentCount: accident.accidentCount,
          casualties: accident.casualties,
          point: {
            lat: accident.point?.latitude || 0,
            lng: accident.point?.longitude || 0,
          },
        })),
      }

      setAccidentInfo(convertedAccidentInfo)
      setSelectedRegionId(spot.id)
    } catch (error) {
      console.error('라벨 클릭 - 사고 데이터 조회 실패:', error)
    }
  }

  return (
    <div className='flex flex-1 h-[calc(100dvh-75px)]'>
      {accidentInfo ? (
        <SideBar
          accidentInfo={accidentInfo}
          selectedAccidentId={selectedAccidentId}
          onAccidentCardClick={setSelectedAccidentId}
          accidentList={[]}
        />
      ) : (
        <TouristSideBar onTouristSpotSelect={handleTouristSpotSelect} />
      )}
      <KakaoMap
        accidentInfo={accidentInfo}
        onSelectRegion={setSelectedRegionId}
        selectedAccidentId={selectedAccidentId}
        onSelectAccident={setSelectedAccidentId}
        searchMapCenter={mapCenter}
        searchedRegionId={selectedRegionId}
        overlayType='tourist'
        onTouristSpotSelect={handleTouristSpotLabelClick}
        searchMapLevel={mapLevel}
      />
    </div>
  )
}
