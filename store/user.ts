import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import { $axios } from "~/plugins/axiosAccessor"
import { callApi } from "~/plugins/callApi"
import User from "~/libs/classes/models/User"

@Module({ name: "user", stateFactory: true, namespaced: true })
export default class extends VuexModule {

  info: User|null = null

  @Mutation
  updateInfo(info: User|null) {
    this.info = info
  }

  @Action
  getInfo(callback?: () => void) {
    callApi($axios, "user").then((userInfo) => {
      this.context.commit("updateInfo", userInfo)
    }).catch(() => {
      this.context.commit("updateInfo", null)
    }).finally(() => {
      if (callback) callback()
    })
  }
}
