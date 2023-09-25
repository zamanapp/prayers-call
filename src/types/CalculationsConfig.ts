import type { HighLatitudeRule, PolarCircleResolution } from 'adhan'
import type { Iqama } from './Iqama'
import type { AsrTime } from './AsrTime'
import type { Methods } from './Methods'
import type { PrayerAdjustments } from './PrayerAdjustments'
import type { ValueOf } from './TypesUtils'
import type { HijriCalendar } from './HijriCalendar'

// TODO: add a configuration to take into consideration the altitude of the location
// TODO: add a configuration to take into consideration daylight savings
// TODO: add a configuration to take into consideration ramadan timings (+30min on top of the 90min used for UmmAlQura)
export interface CustomMethod {
  /**
   * Angle of the sun used to calculate Fajr
   * @defaultValue 18
   * */
  fajrAngle?: number
  /**
   * Angle of the sun used to calculate Isha
   * @defaultValue 18
   * */
  ishaAngle?: number
  /**
   * Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval)
   * @defaultValue 0
   * */
  ishaInterval?: number
  /**
   * Angle of the sun used to calculate Maghrib
   * @defaultValue 0
   * */
  maghribAngle?: number
  /**
   * Object with custom prayer time adjustments (in minutes) specifically for the method for each prayer time
   * @defaultValue { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
   * */
  methodAdjustments?: Partial<PrayerAdjustments>
}

export interface CalculationsConfig {
  /**
   * the starting date for the calculations (can use past and future dates)
   * @defaultValue new Date()
   * */
  date: Date
  /**
   * latitude of the location
   * */
  latitude: number
  /**
   * longitude of the location
   * */
  longitude: number
  /**
   * method used for the calculation
   * @defaultValue Methods.UMM_AL_QURA
   * */
  method?: Methods | CustomMethod
  /**
   * Object with custom prayer time adjustments (in minutes) for each prayer time
   * @defaultValue { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
   * */
  adjustments?: Partial<PrayerAdjustments>
  /**
   * Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha
   * @defaultValue HighLatitudeRule.MiddleOfTheNight
   * */
  highLatitudeRule?: ValueOf<typeof HighLatitudeRule>
  /**
   * Earlier (Jumhoor) or later (Hanafi) Asr time calculation
   * @defaultValue AsrTime.JUMHOOR
   * */
  asrTime?: AsrTime
  /**
   * handle the particular cases of Midnight Sun & Polar Night days
   * see: https://github.com/batoulapps/adhan-js/pull/30
   * @defaultValue PolarCircleResolution.Unresolved
   * */
  polarCircleResolution?: ValueOf<typeof PolarCircleResolution>
  /**
   * Object with waiting time (minutes) for iqama after the actual prayer time
   * @defaultValue { fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }
   * */
  iqama?: Partial<Iqama>
  /**
   * if set to true will adjust the prayer times for Ramadan by adding 30 minutes to Isha
   * This is usually practiced in umm al-qura method
   * @defaultValue false
   */
  adjustForRamadan?: boolean
  /**
   * what hijri calendar to use for the calculation
   * @defaultValue HijriCalendar.UMM_AL_QURA
   */
  hijriCalendar?: HijriCalendar
  /**
   * if set to true will output logs that can be helpful for debugging
   * @defaultValue false
   */
  debug?: boolean
}

export type ReactiveCalculationsConfig = Omit<CalculationsConfig, 'date'>

export interface FinalCalculationsConfig extends Omit<CalculationsConfig, 'iqama' | 'adjustments'> {
  adjustments: PrayerAdjustments
  iqama: Iqama
}
