import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { computed } from 'vue'

export enum CardType {
  PLACE = 'PLACE',
  WEATHER_TODAY = 'WEATHER_TODAY',
  SUN_TODAY = 'SUN_TODAY',
  MOON_TODAY = 'MOON_TODAY',
  RAIN_NEXT_HOUR = 'RAIN_NEXT_HOUR',
  TEMP_NEXT_24H = 'TEMP_NEXT_24H',
  WEATHER_NEXT_6D = 'WEATHER_NEXT_6D',
  WEATHER_ALERTS = 'WEATHER_ALERTS',
}
export interface Preferences {
  cards: Card[]
}
export interface Card {
  order: number
  size: '1' | '2' | '3' | '4' | '6' | '12'
  cardType: CardType
  extra?: Record<string, unknown>
}

const DEFAULT_LAYOUT = [
  {
    order: 0,
    size: '6',
    cardType: CardType.PLACE,
  },
  {
    order: 1,
    size: '6',
    cardType: CardType.WEATHER_TODAY,
  },
  {
    order: 2,
    size: '6',
    cardType: CardType.SUN_TODAY,
  },
  {
    order: 3,
    size: '6',
    cardType: CardType.MOON_TODAY,
  },
  {
    order: 4,
    size: '6',
    cardType: CardType.RAIN_NEXT_HOUR,
  },
  {
    order: 5,
    size: '6',
    cardType: CardType.TEMP_NEXT_24H,
  },
  {
    order: 6,
    size: '6',
    cardType: CardType.WEATHER_NEXT_6D,
  },
  {
    order: 7,
    size: '12',
    cardType: CardType.WEATHER_ALERTS,
  },
] satisfies Card[]

const layout = useLocalStorage<Card[]>('layout', cloneDeep(DEFAULT_LAYOUT), { deep: true, serializer: StorageSerializers.object })

const useLayout = () => {
  /* ==================== ACTIONS ==================== */

  // const changePlace = ({ latitude, longitude, name, country }: Place) => {
  //   place.value = {
  //     latitude,
  //     longitude,
  //     name,
  //     country,
  //   }
  // }

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

  const availableCards = computed<CardType[]>(() => {
    return Object.values(CardType).filter(v => layout.value.some(({ cardType }) => cardType === v))
  })

  return {
    layout,
    availableCards,
    // setCoordinatesAsCurrentPosition,
  }
}

export default useLayout
