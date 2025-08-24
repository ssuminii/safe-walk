import { Dropdown } from '@/shared/ui/Dropdown'
import Alert from '@/assets/alert.svg?react'
import { useEffect, useState } from 'react'
import { TouristSpotTable } from '@/shared/ui/TouristSpotTable'
import { PROVINCES } from '@/shared/constants/provinces'
import { getState } from '@/pages/tourist-spot/api/tourist-spot'
import type { PopularTouristSpots } from '@/shared/types/tourist-spot'

export default function TouristSideBar() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [touristData, setTouristData] = useState<PopularTouristSpots[]>([])

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    console.log('선택된 지역:', value)
  }

  useEffect(() => {
    if (!selectedProvince) return

    const fetchState = async () => {
      try {
        const res = await getState(selectedProvince)
        console.log('관광지 데이터:', res)
        setTouristData(res)
      } catch (error) {
        console.error(error)
        setTouristData([])
      }
    }

    fetchState()
  }, [selectedProvince])

  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px]'>
      <header className='flex flex-col gap-[7px]'>
        <h2 className='text-[14px] leading-[24px] font-semibold'>인기 관광지 현황</h2>
        <Dropdown
          options={PROVINCES}
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
          <TouristSpotTable data={touristData} />
        )}
      </div>
    </div>
  )
}
