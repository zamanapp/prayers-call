# API Reference

## Table of Contents

[[toc]]

## StaticCalculator

The `StaticCalculator` class is responsible for calculating Islamic prayer times for a specific date. It extends the `BaseCalculator` and provides methods to get individual prayer times, Qibla direction, and more.

### Constructor

#### `new StaticCalculator(config: CalculationsConfig)`

Creates a new instance of `StaticCalculator`.

**Parameters:**

- `config`: [CalculationsConfig](#calculationsconfig)

**Example:**

```ts
const calculator = new StaticCalculator({
  /* config options */
})
```

### Methods

Available methods withing the `StaticCalculator` class.

#### `getAllPrayerTimes(): TimeObject[]`

Returns an array of prayer times for the day.

**Returns:**

- [`TimeObject[]`](#timeobject): An array of prayer times.

#### `getPrayerTime(prayer: PrayerNamesType): Date`

Returns the time for a specific prayer.

**Parameters:**

- `prayer`: [`PrayerNamesType`](#prayernamestype) representing the prayer names. Use the [`PrayerNames`](#prayernames) enum for available prayer names.

**Returns:**

- `Date`: The time for the specified prayer.

#### `getMiddleOfTheNightTime(): TimeObject`

Returns the time for the middle of the night, often used for Qiyam prayers.

**Returns:**

- [`TimeObject`](#timeobject): The time for the middle of the night.

#### `getLastThirdOfTheNightTime(): TimeObject`

Returns the time for the last third of the night, another time often used for Qiyam prayers.

**Returns:**

- [`TimeObject`](#timeobject): The time for the last third of the night.

#### `getQiblaDirection(coordinates?: CoordinatesObject): number`

Calculates the Qibla direction based on the given coordinates.

**Parameters:**

- `coordinates`: Optional. A [`CoordinatesObject`](#coordinatesobject) containing the latitude and longitude for which to calculate the Qibla direction.

**Returns:**

- `number`: The Qibla direction in degrees from North.

#### `getCalculationOptions(): CalculationsConfig`

Returns the current calculation options.

**Returns:**

- [`CalculationsConfig`](#calculationsconfig): The current configuration options.

#### `setCalculationOptions(newConfig: Partial<CalculationsConfig>)`

Updates the calculation options.

**Parameters:**

- `newConfig`: The new configuration options as a [`Partial<CalculationsConfig>`](#calculationsconfig).

---

## ReactiveCalculator

The `ReactiveCalculator` class is a reactive implementation for calculating Islamic prayer times. It extends the `BaseCalculator` and provides reactive features using RxJS Observables.

### Constructor

#### `new ReactiveCalculator(rConfig: ReactiveCalculationsConfig)`

Creates a new instance of `ReactiveCalculator`.

**Parameters:**

- `rConfig`: [ReactiveCalculationsConfig](#reactivecalculationsconfig)

**Example:**

```ts
const reactiveCalculator = new ReactiveCalculator({
/_ config options _/
});
```

### Methods

Available methods withing the `ReactiveCalculator` class.

#### `cleanup(): void`

Unsubscribes from all internal subscriptions. This method should be called when the calculator is no longer needed. See also [Cleanup: Why It's Important](./guide/reactive-calculator.md#cleanup-why-its-important).

#### `getCurrentPrayerTime(): TimeObject`

Returns the current prayer time.

**Returns:**

- [`TimeObject`](#timeobject)

#### `getNextPrayerTime(): TimeObject`

Returns the next prayer time.

**Returns:**

- [`TimeObject`](#timeobject)

#### `getAllPrayerTimes(): TimeObject[]`

Returns an array of all prayer times for the day.

**Returns:**

- [`TimeObject[]`](#timeobject)

#### `getPrayerTime(prayer: PrayerNamesType): Date`

Returns the time for a specific prayer.

**Parameters:**

- `prayer`: [`PrayerNamesType`](#prayernamestype) representing the prayer names. Use the [`PrayerNames`](#prayernames) enum for available prayer names.

**Returns:**

- `Date`

#### `getMiddleOfTheNightTime(): TimeObject`

Returns the time for the middle of the night.

**Returns:**

- [`TimeObject`](#timeobject)

#### `getLastThirdOfTheNightTime(): TimeObject`

Returns the time for the last third of the night.

**Returns:**

- [`TimeObject`](#timeobject)

#### `getQiblaDirection(coordinates?: CoordinatesObject): number`

Returns the Qibla direction based on given coordinates.

**Parameters:**

- `coordinates`: Optional. [`CoordinatesObject`](#coordinatesobject) containing the latitude and longitude for which to calculate the Qibla direction.

**Returns:**

- `number`

#### `getCalculationOptions(): CalculationsConfig`

Returns the current calculation options.

**Returns:**

- [`CalculationsConfig`](#calculationsconfig)

#### `setCalculationOptions(newConfig: Partial<ReactiveCalculationsConfig>)`

Updates the calculation options.

**Parameters:**

- `newConfig`: [`Partial<ReactiveCalculationsConfig>`](#reactivecalculationsconfig)

### Observables

Observables withing the `ReactiveCalculator` class are the heart of the reactive implementation. They are used to notify subscribers of changes to the calculation options and prayer times.

#### `newSolarDayObserver(): Observable<number>`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type `number` that emits a new value when the solar day changes. This is used internally to update prayer times but is exposed for additional flexibility.

**Example:**

```ts
const solarDaySubscription = reactiveCalculator.newSolarDayObserver().subscribe({
  next(value: number) {
    // recalculate prayer times for the new day
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

#### `newQiyamObserver(): Observable<TimeEventObject>`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`](#timeeventobject) that emits a new value when the last third of the night is past. This is used internally to update Qiyam times but is exposed for additional flexibility.

**Example:**

```ts
const qiyamSubscription = reactiveCalculator.newQiyamObserver().subscribe({
  next(value: TimeEventObject) {
    // recalculate qiyam times for the new day
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

#### `adhanObserver(): Observable<TimeEventObject>`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`](#timeeventobject) that emits events for Adhan times. You can subscribe to receive real-time notifications.

**Example:**

```ts
const subscription = reactiveCalculator.adhanObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} prayer entered`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

#### `iqamaObserver(): Observable<TimeEventObject>`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`](#timeeventobject) that emits events for Iqama times. You can subscribe to receive real-time notifications.

**Example:**

```ts
const subscription = reactiveCalculator.iqamaObserver().subscribe({
  next(value: TimeEventObject) {
    console.log(`Time for ${value.name} Iqama`)
  },
  error(err) {
    console.error('An error occurred: ', err)
  },
})
```

#### `qiyamTimesObserver(): Observable<TimeEventObject>`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`](#timeeventobject) that emits events for Qiyam times, specifically the middle and last third of the night.

**Example:**

```ts
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
```

#### `prayerEventsObserver(): Observable<TimeEventObject>`

Returns an [`Observable`](https://rxjs.dev/guide/observable) of type [`TimeEventObject`](#timeeventobject) that emits events for all prayer-related times (Adhan, Iqama, Qiyam). This is a shortcut for subscribing to all events at once.

**Example:**

```ts
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
```

---

## Helpers

### Functions

`prayers-call` provides a set of helper functions to make working with the library easier.

#### `calculateQiblaDirection(coordinates: CoordinatesObject): number`

Calculates the Qibla direction based on the given coordinates.

**Parameters:**

- `coordinates`: [`CoordinatesObject`](#coordinatesobject) containing the `latitude` and `longitude`.

**Example:**

```ts
const direction = calculateQiblaDirection({ latitude: 40.7128, longitude: -74.006 })
console.log(`Qibla direction is ${direction} degrees.`)
```

#### `recommendMethod(coordinates: CoordinatesObject): Methods[] | undefined`

Recommends prayer calculation methods based on the country located at the given coordinates.

**Parameters:**

- `coordinates`: [`CoordinatesObject`](#coordinatesobject) containing the `latitude` and `longitude`.

**Example:**

```ts
const methods = recommendMethod({ latitude: 40.7128, longitude: -74.006 })
console.log('Recommended methods:', methods)
```

### Classes

`prayers-call` provides a set of classes to make working with the library easier.

#### `Formatter`

The `Formatter` class is responsible for formatting prayer times into different date and time formats. It provides methods to handle various formatting tasks.

##### Constructor

```ts
const formatter = new Formatter(config?);
```

**Parameters:**

- `config`: Optional configuration object for the formatter.

##### Methods

###### `formatDate(date: Date): string`

Formats a JavaScript `Date` object into a formatted string.

**Example:**

```ts
const formattedDate = formatter.formatDate(new Date())
console.log('Formatted Date:', formattedDate)
```

###### `formatPrayers(prayerTimes: TimeObject[]): FormattedTimeObject[]`

Formats an array of prayer times of type [`TimeObject`](#timeobject) into an array of [`FormattedTimeObject`](#formatedtimeobject).

**Example:**

```ts
const formattedPrayers = formatter.formatPrayers(prayerTimesArray)
console.log('Formatted Prayer Times:', formattedPrayers)
```

###### `setFormatterOptions(newConfig: Partial<FormatterConfig>)`

Updates the formatter options.

**Example:**

```ts
formatter.setFormatterOptions({ locale: 'en-GB' })
```

---

## Types

### `AsrTime`

Enumeration for Asr time calculation methods. Options are `JUMHOOR` and `HANAFI`.

```ts
export enum AsrTime {
  JUMHOOR,
  HANAFI,
}
```

### `CustomMethod`

Interface for customizing prayer calculation methods. Refer to the [Calculation Methods](./config/methods.md) section for more details.

```ts
export interface CustomMethod {
  fajrAngle?: number
  ishaAngle?: number
  ishaInterval?: number
  maghribAngle?: number
  methodAdjustments?: Partial<PrayerAdjustments>
}
```

### `CalculationsConfig`

Configuration interface for static prayer time calculations.

For a detailed explanation of each field, refer to the [Configuration Guide](./config/config.md).

```ts
export interface CalculationsConfig {
  date: Date
  latitude: number
  longitude: number
  method?: Methods | CustomMethod
  adjustments?: Partial<PrayerAdjustments>
  highLatitudeRule?: ValueOf<typeof HighLatitudeRule>
  asrTime?: AsrTime
  polarCircleResolution?: ValueOf<typeof PolarCircleResolution>
  iqama?: Partial<Iqama>
  adjustForRamadan?: boolean
  hijriCalendar?: HijriCalendar
  debug?: boolean
}
```

### `ReactiveCalculationsConfig`

Configuration interface for reactive prayer time calculations, omitting the date.

For a detailed explanation of each field, refer to the [Configuration Guide](./config/config.md).

```ts
export type ReactiveCalculationsConfig = Omit<CalculationsConfig, 'date'>
```

### `CoordinatesObject`

Interface for geographic coordinates.

```ts
export interface CoordinatesObject {
  latitude: number
  longitude: number
}
```

### `FormatterConfig`

Configuration interface for date and time formatting. extends the [`Intl.DateTimeFormatOptions`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) interface.

```ts
export interface FormatterConfig extends Intl.DateTimeFormatOptions {
  locale?: string | string[]
}
```

### `HijriCalendar`

Enumeration for Hijri calendar types.

```ts
export enum HijriCalendar {
  GENERAL = 'islamic',
  CIVIC = 'islamic-civil',
  TABULAR = 'islamic-tbla',
  UMM_AL_QURA = 'islamic-umalqura',
  SIGHTING_SA = 'islamic-rgsa',
}
```

Islamic calendars are usually categorized as bellow:

- **Religious:** Based on sighting the moon with the naked eye. Actual dates varies by location.
- **Algorithmic**: Based on astronomical or arithmetic calculations. Usually used for administrative purposes. Actual dates are fixed and can be predicted in advance.
  - **Tabular**: Based on arithmetic calculations. Actual dates are fixed and can be predicted in advance.
  - **Astronomical**: Based on astronomical calculations. Actual dates are fixed and can be predicted in advance.

`prayers-call` provide the following Hijri calendars through the `HijriCalendar` enum:

| Name        | <div style="width: 130px">Value</div> | Description                                                                                        |
| ----------- | :------------------------------------ | -------------------------------------------------------------------------------------------------- |
| GENERAL     | `islamic`                             | A general Islamic calendar, often used as a default.                                               |
| CIVIL       | `islamic-civil`                       | Based on tabular calculations. `(intercalary years [2,5,7,10,13,16,18,21,24,26,29] Friday epoch)`  |
| TABULAR     | `islamic-tbla`                        | Based on tabular calculation. `(intercalary years [2,5,7,10,13,16,18,21,24,26,29] Thursday epoch)` |
| UMM_AL_QURA | `islamic-umalqura`                    | The official calendar of Saudi Arabia, based on astronomical calculations.                         |
| SIGHTING_SA | `islamic-rgsa`                        | Based on moon sighting in the region of Saudi Arabia; Requested by Oracle. dates may vary.         |

### `Iqama`

Interface for Iqama times in minutes.

```ts
export interface Iqama {
  fajr: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}
```

### `Method`

Enumeration for prayer calculation methods offered by `prayers-call`. Refer to the [Calculation Methods](./config/methods.md) section for more details on how to use them.

```ts
export enum Methods {
  UMM_AL_QURA = 'UmmAlQura',
  MUSLIM_WORLD_LEAGUE = 'MuslimWorldLeague',
  MOONSIGHTING_COMMITTEE = 'MoonsightingCommittee',
  KUWAIT = 'Kuwait',
  QATAR = 'Qatar',
  EGYPTIAN = 'Egyptian',
  KARACHI = 'Karachi',
  TURKEY = 'Turkey',
  DUBAI = 'Dubai',
  SINGAPORE = 'Singapore',
  NORTH_AMERICA = 'NorthAmerica',
  TEHRAN = 'Tehran',
  STANDARD = 'Standard',
  ALGERIA = 'Algeria',
  BAHRAIN = 'Bahrain',
  BRUNEI = 'Brunei',
  FRANCE = 'France',
  GERMANY = 'Germany',
  INDONESIA = 'Indonesia',
  IRAQ = 'Iraq',
  JORDAN = 'Jordan',
  LIBYA = 'Libya',
  MALAYSIA = 'Malaysia',
  MOROCCO = 'Morocco',
  RUSSIA = 'Russia',
  OMAN = 'Oman',
  PALESTINE = 'Palestine',
  SUDAN = 'Sudan',
  SYRIA = 'Syria',
  TUNISIA = 'Tunisia',
  YEMEN = 'Yemen',
}
```

### `PrayerAdjustments`

Interface for custom adjustments in minutes to prayer times.

```ts
export interface PrayerAdjustments {
  fajr: number
  sunrise: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}
```

### `PrayerNamesType`

Type alias for prayer names.

```ts
export type PrayerNamesType = ValueOf<typeof Prayer>
```

### `PrayerNames`

Enumeration for prayer names.

```ts
export enum PrayerNames {
  FAJR = 'fajr',
  SUNRISE = 'sunrise',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHA = 'isha',
}
```

### `TimesNamesType`

Type alias for time names, including qiyam times.

```ts
export type TimesNamesType = PrayerNamesType | 'middleOfTheNight' | 'lastThirdOfTheNight'
```

### `TimesNames`

Enumeration for time names, including special times.

```ts
export enum TimesNames {
  FAJR = 'fajr',
  SUNRISE = 'sunrise',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHA = 'isha',
  MIDDLE_OF_THE_NIGHT = 'middleOfTheNight',
  LAST_THIRD_OF_THE_NIGHT = 'lastThirdOfTheNight',
}
```

### `EventType`

Enumeration for event types. Used in [`TimeEventObject`](#timeeventobject).

```ts
export enum EventType {
  ADHAN = 'ADHAN',
  IQAMA = 'IQAMA',
  TRANSIENT = 'TRANSIENT',
}
```

### `FormattedTimeObject`

Interface for formatted time objects. returned the `Formatter` class's method `formatPrayers()`.

```ts
export interface FormattedTimeObject {
  name: TimesNamesType
  time: string
}
```

### `TimeObject`

Interface for time objects. returned from methods like `getAllPrayerTimes()`.

```ts
export interface TimeObject {
  name: TimesNamesType
  time: Date
}
```

### `TimeEventObject`

Interface for time event objects. returned from observables like `adhanObserver()`.

```ts
export interface TimeEventObject {
  name: TimesNamesType
  type: EventType
  time: Date
}
```

---
