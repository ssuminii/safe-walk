interface TouristSpotLabelProps {
  touristSpotName: string
  isSelected?: boolean
  onSelect?: () => void
}

export default function TouristSpotLabel({
  touristSpotName,
  isSelected = false,
  onSelect,
}: TouristSpotLabelProps) {
  const bgColor = isSelected ? 'bg-primary' : 'bg-gray-1/70 hover:bg-primary/80'
  const arrowColor = isSelected
    ? 'border-t-primary'
    : 'border-t-gray-1/70 group-hover:border-t-primary/80'

  return (
    <div
      className={`group relative w-fit min-w-[66px] px-[17px] py-[2px] rounded-3xl cursor-pointer ${bgColor} `}
      onClick={onSelect}
    >
      <div className='m1 text-white'>{touristSpotName}</div>
      <div
        className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${arrowColor}`}
      ></div>
    </div>
  )
}
