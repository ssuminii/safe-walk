import { KakaoMap, SideBar } from '@/shared/ui'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import type { RegionInfoType } from '@/shared/types/map'
import { getRegionInfo, searchRegionInfoByName, searchRegionInfosByCode } from './api/map'

const MapPage = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null)
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)
  const query = searchParams.get('q')
  const code = searchParams.get('code')

  const [accidentList, setAccidentList] = useState<RegionInfoType[]>([])

  const handleAccidentSelect = (accidentId: string) => {
    setSelectedAccidentId(accidentId)
  }

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

  // 검색 결과 조회
  useEffect(() => {
    const fetchRegion = async () => {
      if (code) {
        try {
          const result = await searchRegionInfosByCode(code)
          if (result) {
            const regionCode = result.code
            setSelectedRegionId(regionCode)
            setMapCenter({ lat: result.latitude, lng: result.longitude })
          }
        } catch (err) {
          console.error('코드 기반 검색 실패:', err)
          setSelectedRegionId(null)
        }
        return
      }

      if (query) {
        try {
          const result = await searchRegionInfoByName(query)
          if (result) {
            const region = result[0]
            const regionCode = region.code
            setSelectedRegionId(regionCode)
            setMapCenter({ lat: region.latitude, lng: region.longitude })
          }
        } catch (err) {
          console.error('이름 기반 검색 실패:', err)
          setSelectedRegionId(null)
        }
      }
    }

    fetchRegion()
  }, [location.search])

  const handleAccidentListChange = useCallback((list: RegionInfoType[]) => {
    setAccidentList(list)
  }, [])

  return (
    <div className='flex flex-1 h-[calc(100dvh-75px)]'>
      <SideBar
        accidentInfo={accidentInfo}
        selectedAccidentId={selectedAccidentId}
        onAccidentCardClick={handleAccidentSelect}
        accidentList={accidentList}
        selectedRegionId={selectedRegionId}
      />
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

export default MapPage
