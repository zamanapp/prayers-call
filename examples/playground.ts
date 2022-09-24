import { Observable, defer, repeat } from 'rxjs'

const randNum = () => Math.floor(Math.random() * 10) + 1

const myObs = () => {
  return defer(() => {
    let delay = randNum()
    console.log('It will be delayed by', delay, ' secounds')
    delay = delay * 1000 // convert to ms
    return new Observable((subscriber) => {
      subscriber.next('hey there')
      subscriber.complete()
    }).pipe(repeat({ delay }))
  })
}

myObs().subscribe((val) => {
  console.log('this is the val', val)
})
