import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

export interface Place {
  latitude: number
  longitude: number
  name: string
  country: string
  fullResult?: string // for items in search
}

const place = useLocalStorage<Place | null>('place', null, { deep: true, serializer: StorageSerializers.object })

const loading = ref(false)

const usePlace = () => {
  /* ==================== ACTIONS ==================== */

  // const setCoordinatesAsCurrentPosition = () => {
  //   if (navigator.geolocation) {
  //     loading.value = true
  //     console.debug('[COORDS] fetching device coordinates...')
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       console.debug('[COORDS] fetched device coordinates')
  //       changePlace({ longitude: position.coords.longitude, latitude: position.coords.latitude })
  //       loading.value = false
  //     }, (e) => {
  //       loading.value = false
  //     }, { timeout: 5000 })
  //   }
  //   else {
  //     console.warn('Browser does not support geolocation')
  //   }
  // }

  return {
    loading,
    place,
    // setCoordinatesAsCurrentPosition,
  }
}

export default usePlace
