<template>
  <v-app-bar app>

      <span class="title">
        AZIMUTH SHUTTER
      </span>

    <v-spacer></v-spacer>

    <v-hover>
      <template #default="{hover}">
        <v-btn @click="toggleShow" depressed icon>
          <v-icon v-text="hover ? mdiHomeSearch : mdiHomeSearchOutline" />
        </v-btn>
      </template>
    </v-hover>

    <v-hover>
      <template #default="{hover}">
        <v-btn :loading="geolocationLoading" icon @click="setGeolocationCoordinates">
          <v-icon v-text="hover ? mdiCrosshairsGps : mdiCrosshairs" />
        </v-btn>
      </template>
    </v-hover>
    <v-hover>
      <template #default="{hover}">

        <v-btn class="mr-2" icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
          <v-icon v-text="($vuetify.theme.dark && !hover || !$vuetify.theme.dark && hover) ? mdiBrightness4 : mdiBrightness6" />
        </v-btn>
      </template>
    </v-hover>

    <v-dialog v-model="show" width="90%">
      <v-card id="map" />
    </v-dialog>
  </v-app-bar>
</template>
<script>

import {
  mdiBrightness4,
  mdiBrightness6,
  mdiCrosshairs,
  mdiCrosshairsGps,
  mdiHomeSearch,
  mdiHomeSearchOutline,
} from '@mdi/js'
import coordinatesStore from "@/store/coordinatesStore";
import { reactive, toRefs} from "@vue/composition-api";

export default {
  name: 'AppBar',
  setup() {
    const {geolocationLoading, coordinates, setCoordinates, setGeolocationCoordinates} = coordinatesStore()


    const state = reactive({
      show: false,
      map: null,
      marker: null,
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
      ...toRefs(state),
      toggleShow,
      geolocationLoading,
      setGeolocationCoordinates,
      mdiBrightness4,
      mdiBrightness6,
      mdiCrosshairsGps,
      mdiCrosshairs,
      mdiHomeSearch,
      mdiHomeSearchOutline,
    }
  }
}
</script>

<style>
#map {
  height: 90vh;
  width: 100%;
  cursor: crosshair;
}

</style>
