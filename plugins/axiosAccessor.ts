import { Plugin } from "@nuxt/types"
import { NuxtAxiosInstance } from "@nuxtjs/axios"

export let $axios: NuxtAxiosInstance

function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
}

const accessor: Plugin = ({ $axios }) => {
  initializeAxios($axios)
}

export default accessor
