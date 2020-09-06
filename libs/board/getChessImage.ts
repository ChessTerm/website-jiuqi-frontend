import Chess from "~/libs/classes/Chess"

export default function(chess: Chess) {
  let color
  switch (chess) {
    case Chess.X:
      color = "yellow"
      break
    case Chess.O:
      color = "blue"
      break
    default:
      return ""
  }
  return `/images/${color}_zu.png`
}
