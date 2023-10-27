// eslint-ignore-next-line: @typescript-eslint/consistent-type-imports
import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  PrayerTimes,
  SunnahTimes,
} from 'adhan'
import { createConsola } from 'consola'
import type { ConsolaInstance } from 'consola'
import { AsrTime } from './types/AsrTime'
import type { CalculationsConfig, CustomMethod } from './types/CalculationsConfig'
import { Methods } from './types/Methods'
import { Formatter } from './Formatter'
import { HijriCalendar } from './types/HijriCalendar'

export class BaseCalculator {
  protected _prayerTimesCalculator!: PrayerTimes
  protected _qiyamTimesCalculator!: SunnahTimes
  protected _prayerConfig!: CalculationsConfig
  protected _qiyamConfig!: CalculationsConfig
  protected _logger!: ConsolaInstance

  constructor(config: CalculationsConfig) {
    this._logger = createConsola({
      level: config.debug ? 4 : 2,
      fancy: config.debug,
      formatOptions: {
        colors: true,
      },
    })
    this._initializer(config)
  }

  protected _initializer(config: CalculationsConfig) {
    this._prayerConfig = config
    const { date, latitude, longitude, method, ...paramsOptions } = this._prayerConfig

    if (date.toString() === 'Invalid Date') {
      throw new Error('You must provide a valid date')
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90')
    } else if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180')
    } else if (latitude === undefined && longitude === undefined) {
      throw new Error('You must provide a valid latitude and longitude')
    }
    // create a coordinate object
    const coordinates = new Coordinates(latitude, longitude)

    if (method === undefined) {
      this._logger.warn('No calculation method provided, using Umm Al Qura as default')
    }
    // create calculation params based on the method name
    const calculationParams = this._useMethod(method)

    // assigning adjustments if present in the config
    if (paramsOptions.adjustments) {
      Object.assign(calculationParams.adjustments, paramsOptions.adjustments)
    }

    // assigning asr time calculation method (notice we only do that for hanafi calculation since the default one is the jumhoor)
    if (paramsOptions.asrTime === AsrTime.HANAFI) {
      calculationParams.madhab = Madhab.Hanafi
    }

    // assigning high latitude rule
    calculationParams.highLatitudeRule = paramsOptions.highLatitudeRule || HighLatitudeRule.MiddleOfTheNight

    // assign polarCircleResolution
    calculationParams.polarCircleResolution = paramsOptions.polarCircleResolution || PolarCircleResolution.Unresolved

    // assign iqama calculation times
    this._prayerConfig.iqama = Object.assign(
      { fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }, // the default values
      paramsOptions.iqama // override by the config values
    )

