<template>
  <v-card
    width="100%"
    height="100%"
    dark
    flat
    :color="$vuetify.theme.dark ? '#0f4c75' : '#596e79'"
  >
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="6">
          <div title="température" class="display-1" v-text="moonPhaseString" />
        </v-col>
        <v-col cols="6" class="text-right">
          <img class="ma-2" height="56px" alt="phase lunaire" :src="moonPhaseIcon" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="lever du lune" class="info-icon" v-text="mdiWeatherSunsetUp" />
          <span v-text="rise" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="riseFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de lune" class="info-icon" v-text="mdiWeatherSunsetDown" />
          <span v-text="set" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="setFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de lune" class="info-icon" v-text="mdiAngleAcute" />
          <span v-text="moonAltitude" />
        </v-col>
        <v-col cols="6" class="text-right text-capitalize">
          <v-icon title="coucher de lune" class="info-icon" v-text="mdiCompass" />
          <span v-text="moonAzimuth" />
        </v-col>
      </v-row>


    </v-card-text>
  </v-card>
</template>
<script>

import moment from "moment";
import astroStore from "@/store/astroStore";
import {computed, getCurrentInstance} from "@vue/composition-api";
import {mdiWeatherSunsetUp, mdiWeatherSunsetDown, mdiCompass, mdiAngleAcute} from '@mdi/js'
import Global from '@/utils/global'
import timeStore from "@/store/timeStore";

export default {
  name: 'MoonCard',
  setup() {

    const vm = getCurrentInstance().proxy

    const {noData, moonPhase, moonTimes, moonPosition} = astroStore()

    const {fromNow} = timeStore()

    const riseMoment = computed(() => moment(moonTimes.value.rise))

    const setMoment = computed(() => moment(moonTimes.value.set))

    const rise = computed(() => noData.value ? '' : riseMoment.value.format('LT'))

    const riseFromNow = computed(() => noData.value ? '' : fromNow(riseMoment.value))

    const set = computed(() => noData.value ? '' : setMoment.value.format('LT'))

    const setFromNow = computed(() => noData.value ? '' : fromNow(setMoment.value))

    const moonAzimuth = computed(() => noData.value ? '?' : vm.$t(`constants.COMPASS_POINT.${Global.getCompassPoint(moonPosition.value.azimuth)}`))

    const moonAltitude = computed(() => noData.value ? '?' : `${Global.getDegreesFromRadian(moonPosition.value.altitude)}°`)

    const moonPhaseIcon = computed(() =>noData.value ? '' : require(`@/assets/icons/moonPhases/${moonPhase.value}.svg`))

    const moonPhaseString = computed(() => noData.value ? '' : vm.$t(`constants.MOON_PHASE.${moonPhase.value}`))

    return {
      rise,
      set,
      riseFromNow,
      setFromNow,
      moonPhaseIcon,
      moonPhaseString,
      moonAzimuth,
      moonAltitude,
      // icons
      mdiWeatherSunsetUp, mdiWeatherSunsetDown, mdiCompass, mdiAngleAcute
    }
  }
}
</script>
