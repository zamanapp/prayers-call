# Reactive Calculator

The `ReactiveCalculator` provides real-time notifications for prayer times and related events. It initializes with the current date and time, offering both up-to-date prayer times and observables for event notifications. It also self-updates its internal configuration and prayer times so you always get real time up to date calculations, prayer times and notifications.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
```

For configuration details, refer to the [Config](../config/config.md) section.

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
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getAllPrayerTimes() // check the output tab
```

### `getPrayerTime`

`getPrayerTime` returns a Javascript `Date` object with the name and Adhan time of the specified prayer. Accepts prayer parameter of type `PrayerNamesType`. Use the [`PrayerNames`]() enum for available prayer names.

```ts
import { Methods, ReactiveCalculator, PrayerNames } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getPrayerTime(PrayerNames.FAJR)
```

### `getMiddleOfTheNightTime` and `getLastThirdOfTheNightTime`

Returns a [`TimeObject`]() representing the time of the middle and the last third of the night respectively based on the moon. Useful for Qiyam calculations.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getMiddleOfTheNightTime()

reactiveCalculator.getLastThirdOfTheNightTime()
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

// cleanup when you need to..
subscription.unsubscribe()
reactiveCalculator.cleanup()
```

### `iqamaObserver`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer Iqama times events.

```ts
import { Methods, ReactiveCalculator, TimeEventObject } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const subscription = reactiveCalculator.iqamaObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} Iqama`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup when you need to..
subscription.unsubscribe()
reactiveCalculator.cleanup()
```

::: tip
The default time intervals in minutes between Adhan and Iqama are: `{ fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }` You can customize these intervals in the `ReactiveCalculator` configuration. For more details, see the [Config](../config/config.md) section.
:::

### `qiyamTimesObserver`

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer Qiyam times events. (The middle of the night and the last third of the night).

```ts
import { Methods, ReactiveCalculator, TimesNames, TimeEventObject } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const subscription = reactiveCalculator.qiyamTimesObserver().subscribe({
  next(value: TimeEventObject) {
    if (value.name === TimesNames.MIDDLE_OF_THE_NIGHT) {
      // notify Abu Bakr
    }

    if (value.name === TimesNames.LAST_THIRD_OF_THE_NIGHT) {
      // notify Umar
    }
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup when you need to..
subscription.unsubscribe()
reactiveCalculator.cleanup()
```

### `prayerEventsObserver`

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method is a shortcut for subscribing to all prayer events at once (Adhan, Iqama, Qiyam).

```ts
import { Methods, ReactiveCalculator, TimeEventObject, EventType } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const subscription = reactiveCalculator.prayerEventsObserver().subscribe({
  next(value: TimeEventObject) {
    if (value.type === EventType.ADHAN) {
      // implement adhan notification
    }

    if (value.type === EventType.IQAMA) {
      // implement iqama notification
    }

    if (value.type === EventType.TRANSIENT) {
      // implement qiyam notification
    }
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

// cleanup when you need to..
subscription.unsubscribe()
reactiveCalculator.cleanup()
```

### `newSolarDayObserver` and `newQiyamObserver`

While exposed, these methods are used internally by the `ReactiveCalculator` to update its internal state.

Exposing them was a design decision to offer more flexibility and customization back to the developers. You can subscribe to these observables to get notified when the solar day changes (time to calculate new prayer times) or when last third of the night is past (time to calculate new Qiyam times).

```ts
import { Methods, ReactiveCalculator, TimeEventObject } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const solarDaySubscription = reactiveCalculator.newSolarDayObserver().subscribe({
  next(value: number) {
    // recalculate prayer times for the new day
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})

const qiyamSubscription = reactiveCalculator.newQiyamObserver().subscribe({
  next(value: TimeEventObject) {
    // recalculate qiyam times for the new day
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

### `getQiblaDirection`

Returns a `number` representing the Qibla direction in degrees from North.

By default this method will use the initialization coordinates but can optional accept a `CoordinatesObject`.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getQiblaDirection() // will return: 292.6457605278075

const alAqsaCoordinates = {
  latitude: 31.7782624,
  longitude: 35.2335256,
}
calculator.getQiblaDirection(alAqsaCoordinates) // will return: 157.29924281528764
```

### `getCalculationOptions`

Returns the full configuration object currently in use.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new ReactiveCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
calculator.getCalculationOptions()
// will return:
/* 
{
  date: 2022-01-31T16:00:00.000Z,
  latitude: 2.9213,
  longitude: 101.6559,
  method: 'Malaysia',
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
  iqama: { fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }
}
*/
```

### `setCalculationOptions`

Allows you to update the calculator's configuration without creating a new instance. Accepts a `newConfig` param of type `Partial<ReactiveCalculationsConfig>`.

For configuration details, refer to the [Config](../config/config.md) section.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const alAqsaCoordinates = {
  latitude: 31.7782624,
  longitude: 35.2335256,
}

// now the prayer times are calculated for al-Aqsa
calculator.setCalculationOptions({
  latitude: alAqsaCoordinates.latitude,
  longitude: alAqsaCoordinates.longitude,
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
