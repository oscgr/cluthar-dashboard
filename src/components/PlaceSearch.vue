<template>
  <v-autocomplete
    v-show="show"
    v-model:search="query"
    autofocus
    :items="items"
    density="compact"
    :loading="loading"
    item-title="display_name"
    return-object
    hide-no-data
    hide-details
    placeholder="Recherchez votre ville"
    @update:model-value="setPlace"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import axios from 'axios'
import { toRefs, watchDebounced } from '@vueuse/core'
import usePlace from '@/store/place'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ ['update:show']: Function }>()
const state = reactive({
  loading: false,
  query: '',
  items: [],
})

const { items, loading, query } = toRefs(state)

const { changePlace } = usePlace()

const setPlace = ({ lat, lon, display_name }: { lat: number; lon: number; display_name: string }) => {
  changePlace({
    latitude: lat,
    longitude: lon,
    name: display_name?.split(',')[0],
    country: display_name?.split(',')[display_name?.split(',').length - 1],
  })
  emit('update:show', false)
}

watchDebounced(query, async (v) => {
  if (v) {
    state.loading = true
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${v}&format=jsonv2&accept-language=fr&limit=5`)
    state.items = data
    state.loading = false
  }
}, { debounce: 500 })
</script>
