import { KakaoMap, SideBar, TouristSideBar } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { RegionInfoType } from '@/shared/types/map'
import type {
  PopularTouristSpots,
  SearchTouristSpotResponse,
  TouristSpotAccident,
  TouristSpotLabels,
} from '@/shared/types/tourist-spot'
import { getTouristSpotAccidents, searchTouristSpotRealTime } from '@/pages/tourist-spot/api/tourist-spot'

export default function TouristSpotPage() {
  const [searchParams] = useSearchParams()
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

  // URL 검색 파라미터 처리
  useEffect(() => {
    const spotId = searchParams.get('spotId')
    const query = searchParams.get('q')
    
    if (spotId && query) {
      // spotId가 있으면 먼저 관광지 정보를 검색으로 찾아서 좌표를 얻고, 사고 데이터 조회
      const handleSearchedSpot = async () => {
        try {
          // 검색으로 관광지 정보 가져오기 (좌표 정보 포함)
          const searchResults = await searchTouristSpotRealTime(query)
          const foundSpot = searchResults.find(spot => spot.spotId === spotId)
          
          if (foundSpot) {
            // 지도 중심 설정 (검색 결과의 좌표 사용)
            setMapCenter({
              lat: foundSpot.Coordinate.latitude,
              lng: foundSpot.Coordinate.longitude,
            })
            setMapLevel(4)
          }
          
          // 사고 데이터 조회
          const accidentData = await getTouristSpotAccidents(spotId)
          
          const convertedAccidentInfo: RegionInfoType = {
            emd_CD: spotId,
            name: foundSpot?.spot_name || query,
            totalAccident: accidentData.totalAccident || 0,
            accidents: Array.from(accidentData.accidents || []).map((accident) => ({
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
          setSelectedRegionId(spotId)
        } catch (error) {
          console.error('검색된 관광지 데이터 조회 실패:', error)
        }
      }
      
      handleSearchedSpot()
    }
  }, [searchParams])

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
