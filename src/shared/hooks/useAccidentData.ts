import { useState, useEffect } from 'react'
import { useRegionAccidentListQuery } from '../hooks/query'
import type { RegionInfoType } from '../types/map'

export const useAccidentData = (
  boundsParams: { swLat: number; swLng: number; neLat: number; neLng: number } | null,
  mapLevel: number,
  onAccidentListChange: (list: RegionInfoType[]) => void
) => {
  const [accidentList, setAccidentList] = useState<RegionInfoType[]>([])

  const { data: regionAccidentList = [] } = useRegionAccidentListQuery(
    boundsParams ?? { swLat: 0, swLng: 0, neLat: 0, neLng: 0 }
  )

  useEffect(() => {
    if (mapLevel < 5 && regionAccidentList.length > 0) {
      setAccidentList(regionAccidentList)
      onAccidentListChange(regionAccidentList)
    } else {
      setAccidentList([])
      onAccidentListChange([])
    }
  }, [regionAccidentList, mapLevel, onAccidentListChange])

  return { accidentList }
}
