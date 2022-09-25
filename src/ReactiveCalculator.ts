import { Observable, defer, merge, timer } from 'rxjs'
import { delay, repeat } from 'rxjs/operators'
import { Coordinates, Prayer, Qibla } from 'adhan'
import type { Subscriber } from 'rxjs'

import { BaseCalculator } from './Base'
import { EventType, TimesNames } from './types/TimeObject'
import type {
  CalculationsConfig,
  FinalCalculationsConfig,
  ReactiveCalculationsConfig,
} from './types/CalculationsConfig'
import type { PrayerNamesType, PrayersTimeObject, TimeEventObject, TimeObject } from './types/TimeObject'
import type { CoordinatesObject } from './types/Coordinates'
import type { Iqama } from './types/Iqama'

// TODO: create a logger and use debug mode to log a message

export class UseReactiveCalculator extends BaseCalculator {
  constructor(rConfig: ReactiveCalculationsConfig) {
    const config: CalculationsConfig = {
      date: new Date(),
      ...rConfig,
    }
    super(config)

    this._newSolarDayObserver().subscribe(() => {
      this._refreshPrayerCalculator()
    })

    this._newQiyamObserver().subscribe(() => {
      this._refreshQiyamCalculator()
    })
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

  public setCalculationOptions(newConfig: Partial<ReactiveCalculationsConfig>) {
    this._config = Object.assign(this._config, newConfig)
    this._initializer(this._config)
  }

  /**
   * this function observes the solar time and triggers and event each time we have a new day
   * as moon days end after maghrib, solar days end at midnight
   * this function is use to refresh the calculator
   * @returns
   */
  protected _newSolarDayObserver(): Observable<number> {
    return defer(() => {
      const timeAtSubscription = new Date()
      const nextDay = new Date()
      // get the nearest midnight in future
      nextDay.setHours(24, 0, 0, 0)
      const initialDelay = nextDay.getTime() - timeAtSubscription.getTime()
      // repeat every 24 hours and 1 minute
      const repeat = 1000 * 60 * 60 * 24 + 1000 * 60 * 1
      // will emit first value after nearest midnight (initialDelay) and subsequent values every 24 hours and 1 minutes after
      return timer(initialDelay, repeat)
    })
  }

  protected _newQiyamObserver(): Observable<TimeEventObject> {
    return defer(() => {
      const timeAtSubscription = new Date()
      const nextDay = new Date()
      // get the nearest midnight in future
      nextDay.setHours(24, 0, 0, 0)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastThirdOfTheNight = new Date(this.getLastThirdOfTheNightTime().time!)
      const delayValue =
        nextDay.getTime() -
        timeAtSubscription.getTime() +
        // interval between midnight and last third of the night
        (lastThirdOfTheNight.getTime() - nextDay.getTime())

      return new Observable((subscriber: Subscriber<TimeEventObject>) => {
        subscriber.next({
          name: TimesNames.LAST_THIRD_OF_THE_NIGHT,
          time: this._qiyamTimesCalculator.lastThirdOfTheNight,
          type: EventType.TRANSIENT,
        })
        subscriber.complete()
      }).pipe(delay(delayValue))
    }).pipe(repeat())
  }

  // A function that would emit an event every time a prayer time is due
  public adhanObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      const prayerTimes = this.getAllPrayerTimes()
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()
      let noPrayersLeftForToday = true

      return new Observable((subscriber: Subscriber<TimeEventObject>) => {
        const prayerTimesKeys = Object.keys(prayerTimes) as Array<keyof PrayersTimeObject>
        // we create value to emit based on the subscription time
        prayerTimesKeys.forEach((prayer, i) => {
          // calculate the delay needed to issue a prayer event starting from now
          const delay = prayerTimes[prayer].getTime() - timeAtSubscription.getTime()
          // if the delay is positive (prayer time is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next({
                name: prayer,
                time: prayerTimes[prayer],
                type: EventType.ADHAN,
              })
              // if it's the last prayer we complete
              if (prayer === 'isha') {
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimesKeys.length - 1) {
            subscriber.complete()
          }
        })
      })
    }).pipe(repeat({ delay: () => this._newSolarDayObserver() }))
  }

  public iqamaObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      const prayerTimes = this.getAllPrayerTimes()
      let noPrayersLeftForToday = true
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()

      return new Observable((subscriber: Subscriber<TimeEventObject>) => {
        const prayerTimesKeys = Object.keys(prayerTimes) as Array<keyof PrayersTimeObject>
        // we create value to emit based on the subscription time
        prayerTimesKeys.forEach((prayer, i) => {
          // calculate the delay needed to issue an iqama event starting from subscription time
          const delay =
            prayerTimes[prayer].getTime() +
            (this._config as FinalCalculationsConfig).iqama[prayer as keyof Iqama] * 60000 -
            timeAtSubscription.getTime()
          // if the delay is positive (iqama is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next({
                name: prayer,
                time: new Date(),
                type: EventType.IQAMA,
              })
              // if it's the last prayer we complete
              if (prayer === 'isha') {
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimesKeys.length - 1) {
            subscriber.complete()
          }
        })
      })
    }).pipe(repeat({ delay: () => this._newSolarDayObserver() }))
  }

  public qiyamTimesObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      const middleOfTheNightTime = this._qiyamTimesCalculator.middleOfTheNight
      const lastThirdOfTheNightTime = this._qiyamTimesCalculator.lastThirdOfTheNight
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()

      return new Observable((subscriber: Subscriber<TimeEventObject>) => {
        // calculate the delay needed to issue a middleOfTheNight event starting from now
        const middleDelay = middleOfTheNightTime.getTime() - timeAtSubscription.getTime()
        // calculate the delay needed to issue a lastThirdOfTheNight event starting from now
        const lastDelay = lastThirdOfTheNightTime.getTime() - timeAtSubscription.getTime()
        // if middle of the night time is in the future
        if (middleDelay >= 0) {
          // we create an event based on the delay to announce the middle of the night
          setTimeout(() => {
            subscriber.next({
              name: TimesNames.MIDDLE_OF_THE_NIGHT,
              time: middleOfTheNightTime,
              type: EventType.TRANSIENT,
            })
            subscriber.complete()
          }, middleDelay)
        }
        if (lastDelay >= 0) {
          // we create an event based on the delay to announce the last third of the night
          setTimeout(() => {
            subscriber.next({
              name: TimesNames.LAST_THIRD_OF_THE_NIGHT,
              time: lastThirdOfTheNightTime,
              type: EventType.TRANSIENT,
            })
            subscriber.complete()
          }, lastDelay)
        }
        // we end the subscription
        subscriber.complete()
      })
    }).pipe(repeat({ delay: () => this._newQiyamObserver() }))
  }

  public prayerEventsObserver() {
    return merge(this.adhanObserver(), this.iqamaObserver())
  }
}
