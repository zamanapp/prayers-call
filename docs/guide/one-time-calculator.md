# Calculator

The `StaticCalculator` accepts a date in it's initialization allowing you to get prayer times for any past, current or future date.

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

// calculations for Cyberjaya on Jan 1st 2022
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
```

You can find all the configuration reference in the [Config](../config.md)

## Methods

The calculator offer a number of methods to help you get Prayer times, Qiyam times and Qibla.

### getAllPrayerTimes

This method returns a array of [`TimeObject`]() containing the prayer name and it's time. the time is a `Date` object.

::: info
Sunrise time object is included in the array
:::

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
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

### getPrayerTime

Get a specific Prayer time based on the date used to initialize the calculator. this method returns a `Date` object and accept a `prayer` parameter of type [`PrayerNames`]().

```ts
import { Methods, PrayerNames, StaticCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getPrayerTime(PrayerNames.FAJR)
// will return: "2022-01-31T22:07:00.000Z"
```

### getMiddleOfTheNightTime

Return the time of the middle of the night based on the moon. The return type is a `Date` object. These calculations are useful for Qiyam.

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getMiddleOfTheNightTime()
// will return: { name: 'middleOfTheNight', time: 2022-02-01T16:47:00.000Z }
```

### getLastThirdOfTheNightTime

Return the time of the last third of the night based on the moon. The return type is a `Date` object. These calculations are useful for Qiyam.

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getLastThirdOfTheNightTime()
// will return: { name: 'lastThirdOfTheNight', time: 2022-02-01T18:34:00.000Z }
```

### getQiblaDirection

The Qibla direction method return the direction in degrees from North of the Qibla. the return type is a `number`. By default this method will use the initialization coordinates but can accept an optional param of `CoordinatesObject` type.

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

// calculations for Cyberjaya
const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

calculator.getQiblaDirection() // will return: 292.6457605278075

const alAqsaCoordinates = {
  latitude: 31.7782624,
  longitude: 35.2335256,
}
calculator.getQiblaDirection(alAqsaCoordinates) // will return: 157.29924281528764
```

### getCalculationOptions

This method returns the full configuration object.

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

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

### setCalculationOptions

This method allow you to change the configuration of a calculator instance without the need for creating a new one. accepts a `newConfig` param of `Partial<CalculationsConfig>` type. You can find all the configuration reference in the [Config](../config.md)

```ts
import { Methods, StaticCalculator } from 'prayer.ts'

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
