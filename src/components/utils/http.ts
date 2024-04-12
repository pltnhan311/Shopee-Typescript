import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import HttpStatusCode from '../constants/httpStatusCode.enum'

const Http: AxiosInstance = axios.create({
  baseURL: 'https://api-ecom.duthanhduoc.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

Http.interceptors.response.use(
  (response) => response,
  async (error) => {
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
