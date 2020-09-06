import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { Context } from "@nuxt/types"
import { NuxtAxiosInstance } from "@nuxtjs/axios"
import ApiReturnData from "~/libs/classes/ApiReturnData"

declare module "vue/types/vue" {
  interface Vue {
    $callApi(url: string, options?: AxiosRequestConfig): Promise<any>;
  }
}

export function callApi($axios: NuxtAxiosInstance, url: string, options?: AxiosRequestConfig): Promise<any> {
  const defaultOptions: AxiosRequestConfig = { url, method: "GET" }
  Object.assign(defaultOptions, options || {})
  return new Promise((resolve, reject) => {
    $axios.request(defaultOptions).then((response: AxiosResponse<ApiReturnData<any>>) => {
      if (response.data.success) {
        resolve(response.data.data)
      } else reject(response.data)
    }).catch((e: AxiosError<ApiReturnData<any>>) => {
      if (e.response?.data.message) {
        reject(e.response?.data)
      } else {
        let error = "请求过程中发生未知错误"
        if (e.message) error += "\n" + e.message
        alert(error)
      }
    })
  })
}

export default ({ $axios }: Context, inject: any) => {
  inject("callApi", (url: string, options?: AxiosRequestConfig) => {
    return callApi($axios, url, options)
  })
}
