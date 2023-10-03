# Calculators Config

The `StaticCalculator` and the `ReactiveCalculator` class in `prayers-call` both require a config object to be passed to their constructor. This page will guide you through the configuration options available for both. for configuration options specific to a calculator, it will be mentioned as such. Otherwise, the configuration options are available for both calculators.

### date (`StaticCalculator` only)

- Required: `true`
- Type: `Date`

The date for which the prayer times will be calculated it can be past current or future. This property is specific to `StaticCalculator`.

### latitude and longitude

- Required: `true`
- Type: `number`

The geographical coordinates of the location for which the prayer times will be calculated.

### method

- Required: `false`
- Type: `Methods | CustomMethod`
- Default: `Methods.UMM_AL_QURA`

The calculation method to use. You can use one of the built-in methods or provide a custom method. for a comprehensive guide of available methods, see [Calculation Methods](./methods.md).

### adjustments

- Required: `false`
- Type: `Partial<PrayerAdjustments>`
- Default: `{ fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }`

Custom adjustments in minutes for each prayer time.

### asrTime

- Required: `false`
- Type: `AsrTime`
- Default: `AsrTime.JUMHOOR`

Whether to use the earlier (Jumhoor) or later (Hanafi) Asr time calculation.

### iqama

- Required: `false`
- Type: `Partial<Iqama>`
- Default: `{ fajr: 20, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 }`

Waiting time in minutes for iqama after the actual prayer time.

### adjustForRamadan

- Required: `false`
- Type: `boolean`
- Default: `false`

Whether to adjust the prayer times for Ramadan by adding 30 minutes to Isha.

::: tip
When using `UMM_AL_QURA` method `prayer-calls` will automatically adjust the prayer times for Ramadan. This option is only useful when using other methods.
:::

### hijriCalendar

- Required: `false`
- Type: `HijriCalendar`
- Default: `HijriCalendar.UMM_AL_QURA`

The Hijri calendar to use in conjunction with `adjustForRamadan` to determine the start and end of Ramadan. for a comprehensive list of available calendars, see [HijriCalendar](../api.md#HijriCalendar).

### highLatitudeRule

- Required: `false`
- Type: `ValueOf<typeof HighLatitudeRule>`
- Default: `HighLatitudeRule.MiddleOfTheNight`

Rule to use for calculating prayer times at high latitudes. See the [Advanced section](#advanced-configuration) for more details.

### polarCircleResolution

- Required: `false`
- Type: `ValueOf<typeof PolarCircleResolution>`
- Default: `PolarCircleResolution.Unresolved`

How to handle Midnight Sun & Polar Night days. See the [Advanced section](#advanced-configuration) for more details.

### debug (`ReactiveCalculator` only)

- Required: `false`
- Type: `boolean`
- Default: `false`

Enable debugging logs for the `ReactiveCalculator`.

## Example Usage

Here's an example that includes multiple configuration options:

```ts
import { StaticCalculator, Methods, HighLatitudeRule, AsrTime } from 'prayers-call'

const calculator = new StaticCalculator({
  date: new Date(),
  latitude: 40.7128,
  longitude: -74.006,
  method: Methods.NORTH_AMERICA,
  adjustments: { fajr: 2, isha: -2 },
  highLatitudeRule: HighLatitudeRule.SeventhOfTheNight,
  asrTime: AsrTime.HANAFI,
  iqama: { fajr: 15, dhuhr: 10 },
  adjustForRamadan: true,
})
```

## Advanced Configuration

In certain geographical locations, calculating Islamic prayer times can be challenging due to the unique solar behavior. The `highLatitudeRule` and `polarCircleResolution` options in the configuration aim to address these challenges.

### High Latitude Rule

The `HighLatitudeRule` object provides three methods to calculate prayer times for locations with high latitudes (above 48.5° N or S), where the [twilight](https://en.wikipedia.org/wiki/Twilight) period can be extended.

#### Options

- **MiddleOfTheNight**: Divides the night (sunset to sunrise) in half to determine the latest time for Isha and the earliest time for Fajr. Essentially, neither Fajr nor Isha will occur before or after the midpoint of the night.

- **SeventhOfTheNight**: Divides the night (sunset to sunrise) into seven parts. Fajr is set at the beginning of the last seventh of the night, and Isha at the end of the first seventh. This is particularly useful for locations above 48° latitude where twilight lasts longer.

- **TwilightAngle**: Divide the night (sunset to sunrise) into roughly 1/3. The exact value is derived by dividing the fajr/isha angles by 60. It aims to prevent extremely early or late Fajr and Isha times.

#### Recommended

The `recommended` function can automatically select the most appropriate high latitude rule based on the geographical coordinates. For example, for Oslo, Norway, you can use:

```ts
import { HighLatitudeRule } from 'prayers-call'

const rule = HighLatitudeRule.recommended({ latitude: 59.91, longitude: 10.75 }) // SeventhOfTheNight
```

In places like Oslo, Norway, where the sun barely sets during summer, using the `SeventhOfTheNight` rule can make prayer times more manageable. This rule ensures that Isha is not too late and Fajr is not too early, making it easier for people to observe their prayers.

### Polar Circle Resolution

This setting is crucial for locations within the polar circles (above approximately 66.5° N or S) where there may be days when the sun never sets (Midnight Sun) or never rises (Polar Night). The options help to resolve prayer times on such days.

#### Options

- **AqrabBalad:** This option calculates the prayer times based on the closest geographical location where conventional sunrise and sunset times are available. Essentially, it "borrows" the prayer times from the nearest place where the sun does rise and set.

- **AqrabYaum:** This calculates the prayer times based on the closest date (either in the past or future) when conventional sunrise and sunset times can be determined. In other words, it uses the prayer times from the nearest "normal" day.

- **Unresolved:** This is the default setting. It leaves the sunrise and sunset prayer times undefined when they can't be computed due to the extreme latitude.
