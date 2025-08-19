interface MapRegionLabelProps {
  regionLabel: string
  accidentCount: number
  onSelect: () => void
  isSelected?: boolean
}

const levelColor: Record<number, string> = {
  0: 'bg-primary',
  1: 'bg-warning',
  2: 'bg-error',
}

const getLevel = (accidentCount: number): number => {
  if (accidentCount < 3) return 0
  if (accidentCount < 7) return 1
  return 2
}

const MapRegionLabel = ({
  regionLabel,
  accidentCount,
  onSelect,
  isSelected = false,
}: MapRegionLabelProps) => {
  const level = getLevel(accidentCount)

  return (
    <div
      onClick={onSelect}
      className={`m1 text-white rounded-sm min-w-[58px] py-[3px] px-[13px] text-center ${levelColor[level]}`}
      style={{
        position: 'relative',
        zIndex: isSelected ? 9999 : 1,
        transition: 'z-index 0.2s',
      }}
    >
      {regionLabel}
    </div>
  )
}

export default MapRegionLabel
