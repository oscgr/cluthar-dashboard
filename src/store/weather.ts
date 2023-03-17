import { reactive, toRefs } from 'vue'
import axios from 'axios'
import type { Forecast } from 'owm-onecall-api'
import { useLocalStorage } from '@vueuse/core'
import useAstro from '@/store/astro'
import usePlace from '@/store/place'

const token = useLocalStorage<string | null>('open-weather-map-token', null)
const state = reactive({
  loading: false,
  payload: {} as Partial<Forecast>,
})

const useWeather = () => {
  const { isDay } = useAstro()
  const { place, noData } = usePlace()

  const fetchWeather = async () => {
    if (noData.value || !token.value)
      return
    state.loading = true
    // @ts-expect-error noData already make this null safe
    const { data } = await axios.get<Forecast>(`https://api.openweathermap.org/data/2.5/onecall?lang=fr&lat=${place.value.latitude}&lon=${place.value.longitude}&units=metric&appid=${token.value}`)
    state.payload = data
    state.loading = false
  }

  const weatherIcon = (id?: number, clouds = 0, ignoreDay = false) => {
    if (!id)
      return null

    // https://openweathermap.org/weather-conditions

    if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232))
      return '/icons/weather/200-202_230-232.svg'
    else if (id >= 210 && id <= 221)
      return '/icons/weather/210-221.svg'

    else if (clouds > 50 && (id >= 300 && id <= 531))
      return '/icons/weather/300-500-cloud.svg'
    else if ((isDay.value || ignoreDay) && (clouds < 50) && (id >= 300 && id <= 531))
      return '/icons/weather/300-500-light-cloud-day.svg'
    else if ((clouds < 50) && (id >= 300 && id <= 531))
      return '/icons/weather/300-500-light-cloud-night.svg'

    else if (id <= 600 && id <= 622)
      return '/icons/weather/600.svg'
    else if (id >= 701 && id <= 771)
      return '/icons/weather/701-771.svg'
    else if (id === 781)
      return '/icons/weather/781.svg'

    else if ((isDay.value || ignoreDay) && id === 800)
      return '/icons/weather/800-day.svg'
    else if (id === 800)
      return '/icons/weather/800-night.svg'

    else if ((isDay.value || ignoreDay) && id === 801)
      return '/icons/weather/801-day.svg'
    else if (id === 801)
      return '/icons/weather/801-night.svg'

    else if ((isDay.value || ignoreDay) && id === 802)
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
    token,
    fetchWeather,
    weatherIcon,
  }
}

export default useWeather
