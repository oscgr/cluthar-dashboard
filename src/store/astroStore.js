import {computed, reactive} from "@vue/composition-api";

import SunCalc from 'suncalc'

const state = reactive({
  sunTimes: {},
  sunPosition: {},
  moonTimes: {},
  moonPosition: {},
  moonIllumination: {}

})

export const DayPhase = {
  NIGHT: 'NI',
  NIGHT_START: 'NS',
  NIGHT_END: 'NE',
  DAWN: 'DN',
  SUNRISE: 'SR',
  ZENITH: 'Z',
  DAY: 'DY',
  GOLDEN_HOUR: 'GH',
  SUNSET: 'SS',
  DUSK: 'DU',
  NAUTICAL_DUSK: 'ND',
  NADIR: 'NA',
}

export default () => {

  const HALF_HOUR = 1800000

  const sunTimes = computed(() => state.sunTimes)

  const sunPhase = computed(() => {
    const now = Date.now()

    if (now < state.sunTimes.nightEnd.getTime()) return 'nuit'
    if (now < state.sunTimes.nightEnd.getTime()) return DayPhase.NIGHT
    if (now < state.sunTimes.nauticalDawn.getTime()) return 'fin de la nuit'
    if (now < state.sunTimes.nauticalDawn.getTime()) return DayPhase.NIGHT_END
    if (now < state.sunTimes.dawn.getTime()) return 'aube nautique'
    if (now < state.sunTimes.dawn.getTime()) return DayPhase.NAUTICAL_DUSK
    if (now < state.sunTimes.sunrise.getTime()) return 'aube'
    if (now < state.sunTimes.sunrise.getTime()) return DayPhase.DUSK
    if (now < state.sunTimes.sunriseEnd.getTime()) return 'lever du soleil'
    if (now < state.sunTimes.sunriseEnd.getTime()) return DayPhase.SUNRISE
    if (now < state.sunTimes.goldenHourEnd.getTime()) return 'heure dorée'
    if (now < state.sunTimes.goldenHourEnd.getTime()) return DayPhase.GOLDEN_HOUR

    if ((state.sunTimes.solarNoon.getTime() - HALF_HOUR < now) && (now  < state.sunTimes.solarNoon.getTime() + HALF_HOUR)) return 'Zénith'
    if ((state.sunTimes.solarNoon.getTime() - HALF_HOUR < now) && (now  < state.sunTimes.solarNoon.getTime() + HALF_HOUR)) return DayPhase.ZENITH

    if (now < state.sunTimes.goldenHour.getTime()) return 'jour'
    if (now < state.sunTimes.goldenHour.getTime()) return DayPhase.DAY
    if (now < state.sunTimes.sunsetStart.getTime()) return 'heure dorée'
    if (now < state.sunTimes.sunsetStart.getTime()) return DayPhase.GOLDEN_HOUR
    if (now < state.sunTimes.sunset.getTime()) return 'coucher du soleil'
    if (now < state.sunTimes.sunset.getTime()) return DayPhase.SUNSET
    if (now < state.sunTimes.dusk.getTime()) return 'crépuscule'
    if (now < state.sunTimes.dusk.getTime()) return DayPhase.DUSK
    if (now < state.sunTimes.nauticalDusk.getTime()) return 'crépuscule nautique'
    if (now < state.sunTimes.nauticalDusk.getTime()) return DayPhase.NAUTICAL_DUSK
    if (now < state.sunTimes.night.getTime()) return 'début de nuit'
    if (now < state.sunTimes.night.getTime()) return DayPhase.NIGHT_START

    if ((state.sunTimes.nadir.getTime() - HALF_HOUR < now) && (now < state.sunTimes.nadir.getTime() + HALF_HOUR)) return 'nadir'
    if ((state.sunTimes.nadir.getTime() - HALF_HOUR < now) && (now < state.sunTimes.nadir.getTime() + HALF_HOUR)) return DayPhase.NADIR

    return 'nuit'
  })

  /* ==================== ACTIONS ==================== */

  const fetchAstro = (coordinates) => {
    const now = new Date();
    state.sunTimes = SunCalc.getTimes(now, coordinates.lat, coordinates.lng)
    state.moonTimes = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.sunPosition = SunCalc.getPosition(now, coordinates.lat, coordinates.lng)
    state.moonPosition = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.moonPosition = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.moonIllumination = SunCalc.getMoonIllumination(now)
  }
  return {
    fetchAstro,
    sunPhase,
    sunTimes
  }
}
