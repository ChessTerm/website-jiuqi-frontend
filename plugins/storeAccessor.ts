import { Store } from "vuex"
import { getModule } from "vuex-module-decorators"
import user from "~/store/user"
import board from "~/store/board"

let userStore: user
let boardStore: board

function initialiseStores(store: Store<any>): void {
  userStore = getModule(user, store)
  boardStore = getModule(board, store)
}

export { initialiseStores, userStore, boardStore }
