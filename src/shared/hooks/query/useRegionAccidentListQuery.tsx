import { useQuery } from '@tanstack/react-query'
import type { RegionInfoType } from '../../types/map'
import { getRegionAccidentList, type RegionLabelsParams } from '../../../pages/search-page/api/map'

export const useRegionAccidentListQuery = (params: RegionLabelsParams) => {
  return useQuery<RegionInfoType[]>({
    queryKey: ['regionAccidentList', params],
    queryFn: () => getRegionAccidentList(params),
    enabled: !!params,
    select: (data) =>
      // null이거나 사고 리스트가 이상한 region을 미리 제거
      data?.filter(
        (region): region is RegionInfoType => !!region && Array.isArray(region.accidents)
      ) ?? [],
  })
}
