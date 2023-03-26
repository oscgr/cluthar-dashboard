import { computed, reactive, toRefs } from 'vue'

import SunCalc from 'suncalc'
import { DateTime } from 'luxon'
import { round } from 'lodash'
import DayPhase from '@/enums/DayPhase'
import MoonPhase from '@/enums/MoonPhase'
import usePlace from '@/store/place'

const state = reactive({
  sunTimes: null as SunCalc.GetTimesResult | null,
  sunPosition: null as SunCalc.GetSunPositionResult | null,
  moonTimes: null as SunCalc.GetMoonTimes | null,
  moonPosition: null as SunCalc.GetSunPositionResult | null,
  moonIllumination: null as SunCalc.GetMoonIlluminationResult | null,
})

const useAstro = () => {
  const { place } = usePlace()

  const HALF_HOUR = 1800000

  // SUN

  const sunPhase = computed<DayPhase | undefined>(() => {
    if (!state.sunTimes)
      return
    const now = DateTime.now().toMillis()
    if (now < state.sunTimes.nightEnd.getTime())
      return DayPhase.NIGHT
    if (now < state.sunTimes.nauticalDawn.getTime())
      return DayPhase.NIGHT_END
    if (now < state.sunTimes.dawn.getTime())
      return DayPhase.NAUTICAL_DUSK
    if (now < state.sunTimes.sunrise.getTime())
      return DayPhase.DUSK
    if (now < state.sunTimes.sunriseEnd.getTime())
      return DayPhase.SUNRISE
    if (now < state.sunTimes.goldenHourEnd.getTime())
      return DayPhase.SUNRISE_GOLDEN_HOUR

    if ((state.sunTimes.solarNoon.getTime() - HALF_HOUR < now) && (now < state.sunTimes.solarNoon.getTime() + HALF_HOUR))
      return DayPhase.ZENITH

    if (now < state.sunTimes.goldenHour.getTime())
      return DayPhase.DAY
    if (now < state.sunTimes.sunsetStart.getTime())
      return DayPhase.SUNSET_GOLDEN_HOUR
    if (now < state.sunTimes.sunset.getTime())
      return DayPhase.SUNSET
    if (now < state.sunTimes.dusk.getTime())
      return DayPhase.DUSK
    if (now < state.sunTimes.nauticalDusk.getTime())
      return DayPhase.NAUTICAL_DUSK
    if (now < state.sunTimes.night.getTime())
      return DayPhase.NIGHT_START

    if ((state.sunTimes.nadir.getTime() - HALF_HOUR < now) && (now < state.sunTimes.nadir.getTime() + HALF_HOUR))
      return DayPhase.NADIR

    return DayPhase.NIGHT
  })

  const isDay = computed(() => {
    if (!sunPhase.value)
      return

    return [DayPhase.DAY, DayPhase.ZENITH, DayPhase.SUNRISE_GOLDEN_HOUR, DayPhase.SUNRISE, DayPhase.SUNSET_GOLDEN_HOUR, DayPhase.SUNSET].includes(sunPhase.value)
  })

  // MOON

  const moonPhase = computed<MoonPhase | undefined>(() => {
    if (!state.moonIllumination?.phase)
      return
    const phase = round(state.moonIllumination?.phase * 27)
    if (phase < 1)
      return MoonPhase.NEW_MOON
    else if (phase < 7)
      return MoonPhase.WAXING_CRESCENT
    else if (phase < 8)
      return MoonPhase.FIRST_QUARTER
    else if (phase < 14)
      return MoonPhase.WAXING_GIBBOUS
    else if (phase < 15)
      return MoonPhase.FULL_MOON
    else if (phase < 21)
      return MoonPhase.WANING_GIBBOUS
    else if (phase < 22)
      return MoonPhase.LAST_QUARTER
    else if (phase < 28)
      return MoonPhase.WANING_CRESCENT
    else return MoonPhase.NEW_MOON
  })

  const moonIcon = computed(() => `wi:wi-moon-${round(state.moonIllumination?.phase * 27)}`)

  /* ==================== ACTIONS ==================== */

  const fetchAstro = () => {
    if (!place.value?.latitude || !place.value?.longitude)
      return
    const now = new Date()
    state.sunTimes = SunCalc.getTimes(now, place.value.latitude, place.value.longitude)
    state.moonTimes = SunCalc.getMoonTimes(now, place.value.latitude, place.value.longitude)
    state.sunPosition = SunCalc.getPosition(now, place.value.latitude, place.value.longitude)
    state.moonPosition = SunCalc.getMoonPosition(now, place.value.latitude, place.value.longitude)
    state.moonIllumination = SunCalc.getMoonIllumination(now)
  }

  return {
    ...toRefs(state),
    moonIcon,
    fetchAstro,
    sunPhase,
    isDay,
    moonPhase,
  }
}

export default useAstro
