# Core Concepts

The Prayers.ts library provides two different types of calculators, a basic one time use calculator that can be used to calculate prayer times for any date (past, current and future). and a reactive realtime calculator that can be used to track events (adhan, iqama and other events) in realtime.

## One time Calculator

The `UseCalculator` accepts a date in it's initialization allowing you to get prayer times for any past, current or future date. This calculator however is not reactive. if you need realtime reactive prayer times calculations then read the [RealTime Reactive Calculator](#realtime-reactive-calculator) section.

```ts
import { Methods, UseCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const calculator = new UseCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getPrayerTimes()
```

For all the methods available to use with `UseCalculator` check the [One time Calculator](./one-time-calculator.md).

You can find all the configuration reference in the [Config](../config.md)

## RealTime Reactive Calculator

WIP

For all the methods available to use with `UseReactiveCalculator` check the [Reactive Calculator](./reactive-calculator.md).

You can find all the configuration reference in the [Config](../config.md)

## Date formatting

Because the results are outputted as a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object. There are a number of ways how you can format the date and time. For a thorough guide on how to formate your dates read the [formatters section](./formatters.md) guide. If you are looking to convert to a Hijri date follow the [Hijri Dates](./hijri.md) guide.
