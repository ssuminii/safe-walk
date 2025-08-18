interface MapRegionLabelProps {
  regionLabel: string
  accidentCount: number
  onSelect: () => void
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

const MapRegionLabel = ({ regionLabel, accidentCount, onSelect }: MapRegionLabelProps) => {
  const level = getLevel(accidentCount)

  return (
    <div
      className={`m1 text-white rounded-sm min-w-[58px] py-[3px] px-[13px] text-center ${levelColor[level]}`}
      onClick={onSelect}
    >
      {regionLabel}
    </div>
  )
}

export default MapRegionLabel
