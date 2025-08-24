import type { PopularTouristSpots } from '@/shared/types/tourist-spot'

export interface TouristTableProps {
  data: PopularTouristSpots[]
  onSpotClick?: (spot: PopularTouristSpots) => void
}

export const TouristSpotTable = ({ data, onSpotClick }: TouristTableProps) => {
  return (
    <div className='border border-gray-7 border-sm overflow-hidden h-full flex flex-col'>
      {/* header */}
      <div className='bg-[#F2F3F5] grid grid-cols-12 py-3 px-4 border-b border-gray-7 m1 text-center flex-shrink-0'>
        <div className='col-span-2'>순위</div>
        <div className='col-span-8'>이름</div>
        <div className='col-span-2'>-</div>
      </div>

      {/* body */}
      <div className='bg-white flex-1 overflow-y-auto'>
        {data.map((spot) => (
          <div
            key={spot.id}
            className='grid grid-cols-12 py-3 px-4 m1 text-gray-5 hover:bg-gray-50 border-b border-gray-7 text-center'
          >
            <div className='col-span-2'>{spot.rank}</div>
            <div className='col-span-8'>{spot.spot_name}</div>
            <div className='col-span-2'>
              <button
                className='text-[10px] cursor-pointer hover:text-primary transition-colors'
                onClick={() => onSpotClick?.(spot)}
              >
                더보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
