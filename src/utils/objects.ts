export function filterOutNullOrUndefinedValues(
  object: {
    [key: string]: unknown;
  } | null
) {
  if (!object) return object;

  return Object.keys(object)
    .filter((key) => object[key] === null || object[key] === undefined)
    .reduce(
      (acc, key) => ((acc[key] = object[key]), acc),
      {} as { [key: string]: unknown }
    );
}
