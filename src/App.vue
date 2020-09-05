<template>
  <v-app>
    <app-bar />

    <v-main :style="{background: ($vuetify.theme.dark ?'#1b262c' : '#f0ece3')}">
      <v-container>
        <v-row>
          <v-col cols="12">
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
          <v-col cols="12">
            <v-divider/>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <add-window-card />
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
import AddWindowCard from "@/components/AddWindowCard";
import AppBar from "@/AppBar";
import {onMounted} from "@vue/composition-api";

export default {
  name: 'App',

  components: {
    AppBar,
    MoonCard,
    DayCard,
    WeatherCard,
    PlaceCard,
    AddWindowCard,
  },

  setup() {
    const {setCoordinates} = coordinatesStore()

    onMounted(() => { setCoordinates() })
  }
}
</script>
