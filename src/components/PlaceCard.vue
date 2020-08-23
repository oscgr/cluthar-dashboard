<template>
    <v-card
      elevation="0"
      width="100%"
      @click="toggleShow"
    >
      <v-card-text>
        <v-row no-gutters class="display-2 mb-4">
          <v-col cols="9">
            <v-progress-circular size="32" indeterminate v-if="loading" />
            <span v-else-if="coordinates.lat" v-text="placeName ? placeName : 'Sans nom'" />
            <span v-else v-text="'Choisissez un endroit...'" />
          </v-col>
          <v-col cols="3" class="text-right">
            <v-icon v-if="coordinates.lat" size="50" title="endroit" v-text="mdiMapMarker" />
            <v-icon v-else size="50" title="rechercher" v-text="mdiHomeSearchOutline" />
          </v-col>
        </v-row>
        <v-row no-gutters class="text-h6">
          <v-col cols="6">
            <v-icon title="latitude" class="info-icon" v-text="mdiLatitude" />
            <span v-text="`${coordinates.lat ? Math.floor(coordinates.lat * 100) / 100 : '?'}`" />
            <v-spacer />
            <v-icon title="longitude" class="info-icon" v-text="mdiLongitude" />
            <span v-text="`${coordinates.lng ? Math.floor(coordinates.lng * 100) / 100 : '?'}`" />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-icon title="pays" class="info-icon" v-text="mdiEarth" />
            <span v-text="placeCountry" />
            <v-spacer />
            <v-icon title="latitude" class="info-icon" v-text="mdiMapClock" />
            <span v-text="timezone" />
          </v-col>
        </v-row>
      </v-card-text>

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

import {mdiMapMarker, mdiHomeSearchOutline, mdiLatitude, mdiLongitude, mdiEarth, mdiMapClock} from '@mdi/js'

export default {
  name: 'placeSearch',
  setup() {
    const {coordinates, setCoordinates} = coordinatesStore()
    const {loading, placeName, placeCountry, timezone} = weatherStore()

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
      loading,
      coordinates,
      placeName,
      placeCountry,
      timezone,
      toggleShow,
      ...toRefs(state),
      // icons
      mdiMapMarker, mdiHomeSearchOutline, mdiLatitude, mdiLongitude, mdiEarth, mdiMapClock
    }
  }
}
</script>
