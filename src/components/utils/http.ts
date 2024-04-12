import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import HttpStatusCode from '../constants/httpStatusCode.enum'
import { AuthResponse } from '../types/auth.type'
import { clearAccessTokenFromLS, getAccessTokenFromLS, saveAccessTokenToLS } from './auth'

let accessToken = getAccessTokenFromLS()

const Http: AxiosInstance = axios.create({
  baseURL: 'https://api-ecom.duthanhduoc.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

Http.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.authorization = accessToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

Http.interceptors.response.use(
  (response) => {
    console.log(response)
    const { url } = response.config
    if (url === '/login' || url === '/register') {
      accessToken = (response.data as AuthResponse).data.access_token
      saveAccessTokenToLS(accessToken)
    } else if (url === '/logout') {
      accessToken = ''
      clearAccessTokenFromLS()
    }
    return response
  },
  (error) => {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any | undefined = error.response?.data
      const message = data.message || error.message
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

export default Http
