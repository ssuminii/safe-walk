import { useEffect } from 'react'
import proj4 from 'proj4'
import type { PolygonFeature } from '@/shared/types/polygon'
import { getLevel } from '@/entities/accident/lib'

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
    const projections = [
      'EPSG:4326', // WGS84
      '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs', // UTM-K
      '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', // TM 중부
      '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', // TM 동부
      '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', // TM 서부
    ]

    let convertedCoords: number[][] = []
    const originalCoords = polygon.geometry.coordinates[0]

    for (let i = 0; i < projections.length; i++) {
      const sourceProj = projections[i]

      try {
        if (i === 0) {
          convertedCoords = originalCoords
        } else {
          convertedCoords = originalCoords.map(([x, y]) => {
            const [lng, lat] = proj4(sourceProj, 'EPSG:4326', [x, y])
            return [lng, lat]
          })
        }

        const [lng, lat] = convertedCoords[0]
        if (lng >= 124 && lng <= 132 && lat >= 32 && lat <= 40) {
          break
        }
      } catch (error) {
        console.error(error)
        continue
      }

      if (i === projections.length - 1) {
        console.error('모든 좌표계 변환 실패')
        return
      }
    }

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
