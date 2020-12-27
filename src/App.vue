<template>
  <v-app>
    <app-bar v-show="!fullScreen" />

    <v-main :style="{background: ($vuetify.theme.dark ?'#1b262c' : '#f0ece3')}">
      <v-container>
        <v-row>
          <v-col cols="12">
            <place-card />
          </v-col>
          <v-col cols="12" md="6" lg="4">
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
      <v-hover>
      <template #default="{hover}">
        <v-btn class="ma-2" :style="{right: '24px', bottom: '24px', position: 'fixed', 'z-index': 4}" fab @click="toggleFullScreen">
          <v-icon v-text="hover ? mdiFullscreenExit : mdiFullscreen" />
        </v-btn>
      </template>
    </v-hover>
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
import WeatherCard from "@/components/WeatherCard";
import DayCard from "@/components/DayCard";
import MoonCard from "@/components/MoonCard";
import coordinatesStore from "@/store/coordinatesStore";
import AppBar from "@/AppBar";
import {onMounted} from "@vue/composition-api";
import fullscreenStore from "@/store/fullscreenStore";
import {mdiFullscreen, mdiFullscreenExit} from "@mdi/js";

export default {
  name: 'App',

  components: {
    AppBar,
    MoonCard,
    DayCard,
    WeatherCard,
    PlaceCard,
  },

  setup() {
    const {setCoordinates} = coordinatesStore()
    const {fullScreen, toggleFullScreen} = fullscreenStore()

    onMounted(() => {
      setCoordinates()
    })
    return {
      fullScreen,
      mdiFullscreenExit, mdiFullscreen,
      toggleFullScreen
    }
  }
}
</script>
