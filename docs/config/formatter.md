# Formatter Config

The `Formatter` class in `prayers-call` allows you to format dates and times, including Islamic (Hijri) dates. It uses a configuration object that can be passed to its constructor. This page will guide you through the available configuration options.

## `locale`

- **Required**: `false`
- **Type**: `string | string[]`
- **Default**: `'en-US'`

The locale determines the language and formatting conventions to be used. For example, using `'en-US'` will format the date in the United States' customary style, while `'en-GB'` will use the United Kingdom's style.

For a comprehensive list of available locales, see [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).

## `Intl.DateTimeFormatOptions`

The `FormatterConfig` object extends the `Intl.DateTimeFormatOptions`, you can use any of the properties available in in JavaScript's `Intl.DateTimeFormatOptions` to fine-tune your date and time formatting.

- **Required:** `false`

### Options include:

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
  timeZone: 'Asia/Shanghai',
  hour12: true | false,
  hourCycle: 'h11' | 'h12' | 'h23' | 'h24',
  formatMatcher: 'basic' | 'best fit'
}
```

For a complete list of options, refer to the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).

## Example Usage

Here's an example that includes multiple configuration options:

```ts
import { Formatter } from 'prayers-call'

const formatter = new Formatter({
  locale: 'en-GB',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const date = new Date(2022, 1, 1)
console.log(formatter.formatDate(date)) // Outputs: 'Saturday, 1 February 2022'
```
