import Vue from "vue"
import {Module, Mutation, VuexModule} from "vuex-module-decorators"
import Board from "~/libs/classes/models/Board"
import Coordinates from "~/libs/classes/Coordinates"
import Chess from "~/libs/classes/Chess"
import State from "~/libs/classes/models/State";

@Module({ name: "board", stateFactory: true, namespaced: true })
export default class extends VuexModule {

  board: Board|null = null

  // pickUp related data.
  pickedUp: boolean = false
  pickedUpOn: number = 0  // Timestemp when picked up.
  pickedUpCoordinates: Coordinates|null = null
  pickedUpChess: Chess = Chess.None

  @Mutation
  updateBoard(board: Board|null) {
    this.board = board
  }

  @Mutation
  updateState(data: {
    value: Chess,
    coordinates: Coordinates,
  }) {
    if (this.board) {
      let state = this.board.state
      let row = state[data.coordinates.row]
      if (row) {
        row[data.coordinates.column] = data.value
        Vue.set(this.board.state, data.coordinates.row, row);
      }
    }
  }

  @Mutation
  replaceState(state: State) {
    if (this.board) this.board.state = state;
  }

  @Mutation
  putDown() {
    this.pickedUp = false
    this.pickedUpCoordinates = null
    this.pickedUpChess = Chess.None
  }

  @Mutation
  pickUp(data: {
    value: Chess,
    coordinates?: Coordinates,
  }) {
    this.pickedUp = true;
    this.pickedUpOn = new Date().getTime();
    this.pickedUpCoordinates = data.coordinates || null;
    this.pickedUpChess = data.value;
  }
}
