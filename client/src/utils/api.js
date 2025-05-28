// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// })
// // Profile operations
// getProfile: () => instance.get('/users/me'),
// updateProfile: (data) => instance.put('/users/update', data),
// // Add JWT to all requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default api
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
   headers: {
    'Content-Type': 'application/json'
  },
   withCredentials: true,
})



// Add JWT to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Profile operations
export const getProfile = () => api.get('/users/me')
export const updateProfile = (data) => api.put('/users/update', data)

// Export the configured instance for direct use
export default api