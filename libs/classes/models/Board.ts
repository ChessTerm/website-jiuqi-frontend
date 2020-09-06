import Game from "~/libs/classes/models/Game"
import User from "~/libs/classes/models/User"
import { State } from "~/libs/classes/models/State"

export default interface Board {
  id: number,
  game: Game,
  user: User,
  state: State,
  timestamp: number,
}
