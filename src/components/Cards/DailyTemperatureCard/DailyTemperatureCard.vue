<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :loading="loading"
  >
    <v-card-subtitle v-if="noData" class="pa-4">
      Veuillez renseigner votre token
    </v-card-subtitle>
    <template v-else>
      <v-card-title class="position-absolute" v-text="`Tendances - une semaine`" />
      <v-container fluid class="pa-0 position-absolute fill-height" style="z-index: 2">
        <v-row no-gutters class="flex-nowrap justify-space-between px-3">
          <v-col v-for="entry in chunkedDaily" :key="entry.dt" class="text-center d-flex align-center flex-column flex-grow-0 flex-shrink-1">
            <DailyTemperatureCardChartCol :entry="entry" />
          </v-col>
        </v-row>
      </v-container>
      <VueApexCharts
        :key="`chart_temp_${loading}${dark}`"
        type="line"
        :series="series"
        :options="chartOptions"
        height="150"
      />
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { chunk, tail } from 'lodash'
import { useDark } from '@vueuse/core'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
import DailyTemperatureCardChartCol from '@/components/Cards/DailyTemperatureCard/DailyTemperatureCardChartCol.vue'
const { payload, loading } = useWeather()
const dark = useDark()

const CHART_CHUNK_SIZE = 1
// const temperatures = computed(() => payload.value.daily?.map(m => m.temp))

// const cardColor = computed(() => {
//   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
//   else if (vm.$vuetify.theme.dark) return '#29586d'
//   else if (!isCloudy.value) return '#a6dcef'
//   else return '#d8e9ef'
// })

const noData = computed(() => typeof payload.value.daily === 'undefined')
const chunkedDaily = computed(() => chunk(tail(payload.value.daily) || [], CHART_CHUNK_SIZE).map(([first]) => first))
const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    colors: ['rgba(0,0,255,0.1)', 'rgba(255,0,0,0.2)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', dark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'],
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
    {
      name: 'morn',
      data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.morn]),
    },
    {
      name: 'day',
      data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.day]),
    },
    {
      name: 'eve',
      data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.eve]),
    },
    {
      name: 'night',
      data: chunkedDaily.value.map(({ temp, dt }) => [dt, temp.night]),
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
const rain = computed(() => [
  {
    name: 'rain',
    data: chunkedDaily.value.map(({ rain, dt }) => [dt, rain]),

  },
])
</script>
