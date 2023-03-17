<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :color="dark ? '#801336' : '#f89a9a'"
  >
    <v-card-text>
      <v-row v-for="(alert, i) in alerts" :key="alert.name" no-gutters>
        <v-col v-if="i !== 0" cols="12">
          <v-divider class="my-4" />
        </v-col>
        <v-col cols="12">
          <span class="text-h5 " v-text="alert.event" />
        </v-col>
        <v-col cols="12">
          <span class=" " v-text="alert.name" />
        </v-col>
        <v-col cols="12">
          <span class=" " v-text="alert.description" />
        </v-col>
        <v-col cols="6">
          <span class="font-weight-medium" v-text="`Depuis le ${unixFormatted(alert.start)} (${unixFromNow(alert.start)})`" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span class="font-weight-medium" v-text="`Jusqu'à ${unixFormatted(alert.end)} (${unixFromNow(alert.end)})`" />
        </v-col>
        <v-col cols="12" class="text-caption text-right">
          <span v-text="alert.sender_name" />
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

const unixFormatted = (unixDate?: number) => unixDate && DateTime.fromMillis(unixDate * 1000).toLocaleString(DateTime.DATETIME_SHORT)

const unixFromNow = (unixDate?: number) => unixDate && diffNowLocaleString(DateTime.fromMillis(unixDate * 1000))
</script>
