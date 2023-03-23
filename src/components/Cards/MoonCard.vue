<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      width="100%"
      height="100%"
      dark
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
          <v-col class="flex-grow-0">
            <v-icon :icon="moonIcon" size="48" />
            <!--            <v-img class="ma-2" width="56px" alt="phase lunaire" :src="moonPhaseIcon" /> -->
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon title="Lever de lune" size="24" style="width: 36px" icon="wi:wi-moonrise" />
          </v-col>
          <v-col>
            <span style="line-height: 35px" v-text="isHovering ? 'Lever de lune' : rise" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Relatif' : riseFromNow" />
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
            <span style="line-height: 35px" v-text="isHovering ? 'Coucher de lune' : set" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Relatif' : setFromNow" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Coucher de lune" size="24" style="width: 36px" icon="wi:wi-moonset" />
          </v-col>
        </v-row>

        <v-row no-gutters class="text-h6">
          <v-col class="flex-grow-0">
            <v-icon title="Angle" size="24" style="width: 36px" icon="mdi-angle-acute" />
          </v-col>
          <v-col>
            <span style="line-height: 35px" v-text="isHovering ? 'Angle' : moonAltitude" />
          </v-col>
          <v-col class="text-right">
            <span style="line-height: 35px" v-text="isHovering ? 'Orientation' : moonAzimuth" />
          </v-col>
          <v-col class="flex-grow-0">
            <v-icon title="Angle" size="24" style="width: 36px" icon="mdi-compass" />
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

const moonPhaseIcon = computed(() => {
  return moonPhase.value ? (`/icons/moonPhases/${moonPhase.value}.svg`) : ''
})

const moonPhaseString = computed(() => moonPhase.value && t(`constants.MOON_PHASE.${moonPhase.value}`))
</script>
