import {useLocalStorage} from "@vueuse/core";
import {computed, ref} from "@vue/composition-api";
import astroStore from "@/store/astroStore";

const place = useLocalStorage('place', {latitude: null, longitude: null, display: null})

const noData = computed(() => !place.value.longitude && !place.value.latitude)

const loading = ref(false)

export default () => {

  /* ==================== ACTIONS ==================== */

  const changePlace = ({latitude, longitude, display}) => {
    place.value = {
      latitude,
      longitude,
      display,
    }
  }

  const setCoordinatesAsCurrentPosition = () => {
    if (navigator.geolocation) {
      loading.value = true
      console.debug('[COORDS] fetching device coordinates...')
      navigator.geolocation.getCurrentPosition(position => {
        console.debug('[COORDS] fetched device coordinates')
        changePlace({longitude: position.coords.longitude, latitude: position.coords.latitude})
        loading.value = false
      }, (e) => {
        loading.value = false
      }, {timeout: 5000});
    } else {
      console.warn('Browser does not support geolocation')
    }
  }

  return {
    noData,
    loading,
    place,
    changePlace,
    setCoordinatesAsCurrentPosition,
  }
}
