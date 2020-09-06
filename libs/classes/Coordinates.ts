export default class Coordinates {

  row: number;

  column: number;

  constructor(row: number, column: number) {
    this.row = row
    this.column = column
  }

  static tupleToCoordinates(coordinates: Array<number>): Coordinates {
    return new Coordinates(coordinates[0], coordinates[1])
  }

  equals(coordinates?: Coordinates|null) {
    if (coordinates) {
      return (coordinates.row === this.row && coordinates.column === this.column)
    } else return false
  }
}
