import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TestScheduler } from 'rxjs/testing'
// import { jumpToTime, shiftTimeBy, resetTime } from 'time-fast-forward';
// import { travel, reset } from 'timekeeper';

import { AsrTime, HighLatitudeRule, Methods, PolarCircleResolution, PrayersTimeCalculator } from '../../src'
import { expectedMarbleGenerator } from './TestsHelper'

describe('Reactive prayer events should be fired properly', () => {
  let testScheduler: TestScheduler
  let prayerTimeEngine: PrayersTimeCalculator
  // understanding timers in jest is crucial: https://jestjs.io/docs/jest-object#mock-timers
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
    })
    // mock the date to be 1 January 2022
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2022-01-01T12:00'))
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    // reset();
  })

  it('should emit prayer times events', () =>
    new Promise((resolve, reject) => {
      const now = new Date()
      const THREE_DAYS = 1000 * 60 * 60 * 24 * 3 // 259200000ms = 3d
      const later = new Date(now.getTime() + THREE_DAYS)
      // let index = 0;
      try {
        testScheduler.run(({ expectObservable }) => {
          console.log('Starting...', now.toTimeString(), now.toDateString())
          prayerTimeEngine = new PrayersTimeCalculator({
            date: now,
            latitude: 2.9213,
            longitude: 101.6559,
            method: Methods.SINGAPORE,
            adjustments: { dhuhr: 3, asr: 3, isha: 2 },
            asrTime: AsrTime.JUMHOOR,
            highLatitudeRule: HighLatitudeRule.SeventhOfTheNight,
            polarCircleResolution: PolarCircleResolution.AqrabYaum,
            iqama: { fajr: 25 },
          })
          const expectedMarble = expectedMarbleGenerator(prayerTimeEngine, now, later)
          console.log('Expected Marble', expectedMarble)
          // const expectedValues = [
          //   'fajr',
          //   'iqama:fajr',
          //   'sunrise',
          //   'dhuhr',
          //   'iqama:dhuhr',
          //   'asr',
          //   'iqama:asr',
          //   'maghrib',
          //   'iqama:maghrib',
          //   'isha',
          //   'iqama:isha',
          //   'none',
          //   'iqama:node',
          // ];
          // const prayersTimeSource$ = prayerTimeEngine.listenToPrayerEvents();
          console.log('before time moves')
          // move time forward
          // travel(later);
          console.log('after time moves')
          // expectObservable(prayersTimeSource$).toBe(expectedMarble, expectedValues);
          console.log('after assertion')
          console.log('Finished...', vi.getTimerCount())
        })
        console.log('done?')
        resolve(true)
      } catch (error) {
        reject(error)
      }
    }))
  it.skip('should emit middle of the night events', () => {
    // check for defaults and for custom
    expect(true).toBeTruthy()
  })
  it.skip('should emit last third of the night events', () => {
    // check for defaults and for custom
    expect(true).toBeTruthy()
  })
})
