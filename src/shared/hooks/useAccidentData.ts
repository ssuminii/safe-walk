import { useState, useEffect, useRef } from 'react'
import { useRegionAccidentListQuery } from '../hooks/query'
import type { RegionInfoType } from '../types/map'

export const useAccidentData = (
  boundsParams: { swLat: number; swLng: number; neLat: number; neLng: number } | null,
  mapLevel: number,
  onAccidentListChange: (list: RegionInfoType[]) => void
) => {
  const [accidentList, setAccidentList] = useState<RegionInfoType[]>([])
  const onChangeRef = useRef(onAccidentListChange)
  const prevListRef = useRef<RegionInfoType[]>([])

  // 최신 콜백 함수 참조 유지
  onChangeRef.current = onAccidentListChange

  // boundsParams가 유효할 때만 쿼리 실행
  const queryParams = boundsParams ?? { swLat: 0, swLng: 0, neLat: 0, neLng: 0 }

  const { data: regionAccidentList = [] } = useRegionAccidentListQuery(queryParams)

  useEffect(() => {
    let newList: RegionInfoType[] = []

    // boundsParams가 없거나 mapLevel이 5 이상이면 빈 배열
    if (!boundsParams || mapLevel >= 5) {
      newList = []
    }
    // regionAccidentList가 있고 유효한 데이터라면
    else if (
      regionAccidentList &&
      Array.isArray(regionAccidentList) &&
      regionAccidentList.length > 0
    ) {
      newList = regionAccidentList
    }

    // 이전 리스트와 비교해서 실제로 변경된 경우에만 업데이트
    const hasChanged =
      prevListRef.current.length !== newList.length ||
      prevListRef.current.some((item, index) => item?.emd_CD !== newList[index]?.emd_CD)

    if (hasChanged) {
      setAccidentList(newList)
      prevListRef.current = newList

      // 안정적인 콜백 호출
      if (onChangeRef.current) {
        onChangeRef.current(newList)
      }
    }
  }, [regionAccidentList, mapLevel, boundsParams])

  return { accidentList }
}
