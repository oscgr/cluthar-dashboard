import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'

const server = useLocalStorage<string>('server', '127.0.0.1')

const local = axios.create({
  baseURL: import.meta.env.DEV ? `http://${server.value}:${import.meta.env.VITE_LOCAL_PORT || 8080}` : '/',
})

export default function useAxiosInstance() {
  return {
    local,
    server,
  }
}
