<template>
  <v-app>
    <app-bar v-show="!fullScreen" />

    <v-main :style="{background: ($vuetify.theme.dark ?'#1b262c' : '#f0ece3')}">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <place-card />
          </v-col>
          <v-col cols="12" md="6">
            <current-weather-card />
          </v-col>
          <v-col cols="12" md="6">
            <day-card />
          </v-col>
          <v-col cols="12" md="6" >
            <moon-card />
          </v-col>
          <v-col cols="12" md="6" >
            <precipitation-card />
          </v-col>

        </v-row>
      </v-container>
      <btn-hover />
    </v-main>
    <v-footer app v-show="!fullScreen">
      <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    </v-footer>
  </v-app>
</template>

<style>
.info-icon {
  margin-top: -4px;
  margin-right: 8px;
}
</style>

<script>
import PlaceCard from '@/components/PlaceCard.vue';
import AppBar from "@/components/AppBar";
import BtnHover from "@/components/BtnHover";
import fullscreenStore from "@/store/fullscreenStore";
import weatherStore from "@/store/weatherStore";
import {onMounted} from "@vue/composition-api";
import MoonCard from "@/components/MoonCard";
import DayCard from "@/components/DayCard";
import astroStore from "@/store/astroStore";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import PrecipitationCard from "@/components/PrecipitationCard";

export default {
  name: 'App',

  components: {
    BtnHover,
    AppBar,
    MoonCard,
    DayCard,
    CurrentWeatherCard,
    PrecipitationCard,
    PlaceCard,
  },
  setup() {
    const {fullScreen} = fullscreenStore()
    const {fetchWeather} = weatherStore()
    const {fetchAstro} = astroStore()

    onMounted(() => {
      fetchAstro()
      fetchWeather()
    })


    return {
      fullScreen
    }
  }
}
</script>
