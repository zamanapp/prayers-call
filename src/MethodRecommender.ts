import { iso1A3Code } from '@rapideditor/country-coder'
import { CountryMethods } from './data/methods'
import type { Methods } from './types/Methods'
import type { CoordinatesObject } from './types/Coordinates'

export function recommendMethod({ longitude, latitude }: CoordinatesObject): Methods[] | undefined {
  const countryCode = iso1A3Code([longitude, latitude])
  return countryCode ? (CountryMethods as Record<string, Methods[]>)[countryCode] : undefined
}
