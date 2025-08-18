export interface RegionLabels {
  name: string,
  totalAccident: number,
  EMD_CD: string,
  latitude: number,
  longitude: number
}

export interface RegionInfoType {
  name: string
  totalAccident: number
  accidents: Accident[]
  emd_CD: string
}


export interface Accident {
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
}