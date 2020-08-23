<template>
  <v-skeleton-loader
    style="width: 100%"
    width="100%"
    type="image"
    :loading="loading"
  >
    <v-card
      width="100%"
      height="100%"
      flat
      :color="$vuetify.theme.dark ? '#2d726d' : '#a6dcef'"
    >
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="6" class="pb-0">
            <span title="température" class="display-3" v-text="temperature" />
            <v-spacer />
            <span title="ressenti" class="" v-if="temperature !== feelsLike" v-text="`Ressenti ${feelsLike}`" />
          </v-col>
          <v-col cols="6" class="pb-0 text-right">

          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <span title="météo actuelle" class="text-h5" v-text="weatherDescription" />
          </v-col>
        </v-row>
        <v-row class="text-h6">
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
        <v-row v-if="hasType('rain')" class="text-h6">
          <v-col cols="6" class="pt-0">
            <v-icon class="info-icon" v-text="mdiWeatherPouring" />
            <span v-text="cumulation('rain', '1h')" />
          </v-col>
          <v-col cols="6" class="pt-0 text-right">
            <v-icon class="info-icon" v-text="mdiWeatherPouring" />
            <span v-text="cumulation('rain', '3h')" />
          </v-col>
        </v-row>
        <v-row v-if="hasType('snow')" class="text-h6">
          <v-col cols="6" class="pt-0">
            <v-icon class="info-icon" v-text="mdiSnowflake" />
            <span v-text="cumulation('snow', '1h')" />
          </v-col>
          <v-col cols="6" class="pt-0 text-right">
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

export default {
  name: 'WeatherCard',

  setup() {
    const {loading, temperature, feelsLike, weatherDescription, weatherIcon, clouds, cumulation, hasType, humidity, pressure, wind} = weatherStore()

    return {
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
      // icons
      mdiCloudOutline, mdiWeatherWindy, mdiWaterPercent, mdiGauge, mdiWeatherPouring, mdiSnowflake,
    }
  }
}
</script>
