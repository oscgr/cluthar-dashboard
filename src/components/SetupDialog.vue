<template>
  <v-form ref="form" novalidate>
    <v-dialog ref="setupDialog" v-model="show" width="700" scrollable>
      <v-card>
        <v-card-title>Paramètres</v-card-title>
        <v-divider />
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
                <VueDraggable v-model="setup.layout" item-key="cardType" tag="v-row" group="cards" animation="200">
                  <template #item="{ element }">
                    <v-col :cols="element.size">
                      <v-card variant="elevated" color="primary">
                        <v-card-text class="text-center pa-2">
                          <div v-text="$t(`constants.LAYOUT_CARD.${element.cardType}`)" />
                          <v-chip-group v-model="element.size" class="justify-center">
                            <v-chip value="3">
                              3
                            </v-chip>
                            <v-chip value="4">
                              4
                            </v-chip>
                            <v-chip value="6">
                              6
                            </v-chip>
                            <v-chip value="12">
                              12
                            </v-chip>
                          </v-chip-group>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                </VueDraggable>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="show = false" v-text="'Annuler'" />
          <v-btn type="submit" variant="flat" color="primary" @click="save" v-text="'OK'" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { cloneDeep, omit, trim, uniqBy } from 'lodash'
import axios from 'axios'
import { useDebounceFn } from '@vueuse/core'
import useWeather from '@/store/weather'
import type { Place } from '@/store/place'
import usePlace from '@/store/place'
import type { Card } from '@/store/layout'
import useLayout from '@/store/layout'

const setupDialog = ref(null)
const form = ref(null)

const { token: tokenStore } = useWeather()
const { place: placeStore } = usePlace()
const { layout: layoutStore } = useLayout()

const state = reactive({
  show: false,
  place: {
    query: '',
    items: [] as Place[],
  },
  pristine: {
    token: '' as string | null,
    place: null as Place | null,
    layout: [] as Card[],
  },
  setup: {
    token: '' as string | null,
    place: null as Place | null,
    layout: [] as Card[],
  },
})

const open = () => {
  state.setup = {
    token: trim(tokenStore.value || ''),
    place: omit(placeStore.value, ['fullResult']),
    layout: cloneDeep(layoutStore.value),
  }
  state.pristine = cloneDeep(state.setup)

  state.show = true
}

const save = async () => {
  const isValid = await form.value?.validate()
  if (!isValid)
    return
  if (state.setup.token !== state.pristine.token)
    tokenStore.value = state.setup.token
  if (state.setup.place !== state.pristine.place)
    placeStore.value = state.setup.place
  if (state.setup.layout !== state.pristine.layout)
    layoutStore.value = state.setup.layout
  state.show = false
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

const { show, setup, place } = toRefs(state)

defineExpose({ open })
</script>
