export function dateByAddingMinutes(date: Date, minutes: number) {
  return dateByAddingSeconds(date, minutes * 60)
}

export function dateByAddingSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000)
}
