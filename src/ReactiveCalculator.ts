import { Observable, defer, merge, timer } from 'rxjs'
import { repeat, repeatWhen } from 'rxjs/operators'
import { Coordinates, Prayer, Qibla } from 'adhan'

import { BaseCalculator } from './Base'
import type { CalculationsConfig, ReactiveCalculationConfig } from './types/CalculationsConfig'
import type { PrayerNamesType, PrayersTimeObject, TimeEventObject, TimeObject } from './types/TimeObject'
import type { CoordinatesObject } from './types/Coordinates'

// TODO: listen to events in the constructor and refresh the instances in the constructor

export class UseReactiveCalculator extends BaseCalculator {
  constructor(rConfig: ReactiveCalculationConfig) {
    const config: CalculationsConfig = {
      date: new Date(),
      ...rConfig,
    }
    super(config)
  }

  public getCurrentPrayerTime(): TimeObject {
    return {
      name: this._prayerTimesCalculator.currentPrayer(),
      time: this._prayerTimesCalculator.timeForPrayer(this._prayerTimesCalculator.currentPrayer()),
    }
  }

  public getNextPrayerTime(): TimeObject {
    return {
      name: this._prayerTimesCalculator.nextPrayer(),
      time: this._prayerTimesCalculator.timeForPrayer(this._prayerTimesCalculator.nextPrayer()),
    }
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

  // A function that would emit an event every time a prayer time is due
  private _adhanObserver(): Observable<any> {
    const prayerTimes = this.getAllPrayerTimes()
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      return new Observable((subscriber) => {
        let noPrayersLeftForToday = true
        const prayerTimesKeys = Object.keys(prayerTimes)
        // we capture the time when a subscription happens
        const timeAtSubscription = new Date()
        // we create value to emit based on the subscription time
        prayerTimesKeys.forEach((prayer, i) => {
          // calculate the delay needed to issue a prayer event starting from now
          const delay = prayerTimes[prayer as keyof PrayersTimeObject].getTime() - timeAtSubscription.getTime()
          // if the delay is positive (prayer time is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next(prayer)
              // if it's the last prayer we complete
              if (prayer === 'isha') {
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimesKeys.length - 1) {
            subscriber.next(Prayer.None)
            subscriber.complete()
          }
        })
      })
    })
  }

  protected _iqamaObserver(): Observable<any> {
    const prayerTimes = this.getAllPrayerTimes()
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      return new Observable((subscriber) => {
        let noPrayersLeftForToday = true
        const prayerTimesKeys = Object.keys(prayerTimes)
        // we capture the time when a subscription happens
        const timeAtSubscription = new Date()
        // we create value to emit based on the subscription time
        prayerTimesKeys.forEach((prayer, i) => {
          // calculate the delay needed to issue an iqama event starting from subscription time
          const delay =
            prayerTimes[prayer as keyof PrayersTimeObject].getTime() +
            this._config.iqama![prayer] * 60000 -
            timeAtSubscription.getTime()
          // if the delay is positive (iqama is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next(`iqama:${prayer}`)
              // if it's the last prayer we complete
              if (prayer === 'isha') {
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimesKeys.length - 1) {
            subscriber.next(`iqama:${Prayer.None}`)
            subscriber.complete()
          }
        })
      })
    })
  }

  protected _middleOfTheNightObserver(): Observable<any> {
    const middleOfTheNightTime = this._qiyamTimesCalculator.middleOfTheNight
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      return new Observable((subscriber) => {
        // we capture the time when a subscription happens
        const timeAtSubscription = new Date()
        // calculate the delay needed to issue a middleOfTheNight event starting from now
        const delay = middleOfTheNightTime.getTime() - timeAtSubscription.getTime()
        // if middle of the night time is in the future
        if (delay >= 0) {
          // we create an event based on the delay to announce the middle of the night
          setTimeout(() => {
            subscriber.next('middleOfTheNight')
            subscriber.complete()
          }, delay)
        } else {
          subscriber.complete()
        }
      })
    })
  }

  protected _LastThirdOfTheNightObserver() {
    const lastThirdOfTheNightTime = this._qiyamTimesCalculator.lastThirdOfTheNight
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      return new Observable((subscriber) => {
        // we capture the time when a subscription happens
        const timeAtSubscription = new Date()
        // calculate the delay needed to issue a lastThirdOfTheNight event starting from now
        const delay = lastThirdOfTheNightTime.getTime() - timeAtSubscription.getTime()
        // if last third of the night time is in the future
        if (delay >= 0) {
          // we create an event based on the delay to announce the last third of the night
          setTimeout(() => {
            subscriber.next('lastThirdOfTheNight')
            subscriber.complete()
          }, delay)
        } else {
          subscriber.complete()
        }
      })
    })
  }

  protected _newSolarDayObserver() {
    return defer(() => {
      const timeAtSubscription = new Date()
      const nextDay = new Date()
      // get the nearest midnight in future
      nextDay.setHours(24, 0, 0, 0)
      const initialDelay = nextDay.getTime() - timeAtSubscription.getTime()
      // repeat every 24 hours and 1 minute
      const repeat = 1000 * 60 * 60 * 24 + 1000 * 60 * 1
      return timer(initialDelay, repeat)
    })
  }

  protected _newQiyamObserver() {
    return defer(() => {
      const timeAtSubscription = new Date()
      const nextDay = new Date()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastThird = new Date(this.getLastThirdOfTheNightTime().time!)
      // get the nearest midnight in future
      nextDay.setHours(24, 0, 0, 0)
      const delay =
        nextDay.getTime() +
        // interval between midnight and last third of the night
        (lastThird.getTime() - nextDay.getTime()) -
        timeAtSubscription.getTime()
      return new Observable((subscriber) => {
        setTimeout(() => {
          subscriber.next('newQiyam')
          subscriber.complete()
        }, delay)
      })
    })
  }

  public listenToPrayerEvents() {
    return merge(
      this._adhanObserver(),
      this._iqamaObserver()
      // this._middleOfTheNightObserver(),
      // this._LastThirdOfTheNightObserver()
    )
      .pipe(repeatWhen(() => this._newSolarDayObserver()))
      .pipe(repeat())
  }
}
