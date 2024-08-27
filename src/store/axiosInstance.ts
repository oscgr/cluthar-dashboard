import axios from 'axios'

const local = axios.create({
  baseURL: import.meta.env.DEV ? `http://127.0.0.1:${import.meta.env.VITE_LOCAL_PORT || 8080}` : '/',
})
export default function useAxiosInstance() {
  return {
    local,
  }
}
