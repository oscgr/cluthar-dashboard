<template>
  <v-card
    width="100%"
    height="100%"
    dark
    flat
    :color="dark ? '#0f4c75' : '#c8cdd0'"
  >
    <v-card-text>
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
import astroStore from '@/store/astroStore'
import Global from '@/utils/global'
import { diffNowLocaleString } from '@/utils/durationDisplay'

const { t } = useI18n()
const dark = useDark()
const { noData, moonPhase, moonTimes, moonPosition } = astroStore()

const riseMoment = computed(() => DateTime.fromJSDate(moonTimes.value.rise))

const setMoment = computed(() => DateTime.fromJSDate(moonTimes.value.set))

const rise = computed(() => noData.value ? '' : riseMoment.value.toLocaleString(DateTime.TIME_24_SIMPLE))

const riseFromNow = computed(() => noData.value ? '' : diffNowLocaleString(riseMoment.value))

const set = computed(() => noData.value
  ? ''
  : setMoment.value
    .toLocaleString(DateTime.TIME_24_SIMPLE))

const setFromNow = computed(() => noData.value ? '' : diffNowLocaleString(setMoment.value))

const moonAzimuth = computed(() => noData.value ? '?' : t(`constants.COMPASS_POINT.${Global.getCompassPoint(moonPosition.value.azimuth)}`))

const moonAltitude = computed(() => noData.value ? '?' : `${Global.getDegreesFromRadian(moonPosition.value.altitude)}°`)

const moonPhaseIcon = computed(() => noData.value ? '' : (`/icons/moonPhases/${moonPhase.value}.svg`))

const moonPhaseString = computed(() => noData.value ? '' : t(`constants.MOON_PHASE.${moonPhase.value}`))
</script>
