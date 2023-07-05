export function getNumberOrNull(maybeStringNumber?: string) {
  return isNaN(Number(maybeStringNumber)) ? null : Number(maybeStringNumber);
}
