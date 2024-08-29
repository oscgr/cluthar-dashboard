import { reactive, toRefs } from 'vue'
import usePlace from '@/store/place'
import useAxiosInstance from '@/store/axiosInstance'

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
  loading: false,
  payload: {} as Partial<Pollution>,
})

function usePollution() {
  const { place } = usePlace()
  const { local } = useAxiosInstance()

  const fetchPollution = async () => {
    state.loading = true

    try {
      const { data } = await local.get<Pollution>('/api/pollution', {
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
  }
}

export default usePollution
