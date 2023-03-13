<template>
  <v-card
    width="100%"
    height="100%"
    flat
  >
    <v-card-title v-text="`Précipitation dans l'heure`" />
    <v-card-text v-if="!anyPrecipitation">
      <span class="text-h4" v-text="'Aucune pluie enregistrée'" />
    </v-card-text>

    <VueApexCharts
      v-if="anyPrecipitation"
      type="line"
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
import Moment from 'moment'
import weatherStore from '@/store/weatherStore'
import Global from '@/utils/global'

const { loading, payload } = weatherStore()

const anyPrecipitation = computed(() => payload.value.minutely?.some(m => m.precipitation > 0))

const chartOptions = computed(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    xaxis: {
      labels: {
        rotate: 0,
        formatter: value => `${Moment.unix(value).diff(Moment(), 'minute')} min.`,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tickAmount: 5,
      categories: payload.value.minutely?.map(m => m.dt),
    },
    yaxis: {
      min: 0,
      labels: {
        show: false,
        // formatter: (value) => `${Math.floor(value)}mm`
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tickAmount: 5,
      categories: payload.value.minutely?.map(m => m.dt),
    },

  }
},
)
const series = computed(() => {
  return [{
    name: 'rain',
    data: payload.value.minutely?.map(m => m.precipitation),
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
