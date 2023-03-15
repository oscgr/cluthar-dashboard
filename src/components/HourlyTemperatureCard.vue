<template>
  <v-card
    width="100%"
    height="100%"
    flat
  >
    <v-card-title v-text="`Températures pour 48 heures`" />
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
import { DateTime } from 'luxon'
import type { ApexOptions } from 'apexcharts'
import { chunk, max, maxBy, min, minBy } from 'lodash'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
const { loading, payload } = useWeather()

const chart = ref(null)
const CHART_CHUNK_SIZE = 4
// const temperatures = computed(() => payload.value.hourly?.map(m => m.temp))

// const cardColor = computed(() => {
//   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
//   else if (vm.$vuetify.theme.dark) return '#29586d'
//   else if (!isCloudy.value) return '#a6dcef'
//   else return '#d8e9ef'
// })

const chunkedHourly = computed(() => chunk(payload.value.hourly || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    xaxis: {
      labels: {
        rotate: 0,
        formatter: (value: number) => {
          if (!value)
            return
          return DateTime.fromMillis(value * 1000).toLocaleString(DateTime.TIME_24_SIMPLE)
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      type: 'numeric',
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      // enabled: true,
    },
    markers: {
      // size: 1,
    },

    yaxis: {
      labels: {
        show: true,
        formatter: (value: number) => `${Math.floor(value)}°C`,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      // categories: payload.value.hourly?.map(m => m.dt)
    },
    annotations: {
      points: [
        {
          x: maxBy(chunkedHourly.value || [], 'temp')?.dt,
          y: maxBy(chunkedHourly.value || [], 'temp')?.temp,
          marker: {
            size: 2,
            strokeWidth: 1,
          },
          label: {
            borderColor: 'rgba(256, 256, 256, 0.9)',
            style: {
              // color: '',
              background: 'rgba(256, 256, 256, 0.9)',
            },
            text: `${Math.floor(max(payload.value.hourly?.map(m => m.temp)) || 0)}°C à ${DateTime.fromMillis((maxBy(chunkedHourly.value || [], 'temp')?.dt || 0) * 1000).toLocaleString(DateTime.TIME_24_SIMPLE)}`,
          },
        },
        {
          x: minBy(chunkedHourly.value || [], 'temp')?.dt,
          y: minBy(chunkedHourly.value || [], 'temp')?.temp,
          marker: {
            size: 2,
            strokeWidth: 1,
          },
          label: {
            borderColor: 'rgba(256, 256, 256, 0.9)',
            style: {
              // color: '',
              background: 'rgba(256, 256, 256, 0.9)',
            },
            text: `${Math.floor(min(payload.value.hourly?.map(m => m.temp)) || 0)}°C à ${DateTime.fromMillis((minBy(chunkedHourly.value || [], 'temp')?.dt || 0) * 1000).toLocaleString(DateTime.TIME_24_SIMPLE)}`,
          },
        },
      ],
    },
  }
},
)
const series = computed(() => {
  return [
    {
      name: 'temp',
      data: chunkedHourly.value.map(({ temp, dt }) => [dt, temp]),
    },
    // TODO in options
    // {
    //   name: 'feels like',
    //   data: chunk(payload.value.hourly?.map(m => m.feels_like) || [], CHART_CHUNK_SIZE).map(([first]) => first),
    // },
    // {
    //   name: 'Dew point',
    //   data: chunk(payload.value.hourly?.map(m => m.dew_point) || [], CHART_CHUNK_SIZE).map(([first]) => first),
    // },
  ]
})
</script>
