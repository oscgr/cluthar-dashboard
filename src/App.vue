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
            <place-search
              :coordiates="coordinates"
              @set-coordinates="setCoordinates"
            />
          </v-col>
        </v-row>
        <v-row>
          {{place}}
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import PlaceSearch from '@/components/PlaceSearch.vue';

const API_KEY = 'f2b5fcdad58f47ebb86d4d4c93178d14'

export default {
  name: 'App',

  components: {
    PlaceSearch,
  },

  data: () => ({
    coordinates: {},
    place: {}
  }),
  methods: {
    setCoordinates(latLng) {
      this.coordinates = latLng
      localStorage.setItem('coordinates', latLng)
      fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${API_KEY}&lat=${latLng.lat}&long=${latLng.lng}`)
        .then(r => r.json())
        .then(r => this.place = r)
    }
  },
  mounted() {
    this.coordinates = localStorage.getItem('coordinates') || {}
  }
};
</script>
