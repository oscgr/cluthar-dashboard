<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :loading="loading"
      width="100%"
      height="100%"
      flat
      min-height="150px"
      :color="cardColor"
      :title="(error || loading) ? t('constants.LAYOUT_CARD.WEATHER_ALERTS') : null"
    >
      <v-card-subtitle v-if="error" v-text="error" />
      <template v-else-if="!loading">
        <v-card-text>
          <v-row no-gutters>
            <v-col>
              <div title="température" class="text-h3 font-weight-thin" v-text="temperature" />
              <span v-if="temperature !== feelsLike" title="ressenti" class="" v-text="`Ressenti ${feelsLike}`" />
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1 d-flex text-right align-center pr-8">
              <div v-if="isHovering" class="text-no-wrap text-h4 font-weight-thin pr-4 text-right" v-text="capitalize(weatherDescription)" />
              <v-icon v-for="weather in (payload.current?.weather || [])" :key="weather.id" :icon="weatherIcon(weather.id)" size="64" />
            </v-col>
          </v-row>

          <v-row no-gutters class="text-h6">
            <v-col class="flex-grow-0">
              <v-icon title="Couverture nuageuse" size="24" style="width: 36px" icon="wi:wi-cloud" />
            </v-col>
            <v-col>
              <span style="line-height: 35px" v-text="isHovering ? 'Couv. nuageuse' : clouds" />
            </v-col>
            <v-col class="text-right">
              <span style="line-height: 35px" v-text="isHovering ? 'Humidité' : humidity" />
            </v-col>
            <v-col class="flex-grow-0 text-right">
              <v-icon title="Humidité" size="24" style="width: 36px" icon="wi:wi-humidity" />
            </v-col>
          </v-row>

          <v-row no-gutters class="text-h6">
            <v-col class="flex-grow-0">
              <v-icon title="Vitesse du vent" size="19" style="width: 36px" icon="wi:wi-strong-wind" />
            </v-col>
            <v-col>
              <span style="line-height: 35px" v-text="isHovering ? 'Vent' : wind" />
            </v-col>
            <v-col class="text-right">
              <span style="line-height: 35px" v-text="isHovering ? 'Pression' : pressure" />
            </v-col>
            <v-col class="flex-grow-0 text-right">
              <v-icon title="Pression" size="24" style="width: 36px" icon="wi:wi-barometer" />
            </v-col>
          </v-row>

          <v-row no-gutters class="text-h6">
            <v-col class="flex-grow-0">
              <v-icon title="Précipitations (1h)" size="32" style="width: 36px" icon="wi:wi-raindrops" />
            </v-col>
            <v-col>
              <span style="line-height: 35px" v-text="isHovering ? 'Pluie (1h)' : rain" />
            </v-col>
            <v-col class="text-right">
              <span style="line-height: 35px" v-text="isHovering ? 'Neige (1h)' : snow" />
            </v-col>
            <v-col class="flex-grow-0 text-right">
              <v-icon title="Neige (1h)" size="24" style="width: 36px" icon="mdi-snowflake" />
            </v-col>
          </v-row>
        </v-card-text>
      </template>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import { capitalize } from 'lodash'
import { useI18n } from 'vue-i18n'
import useWeather from '@/store/weather'

const dark = useDark()

const { t } = useI18n()
const { loading, weatherIcon, payload, error } = useWeather()

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
  return `${Math.floor((payload.value.current?.wind_speed || 0) * 3.6)} km/h`
})

const weatherDescription = computed(() => (payload.value.current?.weather?.map(({ description }) => description) || []).join(', '))
const rain = computed(() => `${payload.value.current?.rain?.['1h'] || '0'} mm`)
const snow = computed(() => `${payload.value.current?.snow?.['1h'] || '0'} mm`)

const cardColor = computed(() => {
  if (isCloudy.value && dark.value)
    return '#2e373b'
  else if (dark.value)
    return '#193642'
  else if (!isCloudy.value)
    return '#a6dcef'
  else return '#d8e9ef'
})
</script>
