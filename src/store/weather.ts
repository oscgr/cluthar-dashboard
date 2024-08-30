import { reactive, toRefs } from 'vue'
import type { Forecast } from 'owm-onecall-api'
import useAstro from '@/store/astro'
import usePlace from '@/store/place'
import Global from '@/utils/global'
import useAxiosInstance from '@/store/axiosInstance'

const state = reactive({
  loading: false,
  payload: {} as Partial<Forecast>,
})

function useWeather() {
  const { isDay } = useAstro()
  const { place } = usePlace()
  const { local } = useAxiosInstance()

  const fetchWeather = async () => {
    state.loading = true

    try {
      const { data } = await local.get<Forecast>('/api/secure/weather', {
        params: {
          lat: place.value?.latitude,
          lon: place.value?.longitude,
        },
      })
      state.payload = data
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
