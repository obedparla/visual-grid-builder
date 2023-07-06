import { useEffect, useState } from "react";
import * as classNames from "classnames";
import GridResizingHandles from "../GridResizingHandles.tsx";
import {
  GridItemPositionsData,
  HandlePosition,
  PreviewRectangle,
  SelectedCellsList,
} from "../../types/grid.ts";
import {
  getContainerCellsWithinRectangle,
  getStartAndEndPositionsForRowAndColumnsFromCells,
} from "../../utils/grid.ts";

import "./grid.css";
import { useGetCellsCount, useGridStyles } from "../../hooks/grid-styles.ts";
import { useDataStore } from "../../store/store.ts";
import { getNumberOrNull } from "../../utils/type-conversion.ts";

export function VisualGrid() {
  const [gridElement, gridElementSet] = useState<HTMLElement | null>(null);

  useEffect(() => {
    gridElementSet(document.getElementById("grid"));
  }, []);

  const [currentlySwappingAreas, currentlySwappingAreasSet] = useState(false);
  const [currentlyMovingItemIndex, currentlyMovingItemIndexSet] = useState<
    number | null
  >(null);

  const [currentlyResizingItemElement, currentlyResizingItemElementSet] =
    useState<Element | null>(null);

  const [
    currentResizingFromHandlePosition,
    currentResizingFromHandlePositionSet,
  ] = useState<HandlePosition | null>(null);

  // rename to "draggingAreaRectangle"
  const [draggingPreviewRectangle, draggingPreviewRectangleSet] =
    useState<PreviewRectangle | null>(null);

  const [draggingMouseDiff, draggingMouseDiffSet] = useState({
    top: 0,
    left: 0,
  });

  const savedGridItemsPositionData = useDataStore(
    (state) => state.gridItemsPositions
  );
  const [currentGridItemsPositionData, currentGridItemsPositionDataSet] =
    useState<GridItemPositionsData>(savedGridItemsPositionData);

  const updateGridItemsPositionData = useDataStore(
    (state) => state.updateGridItemsPositions
  );

  useEffect(() => {
    currentGridItemsPositionDataSet(savedGridItemsPositionData);
  }, [savedGridItemsPositionData]);

  const gridStyles = useGridStyles();

  const gridItemsIndexArray = Object.keys(savedGridItemsPositionData).map(
    (itemIndex) => Number(itemIndex)
  );

  const cellsCount = useGetCellsCount(gridElement);

  const [cellsToDropOver, cellsToDropOverSet] = useState<SelectedCellsList>({});

  console.log("currentGridItemsPositionData", currentGridItemsPositionData);

  const getItemStyles = (itemIndex: number) => {
    const position = currentGridItemsPositionData[itemIndex]?.position;

    if (!position) return;

    return {
      gridColumnStart: position.gridColumnStart ?? undefined,
      gridColumnEnd: position.gridColumnEnd ?? undefined,
      gridRowStart: position.gridRowStart ?? undefined,
      gridRowEnd: position.gridRowEnd ?? undefined,
    };
  };

  /***** DRAG START ******/
  function dragStartResizeArea(
    e: React.MouseEvent<HTMLElement>,
    index: number,
    position: HandlePosition
  ) {
    e.preventDefault();
    e.stopPropagation();
  }

  function mouseDownOnArea(e: React.MouseEvent, index: number) {
    const target = e.target as HTMLElement | null;

    if (!target) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const { top, left, width, height } = target.getBoundingClientRect();

    // save the initial position so that the mouse stays within the element
    draggingMouseDiffSet({
      top: e.clientY - top,
      left: e.clientX - left,
    });

    draggingPreviewRectangleSet({
      width,
      height,
      top,
      left,
    });

    currentlyMovingItemIndexSet(index);

    populateCellsToDropOver();
  }

  function handleMouseMove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingPreviewRectangle) return;

    draggingPreviewRectangleSet({
      ...draggingPreviewRectangle,
      top: e.clientY - draggingMouseDiff.top,
      left: e.clientX - draggingMouseDiff.left,
    });

    populateCellsToDropOver();
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (currentlyMovingItemIndex) {
      updateGridItemsPositionData(currentGridItemsPositionData);
    }

    currentlyMovingItemIndexSet(null);
    currentlyResizingItemElementSet(null);
    draggingPreviewRectangleSet(null);
    draggingMouseDiffSet({ top: 0, left: 0 });
    cellsToDropOverSet({});
    currentResizingFromHandlePositionSet(null);
  }

  ////// DRAG END ///////

  function populateCellsToDropOver() {
    if (!draggingPreviewRectangle) return;

    const newCellsToDropOver = getContainerCellsWithinRectangle(
      draggingPreviewRectangle
    );

    updateCurrentGridItemsPositionData(newCellsToDropOver);
    cellsToDropOverSet(newCellsToDropOver);
  }

  function updateCurrentGridItemsPositionData(
    newCellsToDropOver: SelectedCellsList
  ) {
    if (!gridElement || currentlyMovingItemIndex === null) return;

    const currentlyMovingItemNewPosition =
      getStartAndEndPositionsForRowAndColumnsFromCells(
        gridElement,
        newCellsToDropOver
      );

    const newCurrentGridItemsPositionData = structuredClone(
      currentGridItemsPositionData
    );

    newCurrentGridItemsPositionData[currentlyMovingItemIndex] = {
      position: {
        gridRowStart: getNumberOrNull(currentlyMovingItemNewPosition.rowStart),
        gridColumnEnd: getNumberOrNull(
          currentlyMovingItemNewPosition.columnEnd
        ),
        gridColumnStart: getNumberOrNull(
          currentlyMovingItemNewPosition.columnStart
        ),
        gridRowEnd: getNumberOrNull(currentlyMovingItemNewPosition.rowEnd),
      },
      wasItemMoved: true,
    };

    currentGridItemsPositionDataSet(newCurrentGridItemsPositionData);
  }

  return (
    <>
      <div
        className={classNames({
          "visual-grid__wrapper": true,
          "visual-grid__dragging": currentlyMovingItemIndex !== null,
          // "visual-grid__resizing": currentlyResizingItemElement,
          // [`visual-grid__resizing-from-${currentResizingFromHandlePosition}`]:
          //   currentResizingFromHandlePosition,
          // "visual-grid__swapping": currentlySwappingAreas,
        })}
        onMouseMove={(event) => handleMouseMove(event)}
        onMouseUp={(event) => handleMouseUp(event)}
      >
        {draggingPreviewRectangle ? (
          <div
            className={"visual-grid__dragging-element visual-grid__item"}
            style={
              draggingPreviewRectangle
                ? {
                    ...draggingPreviewRectangle,
                    left: draggingPreviewRectangle.left - 300,
                  }
                : undefined
            }
          />
        ) : null}

        <div id={"grid"} className="visual-grid__items-grid" style={gridStyles}>
          {gridItemsIndexArray.map((itemIndex) => (
            <div
              key={itemIndex}
              className={classNames({
                "visual-grid__item": true,
                hide__item: itemIndex === currentlyMovingItemIndex,
              })}
              style={getItemStyles(itemIndex)}
              onMouseDown={(event) => mouseDownOnArea(event, itemIndex)}
              data-grid-item-index={itemIndex}
            >
              {!currentlySwappingAreas && !currentlyMovingItemIndex && (
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
