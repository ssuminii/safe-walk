import type { RegionAccidentInfo } from '../types/map'

export const regionAccidentInfo: RegionAccidentInfo = {
  totalAccident: 3, 
  regionId: 'GJ-Hwangnam', 
  name: '황남동', 
  accidents: [ 
    {
      id: 'acc-hn-001',
      location: '황남동 선덕네거리',
      accidentCount: 7,
      casualties: { total: 12, dead: 1, severe: 3, minor: 8 },
      point: { lat: 35.8339, lng: 129.2141 },
    },
    {
      id: 'acc-hn-002',
      location: '경주교촌마을 입구 사거리',
      accidentCount: 4,
      casualties: { total: 6, dead: 0, severe: 2, minor: 4 },
      point: { lat: 35.8328, lng: 129.2107 },
    },
    {
      id: 'acc-hn-003',
      location: '대릉원 담장 길 모퉁이',
      accidentCount: 5,
      casualties: { total: 7, dead: 0, severe: 2, minor: 5 },
      point: { lat: 35.8351, lng: 129.2129 },
    },
  ],
}
