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

    <v-main :style="{background: ($vuetify.theme.dark ?'#1b262c' : '#f0ece3')}">
      <v-container>
        <v-row>
          <v-col cols="12">
            <place-search v-model="coordinates" :place-name="weatherInfos && weatherInfos.name" />
          </v-col>
          <v-col cols="12" lg="4" class="d-flex">
            <weather-card :weather-infos="weatherInfos" />
          </v-col>
          <v-col cols="12" md="6" lg="4" class="d-flex">
            <sun-card :azimuth-infos="azimuthInfos" />
          </v-col>
          <v-col cols="12" md="6" lg="4" class="d-flex">
            <moon-card :azimuth-infos="azimuthInfos" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.info-icon {
  margin-top: -4px;
  margin-right: 4px;
}
</style>

<script>
import PlaceSearch from '@/components/PlaceSearch.vue';
import WeatherCard from "@/components/WeatherCard";
import SunCard from "@/components/SunCard";
import MoonCard from "@/components/MoonCard";

export default {
  name: 'App',

  components: {
    MoonCard,
    SunCard,
    WeatherCard,
    PlaceSearch,
  },

  data: () => ({
    coordinates: {},
    azimuthInfos: null,
    weatherInfos: null,

  }),
  methods: {
    getAzimuthInfos() {
      fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${process.env.VUE_APP_IP_GEOLOCATION_API_KEY}&lat=${this.coordinates.lat}&long=${this.coordinates.lng}`)
        .then(r => r.json())
        .then(r => this.azimuthInfos = r)
    },
    getWeatherInfos() {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lang=fr&lat=${this.coordinates.lat}&lon=${this.coordinates.lng}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_API_KEY}`)
        .then(r => r.json())
        .then(r => this.weatherInfos = r)
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
