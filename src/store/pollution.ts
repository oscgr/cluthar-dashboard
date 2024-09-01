import { computed, reactive, toRefs } from 'vue'
import usePlace from '@/store/place'
import useAxiosInstance from '@/store/axiosInstance'
import type { CardType } from '@/store/layout'
import useLayout from '@/store/layout'
import useErrorHandler from '@/utils/errorHandler'

export interface Pollution {
  current: {
    european_aqi: number
  }
  hourly: {
    time: string[]
    european_aqi: number[]
  }
}

const state = reactive({
  loading: false as boolean | string,
  payload: {} as Partial<Pollution>,
  error: false as boolean | string,
})

function usePollution() {
  const { place } = usePlace()
  const { layout } = useLayout()
  const { local } = useAxiosInstance()
  const { handleErrorTranslation } = useErrorHandler()
  const pollutionInfoIsRequired = computed(() => layout.value.some(c => (['POLLUTION'] satisfies CardType[]).includes(c.cardType)))

  const fetchPollution = async () => {
    if (!pollutionInfoIsRequired.value)
      return
    if (!place.value?.latitude || !place.value?.longitude) {
      state.error = 'Veuillez renseigner une localisation'
      return
    }
    state.loading = true
    state.error = false

    try {
      const { data } = await local.get<Pollution>('/api/secure/pollution', {
        params: {
          lat: place.value?.latitude,
          lon: place.value?.longitude,
        },
      })
      state.payload = data
    }
    catch (e) {
      state.payload = {}
      state.error = handleErrorTranslation(e)
    }
    finally {
      state.loading = false
    }
  }

  const getAirQualityColor = (quality: number) => {
    switch (true) {
      case quality > 100:
        return '#7d2181'
      case quality > 80:
        return '#960032'
      case quality > 60:
        return '#ff5050'
      case quality > 40:
        return '#f0e641'
      case quality > 20:
        return '#50ccaa'
      default:
        return '#50f0e6'
    }
  }

  const getAirQualityText = (quality: number) => {
    switch (true) {
      case quality > 100:
        return 'Extrêmement mauvaise'
      case quality > 80:
        return 'Mauvaise'
      case quality > 60:
        return 'Moyenne'
      case quality > 40:
        return 'Dégradée'
      case quality > 20:
        return 'Bonne'
      default:
        return 'Très bonne'
    }
  }

  /* ==================== ACTIONS ==================== */

  return {
    ...toRefs(state),
    fetchPollution,
    getAirQualityColor,
    getAirQualityText,
    pollutionInfoIsRequired,
  }
}

export default usePollution
