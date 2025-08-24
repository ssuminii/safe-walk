import React from 'react'
import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { AccidentPin, AccidentSelectedPin, MapRegionLabel, TouristSpotLabel } from './'
import type { RegionInfoType, RegionLabels } from '@/shared/types/map'
import type { TouristSpotLabels } from '@/shared/types/tourist-spot'

type OverlayType = 'region' | 'tourist'

interface MapOverlaysProps {
  selectedAccidentId: string | null
  mapLevel: number
  regionLabels: RegionLabels[]
  selectedRegionId: string | null
  accidentList: RegionInfoType[]
  accidentInfo: RegionInfoType | null
  onRegionSelect: (regionId: string) => void
  onAccidentPinClick: (accidentId: string) => void
  overlayType?: OverlayType
  touristSpots?: TouristSpotLabels[]
  onTouristSpotSelect?: (touristSpot: TouristSpotLabels) => void
}

export const MapOverlays: React.FC<MapOverlaysProps> = ({
  selectedAccidentId,
  mapLevel,
  regionLabels,
  selectedRegionId,
  accidentList,
  accidentInfo,
  onRegionSelect,
  onAccidentPinClick,
  overlayType = 'region',
  touristSpots = [],
  onTouristSpotSelect,
}) => {
  return (
    <>
      {/* 지역 라벨 오버레이 */}
      {!selectedAccidentId &&
        mapLevel >= 5 &&
        overlayType === 'region' &&
        regionLabels.length > 0 &&
        regionLabels.map((regionLabel) => (
          <CustomOverlayMap
            key={regionLabel.EMD_CD}
            position={{ lat: regionLabel.latitude, lng: regionLabel.longitude }}
            yAnchor={1}
            zIndex={selectedRegionId === regionLabel.EMD_CD ? 1000 : 1}
          >
            <MapRegionLabel
              regionLabel={regionLabel.name}
              accidentCount={regionLabel.totalAccident}
              onSelect={() => onRegionSelect(regionLabel.EMD_CD)}
            />
          </CustomOverlayMap>
        ))}

      {/* 관광지 라벨 오버레이 */}
      {!selectedAccidentId &&
        overlayType === 'tourist' &&
        touristSpots.length > 0 &&
        touristSpots.map((touristSpot) => (
          <CustomOverlayMap
            key={touristSpot.id}
            position={{
              lat: touristSpot.Coordinate.latitude,
              lng: touristSpot.Coordinate.longitude,
            }}
            yAnchor={1}
            zIndex={2}
          >
            <TouristSpotLabel
              touristSpotName={touristSpot.spot_name}
              onSelect={() => onTouristSpotSelect?.(touristSpot)}
            />
          </CustomOverlayMap>
        ))}

      {/* 사고 핀 오버레이 */}
      {mapLevel < 5 &&
        accidentList
          ?.filter((region) => region?.accidents?.length)
          .flatMap((region) =>
            region.accidents!.map((accident) => (
              <CustomOverlayMap
                key={accident.id}
                position={accident.point}
                zIndex={selectedAccidentId === accident.id ? 1000 : 1}
              >
                {selectedAccidentId === accident.id ? (
                  <AccidentSelectedPin accidentCount={accident.accidentCount} />
                ) : (
                  <AccidentPin
                    accidentCount={accident.accidentCount}
                    onClick={() => onAccidentPinClick(accident.id)}
                  />
                )}
              </CustomOverlayMap>
            ))
          )}

      {/* 선택된 사고 정보 오버레이 */}
      {selectedAccidentId &&
        accidentInfo?.accidents?.map((accident) => (
          <CustomOverlayMap
            key={accident.id}
            position={accident.point}
            zIndex={selectedAccidentId === accident.id ? 1000 : 1}
          >
            {selectedAccidentId === accident.id ? (
              <AccidentSelectedPin accidentCount={accident.accidentCount} />
            ) : (
              <AccidentPin
                accidentCount={accident.accidentCount}
                onClick={() => onAccidentPinClick(accident.id)}
              />
            )}
          </CustomOverlayMap>
        ))}
    </>
  )
}
