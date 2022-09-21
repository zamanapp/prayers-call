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
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

reactiveCalculator.getNextPrayerTime() // will return: ""
```

### listenToAdhan

### listenToIqama

### listenToSunnahTimes
