# Formatting

The `Formatter` class in `prayers-call` provides a flexible way to format dates and times, including Islamic (Hijri) dates. It leverages the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API for internationalization (I18n) and supports a variety of formatting options.

## Initialization and Configuration

To begin using the `Formatter` class, you'll need to initialize it. While the class comes with a default configuration, you can customize it by passing an optional [`FormatterConfig`](../api.md#formatterconfig) object during initialization.

### Default Configuration

By default, the Formatter uses the following configuration:

```ts
{
  locale: 'en-US',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}
```

Here is how you can initialize the Formatter with the default configuration:

```ts
import { Formatter } from 'prayer-call'

const formatter = new Formatter()

const date = new Date(2022, 1, 1)
formatter.formatDate(date) // '12:00 AM'
```

### Custom Configuration

To override the default settings, pass a FormatterConfig object to the constructor:

```ts
import { Formatter } from 'prayer-call'

const formatter = new Formatter({
  locale: 'en-GB',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
})

const date = new Date(2022, 1, 1)
formatter.formatDate(date) // '0:00'
```

### Configuration options

The `FormatterConfig` object extends the options available in `Intl.DateTimeFormat`. It includes commonly used properties to fine-tune the date and time formatting:

```ts
{
  weekday: 'narrow' | 'short' | 'long',
  era: 'narrow' | 'short' | 'long',
  year: 'numeric' | '2-digit',
  month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long',
  day: 'numeric' | '2-digit',
  hour: 'numeric' | '2-digit',
  minute: 'numeric' | '2-digit',
  second: 'numeric' | '2-digit',
  timeZoneName: 'short' | 'long',
  calendar: 'gregory' | 'islamic' | 'iso8601' // and more

  // Time zone to express it in
  timeZone: 'Asia/Shanghai',
  // Force 12-hour or 24-hour
  hour12: true | false,

  // Rarely-used options
  hourCycle: 'h11' | 'h12' | 'h23' | 'h24',
  formatMatcher: 'basic' | 'best fit'
}
```

For a complete list of options, refer to the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).

## Formatting Dates and Times

The `Formatter` class exposes a variety of methods to help you format dates and times.

### `formatDate`

To format a JavaScript Date object, use the formatDate method.

```ts
import { Formatter } from 'prayer-call'

const formatter = new Formatter({
  dateStyle: 'full',
  timeStyle: 'short',
})

const date = new Date(2022, 1, 1)
formatter.formatDate(date) // 'Tuesday, February 1, 2022 at 12:00 AM'
```

### `formatePrayers`

To format prayer times, use the formatPrayers method. It accepts an array of [`TimeObject`](../api.md#timeobject) as its only argument. it will return an array of [`FormattedTimeObject`](../api.md#formattedtimeobject).

```ts
import { Formatter } from 'prayer-call'

const formatter = new Formatter({
  dateStyle: 'short',
  timeStyle: 'short',
})

// alternatively you get the prayers from a calculator
const prayers = [
  { name: 'fajr', time: new Date(2022, 1, 1, 5, 30) },
  { name: 'sunrise', time: new Date(2022, 1, 1, 7, 0) },
  { name: 'dhuhr', time: new Date(2022, 1, 1, 12, 30) },
  { name: 'asr', time: new Date(2022, 1, 1, 15, 0) },
  { name: 'maghrib', time: new Date(2022, 1, 1, 18, 0) },
  { name: 'isha', time: new Date(2022, 1, 1, 19, 30) },
]

formatter.formatPrayers(prayers) // [ { name: 'fajr', time: '2/1/2022, 5:30 AM' }, ... ]
```

## Additional Resources

For more specialized formatting options, you may refer to the following pages:

[Hijri Dates](./hijri.md): Learn how to format Islamic (Hijri) dates using the `Formatter` class.

[Internationalization (I18n)](./i18n.md): Discover how to use the `Formatter` class for internationalizing dates and times.
