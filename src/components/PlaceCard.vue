<template>
      <v-card
        elevation="0"
        width="100%"
        height="100%"
      >
      <v-card-text>
        <v-row no-gutters class="display-3 mb-2">
          <v-col cols="12">
            <span v-if="coordinates.lat" v-text="placeName ? placeName : 'Sans nom'" />
            <span v-else v-text="'Choisissez un endroit...'" />
          </v-col>
        </v-row>
        <v-row no-gutters class="display-1">
          <v-col cols="6" class="">
            <span class="hidden-md-and-down" v-text="dateString" />
            <span class="hidden-lg-and-up" v-text="dateStringShort" />
          </v-col>
          <v-col cols="6" class="text-right">
            <span v-text="timeString" />
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
    </v-card>

</template>
<script>

import {computed} from "@vue/composition-api";
import coordinatesStore from "@/store/coordinatesStore";
import weatherStore from "@/store/weatherStore";

import {mdiLatitude, mdiLongitude, mdiEarth, mdiMapClock, mdiCrosshairs, mdiCrosshairsGps} from '@mdi/js'
import timeStore from "@/store/timeStore";

export default {
  name: 'placeSearch',
  setup() {
    const {geolocationLoading, coordinates, setGeolocationCoordinates} = coordinatesStore()
    const {placeName, placeCountry, timezone} = weatherStore()
    const {now} = timeStore()


    const dateString = computed(() => now.value.format('dddd LL'))
    const dateStringShort = computed(() => now.value.format('ddd ll'))
    const timeString = computed(() => now.value.format('LTS'))

    return {
      geolocationLoading,
      setGeolocationCoordinates,
      dateString,
      dateStringShort,
      timeString,
      coordinates,
      placeName,
      placeCountry,
      timezone,
      // icons
      mdiLatitude, mdiLongitude, mdiEarth, mdiMapClock, mdiCrosshairs, mdiCrosshairsGps
    }
  }
}
</script>
