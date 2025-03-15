/// <reference types="vite/client" />
import axios from 'axios'

const api = axios.create({
  // Usa la variable de entorno, con un valor por defecto en caso de que no esté definida
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3020/api'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
