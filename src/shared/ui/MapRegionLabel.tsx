import { getLevel } from '../utils'

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

const MapRegionLabel = ({ regionLabel, accidentCount, onSelect }: MapRegionLabelProps) => {
  const level = getLevel(accidentCount)

  return (
    <div
      onClick={onSelect}
      className={`m1 text-white rounded-sm min-w-[58px] py-[3px] px-[13px] text-center ${levelColor[level]}`}
    >
      {regionLabel}
    </div>
  )
}

export default MapRegionLabel
