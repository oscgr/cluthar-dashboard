<template>
  <VForm ref="form" novalidate>
    <v-dialog
      ref="setupDialog" v-model="show" :width="$vuetify.display.smAndDown ? '' : '700'" scrollable
      transition="dialog-bottom-transition" :persistent="!placeStore"
      :fullscreen="$vuetify.display.smAndDown"
    >
      <v-card>
        <v-card-title>Paramètres</v-card-title>
        <v-divider />
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <p class="pb-2 ">
                  Veuillez saisir votre ville, lieu-dit ou autre. Cela permet de récupérer les informations météo, votre
                  ensoleillement et vos alertes.
                </p>
                <v-autocomplete
                  v-model="setup.place"
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
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p class="pb-2 ">
                  Modifier la clé API
                </p>
                <v-text-field
                  v-model="setup.key"
                  :rules="[(v) => !!v || 'Requis']"
                  label="Serveur"
                  type="password"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-1">
                  Disposition
                </div>
                <VueDraggable
                  v-model="setup.layout" item-key="cardType" tag="v-row" group="cards" animation="200"
                  @start="grab = true"
                  @end="grab = false"
                >
                  <template #item="{ element }">
                    <v-col :cols="element.size">
                      <v-card variant="outlined" :style="{ cursor: grab ? 'grabbing' : 'grab' }">
                        <v-btn variant="flat" size="sm" icon="mdi-close" class="position-absolute mt-1 mr-1" style="right: 0" @click="removeCard(element)" />
                        <v-card-text class="text-center pa-2">
                          <div v-text="t(`constants.LAYOUT_CARD.${element.cardType}`)" />
                          <v-chip-group
                            v-model="element.size" class="justify-content-center" color="primary" mandatory
                            variant="outlined"
                          >
                            <v-chip value="4">
                              ⅓
                            </v-chip>
                            <v-chip value="6">
                              ½
                            </v-chip>
                            <v-chip value="8">
                              ⅔
                            </v-chip>
                            <v-chip value="12">
                              1
                            </v-chip>
                          </v-chip-group>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                </VueDraggable>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center">
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" :disabled="availableCards(setup.layout.map(({ cardType }) => cardType)).length === 0" variant="flat" color="primary">
                      Ajouter un widget...
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="availableCard in orderBy(availableCards(setup.layout.map(({ cardType }) => cardType)), v => t(`constants.LAYOUT_CARD.${v}`))"
                      :key="availableCard" @click="() => addCard(availableCard)"
                    >
                      <v-list-item-title v-text="t(`constants.LAYOUT_CARD.${availableCard}`)" />
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="primary"
            variant="outlined" :disabled="!placeStore" @click="resetLayout"
            v-text="'Réinitialiser'"
          />
          <v-spacer />
          <v-btn variant="text" :disabled="!placeStore" @click="show = false" v-text="'Annuler'" />
          <v-btn variant="flat" color="primary" @click="save" v-text="'OK'" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VForm>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { cloneDeep, omit, orderBy, sortBy } from 'lodash'
import { useDebounceFn } from '@vueuse/core'
import { VForm } from 'vuetify/components/VForm'
import { useI18n } from 'vue-i18n'
import type { Place } from '@/store/place'
import usePlace from '@/store/place'
import type { Card, CardType } from '@/store/layout'
import useLayout from '@/store/layout'
import useAxiosInstance from '@/store/axiosInstance'

const setupDialog = ref(null)
const form = ref<InstanceType<typeof VForm> | null>(null)

const { place: placeStore } = usePlace()
const { layout: layoutStore, resetLayout: resetLayoutStore, availableCards } = useLayout()
const { local, key } = useAxiosInstance()
const { t } = useI18n()
const state = reactive({
  grab: false,
  show: false,
  place: {
    loading: false,
    items: [] as Place[],
  },
  pristine: {
    place: null as Place | null,
    key: null as string | null,
    layout: [] as Card[],
  },
  setup: {
    place: null as Place | null,
    key: null as string | null,
    layout: [] as Card[],
  },
})

function open() {
  state.setup = {
    place: cloneDeep(placeStore.value),
    layout: cloneDeep(layoutStore.value),
    key: cloneDeep(key.value),
  }
  state.pristine = cloneDeep(state.setup)

  state.show = true
}

async function save() {
  const { valid } = await form.value?.validate()
  if (!valid)
    return

  if (state.setup.place !== state.pristine.place) // check back on lodash typing sometime in the future (ban "as" => use "satisfies")
    placeStore.value = omit(state.setup.place, ['fullResult']) as Omit<Place, 'fullResult'>
  if (state.setup.layout !== state.pristine.layout)
    layoutStore.value = state.setup.layout
  if (state.setup.key !== state.pristine.key)
    key.value = state.setup.key
  state.show = false
  if (state.setup.key !== state.pristine.key)
    location.reload() // might be a better way to force axios instance recreation
}

function resetLayout() {
  resetLayoutStore()
  state.setup.layout = cloneDeep(layoutStore.value)
  state.pristine.layout = cloneDeep(layoutStore.value)
  state.pristine.key = cloneDeep(key.value)
}

function addCard(cardType: CardType) {
  state.setup.layout.push({ cardType, size: '6' })
}
function removeCard(card: Card) {
  state.setup.layout = state.setup.layout.filter(({ cardType }) => card.cardType !== cardType)
}

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
    catch (e) {
      state.place.items = []
    }
    finally {
      state.place.loading = false
    }
  }
}, 500)

const { show, setup, place, grab } = toRefs(state)

defineExpose({ open })
</script>

<style>
.v-slide-group__content {
  justify-content: center;
}
</style>
