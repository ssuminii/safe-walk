import { RegionInfo, AccidentInfoCard } from './'
import Alert from '../../assets/alert.svg?react'
import { getRegionInfo } from '../../pages/search-page/api/tourlistSpot'
import { useEffect, useState } from 'react'
import type { RegionInfo as RegionInfoType } from '../types/map'

interface SideBarProps {
  selectedRegionId: string | null
  selectedAccidentId: string | null
  onAccidentCardClick: (accidentId: string) => void
  search: string
}

const SideBar = ({
  selectedRegionId,
  selectedAccidentId,
  onAccidentCardClick,
  search,
}: SideBarProps) => {
  const [accidentInfo, setAccidentInfo] = useState<RegionInfoType | null>(null)

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
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px]'>
      <RegionInfo accidentInfo={accidentInfo} />
      {accidentInfo ? (
        accidentInfo.accidents.map((accident) => (
          <AccidentInfoCard
            key={accident.id}
            accident={accident}
            isSelected={selectedAccidentId === accident.id}
            onClick={() => onAccidentCardClick(accident.id)}
          />
        ))
      ) : (
        <div className='flex flex-col justify-center items-center gap-3 h-full'>
          <Alert />
          <p className='text-center r2 text-gray-1'>
            해당 위치에는 사고 데이터가 없습니다. <br /> 위치를 변경하여 확인해보세요.
          </p>
        </div>
      )}
    </div>
  )
}

export default SideBar
