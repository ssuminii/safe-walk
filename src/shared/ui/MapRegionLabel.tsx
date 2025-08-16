import type { mapRegionLabel } from '../types/map'

const levelColor: Record<number, string> = {
  0: 'bg-primary',
  1: 'bg-warning',
  2: 'bg-error',
}

const MapRegionLabel = ({ mapRegionLabel }: { mapRegionLabel: mapRegionLabel }) => {
  return (
    <div
      className={`m1 text-white rounded-sm min-w-[58px] py-[3px] px-[13px] text-center ${
        levelColor[mapRegionLabel.level]
      }`}
    >
      {mapRegionLabel.name}
    </div>
  )
}

export default MapRegionLabel
