export type CoordinatesObject =
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | { longitude: number; latitude: number }
export type LngLatLike = [number, number] | CoordinatesObject
