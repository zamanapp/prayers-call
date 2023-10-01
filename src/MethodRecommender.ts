import { findCountryByCoordinate } from 'country-locator'
import { CountryMethods } from './data/methods'
import type { LngLatLike } from './types/LangLatLike'
import type { Methods } from './types/Methods'

/**
 * recommend methods to use from given coordinate
 * the methods are ranked by the most used to the least used
 * @param point - an array of two numbers - [x, y].
 * PAY ATTENTION: x == longitude, y == latitude!
 * @returns Methods[] | undefined - An array of recommended prayer methods for the given location, or undefined if the location is not found.
 */
export function MethodRecommender(coordinates: LngLatLike): Methods[] | undefined
/**
 * recommend methods to use given coordinate
 * the methods are ranked by the most used to the least used
 * @param latitude - latitude of coordinate
 * @param longitude - longitude of coordinate
 * @returns Methods[] | undefined - An array of recommended prayer methods for the given location, or undefined if the location is not found.
 */
export function MethodRecommender(latitude: number, longitude: number): Methods[] | undefined

export function MethodRecommender(coordinatesOrLat: LngLatLike | number, longitude?: number): Methods[] | undefined {
  const countryInfo = findCountryByCoordinate(
    longitude ? [coordinatesOrLat as number, longitude] : getLngLat(coordinatesOrLat as LngLatLike)
  )
  return countryInfo?.code ? (CountryMethods as Record<string, Methods[]>)[countryInfo?.code] : undefined
}

function getLngLat(coordinates: LngLatLike): [number, number] {
  if (Array.isArray(coordinates)) {
    return coordinates
  } else if ('lng' in coordinates && 'lat' in coordinates) {
    return [coordinates.lng, coordinates.lat]
  } else if ('lon' in coordinates && 'lat' in coordinates) {
    return [coordinates.lon, coordinates.lat]
  } else if ('longitude' in coordinates && 'latitude' in coordinates) {
    return [coordinates.longitude, coordinates.latitude]
  } else {
    throw new Error('Invalid coordinates object')
  }
}
