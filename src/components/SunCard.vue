<template>
  <v-card width="100%" flat :color="$vuetify.theme.dark ? '#801336' : '#dfd3c3'">
    <v-card-text>
      <v-row no-gutters class="display-2 pb-4">
        <v-col cols="9">
          <span v-text="'Soleil'" />
        </v-col>
        <v-col cols="3" class="text-right">
          <v-icon size="50" v-text="`mdi mdi-${sunIcon}`" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="lever du soleil" class="info-icon">mdi mdi-weather-sunset-up</v-icon>
          <span v-text="sunrise" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="sunriseFromNow" />
        </v-col>
      </v-row>

      <v-row no-gutters class="text-h6">
        <v-col cols="6">
          <v-icon title="lever du soleil" class="info-icon">mdi mdi-weather-sunset-down</v-icon>
          <span v-text="sunset" />
        </v-col>
        <v-col cols="6" class="text-right">
          <span v-text="sunsetFromNow" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6 pt-4">
        <v-col cols="6">
          <v-icon title="durée de la journée" class="info-icon">mdi mdi-timer-outline</v-icon>
          <span v-text="duration" />
        </v-col>
        <v-col cols="6" class="text-right">
          <v-icon title="moment de la journée" class="info-icon">mdi mdi-theme-light-dark</v-icon>
          <span v-text="sunPhaseString" />
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

export default {
  name: 'SunCard',
  setup() {
    const vm = getCurrentInstance()

    const {sunTimes, sunPhase} = astroStore()

    const sunriseMoment = computed(() => moment(sunTimes.value.sunrise))

    const sunsetMoment = computed(() => moment(sunTimes.value.sunset))

    const sunrise = computed(() => sunriseMoment.value.format('LT'))

    const sunriseFromNow = computed(() => sunriseMoment.value.fromNow())

    const sunset = computed(() => sunsetMoment.value.format('LT'))

    const sunsetFromNow = computed(() => sunsetMoment.value.fromNow())

    const duration = computed(() => sunriseMoment.value.to(sunsetMoment.value, true))

    const sunPhaseString = computed(() => vm.$t(`constants.DAY_CYCLE.${sunPhase.value}`))

    const sunIcon = computed(() => {
      switch (sunPhase.value) {
        case DayCycle.DAY:
        case DayCycle.ZENITH:
          return 'weather-sunny'
        case DayCycle.NIGHT:
        case DayCycle.NIGHT_START:
        case DayCycle.NIGHT_END:
        case DayCycle.NAUTICAL_DAWN:
        case DayCycle.NAUTICAL_DUSK:
        case DayCycle.DAWN:
        case DayCycle.DUSK:
        case DayCycle.NADIR:
          return 'weather-night'
        case DayCycle.SUNRISE:
        case DayCycle.SUNRISE_GOLDEN_HOUR:
          return 'weather-sunset-up'
        case DayCycle.SUNSET:
        case DayCycle.SUNSET_GOLDEN_HOUR:
          return 'weather-sunset-down'
        default:
          return ''
      }
    })

    return {sunrise,sunriseFromNow, sunIcon, sunset, sunsetFromNow, sunPhaseString, duration}
  }
}
</script>
