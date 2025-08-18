import { AccidentInfoCard, RegionInfo, EmptyState } from './'
import type { RegionInfoType } from '../types/map'

interface SideBarProps {
  accidentInfo: RegionInfoType | null
  selectedAccidentId: string | null
  onAccidentCardClick: (accidentId: string) => void
}

const SideBar = ({ accidentInfo, selectedAccidentId, onAccidentCardClick }: SideBarProps) => {
  const isEmpty = !accidentInfo || accidentInfo.totalAccident === 0

  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px]'>
      <RegionInfo accidentInfo={accidentInfo} />
      {isEmpty ? (
        <EmptyState />
      ) : (
        accidentInfo.accidents.map((accident) => (
          <AccidentInfoCard
            key={accident.id}
            accident={accident}
            isSelected={selectedAccidentId === accident.id}
            onClick={() => onAccidentCardClick(accident.id)}
          />
        ))
      )}
    </div>
  )
}

export default SideBar
