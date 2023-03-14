<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :color="dark ? '#801336' : '#dfd3c3'"
  >
    <v-card-text>
      <v-row no-gutters class="text-h4">
        <v-col>
          <span class="text-capitalize" v-text="sunPhaseString" />
        </v-col>
        <v-col class="flex-grow-0">
          <v-img width="72px" alt="météo" :src="sunIcon" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="lever du soleil" class="info-icon" :icon="mdiWeatherSunsetUp" />
          <span v-text="sunrise" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="sunriseFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de soleil" class="info-icon" :icon="mdiWeatherSunsetDown" />
          <span v-text="sunset" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="sunsetFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de lune" class="info-icon" :icon="mdiAngleAcute" />
          <span v-text="sunAltitude" />
        </v-col>
        <v-col cols="6" class="text-right">
          <v-icon title="durée de la journée" class="info-icon" :icon="mdiTimerOutline" />
          <span v-text="duration" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { mdiAngleAcute, mdiTimerOutline, mdiWeatherSunsetDown, mdiWeatherSunsetUp } from '@mdi/js'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'
import useAstro from '@/store/astro'
import DayPhase from '@/enums/DayPhase'

import Global from '@/utils/global'
import { diffNowLocaleString } from '@/utils/durationDisplay'

const dark = useDark()
const { t } = useI18n()
const { sunTimes, sunPosition, sunPhase } = useAstro()

const sunriseDateTime = computed(() => sunTimes.value?.sunrise && DateTime.fromJSDate(sunTimes.value?.sunrise))

const sunsetDateTime = computed(() => sunTimes.value?.sunset && DateTime.fromJSDate(sunTimes.value?.sunset))

const sunrise = computed(() => sunriseDateTime.value?.toLocaleString(DateTime.TIME_24_SIMPLE))

const sunriseFromNow = computed(() => sunriseDateTime.value && diffNowLocaleString(sunriseDateTime.value))

const sunset = computed(() => sunsetDateTime.value?.toLocaleString(DateTime.TIME_24_SIMPLE))

const sunsetFromNow = computed(() => sunsetDateTime.value && diffNowLocaleString(sunsetDateTime.value))

const duration = computed(() => {
  if (!sunsetDateTime.value || !sunriseDateTime.value)
    return '?'
  const diff = sunsetDateTime.value?.diff(sunriseDateTime.value, ['hours', 'minutes', 'seconds'])
  return `${diff.hours}h, ${diff.minutes}m et ${Math.floor(diff.seconds)}s`
})

const sunPhaseString = computed(() => sunPhase.value && t(`constants.DAY_CYCLE.${sunPhase.value}`))

const sunAltitude = computed(() => sunPosition.value?.altitude && `${Global.getDegreesFromRadian(sunPosition.value.altitude)}°`)

const sunIcon = computed(() => {
  switch (sunPhase.value) {
    case DayPhase.DAY:
    case DayPhase.ZENITH:
      return '/icons/dayPhases/001-mountain.svg'
    case DayPhase.NIGHT:
    case DayPhase.NIGHT_START:
    case DayPhase.NIGHT_END:
    case DayPhase.NAUTICAL_DAWN:
    case DayPhase.NAUTICAL_DUSK:
    case DayPhase.DAWN:
    case DayPhase.DUSK:
    case DayPhase.NADIR:
      return '/icons/dayPhases/004-tent.svg'
    case DayPhase.SUNRISE:
    case DayPhase.SUNRISE_GOLDEN_HOUR:
      return '/icons/dayPhases/001-sunrise.svg'
    case DayPhase.SUNSET:
    case DayPhase.SUNSET_GOLDEN_HOUR:
      return '/icons/dayPhases/002-sunset.svg'
    default:
      return ''
  }
})
</script>
