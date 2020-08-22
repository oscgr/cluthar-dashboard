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
          <v-col cols="12" lg="4" class="d-flex">
            <place-card />
          </v-col>
          <v-col cols="12" lg="4" class="d-flex">
            <weather-card />
          </v-col>
          <v-col cols="12" md="6" lg="4" class="d-flex">
            <sun-card />
          </v-col>
<!--          <v-col cols="12" md="6" lg="4" class="d-flex">-->
<!--            <moon-card :azimuth-infos="azimuthInfos" />-->
<!--          </v-col>-->
        </v-row>
      </v-container>
    </v-main>
    <v-footer app>
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
import WeatherCard from "@/components/WeatherCard";
import SunCard from "@/components/SunCard";
import MoonCard from "@/components/MoonCard";
import coordinatesStore from "@/store/coordinatesStore";

export default {
  name: 'App',

  components: {
    // MoonCard,
    SunCard,
    WeatherCard,
    PlaceCard,
  },

  setup() {
    const {setCoordinates} = coordinatesStore()
    setCoordinates()
  }
}
</script>
