import { useEffect, useState } from "react";
import * as classNames from "classnames";
import GridResizingHandles from "../GridResizingHandles.tsx";
import {
  GridItemPositionsData,
  HandlePosition,
  PreviewRectangle,
  SelectedCellsList,
} from "../../types/grid.ts";
import { getCountCellsInGrid, getGridItemPosition } from "../../utils/grid.ts";
import { filterOutNullOrUndefinedValues } from "../../utils/objects.ts";

import "./grid.css";
import { useGetCellsCount, useGridStyles } from "../../hooks/grid-styles.ts";
import { useDataStore } from "../../store/store.ts";

export function VisualGrid() {
  const [gridElement, gridElementSet] = useState<HTMLElement | null>(null);

  useEffect(() => {
    gridElementSet(document.getElementById("grid"));
  }, []);

  const [currentlySwappingAreas, currentlySwappingAreasSet] = useState(false);
  const [currentlyMovingItemIndex, currentlyMovingItemIndexSet] = useState<
    number | null
  >(null);

  const [draggingElementNodeId, draggingElementNodeIdSet] = useState<
    number | null
  >(null);

  const [currentlyResizingItemElement, currentlyResizingItemElementSet] =
    useState<Element | null>(null);

  const [
    currentResizingFromHandlePosition,
    currentResizingFromHandlePositionSet,
  ] = useState<HandlePosition | null>(null);

  const [draggingPreviewRectangle, draggingPreviewRectangleSet] =
    useState<PreviewRectangle | null>(null);

  const [draggingMouseDiff, draggingMouseDiffSet] = useState({
    top: 0,
    left: 0,
  });

  const [clonedDraggingElement, clonedDraggingElementSet] =
    useState<HTMLElement | null>(null);

  const [recalculateStylesInterval, recalculateStylesIntervalSet] =
    useState<ReturnType<typeof setInterval> | null>(null);

  const [initialGridItemsPositionData, initialGridItemsPositionDataSet] =
    useState<GridItemPositionsData>([]);
  const currentGridItemsPositionData = useDataStore(
    (state) => state.gridItemsPositions
  );

  console.log("currentGridItemsPositionData", currentGridItemsPositionData);

  const gridStyles = useGridStyles();

  const gridItemsIndexArray = Object.keys(currentGridItemsPositionData).map(
    (itemIndex) => Number(itemIndex)
  );

  console.log("gridItemsIndexArray", gridItemsIndexArray);

  const cellsCount = useGetCellsCount(gridElement);

  const [cellsToDropOver, cellsToDropOverSet] = useState<SelectedCellsList>({});

  const getGridOverlayItemStyle = (itemIndex: number) => {
    const position = currentGridItemsPositionData[itemIndex]?.position;

    return filterOutNullOrUndefinedValues(position) || undefined;
  };

  // I need to call this in other situations too, I don't know which deps
  useEffect(() => calculateItemsPosition(), []);
  function calculateItemsPosition() {
    // when moving an item, avoid updating the position since that'd replace the "displacement" positions
    if (currentlyMovingItemIndex !== null) {
      return;
    }

    initialGridItemsPositionDataSet([]);

    let itemsInGridCount = gridElement?.children.length;

    [...Array(itemsInGridCount)].forEach((_, itemIndex) => {
      initialGridItemsPositionData.push({
        position: getGridItemPosition(gridElement, itemIndex),
        wasItemMoved: false,
      });
    });
  }

  /***** DRAG START ******/
  const dragStartResizeArea = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
    position: HandlePosition
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };
  ////// DRAG END ///////

  // recalculateAllStylesAndPositions();
  return (
    <>
      <div
        className={classNames({
          "visual-grid__wrapper": true,
          // "visual-grid__dragging": currentlyMovingItemIndex !== null,
          // "visual-grid__resizing": currentlyResizingItemElement,
          // [`visual-grid__resizing-from-${currentResizingFromHandlePosition}`]:
          //   currentResizingFromHandlePosition,
          // "visual-grid__swapping": currentlySwappingAreas,
        })}
      >
        <div id={"grid"} className="visual-grid__items-grid" style={gridStyles}>
          {gridItemsIndexArray.map((itemIndex) => (
            <div
              key={itemIndex}
              className="visual-grid__item"
              style={getGridOverlayItemStyle(itemIndex)}
              // onMouseDown={(event) => mouseDownOnArea(event, itemIndex)}
              data-grid-item-index={itemIndex}
            >
              {!currentlySwappingAreas && !draggingElementNodeId && (
                <GridResizingHandles
                  onMouseDownTopLeft={(event) =>
                    dragStartResizeArea(event, itemIndex, "top-left")
                  }
                  onMouseDownTopRight={(event) =>
                    dragStartResizeArea(event, itemIndex, "top-right")
                  }
                  onMouseDownBottomLeft={(event) =>
                    dragStartResizeArea(event, itemIndex, "bottom-left")
                  }
                  onMouseDownBottomRight={(event) =>
                    dragStartResizeArea(event, itemIndex, "bottom-right")
                  }
                />
              )}
            </div>
          ))}
        </div>
        <div className="visual-grid__cells" style={gridStyles}>
          {Array.from({ length: cellsCount }, (_, index) => (
            <div
              key={index}
              className={`visual-grid__cell ${
                cellsToDropOver[index] ? "visual-grid__cell-area-hovering" : ""
              }`}
              data-grid-cell-index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}
