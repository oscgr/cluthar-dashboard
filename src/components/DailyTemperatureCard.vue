<template>
  <v-card
    width="100%"
    height="100%"
    flat
  >
    <v-card-title v-text="`Tendances - une semaine`" />
    <VueApexCharts
      ref="chart"
      type="line"
      :series="series"
      :options="chartOptions"
      height="150"
    />
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { chunk } from 'lodash'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
const { loading, payload } = useWeather()

const chart = ref(null)
const CHART_CHUNK_SIZE = 1
// const temperatures = computed(() => payload.value.daily?.map(m => m.temp))

// const cardColor = computed(() => {
//   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
//   else if (vm.$vuetify.theme.dark) return '#29586d'
//   else if (!isCloudy.value) return '#a6dcef'
//   else return '#d8e9ef'
// })

const chunkedDaily = computed(() => chunk(payload.value.daily || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    xaxis: {
      categories: chunkedDaily.value.map((v, i) => `J+${i}`),
      labels: {
        show: true,
        rotate: 0,
        // formatter: (value: number) => {
        //   if (!value)
        //     return
        //   return DateTime.fromMillis(value * 1000).day
        // },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      // type: 'category',
    },
    colors: ['#77B6EA', '#de0808', '#0064fc', '#77CAEA'],
    // dataLabels: {
    //   enabled: true,
    //   style: {
    //     fontSize: 9,
    //   },
    // },
    // markers: {
    //   size: 1,
    // },

    yaxis: {
      labels: {
        show: false,
        // formatter: (value: number) => `${Math.floor(value)}°C`,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      // categories: payload.value.daily?.map(m => m.dt)
    },
    // annotations: {
    //   points: [
    //     {
    //       x: maxBy(chunkedDaily.value || [], 'temp')?.dt,
    //       y: maxBy(chunkedDaily.value || [], 'temp')?.temp.max,
    //       marker: {
    //         size: 2,
    //         strokeWidth: 1,
    //       },
    //       label: {
    //         borderColor: 'rgba(256, 256, 256, 0.9)',
    //         style: {
    //           // color: '',
    //           background: 'rgba(256, 256, 256, 0.9)',
    //         },
    //         text: `${Math.floor(max(payload.value.daily?.map(m => m.temp.max)) || 0)}°C à ${DateTime.fromMillis((maxBy(chunkedDaily.value || [], 'temp')?.dt || 0) * 1000).day}`,
    //       },
    //     },
    //     {
    //       x: minBy(chunkedDaily.value || [], 'temp')?.dt,
    //       y: minBy(chunkedDaily.value || [], 'temp')?.temp.min,
    //       marker: {
    //         size: 2,
    //         strokeWidth: 1,
    //       },
    //       label: {
    //         borderColor: 'rgba(256, 256, 256, 0.9)',
    //         style: {
    //           // color: '',
    //           background: 'rgba(256, 256, 256, 0.9)',
    //         },
    //         text: `${Math.floor(min(payload.value.daily?.map(m => m.temp.min)) || 0)}°C à ${DateTime.fromMillis((minBy(chunkedDaily.value || [], 'temp')?.dt || 0) * 1000).day}`,
    //       },
    //     },
    //   ],
    // },
  }
},
)
const series = computed(() => {
  return [
    {
      name: 'min',
      data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.min]),
    },
    {
      name: 'max',
      data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.max]),
    },
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
</script>
