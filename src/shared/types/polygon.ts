export interface PolygonFeature {
  id: string;
  type: "Feature";
  properties: {
    EMD_CD: string;
    EMD_ENG_NM: string;
    EMD_KOR_NM: string;
    totalAccident: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface PolygonCollection {
  type: "FeatureCollection";
  features: PolygonFeature[];
}

export interface RegionBounds {
  name: string;
  code: string;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export interface PolygonIndex {
  regions: string[]
  regionStats: Record<string, number> 
}
