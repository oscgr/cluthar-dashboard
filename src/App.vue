<template>
  <v-app>
    <v-app-bar app>

      <span class="title">
        AZIMUTH SHUTTER
      </span>

      <v-spacer></v-spacer>

      <v-btn class="mr-2" icon small @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon v-text="`mdi mdi-${$vuetify.theme.dark ? 'brightness-4' : 'brightness-6'}`"></v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">

            <place-search v-model="coordinates" />
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-row>
                <v-col md="10">
                  <span class="text-h4" v-text="`${weatherInfos && weatherInfos.name ? weatherInfos.name : 'No city found'}${weatherInfos && weatherInfos.sys.country ? ` - ${weatherInfos.sys.country}` : ''}`" />
                </v-col>
                <v-col md="2">
                  <v-img class="ma-n4" max-width="10vh" v-if="weatherIcon" :src="`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`" />
                  {{currentTemperatureString}}
                </v-col>
              </v-row>

            </v-card>
          </v-col>
        </v-row>

        <v-row>
          {{ azimuthInfos }}
        </v-row>
        <v-row>
          {{ weatherInfos }}
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import PlaceSearch from '@/components/PlaceSearch.vue';

const TempUnit = {
  C:'C',
  K: 'K',
  F: 'F'

}

export default {
  name: 'App',

  components: {
    PlaceSearch,
  },

  data: () => ({
    coordinates: {},
    azimuthInfos: null,
    weatherInfos: null,
    units: {
      temperature: TempUnit.C
    }

  }),
  computed: {
    weatherIcon() {
      return this.weatherInfos?.weather[0]?.icon
    },
    currentTemperatureString() {
      return this[this.units.temperature](this.weatherInfos?.main.temp)
    }
  },
  methods: {
    getAzimuthInfos() {
      fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${process.env.VUE_APP_IP_GEOLOCATION_API_KEY}&lat=${this.coordinates.lat}&long=${this.coordinates.lng}`)
        .then(r => r.json())
        .then(r => this.azimuthInfos = r)
    },
    getWeatherInfos() {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.coordinates.lat}&lon=${this.coordinates.lng}&appid=${process.env.VUE_APP_OPEN_WEATHER_API_KEY}`)
        .then(r => r.json())
        .then(r => this.weatherInfos = r)
    },
    K(t) {
      return `${Math.round(t)}°K`
    },
    C(t) {
      return `${Math.round(t - 273.15)}°C`
    },
    F(t) {
      return `${(Math.round(t - 273.15) * 1.8 + 32)}°F`
    },
  },
  watch: {
    coordinates(val) {
      this.coordinates = val
      localStorage.setItem('coordinates', JSON.stringify(val))
      this.getAzimuthInfos()
      this.getWeatherInfos()
    }
  },
  mounted() {
    this.coordinates = JSON.parse(localStorage.getItem('coordinates')) || {}
  }
}
</script>
