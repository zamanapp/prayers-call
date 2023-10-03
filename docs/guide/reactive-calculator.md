# Reactive Calculator

The `ReactiveCalculator` provides real-time notifications for prayer times and related events. Unlike the `StaticCalculator`, it initializes with the current date and time, offering both up-to-date prayer times and observables for event notifications. It also self-updates its internal configuration and prayer times so you always get real time up to date calculations, prayer times and notifications.

## Available Functions

### `getCurrentPrayerTime`

Returns a [`TimeObject`]() with the name and Adhan time of the current prayer. If the invocation time is past Isha, the returned value would be `{ name: "none", time: null }`.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getCurrentPrayerTime()
```

### `getNextPrayerTime`

Returns a [`TimeObject`]() with the name and Adhan time of the next prayer. If the current prayer `"isha"`, the returned value would be `{ name: "none", time: null }`.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getNextPrayerTime()
```

### `getAllPrayerTimes`

Returns an array of [`TimeObject`]() with prayer names and their corresponding time as a Javascript `Date` object.

::: info
The array includes the sunrise time object.
:::

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getAllPrayerTimes()
// will return:
/*
 * [
    {
      name: "fajr",
      time: 2022-01-31T22:07:00.000Z,
    },
    {
      name: "sunrise",
      time: 2022-01-31T23:27:00.000Z,
    },
    {
      name: "dhuhr"
      time: 2022-02-01T05:31:00.000Z,
    },
    {
      name: "asr"
      time: 2022-02-01T08:53:00.000Z,
    },
    {
      name: "maghrib"
      time: 2022-02-01T11:27:00.000Z,
    },
    {
      name: "isha"
      time: 2022-02-01T12:41:00.000Z
    }
  ]
 */
```

### `adhanObserver`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. You can subscribe to the observable for receiving real-time notifications of Adhan events.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const subscription = reactiveCalculator.adhanObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} prayer entered`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup if you need to..
subscription.unsubscribe()
reactiveCalculator.cleanup()
```

### `iqamaObserver`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer Iqama times events.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.iqamaObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} Iqama`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup if you need to..
subscription.unsubscribe()
reactiveCalculator.cleanup()
```

::: tip
The default time intervals in minutes between Adhan and Iqama are: `{ fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }` You can customize these intervals in the `ReactiveCalculator` configuration. For more details, see the [Config](../config/config.md) section.
:::

### `qiyamTimesObserver`

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer Qiyam times events. (The middle of the night and the last third of the night).

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.qiyamTimesObserver().subscribe({
  next(value: TimeEventObject) {
    if (value.name === TimesNames.MIDDLE_OF_THE_NIGHT) {
      // notify Abu bakr
    }

    if (value.name === TimesNames.LAST_THIRD_OF_THE_NIGHT) {
      // notify Umar
    }
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

## Cleanup: Why It's Important

The `cleanup` method is crucial for resource management. When you initialize a `ReactiveCalculator`, it starts various internal processes and subscriptions to provide real-time updates. These processes consume system resources and will continue to do so until explicitly stopped.

Invoking `cleanup` will unsubscribe the calculator from all active observables, freeing up system resources and preventing memory leaks. This is especially important in long-running or resource-sensitive applications to ensure optimal performance.

```ts
// ...

// Invoking cleanup when the calculator is no longer needed
reactiveCalculator.cleanup() // clean up subscriptions
```

::: danger
Neglecting to call cleanup can result in memory leaks, leading to decreased performance and potential application crashes. Always invoke cleanup when the calculator is no longer needed.
:::
