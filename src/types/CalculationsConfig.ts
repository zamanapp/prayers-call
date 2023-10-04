import type { HighLatitudeRule, PolarCircleResolution } from 'adhan'
import type { Iqama } from './Iqama'
import type { AsrTime } from './AsrTime'
import type { Methods } from './Methods'
import type { PrayerAdjustments } from './PrayerAdjustments'
import type { ValueOf } from './TypesUtils'
import type { HijriCalendar } from './HijriCalendar'

// TODO: add a configuration to take into consideration the altitude of the location
// TODO: add a configuration to take into consideration daylight savings time
export interface CustomMethod {
  /**
   * Angle of the sun, in degrees, used to calculate Fajr
   * @defaultValue 18
   * */
  fajrAngle?: number
  /**
   * Angle of the sun, in degrees used to calculate Isha
   * @defaultValue 18
   * */
  ishaAngle?: number
  /**
   * Minutes after Maghrib (if set, ishaAngle would be ignored and the time for Isha will be Maghrib plus ishaInterval)
   * @defaultValue 0
   * */
  ishaInterval?: number
  /**
   * Angle of the sun, in degrees used to calculate Maghrib. only used by Tehran method
   * @defaultValue 0
   * */
  maghribAngle?: number
  /**
   * Custom adjustments, in minutes, for each prayer time specific to the method.
   * @defaultValue { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
   * */
  methodAdjustments?: Partial<PrayerAdjustments>
}

export interface CalculationsConfig {
  /**
   * The starting date for the calculations, in the local time zone. Can use past, current, or future dates.
   * @defaultValue new Date()
   * */
  date: Date
  /**
   * Latitude of the location, in degrees. Range: -90 to 90.
   * */
  latitude: number
  /**
   * Longitude of the location, in degrees. Range: -180 to 180.
   * */
  longitude: number
  /**
   * Method used for the calculation, see [Calculation methods](https://prayers-ts.netlify.app/config/methods.html)
   * @defaultValue Methods.UMM_AL_QURA
   * */
  method?: Methods | CustomMethod
  /**
   * Custom adjustments, in minutes, for each prayer time.
   * @defaultValue { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
   * */
  adjustments?: Partial<PrayerAdjustments>
  /**
   * Rule to use for calculating prayer times at high latitudes.
   * see [Advanced config](https://prayers-ts.netlify.app/config/config.html#advanced-configuration)
   * @defaultValue HighLatitudeRule.MiddleOfTheNight
   * */
  highLatitudeRule?: ValueOf<typeof HighLatitudeRule>
  /**
   * Whether to use the earlier (Jumhoor) or later (Hanafi) Asr time calculation.
   * @defaultValue AsrTime.JUMHOOR
   * */
  asrTime?: AsrTime
  /**
   * How to handle Midnight Sun & Polar Night days.
   * see [Advanced config](https://prayers-ts.netlify.app/config/config.html#advanced-configuration)
   * @defaultValue PolarCircleResolution.Unresolved
   * */
  polarCircleResolution?: ValueOf<typeof PolarCircleResolution>
  /**
   * Waiting time, in minutes, for iqama after the actual prayer time.
   * @defaultValue { fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }
   * */
  iqama?: Partial<Iqama>
  /**
   * Whether to adjust the prayer times for Ramadan by adding 30 minutes to Isha.
   * Done by default for Umm Al-Qura method
   * @defaultValue false
   */
  adjustForRamadan?: boolean
  /**
   * Hijri calendar to use in conjunction with adjustments for Ramadan to determine the first and last day of Ramadan.
   * @defaultValue HijriCalendar.UMM_AL_QURA
   */
  hijriCalendar?: HijriCalendar
  /**
   * If set to true will output logs that can be helpful for debugging
   * @defaultValue false
   */
  debug?: boolean
}

export type ReactiveCalculationsConfig = Omit<CalculationsConfig, 'date'>

export interface FinalCalculationsConfig extends Omit<CalculationsConfig, 'iqama' | 'adjustments'> {
  adjustments: PrayerAdjustments
  iqama: Iqama
}
