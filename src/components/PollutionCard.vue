<template>
  <v-card
    width="100%"
    height="100%"
    min-height="150px"
    flat
    :loading="loading"
    title="Qualité de l'air"
  >
    <VueApexCharts
      :key="`chart_temp_${loading}${dark}`"
      ref="chart"
      class="pt-2 ml-n5 position-absolute"
      style="width: 108%; z-index: -1; pointer-events: none; bottom: 0;"
      type="line"
      :series="series"
      :options="chartOptions"
      height="140"
    />
    <v-card-subtitle>
      Actuellement - <span class="font-weight-bold" v-text="getAirQualityText(payload.current?.european_aqi)" />
    </v-card-subtitle>
    <v-card-text>
      <v-row no-gutters class="flex-nowrap justify-space-between ">
        <v-col v-for="entry in chunkedCols" :key="entry.dt" class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1">
          <div style="backdrop-filter: opacity(50%); border-radius: 2px; font-family: 'Roboto Condensed', sans-serif; font-size: 18px; white-space: nowrap" v-text="`${DateTime.fromMillis(entry.dt).hour}h`" />
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1" />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { useDark } from '@vueuse/core'
import { DateTime } from 'luxon'
import { chunk } from 'lodash'
import Global from '@/utils/global'
import usePollution from '@/store/pollution'

const { loading, payload, getAirQualityColor, getAirQualityText } = usePollution()

const chart = ref(null)
const dark = useDark()
const COL_CHUNK_SIZE = 6
const hourly = computed(() => payload.value.hourly?.time.map((dt, i) => ({ dt: DateTime.fromISO(dt).toMillis(), value: payload.value.hourly?.european_aqi[i] })) || [])

const chunkedCols = computed(() => chunk(hourly.value, COL_CHUNK_SIZE).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => Global.mergeApexChartOptions({
  stroke: {
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: hourly.value.map((v, i) => ({
        opacity: 1,
        offset: i / hourly.value.length * 100,
        color: getAirQualityColor(v.value),
      })),
    },
  },
}))
const series = computed(() => {
  return [
    {
      name: 'index',
      data: hourly.value.map(({ dt, value }) => [dt, value]),
    },
  ]
})
</script>
