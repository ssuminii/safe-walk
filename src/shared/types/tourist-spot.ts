export interface TouristSpotLabels {
  id: string
  spot_name: string
  sido_name: string
  sigungu_name: string
  category: string
  coordinate: {
    latitude: number
    longitude: number
  }
}

export interface PopularTouristSpots extends TouristSpotLabels {
  mode: string
  rank: number
}

export interface TouristSpotAccident {
  name: string
  spotId: string
  totalAccident: number
  accidents: Array<{
    id: string
    location: string
    accidentCount: number
    casualties: {
      total: number
      dead: number
      severe: number
      minor: number
    }
    point: {
      latitude: number
      longitude: number
    }
  }>
}
