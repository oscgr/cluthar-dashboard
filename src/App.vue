<template>
  <v-app>
    <AppBar v-if="!isFullscreen" @open-setup-dialog="openSetupDialog" />

    <v-main>
      <v-container :fluid="isFullscreen">
        <FirstTimeSetup>
          <MainLayout />
          <ErrorsSnackbar />
        </firsttimesetup>
      </v-container>
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-btn
            v-bind="props"
            aria-label="Passer en plein écran"
            class="ma-2" :style="{ 'right': '24px', 'bottom': '24px', 'position': 'fixed', 'z-index': 4 }"
            :icon="isHovering ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" @click="toggle"
          />
        </template>
      </v-hover>
    </v-main>
    <SetupDialog ref="setupDialog" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDark, useFullscreen } from '@vueuse/core'
import { useTheme } from 'vuetify'
import AppBar from '@/components/AppBar.vue'
import SetupDialog from '@/components/SetupDialog.vue'
import ErrorsSnackbar from '@/ErrorsSnackbar.vue'
import FirstTimeSetup from '@/FirstTimeSetup.vue'
import MainLayout from '@/MainLayout.vue'

const { toggle } = useFullscreen()
const dark = useDark()
const { isFullscreen } = useFullscreen()
const theme = useTheme()

const setupDialog = ref<InstanceType<typeof SetupDialog>>()

function openSetupDialog() {
  setupDialog.value?.open()
}

watch(dark, (v) => {
  theme.global.name.value = v ? 'dark' : 'light'
}, { immediate: true })
</script>
