<template>
  <v-dialog ref="setupDialog" v-model="show" width="500">
    <v-form ref="form" @submit.prevent="save">
      <v-card>
        <v-card-title>Paramètres</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <p class="pb-2 ">
                  Veuillez saisir votre ville, lieu-dit ou autre. Cela permet de récupérer les informations météo, votre ensoleillement et vos alertes.
                </p>
                <v-autocomplete
                  v-model="setup.place"
                  v-model:search="place.query"
                  :items="place.items"
                  :rules="[(v) => !!v || 'Requis']"
                  return-object
                  :item-title="(v) => `${v.name}, ${v.country}`"
                  label="Ville ou localisation"
                  placeholder="Recherchez votre localisation"
                  @update:search="searchLocations"
                >
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props" :title="item.title" :subtitle="item.raw.fullResult" />
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p class="pb-2 ">
                  Nécessaire pour récupérer les informations de météo de votre localisation.
                  Pour en récupérer un : <a href="https://openweathermap.org/api" target="_blank">https://openweathermap.org/api</a>
                </p>
                <v-text-field
                  v-model.trim="setup.token"
                  :rules="[(v) => !!v || 'Requis']"
                  type="password"
                  label="Token Open Weather Map"
                  placeholder="Entrez votre token"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-1">
                  Disposition
                </div>
              </v-col>
              <draggable />
              <!--              <v-col cols="12"> -->
              <!--                <v-select label="Langue" /> -->
              <!--              </v-col> -->
              <!--              <v-col cols="12"> -->
              <!--                <v-select label="Langue" /> -->
              <!--              </v-col> -->
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="show = false" v-text="'Annuler'" />
          <v-btn type="submit" variant="flat" color="primary" v-text="'OK'" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { cloneDeep, omit, trim, uniqBy } from 'lodash'
import axios from 'axios'
import { useDebounceFn } from '@vueuse/core'
import draggable from 'vuedraggable'
import useWeather from '@/store/weather'
import type { Place } from '@/store/place'
import usePlace from '@/store/place'
const setupDialog = ref(null)
const form = ref(null)

const { token: tokenStore } = useWeather()
const { place: placeStore } = usePlace()

const state = reactive({
  show: false,
  place: {
    query: '',
    items: [] as Place[],
  },
  pristine: {
    token: '' as string | null,
    place: null as Place | null,
  },
  setup: {
    token: '' as string | null,
    place: null as Place | null,
  },
})

const open = () => {
  state.setup = {
    token: trim(tokenStore.value || ''),
    place: omit(placeStore.value, ['fullResult']),
  }
  state.pristine = cloneDeep(state.setup)

  state.show = true
}

const save = async () => {
  const isValid = await form.value?.validate()
  console.log(isValid)
}

const searchLocations = useDebounceFn(async (v: string) => {
  if (v) {
    try {
      const { data } = await axios.get<{ lat: number; lon: number; display_name: string }[]>(`https://nominatim.openstreetmap.org/search?q=${v}&format=jsonv2&accept-language=fr&limit=5`)
      state.place.items = uniqBy(data, 'display_name').map(result => ({
        latitude: result.lat,
        longitude: result.lon,
        name: result.display_name?.split(', ')[0],
        country: result.display_name?.split(', ')[result.display_name?.split(',').length - 1],
        fullResult: result.display_name,
      }))
    }
    catch (e) {
      state.place.items = []
    }

    console.log(state.place.items)
  }
}, 500)

// watchDebounced(() => state.place.query, , { debounce: 500 })

const { show, setup, place } = toRefs(state)

defineExpose({ open })
</script>
