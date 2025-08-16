import { KakaoMap, SideBar } from '../../shared/ui'
import { mapRegionLabels } from '../../shared/mocks'
import { useState } from 'react'

const SearchPage = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)

  return (
    <div className='flex flex-1'>
      <SideBar selectedRegionId={selectedRegionId} selectedAccidentId={selectedAccidentId} />
      <KakaoMap
        mapRegionLabels={mapRegionLabels}
        onSelectRegion={setSelectedRegionId}
        onSelectAccident={setSelectedAccidentId}
      />
    </div>
  )
}

export default SearchPage
