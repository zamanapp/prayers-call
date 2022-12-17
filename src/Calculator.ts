import { Coordinates, Prayer, Qibla } from 'adhan'
import { BaseCalculator } from './Base'
import type { CalculationsConfig } from './types/CalculationsConfig'
import type { CoordinatesObject } from './types/Coordinates'
import type { PrayerNamesType, TimeObject } from './types/TimeObject'

export class StaticCalculator extends BaseCalculator {
  constructor(config: CalculationsConfig) {
    super(config)
  }

  public getAllPrayerTimes(): TimeObject[] {
    return [
      {
        name: Prayer.Fajr,
        time: this._prayerTimesCalculator.fajr,
      },
      {
        name: Prayer.Sunrise,
        time: this._prayerTimesCalculator.sunrise,
      },
      {
        name: Prayer.Dhuhr,
        time: this._prayerTimesCalculator.dhuhr,
      },
      {
        name: Prayer.Asr,
        time: this._prayerTimesCalculator.asr,
      },
      {
        name: Prayer.Maghrib,
        time: this._prayerTimesCalculator.maghrib,
      },
      {
        name: Prayer.Isha,
        time: this._prayerTimesCalculator.isha,
      },
    ]
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
      latitude: this._prayerConfig.latitude,
      longitude: this._prayerConfig.longitude,
    }
  ): number {
    const coordinates = new Coordinates(latitude, longitude)
    return Qibla(coordinates)
  }

  public getCalculationOptions(): CalculationsConfig {
    return this._prayerConfig
  }

  public setCalculationOptions(newConfig: Partial<CalculationsConfig>) {
    this._prayerConfig = Object.assign(this._prayerConfig, newConfig)
    this._initializer(this._prayerConfig)
  }
}
