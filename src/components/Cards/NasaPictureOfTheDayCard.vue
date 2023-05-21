<template>
  <v-hover v-slot="{ props, isHovering }">
    <v-card
      v-bind="props"
      width="100%"
      height="100%"
      dark
      flat
      :color="dark ? '#0b3c5d' : '#c8cdd0'"
      @click="() => toggleDisplayInfos()"
    >
      <v-img
        v-if="payload.url"
        aspect-ratio="16/9"
        :style="{ filter: (isHovering || displayInfos) ? 'opacity(0.2)' : '' }"
        style="max-height: 500px;"
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
      <v-card-title v-show="isHovering || displayInfos" class=" position-absolute" style="top: 0" v-text="payload.title" />
      <v-card-subtitle v-show="isHovering || displayInfos" class=" position-absolute" style="top: 40px" v-text="`© ${payload.copyright}`" />
      <v-card-text v-show="isHovering || displayInfos" class=" position-absolute text-justify" style="top: 70px" v-text="payload.explanation" />
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import useAxiosInstance from '@/store/axiosInstance'

interface NasaAPIResponse {
  copyright: string
  explanation: string
  hdurl: string
  title: string
  url: string
}
const [displayInfos, toggleDisplayInfos] = useToggle()
const payload = ref<NasaAPIResponse>({
  copyright: '',
  explanation: '',
  hdurl: '',
  title: '',
  url: '',
})

const { local } = useAxiosInstance()

onMounted(async () => {
  try {
    const { data } = await local.get<NasaAPIResponse>('/api/nasa')
    payload.value = data
  }
  catch (e) {
    if (import.meta.env.DEV) // when coding without internet
      payload.value = JSON.parse(import.meta.env.VITE_FAKE_NASA_API)
  }
})
const dark = useDark()
</script>
