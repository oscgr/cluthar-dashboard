import {computed, ref, reactive} from "@vue/composition-api";

const loading = ref(false)

const state = reactive({
  data: {
    weather: [{}],
    main: {},
    clouds: {},
    wind: {},
    sys: {},
    name: null,
    timezone: null
  }
})

export default () => {

  /* ==================== GETTERS ==================== */

  const placeName = computed(() => state.data.name ? state.data.name : '?')

  const placeCountry = computed(() => state.data.sys.country ? state.data.sys.country : '?')

  const timezone = computed(() => {
    return state.data.timezone ? `GMT${state.data.timezone > 0 ? '+' : '-'}${Math.abs(state.data.timezone / 3600)}` : '?'
  })

  const temperature = computed(() => {
    return `${state.data.main.hasOwnProperty('temp') ? Math.round(state.data.main.temp) : '? '}°C`
  })

  const feelsLike = computed(() => {
    return `${state.data.main.hasOwnProperty('feels_like') ? Math.round(state.data.main.feels_like) : '? '}°C`
  })
  const weatherDescription = computed(() => {
    return state.data.weather[0].description
  })
  const weatherIcon = computed(() => {
    return state.data.weather[0].icon
  })
  const clouds = computed(() => {
    return state.data.clouds.hasOwnProperty('all') ? `${state.data.clouds.all}%` : '? %'
  })
  const wind = computed(() => {
    return (state.data.wind.hasOwnProperty('speed') ? Math.round(state.data.wind.speed * 3.6) : '?') + ' km/h'
  })
  const pressure = computed(() => {
    return (state.data.main.hasOwnProperty('pressure') ? state.data.main.pressure : '?') + ' hPa'
  })
  const humidity = computed(() => {
    return (state.data.main.hasOwnProperty('humidity') ? state.data.main.humidity : '? ') + '%'
  })

  // const Sys = computed(() => {
  //   return state.data.sys
  // })
  // const PlaceName = computed(() => {
  //   return state.data.name
  // })
  // const Main = computed(() => {
  //   return state.data.main
  // })
  // const Timezone = computed(() => {
  //   return state.data.hasOwnProperty('timezone') ? (state.data.timezone / 60) : null
  // })

  const cumulation = (type, duration) => {
    return ((hasType(type) && state.data[type][duration]) ? state.data[type][duration] : '?') + ` mm (${duration})`
  }
  const hasType = (type) => {
    return state.data.hasOwnProperty(type)
  }

  /* ==================== ACTIONS ==================== */

  const fetchWeather = (coordinates) => {
    loading.value = true
      fetch(`https://api.openweathermap.org/data/2.5/weather?lang=fr&lat=${coordinates.lat}&lon=${coordinates.lng}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_API_KEY}`)
        .then(r => r.json())
        .then(r => {
          state.data = r
          loading.value = false
          console.debug('[WEATHER] fetched weather')
          return r
        })
  }
  return {
    loading,
    placeName,
    placeCountry,
    timezone,
    temperature,
    feelsLike,
    weatherDescription,
    weatherIcon,
    clouds,
    wind,
    pressure,
    humidity,
    hasType,
    cumulation,
    //
    // Sys,
    // PlaceName,
    // Main,
    // Timezone,
    fetchWeather
  }
}
