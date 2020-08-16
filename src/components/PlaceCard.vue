<template>
  <v-card elevation="0" width="100%">
    <v-card-text>
      <v-row no-gutters class="text-h4 mb-4">
        <v-col cols="12" class="text-center" v-if="!placeName">
          <v-icon size="40" title="rechecher" class="info-icon">mdi mdi-home-search-outline</v-icon>
          <span v-text="placeName ? placeName : 'Choisissez un endroit...'" />
        </v-col>
        <v-col cols="9" v-if="placeName">
          <v-icon size="40" title="endroit" class="info-icon">mdi mdi-home</v-icon>
          <span v-text="placeName" />
        </v-col>
        <v-col cols="3" v-if="placeName" class="text-right">
          <span v-text="placeCountry" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="latitude" class="info-icon">mdi mdi-latitude</v-icon>
          <span v-text="`${coordinates.lat ? Math.floor(coordinates.lat * 100) / 100 : '?'}`" />
          <v-spacer />
          <v-icon title="longitude" class="info-icon">mdi mdi-longitude</v-icon>
          <span v-text="`${coordinates.lng ? Math.floor(coordinates.lng * 100) / 100 : '?'}`" />
        </v-col>
        <v-col cols="6" class="text-right">
          <v-icon title="latitude" class="info-icon">mdi mdi-map-clock</v-icon>
          <span v-text="timezone" />
<!--          <v-spacer />-->
<!--          <v-icon title="longitude" class="info-icon">mdi mdi-longitude</v-icon>-->
<!--          <span v-text="`${coordinates.lng ? Math.floor(coordinates.lng * 100) / 100 : '?'}`" />-->
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        @click="toggleShow"
        class="text-uppercase"
        v-text="placeName ? `Changer d'endroit...` : 'Sélectionner un endroit...'"
      />
    </v-card-actions>
    <v-dialog v-model="show" width="90%">
      <v-card id="map" />
    </v-dialog>
  </v-card>
</template>

<style>
#map {
  height: 90vh;
  width: 100%;
  cursor: crosshair;
}

</style>
<script>

import {reactive, toRefs} from "@vue/composition-api";
import coordinatesStore from "@/store/coordinatesStore";
import weatherStore from "@/store/weatherStore";

export default {
  name: 'placeSearch',
  setup() {
    const {coordinates, setCoordinates} = coordinatesStore()
    const {placeName, placeCountry, timezone} = weatherStore()

    const state = reactive({
      show: false,
      map: null,
      marker: null
    })
    const setMarker = () => {
      if (!state.marker) {
        state.marker = L.marker(coordinates.value).addTo(state.map)
      } else {
        state.marker.setLatLng(coordinates.value)
      }
      state.map.setView(coordinates.value)
    }

    const onClick = (e) => {
      setCoordinates({
        lat: e.latlng.lat,
        lng: e.latlng.lng > 0 ? ((e.latlng.lng + 180) % 360) - 180 : ((e.latlng.lng - 180) % 360) + 180
      })
      setMarker()
      toggleShow()
    }

    const initMap = () => {
      setTimeout(() => {
        state.map = L.map('map').setView([47, 0], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Data by OpenStreetMap, under ODbL',
          detectRetina: true,
        }).addTo(state.map);

        state.map.on('click', onClick)

        if (coordinates.value && coordinates.value.lat && coordinates.value.lng) setMarker()

      }, 300)
    }

    const toggleShow = () => {
      state.show = !state.show

      if (state.show) {
        initMap()
      } else {
        state.map.remove()
        state.map = null
        state.marker = null
      }
    }

    return {
      coordinates,
      placeName,
      placeCountry,
      timezone,
      toggleShow,
      ...toRefs(state)
    }
  }
}
</script>
