<template>
  <v-snackbar v-model="snackbar.display" position="fixed" location="bottom start" color="error" :text="snackbar.text" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useAxiosInstance from '@/store/axiosInstance'

const snackbar = ref({
  display: false,
  text: '',
})
const { local } = useAxiosInstance()
onMounted(() => {
  local.interceptors.response.use(success => success, (error) => {
    if (error.message) {
      snackbar.value = {
        display: true,
        text: error.message,
      }
    }
    Promise.reject(error)
  })
})
</script>
