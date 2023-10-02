export { HighLatitudeRule, PolarCircleResolution } from 'adhan'
export { StaticCalculator } from './Calculator'
export { ReactiveCalculator } from './ReactiveCalculator'
export { Formatter } from './Formatter'
export { recommendMethod } from './MethodRecommender'
export { calculateQiblaDirection } from './QiblaCalculator'

// Types export
export { Methods } from './types/Methods'
export { AsrTime } from './types/AsrTime'
export { EventType, PrayerNames } from './types/TimeObject'
export { HijriCalendar } from './types/HijriCalendar'
export type {
  PrayersTimeObject,
  PrayerNamesType,
  TimesNamesType,
  FormattedTimeObject,
  TimeEventObject,
  TimeObject,
} from './types/TimeObject'
export type { CoordinatesObject } from './types/Coordinates'
export type { FormatterConfig } from './types/FormatterConfig'
export type { CalculationsConfig, ReactiveCalculationsConfig } from './types/CalculationsConfig'
