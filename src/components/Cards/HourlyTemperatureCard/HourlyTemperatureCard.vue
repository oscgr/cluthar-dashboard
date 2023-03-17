<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :loading="loading"
  >
    <v-card-title class="position-absolute" style="z-index: 1" v-text="`Températures - aujourd'hui`" />
    <v-container fluid class="pa-0 position-absolute fill-height pt-4" style="z-index: 2">
      <v-row no-gutters class="flex-nowrap justify-space-between px-3">
        <v-col v-for="entry in chunkedCols" :key="entry.dt" class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1">
          <ChartCol :entry="entry" />
        </v-col>
      </v-row>
    </v-container>
    <VueApexCharts
      :key="`chart_temp_${loading}${dark}`"
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
import { chunk, dropRight } from 'lodash'
import { useDark } from '@vueuse/core'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
import ChartCol from '@/components/Cards/HourlyTemperatureCard/HourlyTemperatureCardChartCol.vue'

const { loading, payload } = useWeather()

const chart = ref(null)
const dark = useDark()
const CHART_CHUNK_SIZE = 2
const COL_CHUNK_SIZE = 3
// const temperatures = computed(() => payload.value.hourly?.map(m => m.temp))

const chunkedHourly = computed(() => chunk(dropRight(payload.value.hourly, 24) || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chunkedCols = computed(() => chunk(dropRight(payload.value.hourly, 24) || [], COL_CHUNK_SIZE).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    colors: [dark.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', dark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'],
  }
},
)
const series = computed(() => {
  return [
    {
      name: 'Températures',
      data: chunkedHourly.value.map(({ temp, dt }) => [dt, temp]),
    },
    // TODO in options
    {
      name: 'Ressenti',
      data: chunkedHourly.value.map(({ feels_like, dt }) => [dt, feels_like]),
    },
    // {
    //   name: 'Dew point',
    //   data: chunkedHourly.value.map(({ dew_point, dt }) => [dt, dew_point]),
    // },
    // {
    //   name: 'Wind',
    //   data: chunkedHourly.value.map(({ wind_speed, dt }) => [dt, wind_speed]),
    // },
  ]
})
</script>
