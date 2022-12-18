import { Observable, defer, merge, timer } from 'rxjs'
import { delay, repeat } from 'rxjs/operators'
import { Coordinates, Prayer, PrayerTimes, Qibla, SunnahTimes } from 'adhan'
import { Logger } from 'tslog'
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
import { subscriptionsSymbols } from './types/Subscriptions'

export class ReactiveCalculator extends BaseCalculator {
  private _subscriptions = new Map<symbol, Subscription>()
  private _prayerTimes!: TimeObject[]
  private _currentPrayer!: TimeObject
  private _nextPrayer!: TimeObject
  private _middleOfTheNight!: TimeObject
  private _thirdOfTheNight!: TimeObject
  private _initialized = false

  constructor(rConfig: ReactiveCalculationsConfig) {
    const config: CalculationsConfig = {
      date: new Date(),
      ...rConfig,
    }
    super(config)

    this._logger = new Logger({
      name: `ReactiveCalculator-${Math.random().toString(36).slice(-6)}`,
      minLevel: config.debug ? 2 : 4,
      prefix: ['ReactiveCalculator:'],
    })

    this._logger.debug('logger initialized successfully.')

    this._setup()
  }

  private _setup() {
    this._logger.debug('_setup function invoked...')
    // initially we populate the properties.
    this._logger.debug('calculating prayer and sunnah times...')
    this._calculatePrayerTimes()
    this._calculateCurrentPrayer()
    this._calculateNextPrayer()
    this._calculateMiddleOfTheNight()
    this._calculateThirdOfTheNight()

    // we subscribe to time changes and update what needs to be updated

    this._logger.debug('setting internal new day subscription...')
    // the first two subscription are created in isolation so that we keep them throughout the life of the object
    this._subscriptions.set(
      subscriptionsSymbols.NEW_SOLAR_DAY_SUBSCRIPTION,
      this.newSolarDayObserver().subscribe((e) => {
        this._logger.debug('_setup new day event triggered:', e)
        this._refreshPrayerCalculator()
        this._calculatePrayerTimes()
        this._calculateCurrentPrayer()
        this._calculateNextPrayer()
      })
    )
    this._logger.debug(`map size: ${this._subscriptions.size}`)

    this._logger.debug('setting internal new qiyam subscription...')
    this._subscriptions.set(
      subscriptionsSymbols.NEW_QIYAM_SUBSCRIPTION,
      this.newQiyamObserver().subscribe((e) => {
        this._logger.debug('_setup new qiyam event triggered:', e)
        this._refreshQiyamCalculator()
        this._calculateMiddleOfTheNight()
        this._calculateThirdOfTheNight()
      })
    )
    this._logger.debug(`map size: ${this._subscriptions.size}`)

    this._logger.debug('setting internal adhan subscription...')
    this._subscriptions.set(
      subscriptionsSymbols.ADHAN_SUBSCRIPTION,
      this.adhanObserver().subscribe((e) => {
        this._logger.debug('_setup adhan event triggered:', e)
        this._calculateCurrentPrayer()
        this._calculateNextPrayer()
      })
    )
    this._logger.debug(`map size: ${this._subscriptions.size}`)

    this._initialized = true
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    // create proxies that handel future changes to the configs
    // every time a value in the config is set it will trigger the handler
    // notice that this includes the `_refreshPrayerCalculator`. in a sense it's recursive but future recursion
    that._logger.debug('setting up _prayerConfig set trap...')
    this._prayerConfig = new Proxy(this._prayerConfig, {
      set<K extends keyof CalculationsConfig>(config: CalculationsConfig, property: K, newVal: CalculationsConfig[K]) {
        const oldVal = config[property]
        config[property] = newVal
        if (that._initialized && oldVal !== newVal) {
          that._logger.debug('_prayerConfig set trap triggered')
          const { date, latitude, longitude, method } = config

          // create a coordinate object
          const coordinates = new Coordinates(latitude, longitude)

          // create calculation params based on the method name
          const calculationParams = that._useMethod(method)

          that._logger.debug('creating a new _prayerTimesCalculator object')
          // creating the calculation object
          that._prayerTimesCalculator = new PrayerTimes(coordinates, date, calculationParams)
          // clean old subscriptions
          that._logger.debug(
            `unsubscribing and cleaning new day and adhan subscriptions. current map size: ${that._subscriptions.size}`
          )
          that._subscriptions.get(subscriptionsSymbols.NEW_SOLAR_DAY_SUBSCRIPTION)?.unsubscribe()
          that._subscriptions.delete(subscriptionsSymbols.NEW_SOLAR_DAY_SUBSCRIPTION)
          that._subscriptions.get(subscriptionsSymbols.ADHAN_SUBSCRIPTION)?.unsubscribe()
          that._subscriptions.delete(subscriptionsSymbols.ADHAN_SUBSCRIPTION)
          that._logger.debug(`cleaning done. current map size: ${that._subscriptions.size}`)
          // create new ones
          that._logger.debug('creating a new subscription for new solar day...')
          that._subscriptions.set(
            subscriptionsSymbols.NEW_SOLAR_DAY_SUBSCRIPTION,
            that.newSolarDayObserver().subscribe((e) => {
              that._logger.debug('proxy<_prayerConfig> new day event triggered:', e)
              that._refreshPrayerCalculator()
              that._calculatePrayerTimes()
              that._calculateCurrentPrayer()
              that._calculateNextPrayer()
            })
          )
          that._logger.debug(`map size: ${that._subscriptions.size}`)
          that._logger.debug('creating a new subscription for adhan...')
          that._subscriptions.set(
            subscriptionsSymbols.ADHAN_SUBSCRIPTION,
            that.adhanObserver().subscribe((e) => {
              that._logger.debug('proxy<_prayerConfig> adhan event triggered:', e)
              that._calculateCurrentPrayer()
              that._calculateNextPrayer()
            })
          )
          that._logger.debug(`map size: ${that._subscriptions.size}`)
          // recalculate values
          that._logger.debug('recalculating prayer times...')
          that._calculatePrayerTimes()
          that._calculateCurrentPrayer()
          that._calculateNextPrayer()
        }
        return true
      },
    })

    that._logger.debug('setting up _qiyamConfig set trap...')
    this._qiyamConfig = new Proxy(this._qiyamConfig, {
      set<K extends keyof CalculationsConfig>(config: CalculationsConfig, property: K, newVal: CalculationsConfig[K]) {
        const oldVal = config[property]
        ;(config[property] as typeof oldVal) = newVal

        if (that._initialized && oldVal !== newVal) {
          that._logger.debug('_qiyamConfig set trap triggered')
          const { date, latitude, longitude, method } = config

          // create a coordinate object
          const coordinates = new Coordinates(latitude, longitude)

          // create calculation params based on the method name
          const calculationParams = that._useMethod(method)

          // creating the calculation object
          const prayerTimesCalculator = new PrayerTimes(coordinates, date, calculationParams)
          that._logger.debug('creating a new _qiyamTimesCalculator object')
          that._qiyamTimesCalculator = new SunnahTimes(prayerTimesCalculator)
          // clean old subscriptions
          that._logger.debug(
            `unsubscribing and cleaning new qiyam subscription. current map size: ${that._subscriptions.size}`
          )
          that._subscriptions.get(subscriptionsSymbols.NEW_QIYAM_SUBSCRIPTION)?.unsubscribe()
          that._subscriptions.delete(subscriptionsSymbols.NEW_QIYAM_SUBSCRIPTION)
          that._logger.debug(`cleaning done. current map size: ${that._subscriptions.size}`)
          // create new ones
          that._logger.debug('creating a new subscription for new qiyam...')
          that._subscriptions.set(
            subscriptionsSymbols.NEW_QIYAM_SUBSCRIPTION,
            that.newQiyamObserver().subscribe((e) => {
              that._logger.debug('proxy<_qiyamConfig> new qiyam event triggered:', e)
              that._refreshQiyamCalculator()
              that._calculateMiddleOfTheNight()
              that._calculateThirdOfTheNight()
            })
          )
          that._logger.debug(`map size: ${that._subscriptions.size}`)
          // recalculate values
          that._logger.debug('recalculating sunnah times')
          that._calculateMiddleOfTheNight()
          that._calculateThirdOfTheNight()
        }
        return true
      },
    })
  }

