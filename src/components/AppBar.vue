<template>
  <v-app-bar app title="AZIMUTH SHUTTER">
    <template #append>
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-btn v-bind="props" class="mr-2" :icon="(dark && !isHovering || !dark && isHovering) ? mdiBrightness4 : mdiBrightness6" @click="dark = !dark" />
        </template>
      </v-hover>
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-btn v-bind="props" class="mr-2" :icon="isHovering ? mdiCog : mdiCogOutline" @click="$emit('openSetupDialog')" />
        </template>
      </v-hover>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { mdiBrightness4, mdiBrightness6, mdiCog, mdiCogOutline } from '@mdi/js'
import { useDark } from '@vueuse/core'

defineEmits(['openSetupDialog'])
const dark = useDark()
</script>
