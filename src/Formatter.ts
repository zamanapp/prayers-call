import type { FormattedTimeObject } from './types/TimeObject'
import type { FormatterConfig } from './types/FormatterConfig'

export class Formatter {
  private _formatter!: Intl.DateTimeFormat
  private _config!: FormatterConfig

  constructor(config?: FormatterConfig) {
    // date formatter initialization
    if (config) {
      // TODO: pull the timezone from coordinates
      this._config = config
      const { locale, ...options } = config
      this._formatter = new Intl.DateTimeFormat(
        locale || 'en-US',
        options || {
          // timeZone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }
      )
    } else {
      this._config = {
        locale: 'en-US',
        // timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
      const { locale, ...options } = this._config
      this._formatter = new Intl.DateTimeFormat(locale, options)
    }
  }

  public format(prayerTimeObject: unknown): FormattedTimeObject {
    // clone the object that is passed to prevent mutation
    const formattedTimeObject = Object.assign({}, prayerTimeObject)
    Object.keys(formattedTimeObject).forEach(
      (key: string) => (formattedTimeObject[key] = this._formatter.format(formattedTimeObject[key]))
    )
    return formattedTimeObject
  }

  public setFormatterOptions(newConfig: Partial<FormatterConfig>) {
    // TODO: pull the timezone from coordinates
    const { locale, ...options } = newConfig
    this._formatter = new Intl.DateTimeFormat(
      locale || 'en-US',
      options || {
        // timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
    )
  }
}
