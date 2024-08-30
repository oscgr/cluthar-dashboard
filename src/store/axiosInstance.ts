import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'

const authorization = useLocalStorage('authorization', '')
const local = axios.create({
  baseURL: import.meta.env.DEV ? `http://127.0.0.1:${import.meta.env.PORT || 8080}` : '/',
  headers: {
    Authorization: authorization.value,
  },
})

export default function useAxiosInstance() {
  return {
    local,
  }
}
