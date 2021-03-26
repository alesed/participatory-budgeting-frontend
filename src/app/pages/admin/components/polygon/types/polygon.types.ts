export interface PolygonCoordsData {
  center: PolygonCoord;
  coords: PolygonCoord[];
}

export interface PolygonCoord {
  lat: number;
  lng: number;
}

export interface PolygonResponse {
  success: boolean;
}
