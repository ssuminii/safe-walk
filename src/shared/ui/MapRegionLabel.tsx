import type { mapRegionLabel } from '../types/map'

interface MapRegionLabelProps {
  mapRegionLabel: mapRegionLabel
  onSelect: () => void
}

const levelColor: Record<number, string> = {
  0: 'bg-primary',
  1: 'bg-warning',
  2: 'bg-error',
}

const MapRegionLabel = ({ mapRegionLabel, onSelect }: MapRegionLabelProps) => {
  return (
    <div
      className={`m1 text-white rounded-sm min-w-[58px] py-[3px] px-[13px] text-center ${
        levelColor[mapRegionLabel.level]
      }`}
      onClick={onSelect}
    >
      {mapRegionLabel.name}
    </div>
  )
}

export default MapRegionLabel
