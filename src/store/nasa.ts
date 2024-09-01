import { computed, reactive, toRefs } from 'vue'
import useAxiosInstance from '@/store/axiosInstance'
import type { CardType } from '@/store/layout'
import useLayout from '@/store/layout'
import useErrorHandler from '@/utils/errorHandler'

export interface NasaAPIResponse {
  copyright: string
  explanation: string
  hdurl: string
  title: string
  url: string
}
const state = reactive({
  loading: false,
  payload: {} as Partial<NasaAPIResponse>,
  error: false as boolean | string,
})

function useNasa() {
  const { layout } = useLayout()
  const { handleErrorTranslation } = useErrorHandler()
  const { local } = useAxiosInstance()
  const nasaInfoIsRequired = computed(() => layout.value.some(c => (['NASA_POTD'] satisfies CardType[]).includes(c.cardType)))

  const fetchPotd = async () => {
    if (!nasaInfoIsRequired.value)
      return
    state.loading = true
    state.error = false

    try {
      const { data } = await local.get<NasaAPIResponse>('/api/secure/nasa')
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
  /* ==================== ACTIONS ==================== */

  return {
    ...toRefs(state),
    fetchPotd,
    nasaInfoIsRequired,
  }
}

export default useNasa
