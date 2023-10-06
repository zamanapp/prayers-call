# Hijri Dates

The `Formatter` class uses the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API which supports the Hijri calendar. This means that you can use the `calendar` option to format dates and times in the Hijri calendar.

::: tip
For detailed information on formatting dates and times and how to use the `Formatter` class, visit the [Date/Time Formatting](./formatters.md) section.
:::

```ts
import { Formatter, HijriCalendar } from 'prayer-call'

const formatter = new Formatter({
  calendar: HijriCalendar.UMM_AL_QURA,
  dateStyle: 'full',
  timeStyle: 'short',
})

const date = new Date(2022, 1, 1)
formatter.formatDate(date) // 'Tuesday, Jumada II 29, 1443 AH at 12:00 AM'
```

### Available Calendars

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

::: tip
The `Intl.DateTimeFormat` API support calendars other then the islamic calendars as well. to get a full list of supported calendars, you can use the `Intl.Locale.prototype.getCalendars()` method.
:::

### Arabic Display of Dates

To display dates in Arabic, you can specify the locale option in the [`FormatterConfig`](../api.md#formatterconfig).

```ts
import { Formatter } from 'prayer-call'

const formatter = new Formatter({
  locale: 'ar-DZ',
  calendar: HijriCalendar.UMM_AL_QURA,
  dateStyle: 'full',
})

const date = new Date(2022, 1, 1)
formatter.formatDate(date) // 'الثلاثاء، 29 جمادى الآخرة 1443 هـ'
```
