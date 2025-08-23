import type { RegionBounds } from '@/shared/types/polygon'

export const REGIONS: Record<string, RegionBounds> = {
  seoul: {
    name: '서울특별시',
    code: '11',
    bounds: { minLat: 37.4, maxLat: 37.7, minLng: 126.7, maxLng: 127.2 },
  },
  busan: {
    name: '부산광역시',
    code: '26',
    bounds: { minLat: 35.0, maxLat: 35.4, minLng: 128.9, maxLng: 129.3 },
  },
  daegu: {
    name: '대구광역시',
    code: '27',
    bounds: { minLat: 35.7, maxLat: 36.0, minLng: 128.4, maxLng: 128.8 },
  },
  incheon: {
    name: '인천광역시',
    code: '28',
    bounds: { minLat: 37.3, maxLat: 37.7, minLng: 126.3, maxLng: 126.8 },
  },
  gwangju: {
    name: '광주광역시',
    code: '29',
    bounds: { minLat: 35.0, maxLat: 35.3, minLng: 126.7, maxLng: 127.1 },
  },
  daejeon: {
    name: '대전광역시',
    code: '30',
    bounds: { minLat: 36.2, maxLat: 36.5, minLng: 127.2, maxLng: 127.5 },
  },
  ulsan: {
    name: '울산광역시',
    code: '31',
    bounds: { minLat: 35.3, maxLat: 35.7, minLng: 129.1, maxLng: 129.5 },
  },
  gyeonggi: {
    name: '경기도',
    code: '41',
    bounds: { minLat: 36.8, maxLat: 38.3, minLng: 126.4, maxLng: 127.9 },
  },
  gangwon: {
    name: '강원도',
    code: '42',
    bounds: { minLat: 37.0, maxLat: 38.6, minLng: 127.0, maxLng: 129.4 },
  },
  chungbuk: {
    name: '충청북도',
    code: '43',
    bounds: { minLat: 36.2, maxLat: 37.2, minLng: 127.3, maxLng: 128.6 },
  },
  chungnam: {
    name: '충청남도',
    code: '44',
    bounds: { minLat: 36.0, maxLat: 36.9, minLng: 126.2, maxLng: 127.5 },
  },
  jeonbuk: {
    name: '전라북도',
    code: '45',
    bounds: { minLat: 35.3, maxLat: 36.2, minLng: 126.4, maxLng: 127.5 },
  },
  jeonnam: {
    name: '전라남도',
    code: '46',
    bounds: { minLat: 34.1, maxLat: 35.4, minLng: 126.1, maxLng: 127.5 },
  },
  gyeongbuk: {
    name: '경상북도',
    code: '47',
    bounds: { minLat: 35.7, maxLat: 37.0, minLng: 128.4, maxLng: 129.6 },
  },
  gyeongnam: {
    name: '경상남도',
    code: '48',
    bounds: { minLat: 34.8, maxLat: 35.7, minLng: 127.6, maxLng: 129.3 },
  },
  jeju: {
    name: '제주특별자치도',
    code: '49',
    bounds: { minLat: 33.1, maxLat: 33.6, minLng: 126.1, maxLng: 126.9 },
  },
  sejong: {
    name: '세종특별자치시',
    code: '36',
    bounds: { minLat: 36.4, maxLat: 36.7, minLng: 127.1, maxLng: 127.4 },
  },
}
