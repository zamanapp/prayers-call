import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TestScheduler } from 'rxjs/testing'
// import { jumpToTime, shiftTimeBy, resetTime } from 'time-fast-forward';
// import { travel, reset } from 'timekeeper';

import { AsrTime, HighLatitudeRule, Methods, PolarCircleResolution, ReactiveCalculator } from '../../src'
import { expectedMarbleGenerator } from './TestsHelper'

describe('Reactive prayer events should be fired properly', () => {
  let testScheduler: TestScheduler
  let prayerTimeEngine: ReactiveCalculator
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

  it.skip('should emit prayer times events', () =>
    new Promise((resolve) => {
      const now = new Date()
      const THREE_DAYS = 1000 * 60 * 60 * 24 * 3 // 259200000ms = 3d
      const later = new Date(now.getTime() + THREE_DAYS)

      testScheduler.run(({ expectObservable }) => {
        // console.log('Starting...', now.toTimeString(), now.toDateString())
        prayerTimeEngine = new ReactiveCalculator({
          latitude: 2.9213,
          longitude: 101.6559,
          method: Methods.SINGAPORE,
          adjustments: { dhuhr: 3, asr: 3, isha: 2 },
          asrTime: AsrTime.JUMHOOR,
          highLatitudeRule: HighLatitudeRule.SeventhOfTheNight,
          polarCircleResolution: PolarCircleResolution.AqrabYaum,
          iqama: { fajr: 25 },
        })
        const expectedMarble = '-a-----c---|'
        // const expectedMarble = expectedMarbleGenerator(prayerTimeEngine, now, later)
        const prayersTimeSource$ = prayerTimeEngine.prayerEventsObserver()
        // console.log('before time moves')
        // move time forward
        // travel(later);
        // console.log('after time moves')
        expectObservable(prayersTimeSource$).toBe(expectedMarble)
        resolve(true)
        // console.log('after assertion')
        // console.log('Finished...', vi.getTimerCount())
      })
    }))
})
