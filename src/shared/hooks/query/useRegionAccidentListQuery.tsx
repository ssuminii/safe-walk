import { useQuery } from '@tanstack/react-query'
import type { RegionInfoType } from '../../types/map'
import { getRegionAccidentList, type RegionLabelsParams } from '../../../pages/map/api/map'

const isValidBounds = (params: RegionLabelsParams | null) => {
  if (!params) return false
  const { swLat, swLng, neLat, neLng } = params
  return swLat !== 0 && swLng !== 0 && neLat !== 0 && neLng !== 0
}

export const useRegionAccidentListQuery = (params: RegionLabelsParams) => {
  return useQuery<RegionInfoType[]>({
    queryKey: ['regionAccidentList', params],
    queryFn: () => getRegionAccidentList(params!),
    enabled: isValidBounds(params),
    select: (data) =>
      data?.filter(
        (region): region is RegionInfoType => !!region && Array.isArray(region.accidents)
      ) ?? [],
  })
}
