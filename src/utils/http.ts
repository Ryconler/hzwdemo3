import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ResultType } from '@/types/http'
import { reportUrl } from './reportSentry'

function createService(options: AxiosRequestConfig) {
  const service = axios.create(options)
  service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response && response.config && response.config.url) {
        reportUrl(response)
      }
      const res: ResultType<any> =
        response && response.data ? response.data : response
      return res || {}
    },
    (error: AxiosError) => {
      if (error.isAxiosError) {
        reportUrl(error.response, true)
      }
      return Promise.reject(error)
    }
  )
  return service
}

/* 带cookie */
const $http = createService({ withCredentials: true })
export const http = $http

/* 不带cookie */
const $ajax = createService({ withCredentials: false })
export const ajax = $ajax
