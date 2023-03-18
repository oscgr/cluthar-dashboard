<template>
  <v-app>
    <AppBar v-if="!isFullscreen" @open-setup-dialog="openSetupDialog" />

    <v-main :style="{ background: (dark ? '#1b262c' : '#f0ece3') }">
      <v-container :fluid="isFullscreen">
        <v-row>
          <v-col v-for="card in layout" :key="card.cardType" cols="12" :md="card.size">
            <PlaceCard v-if="card.cardType === CardType.PLACE" />
            <CurrentWeatherCard v-else-if="card.cardType === CardType.WEATHER_TODAY" />
            <SunCard v-else-if="card.cardType === CardType.SUN_TODAY" />
            <MoonCard v-else-if="card.cardType === CardType.MOON_TODAY" />
            <PrecipitationCard v-else-if="card.cardType === CardType.RAIN_NEXT_HOUR" />
            <HourlyTemperatureCard v-else-if="card.cardType === CardType.TEMP_NEXT_24H" />
            <DailyTemperatureCard v-else-if="card.cardType === CardType.WEATHER_NEXT_6D" />
            <AlertsCard v-else-if="card.cardType === CardType.WEATHER_ALERTS" />
          </v-col>
        </v-row>
      </v-container>
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-btn
            v-bind="props"
            class="ma-2" :style="{ 'right': '24px', 'bottom': '24px', 'position': 'fixed', 'z-index': 4 }"
            :icon="isHovering ? mdiFullscreenExit : mdiFullscreen" @click="toggle"
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
import { onMounted, ref, watch } from 'vue'
import { useDark, useFullscreen } from '@vueuse/core'
import { useTheme } from 'vuetify'
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js'
import PlaceCard from '@/components/Cards/PlaceCard.vue'
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
const { toggle } = useFullscreen()
const dark = useDark()
const { isFullscreen } = useFullscreen()
const { fetchWeather, token } = useWeather()
const { fetchAstro } = useAstro()
const { place } = usePlace()
const theme = useTheme()

const setupDialog = ref<InstanceType<typeof SetupDialog>>()

const { layout } = useLayout()
const openSetupDialog = () => {
  setupDialog.value?.open()
}

onMounted(() => {
  if (!place.value || !token.value)
    setupDialog.value?.open()
})

// TODO do not watch - use after config save
watch(place, fetchAstro, { immediate: true })
watch(place, fetchWeather, { immediate: true })
watch(token, fetchWeather)

watch(dark, (v) => {
  theme.global.name.value = v ? 'dark' : 'light'
}, { immediate: true })
</script>
