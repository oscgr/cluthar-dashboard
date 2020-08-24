<template>
  <v-app>
    <v-app-bar app>

      <span class="title">
        AZIMUTH SHUTTER
      </span>

      <v-spacer></v-spacer>

      <v-btn class="mr-2" icon small @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon v-text="$vuetify.theme.dark ? mdiBrightness4 : mdiBrightness6" />
      </v-btn>
    </v-app-bar>

    <v-main :style="{background: ($vuetify.theme.dark ?'#1b262c' : '#f0ece3')}">
      <v-container>
        <v-row>
          <v-col cols="12" lg="4">
            <place-card />
          </v-col>
          <v-col cols="12" lg="4">
            <weather-card />
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <day-card />
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <moon-card />
          </v-col>
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
import DayCard from "@/components/DayCard";
import MoonCard from "@/components/MoonCard";
import coordinatesStore from "@/store/coordinatesStore";
import { mdiBrightness4, mdiBrightness6 } from '@mdi/js';

export default {
  name: 'App',

  components: {
    MoonCard,
    DayCard,
    WeatherCard,
    PlaceCard,
  },

  setup() {
    const {setCoordinates} = coordinatesStore()
    setCoordinates()
    return {
      mdiBrightness4,
      mdiBrightness6
    }
  }
}
</script>
