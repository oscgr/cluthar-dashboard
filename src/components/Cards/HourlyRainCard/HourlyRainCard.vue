<template>
  <v-card
    width="100%"
    height="100%"
    min-height="150px"
    flat
    :loading="loading"
    title="Pluie - aujourd'hui"
  >
    <VueApexCharts
      :key="`chart_temp_${loading}${dark}`"
      ref="chart"
      class=" position-absolute"
      style="width: 100%; bottom: 0; z-index: -1; pointer-events: none"
      type="area"
      :series="series"
      :options="chartOptions"
      height="140"
    />
    <v-card-text>
      <v-row no-gutters class="flex-nowrap justify-space-between ">
        <v-col v-for="entry in chunkedCols" :key="entry.dt" class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1">
          <ChartCol :entry="entry" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { chunk, dropRight, initial, tail } from 'lodash'
import { useDark } from '@vueuse/core'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
import ChartCol from '@/components/Cards/HourlyRainCard/HourlyRainCardChartCol.vue'

const { loading, payload } = useWeather()

const chart = ref(null)
const dark = useDark()
const CHART_CHUNK_SIZE = 1
const COL_CHUNK_SIZE = 3
// const temperatures = computed(() => payload.value.hourly?.map(m => m.temp))

const chunkedHourly = computed(() => chunk(dropRight(payload.value.hourly, 24) || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chunkedCols = computed(() => initial(tail(chunk(dropRight(payload.value.hourly, 24) || [], COL_CHUNK_SIZE))).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => Global.mergeApexChartOptions({
  yaxis: {
    // TODO make dynamic if > 8mm but should be unusual - @see http://pluiesextremes.meteo.fr/france-metropole/Intensite-de-precipitations.html
    // TODO If > 8mm display rain as red?
    max: 8,
  },
  chart: {
    type: 'area',
  },
  stroke: {
    width: 0,
    curve: 'stepline',
    lineCap: 'square',
    // dashArray: 3,
  },
  fill: {
    opacity: 1,
    type: 'solid',
    // type: 'pattern',
    // pattern: {
    //   style: ['verticalLines', 'horizontalLines'],
    //   width: 5,
    //   height: 6,
    // },
    colors: ['rgba(1,128,255,0.4)'],
  },
  colors: ['rgba(1,128,255,0.4)'],
}))
const series = computed(() => {
  return [
    {
      name: 'Pluie (1h)',
      data: chunkedHourly.value?.map(({ rain, dt }) => [dt, rain?.['1h'] || 0]) || [],
    },
    // {
    //   name: 'Vent (km/h)',
    //   data: chunkedHourly.value.map(({ wind_speed, dt }) => [dt, wind_speed * 3.6]),
    // },
  ]
})
</script>
