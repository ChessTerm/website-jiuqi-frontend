import Game from "~/libs/classes/models/Game";
import User from "~/libs/classes/models/User";

export default interface Board {
  id: number,
  game: Game,
  user: User,
  state: string,
  timestamp: number,
}
