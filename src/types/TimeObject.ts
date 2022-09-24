import type { Prayer } from 'adhan'
import type { ValueOf } from './TypesUtils'

export type PrayerNamesType = ValueOf<typeof Prayer>

export type TimesNamesType = PrayerNamesType | 'middleOfTheNight' | 'lastThirdOfTheNight'

export enum EventType {
  ADHAN = 'ADHAN',
  IQAMA = 'IQAMA',
  TRANSIENT = 'TRANSIENT',
}

export enum PrayerNames {
  FAJR = 'fajr',
  SUNRISE = 'sunrise',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHA = 'isha',
}

export enum TimesNames {
  FAJR = 'fajr',
  SUNRISE = 'sunrise',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHA = 'isha',
  MIDDLE_OF_THE_NIGHT = 'middleOfTheNight',
  LAST_THIRD_OF_THE_NIGHT = 'lastThirdOfTheNight',
}

export interface PrayersTimeObject {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
}

export interface FormattedTimeObject {
  name: TimesNamesType
  time: string
}

export interface TimeObject {
  name: TimesNamesType
  time: Date | null
}

export interface TimeEventObject {
  name: TimesNamesType
  type: EventType
  time: Date
}
