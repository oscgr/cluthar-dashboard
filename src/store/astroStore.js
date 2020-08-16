import { reactive} from "@vue/composition-api";

import SunCalc from 'suncalc'

const state = reactive({
  sunTimes: {},
  sunPosition: {},
  moonTimes: {},
  moonPosition: {},
  moonIllumination: {}

})

export default () => {

  /* ==================== GETTERS ==================== */
  //
  // const temperature = computed(() => {
  //   return `${state.data.main.hasOwnProperty('temp') ? state.data.main.temp : '? '}°C`
  // })
  // const weatherDescription = computed(() => {
  //   return state.data.weather[0].description
  // })
  // const weatherIcon = computed(() => {
  //   return state.data.weather[0].icon
  // })
  // const clouds = computed(() => {
  //   return state.data.clouds.hasOwnProperty('all') ? `${state.data.clouds.all}%` : '? %'
  // })
  // const wind = computed(() => {
  //   return (state.data.wind.hasOwnProperty('speed') ? Math.round(state.data.wind.speed * 3.6) : '?') + ' km/h'
  // })
  // const pressure = computed(() => {
  //   return (state.data.main.hasOwnProperty('pressure') ? state.data.main.pressure : '?') + ' hPa'
  // })
  // const humidity = computed(() => {
  //   return (state.data.main.hasOwnProperty('humidity') ? state.data.main.humidity : '? ') + '%'
  // })
  //
  // // const Sys = computed(() => {
  // //   return state.data.sys
  // // })
  // // const PlaceName = computed(() => {
  // //   return state.data.name
  // // })
  // // const Main = computed(() => {
  // //   return state.data.main
  // // })
  // // const Timezone = computed(() => {
  // //   return state.data.hasOwnProperty('timezone') ? (state.data.timezone / 60) : null
  // // })
  //
  // const cumulation = (type, duration) => {
  //   return (state.data[type]?.hasOwnProperty(duration) ? state[type][duration] : '?') + ` mm (${duration})`
  // }
  // const hasType = (type) => {
  //   return state.data.hasOwnProperty(type)
  // }

  /* ==================== ACTIONS ==================== */

  const fetchAstro = (coordinates) => {
    const now = new Date();
    state.sunTimes = SunCalc.getTimes(now, coordinates.lat, coordinates.lng)
    state.moonTimes = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.sunPosition = SunCalc.getPosition(now, coordinates.lat, coordinates.lng)
    state.moonPosition = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.moonPosition = SunCalc.getMoonPosition(now, coordinates.lat, coordinates.lng)
    state.moonIllumination = SunCalc.getMoonIllumination(now)
    console.log(state)
  }
  return {
    // temperature,
    // weatherDescription,
    // weatherIcon,
    // clouds,
    // wind,
    // pressure,
    // humidity,
    // hasType,
    // cumulation,

    fetchAstro
  }
}
