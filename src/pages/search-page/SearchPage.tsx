import { KakaoMap, SideBar } from '../../shared/ui'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const query = searchParams.get('q')

  const handleAccidentSelect = (accidentId: string) => {
    setSelectedAccidentId(accidentId)
  }

  console.log('선택된 ID', selectedRegionId)

  return (
    <div className='flex flex-1'>
      <SideBar
        selectedRegionId={selectedRegionId}
        selectedAccidentId={selectedAccidentId}
        onAccidentCardClick={handleAccidentSelect}
        search={query ?? ''}
      />
      <KakaoMap
        onSelectRegion={setSelectedRegionId}
        selectedAccidentId={selectedAccidentId}
        onSelectAccident={setSelectedAccidentId}
      />
    </div>
  )
}

export default SearchPage
