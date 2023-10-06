<!-- <script setup>
import MethodsMap from '../components/MethodsMap.vue'
</script> -->

# Calculation Methods

## Overview

Calculation methods are sets of parameters and rules used to compute Islamic prayer times. These methods are often standardized by religious authorities or geographical regions. They define specific angles of the sun or time intervals, and other factors to accurately calculate the times for Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha prayers.

## Available Methods

We recommend using `prayers-call` pre-defined calculation methods, as they are endorsed by official religious authorities making them more accurate and consistent with the local community. These methods are available via the [`Method`](../api.md#method) enum. However, if you need to, you can create your own custom method using the [`CustomMethod`](../api.md#custommethod) interface for that check the [Building a Custom Method](#building-a-custom-method) section.

| Method Name            | Fajr Angle | Isha Angle | Isha Interval | Method Adjustments                            |
| ---------------------- | ---------- | ---------- | ------------- | --------------------------------------------- |
| UMM_AL_QURA            | 18.5       | 0          | 90[^1]        | None                                          |
| MUSLIM_WORLD_LEAGUE    | 18         | 17         | 0             | `{ dhuhr: 1 }`                                |
| MOONSIGHTING_COMMITTEE | 18         | 18         | 0             | `{dhuhr: 5, maghrib: 3}`                      |
| KUWAIT                 | 18         | 17.5       | 0             | None                                          |
| QATAR                  | 18         | 0          | 90            | None                                          |
| EGYPTIAN               | 19.5       | 17.5       | 0             | `{dhuhr: 1}`                                  |
| KARACHI                | 18         | 18         | 0             | `{dhuhr: 1}`                                  |
| DUBAI                  | 18.2       | 18.2       | 0             | `{sunrise: -3, dhuhr: 3, asr: 3, maghrib: 3}` |
| SINGAPORE              | 20         | 18         | 0             | `{dhuhr: 1}`                                  |
| NORTH_AMERICA          | 15         | 15         | 0             | `{dhuhr: 1}`                                  |
| TURKEY                 | 18         | 17         | 0             | `{sunrise: -7, dhuhr: 5, asr: 4, maghrib: 7}` |
| JORDAN                 | 18         | 18         | 0             | None                                          |
| LIBYA                  | 18         | 18         | 0             | None                                          |
| PALESTINE              | 18         | 18         | 0             | None                                          |
| SUDAN                  | 18         | 18         | 0             | None                                          |
| ALGERIA                | 18         | 17         | 0             | `{maghrib: 3}`                                |
| BAHRAIN                | 18         | 0          | 90            | None                                          |
| BRUNEI                 | 20         | 18         | 0             | `{dhuhr: 1}`                                  |
| INDONESIA              | 20         | 18         | 0             | `{dhuhr: 1}`                                  |
| MALAYSIA               | 20         | 18         | 0             | `{dhuhr: 1}`                                  |
| FRANCE                 | 12         | 12         | 0             | None                                          |
| GERMANY                | 18         | 16.5       | 0             | None                                          |
| IRAQ                   | 19.5       | 17.5       | 0             | `{dhuhr: 7, asr: 7, maghrib: 4}`              |
| MOROCCO                | 19         | 17         | 0             | `{dhuhr: 5, maghrib: 2}`                      |
| RUSSIA                 | 16         | 15         | 0             | None                                          |
| OMAN                   | 18         | 18         | 0             | `{dhuhr: 5, asr: 5, maghrib: 5}`              |
| SYRIA                  | 18.5       | 17.5       | 0             | `{sunrise: -7, dhuhr: 5, asr: 3, maghrib: 7}` |
| TUNISIA                | 18         | 18         | 0             | `{dhuhr: 7, maghrib: 2}`                      |
| YEMEN                  | 18         | 17         | 0             | `{dhuhr: 2}`                                  |
| STANDARD               | 18         | 18         | 0             | None                                          |

[^1]: Umm Al Qura method changes the isha interval to 120 minutes instead of 90 minutes (+30 minutes) during Ramadan. `prayers-call` automatically handles this change for you.

::: tip
There are other calculation parameters to take in consideration that also varies from one method to another or from one country/region to another. Example of that would be the [`AsrTime`](./config.md#asrtime), [`HighLatitudeRule`](./config.md#highlatituderule), [`adjustForRamadan`](./config.md#adjustforramadan) and [`PolarCircleResolution`](./config.md#polarcircleresolution)
:::

::: tip Help wanted
We're looking for help to add more calculation methods to `prayers-call`. If you have the knowledge and resources to help us or have found any issue, please [open an issue](https://github.com/whiterocktech/prayers-call/issues/new/choose) or submit a pull request.
:::

::: warning Disclaimer
The calculation methods provided are based on our best capacity of research and publicly available information. Some of them might not be accurate or up to date. We welcome contributions from the community to improve and expand this data.
:::

## Using the `recommendMethod` Helper Function

`prayers-call` offers the [`recommendMethod`](../api.md#functions) helper function, designed to suggest the most appropriate calculation methods for prayer times based on the country of a given location. The function accepts a [`CoordinatesObject`](../api.md#coordinatesobject) returns an array of recommended methods, ranked by best guess or by the number of methods commonly used in that specific country. If no match is found, the function returns `undefined`. Here's an example:"

```ts
import { recommendMethod } from 'prayers-call'

const methods = recommendMethod({ latitude: 21.3891, longitude: 39.8579 }) // mekka coordinates
console.log(methods) // Output: ['UmmAlQura']
```

<!-- The following is a map projecting the recommended methods for each country. hover on a country to see the recommended methods.

<MethodsMap /> -->

::: tip Help wanted
We're looking for help to map more countries with their respective methods. If you have the knowledge and resources to help us or have found any issue, please [open an issue](https://github.com/whiterocktech/prayers-call/issues/new/choose) or submit a pull request.
:::

::: warning Disclaimer
The mapping provided are based on our best capacity of research and publicly available information. Some of the results might not be accurate or up to date. We welcome contributions from the community to improve and expand this data.
:::

## Building a Custom Method

It is possible to use a custom calculation method by passing a [`CustomMethod`](../api.md#custommethod) object to the `method` property on the [`CalculationsConfig`](../api.md#calculationsconfig) or the [`ReactiveCalculationsConfig`](../api.md#reactivecalculationsconfig).

The following parameters are available:

- **`fajrAngle`**: The angle of the sun, in degrees, used to calculate Fajr time. Default is 18 degrees.
- **`ishaAngle`**: The angle of the sun, in degrees, used to calculate Isha time. Default is 18 degrees.
- **`ishaInterval`**: The number of minutes after Maghrib for Isha. If set, `ishaAngle` is ignored. Default is 0 minutes.
- **`maghribAngle`**: The angle of the sun, in degrees, used to calculate Maghrib. This is specifically used by the Tehran method. Default is 0 degrees.
- **`methodAdjustments`**: Custom adjustments, in minutes, for each prayer time. Default adjustments are all zero.

### Example usage

```ts
const MyCustomMethod: CustomMethod = {
  fajrAngle: 17,
  ishaAngle: 18,
  methodAdjustments: { fajr: 2, isha: 2 },
}

const calculator = new StaticCalculator({
  date: new Date(2022, 1, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: MyCustomMethod,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
```

## Community Note

This documentation and the methods provided are based on our best capacity of research and publicly available information. We welcome contributions from the community to improve and expand this data.

## Future Plans

We're working on releasing an open-source tool that allows you to test, compare, and build calculation methods. Check our [roadmap](../roadmap.md) and stay tuned for updates.

Feel free to contribute and help us make this resource even better.
