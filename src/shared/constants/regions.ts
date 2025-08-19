import type { RegionBounds } from "../types/polygon";

export const REGIONS: Record<string, RegionBounds> = {
    seoul: {
      name: '서울특별시',
      code: '11',
      bounds: { minLat: 37.4, maxLat: 37.7, minLng: 126.7, maxLng: 127.2 }
    },
    busan: {
      name: '부산광역시',
      code: '26',
      bounds: { minLat: 35.0, maxLat: 35.4, minLng: 128.9, maxLng: 129.3 }
    },
    gyeongbuk: {
      name: '경상북도',
      code: '47',
      bounds: { minLat: 35.7, maxLat: 37.0, minLng: 128.4, maxLng: 129.6 }
    },
    jeju: {
      name: '제주특별자치도',
      code: '50',
      bounds: { minLat: 33.1, maxLat: 33.6, minLng: 126.1, maxLng: 126.9 }
    },
    gangwon: {
      name: '강원도',
      code: '51',
      bounds: { minLat: 37.0, maxLat: 38.6, minLng: 127.0, maxLng: 129.4 }
    },
    gyeonggi: {
      name: '경기도',
      code: '41',
      bounds: { minLat: 36.8, maxLat: 38.3, minLng: 126.4, maxLng: 127.9 }
    }
  };
  
  export const DEFAULT_CENTER = {
    lat: 35.841442,
    lng: 129.216828
  };

