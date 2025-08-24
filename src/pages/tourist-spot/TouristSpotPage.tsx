import { KakaoMap, TouristSideBar } from '@/shared/ui'
import { useState } from 'react'
import type { RegionInfoType } from '@/shared/types/map'

export default function TouristSpotPage() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, _setAccidentInfo] = useState<RegionInfoType | null>(null)
  const [mapCenter, _setMapCenter] = useState<{ lat: number; lng: number } | null>(null)

  return (
    <div className='flex flex-1 h-[calc(100dvh-75px)]'>
      <TouristSideBar />
      <KakaoMap
        accidentInfo={accidentInfo}
        onSelectRegion={setSelectedRegionId}
        selectedAccidentId={selectedAccidentId}
        onSelectAccident={setSelectedAccidentId}
        searchMapCenter={mapCenter}
        searchedRegionId={selectedRegionId}
        overlayType='tourist'
      />
    </div>
  )
}
