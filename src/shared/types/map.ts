export interface RegionLabels {
  name: string,
  totalAccident: number,
  EMD_CD: string,
  latitude: number,
  longitude: number
}

export interface RegionInfo {
  name: string
  totalAccident: number
  accidents: [{
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
      lat: number
      lng: number
    }
  }]
  emd_CD: string
}
