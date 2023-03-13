import { reactive, toRefs } from 'vue'
import axios from 'axios'
import astroStore from '@/store/astroStore'
import placeStore from '@/store/placeStore'

const state = reactive({
  loading: false,
  noData: false,
  payload: {
    current: {
      weather: [{}],
    },
    daily: [],
    hourly: [],
    minutely: [],
    alerts: [],
  },
})

export default () => {
  const { isDay } = astroStore()
  const { place } = placeStore()

  const fetchWeather = async () => {
    if (place.value.longitude) {
      state.loading = true
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lang=fr&lat=${place.value.latitude}&lon=${place.value.longitude}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`)
      state.payload = data
      state.loading = false
      state.noData = !data
    }
    else {
      state.noData = true
    }
  }

  const weatherIcon = (id, clouds = 0) => {
    if (!id)
      return null

    // https://openweathermap.org/weather-conditions

    if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232))
      return '/icons/weather/200-202_230-232.svg'
    else if (id >= 210 && id <= 221)
      return '/icons/weather/210-221.svg'

    else if (clouds > 50 && (id >= 300 && id <= 531))
      return '/icons/weather/300-500-cloud.svg'
    else if (isDay.value && (clouds < 50) && (id >= 300 && id <= 531))
      return '/icons/weather/300-500-light-cloud-day.svg'
    else if ((clouds < 50) && (id >= 300 && id <= 531))
      return '/icons/weather/300-500-light-cloud-night.svg'

    else if (id <= 600 && id <= 622)
      return '/icons/weather/600.svg'
    else if (id >= 701 && id <= 771)
      return '/icons/weather/701-771.svg'
    else if (id === 781)
      return '/icons/weather/781.svg'

    else if (isDay.value && id === 800)
      return '/icons/weather/800-day.svg'
    else if (id === 800)
      return '/icons/weather/800-night.svg'

    else if (isDay.value && id === 801)
      return '/icons/weather/801-day.svg'
    else if (id === 801)
      return '/icons/weather/801-night.svg'

    else if (isDay.value && id === 802)
      return '/icons/weather/802-day.svg'
    else if (id === 802)
      return '/icons/weather/802-night.svg'

    else if (id >= 803 && id <= 804)
      return '/icons/weather/803-804.svg'

    else return null
  }

  /* ==================== ACTIONS ==================== */

  return {
    ...toRefs(state),
    fetchWeather,
    weatherIcon,
  }
}
