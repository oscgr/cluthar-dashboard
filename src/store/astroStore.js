import {computed, ref, reactive} from "@vue/composition-api";

import SunCalc from 'suncalc'
import DayCycle from "@/enums/DayCycle";
import MoonPhase from "@/enums/MoonPhase";

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

  // SUN

  const sunTimes = computed(() => state.sunTimes)
  const sunPosition = computed(() => state.sunPosition)

  const moonTimes = computed(() => state.moonTimes)
  const moonPosition = computed(() => state.moonPosition)

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

  // MOON

  const moonPhase = computed(() => {
    const phase = state.moonIllumination.phase
    if (!phase) return null
    else if (phase < 1/16) return MoonPhase.NEW_MOON
    else if (phase < 3/16) return MoonPhase.WAXING_CRESCENT
    else if (phase < 5/16) return MoonPhase.FIRST_QUARTER
    else if (phase < 7/16) return MoonPhase.WAXING_GIBBOUS
    else if (phase < 9/16) return MoonPhase.FULL_MOON
    else if (phase < 11/16) return MoonPhase.WANING_GIBBOUS
    else if (phase < 13/16) return MoonPhase.LAST_QUARTER
    else if (phase < 15/16) return MoonPhase.WANING_CRESCENT
    else return MoonPhase.NEW_MOON
  })

  /* ==================== ACTIONS ==================== */

  const fetchAstro = (coordinates) => {
    const now = new Date();
    state.sunTimes = SunCalc.getTimes(now, coordinates.lat, coordinates.lng)
    state.moonTimes = SunCalc.getMoonTimes(now, coordinates.lat, coordinates.lng)
    state.sunPosition = SunCalc.getPosition(now, coordinates.lat, coordinates.lng)
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
    sunTimes,
    moonTimes,
    sunPosition,
    moonPosition,
    moonPhase,
  }
}
