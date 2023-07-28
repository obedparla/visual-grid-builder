import { getNumberOrNull } from "./type-conversion.ts";

export function isElementWithinBoundingRectangle(
  boundingRectangle: {
    left: number;
    top: number;
    width: number;
    height: number;
  },
  elementRectangle: DOMRect
) {
  // Padding within the cells makes UX better. Especially helpful when there's no space between the cells.
  const marginWidth = elementRectangle.width <= 40 ? 2 : 5;
  const marginHeight = elementRectangle.height <= 40 ? 2 : 5;

  return (
    boundingRectangle.left <= elementRectangle.right - marginWidth &&
    boundingRectangle.top <= elementRectangle.bottom - marginHeight &&
    boundingRectangle.left + boundingRectangle.width >=
      elementRectangle.left + marginWidth &&
    boundingRectangle.top + boundingRectangle.height >=
      elementRectangle.top + marginHeight
  );
}

export function isElementWithinMidPointOfRectangle(
  boundingRectangle: {
    left: number;
    top: number;
    width: number;
    height: number;
  },
  elementRectangle: DOMRect,
  gapArg: number
) {
  // The gap messes up the math for the rectangle
  // without accounting for it, it's possible for an element to select the wrong elements
  const gap = gapArg / 2;

  return (
    boundingRectangle.left - gap <=
      elementRectangle.width / 2 + elementRectangle.left &&
    boundingRectangle.top - gap <=
      elementRectangle.height / 2 + elementRectangle.top &&
    boundingRectangle.left + boundingRectangle.width + gap >=
      elementRectangle.right - elementRectangle.width / 2 &&
    boundingRectangle.top + boundingRectangle.height + gap >=
      elementRectangle.bottom - elementRectangle.height / 2
  );
}
