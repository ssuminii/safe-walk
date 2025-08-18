export type LatLng = { lat: number; lng: number } 

export type AccidentLevel = 0 | 1 | 2 

export interface mapRegionLabel { 
  id: string
  gu: '경주시'            
  name: string
  center: LatLng
  level: AccidentLevel
  accidentCount: number
}


export interface RegionAccidentInfo {
  totalAccident: number
  regionId: string
  name: string
  accidents: AccidentInfoCard[]
}

export interface Casualties { 
  total: number
  dead: number
  severe: number
  minor: number
}

export interface AccidentInfoCard {
  id: string
  location: string
  accidentCount: number
  casualties: Casualties
  point: {
    lat: number
    lng: number
  }
}

// 지도 영역 내 관광지 조회
export interface Emd {
  name: string,
  totalAccident: number,
  EMD_CD: string,
  latitude: number,
  longitude: number
}