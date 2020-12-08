export function convertPrice (value: number): string {
  return `${value.toFixed(2).replace(/\s/g, '')}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  )
}
