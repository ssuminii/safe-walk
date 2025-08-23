import { Dropdown } from '@/shared/ui/Dropdown'
import Alert from '@/assets/alert.svg?react'
import { useMemo, useState } from 'react'
import { TouristSpotTable, type TouristSpot } from '@/shared/ui/TouristSpotTable'

export const provinces = [
  { value: 'seoul', label: '서울특별시' },
  { value: 'busan', label: '부산광역시' },
  { value: 'daegu', label: '대구광역시' },
  { value: 'incheon', label: '인천광역시' },
  { value: 'gwangju', label: '광주광역시' },
  { value: 'daejeon', label: '대전광역시' },
  { value: 'ulsan', label: '울산광역시' },
  { value: 'sejong', label: '세종특별자치시' },
  { value: 'gyeonggi', label: '경기도' },
  { value: 'gangwon', label: '강원특별자치도' },
  { value: 'chungbuk', label: '충청북도' },
  { value: 'chungnam', label: '충청남도' },
  { value: 'jeonbuk', label: '전북특별자치도' },
  { value: 'jeonnam', label: '전라남도' },
  { value: 'gyeongbuk', label: '경상북도' },
  { value: 'gyeongnam', label: '경상남도' },
  { value: 'jeju', label: '제주특별자치도' },
]

export const mockTouristData: TouristSpot[] = [
  { id: 1, rank: 1, name: '불국사', action: '더보기' },
  { id: 2, rank: 2, name: '석굴암', action: '더보기' },
  { id: 3, rank: 3, name: '동궁과 월지', action: '더보기' },
  { id: 4, rank: 4, name: '첨성대', action: '더보기' },
  { id: 5, rank: 5, name: '대릉원', action: '더보기' },
  { id: 6, rank: 6, name: '안압지', action: '더보기' },
  { id: 7, rank: 7, name: '황리단길', action: '더보기' },
  { id: 8, rank: 8, name: '국립경주박물관', action: '더보기' },
]

export default function TouristSideBar() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    console.log('선택된 지역:', value)
  }

  const filteredData = useMemo(() => {
    if (!selectedProvince) return []
    // 추후 api 호출 로직 추가
    return mockTouristData
  }, [selectedProvince])

  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px]'>
      <header className='flex flex-col gap-[7px]'>
        <h2 className='text-[14px] leading-[24px] font-semibold'>인기 관광지 현황</h2>
        <Dropdown
          options={provinces}
          value={selectedProvince}
          onChange={handleProvinceChange}
          placeholder='광역시/도'
        />
      </header>
      <div className='flex-1 mb-2'>
        {!selectedProvince ? (
          <div className='flex flex-col gap-3 justify-center items-center h-full border border-gray-7'>
            <Alert />
            <p className='r2 text-center'>
              출력할 데이터가 없습니다. <br />
              위치를 설정하여 확인해보세요.
            </p>
          </div>
        ) : (
          <TouristSpotTable data={filteredData} />
        )}
      </div>
    </div>
  )
}
