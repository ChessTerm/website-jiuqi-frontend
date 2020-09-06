export const minEach = 30
export const maxEach = 80

export function getSize(size: number) {

  let maxAll = 900
  const tableContainer = document.getElementById("tableContainer")
  if (tableContainer) {
    const tableWidth = tableContainer.getBoundingClientRect().width
    maxAll = Math.min(tableWidth, maxAll)
  }
  const windowHeight = window.innerHeight
  maxAll = Math.min(maxAll, windowHeight * 0.75)

  let result: number
  const maxAsMinEach = minEach * size
  if (maxAsMinEach > maxAll) {
    result = minEach
  } else {
    result = maxAll / size
    if (result > maxEach) result = maxEach
  }

  return result
}
