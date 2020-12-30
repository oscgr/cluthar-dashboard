import {reactive, toRefs, watch} from "@vue/composition-api";
import astroStore from "@/store/astroStore";
import placeStore from "@/store/placeStore";
import axios from "axios";


const state = reactive({
  loading: false,
  noData: false,
  payload: {
    current: {
      weather: [{}]
    },
    daily: [],
    hourly: [],
    minutely: []
  }
})


export default () => {

  const {isDay} = astroStore()
  const {place} = placeStore()

  const fetchWeather = async () => {
    if (place.value.longitude) {
      state.loading = true
      const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lang=fr&lat=${place.value.latitude}&lon=${place.value.longitude}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_API_KEY}`)
      state.payload = data
      console.log(state.payload)
      state.loading = false
      state.noData = !!!data
    }
    state.noData = true
  }

  watch(place, fetchWeather)


  const weatherIcon = (id, clouds = 0) => {

    if (!id) return null

    // https://openweathermap.org/weather-conditions

    if ((200 <= id && id <= 202) || (230 <= id && id <= 232)) return require('@/assets/icons/weather/200-202_230-232.svg')
    else if (210 <= id && id <= 221) return require('@/assets/icons/weather/210-221.svg')

    else if (clouds > 50 && (300 <= id && id <= 531)) return require('@/assets/icons/weather/300-500-cloud.svg')
    else if (isDay.value && (clouds < 50) && (300 <= id && id <= 531)) return require('@/assets/icons/weather/300-500-light-cloud-day.svg')
    else if ((clouds < 50) && (300 <= id && id <= 531)) return require('@/assets/icons/weather/300-500-light-cloud-night.svg')

    else if (id <= 600 && id <= 622) return require('@/assets/icons/weather/600.svg')
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
  }

  /* ==================== ACTIONS ==================== */


  return {
    ...toRefs(state),
    fetchWeather,
    weatherIcon,
  }
}

