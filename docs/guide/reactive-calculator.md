::: danger
The reactive calculator is a work in progress and the documentation here and the api is just a draft
:::

### getCurrentPrayerTime

Based on the current time this method returns a [`TimeObject`]() containing the `name` of the current prayer and it's Adhan time as a `time` property. if the current time is passed `isha` time it will return `{ name: "none", time: null }`.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getCurrentPrayerTime() // will return: ""
```

### getNextPrayerTime

Based on the current time this method returns a [`TimeObject`]() of the next prayer. if the current prayer is `"isha"` the output will be `{ name: "none", time: null }`.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getNextPrayerTime() // will return: ""
```

### adhanObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer times events (Adhan).

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.adhanObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} prayer entered`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

### iqamaObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for prayer Iqama times events.

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
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
```

::: tip
You can adjust how much time is given before each iqama in the `UseReactiveCalculator` config object. refer to the [Config](../config.md) section to know more.
:::

### qiyamTimesObserver

This method returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`]() ie: `Observable<TimeEventObject>`. This method can be subscribed to for Qiyam times events (The middle of the night and the last third of the night).

```ts
import { Methods, UseReactiveCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const reactiveCalculator = new UseReactiveCalculator({
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
