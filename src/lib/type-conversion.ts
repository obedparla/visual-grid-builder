export function getNumberOrNull(maybeStringNumber: string | null) {
  return maybeStringNumber === null || isNaN(Number(maybeStringNumber))
    ? null
    : Number(maybeStringNumber);
}
