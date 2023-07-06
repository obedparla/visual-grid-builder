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
