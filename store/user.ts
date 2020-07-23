import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import User from "~/libs/classes/models/User";

@Module({ name: "user", stateFactory: true, namespaced: true })
export default class extends VuexModule {
  info: User|null = null

  @Mutation
  updateInfo(info: User|null) {
    this.info = info
  }
}
