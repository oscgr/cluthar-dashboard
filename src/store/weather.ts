import { reactive, toRefs } from 'vue'
import axios from 'axios'
import type { Forecast } from 'owm-onecall-api'
import { useLocalStorage } from '@vueuse/core'
import useAstro from '@/store/astro'
import usePlace from '@/store/place'
import Global from '@/utils/global'

const token = useLocalStorage<string | null>('open-wi-map-token', null)
const state = reactive({
  loading: false,
  payload: {} as Partial<Forecast>,
})

function useWeather() {
  const { isDay } = useAstro()
  const { place } = usePlace()

  const fetchWeather = async () => {
    if (!token.value)
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
          appid: token.value,
        },
        // headers: {
        //   'Cache-Control': 'no-cache',
        // },
      })
      state.payload = data
    }
    catch (e) {
      if (import.meta.env.DEV) // when coding without internet
        state.payload = JSON.parse(import.meta.env.VITE_FAKE_WEATHER)
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
    token,
    fetchWeather,
    weatherIcon,
  }
}

export default useWeather
