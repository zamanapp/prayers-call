<template>
  <div ref="map"></div>
</template>

<script setup lang="ts">
import * as Plot from '@observablehq/plot'
import { onMounted, ref } from 'vue'

const map = ref<HTMLElement | null>(null)

onMounted(() => {
  //   const plot = Plot.plot({
  //     height: 12 * 160, // 160px per month
  //     width: root.value?.clientWidth,
  //     marks: [
  //       // plot the world map
  //       Plot.geo({
  //         // the data is a topojson file
  //         data: Plot.topojson(
  //           "https://vega.github.io/vega-datasets/data/world-110m.json"
  //         ),
  //         // the projection is a d3 projection
  //         projection: "geoNaturalEarth1",
  //         // the outline of the map is a path
  //         outline: ({ type }) => type === "Sphere",
  //         // the land is a filled path
  //         fill: ({ type }) => type !== "Sphere",
  //         // the stroke of the land is white
  //         stroke: ({ type }) => type !== "Sphere" && "#fff",
  //         // the stroke width of the land is 0.5
  //         strokeWidth: ({ type }) => type !== "Sphere" && 0.5,
  //         // the color of the land is a gradient
  //         color: {
  //           // the domain is the min and max of the population
  //           domain: [0, 1400000000],
  //           // the range is a color scheme
  //           range: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
  //           // the value is the population
  //           value: (d) => d.properties.pop_est,
  //         },
  //       }),
  //     ],
  //   });
  //   map.value?.lastChild?.remove();
  //   map.value?.append(plot);
})
</script>
