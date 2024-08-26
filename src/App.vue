<template>
  <v-app>
    <AppBar v-if="!isFullscreen" @open-setup-dialog="openSetupDialog" />

    <v-main>
      <v-container :fluid="isFullscreen">
        <v-row>
          <v-col v-for="card in layout" :key="card.cardType" cols="12" :md="card.size">
            <Component :is="getCardTypeComponent(card.cardType)" />
          </v-col>
        </v-row>
      </v-container>
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-btn
            v-bind="props"
            aria-label="Passer en plein écran"
            class="ma-2" :style="{ 'right': '24px', 'bottom': '24px', 'position': 'fixed', 'z-index': 4 }"
            :icon="isHovering ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" @click="toggle"
          />
        </template>
      </v-hover>
    </v-main>
    <SetupDialog ref="setupDialog" />
    <!--    <v-footer v-show="!isFullscreen" app> -->
    <!--      <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
    <!--    </v-footer> -->
  </v-app>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { useDark, useFullscreen } from '@vueuse/core'
import { useTheme } from 'vuetify'
import AppBar from '@/components/AppBar.vue'
import useWeather from '@/store/weather'
import MoonCard from '@/components/Cards/MoonCard.vue'
import useAstro from '@/store/astro'
import CurrentWeatherCard from '@/components/Cards/CurrentWeatherCard.vue'
import PrecipitationCard from '@/components/Cards/PrecipitationCard.vue'
import HourlyTemperatureCard from '@/components/Cards/HourlyTemperatureCard/HourlyTemperatureCard.vue'
import usePlace from '@/store/place'
import AlertsCard from '@/components/Cards/AlertsCard.vue'
import DailyTemperatureCard from '@/components/Cards/DailyTemperatureCard/DailyTemperatureCard.vue'
import SetupDialog from '@/components/SetupDialog.vue'
import useLayout, { CardType } from '@/store/layout'
import SunCard from '@/components/Cards/SunCard.vue'
import HourlyRainCard from '@/components/Cards/HourlyRainCard/HourlyRainCard.vue'
import NasaPictureOfTheDayCard from '@/components/Cards/NasaPictureOfTheDayCard.vue'
import PlaceCard from '@/components/Cards/PlaceCard.vue'

const { toggle } = useFullscreen()
const dark = useDark()
const { isFullscreen } = useFullscreen()
const { fetchWeather } = useWeather()
const { fetchAstro } = useAstro()
const { place } = usePlace()
const theme = useTheme()

const setupDialog = ref<InstanceType<typeof SetupDialog>>()

const { layout } = useLayout()
function openSetupDialog() {
  setupDialog.value?.open()
}

onMounted(() => {
  if (!place.value)
    setupDialog.value?.open()
})

function getCardTypeComponent(cardType: CardType): Component {
  switch (cardType) {
    case CardType.PLACE:
      return PlaceCard
    case CardType.WEATHER_TODAY:
      return CurrentWeatherCard
    case CardType.SUN_TODAY:
      return SunCard
    case CardType.MOON_TODAY:
      return MoonCard
    case CardType.RAIN_NEXT_HOUR:
      return PrecipitationCard
    case CardType.TEMP_NEXT_24H:
      return HourlyTemperatureCard
    case CardType.RAIN_NEXT_24H:
      return HourlyRainCard
    case CardType.WEATHER_NEXT_6D:
      return DailyTemperatureCard
    case CardType.WEATHER_ALERTS:
      return AlertsCard
    case CardType.NASA_POTC:
      return NasaPictureOfTheDayCard
  }
}

// TODO do not watch - use after config save
watch(place, fetchAstro, { immediate: true })
watch(place, fetchWeather, { immediate: true })

watch(dark, (v) => {
  theme.global.name.value = v ? 'dark' : 'light'
}, { immediate: true })
</script>
