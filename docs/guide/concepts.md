# Core Concepts

The prayers-call library offers two distinct types of calculators:

[Static Calculator](#static-calculator): Ideal for one-time calculations, this calculator can determine prayer times for any date—past, present, or future.

[Reactive Calculator](#reactive-calculator): Designed for real-time tracking, this calculator allows you to monitor events like Adhan and Iqama as they happen.

Each serves a unique purpose, enabling you to choose the best fit for your application's needs.

## Static Calculator

The `StaticCalculator` is initialized with a specific date, allowing you to obtain prayer times for any date — be it past, present, or future. Note that this calculator is not designed for real-time, reactive calculations. For that, refer to the [RealTime Reactive Calculator](#reactive-calculator) section.

```ts
import { Methods, StaticCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getPrayerTimes()
```

For a detailed list of available functions within th `StaticCalculator` class, consult the [One time Calculator](./one-time-calculator.md) documentation.

For configuration options, refer to the [Config](../config/config.md) section.

## Reactive Calculator

The `ReactiveCalculator` is designed for real-time monitoring of prayer times. It provides a set of functions that allow you to subscribe to events, such as the Adhan, and execute specific logic when these events occur.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const adhanSubscription = reactiveCalculator.adhanObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} prayer entered`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// ...

// Cleanup when needed
reactiveCalculator.cleanup()
adhanSubscription.unsubscribe()
```

For a detailed list of available functions within the `ReactiveCalculator` class, consult the [Reactive Calculator](./reactive-calculator.md) documentation.

For configuration options, refer to the [Config](../config/config.md) section.

## Date formatting

The prayer times are returned as JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects. offering you flexibility in formatting the date and time.

For a detailed guide on how to format these Date objects, consult the [Date/Time Formatting](../recipes/formatters.md) guide.

If you wish to convert the dates to the Hijri calendar or internationalize your dates and time, refer to the [Hijri Dates](./hijri.md) and [Internalization (I18n)](../recipes/i18n.md) guides respectively.
