<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :color="dark ? '#801336' : '#f89a9a'"
  >
    <v-card-text>
      <v-row v-for="alert in alerts" :key="alert.name" no-gutters>
        <v-col cols="12">
          <span class="text-h4 " v-text="alert.event" />
        </v-col>
        <v-col cols="6">
          <span class="h6" v-text="`${unixFormatted(alert.start)} (${unixFromNow(alert.start)})`" />
        </v-col>
        <v-col cols="6 text-right">
          <span class="h6" v-text="`${unixFormatted(alert.end)} (${unixFromNow(alert.end)})`" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'
import { useDark } from '@vueuse/core'
import useWeather from '@/store/weather'
import { diffNowLocaleString } from '@/utils/durationDisplay.js'

const { payload } = useWeather()

const dark = useDark()

const alerts = computed(() => payload.value?.alerts || [])

const unixFormatted = (unixDate?: number) => unixDate && DateTime.fromMillis(unixDate).toLocaleString(DateTime.DATETIME_SHORT)

const unixFromNow = (unixDate?: number) => unixDate && diffNowLocaleString(DateTime.fromMillis(unixDate))
</script>
