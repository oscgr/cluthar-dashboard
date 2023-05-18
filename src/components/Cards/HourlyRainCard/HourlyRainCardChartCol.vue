<template>
  <div class="font-weight-black" style="font-family: 'Roboto Condensed', sans-serif; font-size: 14px" v-text="time" />
  <div style="font-family: 'Roboto Condensed', sans-serif; font-size: 18px" v-text="rain_1h" />
<!--  <div class="font-weight-light" style="font-family: 'Roboto Condensed',sans-serif; font-size: 12px" v-text="rain_1h" /> -->
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'
import type { HourlyDataBlock } from 'owm-onecall-api/dist/types/types/response/hourly'

const props = defineProps<{
  entry: HourlyDataBlock
}>()

const rain_1h = computed(() => ((props.entry.rain?.['1h'] || 0) === 0) ? '--' : `${props.entry.rain?.['1h'] || 0}mm`)
// const wind_speed = computed(() => (Math.floor(props.entry.wind_speed) === 0) ? '0' : `${Math.floor(props.entry.wind_speed * 3.6)}km/h`)
const time = computed(() => `${DateTime.fromMillis(props.entry.dt * 1000).hour}h`)
</script>
