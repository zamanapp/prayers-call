import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ciDetect from '@npmcli/ci-detect'
import { Methods, ReactiveCalculator } from '../../src'
import type { TimeEventObject } from '../../src'

// we disabled these tests in CI because they don't seem to stop
// false if not in CI
// otherwise, a string indicating the CI environment type
const isGithubCI = ciDetect() === 'github-actions'

describe.skipIf(isGithubCI)('ReactiveCalculator should work properly', () => {
  let prayerTimeEngine: ReactiveCalculator
  // understanding timers in jest is crucial: https://jestjs.io/docs/jest-object#mock-timers
  beforeEach(() => {
    // mock the date to be 1 January 2022
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2022, 0, 1))
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('Should change the date object for every new day', () => {
    prayerTimeEngine = new ReactiveCalculator({
      latitude: 2.9213,
      longitude: 101.6559,
      method: Methods.SINGAPORE,
      adjustments: { dhuhr: 3, asr: 3, isha: 2 },
      iqama: { fajr: 25 },
    })
    const NUMBER_OF_DAYS = 4
    const solarDayObserver = prayerTimeEngine.newSolarDayObserver()
    const expectedDates = [
      new Date('2022-01-01T16:00:00.000Z'),
      new Date('2022-01-02T16:00:00.000Z'),
      new Date('2022-01-03T16:00:00.000Z'),
    ]
    const dates: Date[] = []
    solarDayObserver.subscribe(() => {
      dates.push(prayerTimeEngine.getCalculationOptions().date)
    })
    vi.advanceTimersByTime(NUMBER_OF_DAYS * 24 * 60 * 60 * 1000) // 3 days
    expect(expectedDates).toStrictEqual(dates)
    expect(dates.length).toEqual(NUMBER_OF_DAYS - 1)
    prayerTimeEngine.cleanup()
  })

  it('Should notify subscribers when a new day comes', () => {
    prayerTimeEngine = new ReactiveCalculator({
      latitude: 2.9213,
      longitude: 101.6559,
      method: Methods.SINGAPORE,
      adjustments: { dhuhr: 3, asr: 3, isha: 2 },
      iqama: { fajr: 25 },
    })
    const NUMBER_OF_DAYS = 3
    let index = 0
    const solarDayObserver = prayerTimeEngine.newSolarDayObserver()
    solarDayObserver.subscribe((n) => {
      expect(n).toEqual(index)
      index++
    })
    vi.advanceTimersByTime(NUMBER_OF_DAYS * 24 * 60 * 60 * 1000) // 3 days
    expect(index).toEqual(NUMBER_OF_DAYS - 1)
    prayerTimeEngine.cleanup()
  })

  it('Should notifies subscribers of prayer times', () => {
    prayerTimeEngine = new ReactiveCalculator({
      latitude: 2.9213,
      longitude: 101.6559,
      method: Methods.SINGAPORE,
      adjustments: { dhuhr: 3, asr: 3, isha: 2 },
      iqama: { fajr: 25 },
    })
    const adhanObserver = prayerTimeEngine.adhanObserver()

    const expectedPrayerTimes = [
      { name: 'fajr', time: new Date('2021-12-31T21:55:00.000Z'), type: 'ADHAN' },
      { name: 'sunrise', time: new Date('2021-12-31T23:19:00.000Z'), type: 'ADHAN' },
      { name: 'dhuhr', time: new Date('2022-01-01T05:21:00.000Z'), type: 'ADHAN' },
      { name: 'asr', time: new Date('2022-01-01T08:45:00.000Z'), type: 'ADHAN' },
      { name: 'maghrib', time: new Date('2022-01-01T11:16:00.000Z'), type: 'ADHAN' },
      { name: 'isha', time: new Date('2022-01-01T12:33:00.000Z'), type: 'ADHAN' },
      { name: 'fajr', time: new Date('2021-12-31T21:55:00.000Z'), type: 'ADHAN' },
      { name: 'sunrise', time: new Date('2021-12-31T23:19:00.000Z'), type: 'ADHAN' },
      { name: 'dhuhr', time: new Date('2022-01-01T05:21:00.000Z'), type: 'ADHAN' },
      { name: 'asr', time: new Date('2022-01-01T08:45:00.000Z'), type: 'ADHAN' },
      { name: 'maghrib', time: new Date('2022-01-01T11:16:00.000Z'), type: 'ADHAN' },
      { name: 'isha', time: new Date('2022-01-01T12:33:00.000Z'), type: 'ADHAN' },
      { name: 'fajr', time: new Date('2021-12-31T21:55:00.000Z'), type: 'ADHAN' },
      { name: 'sunrise', time: new Date('2021-12-31T23:19:00.000Z'), type: 'ADHAN' },
      { name: 'dhuhr', time: new Date('2022-01-01T05:21:00.000Z'), type: 'ADHAN' },
      { name: 'asr', time: new Date('2022-01-01T08:45:00.000Z'), type: 'ADHAN' },
      { name: 'maghrib', time: new Date('2022-01-01T11:16:00.000Z'), type: 'ADHAN' },
      { name: 'isha', time: new Date('2022-01-01T12:33:00.000Z'), type: 'ADHAN' },
    ]
    const events: TimeEventObject[] = []
    adhanObserver.subscribe((prayerTime) => {
      events.push(prayerTime)
    })
    vi.advanceTimersByTime(3 * 24 * 60 * 60 * 1000) // 3 days
    expect(events).toStrictEqual(expectedPrayerTimes)
    expect(events.length).toEqual(expectedPrayerTimes.length)
    prayerTimeEngine.cleanup()
  })

  it('Should notify subscribers when new qiyam time enters')
  it('Should notify subscribers of iqama prayer times')
  it('Should notify subscribers of prayer times (adhan and iqama)')
})
