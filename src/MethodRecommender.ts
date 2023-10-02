import { findCountryByCoordinate } from 'country-locator'
import { CountryMethods } from './data/methods'
import type { Methods } from './types/Methods'
import type { CoordinatesObject } from './types/Coordinates'

export function recommendMethod({ latitude, longitude }: CoordinatesObject): Methods[] | undefined {
  const countryInfo = findCountryByCoordinate(latitude, longitude)
  return countryInfo?.code ? (CountryMethods as Record<string, Methods[]>)[countryInfo?.code] : undefined
}
