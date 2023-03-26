<template>
  <div class="font-weight-black" style="font-family: 'Roboto Condensed', sans-serif; font-size: 14px" v-text="time" />
  <div style="font-family: 'Roboto Condensed', sans-serif; font-size: 21px" v-text="temperature" />
  <div class="font-weight-light" style="font-family: 'Roboto Condensed',sans-serif; font-size: 12px" v-text="feelsLike" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'

const props = defineProps<{
  entry: { temp: number; feels_like: number; dt: number }
}>()

const temperature = computed(() => `${Math.floor(props.entry.temp)}°`)
const feelsLike = computed(() => `${Math.floor(props.entry.feels_like)}°`)
const time = computed(() => `${DateTime.fromMillis(props.entry.dt * 1000).hour}h`)
</script>
