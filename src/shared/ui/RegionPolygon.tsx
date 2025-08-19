import { useEffect } from 'react'
import proj4 from 'proj4'
import type { PolygonFeature } from '../types/polygon'
import { getLevel } from '../utils'

interface RegionPolygonProps {
  polygon: PolygonFeature
  map: kakao.maps.Map
}

const RegionPolygon = ({ polygon, map }: RegionPolygonProps) => {
  const accidentCount = polygon.properties.totalAccident ?? 0
  const level = getLevel(accidentCount)

  let fillColor = '#326CF9'

  if (level === 1) {
    fillColor = '#FF7607'
  } else if (level === 2) {
    fillColor = '#EF4136'
  }

  useEffect(() => {
    const projections = {
      // WGS84 경위도 (카카오맵이 사용하는 좌표계)
      WGS84: 'EPSG:4326',

      // 한국 주요 투영좌표계들
      UTM_K:
        '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', // EPSG:5179
      TM_CENTRAL:
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', // EPSG:5181
      TM_EAST:
        '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', // EPSG:5182
      TM_WEST:
        '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', // EPSG:5180
    }

    // 첫 번째 좌표로 어떤 좌표계인지 판별
    const firstCoord = polygon.geometry.coordinates[0][0]
    const x = firstCoord[0]
    const y = firstCoord[1]

    let convertedCoords: number[][] = []

    if (x >= 125 && x <= 132 && y >= 33 && y <= 39) {
      convertedCoords = polygon.geometry.coordinates[0]
    }
    // 투영좌표계인 경우 변환 시도
    else {
      // 좌표 범위로 어떤 투영좌표계인지 추정
      let sourceProj = projections.UTM_K

      if (x > 100000 && x < 300000) {
        sourceProj = projections.TM_CENTRAL
      } else if (x > 900000 && x < 1100000) {
        sourceProj = projections.TM_EAST
      } else if (x > 1000000 && x < 1200000) {
        sourceProj = projections.UTM_K
      }

      try {
        convertedCoords = polygon.geometry.coordinates[0].map(([x, y]) => {
          const [lng, lat] = proj4(sourceProj, projections.WGS84, [x, y])
          return [lng, lat]
        })
      } catch (error) {
        console.error('좌표 변환 실패:', error)

        // 다른 좌표계로 재시도
        const alternativeProjs = [
          projections.TM_CENTRAL,
          projections.TM_EAST,
          projections.TM_WEST,
          projections.UTM_K,
        ]

        for (const proj of alternativeProjs) {
          try {
            convertedCoords = polygon.geometry.coordinates[0].map(([x, y]) => {
              return proj4(proj, projections.WGS84, [x, y])
            })
            break
          } catch (error) {
            console.error(error)
          }
        }

        if (convertedCoords.length === 0) {
          console.error('모든 좌표계 변환 실패')
          return
        }
      }
    }

    // 카카오맵용 LatLng 객체 생성
    const path = convertedCoords.map(([lng, lat]) => {
      return new kakao.maps.LatLng(lat, lng)
    })

    const polygonOverlay = new kakao.maps.Polygon({
      path,
      strokeWeight: 1.5,
      strokeColor: fillColor,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: fillColor,
      fillOpacity: 0.3,
    })

    polygonOverlay.setMap(map)

    return () => {
      polygonOverlay.setMap(null)
    }
  }, [polygon, map])

  return null
}

export default RegionPolygon
