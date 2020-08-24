<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :color="$vuetify.theme.dark ? '#801336' : '#dfd3c3'"
  >
    <v-card-text>
      <v-row no-gutters class="display-3 pb-4">
        <v-col cols="12">
          <span v-text="sunPhaseString" />
        </v-col>
<!--        <v-col cols="3" class="text-right">-->
<!--        </v-col>-->
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="lever du soleil" class="info-icon" v-text="mdiWeatherSunsetUp" />
          <span v-text="sunrise" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="sunriseFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="coucher de soleil" class="info-icon" v-text="mdiWeatherSunsetDown" />
          <span v-text="sunset" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="sunsetFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="durée de la journée" class="info-icon" v-text="mdiTimerOutline" />
          <span v-text="duration" />
        </v-col>
        <v-col cols="6" class="text-right">
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>

import moment from "moment";
import astroStore from "@/store/astroStore";
import {computed, getCurrentInstance} from "@vue/composition-api";
import DayCycle from "@/enums/DayCycle";

import {
  mdiTimerOutline,
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiWeatherSunsetDown,
  mdiWeatherSunsetUp
} from '@mdi/js'

export default {
  name: 'DayCard',
  setup() {
    const vm = getCurrentInstance()

    const {noData, sunTimes, sunPhase} = astroStore()

    const sunriseMoment = computed(() => moment(sunTimes.value.sunrise))

    const sunsetMoment = computed(() => moment(sunTimes.value.sunset))

    const sunrise = computed(() => noData.value ? '' : sunriseMoment.value.format('LT'))

    const sunriseFromNow = computed(() => noData.value ? '' : sunriseMoment.value.fromNow())

    const sunset = computed(() => noData.value ? '' : sunsetMoment.value.format('LT'))

    const sunsetFromNow = computed(() => noData.value ? '' : sunsetMoment.value.fromNow())

    const duration = computed(() => noData.value ? '' : sunriseMoment.value.to(sunsetMoment.value, true))

    const sunPhaseString = computed(() => noData.value ? '' : vm.$t(`constants.DAY_CYCLE.${sunPhase.value}`))

    const sunIcon = computed(() => {
      switch (sunPhase.value) {
        case DayCycle.DAY:
        case DayCycle.ZENITH:
          return mdiWeatherSunny
        case DayCycle.NIGHT:
        case DayCycle.NIGHT_START:
        case DayCycle.NIGHT_END:
        case DayCycle.NAUTICAL_DAWN:
        case DayCycle.NAUTICAL_DUSK:
        case DayCycle.DAWN:
        case DayCycle.DUSK:
        case DayCycle.NADIR:
          return mdiWeatherNight
        case DayCycle.SUNRISE:
        case DayCycle.SUNRISE_GOLDEN_HOUR:
          return mdiWeatherSunsetUp
        case DayCycle.SUNSET:
        case DayCycle.SUNSET_GOLDEN_HOUR:
          return mdiWeatherSunsetDown
        default:
          return ''
      }
    })

    return {
      sunrise, sunriseFromNow, sunIcon, sunset, sunsetFromNow, sunPhaseString, duration,
      mdiWeatherSunsetUp, mdiWeatherSunsetDown, mdiTimerOutline
    }
  }
}
</script>
