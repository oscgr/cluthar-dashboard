<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-center">
      <v-progress-linear v-if="loading" indeterminate type="card" :loading="loading" />
      <v-card v-else-if="setupIsRequired" flat width="600">
        <v-stepper v-model="stepper" alt-labels non-linear>
          <v-stepper-header>
            <v-stepper-item
              title="Clé API"
              :value="1"
              :complete="key.valid"
            />

            <v-divider />

            <v-stepper-item
              title="Localisation"
              :value="2"
              :complete="!!placeStore"
            />
          </v-stepper-header>
          <v-stepper-window>
            <v-stepper-window-item :value="1">
              <v-card title="Veuillez renseigner votre clé API" flat>
                <v-text-field
                  v-model="key.input"
                  label="Clé API"
                  type="password"
                  :loading="key.loading"
                  :error-messages="key.error"
                  @input="onKeyChange"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn :disabled="!key.valid" :loading="key.loading" @click="stepper = 2">
                    Suivant
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-window-item>
            <v-stepper-window-item :value="2">
              <v-card title="Veuillez renseigner votre localisation" flat>
                <v-autocomplete
                  v-model="placeStore"
                  :items="place.items"
                  :rules="[(v) => !!v || 'Requis']"
                  return-object
                  :item-title="(v) => `${v.name} (${v.postcode || v.country})`"
                  label="Ville ou localisation"
                  :loading="place.loading"
                  hide-no-data
                  placeholder="Recherchez votre localisation"
                  @update:search="searchLocations"
                >
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props" :title="item?.title" :subtitle="item.raw.administrative" />
                  </template>
                </v-autocomplete>
                <v-card-actions>
                  <v-spacer />
                  <v-btn :disabled="!placeStore" :loading="place.loading" @click="setupIsRequired = false">
                    Valider
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-card>
    </v-col>
  </v-row>
  <slot v-if="!loading && !setupIsRequired" />
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive, toRefs } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { sortBy, trim } from 'lodash'
import useAxiosInstance from '@/store/axiosInstance'
import usePlace, { type Place } from '@/store/place'

const { key: keyStore, local } = useAxiosInstance()
const { place: placeStore } = usePlace()
const state = reactive({
  stepper: 1 as 1 | 2,
  loading: true,
  setupIsRequired: false,
  key: {
    loading: false,
    valid: false,
    input: null as string | null,
    error: null as string | null,
  },
  place: {
    loading: false,
    items: [] as Place[],
  },
})
const { place, key, loading, setupIsRequired, stepper } = toRefs(state)
const searchLocations = useDebounceFn(async (q: string) => {
  if (q) {
    try {
      state.place.loading = true
      const { data } = await local.get<{
        latitude: number
        longitude: number
        name: string
        country: string
        postcodes: string[]
        admin1?: string
        admin2?: string
        admin3?: string
        admin4?: string
      }[]>('/api/secure/geo', {
        params: {
          q,
        },
      })
      state.place.items = data.map(result => ({
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
        administrative: ['1', '2', '3', '4'].map(i => result[`admin${i as '1' | '2' | '3' | '4'}`]).filter(v => !!v).join(', '),
        postcode: sortBy(result.postcodes)[0],
      }))
    }
    catch {
      state.place.items = []
    }
    finally {
      state.place.loading = false
    }
  }
}, 500)

async function onKeyChange() {
  if (!state.key.input)
    state.key.error = 'Veuillez renseigner une clé'
  state.key.valid = await checkKey(state.key.input as string)
  state.key.error = state.key.valid ? null : 'La clé est invalide'
}

async function checkKey(_key?: string): Promise<boolean> {
  if (_key)
    keyStore.value = _key
  try {
    await local.get('/api/secure/ping')
    return true
  }
  catch {
    return false
  }
}
const keyIsDefined = computed(() => (!!keyStore.value) && (trim(keyStore.value) !== ''))
onBeforeMount(async () => {
  if (!keyIsDefined.value || !placeStore.value)
    setupIsRequired.value = true

  if (keyIsDefined.value) {
    state.key.valid = (await checkKey())
    if (state.key.valid) {
      state.stepper = 2
    }
  }
  loading.value = false
})
</script>
