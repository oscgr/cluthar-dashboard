<template>
  <v-hover v-slot="{ props, isHovering }" :disabled="isVideo">
    <v-card
      v-bind="props"
      width="100%"
      height="100%"
      min-height="150px"
      dark
      flat
      :color="dark ? '#0b3c5d' : '#c8cdd0'"
      @click="() => toggleDisplayInfos()"
    >
      <v-card-title v-if="error" v-text="t('constants.LAYOUT_CARD.NASA_POTD')" />
      <v-card-subtitle v-if="error" v-text="error" />
      <div v-else-if="loading" class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </div>
      <template v-else>
        <v-card-title v-show="(isHovering || displayInfos) && payload.title" class=" position-absolute" style="top: 0" v-text="payload.title" />
        <v-card-subtitle v-show="(isHovering || displayInfos) && payload.copyright" class=" position-absolute" style="top: 40px" v-text="`© ${payload.copyright}`" />
        <v-card-text v-show="(isHovering || displayInfos) && payload.explanation" class=" position-absolute text-justify" style="top: 70px" v-text="payload.explanation" />
        <v-skeleton-loader v-if="payload.url && isVideo" boilerplate type="image" />
        <v-img
          v-else-if="payload.url"
          aspect-ratio="16/9"
          max-height="500"
          :style="{ filter: (isHovering || displayInfos) ? 'blur(5px) opacity(0.5)' : '' }"
          cover :src="payload.hdurl" :lazy-src="payload.url" :alt="`${payload.title} - Copyright ${payload.copyright}`"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
              />
            </div>
          </template>
        </v-img>
      </template>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useNasa from '@/store/nasa'

const [displayInfos, toggleDisplayInfos] = useToggle()
const { t } = useI18n()
const { error, loading, payload } = useNasa()
const isVideo = computed(() => payload.value?.url?.includes('youtube'))
const dark = useDark()
</script>
