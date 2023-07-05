import { ElementPositionAndSize } from "../types/dom.ts";
// export function getElementPositionAndSizeInPx(domElement: Element | null): {
//   [key: string]: string;
// } {
//   if (!domElement) return { display: "none" };
//
//   const { x, y, width, height } = domElement.getBoundingClientRect();
//
//   return {
//     x: `${x}px`,
//     y: `${y}px`,
//     width: `${width}px`,
//     height: `${height}px`,
//   };
// }

export function getBodyRectangle(): ElementPositionAndSize {
  return document.body.getBoundingClientRect();
}

export function getGridOverlayStylesFromGridElement(gridElement: Element) {
  const {
    gridTemplateColumns,
    gridTemplateRows,
    gap,
    padding,
    gridAutoFlow,
    gridAutoColumns,
    gridAutoRows,
    justifyContent,
    alignContent,
  } = window.getComputedStyle(gridElement);

  // we need to match the real element CSS precisely so they both look the same
  return {
    gridTemplateColumns,
    gridTemplateRows,
    gap,
    padding,
    gridAutoFlow,
    gridAutoColumns,
    gridAutoRows,
    justifyContent,
    alignContent,
  };
}

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
