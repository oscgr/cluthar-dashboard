import { computed, reactive, toRefs } from 'vue'
import type { Forecast } from 'owm-onecall-api'
import type { FastifyError } from 'fastify'
import useAstro from '@/store/astro'
import usePlace from '@/store/place'
import Global from '@/utils/global'
import useAxiosInstance from '@/store/axiosInstance'
import type { CardType } from '@/store/layout'
import useLayout from '@/store/layout'
import useErrorHandler from '@/utils/errorHandler'

const state = reactive({
  loading: false,
  error: false as boolean | string,
  payload: {} as Partial<Forecast>,
})

function useWeather() {
  const { isDay } = useAstro()
  const { place } = usePlace()
  const { layout } = useLayout()
  const { local } = useAxiosInstance()
  const { handleErrorTranslation } = useErrorHandler()

  const weatherInfoIsRequired = computed(() => layout.value.some(c => (['WEATHER_ALERTS', 'WEATHER_TODAY', 'WEATHER_NEXT_6D', 'RAIN_NEXT_24H', 'RAIN_NEXT_HOUR', 'TEMP_NEXT_24H'] satisfies CardType[]).includes(c.cardType)))

  const fetchWeather = async () => {
    if (!weatherInfoIsRequired.value)
      return
    if (!place.value?.latitude || !place.value?.longitude) {
      state.error = 'Veuillez renseigner une localisation'
      return
    }
    state.loading = true
    state.error = false
    try {
      const r = await local.get<Forecast>('/api/secure/weather', {
        params: {
          lat: place.value.latitude,
          lon: place.value.longitude,
        },
      })
      state.payload = r.data
    }
    catch (e) {
      state.payload = {}
      state.error = handleErrorTranslation(e as FastifyError)
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
    weatherInfoIsRequired,
  }
}

export default useWeather
