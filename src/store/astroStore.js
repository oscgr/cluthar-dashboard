import {computed, ref, reactive} from "@vue/composition-api";

import SunCalc from 'suncalc'
import DayCycle from "@/enums/DayCycle";

const noData = ref(true)

const state = reactive({
  sunTimes: {},
  sunPosition: {},
  moonTimes: {},
  moonPosition: {},
  moonIllumination: {}

})

export default () => {

  const HALF_HOUR = 1800000

  const sunTimes = computed(() => state.sunTimes)

  const sunPhase = computed(() => {

    if (noData.value) return ''

    const now = Date.now()

    if (now < state.sunTimes.nightEnd.getTime()) return DayCycle.NIGHT
    if (now < state.sunTimes.nauticalDawn.getTime()) return DayCycle.NIGHT_END
    if (now < state.sunTimes.dawn.getTime()) return DayCycle.NAUTICAL_DUSK
    if (now < state.sunTimes.sunrise.getTime()) return DayCycle.DUSK
    if (now < state.sunTimes.sunriseEnd.getTime()) return DayCycle.SUNRISE
    if (now < state.sunTimes.goldenHourEnd.getTime()) return DayCycle.SUNRISE_GOLDEN_HOUR

    if ((state.sunTimes.solarNoon.getTime() - HALF_HOUR < now) && (now  < state.sunTimes.solarNoon.getTime() + HALF_HOUR)) return DayCycle.ZENITH

    if (now < state.sunTimes.goldenHour.getTime()) return DayCycle.DAY
    if (now < state.sunTimes.sunsetStart.getTime()) return DayCycle.SUNSET_GOLDEN_HOUR
    if (now < state.sunTimes.sunset.getTime()) return DayCycle.SUNSET
    if (now < state.sunTimes.dusk.getTime()) return DayCycle.DUSK
    if (now < state.sunTimes.nauticalDusk.getTime()) return DayCycle.NAUTICAL_DUSK
    if (now < state.sunTimes.night.getTime()) return DayCycle.NIGHT_START

    if ((state.sunTimes.nadir.getTime() - HALF_HOUR < now) && (now < state.sunTimes.nadir.getTime() + HALF_HOUR)) return DayCycle.NADIR

    return DayCycle.NIGHT
  })

  const isDay = computed(() => [DayCycle.DAY, DayCycle.ZENITH, DayCycle.SUNRISE_GOLDEN_HOUR, DayCycle.SUNRISE, DayCycle.SUNSET_GOLDEN_HOUR, DayCycle.SUNSET].includes(sunPhase.value))

  /* ==================== ACTIONS ==================== */

  const fetchAstro = (coordinates) => {
    const now = new Date();
    state.sunTimes = SunCalc.getTimes(now, coordinates.lat, coordinates.lng)
    state.moonTimes = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.sunPosition = SunCalc.getPosition(now, coordinates.lat, coordinates.lng)
    state.moonPosition = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.moonPosition = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.moonIllumination = SunCalc.getMoonIllumination(now)
    noData.value = false
    console.debug('[ASTRO] fetched data')
  }
  return {
    fetchAstro,
    noData,
    sunPhase,
    isDay,
    sunTimes
  }
}
