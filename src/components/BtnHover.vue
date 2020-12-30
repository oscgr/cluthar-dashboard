<template>
<v-hover>
      <template #default="{hover}">
        <v-btn class="ma-2" :style="{right: '24px', bottom: '24px', position: 'fixed', 'z-index': 4}" fab @click="toggleFullScreen">
          <v-icon v-text="hover ? mdiFullscreenExit : mdiFullscreen" />
        </v-btn>
      </template>
    </v-hover>
</template>
<script>
import fullscreenStore from "@/store/fullscreenStore";
import {mdiFullscreen, mdiFullscreenExit} from "@mdi/js";

export default {
  name: 'btn-hover',
  setup() {
      const {fullScreen, toggleFullScreen} = fullscreenStore()

      return {
        fullScreen,
        mdiFullscreenExit, mdiFullscreen,
        toggleFullScreen
    }
  }
}
</script>
