<template>
  <div class="font-weight-black pt-7" style="font-family: 'Roboto Condensed', sans-serif; font-size: 10px" v-text="time" />
  <div style="font-family: 'Roboto Condensed', sans-serif; font-size: 14px; white-space: nowrap" v-text="`${min}° / ${max}°`" />
  <v-img :src="weatherIcon(entry.weather[0].id, entry.clouds)" width="32px" />
  <div class="font-weight-light pt-1" style="font-family: 'Roboto Condensed',sans-serif; font-size: 6px" v-text="morning" />
  <div class="font-weight-light " style="font-family: 'Roboto Condensed',sans-serif; font-size: 6px" v-text="day" />
  <div class="font-weight-light " style="font-family: 'Roboto Condensed',sans-serif; font-size: 6px" v-text="evening" />
  <div class="font-weight-light " style="font-family: 'Roboto Condensed',sans-serif; font-size: 6px" v-text="night" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'
import useWeather from '@/store/weather'

const props = defineProps<{
  entry: { temp: { min: number; max: number; morn: number; day: number; eve: number; night: number }; dt: number; clouds: number; weather: { id: number }[] }
}>()

const { weatherIcon } = useWeather()

const time = computed(() => `${DateTime.fromMillis(props.entry.dt * 1000).weekdayLong}`)
const min = computed(() => Math.floor(props.entry.temp.min))
const max = computed(() => Math.floor(props.entry.temp.max))
const morning = computed(() => `Matin ${Math.floor(props.entry.temp.morn)}°`)
const day = computed(() => `Jour ${Math.floor(props.entry.temp.day)}°`)
const evening = computed(() => `Soir ${Math.floor(props.entry.temp.eve)}°`)
const night = computed(() => `Nuit ${Math.floor(props.entry.temp.night)}°`)
</script>
