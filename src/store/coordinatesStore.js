import {computed, reactive} from "@vue/composition-api";
import weatherStore from "@/store/weatherStore";
import astroStore from "@/store/astroStore";

const state = reactive({
  lng: null,
  lat: null,
})

export default () => {

  const {fetchWeather} = weatherStore()
  const {fetchAstro} = astroStore()

  /* ==================== GETTERS ==================== */

  const coordinates = computed(() => {
    return state
  })

  /* ==================== ACTIONS ==================== */

  const setCoordinates = (val) => {
    if (!val && localStorage.getItem('coordinates')) {
      val = JSON.parse(localStorage.getItem('coordinates'))
    }
    if (val) {
      state.lng = val.lng
      state.lat = val.lat
      fetchAstro(val)
      fetchWeather(val)
      localStorage.setItem('coordinates', JSON.stringify(val))
    }
  }
  return {
    coordinates,
    setCoordinates,
  }
}
