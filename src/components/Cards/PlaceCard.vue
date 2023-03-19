<template>
  <v-card
    elevation="0"
    width="100%"
    height="100%"
  >
    <v-card-subtitle v-if="!place" class="pa-4">
      Veuillez renseigner votre emplacement
    </v-card-subtitle>
    <v-card-text v-else>
      <v-row no-gutters class=" mb-2">
        <v-col cols="12" class="text-h3 font-weight-thin">
          <span v-text="place?.name" />
        </v-col>
        <v-col cols="12">
          <span v-text="place?.country" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h4">
        <v-col cols="12">
          <span class="hidden-md-and-down" v-text="dateString || '?'" />
          <span class="hidden-lg-and-up" v-text="dateStringShort || '?'" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6 mt-4">
        <v-col cols="12" class="d-flex text-h5 align-end justify-end">
          <span v-text="timeString || '?'" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import { DateTime } from 'luxon'
import usePlace from '@/store/place'

const { place } = usePlace()
const now = useNow({ interval: 1000 })

const nowDateTime = computed(() => now.value ? DateTime.fromJSDate(now.value) : null)
const dateString = computed(() => nowDateTime.value?.toLocaleString(DateTime.DATE_HUGE))
const dateStringShort = computed(() => nowDateTime.value?.toLocaleString(DateTime.DATE_HUGE))
const timeString = computed(() => nowDateTime.value?.toLocaleString(DateTime.TIME_24_WITH_SECONDS))
</script>
