import { useQuery } from '@tanstack/react-query'
import { usePolygonLoader } from '../usePolygonLoader'
import type { RegionLabelsParams } from '@/pages/map/api/map'
import type { PolygonFeature } from '@/shared/types/polygon'

export const usePolygonLoaderQuery = (params: RegionLabelsParams) => {
  const { getPolygonsInBounds } = usePolygonLoader()

  return useQuery<PolygonFeature[]>({
    queryKey: ['polygons-in-bounds', params],
    queryFn: () => getPolygonsInBounds(params),
    enabled: !!params.swLat && !!params.swLng && !!params.neLat && !!params.neLng,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
