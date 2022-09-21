import { Coordinates, Prayer, Qibla } from 'adhan'
import { BaseCalculator } from './Base'
import type { CalculationsConfig } from './types/CalculationsConfig'
import type { CoordinatesObject } from './types/Coordinates'
import type { PrayerNamesType, PrayersTimeObject, TimeObject } from './types/TimeObject'

export class UseCalculator extends BaseCalculator {
  constructor(config: CalculationsConfig) {
    super(config)
  }

  public getAllPrayerTimes(): PrayersTimeObject {
    return {
      [Prayer.Fajr]: this._prayerTimesCalculator.fajr,
      [Prayer.Sunrise]: this._prayerTimesCalculator.sunrise,
      [Prayer.Dhuhr]: this._prayerTimesCalculator.dhuhr,
      [Prayer.Asr]: this._prayerTimesCalculator.asr,
      [Prayer.Maghrib]: this._prayerTimesCalculator.maghrib,
      [Prayer.Isha]: this._prayerTimesCalculator.isha,
    }
  }

  public getPrayerTime(prayer: PrayerNamesType): Date | null {
    return this._prayerTimesCalculator.timeForPrayer(prayer)
  }

  public getMiddleOfTheNightTime(): TimeObject {
    return { name: 'middleOfTheNight', time: this._qiyamTimesCalculator.middleOfTheNight }
  }

  public getLastThirdOfTheNightTime(): TimeObject {
    return { name: 'lastThirdOfTheNight', time: this._qiyamTimesCalculator.lastThirdOfTheNight }
  }

  /**
   * Get the direction, in degrees from North, of the Qibla from a given set of coordinates.
   * @param Coordinates - optionally pass latitude and longitude values as an object
   * @returns value representing the direction in degrees from North.
   */
  public getQiblaDirection(
    { latitude, longitude }: CoordinatesObject = {
      latitude: this._config.latitude,
      longitude: this._config.longitude,
    }
  ): number {
    const coordinates = new Coordinates(latitude, longitude)
    return Qibla(coordinates)
  }

  public getCalculationOptions(): CalculationsConfig {
    return this._config
  }

  public setCalculationOptions(newConfig: Partial<CalculationsConfig>) {
    this._config = Object.assign(this._config, newConfig)
    this._initializer(this._config)
  }
}
