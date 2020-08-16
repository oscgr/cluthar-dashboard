<template>
  <v-card width="100%" flat :color="$vuetify.theme.dark ? '#2d726d' : '#a6dcef'">
    <v-card-text class="py-0">
      <v-row>
        <v-col cols="8">
          <span title="température" class="text-h4" v-text="temperature" />
          <v-spacer />
          <span title="ressenti" class="subtitle-2 font-weight-thin" v-if="temperature !== feelsLike" v-text="`Ressenti ${feelsLike}`" />
          <v-spacer />
          <span title="météo actuelle" class="text-h5" v-text="weatherDescription" />
          <v-spacer />
        </v-col>
        <v-col cols="4" class="pr-0">
          <v-img :title="weatherDescription" max-width="120px" class="my-n3 mr-n3" v-if="weatherIcon" :src="`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`" />
        </v-col>
        <v-col cols="6" class="pt-0 text-h6">
          <v-icon title="couverture nuageuse" class="info-icon">mdi mdi-cloud-outline</v-icon>
          <span v-text="clouds" />
          <v-spacer />
          <v-icon title="vitesse du vent" class="info-icon">mdi mdi-weather-windy</v-icon>
          <span v-text="wind" />
        </v-col>
        <v-col cols="6" class="pt-0 text-right text-h6">
          <v-icon title="humidité" class="info-icon">mdi mdi-water-percent</v-icon>
          <span title="humidité" v-text="humidity" />
          <v-spacer />
          <v-icon title="pression" class="info-icon">mdi mdi-gauge</v-icon>
          <span title="pression" v-text="pressure" />
        </v-col>
      </v-row>
      <v-row v-if="hasType('rain')">
        <v-col cols="6" class="pt-0 text-h6">
          <v-icon class="info-icon">mdi mdi-weather-pouring</v-icon>
          <span v-text="cumulation('rain', '1h')" />
        </v-col>
        <v-col cols="6" class="pt-0 text-right text-h6">
          <v-icon class="info-icon">mdi mdi-weather-pouring</v-icon>
          <span v-text="cumulation('rain', '3h')" />
        </v-col>
      </v-row>
      <v-row v-if="hasType('rain')">
        <v-col cols="6" class="pt-0 text-h6">
          <v-icon class="info-icon">mdi mdi-snowflake</v-icon>
          <span v-text="cumulation('snow', '1h')" />
        </v-col>
        <v-col cols="6" class="pt-0 text-right text-h6">
          <v-icon class="info-icon">mdi mdi-snowflake</v-icon>
          <span v-text="cumulation('snow', '3h')" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>

import weatherStore from "@/store/weatherStore";

export default {
  name: 'WeatherCard',

  setup() {
    const {temperature, feelsLike, weatherDescription, weatherIcon, clouds, cumulation, hasType, humidity, pressure, wind} = weatherStore()

    return {temperature, feelsLike, weatherDescription, weatherIcon, clouds, cumulation, hasType, humidity, pressure, wind}
  }
}
</script>
