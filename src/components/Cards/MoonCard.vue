<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      width="100%"
      height="100%"
      dark
      min-height="150px"
      flat
      :color="dark ? '#0b3c5d' : '#c8cdd0'"
    >
      <v-card-subtitle v-if="!place" class="pa-4">
        Veuillez renseigner votre emplacement
      </v-card-subtitle>

      <v-card-text v-else>
        <v-row no-gutters>
          <v-col>
            <div title="Phase de lune" class="text-h4 font-weight-thin text-capitalize" v-text="moonPhaseString" />
          </v-col>
          <v-col class="flex-grow-0 pb-4">
            <v-icon :icon="moonIcon" size="48" />
            <!--            <v-img class="ma-2" width="56px" alt="phase lunaire" :src="moonPhaseIcon" /> -->
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon title="Lever de lune" size="24" style="width: 36px" icon="wi:wi-moonrise" />
          </v-col>
          <v-col>
            <span style="line-height: 35px" v-text="isHovering ? 'Lever de lune' : (rise || 'Hier')" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Relatif' : (capitalize(riseFromNow) || '--')" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Lever de lune" size="24" style="width: 36px" icon="wi:wi-moonrise" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon title="Coucher de lune" size="24" style="width: 36px" icon="wi:wi-moonset" />
          </v-col>
          <v-col>
            <span style="line-height: 35px" v-text="isHovering ? 'Coucher de lune' : (set || 'Demain')" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Relatif' : (capitalize(setFromNow) || '--')" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Coucher de lune" size="24" style="width: 36px" icon="wi:wi-moonset" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon class="wi-wind" title="Angle" size="24" style="width: 36px" :icon="moonOrientationIcon" />
          </v-col>
          <v-col class="flex-grow-0">
            <span style="line-height: 35px; white-space: nowrap" v-text="isHovering ? 'Orientation' : ((moonPosition.altitude > 0) ? capitalize(compass) : ('--'))" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Durée' : (displayDuration ? duration : '--')" />
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
import { useI18n } from 'vue-i18n'
import { useDark } from '@vueuse/core'
import { DateTime } from 'luxon'
import { capitalize } from 'lodash'
import useAstro from '@/store/astro'
import Global from '@/utils/global'
import { diffNowLocaleString } from '@/utils/durationDisplay'
import usePlace from '@/store/place'

const { t } = useI18n()
const dark = useDark()
const { place } = usePlace()
const { moonPhase, moonTimes, moonPosition, moonIcon } = useAstro()

const riseDateTime = computed(() => moonTimes.value?.rise && DateTime.fromJSDate(moonTimes.value.rise))

const setDateTime = computed(() => moonTimes.value?.set && DateTime.fromJSDate(moonTimes.value.set))

const rise = computed(() => riseDateTime.value?.toLocaleString(DateTime.TIME_24_SIMPLE))

const riseFromNow = computed(() => riseDateTime.value && diffNowLocaleString(riseDateTime.value))

const set = computed(() => setDateTime.value?.toLocaleString(DateTime.TIME_24_SIMPLE))

const setFromNow = computed(() => setDateTime.value && diffNowLocaleString(setDateTime.value))

const moonOrientation = computed(() => {
  const angle = Global.getDegreesFromRadian(moonPosition.value?.azimuth || 0) + 180
  return (angle > 0) ? angle : (360 + angle)
})
const moonOrientationIcon = computed(() => `wi:towards-${moonOrientation.value}-deg`)

const compass = computed(() => moonPosition.value?.azimuth ? t(`constants.COMPASS_POINT.${Global.getCompassPoint(moonOrientation.value)}`) : '')

const displayDuration = computed(() => riseDateTime.value && setDateTime.value && (riseDateTime.value < setDateTime.value))

const duration = computed(() => {
  if (!setDateTime.value || !riseDateTime.value)
    return '?'
  const diff = setDateTime.value?.diff(riseDateTime.value, ['hours', 'minutes', 'seconds'])
  return `${diff.hours}h, ${diff.minutes}m et ${Math.floor(diff.seconds)}s`
})

const moonPhaseString = computed(() => moonPhase.value && t(`constants.MOON_PHASE.${moonPhase.value}`))
</script>
