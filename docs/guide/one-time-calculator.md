# Statice Calculator

The `StaticCalculator` class is initialized with a date, allowing you to calculate prayer times for any single day—past, present, or future.

```ts
import { Methods, StaticCalculator } from 'prayer-call'

// calculations for Cyberjaya on Jan 1st 2022
const calculator = new StaticCalculator({
  date: new Date(2022, 0, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
```

For configuration details, refer to the [Config](../config/config.md) section.

## Available Functions

### `getAllPrayerTimes`

Returns an array of [`TimeObject`]() with prayer names and their corresponding time as a Javascript `Date` object.

::: info
The array includes the sunrise time object.
:::

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

calculator.getAllPrayerTimes()
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

### `getPrayerTime`

Returns the time for a specific prayer based on the initialized date. Accepts a prayer parameter of type [`PrayerNames`]().

```ts
import { Methods, PrayerNames, StaticCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getPrayerTime(PrayerNames.FAJR)
// will return: "2022-01-31T22:07:00.000Z"
```

### `getMiddleOfTheNightTime` and `getLastThirdOfTheNightTime`

Returns a [`TimeObject`]() representing the time of the middle and the last third of the night respectively based on the moon. Useful for Qiyam calculations.

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

calculator.getMiddleOfTheNightTime()
// will return: { name: 'middleOfTheNight', time: 2022-02-01T16:47:00.000Z }

calculator.getLastThirdOfTheNightTime()
// will return: { name: 'lastThirdOfTheNight', time: 2022-02-01T18:34:00.000Z }
```

### `getQiblaDirection`

Returns a `number` representing the Qibla direction in degrees from North.

By default this method will use the initialization coordinates but can optional accept a `CoordinatesObject`.

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
import { Methods, StaticCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
calculator.getCalculationOptions()
// will return:
/* 
{
  date: 2022-01-31T16:00:00.000Z,
  latitude: 2.9213,
  longitude: 101.6559,
  method: 'Singapore',
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
  iqama: { fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }
}
*/
```

### `setCalculationOptions`

Allows you to update the calculator's configuration without creating a new instance. Accepts a `newConfig` param of type `Partial<CalculationsConfig>`.

For configuration details, refer to the [Config](../config/config.md) section.

```ts
import { Methods, StaticCalculator } from 'prayer-call'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const alAqsaCoordinates = {
  latitude: 31.7782624,
  longitude: 35.2335256,
}

// now the prayer times are calculated for alAqsa
calculator.setCalculationOptions({
  latitude: alAqsaCoordinates.latitude,
  longitude: alAqsaCoordinates.longitude,
})
```
