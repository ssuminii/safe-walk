import { KakaoMap, TouristSideBar } from '@/shared/ui'
import { useCallback, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import type { RegionInfoType } from '@/shared/types/map'

export default function TouristSpotPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)
  const query = searchParams.get('q')
  const code = searchParams.get('code')

  const [_accidentList, setAccidentList] = useState<RegionInfoType[]>([])

  const handleAccidentListChange = useCallback((list: RegionInfoType[]) => {
    setAccidentList(list)
  }, [])

  return (
    <div className='flex flex-1 h-[calc(100dvh-75px)]'>
      <TouristSideBar />
      <KakaoMap
        accidentInfo={accidentInfo}
        onSelectRegion={setSelectedRegionId}
        selectedAccidentId={selectedAccidentId}
        onSelectAccident={setSelectedAccidentId}
        searchMapCenter={mapCenter}
        onAccidentListChange={handleAccidentListChange}
        searchedRegionId={selectedRegionId}
      />
    </div>
  )
}
