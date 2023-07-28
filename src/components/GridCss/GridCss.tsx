import { useGridStyles } from "../../hooks/grid-styles.ts";
import { useDataStore } from "../../store/store.ts";

export function GridCss() {
  const gridStyles = useGridStyles();
  const itemsPositions = useDataStore((state) => state.gridItemsPositions);

  const gridCss = Object.entries(gridStyles).reduce((acc, [key, value]) => {
    acc = `${acc}
    ${key}: ${value};`;

    return acc;
  }, "");

  let itemIndex = -1;
  const itemsCss = itemsPositions.reduce((acc, itemPosition) => {
    itemIndex++;

    if (
      !itemPosition.position?.gridColumnStart &&
      !itemPosition.position?.gridColumnEnd &&
      !itemPosition.position?.gridRowStart &&
      !itemPosition.position?.gridRowEnd
    ) {
      return acc;
    }

    return `${acc}
    .grid-item-${itemIndex} {
      ${
        itemPosition.position?.gridColumnStart
          ? `grid-column-start: ${itemPosition.position.gridColumnStart};`
          : ""
      }
      ${
        itemPosition.position?.gridColumnEnd
          ? `grid-column-end: ${itemPosition.position.gridColumnEnd};`
          : ""
      }
      ${
        itemPosition.position?.gridRowStart
          ? `grid-row-start: ${itemPosition.position.gridRowStart};`
          : ""
      }
      ${
        itemPosition.position?.gridRowEnd
          ? `grid-row-end: ${itemPosition.position.gridRowEnd};`
          : ""
      }
      }
    `;
  }, "");

  return (
    <pre>{`
    .grid{
    ${gridCss}
  }
  
  // Items CSS
  
  ${itemsCss}
  
  `}</pre>
  );
}
