import { KakaoMap, SideBar } from '../../shared/ui'
import { useEffect, useState } from 'react'
// import { useSearchParams } from 'react-router-dom'
import type { RegionInfoType } from '../../shared/types/map'
import { getRegionInfo } from './api/tourlistSpot'

const SearchPage = () => {
  // const [searchParams] = useSearchParams()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)
  // const query = searchParams.get('q')

  const handleAccidentSelect = (accidentId: string) => {
    setSelectedAccidentId(accidentId)
  }

  console.log('선택된 ID', selectedRegionId)
  console.log('지역 상세 사고 정보 개별 조회', selectedAccidentId)

  useEffect(() => {
    const fetchRegionInfo = async () => {
      if (!selectedRegionId) {
        setAccidentInfo(null)
        return
      }

      try {
        const data = await getRegionInfo({ regionId: selectedRegionId })
        setAccidentInfo(data)
      } catch (err) {
        console.error('지역 라벨 정보 불러오기 실패:', err)
        setAccidentInfo(null)
      }
    }

    fetchRegionInfo()
  }, [selectedRegionId])

  return (
    <div className='flex flex-1'>
      <SideBar
        accidentInfo={accidentInfo}
        selectedAccidentId={selectedAccidentId}
        onAccidentCardClick={handleAccidentSelect}
      />
      <KakaoMap
        accidentInfo={accidentInfo}
        onSelectRegion={setSelectedRegionId}
        selectedAccidentId={selectedAccidentId}
        onSelectAccident={setSelectedAccidentId}
      />
    </div>
  )
}

export default SearchPage
