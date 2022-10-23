import { describe, expect, it } from 'vitest'
import { AsrTime, HighLatitudeRule, Methods, PolarCircleResolution, StaticCalculator } from '../../src'

describe('Configuration at creation time should work properly', () => {
  const prayerTimeEngine = new StaticCalculator({
    date: new Date(),
    latitude: 2.9213,
    longitude: 101.6559,
    method: Methods.SINGAPORE,
    adjustments: { dhuhr: 3, asr: 3, isha: 2 },
    asrTime: AsrTime.HANAFI,
    highLatitudeRule: HighLatitudeRule.SeventhOfTheNight,
    polarCircleResolution: PolarCircleResolution.AqrabYaum,
    iqama: { fajr: 25 },
  })

  it('should assign prayer times adjustments', () => {
    expect(prayerTimeEngine.getCalculationOptions().adjustments).toStrictEqual({
      dhuhr: 3,
      asr: 3,
      isha: 2,
    })
  })
  it('should assign Asr time', () => {
    expect(prayerTimeEngine.getCalculationOptions().asrTime).toBe(AsrTime.HANAFI)
  })
  it('should assign high latitude rule', () => {
    expect(prayerTimeEngine.getCalculationOptions().highLatitudeRule).toBe(HighLatitudeRule.SeventhOfTheNight)
  })
  it('should assign polar circle resolution', () => {
    expect(prayerTimeEngine.getCalculationOptions().polarCircleResolution).toBe(PolarCircleResolution.AqrabYaum)
  })
  it('should assign Iqama calculations', () => {
    expect(prayerTimeEngine.getCalculationOptions().iqama).toStrictEqual({
      fajr: 25,
      dhuhr: 10,
      asr: 10,
      maghrib: 5,
      isha: 15,
    })
  })
  it('should accept different calculation methods', () => {
    expect(prayerTimeEngine.getCalculationOptions().method).toBe(Methods.SINGAPORE)
  })
  it('should accept a custom calculation method', () => {
    const customPrayerTimeEngine = new StaticCalculator({
      date: new Date(),
      latitude: 2.9213,
      longitude: 101.6559,
      method: {
        fajrAngle: 17,
        methodAdjustments: { dhuhr: 3, asr: 3, isha: 2 },
      },
    })

    expect(customPrayerTimeEngine.getCalculationOptions().method).toStrictEqual({
      fajrAngle: 17,
      methodAdjustments: { dhuhr: 3, asr: 3, isha: 2 },
    })
  })
})
