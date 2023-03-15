<template>
  <v-card
    width="100%"
    height="100%"
    flat
  >
    <v-card-title v-text="`Précipitation dans l'heure`" />
    <v-card-text v-if="noData">
      <span class="text-h5" v-text="'Pas d\'informations'" />
    </v-card-text>
    <v-card-text v-else-if="!anyPrecipitation">
      <span class="text-h5" v-text="'Aucune pluie enregistrée'" />
    </v-card-text>

    <VueApexCharts
      v-else
      style="pointer-events: none"
      type="heatmap"
      :series="series"
      :options="chartOptions"
      height="150"
    />
    <!--      <v-sparkline -->
    <!--        v-if="anyPrecipitation" -->
    <!--        fill -->
    <!--        padding="0" -->
    <!--        :color="$vuetify.theme.dark ? 'white': 'primary'" -->
    <!--        smooth -->
    <!--        :value="precipitation" -->
    <!--      /> -->
  </v-card>
</template>

<script lang="ts" setup>
import VueApexCharts from 'vue3-apexcharts'
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import { chunk, floor } from 'lodash'
import { DateTime } from 'luxon'
import useWeather from '@/store/weather'
import Global from '@/utils/global'

const CHART_CHUNK_SIZE = 10

const { loading, payload } = useWeather()

const noData = computed<boolean>(() => typeof payload.value.minutely === 'undefined')
const anyPrecipitation = computed<boolean>(() => payload.value.minutely?.some(m => m.precipitation > 0) || false)

const chunkedMinutely = computed(() => chunk(payload.value.minutely || [], CHART_CHUNK_SIZE).map(([first]) => first))

const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    plotOptions: {
      heatmap: {
        radius: 0,
        enableShades: false,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [{
            from: 0,
            to: 0.1,
            color: '#FFFFFF',
            foreColor: '#000000',
            name: 'Nulle',
          }, {
            from: 0.1,
            to: 1,
            color: '#cee3fd',
            foreColor: '#000000',
            name: 'Gouttes',
          }, {
            from: 1,
            to: 3,
            color: '#75b9ff',
            // foreColor: undefined,
            name: 'Pluie faible',
          }, {
            from: 3,
            to: 7,
            color: '#007fff',
            // foreColor: undefined,
            name: 'Pluie modérée',
          }, {
            from: 7,
            color: '#004386',
            // foreColor: undefined,
            name: 'Pluie forte',
          }],
          inverse: false,
          min: 0,
          max: 8,
        },
      },
    },
    xaxis: {
      type: 'category',
      labels: {
        show: false,
        showDuplicates: true,
        rotate: 0,
        //     showDuplicates: true,
        //     // format: 'datetime',
        formatter: (value: number) => {
          if (!value)
            return ''
          // return DateTime.fromMillis(value * 1000).toJSDate()
          return `${DateTime.fromMillis(value * 1000).diffNow(['minutes', 'seconds']).minutes} min.`
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    //   // tickAmount: 5,
    //   // categories: chunk(payload.value.minutely?.map(m => m.dt) || [], CHART_CHUNK_SIZE).map(([first]) => first),
    },
    yaxis: {
    //   min: 0,
      labels: {
        show: false,
        // formatter: (value: number) => {
        //   return `${Math.floor(value * 1000)} mm`
        // },
      },
      axisBorder: {
        show: false,
      },
    //   axisTicks: {
    //     show: false,
    //   },
    //   tickAmount: 5,
    //   // categories: chunk(payload.value.minutely?.map(m => m.dt) || [], CHART_CHUNK_SIZE).map(([first]) => first),
    },
    // colors: ['rgba(20,135,197,1)'],
    dataLabels: {
      enabled: true,
      formatter(val) {
        if (!val)
          return
        return `${floor(Number(val), 1)}mm`
      },
      style: {
        // colors: ['#fff'],
      },
    },
  }
},
)
const series = computed<{ name: string; data: { x: number; y: number } }[]>(() => {
  console.table(chunkedMinutely.value)
  return [{
    name: 'rain',
    data: chunkedMinutely.value.map(({ dt, precipitation }) => ({ x: dt, y: precipitation })),
  }]
})

// const cardColor = computed(() => {
//   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
//   else if (vm.$vuetify.theme.dark) return '#29586d'
//   else if (!isCloudy.value) return '#a6dcef'
//   else return '#d8e9ef'
// })
</script>

<style>
</style>
