# Qibla Calculations

`prayers-call` offers two convenient ways to calculate this direction: using a calculator (either static or reactive) and using a standalone function helper. This guide will walk you through both methods.

## Using a Calculator

Both the `StaticCalculator` and `ReactiveCalculator` classes expose a method called `getQiblaDirection`. By default, this method uses the geographical coordinates you provided during the calculator's initialization to compute the Qibla direction.

```ts
import { Methods, ReactiveCalculator } from 'prayer-call'

// calculations for Cyberjaya
const reactiveCalculator = new ReactiveCalculator({
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const qiblaDirection = reactiveCalculator.getQiblaDirection()
console.log(qiblaDirection) // 292.6457605278075
```

### Optional Coordinates

You can also pass in an optional [`CoordinatesObject`]() to the `getQiblaDirection` method. This is useful if you want to calculate the Qibla direction for a different location than the one you used to initialize the calculator.

```ts
const alAqsaCoordinates = {
  latitude: 31.7782624,
  longitude: 35.2335256,
}

const qiblaDirection = reactiveCalculator.getQiblaDirection(alAqsaCoordinates)
console.log(qiblaDirection) // 157.29924281528764
```

## Using the `calculateQiblaDirection` Function Helper

The `calculateQiblaDirection` function helper is a standalone function that can be used to calculate the Qibla direction. It accepts a [`CoordinatesObject`]() as its only argument.

```ts
import { calculateQiblaDirection } from 'prayer-call'

const qiblaDirection = calculateQiblaDirection({
  latitude: 2.9213,
  longitude: 101.6559,
})
console.log(qiblaDirection) // 292.6457605278075
```
