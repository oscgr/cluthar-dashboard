<script>
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js'
import fullscreenStore from '@/store/fullscreenStore'

export default {
  name: 'BtnHover',
  setup() {
    const { fullScreen, toggleFullScreen } = fullscreenStore()

    return {
      fullScreen,
      mdiFullscreenExit,
      mdiFullscreen,
      toggleFullScreen,
    }
  },
}
</script>

<template>
  <v-hover>
    <template #default="{ hover }">
      <v-btn class="ma-2" :style="{ 'right': '24px', 'bottom': '24px', 'position': 'fixed', 'z-index': 4 }" fab @click="toggleFullScreen">
        <v-icon>{{ hover ? mdiFullscreenExit : mdiFullscreen }}</v-icon>
      </v-btn>
    </template>
  </v-hover>
</template>
