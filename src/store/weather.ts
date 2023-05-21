import { reactive, toRefs } from 'vue'
import axios from 'axios'
import type { Forecast } from 'owm-onecall-api'
import useAstro from '@/store/astro'
import usePlace from '@/store/place'
import Global from '@/utils/global'

const state = reactive({
  loading: false,
  payload: {} as Partial<Forecast>,
})

function useWeather() {
  const { isDay } = useAstro()
  const { place } = usePlace()

  const fetchWeather = async () => {
    if (!import.meta.env.VITE_OPEN_WEATHER_API_KEY)
      return
    state.loading = true

    try {
      const { data } = await axios.get<Forecast>('https://api.openweathermap.org/data/2.5/onecall', {
        timeout: 60000,
        params: {
          lang: 'fr',
          lat: place.value?.latitude,
          lon: place.value?.longitude,
          units: 'metric',
          appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
        },
        // headers: {
        //   'Cache-Control': 'no-cache',
        // },
      })
      state.payload = data
    }
    catch (e) {
      if (import.meta.env.DEV) // when coding without internet
        state.payload = JSON.parse(import.meta.env.VITE_FAKE_OPEN_WEATHER)
    }
    finally {
      state.loading = false
    }
  }

  const weatherIcon = (id?: number, ignoreDay = false) => {
    if (!id)
      return undefined

    return Global.getWeatherIcon(id, ignoreDay ? undefined : isDay.value)
  }

  /* ==================== ACTIONS ==================== */

  return {
    ...toRefs(state),
    fetchWeather,
    weatherIcon,
  }
}

export default useWeather
