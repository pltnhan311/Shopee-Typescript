import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import HttpStatusCode from '../../constants/httpStatusCode.enum'
import { AuthResponse } from '../types/auth.type'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileFromLS } from './auth'
import path from '../../constants/path'

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
    if (url === path.login || url === path.register) {
      const data = response.data as AuthResponse
      accessToken = data.data.access_token
      setAccessTokenToLS(accessToken)
      setProfileFromLS(data.data.user)
    } else if (url === path.logout) {
      accessToken = ''
      clearLS()
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
