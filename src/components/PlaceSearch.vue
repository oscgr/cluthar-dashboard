<template>
<v-autocomplete :items="items"
                :loading="loading"
                dense
                hide-details
                item-text="display_name"
                return-object
                :search-input.sync="query"
                hide-no-data
                @input="setPlace"
                v-show="show"
>
        </v-autocomplete>
</template>
<script>
import placeStore from "@/store/placeStore";
import {reactive, toRefs, watch} from "@vue/composition-api";
import axios from "axios";

export default {
  name: 'place-search',
  setup() {

    const state = reactive({
      show: false,
      loading: false,
      place: null,
      query: '',
      items: []
    })

    const {changePlace} = placeStore()

    const open = () => {
      state.show = true
    }

    const setPlace = ({lat, lon, display_name}) => {
      changePlace({
        latitude: lat,
        longitude: lon,
        display: `${display_name?.split(',')[0]}|${display_name?.split(',')[display_name?.split(',').length - 1]}`
      })
      state.show = false
    }

    watch(() => state.query, async (query) => {
      if (state.query) {
        state.loading = true
        const {data} = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
        state.items = data
        state.loading = false
      }
    })

    return {
      ...toRefs(state),
      setPlace,
      open,
    }
  }
}
</script>
