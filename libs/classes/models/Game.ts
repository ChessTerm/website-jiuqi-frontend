import State from "~/libs/classes/models/State";

export default interface Game {
  id: number,
  title: string
  description?: string,
  rectpaper?: string,
  initialState?: State,
  availablePositions?: string,
  row: number,
  column: number,
}
