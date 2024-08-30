import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'

const key = useLocalStorage('authorization', '')
const local = axios.create({
  baseURL: import.meta.env.DEV ? `http://127.0.0.1:${import.meta.env.PORT || 8080}` : '/',
})

local.interceptors.request.use((req) => {
  req.headers.Authorization = key.value
  return req
})

export default function useAxiosInstance() {
  return {
    local,
    key,
  }
}
