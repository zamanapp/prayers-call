<template>
  <div v-if="isLoading" style="width: 100%">Loading Data...</div>
  <div v-else style="width: 100%" ref="map"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue'
import * as Plot from '@observablehq/plot'
import { json } from 'd3'
import { useData } from 'vitepress'
import { CountryMethods } from '../../src/data/methods'
import { Methods } from '../../src'

const isLoading = ref(true)
const { isDark } = useData()
const map = ref<HTMLElement | null>(null)
const dataPath = '../data/countries.geojson'
const world = shallowRef<any | null>(null)

onMounted(async () => {
  await json(dataPath).then((data) => {
    world.value = data
    isLoading.value = false
  })

  const main = document.querySelector('main')

  // we had to prepare two plots because calculating the plot was very slow
  const darkPlot = plotCalculator(false, main)
  const lightPlot = plotCalculator(true, main)
  watch(
    isDark,
    () => {
      map.value?.lastChild?.remove()
      map.value?.append(isDark.value ? darkPlot : lightPlot)
    },
    { immediate: true }
  )
})

function plotCalculator(isLight: boolean, container: HTMLElement | null) {
  return Plot.plot({
    width: container?.clientWidth,
    style: {
      background: 'transparent',
    },
    projection: 'equirectangular',
    color: {
      scheme: isLight ? 'Sinebow' : 'Rainbow',
      type: 'categorical',
    },
    marks: [
      Plot.geo(world.value, { fill: isLight ? 'currentColor' : 'white', fillOpacity: 0.4 }),
      Plot.graticule({ opacity: 0.7 }),
      Plot.geo(world.value.features, {
        fill: (d) => {
          const country: Methods[] | undefined = CountryMethods[d.properties.ISO_A3]
          return country ? country[0] : 'currentColor'
        },
        fillOpacity(d) {
          const country: Methods[] | undefined = CountryMethods[d.properties.ISO_A3]
          return country ? 1 : 0
        },
        filter: (d) => Object.keys(CountryMethods).includes(d.properties.ISO_A3),
      }),
      Plot.tip(
        world.value.features,
        Plot.pointer(
          Plot.centroid({
            filter: (d) => Object.keys(CountryMethods).includes(d.properties.ISO_A3),
            channels: {
              name: {
                label: 'Name',
                value: (d) => d.properties.ADMIN,
              },
              methods: {
                label: 'Methods',
                value: (d) => CountryMethods[d.properties.ISO_A3]?.join(', ') ?? 'No data',
              },
            },
            format: {
              name: (d) => d,
              methods: (d) => d,
              x: false,
              y: false,
            },
            fill: isLight ? 'white' : 'black',
          })
        )
      ),
    ],
  })
}
</script>
