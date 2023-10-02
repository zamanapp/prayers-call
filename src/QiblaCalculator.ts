import { Coordinates, Qibla } from 'adhan'
import type { CoordinatesObject } from './types/Coordinates'

export function calculateQiblaDirection({ latitude, longitude }: CoordinatesObject): number {
  return Qibla(new Coordinates(latitude, longitude))
}
