# Integrations

WIP

## Vue

`prayers-call` plays very nicely with vue reactivity system and composition api in fact when designing `prayers-call`. we designed while having Vue in the back of our mind as an inspiration and as a potential use case for us to use `prayers-call`.

### basic usage

The most straight-forward way to use it is by using the `useReactiveCalculator` composable.

```ts
const { reactiveCalculator, isInitialized } = useReactiveCalculator(config)

whenever(isInitialized, () => {
  const prayers = computed(() => reactiveCalculator.value.getAllPrayerTimes())
  const adhan = useObservable(reactiveCalculator.value.adhanObserver)
  watch(adhan, () => {
    console.log('Time for prayer')
  })
})
```

### with controls

### reactive config

### sharable instance
