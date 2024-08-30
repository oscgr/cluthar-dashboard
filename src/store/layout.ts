import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import type { Primitive } from 'utility-types'

export type CardType =
  'PLACE' |
  'WEATHER_TODAY' |
  'SUN_TODAY' |
  'MOON_TODAY' |
  'RAIN_NEXT_HOUR' |
  'TEMP_NEXT_24H' |
  'RAIN_NEXT_24H' |
  'WEATHER_NEXT_6D' |
  'WEATHER_ALERTS' |
  'COCKTAIL' |
  'NASA_POTC' |
  'POLLUTION'
export interface Card {
  size: '3' | '4' | '6' | '12'
  cardType: CardType
  extra?: Record<string, Primitive>
}

const DEFAULT_LAYOUT = [
  {
    size: '12',
    cardType: 'NASA_POTC',
  },
  {
    size: '6',
    cardType: 'PLACE',
  },
  {
    size: '6',
    cardType: 'WEATHER_TODAY',
  },
  {
    size: '6',
    cardType: 'RAIN_NEXT_HOUR',
  },
  {
    size: '6',
    cardType: 'TEMP_NEXT_24H',
  },
  {
    size: '6',
    cardType: 'RAIN_NEXT_24H',
  },
  {
    size: '6',
    cardType: 'WEATHER_NEXT_6D',
  },
] satisfies Card[]

const layout = useLocalStorage<Card[]>('layout', cloneDeep(DEFAULT_LAYOUT), { deep: true, serializer: StorageSerializers.object })

function useLayout() {
  /* ==================== ACTIONS ==================== */

  const availableCards = (cardTypes: CardType[]): CardType[] => ['PLACE', 'WEATHER_TODAY', 'SUN_TODAY', 'MOON_TODAY', 'RAIN_NEXT_HOUR', 'TEMP_NEXT_24H', 'RAIN_NEXT_24H', 'WEATHER_NEXT_6D', 'WEATHER_ALERTS', 'COCKTAIL', 'NASA_POTC', 'POLLUTION'].filter((v: CardType) => !cardTypes.includes(v))

  const resetLayout = () => {
    layout.value = cloneDeep(DEFAULT_LAYOUT)
  }

  return {
    layout,
    resetLayout,
    availableCards,
  }
}

export default useLayout
