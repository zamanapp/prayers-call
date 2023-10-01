import type { FormatterConfig } from './types/FormatterConfig'
import type { FormattedTimeObject, TimeObject } from './types/TimeObject'
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

  public formatDate(date: Date): string {
    return this._formatter.format(date)
  }

  public formatPrayers(prayerTimes: TimeObject[]): FormattedTimeObject[] {
    return prayerTimes.map((v) => {
      return {
        name: v.name,
        time: this.formatDate(v.time),
      }
    })
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
