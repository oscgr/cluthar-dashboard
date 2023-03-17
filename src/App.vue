<template>
  <v-app>
    <AppBar v-if="!isFullscreen" />

    <v-main :style="{ background: (dark ? '#1b262c' : '#f0ece3') }">
      <v-container :fluid="isFullscreen">
        <v-card v-if="noData">
          <v-card-title class="text-center">
            Veuillez renseigner votre ville
            <PlaceSearch :show="true" />
          </v-card-title>
        </v-card>
        <v-card v-else-if="!token">
          <v-card-title class="text-center">
            Veuillez renseigner votre clé API OpenWeatherMap
            <OpenWeatherMapTokenPaster />
          </v-card-title>
        </v-card>
        <v-row v-else>
          <v-col cols="12" md="6">
            <PlaceCard />
          </v-col>
          <v-col cols="12" md="6">
            <CurrentWeatherCard />
          </v-col>
          <v-col cols="12" md="6">
            <DayCard />
          </v-col>
          <v-col cols="12" md="6">
            <MoonCard />
          </v-col>
          <v-col cols="12" md="6">
            <PrecipitationCard />
          </v-col>
          <v-col cols="12" md="6">
            <HourlyTemperatureCard />
          </v-col>
          <v-col cols="12" md="6">
            <DailyTemperatureCard />
          </v-col>
          <v-col v-if="alerts" cols="12">
            <AlertsCard />
          </v-col>
        </v-row>
      </v-container>
      <BtnHover />
    </v-main>
    <!--    <v-footer v-show="!fullScreen" app> -->
    <!--      <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
    <!--    </v-footer> -->
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useDark, useFullscreen } from '@vueuse/core'
import { useTheme } from 'vuetify'
import PlaceCard from '@/components/Cards/PlaceCard.vue'
import AppBar from '@/components/AppBar.vue'
import BtnHover from '@/components/BtnHover.vue'
import useWeather from '@/store/weather'
import MoonCard from '@/components/Cards/MoonCard.vue'
import DayCard from '@/components/Cards/DayCard.vue'
import useAstro from '@/store/astro'
import CurrentWeatherCard from '@/components/Cards/CurrentWeatherCard.vue'
import PrecipitationCard from '@/components/Cards/PrecipitationCard.vue'
import HourlyTemperatureCard from '@/components/Cards/HourlyTemperatureCard/HourlyTemperatureCard.vue'
import usePlace from '@/store/place'
import AlertsCard from '@/components/Cards/AlertsCard.vue'
import PlaceSearch from '@/components/PlaceSearch.vue'
import OpenWeatherMapTokenPaster from '@/OpenWeatherMapTokenPaster.vue'
import DailyTemperatureCard from '@/components/Cards/DailyTemperatureCard/DailyTemperatureCard.vue'

const dark = useDark()
const { isFullscreen } = useFullscreen()
const { fetchWeather, payload, token } = useWeather()
const { fetchAstro } = useAstro()
const { noData, place } = usePlace()
const theme = useTheme()
onMounted(async () => {
  theme.global.name.value = dark.value ? 'dark' : 'light'

  await Promise.all([fetchAstro(), fetchWeather()])
})

const alerts = computed(() => (payload.value.alerts || [])?.length > 0)

watch(place, fetchAstro)
watch(place, fetchWeather)
watch(token, fetchWeather)

watch(dark, (v) => {
  theme.global.name.value = v ? 'dark' : 'light'
})
</script>

<style>
.info-icon {
  margin-top: -4px;
  margin-right: 8px;
}
</style>
