export interface TouristSpot {
  id: number
  rank: number
  name: string
  action: string
}

export interface TouristTableProps {
  data: TouristSpot[]
}

export const TouristSpotTable = ({ data }: TouristTableProps) => {
  return (
    <div className='border border-gray-7 border-sm overflow-hidden h-full'>
      {/* header */}
      <div className='bg-[#F2F3F5] grid grid-cols-12 py-3 px-4 border-b border-gray-7 m1 text-center'>
        <div className='col-span-3 '>순위</div>
        <div className='col-span-5 '>이름</div>
        <div className='col-span-4'>-</div>
      </div>

      {/* body */}
      <div className='bg-white max-h-[400px] overflow-y-auto'>
        {data.map((spot) => (
          <div
            key={spot.id}
            className='grid grid-cols-12 py-3 px-4 m1 text-gray-5 hover:bg-gray-50 border-b border-gray-7 text-center'
          >
            <div className='col-span-3'>{spot.rank}</div>
            <div className='col-span-5'>{spot.name}</div>
            <div className='col-span-4'>
              <button className='text-[10px] cursor-pointer hover:text-primary transition-colors'>
                {spot.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