  private _calculatePrayerTimes() {
    this._logger.debug('_calculatePrayerTimes function invoked.')
    this._prayerTimes = [
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

  private _calculateCurrentPrayer() {
    this._logger.debug('_calculateCurrentPrayer function invoked.')
    this._currentPrayer = {
      name: this._prayerTimesCalculator.currentPrayer(),
      time: this._prayerTimesCalculator.timeForPrayer(this._prayerTimesCalculator.currentPrayer())!,
    }
  }

  private _calculateNextPrayer() {
    this._logger.debug('_calculateNextPrayer function invoked.')
    this._nextPrayer = {
      name: this._prayerTimesCalculator.nextPrayer(),
      time: this._prayerTimesCalculator.timeForPrayer(this._prayerTimesCalculator.nextPrayer())!,
    }
  }

  private _calculateMiddleOfTheNight() {
    this._logger.debug('_calculateMiddleOfTheNight function invoked.')
    this._middleOfTheNight = { name: 'middleOfTheNight', time: this._qiyamTimesCalculator.middleOfTheNight }
  }

  private _calculateThirdOfTheNight() {
    this._logger.debug('_calculateThirdOfTheNight function invoked.')
    this._thirdOfTheNight = { name: 'lastThirdOfTheNight', time: this._qiyamTimesCalculator.lastThirdOfTheNight }
  }

  public cleanup() {
    this._logger.debug('cleanup function invoked.')
    this._subscriptions.forEach((s) => s.unsubscribe())
    this._subscriptions.clear()
    this._logger.debug(`Cleanup done. map size: ${this._subscriptions.size}`)
  }

  public getCurrentPrayerTime(): TimeObject {
    return this._currentPrayer
  }

  public getNextPrayerTime(): TimeObject {
    return this._nextPrayer
  }

  public getAllPrayerTimes(): TimeObject[] {
    return this._prayerTimes
  }

  public getPrayerTime(prayer: PrayerNamesType): Date | null {
    return this._prayerTimesCalculator.timeForPrayer(prayer)
  }

  public getMiddleOfTheNightTime(): TimeObject {
    return this._middleOfTheNight
  }

  public getLastThirdOfTheNightTime(): TimeObject {
    return this._thirdOfTheNight
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

  public setCalculationOptions(newConfig: Partial<ReactiveCalculationsConfig>) {
    this._logger.debug('setCalculationOptions function invoked with the following arg', newConfig)
    // changing the config should trigger the set traps via the proxy
    this._prayerConfig = Object.assign(this._prayerConfig, newConfig)
    this._qiyamConfig = Object.assign(this._qiyamConfig, newConfig)
  }

  /**
   * this function observes the solar time and triggers and event each time we have a new day
   * as moon days end after maghrib, solar days end at midnight
   * this function is use to refresh the calculator
   * @returns
   */
  public newSolarDayObserver(): Observable<number> {
    return defer(() => {
      this._logger.debug(`subscription made for new solar day. subscription map size: ${this._subscriptions.size}`)
      const timeAtSubscription = new Date()
      const nextDay = new Date()
      // get the nearest midnight in future
      nextDay.setHours(24, 0, 0, 0)
      const initialDelay = nextDay.getTime() - timeAtSubscription.getTime()
      // repeat every 24 hours and 1 minute
      const repeat = 1000 * 60 * 60 * 24 + 1000 * 60 * 1
      // will emit first value after nearest midnight (initialDelay) and subsequent values every 24 hours and 1 minutes after
      this._logger.debug(`initial delay is set to: ${initialDelay} ms`)
      return timer(initialDelay, repeat)
    })
  }

  public newQiyamObserver(): Observable<TimeEventObject> {
    return defer(() => {
      this._logger.debug(`subscription made for new qiyam. subscription map size: ${this._subscriptions.size}`)
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

      this._logger.debug(`delay is set to: ${delayValue} ms`)
      const internalObserver = new Observable((subscriber: Subscriber<TimeEventObject>) => {
        subscriber.next({
          name: TimesNames.LAST_THIRD_OF_THE_NIGHT,
          time: this._qiyamTimesCalculator.lastThirdOfTheNight,
          type: EventType.TRANSIENT,
        })
        subscriber.complete()
      })

      return internalObserver.pipe(delay(delayValue)).pipe(repeat())
    })
  }

  // A function that would emit an event every time a prayer time is due
  public adhanObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      this._logger.debug(`subscription made for adhan. subscription map size: ${this._subscriptions.size}`)
      const prayerTimes = this.getAllPrayerTimes()
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()
      let noPrayersLeftForToday = true

      // create the inner observable
      const innerObservable = new Observable((subscriber: Subscriber<TimeEventObject>) => {
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
              this._logger.debug(`emitting next adhan event: ${prayer.name}`)
              subscriber.next({
                name: prayer.name,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                time: prayer.time!,
                type: EventType.ADHAN,
              })
              // if it's the last prayer we complete
              if (prayer.name === 'isha') {
                this._logger.debug('adhan subscription complete.')
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimes.length - 1) {
            subscriber.complete()
          }
        })
      })

      // apply the repeat operator to the inner observable
      return innerObservable.pipe(repeat({ delay: () => this.newSolarDayObserver() }))
    })
  }

  public iqamaObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      this._logger.debug(`subscription made for iqama. subscription map size: ${this._subscriptions.size}`)
      const prayerTimes = this.getAllPrayerTimes()
      let noPrayersLeftForToday = true
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()

      const innerObservable = new Observable((subscriber: Subscriber<TimeEventObject>) => {
        // we create value to emit based on the subscription time
        prayerTimes.forEach((prayer, i) => {
          // calculate the delay needed to issue an iqama event starting from subscription time
          const delay =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            prayer.time!.getTime() +
            (this._prayerConfig as FinalCalculationsConfig).iqama[prayer.name as keyof Iqama] * 60000 -
            timeAtSubscription.getTime()
          // if the delay is positive (iqama is in the future) we create a value to emit
          if (delay >= 0) {
            noPrayersLeftForToday = false
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              this._logger.debug(`emitting next iqama event: ${prayer.name}`)
              subscriber.next({
                name: prayer.name,
                time: new Date(),
                type: EventType.IQAMA,
              })
              // if it's the last prayer we complete
              if (prayer.name === 'isha') {
                this._logger.debug('iqama subscription complete.')
                subscriber.complete()
              }
            }, delay)
          }

          if (noPrayersLeftForToday && i === prayerTimes.length - 1) {
            this._logger.debug('iqama subscription complete again.')
            subscriber.complete()
          }
        })
      })
      return innerObservable.pipe(repeat({ delay: () => this.newSolarDayObserver() }))
    })
  }

  public qiyamTimesObserver(): Observable<TimeEventObject> {
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      this._logger.debug(`subscription made for qiyam times. subscription map size: ${this._subscriptions.size}`)
      const middleOfTheNightTime = this._qiyamTimesCalculator.middleOfTheNight
      const lastThirdOfTheNightTime = this._qiyamTimesCalculator.lastThirdOfTheNight
      // we capture the time when a subscription happens
      const timeAtSubscription = new Date()

      const innerObserver = new Observable((subscriber: Subscriber<TimeEventObject>) => {
        // calculate the delay needed to issue a middleOfTheNight event starting from now
        const middleDelay = middleOfTheNightTime.getTime() - timeAtSubscription.getTime()
        // calculate the delay needed to issue a lastThirdOfTheNight event starting from now
        const lastDelay = lastThirdOfTheNightTime.getTime() - timeAtSubscription.getTime()
        // if middle of the night time is in the future
        if (middleDelay >= 0) {
          // we create an event based on the delay to announce the middle of the night
          setTimeout(() => {
            this._logger.debug('emitting middle of the night event.')
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
            this._logger.debug('emitting last third event.')
            subscriber.next({
              name: TimesNames.LAST_THIRD_OF_THE_NIGHT,
              time: lastThirdOfTheNightTime,
              type: EventType.TRANSIENT,
            })
            subscriber.complete()
          }, lastDelay)
        }
        // we end the subscription
        this._logger.debug('qiyam times subscription complete.')
        subscriber.complete()
      })

      return innerObserver.pipe(repeat({ delay: () => this.newQiyamObserver() }))
    })
  }

  public prayerEventsObserver() {
    return merge(this.adhanObserver(), this.iqamaObserver())
  }

  private _refreshPrayerCalculator() {
    this._logger.debug('_refreshPrayerCalculator function invoked.')
    // changing the config should trigger the set trap via the proxy
    this._prayerConfig = Object.assign(this._prayerConfig, {
      date: new Date(), // refresh the date
    })
  }

  private _refreshQiyamCalculator() {
    this._logger.debug('_refreshQiyamCalculator function invoked.')
    // changing the config should trigger the set trap via the proxy
    this._qiyamConfig = Object.assign(this._qiyamConfig, {
      date: new Date(), // refresh the date
    })
  }
}
