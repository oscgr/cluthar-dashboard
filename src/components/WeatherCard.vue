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
            <img height="72px" alt="météo" :src="weatherIcon" />
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
        <v-row no-gutters v-if="hasType('rain')" class="text-h6">
          <v-col cols="6" class="pt-0">
            <v-icon class="info-icon" v-text="mdiWeatherPouring" />
            <span v-text="cumulation('rain', '1h')" />
          </v-col>
          <v-col cols="6" class="pt-0 text-right">
            <v-icon class="info-icon" v-text="mdiWeatherPouring" />
            <span v-text="cumulation('rain', '3h')" />
          </v-col>
        </v-row>
        <v-row no-gutters v-if="hasType('snow')" class="text-h6">
          <v-col cols="6" class="pt-0">
            <v-icon class="info-icon" v-text="mdiSnowflake" />
            <span v-text="cumulation('snow', '1h')" />
          </v-col>
          <v-col no-gutters cols="6" class="pt-0 text-right">
            <v-icon class="info-icon" v-text="mdiSnowflake" />
            <span v-text="cumulation('snow', '3h')" />
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
  name: 'WeatherCard',

  setup() {

    const vm = getCurrentInstance().proxy

    const {loading, isCloudy, temperature, feelsLike, weatherDescription, weatherIcon, clouds, cumulation, hasType, humidity, pressure, wind} = weatherStore()

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
      weatherIcon,
      clouds,
      cumulation,
      hasType,
      humidity,
      pressure,
      wind,
      isCloudy,
      // icons
      mdiCloudOutline, mdiWeatherWindy, mdiWaterPercent, mdiGauge, mdiWeatherPouring, mdiSnowflake,
    }
  }
}
</script>
