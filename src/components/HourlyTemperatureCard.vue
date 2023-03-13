<template>
  <v-skeleton-loader
    :style="{width: '100%', height: '100%'}"
    width="100%"
    type="image"
    :loading="loading"
  >
    <v-card
      width="100%"
      height="100%"
      flat
    >
      <v-card-title v-text="`Températures pour 48 heures`" />
      <v-chart
        type="line"
        :series="series"
        :options="chartOptions"
        height="150"
      />
      <!--      <v-sparkline-->
      <!--        padding="0"-->
      <!--        :color="$vuetify.theme.dark ? 'white': 'primary'"-->
      <!--        smooth-->
      <!--        :value="temperatures"-->
      <!--      />-->
    </v-card>

  </v-skeleton-loader>
</template>
<script>
import weatherStore from "@/store/weatherStore";
import {mdiCloudOutline, mdiGauge, mdiSnowflake, mdiWaterPercent, mdiWeatherPouring, mdiWeatherWindy} from '@mdi/js'
import {computed} from "@vue/composition-api";
import Global from "@/utils/global";
import Moment from "moment";

export default {
  name: 'HourlyTemperatureCard',

  setup() {

    // const vm = getCurrentInstance().proxy

    const {loading, payload} = weatherStore()

    // const temperatures = computed(() => payload.value.hourly?.map(m => m.temp))

    // const cardColor = computed(() => {
    //   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
    //   else if (vm.$vuetify.theme.dark) return '#29586d'
    //   else if (!isCloudy.value) return '#a6dcef'
    //   else return '#d8e9ef'
    // })

    const chartOptions = computed(() => {
        return {
          ...Global.getGlobalApexChartOptions(),
          xaxis: {
            labels: {
              rotate: 0,
              formatter: (value) => Moment.unix(value).format('ddd kk:mm')
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            tickAmount: 5,
            categories: payload.value.hourly?.map(m => m.dt)
          },
          colors: ['#77B6EA', '#545454'],
          dataLabels: {
            enabled: true,
          },
          markers: {
            size: 1
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
      }
    )
    const series = computed(() => {
      return [
        {
          name: 'rain',
          data: payload.value.hourly?.map(m => m.temp)
        },
        {
          name: 'feels like',
          data: payload.value.hourly?.map(m => m.feels_like)
        }
      ]
    })


    return {
      loading,
      series,
      chartOptions,
      // icons
      mdiCloudOutline, mdiWeatherWindy, mdiWaterPercent, mdiGauge, mdiWeatherPouring, mdiSnowflake,
    }
  }
}
</script>
