<template>
  <v-app-bar app>

      <span class="title">
        AZIMUTH SHUTTER
      </span>

    <v-spacer></v-spacer>

    <v-hover>
      <template #default="{hover}">
        <v-btn @click="searchPlace" depressed icon>
          <v-icon v-text="hover ? mdiHomeSearch : mdiHomeSearchOutline" />
        </v-btn>
      </template>
    </v-hover>
    <place-search-autocomplete ref="placeSearchAutocomplete" />

    <v-hover>
      <template #default="{hover}">
        <v-btn :loading="loading" icon @click="setCoordinatesAsCurrentPosition">
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
import placeStore from "@/store/placeStore";
import { ref} from "@vue/composition-api";
import PlaceSearchAutocomplete from "@/components/PlaceSearch";

export default {
  name: 'AppBar',
  components: {PlaceSearchAutocomplete},
  setup() {
    const {setCoordinatesAsCurrentPosition, loading} = placeStore()

    const placeSearchAutocomplete = ref(null)

    const searchPlace = () => {
      placeSearchAutocomplete.value.open()
    }

    return {
      loading,
      placeSearchAutocomplete,
      searchPlace,
      setCoordinatesAsCurrentPosition,
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

