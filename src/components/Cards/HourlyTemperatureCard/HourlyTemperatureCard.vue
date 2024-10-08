<template>
  <v-card
    width="100%"
    height="100%"
    min-height="150px"
    flat
    :loading="loading"
    :title="t('constants.LAYOUT_CARD.TEMP_NEXT_24H')"
  >
    <v-card-subtitle v-if="error" v-text="error" />
    <template v-else-if="!loading">
      <VueApexCharts
        :key="`chart_temp_${loading}${dark}`"
        ref="chart"
        class="pt-2 ml-n5 position-absolute"
        style="width: 108%; z-index: -1; bottom: 0; pointer-events: none"
        type="line"
        :series="series"
        :options="chartOptions"
        height="140"
      />
      <v-card-text class="pt-0">
        <v-row no-gutters class="flex-nowrap justify-space-between ">
          <v-col v-for="entry in chunkedCols" :key="entry.dt" class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1">
            <ChartCol :entry="entry" />
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { chunk, dropRight, initial, tail } from 'lodash'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
import ChartCol from '@/components/Cards/HourlyTemperatureCard/HourlyTemperatureCardChartCol.vue'

const { loading, payload, error } = useWeather()
const { t } = useI18n()
const chart = ref(null)
const dark = useDark()
const CHART_CHUNK_SIZE = 2
const COL_CHUNK_SIZE = 3
// const temperatures = computed(() => payload.value.hourly?.map(m => m.temp))

const chunkedHourly = computed(() => chunk(dropRight(payload.value.hourly, 24) || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chunkedCols = computed(() => initial(tail(chunk(dropRight(payload.value.hourly, 24) || [], COL_CHUNK_SIZE))).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => Global.mergeApexChartOptions({ colors: [dark.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', dark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'] }))
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
