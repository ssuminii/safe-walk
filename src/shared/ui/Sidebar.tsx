import { AccidentInfoCard, RegionInfo, EmptyState } from './'
import type { RegionInfoType } from '@/shared/types/map'
import { useEffect, useRef } from 'react'

interface SideBarProps {
  accidentInfo: RegionInfoType | null
  selectedAccidentId: string | null
  selectedRegionId?: string | null
  onAccidentCardClick: (accidentId: string) => void
  accidentList: RegionInfoType[]
}

const SideBar = ({
  accidentInfo,
  selectedAccidentId,
  selectedRegionId,
  onAccidentCardClick,
  accidentList,
}: SideBarProps) => {
  const accidentData = accidentInfo
    ? accidentInfo.accidents ?? []
    : accidentList?.flatMap((region) => region.accidents ?? []).filter(Boolean)
  const selectedCardRef = useRef<HTMLDivElement | null>(null)

  const isEmpty =
    (accidentInfo && accidentInfo.totalAccident === 0) ||
    (!accidentInfo && accidentData.length === 0)

  const isUnselected = !selectedRegionId && !accidentInfo

  useEffect(() => {
    if (selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [selectedAccidentId])

  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px] h-full overflow-y-auto'>
      <RegionInfo accidentInfo={accidentInfo} />
      {isEmpty ? (
        <EmptyState isUnselected={isUnselected} />
      ) : (
        accidentData.map((accident) => {
          const isSelected = selectedAccidentId === accident.id
          return (
            <div key={accident.id} ref={isSelected ? selectedCardRef : null}>
              <AccidentInfoCard
                accident={accident}
                isSelected={selectedAccidentId === accident.id}
                onClick={() => onAccidentCardClick(accident.id)}
              />
            </div>
          )
        })
      )}
    </div>
  )
}

export default SideBar
