export default interface Progress {
  now: number,
  all: number,
  percentage: number
}

export function percentageToText(percentage: number): string {
  return `${Math.round(percentage * 1000) / 10}%`
}
