<template>
  <v-card
    width="100%"
    height="100%"
    flat
  >
    <v-card-title v-text="`Températures pour 48 heures`" />
    <VueApexCharts
      type="line"
      :series="series"
      :options="chartOptions"
      height="150"
    />
  <!--      <v-sparkline -->
  <!--        padding="0" -->
  <!--        :color="$vuetify.theme.dark ? 'white': 'primary'" -->
  <!--        smooth -->
  <!--        :value="temperatures" -->
  <!--      /> -->
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { DateTime } from 'luxon'
import type { ApexOptions } from 'apexcharts'
import Global from '@/utils/global'
import useWeather from '@/store/weather'
const { loading, payload } = useWeather()

// const temperatures = computed(() => payload.value.hourly?.map(m => m.temp))

// const cardColor = computed(() => {
//   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
//   else if (vm.$vuetify.theme.dark) return '#29586d'
//   else if (!isCloudy.value) return '#a6dcef'
//   else return '#d8e9ef'
// })

const chartOptions = computed<ApexOptions>(() => {
  return {
    ...Global.getGlobalApexChartOptions(),
    xaxis: {
      labels: {
        rotate: 0,
        formatter: (value: number) => {
          if (!value)
            return
          return DateTime.fromMillis(value).toLocaleString(DateTime.TIME_24_SIMPLE)
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tickAmount: 5,
      categories: payload.value.hourly?.map(m => m.dt) || [],
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true,
    },
    markers: {
      size: 1,
    },

    // yaxis: {
    //   // min: 0,
    //   // labels: {
    //   //   show: false,
    //   // formatter: (value) => `${Math.floor(value)}mm`
    //   // },
    //   axisBorder: {
    //     show: false,
    //   },
    //   axisTicks: {
    //     show: false,
    //   },
    //   tickAmount: 5,
    //   // categories: payload.value.hourly?.map(m => m.dt)
    // }

  }
},
)
const series = computed(() => {
  return [
    {
      name: 'rain',
      data: payload.value.hourly?.map(m => m.temp) || [],
    },
    {
      name: 'feels like',
      data: payload.value.hourly?.map(m => m.feels_like) || [],
    },
  ]
})
</script>
