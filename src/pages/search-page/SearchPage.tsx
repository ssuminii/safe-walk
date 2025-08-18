import { KakaoMap, SideBar } from '../../shared/ui'
import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import type { RegionInfoType } from '../../shared/types/map'
import { getRegionInfo, searchRegionInfoByName } from './api/map'

const SearchPage = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)
  const query = searchParams.get('q')

  const handleAccidentSelect = (accidentId: string) => {
    setSelectedAccidentId(accidentId)
  }

  console.log('선택된 ID', selectedRegionId)
  console.log('지역 상세 사고 정보 개별 조회', selectedAccidentId)
  console.log('현재 쿼리:', query)

  // 법정동 상세 조회
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
        console.error('법정동 상세 정보 불러오기 실패:', err)
        setAccidentInfo(null)
      }
    }

    fetchRegionInfo()
  }, [selectedRegionId])

  // 단일 검색 조회
  useEffect(() => {
    const fetchRegionInfoByQuery = async () => {
      if (!query) return

      try {
        const result = await searchRegionInfoByName(query)
        if (result) {
          const region = result[0]
          setSelectedRegionId(region.code)
        }
      } catch (err) {
        console.error('단일 검색 실패:', err)
        setSelectedRegionId(null)
      }
    }

    fetchRegionInfoByQuery()
  }, [location.search])

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
