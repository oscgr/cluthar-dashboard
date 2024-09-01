<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      width="100%"
      height="100%"
      min-height="150px"
      flat
      :color="dark ? '#600e28' : '#dfd3c3'"
    >
      <v-card-subtitle v-if="!place" class="pa-4">
        Veuillez renseigner votre emplacement
      </v-card-subtitle>
      <v-card-text v-else>
        <v-row no-gutters class="text-h4">
          <v-col>
            <div class="text-h4 font-weight-thin text-capitalize" v-text="sunPhaseString" />
          </v-col>
          <v-col class="flex-grow-0 pb-4 pr-8">
            <v-icon :icon="sunIcon" size="48" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon title="Lever de lune" size="24" style="width: 36px" icon="wi:wi-sunrise" />
          </v-col>
          <v-col>
            <span style="line-height: 35px" v-text="isHovering ? 'Lever de soleil' : sunrise" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Relatif' : (capitalize(sunriseFromNow) || '--')" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Lever de lune" size="24" style="width: 36px" icon="wi:wi-sunrise" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon title="Coucher de lune" size="24" style="width: 36px" icon="wi:wi-sunset" />
          </v-col>
          <v-col>
            <span style="line-height: 35px" v-text="isHovering ? 'Coucher de soleil' : sunset" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Relatif' : (capitalize(sunsetFromNow) || '--')" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Coucher de lune" size="24" style="width: 36px" icon="wi:wi-sunset" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon class="wi-wind" title="Angle" size="24" style="width: 36px" :icon="sunOrientationIcon" />
          </v-col>
          <v-col class="flex-grow-0">
            <span style="line-height: 35px; white-space: nowrap" v-text="isHovering ? 'Orientation' : ((sunPosition.altitude > 0) ? capitalize(compass) : ('--'))" />
          </v-col>
          <v-col class="flex-grow-0" />
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Durée' : duration" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Angle" size="24" style="width: 36px" icon="mdi-timer-outline" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'
import { capitalize } from 'lodash'
import useAstro from '@/store/astro'
import DayPhase from '@/enums/DayPhase'

import Global from '@/utils/global'
import { diffNowLocaleString } from '@/utils/durationDisplay'
import usePlace from '@/store/place'

const dark = useDark()
const { t } = useI18n()
const { place } = usePlace()
const { sunTimes, sunPosition, sunPhase } = useAstro()

const sunriseDateTime = computed(() => sunTimes.value?.sunrise && DateTime.fromJSDate(sunTimes.value.sunrise))

const sunsetDateTime = computed(() => sunTimes.value?.sunset && DateTime.fromJSDate(sunTimes.value.sunset))

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

const sunOrientation = computed(() => {
  const angle = Global.getDegreesFromRadian(sunPosition.value?.azimuth || 0) + 180
  return (angle > 0) ? angle : (360 + angle)
})
const sunOrientationIcon = computed(() => `wi:towards-${sunOrientation.value}-deg`)

const compass = computed(() => sunPosition.value?.azimuth ? t(`constants.COMPASS_POINT.${Global.getCompassPoint(sunOrientation.value)}`) : '')

const sunIcon = computed(() => {
  switch (sunPhase.value) {
    case DayPhase.DAY:
    case DayPhase.ZENITH:
      return 'wi:wi-day-sunny'
    case DayPhase.NIGHT:
    case DayPhase.NIGHT_START:
    case DayPhase.NIGHT_END:
    case DayPhase.NAUTICAL_DAWN:
    case DayPhase.NAUTICAL_DUSK:
    case DayPhase.DAWN:
    case DayPhase.DUSK:
    case DayPhase.NADIR:
      return 'wi:wi-stars'
    case DayPhase.SUNRISE:
    case DayPhase.SUNRISE_GOLDEN_HOUR:
      return 'wi:wi-sunrise'
    case DayPhase.SUNSET:
    case DayPhase.SUNSET_GOLDEN_HOUR:
      return 'wi:wi-sunset'
    default:
      return ''
  }
})
</script>
