import { Methods } from '../src/types/Methods'
import { PrayerNames, UseCalculator } from '../src'

// Cyberjaya location
const calculator = new UseCalculator({
  date: new Date(2022, 0, 1),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
})
const prayerTimes = calculator.getAllPrayerTimes()
Object.values(prayerTimes).forEach((date: Date, i) => console.log(Object.keys(prayerTimes)[i], date.toLocaleString()))
// console.log(calculator.getPrayerTime(PrayerNames.FAJR))
console.log('Middle', calculator.getMiddleOfTheNightTime().time?.toLocaleString())
console.log('LastThird', calculator.getLastThirdOfTheNightTime().time?.toLocaleString())
// console.log(calculator.getCalculationOptions())

const alAqsaCoordinates = {
  latitude: 31.7782624,
  longitude: 35.2335256,
}

console.log(calculator.getQiblaDirection())
console.log(calculator.getQiblaDirection(alAqsaCoordinates))
// const formatter = new Formatter({
//   locale: 'en-US',
//   timeZone: 'Asia/Kuala_Lumpur',
//   weekday: 'long',
//   hour: 'numeric',
//   minute: '2-digit',
//   hour12: true,
// })

// calculator.listenToAdhan().subscribe({
//   next(x: any) {
//     console.log('got value ', x)
//   },
//   error(err: any) {
//     console.error('something wrong occurred: ', err)
//   },
//   complete() {
//     console.log('done')
//   },
// })
