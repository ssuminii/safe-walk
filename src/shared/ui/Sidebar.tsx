import { RegionInfo, AccidentInfoCard } from './'
import { regionAccidentInfo } from '../mocks'
import Alert from '../../assets/alert.svg?react'

const SideBar = ({ selectedRegionId }: { selectedRegionId: string | null }) => {
  const accidentInfo = selectedRegionId === 'GJ-Hwangnam' ? regionAccidentInfo : null

  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px]'>
      <RegionInfo accidentInfo={accidentInfo} />
      {accidentInfo ? (
        accidentInfo.accidents.map((accident) => <AccidentInfoCard accident={accident} />)
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
