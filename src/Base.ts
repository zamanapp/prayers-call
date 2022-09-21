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
import { AsrTime } from './types/AsrTime'
import type { CalculationsConfig, CustomMethod } from './types/CalculationsConfig'
import { Methods } from './types/Methods'

export class BaseCalculator {
  protected _prayerTimesCalculator!: PrayerTimes
  protected _qiyamTimesCalculator!: SunnahTimes
  protected _config!: CalculationsConfig

  constructor(config: CalculationsConfig) {
    this._initializer(config)
  }

  protected _initializer(config: CalculationsConfig) {
    this._config = config
    const { date, latitude, longitude, method, ...paramsOptions } = this._config as CalculationsConfig

    // create a coordinate object
    const coordinates = new Coordinates(latitude, longitude)

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
    this._config.iqama = Object.assign(
      { fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }, // the default values
      paramsOptions.iqama // override by the config values
    )

    // creating the calculation object
    this._prayerTimesCalculator = new PrayerTimes(coordinates, date, calculationParams)
    this._qiyamTimesCalculator = new SunnahTimes(this._prayerTimesCalculator)
  }

  private _useMethod(method: Methods | CustomMethod | undefined): CalculationParameters {
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
}
