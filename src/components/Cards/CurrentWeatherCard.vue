<template>
  <v-card
    :loading="loading"
    width="100%"
    height="100%"
    flat
    :color="cardColor"
  >
    <v-card-subtitle v-if="Object.keys(payload).length === 0" class="pa-4">
      Veuillez renseigner votre token
    </v-card-subtitle>

    <v-card-text v-else>
      <v-row no-gutters>
        <v-col>
          <div title="température" class="text-h2" v-text="temperature" />
          <span v-if="temperature !== feelsLike" title="ressenti" class="" v-text="`Ressenti ${feelsLike}`" />
        </v-col>
        <v-col class="flex-grow-0">
          <v-img width="72px" alt="météo" :src="currentWeatherIcon" />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" class="text-right">
          <span title="météo actuelle" class="text-h5" v-text="weatherDescription" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="couverture nuageuse" class="info-icon" :icon="mdiCloudOutline" />
          <span v-text="clouds" />
          <v-spacer />
          <v-icon title="vitesse du vent" class="info-icon" :icon="mdiWeatherWindy" />
          <span v-text="wind" />
        </v-col>
        <v-col cols="6" class="text-right">
          <v-icon title="humidité" class="info-icon" :icon="mdiWaterPercent" />
          <span title="humidité" v-text="humidity" />
          <v-spacer />
          <v-icon title="pression" class="info-icon" :icon="mdiGauge" />
          <span title="pression" v-text="pressure" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="6" class="pt-0">
          <v-icon class="info-icon" :icon="mdiWeatherPouring" />
          <span v-text="rain" />
        </v-col>
        <v-col no-gutters cols="6" class="pt-0 text-right">
          <v-icon class="info-icon" :icon="mdiSnowflake" />
          <span v-text="snow" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { mdiCloudOutline, mdiGauge, mdiSnowflake, mdiWaterPercent, mdiWeatherPouring, mdiWeatherWindy } from '@mdi/js'
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import useWeather from '@/store/weather'

const dark = useDark()

const { loading, weatherIcon, payload } = useWeather()

const temperature = computed(() => {
  if (typeof payload.value.current?.temp !== 'number')
    return '?'
  return `${Math.floor(payload.value.current.temp)}°C`
})
const feelsLike = computed(() => {
  if (typeof payload.value.current?.feels_like !== 'number')
    return '?'
  return `${Math.floor(payload.value.current.feels_like)}°C`
})
const clouds = computed(() => {
  if (typeof payload.value.current?.clouds !== 'number')
    return '?'
  return `${Math.floor(payload.value.current.clouds)}%`
})

const pressure = computed(() => {
  if (typeof payload.value.current?.pressure !== 'number')
    return '?'
  return `${Math.floor(payload.value.current.pressure)} hPa`
})
const humidity = computed(() => {
  if (typeof payload.value.current?.humidity !== 'number')
    return '?'
  return `${Math.floor(payload.value.current.humidity)}%`
})

const isCloudy = computed(() => (payload.value.current?.clouds || 0) > 50)

const wind = computed(() => {
  if (typeof payload.value.current?.wind_speed !== 'number')
    return '?'
  return `${Math.floor(payload.value.current?.wind_speed)} km/h`
})

const currentWeatherIcon = computed(() => weatherIcon(payload.value.current?.weather[0].id, payload.value.current?.clouds))
const weatherDescription = computed(() => payload.value.current?.weather[0].description)
const rain = computed(() => `${payload.value.current?.rain?.['1h'] || '0'} mm`)
const snow = computed(() => `${payload.value.current?.snow?.['1h'] || '0'} mm`)

const cardColor = computed(() => {
  if (isCloudy.value && dark.value)
    return '#516269'
  else if (dark.value)
    return '#29586d'
  else if (!isCloudy.value)
    return '#a6dcef'
  else return '#d8e9ef'
})
</script>
