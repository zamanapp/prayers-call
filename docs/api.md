# API Reference

## Table of Contents

- [StaticCalculator](#StaticCalculator)
  - [Constructor](#StaticCalculator-Constructor)
  - [Methods](#StaticCalculator-Methods)
- [ReactiveCalculator](#ReactiveCalculator)
  - [Constructor](#ReactiveCalculator-Constructor)
  - [Methods](#ReactiveCalculator-Methods)
- [Helper Functions](#Helper-Functions)
  - [calculateQiblaDirection](#calculateQiblaDirection)
  - [recommendMethod](#recommendMethod)
- [Types](#Types)
  - [AsrTime](#AsrTime)
  - [CustomMethod](#CustomMethod)
  - [CalculationConfig](#CalculationConfig)
  - [ReactiveCalculationConfig](#ReactiveCalculationConfig)
  - [CoordinatesObject](#CoordinatesObject)
  - [FormatterConfig](#FormatterConfig)
  - [HijriCalendar](#HijriCalendar)
  - [Iqama](#Iqama)
  - [Method](#Method)
  - [PrayerAdjustments](#PrayerAdjustments)
  - [PrayerNamesType](#PrayerNamesType)
  - [PrayerNames](#PrayerNames)
  - [TimesNamesType](#TimesNamesType)
  - [TimesNames](#TimesNames)
  - [EventType](#EventType)
  - [PrayersTimeObject](#PrayersTimeObject)
  - [FormattedTimeObject](#FormattedTimeObject)
  - [TimeObject](#TimeObject)
  - [TimeEventObject](#TimeEventObject)

---

## StaticCalculator

### Constructor

#### `new StaticCalculator(config: CalculationsConfig)`

Initializes a new `StaticCalculator` instance.

**Parameters:**

- `config`: [CalculationsConfig](#CalculationsConfig)

**Example:**

```ts
const calculator = new StaticCalculator({
  /* config options */
})
```

### Methods

#### `getQiblaDirection(coordinates?: CoordinatesObject): number`

Calculates the Qibla direction.

**Parameters:**

- `coordinates`: Optional. [CoordinatesObject](#CoordinatesObject)

**Example:**

```ts
const direction = calculator.getQiblaDirection()
```

---

## ReactiveCalculator

### Constructor

#### `new ReactiveCalculator(config: CalculationsConfig)`

Initializes a new `ReactiveCalculator` instance.

### Methods

#### `cleanup(): void`

Cleans up all subscriptions.

**Example:**

```ts
reactiveCalculator.cleanup()
```

---

## Helper Functions

### calculateQibla

#### `calculateQibla(coordinates: CoordinatesObject): number`

Calculates the Qibla direction based on the given coordinates.

**Example:**

```ts
const direction = calculateQibla({ latitude: 40.7128, longitude: -74.006 })
```

---

## Types

### CoordinatesObject

```ts
{
  latitude: number
  longitude: number
}
```

### TimeObject

```ts
{
  name: string
  time: Date
}
```

---