    // creating the calculation object
    this._qiyamConfig = this._prayerConfig
    this._prayerTimesCalculator = new PrayerTimes(coordinates, date, calculationParams)
    this._qiyamTimesCalculator = new SunnahTimes(this._prayerTimesCalculator)
  }

  protected _useMethod(method: Methods | CustomMethod | undefined): CalculationParameters {
    if (method === Methods.UMM_AL_QURA) {
      return CalculationMethod.UmmAlQura()
    } else if (method === Methods.MUSLIM_WORLD_LEAGUE) {
      return CalculationMethod.MuslimWorldLeague()
    } else if (method === Methods.MOONSIGHTING_COMMITTEE) {
      return CalculationMethod.MoonsightingCommittee()
    } else if (method === Methods.KUWAIT) {
      return CalculationMethod.Kuwait()
    } else if (method === Methods.QATAR) {
      return CalculationMethod.Qatar()
    } else if (method === Methods.EGYPTIAN) {
      return CalculationMethod.Egyptian()
    } else if (method === Methods.KARACHI) {
      return CalculationMethod.Karachi()
    } else if (method === Methods.DUBAI) {
      return CalculationMethod.Dubai()
    } else if (method === Methods.SINGAPORE) {
      return CalculationMethod.Singapore()
    } else if (method === Methods.NORTH_AMERICA) {
      return CalculationMethod.NorthAmerica()
    } else if (method === Methods.TEHRAN) {
      return CalculationMethod.Tehran()
    } else if (method === Methods.TURKEY) {
      return CalculationMethod.Turkey()

      // Custom Methods
    } else if (
      method === Methods.STANDARD ||
      method === Methods.JORDAN ||
      method === Methods.LIBYA ||
      method === Methods.PALESTINE ||
      method === Methods.SUDAN
    ) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 18,
      })
    } else if (method === Methods.ALGERIA) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 17,
        methodAdjustments: {
          maghrib: 3,
        },
      })
    } else if (method === Methods.BAHRAIN) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 0,
        ishaInterval: 90,
      })
    } else if (method === Methods.BRUNEI || method === Methods.INDONESIA || method === Methods.MALAYSIA) {
      return this._pramsFromCustomMethod({
        fajrAngle: 20,
        ishaAngle: 18,
        methodAdjustments: {
          dhuhr: 1,
        },
      })
    } else if (method === Methods.FRANCE) {
      return this._pramsFromCustomMethod({
        fajrAngle: 12,
        ishaAngle: 12,
      })
    } else if (method === Methods.GERMANY) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 16.5,
      })
    } else if (method === Methods.IRAQ) {
      return this._pramsFromCustomMethod({
        fajrAngle: 19.5,
        ishaAngle: 17.5,
        methodAdjustments: {
          dhuhr: 7,
          asr: 7,
          maghrib: 4,
        },
      })
    } else if (method === Methods.MOROCCO) {
      return this._pramsFromCustomMethod({
        fajrAngle: 19,
        ishaAngle: 17,
        methodAdjustments: {
          dhuhr: 5,
          maghrib: 2,
        },
      })
    } else if (method === Methods.RUSSIA) {
      return this._pramsFromCustomMethod({
        fajrAngle: 16,
        ishaAngle: 15,
      })
    } else if (method === Methods.OMAN) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 18,
        methodAdjustments: {
          dhuhr: 5,
          asr: 5,
          maghrib: 5,
        },
      })
    } else if (method === Methods.SYRIA) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18.5,
        ishaAngle: 17.5,
        methodAdjustments: {
          sunrise: -7,
          dhuhr: 5,
          asr: 3,
          maghrib: 7,
        },
      })
    } else if (method === Methods.TUNISIA) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 18,
        methodAdjustments: {
          dhuhr: 7,
          maghrib: 2,
        },
      })
    } else if (method === Methods.YEMEN) {
      return this._pramsFromCustomMethod({
        fajrAngle: 18,
        ishaAngle: 17,
        methodAdjustments: {
          dhuhr: 2,
        },
      })
    } else if (typeof method === 'object') {
      // if we receive an object for custom calculation method
      return this._pramsFromCustomMethod(method)
    } else {
      // default is umm al qura
      return CalculationMethod.UmmAlQura()
    }
  }

  private _pramsFromCustomMethod(config: CustomMethod): CalculationParameters {
    const calculationParams = new CalculationParameters(
      'Other',
      config.fajrAngle || 18,
      config.ishaAngle || 18,
      config.ishaInterval || 0
    )
    if (config.methodAdjustments) {
      // assigning method adjustments
      Object.assign(calculationParams, {
        methodAdjustments: config.methodAdjustments,
      })
    }
    // return the params of the custom method
    return calculationParams
  }

  protected _adjustForRamadan(): boolean {
    const adjust = false
    const date = this._prayerConfig.date
    const method = this._prayerConfig.method
    const hijriFormatter = new Formatter({
      calendar: this._prayerConfig.hijriCalendar ?? HijriCalendar.UMM_AL_QURA,
      dateStyle: 'short',
    })
    const hijriMonth = hijriFormatter.formatDate(date).split('/')[0]
    // check if the month is ramadan
    if (parseInt(hijriMonth, 10) === 9) {
      if (method === Methods.UMM_AL_QURA || this._prayerConfig.adjustForRamadan) {
        return true
      }
    }
    return adjust
  }
}
