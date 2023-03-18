<template>
  <v-card
    width="100%"
    height="100%"
    dark
    flat
    :color="dark ? '#0f4c75' : '#c8cdd0'"
  >
    <v-card-subtitle v-if="!place" class="pa-4">
      Veuillez renseigner votre emplacement
    </v-card-subtitle>

    <v-card-text v-else>
      <v-row no-gutters>
        <v-col>
          <div title="température" class="text-h4 text-capitalize" v-text="moonPhaseString" />
        </v-col>
        <v-col class="flex-grow-0">
          <v-img class="ma-2" width="56px" alt="phase lunaire" :src="moonPhaseIcon" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="lever du lune" class="info-icon" :icon="mdiWeatherSunsetUp" />
          <span v-text="rise" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="riseFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de lune" class="info-icon" :icon="mdiWeatherSunsetDown" />
          <span v-text="set" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="setFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de lune" class="info-icon" :icon="mdiAngleAcute" />
          <span v-text="moonAltitude" />
        </v-col>
        <v-col cols="6" class="text-right text-capitalize">
          <v-icon title="coucher de lune" class="info-icon" :icon="mdiCompass" />
          <span v-text="moonAzimuth" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { mdiAngleAcute, mdiCompass, mdiWeatherSunsetDown, mdiWeatherSunsetUp } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useDark } from '@vueuse/core'
import { DateTime } from 'luxon'
import useAstro from '@/store/astro'
import Global from '@/utils/global'
import { diffNowLocaleString } from '@/utils/durationDisplay'
import usePlace from '@/store/place'

const { t } = useI18n()
const dark = useDark()
const { place } = usePlace()
const { moonPhase, moonTimes, moonPosition } = useAstro()

const riseDateTime = computed(() => moonTimes.value?.rise && DateTime.fromJSDate(moonTimes.value.rise))

const setDateTime = computed(() => moonTimes.value?.set && DateTime.fromJSDate(moonTimes.value.set))

const rise = computed(() => riseDateTime.value?.toLocaleString(DateTime.TIME_24_SIMPLE))

const riseFromNow = computed(() => riseDateTime.value && diffNowLocaleString(riseDateTime.value))

const set = computed(() => setDateTime.value?.toLocaleString(DateTime.TIME_24_SIMPLE))

const setFromNow = computed(() => setDateTime.value && diffNowLocaleString(setDateTime.value))

const moonAzimuth = computed(() => {
  if (typeof moonPosition.value?.azimuth !== 'number')
    return '?'
  return t(`constants.COMPASS_POINT.${Global.getCompassPoint(moonPosition.value.azimuth)}`)
})

const moonAltitude = computed(() => {
  if (typeof moonPosition.value?.altitude !== 'number')
    return '?'
  return `${Global.getDegreesFromRadian(moonPosition.value.altitude)}°`
})

const moonPhaseIcon = computed(() => moonPhase.value ? (`/icons/moonPhases/${moonPhase.value}.svg`) : '')

const moonPhaseString = computed(() => moonPhase.value && t(`constants.MOON_PHASE.${moonPhase.value}`))
</script>
