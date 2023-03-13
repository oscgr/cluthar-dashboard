<template>
  <v-app>
    <AppBar v-show="!fullScreen" />

    <v-main :style="{ background: (dark ? '#1b262c' : '#f0ece3') }">
      <v-container v-if="!noData">
        <v-row>
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
          <!--          <v-col cols="12" md="6" v-if="alerts"> -->
          <!--            <alerts-card /> -->
          <!--          </v-col> -->

          <v-col cols="12" md="6">
            <PrecipitationCard />
          </v-col>
          <v-col cols="12" md="6">
            <HourlyTemperatureCard />
          </v-col>
        </v-row>
      </v-container>
      <BtnHover />
    </v-main>
    <!--    <v-footer app v-show="!fullScreen"> -->
    <!--      <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
    <!--    </v-footer> -->
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useDark } from '@vueuse/core'
import { useTheme } from 'vuetify'
import PlaceCard from '@/components/PlaceCard.vue'
import AppBar from '@/components/AppBar.vue'
import BtnHover from '@/components/BtnHover.vue'
import fullscreenStore from '@/store/fullscreenStore'
import weatherStore from '@/store/weatherStore'
import MoonCard from '@/components/MoonCard.vue'
import DayCard from '@/components/DayCard.vue'
import astroStore from '@/store/astroStore'
import CurrentWeatherCard from '@/components/CurrentWeatherCard.vue'
import PrecipitationCard from '@/components/PrecipitationCard.vue'
import HourlyTemperatureCard from '@/components/HourlyTemperatureCard.vue'
import placeStore from '@/store/placeStore'

const dark = useDark()
const { fullScreen } = fullscreenStore()
const { fetchWeather, payload } = weatherStore()
const { fetchAstro } = astroStore()
const { noData, place } = placeStore()
const theme = useTheme()
onMounted(async () => {
  theme.global.name.value = dark.value ? 'dark' : 'light'

  await Promise.all([fetchAstro(), fetchWeather()])
})

const alerts = computed(() => payload.value.alerts?.length > 0)

watch(place, fetchAstro)
watch(place, fetchWeather)

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
