<template>
  <v-card
    width="100%"
    height="100%"
    flat
  >
    <v-card-title class="position-absolute" v-text="`Précipitation dans l'heure`" />
    <v-card-subtitle class="position-absolute mt-8" v-text="subtext" />
    <v-card-text v-if="noData" class="mt-8">
      <span class="text-h5" v-text="'Pas d\'informations'" />
    </v-card-text>
    <v-card-text v-else-if="!anyPrecipitation" class="mt-8">
      <span class="text-h5" v-text="'Aucune pluie enregistrée'" />
    </v-card-text>

    <VueApexCharts
      v-else
      :key="dark"
      style="pointer-events: none"
      type="heatmap"
      :series="series"
      :options="chartOptions"
      height="150"
    />
  </v-card>
</template>

<script lang="ts" setup>
import VueApexCharts from 'vue3-apexcharts'
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import { chunk, floor } from 'lodash'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import { useDark } from '@vueuse/core'
import useWeather from '@/store/weather'
import Global from '@/utils/global'
import PrecipitationLevel from '@/enums/PrecipitationLevel'
import { diffNowLocaleString } from '@/utils/durationDisplay'

const CHART_CHUNK_SIZE = 10

const { t } = useI18n()
const { payload } = useWeather()

const dark = useDark()
const noData = computed<boolean>(() => typeof payload.value.minutely === 'undefined')
const anyPrecipitation = computed<boolean>(() => payload.value.minutely?.some(m => m.precipitation > 0) || false)

const chunkedMinutely = computed(() => chunk(payload.value.minutely || [], CHART_CHUNK_SIZE).map(([first]) => first))

const getPrecipitationLevel = (precipitation: number) => {
  switch (true) {
    case precipitation < 0.1:
      return PrecipitationLevel.NONE
    case precipitation < 1:
      return PrecipitationLevel.DROPS
    case precipitation < 3:
      return PrecipitationLevel.LIGHT
    case precipitation < 7:
      return PrecipitationLevel.MODERATE
    case precipitation >= 7:
      return PrecipitationLevel.HEAVY
    default:
      return PrecipitationLevel.NONE
  }
}

const subtext = computed(() => {
  if (typeof chunkedMinutely.value[0]?.precipitation === 'undefined')
    return ''
  if (chunkedMinutely.value[0]?.precipitation !== 0)
    return t(`constants.PRECIPITATION_LEVEL.${getPrecipitationLevel(chunkedMinutely.value[0]?.precipitation)}`)
  else if (anyPrecipitation.value)
    return `${t(`constants.PRECIPITATION_LEVEL.${getPrecipitationLevel(chunkedMinutely.value.find(({ precipitation }) => precipitation > 0)?.precipitation)}`)} ${diffNowLocaleString(DateTime.fromMillis(chunkedMinutely.value.find(({ precipitation }) => precipitation > 0)?.dt * 1000))}`
})

/* ==================== CHART ==================== */

const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    stroke: {
      colors: ['transparent'],
    },
    plotOptions: {
      heatmap: {
        radius: 0,
        enableShades: false,
        colorScale: {
          ranges: [{
            from: 0,
            to: 0.1,
            color: 'transparent',
            // foreColor: '#000000',
            name: PrecipitationLevel.NONE,
          }, {
            from: 0.1,
            to: 1,
            color: 'rgba(1,128,255,0.1)',
            foreColor: dark.value ? '#EEEEEE' : '#000000',
            name: PrecipitationLevel.DROPS,
          }, {
            from: 1,
            to: 3,
            color: 'rgba(1,128,255,0.2)',
            foreColor: dark.value ? '#EEEEEE' : '#000000',
            name: PrecipitationLevel.LIGHT,
          }, {
            from: 3,
            to: 7,
            color: 'rgba(1,128,255,0.4)',
            // foreColor: undefined,
            name: PrecipitationLevel.MODERATE,
          }, {
            from: 7,
            to: 10000,
            color: 'rgba(1,128,255,0.7)',
            // foreColor: undefined,
            name: PrecipitationLevel.HEAVY,
          }],
          inverse: false,
          min: 0,
          max: 8,
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontWeight: '100',
      },
      formatter(val) {
        if (!val)
          return
        return `${floor(Number(val), 1)}mm`
      },
    },
  }
},
)
const series = computed<{ name: string; data: { x: number; y: number } }[]>(() => {
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
