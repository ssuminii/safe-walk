import { AccidentInfoCard, RegionInfo, EmptyState } from './'
import type { RegionInfoType } from '../types/map'

interface SideBarProps {
  accidentInfo: RegionInfoType | null
  selectedAccidentId: string | null
  onAccidentCardClick: (accidentId: string) => void
  accidentList: RegionInfoType[]
}

const SideBar = ({
  accidentInfo,
  selectedAccidentId,
  onAccidentCardClick,
  accidentList,
}: SideBarProps) => {
  const accidentData = accidentInfo
    ? accidentInfo.accidents
    : accidentList.flatMap((region) => region.accidents ?? []).filter(Boolean)

  const isEmpty =
    (accidentInfo && accidentInfo.totalAccident === 0) ||
    (!accidentInfo && accidentData.length === 0)

  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px] h-full overflow-y-auto'>
      <RegionInfo accidentInfo={accidentInfo} />
      {isEmpty ? (
        <EmptyState />
      ) : (
        accidentData.map((accident) => (
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
