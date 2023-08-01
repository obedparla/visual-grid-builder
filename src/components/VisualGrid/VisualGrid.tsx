import { useEffect, useState } from "react";
import * as classNames from "classnames";
import GridResizingHandles from "./components/GridResizingHandles.tsx";
import {
  GridItemPositionsData,
  HandlePosition,
  PreviewRectangle,
  SelectedCellsList,
} from "../../types/grid.ts";
import {
  getCellsWithinRectangle,
  getCellsWithinRectangleMidpoint,
  getSelectedCellsIndexes,
  getStartAndEndPositionsForRowAndColumnsFromCells,
  updatePreviewRectangleWhenResizing,
} from "../../utils/grid.ts";

import "./styles.css";
import { useGetCellsCount, useGridStyles } from "../../hooks/grid-styles.ts";
import { useDataStore } from "../../store/store.ts";
import { getNumberOrNull } from "../../utils/type-conversion.ts";
import { isEqual } from "lodash";

export function VisualGrid() {
  const [gridElement, gridElementSet] = useState<HTMLElement | null>(null);

  const removingItems = useDataStore((state) => state.flags.removingItems);
  const removeItem = useDataStore((state) => state.removeItem);
  const gap = useDataStore((store) => store.gridCss.gap);

  // Set grid Element on "mount"
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

  // Update the current positions when we commit new positions after dragging/resizing
  useEffect(() => {
    currentGridItemsPositionDataSet(savedGridItemsPositionData);
  }, [savedGridItemsPositionData]);

  const gridStyles = useGridStyles();

  const gridItemsIndexArray = Object.keys(savedGridItemsPositionData).map(
    (itemIndex) => Number(itemIndex)
  );

  const cellsCount = useGetCellsCount(gridElement);

  const [cellsToDropOver, cellsToDropOverSet] = useState<SelectedCellsList>({});

  function getItemStyles(itemIndex: number) {
    const position = currentGridItemsPositionData[itemIndex]?.position;

    if (!position) return;

    return {
      gridColumnStart: position.gridColumnStart ?? undefined,
      gridColumnEnd: position.gridColumnEnd ?? undefined,
      gridRowStart: position.gridRowStart ?? undefined,
      gridRowEnd: position.gridRowEnd ?? undefined,
    };
  }

  /***** DRAG START ******/
  function dragStartResizeArea(
    e: React.MouseEvent<HTMLElement>,
    index: number,
    position: HandlePosition
  ) {
    e.preventDefault();
    e.stopPropagation();

    const itemElement = (e.target as HTMLElement).closest(".visual-grid__item");

    if (!itemElement) return;

    const { top, left, width, height } = itemElement.getBoundingClientRect();

    currentlyResizingItemElementSet(itemElement);
    currentlyMovingItemIndexSet(index);
    currentResizingFromHandlePositionSet(position);
    draggingPreviewRectangleSet({
      width,
      height,
      top,
      left,
    });
  }

  function handleMouseDownOnArea(e: React.MouseEvent, index: number) {
    const target = e.target as HTMLElement | null;

    if (!target) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (removingItems) {
      removeItem(index);

      return;
    }

    const { top, left, width, height } = target.getBoundingClientRect();

    // save the delta to calculate the diff and leave the mouse in the same spot within the element
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
  }

  function handleMouseMove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingPreviewRectangle) return;

    if (currentlyResizingItemElement) {
      resizeAreaOnMouseMove(e);
    } else {
      draggingPreviewRectangleSet({
        ...draggingPreviewRectangle,
        top: e.clientY - draggingMouseDiff.top,
        left: e.clientX - draggingMouseDiff.left,
      });
    }
  }

  function resizeAreaOnMouseMove(e: React.MouseEvent) {
    if (!draggingPreviewRectangle) return;

    const newDraggingPreviewRectangle = updatePreviewRectangleWhenResizing(
      e.clientX,
      e.clientY,
      draggingPreviewRectangle,
      currentResizingFromHandlePosition
    );

    // compare the new "position" (aka active cells) with the old one
    const initialCells = getCellsWithinRectangle(draggingPreviewRectangle);
    const finalCells = getCellsWithinRectangle(newDraggingPreviewRectangle);

    if (isEqual(initialCells, finalCells)) {
      return;
    }

    const cellIndexes = getSelectedCellsIndexes(finalCells);
    if (cellIndexes.length === 0) return;

    const cellElements = document.querySelectorAll(".visual-grid__cell");

    if (cellElements.length === 0) return;

    const firstCell = cellElements[cellIndexes[0]].getBoundingClientRect();
    const lastCell =
      cellElements[cellIndexes[cellIndexes.length - 1]].getBoundingClientRect();

    draggingPreviewRectangleSet({
      left: firstCell.left,
      top: firstCell.top,
      width: lastCell.right - firstCell.left,
      height: lastCell.bottom - firstCell.top,
    });
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

  useEffect(() => {
    function updateCellsToDropOverWhenPreviewRectangleChanges() {
      if (!draggingPreviewRectangle) {
        return;
      }

      const newCellsToDropOver = getCellsWithinRectangleMidpoint(
        draggingPreviewRectangle,
        gap
      );

      cellsToDropOverSet(newCellsToDropOver);
    }

    updateCellsToDropOverWhenPreviewRectangleChanges();
  }, [draggingPreviewRectangle, gap]);

  useEffect(() => {
    function updateCurrentPositionWhenPreviewRectangleChanges() {
      if (
        !draggingPreviewRectangle ||
        !gridElement ||
        currentlyMovingItemIndex === null
      ) {
        return;
      }

      const newCellsToDropOver = getCellsWithinRectangleMidpoint(
        draggingPreviewRectangle,
        gap
      );

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
          gridRowStart: getNumberOrNull(
            currentlyMovingItemNewPosition.rowStart
          ),
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

      // No need to update if positions are the same.
      // Prevents going into an infinite loop of updates caused by changing state that is in the deps
      // since React dep's compares objects by reference
      if (
        !isEqual(newCurrentGridItemsPositionData, currentGridItemsPositionData)
      ) {
        currentGridItemsPositionDataSet(newCurrentGridItemsPositionData);
      }
    }

    updateCurrentPositionWhenPreviewRectangleChanges();
  }, [
    currentGridItemsPositionData,
    currentlyMovingItemIndex,
    draggingPreviewRectangle,
    gridElement,
    gap,
  ]);

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
            style={draggingPreviewRectangle || undefined}
          />
        ) : null}

        <div id={"grid"} className="visual-grid__items-grid" style={gridStyles}>
          {gridItemsIndexArray.map((itemIndex) => (
            <div
              key={itemIndex}
              className={classNames({
                "visual-grid__item": true,
                hide__item: itemIndex === currentlyMovingItemIndex,
                "visual-grid__removing-items": removingItems,
              })}
              style={getItemStyles(itemIndex)}
              onMouseDown={(event) => handleMouseDownOnArea(event, itemIndex)}
              data-grid-item-index={itemIndex}
            >
              <div className={"visual-grid__item-index"}>{itemIndex + 1}</div>

              {removingItems ? (
                <div className={"visual-grid__remove-item"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                  >
                    <path d="M393.4 41.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L269.3 256 438.6 425.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 301.3 54.6 470.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0L224 210.7 393.4 41.4z" />
                  </svg>
                </div>
              ) : null}

              {!removingItems &&
                !currentlySwappingAreas &&
                !currentlyMovingItemIndex && (
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
                cellsToDropOver[index] ? "visual-grid__populated-cell" : ""
              }`}
              data-grid-cell-index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}
