import { getRegionAccidentList, type RegionLabelsParams } from '@/pages/map/api/map'
import type { RegionInfoType } from '@/shared/types/map'
import { useQuery } from '@tanstack/react-query'

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
