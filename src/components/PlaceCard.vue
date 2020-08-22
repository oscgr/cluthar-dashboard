<template>
  <v-hover #default="{hover}">
    <v-card
      elevation="0"
      width="100%"
      style="cursor: pointer"
      @click="toggleShow"
    >
      <v-expand-transition>
        <span v-show="hover" style="position: absolute" class="display-3">
          <span class="align-self-center">
          Changer
          </span>
        </span>
      </v-expand-transition>
      <v-card-text :class="`hoverable ${hover ? 'on-hover' : ''}`">
        <v-row no-gutters class="display-2 mb-4">
          <v-col cols="9">
            <span v-if="coordinates.lat" v-text="placeName ? placeName : 'Sans nom'" />
            <span v-else v-text="'Choisissez un endroit...'" />
          </v-col>
          <v-col cols="3" class="text-right">
            <v-icon v-if="coordinates.lat" size="50" title="endroit" class="">mdi mdi-map-marker</v-icon>
            <v-icon v-else size="50" title="rechercher" class="">mdi mdi-home-search-outline</v-icon>
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
            <v-icon title="pays" class="info-icon">mdi mdi-earth</v-icon>
            <span v-text="placeCountry" />
            <v-spacer />
            <v-icon title="latitude" class="info-icon">mdi mdi-map-clock</v-icon>
            <span v-text="timezone" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-dialog v-model="show" width="90%">
        <v-card id="map" />
      </v-dialog>
    </v-card>

  </v-hover>
</template>

<style>
#map {
  height: 90vh;
  width: 100%;
  cursor: crosshair;
}

.hoverable {
  transition: opacity .5s;
  transition: filter .5s;
}
.on-hover {
  opacity: 0.6;
  filter: blur(2px);
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
