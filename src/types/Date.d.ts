/// <reference types="@js-temporal/polyfill" />
import { Temporal } from '@js-temporal/polyfill'

declare global {
  interface Date {
    toTemporalInstant(this: Date): Temporal.Instant
  }
}
