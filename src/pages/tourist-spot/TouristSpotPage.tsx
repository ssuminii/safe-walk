import { KakaoMap, SideBar, TouristSideBar } from '@/shared/ui'
import { useState } from 'react'
import type { RegionInfoType } from '@/shared/types/map'
import type { PopularTouristSpots, TouristSpotAccident, TouristSpotLabels } from '@/shared/types/tourist-spot'

export default function TouristSpotPage() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)

  const handleTouristSpotSelect = (
    spot: PopularTouristSpots,
    accidentData: TouristSpotAccident
  ) => {
    console.log('받은 관광지 데이터:', spot)
    console.log('받은 사고 데이터:', accidentData)

    setMapCenter({
      lat: spot.coordinate.latitude,
      lng: spot.coordinate.longitude,
    })

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

    console.log('convertedAccidentInfo', convertedAccidentInfo)
  }

  const handleTouristSpotLabelClick = (spot: TouristSpotLabels) => {
    console.log('관광지 라벨 클릭됨!')
    console.log('관광지 전체 데이터:', spot)
    console.log('관광지 ID:', spot.id)
    console.log('관광지 이름:', spot.spot_name)
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
      />
    </div>
  )
}
