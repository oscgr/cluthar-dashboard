<template>
  <v-row>
    <v-col v-for="card in layout" :key="card.cardType" cols="12" :md="card.size">
      <Component :is="getCardTypeComponent(card.cardType)" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { watch } from 'vue'
import useLayout, { CardType } from '@/store/layout'
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

const { layout } = useLayout()
const { fetchWeather } = useWeather()
const { fetchPollution } = usePollution()
const { fetchAstro } = useAstro()

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
    case CardType.COCKTAIL:
      return CocktailCard
    case CardType.POLLUTION:
      return PollutionCard
  }
}

const { place } = usePlace()
// TODO do not watch - use after config save
watch(place, fetchAstro, { immediate: true })
watch(place, fetchWeather, { immediate: true })
watch(place, fetchPollution, { immediate: true })
</script>
