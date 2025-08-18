import type { RegionAccidentInfo } from '../types/map_mocks'

const RegionInfo = ({ accidentInfo }: { accidentInfo: RegionAccidentInfo | null }) => {
  return (
    <div className='flex justify-between items-center'>
      <div className='rounded-full bg-gray-1 text-white m1 min-w-[66px] py-[2px] px-[17px] text-center'>
        {accidentInfo?.name ?? '-'}
      </div>
      <span className='r1 text-gray-6'>{accidentInfo?.totalAccident ?? 0}곳</span>
    </div>
  )
}

export default RegionInfo
