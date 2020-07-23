export default interface Game {
  id: number,
  title: string
  description?: string,
  rectpaper?: string,
  initialState?: string,
  availablePositions?: string,
  row: number,
  column: number,
}
