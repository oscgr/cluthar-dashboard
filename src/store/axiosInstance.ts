import axios from 'axios'

const local = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_LOCAL_PORT || 8080}`,
})
export default function useAxiosInstance() {
  return {
    local,
  }
}
