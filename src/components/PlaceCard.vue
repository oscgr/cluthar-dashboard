<template>
      <v-card
        elevation="0"
        width="100%"
        height="100%"
      >
      <v-card-text>
        <v-row no-gutters class="display-3 mb-2">
          <v-col cols="12">
            <span v-text="place.display" />
          </v-col>
        </v-row>
        <v-row no-gutters class="display-1">
          <v-col cols="12">
            <span class="hidden-md-and-down" v-text="dateString" />
            <span class="hidden-lg-and-up" v-text="dateStringShort" />
          </v-col>
        </v-row>
        <v-row no-gutters class="text-h6 mt-4">
          <v-col cols="6">
            <v-icon title="latitude" class="info-icon" v-text="mdiLatitude" />
            <span v-text="`${place.latitude ? Math.floor(place.latitude * 100) / 100 : '?'}`" />
            <v-spacer />
            <v-icon title="longitude" class="info-icon" v-text="mdiLongitude" />
            <span v-text="`${place.longitude ? Math.floor(place.longitude * 100) / 100 : '?'}`" />
          </v-col>
          <v-col cols="6" class="text-right display-1">
            <span v-text="timeString" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

</template>
<script>

import {computed} from "@vue/composition-api";
import placeStore from "@/store/placeStore";
import {mdiLatitude, mdiLongitude, mdiEarth, mdiMapClock, mdiCrosshairs, mdiCrosshairsGps} from '@mdi/js'
import timeStore from "@/store/timeStore";

export default {
  name: 'placeCard',
  setup() {
    const {place} = placeStore()
    const {now} = timeStore()

    const dateString = computed(() => now.value.format('dddd LL'))
    const dateStringShort = computed(() => now.value.format('ddd ll'))
    const timeString = computed(() => now.value.format('LTS'))

    return {
      dateString,
      dateStringShort,
      timeString,
      place,
      // icons
      mdiLatitude, mdiLongitude, mdiEarth, mdiMapClock, mdiCrosshairs, mdiCrosshairsGps
    }
  }
}
</script>
