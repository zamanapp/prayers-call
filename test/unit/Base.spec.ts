import { describe, expect, it } from 'vitest'

import { BaseCalculator } from '../../src/Base'
import { Methods } from '../../src/types/Methods'
import type { CalculationsConfig } from '../../src'

class TestableBaseCalculator extends BaseCalculator {
  constructor(config: CalculationsConfig) {
    super(config)
  }

  public adjustForRamadan(): boolean {
    return this._adjustForRamadan()
  }
}

const baseCalculatorOutR = new TestableBaseCalculator({
  date: new Date(2021, 3, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
})

const baseCalculatorInR = new TestableBaseCalculator({
  date: new Date(2021, 4, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustForRamadan: false,
})

const baseCalculatorInRA = new TestableBaseCalculator({
  date: new Date(2021, 4, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustForRamadan: true,
})

const baseCalculatorInRUm = new TestableBaseCalculator({
  date: new Date(2021, 4, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.UMM_AL_QURA,
  adjustForRamadan: false,
})

describe('Base Functions should work as expected', () => {
  it('Should return false outside of Ramadan', () => {
    expect(baseCalculatorOutR.adjustForRamadan()).toBe(false)
  })

  it("Should return false in Ramadan when we don't want to adjustment", () => {
    expect(baseCalculatorInR.adjustForRamadan()).toBe(false)
  })

  it('Should return true in Ramadan when we want to adjustment', () => {
    expect(baseCalculatorInRA.adjustForRamadan()).toBe(true)
  })

  it('Should return true when using UMM_AL_QURA regardless of settings passed for adjustment', () => {
    expect(baseCalculatorInRUm.adjustForRamadan()).toBe(true)
  })
})
