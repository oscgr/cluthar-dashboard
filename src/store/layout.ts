import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash'

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
export interface Card {
  size: '3' | '4' | '6' | '12'
  cardType: CardType
  extra?: Record<string, unknown>
}

const DEFAULT_LAYOUT = [
  {
    size: '12',
    cardType: CardType.WEATHER_ALERTS,
  },
  {
    size: '6',
    cardType: CardType.PLACE,
  },
  {
    size: '6',
    cardType: CardType.WEATHER_TODAY,
  },
  {
    size: '6',
    cardType: CardType.SUN_TODAY,
  },
  {
    size: '6',
    cardType: CardType.MOON_TODAY,
  },
  {
    size: '6',
    cardType: CardType.RAIN_NEXT_HOUR,
  },
  {
    size: '6',
    cardType: CardType.TEMP_NEXT_24H,
  },
  {
    size: '6',
    cardType: CardType.WEATHER_NEXT_6D,
  },
] satisfies Card[]

const layout = useLocalStorage<Card[]>('layout', cloneDeep(DEFAULT_LAYOUT), { deep: true, serializer: StorageSerializers.object })

const useLayout = () => {
  /* ==================== ACTIONS ==================== */

  const availableCards = (cardTypes: CardType[]) => Object.values(CardType).filter(v => !cardTypes.includes(v))

  return {
    layout,
    availableCards,
  }
}

export default useLayout
