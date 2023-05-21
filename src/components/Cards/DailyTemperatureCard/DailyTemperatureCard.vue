<template>
  <v-card
    width="100%"
    height="100%"
    min-height="150px"
    flat
    :loading="loading"
  >
    <VueApexCharts
      :key="`chart_temp_${loading}${dark}`"
      class="pt-2 ml-n8 position-absolute"
      style="width: 114%; z-index: -1; pointer-events: none"
      type="rangeArea"
      :series="series"
      :options="chartOptions"
      height="140"
    />
    <v-card-title v-text="`Tendances - une semaine`" />
    <v-card-text>
      <v-row no-gutters class="flex-nowrap justify-space-between ">
        <v-col
          v-for="entry in chunkedDaily" :key="entry.dt"
          class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1"
        >
          <DailyTemperatureCardChartCol :entry="entry" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { chunk, initial, tail } from 'lodash'
import { useDark } from '@vueuse/core'
import { useTheme } from 'vuetify'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
import DailyTemperatureCardChartCol from '@/components/Cards/DailyTemperatureCard/DailyTemperatureCardChartCol.vue'

const { payload, loading } = useWeather()
const { current } = useTheme()
const dark = useDark()

const CHART_CHUNK_SIZE = 1
// const temperatures = computed(() => payload.value.daily?.map(m => m.temp))

// const cardColor = computed(() => {
//   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
//   else if (vm.$vuetify.theme.dark) return '#29586d'
//   else if (!isCloudy.value) return '#a6dcef'
//   else return '#d8e9ef'
// })

const chunkedDaily = computed(() => initial(tail(chunk(payload.value.daily || [], CHART_CHUNK_SIZE))).map(([first]) => first))
const chunkedDailyForGraph = computed(() => chunk(payload.value.daily || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => Global.mergeApexChartOptions({
  stroke: {
    width: 1,
    colors: [current.value.colors.info],
  },
  // colors: ['rgba(0,0,255,0.1)', 'rgba(255,0,0,0.2)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'],
  fill: {
    pattern: {
      width: 1,
      height: 1,
    },
    opacity: 0.2,
    type: 'solid',
    colors: [current.value.colors.info],
    // type: 'pattern',
    // pattern: {
    //   style: ['verticalLines', 'horizontalLines'],
    //   width: 5,
    //   height: 6,
    // },
    // colors: ['rgba(1,128,255,0.4)'],
  },
}))
const series = computed(() => {
  return [
    {
      name: 'temp',
      data: chunkedDailyForGraph.value.map(({ dt, temp }) => ({
        x: dt,
        y: [temp.min, temp.max],
      })),
    },
    // {
    //   name: 'median',
    //   data: chunkedDailyForGraph.value.map(({ dt, temp }) => ({
    //     x: dt,
    //     y: temp.day,
    //   })),
    // },
    // {
    //   name: 'max',
    //   data: chunkedDailyForGraph.value.map(({ temp, dt }) => [dt, temp.max]),
    // },
    // {
    //   name: 'min',
    //   data: chunkedDailyForGraph.value.map(({ temp, dt }) => [dt, temp.min]),
    // },
    // {
    //   name: 'max',
    //   data: chunkedDailyForGraph.value.map(({ temp, dt }) => [dt, temp.max]),
    // },
    // {
    //   name: 'morn',
    //   data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.morn]),
    // },
    // {
    //   name: 'day',
    //   data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.day]),
    // },
    // {
    //   name: 'eve',
    //   data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.eve]),
    // },
    // {
    //   name: 'night',
    //   data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.night]),
    // },
    // {
    //   name: 'wind',
    //   data: chunkedDaily.value.map(({ wind_speed, dt }) => [dt, wind_speed]),
    // },
    // {
    //   name: 'rain',
    //   data: chunkedDaily.value.map(({ rain, dt }) => [dt, rain]),
    // },
    // {
    //   name: 'clouds',
    //   data: chunkedDaily.value.map(({ clouds, dt }) => [dt, clouds]),
    // },
  ]
})
// const rain = computed(() => [
//   {
//     name: 'rain',
//     data: chunkedDaily.value.map(({ rain, dt }) => [dt, rain]),
//
//   },
// ])
</script>
