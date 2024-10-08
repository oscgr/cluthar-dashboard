<template>
  <v-card
    width="100%"
    height="100%"
    min-height="150px"
    flat
    :loading="loading"
    :title="t('constants.LAYOUT_CARD.WEATHER_NEXT_6D')"
  >
    <v-card-subtitle v-if="error" v-text="error" />
    <template v-else-if="!loading">
      <VueApexCharts
        :key="`chart_temp_${loading}${dark}`"
        class="pt-2 ml-n8 position-absolute"
        style="width: 114%; z-index: -1; bottom: 0; pointer-events: none"
        type="line"
        :series="series"
        :options="chartOptions"
        height="140"
        title="Tendances - une semaine"
      />
      <v-card-text class="pt-0">
        <v-row no-gutters class="flex-nowrap justify-space-between ">
          <v-col
            v-for="entry in chunkedDaily" :key="entry.dt"
            class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1"
          >
            <DailyTemperatureCardChartCol :entry="entry" />
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { chunk, initial, tail } from 'lodash'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
import DailyTemperatureCardChartCol from '@/components/Cards/DailyTemperatureCard/DailyTemperatureCardChartCol.vue'

const { payload, loading, error } = useWeather()
const { t } = useI18n()
const dark = useDark()

const CHART_CHUNK_SIZE = 1

const chunkedDaily = computed(() => initial(tail(chunk(payload.value.daily || [], CHART_CHUNK_SIZE))).map(([first]) => first))
const chunkedDailyForGraph = computed(() => chunk(payload.value.daily || [], CHART_CHUNK_SIZE).map(([first]) => first))

const chartOptions = computed<ApexOptions>(() => Global.mergeApexChartOptions({ colors: [dark.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'] }))
const series = computed(() => {
  return [
    {
      name: 'min',
      data: chunkedDailyForGraph.value.map(({ dt, temp }) => ({
        x: dt,
        y: temp.min,
      })),
    },
    {
      name: 'max',
      data: chunkedDailyForGraph.value.map(({ dt, temp }) => ({
        x: dt,
        y: temp.max,
      })),
    },
  ]
})
</script>
