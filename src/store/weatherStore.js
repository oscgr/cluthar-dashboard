import {computed, ref, reactive} from "@vue/composition-api";
import astroStore from "@/store/astroStore";

const loading = ref(false)

const noData = ref(true)

const state = reactive({
  data: {
    weather: [{}],
    main: {},
    clouds: {},
    wind: {},
    sys: {},
  }
})

export default () => {

  const {isDay} = astroStore()

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

    if (noData.value) return null

    // https://openweathermap.org/weather-conditions

    const id = state.data.weather[0].id;

    if ((200 <= id && id <= 202) || (230 <= id && id <= 232)) return require('@/assets/icons/weather/200-202_230-232.svg')
    else if (210 <= id && id <= 221) return require('@/assets/icons/weather/210-221.svg')

    else if (state.data.clouds.all > 50 && (300 <= id && id <= 500)) return require('@/assets/icons/weather/300-500-cloud.svg')
    else if (isDay.value && (state.data.clouds.all < 50) && (300 <= id && id <= 500)) return require('@/assets/icons/weather/300-500-light-cloud-day.svg')
    else if ((state.data.clouds.all < 50) && (300 <= id && id <= 500)) return require('@/assets/icons/weather/300-500-light-cloud-night.svg')

    else if (id === 600) return require('@/assets/icons/weather/600.svg')
    else if (701 <= id && id <= 771) return require('@/assets/icons/weather/701-771.svg')
    else if (id === 781) return require('@/assets/icons/weather/781.svg')

    else if (isDay.value && id === 800) return require('@/assets/icons/weather/800-day.svg')
    else if (id === 800) return require('@/assets/icons/weather/800-night.svg')

    else if (isDay.value && id === 801) return require('@/assets/icons/weather/801-day.svg')
    else if (id === 801) return require('@/assets/icons/weather/801-night.svg')

    else if (isDay.value && id === 802) return require('@/assets/icons/weather/802-day.svg')
    else if (id === 802) return require('@/assets/icons/weather/802-night.svg')

    else if (803 <= id && id <= 804) return require('@/assets/icons/weather/803-804.svg')

    else return null
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
          noData.value = false
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
    fetchWeather
  }
}
