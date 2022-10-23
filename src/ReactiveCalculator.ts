import { Observable, defer, merge, timer } from 'rxjs'
import { delay, repeat } from 'rxjs/operators'
import { Coordinates, Prayer, Qibla } from 'adhan'
import type { Subscriber, Subscription } from 'rxjs'

import { BaseCalculator } from './Base'
import { EventType, TimesNames } from './types/TimeObject'
import type {
  CalculationsConfig,
  FinalCalculationsConfig,
  ReactiveCalculationsConfig,
} from './types/CalculationsConfig'
import type { PrayerNamesType, TimeEventObject, TimeObject } from './types/TimeObject'
import type { CoordinatesObject } from './types/Coordinates'
import type { Iqama } from './types/Iqama'

// TODO: create a logger and use debug mode to log a message

export class ReactiveCalculator extends BaseCalculator {
  private _solarDaySubscription: Subscription | undefined
  private _qiyamSubscription: Subscription | undefined

  constructor(rConfig: ReactiveCalculationsConfig) {
    const config: CalculationsConfig = {
      date: new Date(),
      ...rConfig,
    }
    super(config)
  }

  public init() {
    this._solarDaySubscription = this.newSolarDayObserver().subscribe(() => {
      this._refreshPrayerCalculator()
    })

    this._qiyamSubscription = this.newQiyamObserver().subscribe(() => {
      this._refreshQiyamCalculator()
    })
  }

  public destroy() {
    this._solarDaySubscription?.unsubscribe()
    this._qiyamSubscription?.unsubscribe()
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
  public newSolarDayObserver(): Observable<number> {
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

  public newQiyamObserver(): Observable<TimeEventObject> {
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
        // we create value to emit based on the subscription time
        prayerTimes.forEach((prayer, i) => {
          // calculate the delay needed to issue a prayer event starting from now
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const delay = prayer.time!.getTime() - timeAtSubscription.getTime()
          // if the delay is positive (prayer time is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next({
                name: prayer.name,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                time: prayer.time!,
                type: EventType.ADHAN,
              })
              // if it's the last prayer we complete
              if (prayer.name === 'isha') {
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimes.length - 1) {
            subscriber.complete()
          }
        })
      })
    }).pipe(repeat({ delay: () => this.newSolarDayObserver() }))
  }

  public iqamaObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      const prayerTimes = this.getAllPrayerTimes()
      let noPrayersLeftForToday = true
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()

      return new Observable((subscriber: Subscriber<TimeEventObject>) => {
        // we create value to emit based on the subscription time
        prayerTimes.forEach((prayer, i) => {
          // calculate the delay needed to issue an iqama event starting from subscription time
          const delay =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            prayer.time!.getTime() +
            (this._config as FinalCalculationsConfig).iqama[prayer.name as keyof Iqama] * 60000 -
            timeAtSubscription.getTime()
          // if the delay is positive (iqama is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next({
                name: prayer.name,
                time: new Date(),
                type: EventType.IQAMA,
              })
              // if it's the last prayer we complete
              if (prayer.name === 'isha') {
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimes.length - 1) {
            subscriber.complete()
          }
        })
      })
    }).pipe(repeat({ delay: () => this.newSolarDayObserver() }))
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
    }).pipe(repeat({ delay: () => this.newQiyamObserver() }))
  }

  public prayerEventsObserver() {
    return merge(this.adhanObserver(), this.iqamaObserver())
  }
}
