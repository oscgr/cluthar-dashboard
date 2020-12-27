import {ref, computed, reactive} from "@vue/composition-api";
import weatherStore from "@/store/weatherStore";
import astroStore from "@/store/astroStore";

const geolocationLoading = ref(false)

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

  const setGeolocationCoordinates = () => {
    if (navigator.geolocation) {
      geolocationLoading.value = true
      console.debug('[COORDS] fetching device coordinates...')
      navigator.geolocation.getCurrentPosition(position => {
        console.debug('[COORDS] fetched device coordinates')
        setCoordinates({lng: position.coords.longitude, lat: position.coords.latitude})
        geolocationLoading.value = false
      }, (e) => {
        geolocationLoading.value = false
      }, {timeout: 5000});
    } else {
      console.warn('Browser does not support geolocation')
    }
  }

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
    geolocationLoading,
    coordinates,
    setCoordinates,
    setGeolocationCoordinates,
  }
}
