<template>
  <v-card
    elevation="0"
    width="100%"
    height="100%"
  >
    <v-card-text>
      <v-row no-gutters class=" mb-2">
        <v-col cols="12" class="text-h2">
          <span v-text="place?.display?.split('|')[0]" />
        </v-col>
        <v-col cols="12">
          <span v-text="place?.display?.split('|')[1]" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h4">
        <v-col cols="12">
          <span class="hidden-md-and-down" v-text="dateString" />
          <span class="hidden-lg-and-up" v-text="dateStringShort" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6 mt-4">
        <v-col cols="6">
          <v-icon title="latitude" class="info-icon" :icon="mdiLatitude" />
          <span v-text="`${place.latitude ? Math.floor(place.latitude * 100) / 100 : '?'}`" />
          <v-spacer />
          <v-icon title="longitude" class="info-icon" :icon="mdiLongitude" />
          <span v-text="`${place.longitude ? Math.floor(place.longitude * 100) / 100 : '?'}`" />
        </v-col>
        <v-col cols="6" class="text-right text-h5">
          <span v-text="timeString" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { mdiLatitude, mdiLongitude } from '@mdi/js'
import placeStore from '@/store/placeStore'
import timeStore from '@/store/timeStore'

const { place } = placeStore()
const { now } = timeStore()

const dateString = computed(() => now.value.format('dddd LL'))
const dateStringShort = computed(() => now.value.format('ddd ll'))
const timeString = computed(() => now.value.format('LTS'))
</script>
