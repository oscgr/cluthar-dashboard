<template>
  <v-row>
    <v-col v-for="card in layout" :key="card.cardType" cols="12" :md="card.size">
      <Component :is="getCardTypeComponent(card.cardType)" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { useIntervalFn, watchTriggerable } from '@vueuse/core'
import type { CardType } from '@/store/layout'
import useLayout from '@/store/layout'
import PlaceCard from '@/components/Cards/PlaceCard.vue'
import CurrentWeatherCard from '@/components/Cards/CurrentWeatherCard.vue'
import SunCard from '@/components/Cards/SunCard.vue'
import MoonCard from '@/components/Cards/MoonCard.vue'
import PrecipitationCard from '@/components/Cards/PrecipitationCard.vue'
import HourlyTemperatureCard from '@/components/Cards/HourlyTemperatureCard/HourlyTemperatureCard.vue'
import HourlyRainCard from '@/components/Cards/HourlyRainCard/HourlyRainCard.vue'
import DailyTemperatureCard from '@/components/Cards/DailyTemperatureCard/DailyTemperatureCard.vue'
import AlertsCard from '@/components/Cards/AlertsCard.vue'
import NasaPictureOfTheDayCard from '@/components/Cards/NasaPictureOfTheDayCard.vue'
import CocktailCard from '@/components/Cards/CocktailCard.vue'
import PollutionCard from '@/components/PollutionCard.vue'
import usePlace from '@/store/place'
import useWeather from '@/store/weather'
import usePollution from '@/store/pollution'
import useAstro from '@/store/astro'
import useNasa from '@/store/nasa'
import useCocktail from '@/store/cocktail'

const { layout } = useLayout()
const { fetchWeather, weatherInfoIsRequired } = useWeather()
const { fetchPollution, pollutionInfoIsRequired } = usePollution()
const { fetchPotd, nasaInfoIsRequired } = useNasa()
const { fetchCocktail, cocktailInfoIsRequired } = useCocktail()
const { fetchAstro, astroIsRequired } = useAstro()
const { place } = usePlace()

function getCardTypeComponent(cardType: CardType): Component {
  switch (cardType) {
    case 'PLACE':
      return PlaceCard
    case 'WEATHER_TODAY':
      return CurrentWeatherCard
    case 'SUN_TODAY':
      return SunCard
    case 'MOON_TODAY':
      return MoonCard
    case 'RAIN_NEXT_HOUR':
      return PrecipitationCard
    case 'TEMP_NEXT_24H':
      return HourlyTemperatureCard
    case 'RAIN_NEXT_24H':
      return HourlyRainCard
    case 'WEATHER_NEXT_6D':
      return DailyTemperatureCard
    case 'WEATHER_ALERTS':
      return AlertsCard
    case 'NASA_POTD':
      return NasaPictureOfTheDayCard
    case 'COCKTAIL':
      return CocktailCard
    case 'POLLUTION':
      return PollutionCard
  }
}

const { trigger: triggerAstro } = watchTriggerable(place || astroIsRequired.value, fetchAstro, { immediate: true })
const { trigger: triggerWeather } = watchTriggerable(() => place || weatherInfoIsRequired.value, fetchWeather, { immediate: true })
const { trigger: triggerPollution } = watchTriggerable(() => place || pollutionInfoIsRequired.value, fetchPollution, { immediate: true })
const { trigger: triggerPotd } = watchTriggerable(nasaInfoIsRequired, fetchPotd, { immediate: true })
const { trigger: triggerCocktail } = watchTriggerable(cocktailInfoIsRequired, fetchCocktail, { immediate: true })

// cron + watcher
useIntervalFn(triggerAstro, 1000 * 60) // 1 min
useIntervalFn(triggerWeather, 1000 * 60 * 5) // 5 min
useIntervalFn(triggerPollution, 1000 * 60 * 60) // 1h
useIntervalFn(triggerPotd, 1000 * 60 * 60 * 12) // 12h
useIntervalFn(triggerCocktail, 1000 * 60 * 60 * 24) // 24h
</script>
