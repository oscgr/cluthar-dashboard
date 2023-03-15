<template>
  <v-app-bar app title="AZIMUTH SHUTTER">
    <template #append>
      <v-scroll-x-transition>
        <PlaceSearch v-model:show="showPlaceSearch" style="min-width: 300px" />
      </v-scroll-x-transition>

      <v-hover>
        <template #default="{ isHovering }">
          <v-btn depressed :icon="isHovering ? mdiHomeSearch : mdiHomeSearchOutline" @click="showPlaceSearch = !showPlaceSearch" />
        </template>
      </v-hover>

      <!--      <v-hover> -->
      <!--        <template #default="{ hover }"> -->
      <!--          <v-btn :loading="loading" icon @click="setCoordinatesAsCurrentPosition"> -->
      <!--            <v-icon :icon="hover ? mdiCrosshairsGps : mdiCrosshairs" /> -->
      <!--          </v-btn> -->
      <!--        </template> -->
      <!--      </v-hover> -->
      <v-hover>
        <template #default="{ isHovering }">
          <v-btn class="mr-2" icon @click="dark = !dark">
            <v-icon :icon="(dark && !isHovering || !dark && isHovering) ? mdiBrightness4 : mdiBrightness6" />
          </v-btn>
        </template>
      </v-hover>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { mdiBrightness4, mdiBrightness6, mdiHomeSearch, mdiHomeSearchOutline } from '@mdi/js'
import { ref } from 'vue'
import { useDark } from '@vueuse/core'
import PlaceSearch from '@/components/PlaceSearch.vue'
import usePlace from '@/store/place'

const { noData } = usePlace()
const dark = useDark()
const showPlaceSearch = ref(false)
</script>
