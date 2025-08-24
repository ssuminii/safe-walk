interface TouristSpotLabelProps {
  touristSpotName: string
  onSelect: () => void
}

export default function TouristSpotLabel({ touristSpotName, onSelect }: TouristSpotLabelProps) {
  return (
    <div
      className='relative w-fit min-w-[66px] px-[17px] py-[2px] rounded-3xl bg-gray-1/70'
      onClick={onSelect}
    >
      <div className='m1 text-white'>{touristSpotName}</div>
      <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-1/70'></div>
    </div>
  )
}
