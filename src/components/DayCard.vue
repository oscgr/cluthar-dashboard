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
import moment from 'moment'
import { computed } from 'vue'
import { mdiAngleAcute, mdiTimerOutline, mdiWeatherSunsetDown, mdiWeatherSunsetUp } from '@mdi/js'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import astroStore from '@/store/astroStore'
import DayCycle from '@/enums/DayCycle'

import Global from '@/utils/global'
import timeStore from '@/store/timeStore'
import placeStore from '@/store/placeStore'

const dark = useDark()
const { t } = useI18n()
const { sunTimes, sunPosition, sunPhase } = astroStore()

const { noData } = placeStore()

const { fromNow } = timeStore()

const sunriseMoment = computed(() => moment(sunTimes.value.sunrise))

const sunsetMoment = computed(() => moment(sunTimes.value.sunset))

const sunrise = computed(() => noData.value ? '' : sunriseMoment.value.format('LT'))

const sunriseFromNow = computed(() => noData.value ? '' : fromNow(sunriseMoment.value))

const sunset = computed(() => noData.value ? '' : sunsetMoment.value.format('LT'))

const sunsetFromNow = computed(() => noData.value ? '' : fromNow(sunsetMoment.value))

const duration = computed(() => {
  if (noData.value)
    return '?'
  const diff = moment.duration(sunsetMoment.value.diff(sunriseMoment.value))
  return `${diff.hours()}h, ${diff.minutes()}m et ${diff.seconds()}s`
})

const sunPhaseString = computed(() => noData.value ? '' : t(`constants.DAY_CYCLE.${sunPhase.value}`))

const sunAltitude = computed(() => noData.value ? '?' : `${Global.getDegreesFromRadian(sunPosition.value.altitude)}°`)

const sunIcon = computed(() => {
  switch (sunPhase.value) {
    case DayCycle.DAY:
    case DayCycle.ZENITH:
      return '/icons/dayPhases/001-mountain.svg'
    case DayCycle.NIGHT:
    case DayCycle.NIGHT_START:
    case DayCycle.NIGHT_END:
    case DayCycle.NAUTICAL_DAWN:
    case DayCycle.NAUTICAL_DUSK:
    case DayCycle.DAWN:
    case DayCycle.DUSK:
    case DayCycle.NADIR:
      return '/icons/dayPhases/004-tent.svg'
    case DayCycle.SUNRISE:
    case DayCycle.SUNRISE_GOLDEN_HOUR:
      return '/icons/dayPhases/001-sunrise.svg'
    case DayCycle.SUNSET:
    case DayCycle.SUNSET_GOLDEN_HOUR:
      return '/icons/dayPhases/002-sunset.svg'
    default:
      return ''
  }
})
</script>
