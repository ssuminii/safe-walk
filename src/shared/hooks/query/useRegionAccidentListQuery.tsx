import { useQuery } from '@tanstack/react-query'
import type { RegionInfoType } from '../../types/map'
import { getRegionAccidentList, type RegionLabelsParams } from '../../../pages/search-page/api/map'

export const useRegionAccidentListQuery = (params: RegionLabelsParams) => {
  return useQuery<RegionInfoType[]>({
    queryKey: ['regionAccidentList', params],
    queryFn: () => getRegionAccidentList(params),
    enabled: !!params,
  })
}
