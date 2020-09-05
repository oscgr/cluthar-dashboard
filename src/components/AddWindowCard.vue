<template>
  <v-card
    flat
    width="100%"
    height="100%"
    >
    <v-card-title>
      Ajouter une fenêtre
      <v-btn icon color="primary" dark><v-icon v-text="mdiHelp" /></v-btn>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col>
          <v-text-field dense v-model.trim="name" label="Nom" placeholder="Cuisine à gauche..." />
          <v-text-field dense v-model.trim="angle" label="Angle de la fenêtre (deg)" placeholder="32°" type="number" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="angle.length === 0" depressed color="primary" v-text="'OK'" />
    </v-card-actions>

  </v-card>

</template>

<script>

import {ref} from '@vue/composition-api'
import {mdiHelp} from '@mdi/js'
export default {
  name: "AddWindowCard",
  setup() {
    const name = ref('')
    const angle = ref('')

    return {
      name,
      angle,
      mdiHelp
    }
  }
}
</script>

<style scoped>

</style>
