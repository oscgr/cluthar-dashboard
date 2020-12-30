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
      :color="cardColor"
    >
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="6">
            <div title="température" class="display-3" v-text="temperature" />
            <div title="ressenti" class="" v-if="temperature !== feelsLike" v-text="`Ressenti ${feelsLike}`" />
          </v-col>
          <v-col cols="6" class="text-right">
            <img height="72px" alt="météo" :src="currentWeatherIcon" />
          </v-col>
        </v-row>
        <v-row no-gutters >
          <v-col cols="12">
            <span title="météo actuelle" class="text-h5" v-text="weatherDescription" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col cols="6">
            <v-icon title="couverture nuageuse" class="info-icon" v-text="mdiCloudOutline" />
            <span v-text="clouds" />
            <v-spacer />
            <v-icon title="vitesse du vent" class="info-icon" v-text="mdiWeatherWindy" />
            <span v-text="wind" />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-icon title="humidité" class="info-icon" v-text="mdiWaterPercent" />
            <span title="humidité" v-text="humidity" />
            <v-spacer />
            <v-icon title="pression" class="info-icon" v-text="mdiGauge" />
            <span title="pression" v-text="pressure" />
          </v-col>
        </v-row>
        <v-row no-gutters class="text-h6">
          <v-col cols="6" class="pt-0">
            <v-icon class="info-icon" v-text="mdiWeatherPouring" />
            <span v-text="rain" />
          </v-col>
          <v-col no-gutters cols="6" class="pt-0 text-right">
            <v-icon class="info-icon" v-text="mdiSnowflake" />
            <span v-text="snow" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-skeleton-loader>
</template>
<script>

import weatherStore from "@/store/weatherStore";
import {mdiCloudOutline, mdiWeatherWindy, mdiWaterPercent, mdiGauge, mdiWeatherPouring, mdiSnowflake} from '@mdi/js'
import {getCurrentInstance, computed} from "@vue/composition-api";

export default {
  name: 'CurrentWeatherCard',

  setup() {

    const vm = getCurrentInstance().proxy

    const {loading, weatherIcon, payload} = weatherStore()

    const temperature = computed(() => `${payload.value.current.temp}°C`)
    const feelsLike = computed(() => `${payload.value.current.feels_like}°C`)
    const clouds = computed(() => `${payload.value.current.clouds}%`)
    const pressure = computed(() => `${payload.value.current.pressure} hPa`)
    const humidity = computed(() => `${payload.value.current.humidity}%`)
    const isCloudy = computed(() => payload.value.current > 50)
    const wind = computed(() => `${payload.value.current.wind_speed} km/h`)
    const currentWeatherIcon = computed(() => weatherIcon(payload.value.current.weather[0].id, payload.value.current.clouds))
    const weatherDescription = computed(() => payload.value.current.weather[0].description)
    const rain = computed(() =>  `${payload.value.current.rain && payload.value.current.rain['1h'] || '0'} mm`)
    const snow = computed(() =>  `${payload.value.current.snow && payload.value.current.snow['1h'] || '0'} mm`)

    const cardColor = computed(() => {
      if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
      else if (vm.$vuetify.theme.dark) return '#29586d'
      else if (!isCloudy.value) return '#a6dcef'
      else return '#d8e9ef'
    })

    return {
      cardColor,
      loading,
      temperature,
      feelsLike,
      weatherDescription,
      currentWeatherIcon,
      clouds,
      humidity,
      pressure,
      isCloudy,
      wind,
      rain,
      snow,
      // icons
      mdiCloudOutline, mdiWeatherWindy, mdiWaterPercent, mdiGauge, mdiWeatherPouring, mdiSnowflake,
    }
  }
}
</script>
