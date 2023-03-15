<template>
  <v-text-field
    v-model.trim="input"
    autofocus
    density="compact"
    hide-details
    placeholder="Entrez votre token"
  >
    <template #append-inner>
      <v-icon color="primary" :icon="mdiCheck" @click="updateToken" />
    </template>
  </v-text-field>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { mdiCheck } from '@mdi/js'
import useWeather from '@/store/weather'

const { token, fetchWeather } = useWeather()
const input = ref('')

const updateToken = async () => {
  if (input.value)
    token.value = input.value

  await fetchWeather()
}
</script>
