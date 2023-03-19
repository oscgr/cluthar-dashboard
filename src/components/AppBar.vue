<template>
  <v-app-bar app>
    <template #prepend>
      <!--      <v-icon class="wi wi-day-snow-thunderstorm" /> -->
      <v-app-bar-nav-icon icon="weather:wi-day-snow-thunderstorm" />
    </template>

    <v-app-bar-title>Dashboard</v-app-bar-title>

    <template v-if="$vuetify.display.mdAndUp" #append>
      <v-switch
        v-model="dark" hide-details class="mr-4 v-switch-light" inset :true-icon="mdiBrightness2" :false-icon="mdiBrightness5"
      />
      <v-tooltip open-delay="500" text="Paramètres">
        <template #activator="{ props }">
          <v-btn class="mr-2" :icon="mdiCogOutline" v-bind="props" @click="$emit('openSetupDialog')" />
        </template>
      </v-tooltip>
    </template>
    <template v-else #append>
      <v-menu origin="overlap">
        <template #activator="{ props }">
          <v-btn v-bind="props" :icon="mdiDotsVertical" />
        </template>
        <v-list density="compact">
          <v-list-item @click="dark = !dark">
            <v-list-item-title>Activer le mode {{ dark ? 'clair' : 'sombre' }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('openSetupDialog')">
            <v-list-item-title>Paramètres...</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { mdiBrightness2, mdiBrightness5, mdiCogOutline, mdiDotsVertical } from '@mdi/js'
import { useDark } from '@vueuse/core'

defineEmits(['openSetupDialog'])
const dark = useDark()
</script>

<style lang="scss">
.v-switch-light {
  .v-switch__track {
    background-color: lightgray;
  }
}
</style>
