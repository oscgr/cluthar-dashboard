<template>
  <v-hover>
    <template #default="{ isHovering }">
      <v-btn
        class="ma-2" :style="{ 'right': '24px', 'bottom': '24px', 'position': 'fixed', 'z-index': 4 }"
        :icon="isHovering ? mdiFullscreenExit : mdiFullscreen" @click="toggle"
      />
    </template>
  </v-hover>
</template>

<script lang="ts" setup>
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js'
import { useFullscreen } from '@vueuse/core'

const { toggle } = useFullscreen()
</script>
