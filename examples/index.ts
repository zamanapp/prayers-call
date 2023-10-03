import { Methods } from '../src/types/Methods'
import { Formatter, HighLatitudeRule, HijriCalendar, PrayerNames, ReactiveCalculator, StaticCalculator } from '../src'
import type { TimeEventObject } from '../src'
import { TimesNames } from '../src/types/TimeObject'

// Cyberjaya location
const calculator = new StaticCalculator({
  date: new Date(),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.MALAYSIA,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})

const formatter = new Formatter()
const prayerTimes = calculator.getAllPrayerTimes()
prayerTimes.forEach((prayer) => console.log(prayer.name, formatter.formatDate(prayer.time)))

const formatterExample = new Formatter({
  locale: 'ar-DZ',
  calendar: HijriCalendar.UMM_AL_QURA,
  dateStyle: 'full',
})

const date = new Date(2022, 1, 1)
console.log('default formatter', formatterExample.formatDate(date))

const rule = HighLatitudeRule.recommended({ latitude: 59.91, longitude: 10.75 }) // SeventhOfTheNight
console.log(rule)
// console.log(calculator.getPrayerTime(PrayerNames.FAJR))
// console.log('Middle', calculator.getMiddleOfTheNightTime().time?.toLocaleString())
// console.log('LastThird', calculator.getLastThirdOfTheNightTime().time?.toLocaleString())
// // console.log(calculator.getCalculationOptions())

// const alAqsaCoordinates = {
//   latitude: 31.7782624,
//   longitude: 35.2335256,
// }

// console.log(calculator.getQiblaDirection())
// console.log(calculator.getQiblaDirection(alAqsaCoordinates))
// // const formatter = new Formatter({
// //   locale: 'en-US',
// //   timeZone: 'Asia/Kuala_Lumpur',
// //   weekday: 'long',
// //   hour: 'numeric',
// //   minute: '2-digit',
// //   hour12: true,
// // })

// const reactiveCalculator = new ReactiveCalculator({
//   latitude: 2.9213,
//   longitude: 101.6559,
//   method: Methods.SINGAPORE,
//   adjustments: { dhuhr: 3, asr: 3, isha: 2 },
// })

// reactiveCalculator.adhanObserver().subscribe({
//   next(value: TimeEventObject) {
//     console.log(`Time for ${value.name}`)
//   },
//   error(err) {
//     console.error('An error occurred: ', err)
//   },
// })

// reactiveCalculator.qiyamTimesObserver().subscribe({
//   next(value: TimeEventObject) {
//     if (value.name === TimesNames.MIDDLE_OF_THE_NIGHT) {
//       // notify Abu bakr
//     }

//     if (value.name === TimesNames.LAST_THIRD_OF_THE_NIGHT) {
//       // notify Umar
//     }
//   },
//   error(err) {
//     console.error('An error occurred: ', err)
//   },
// })
