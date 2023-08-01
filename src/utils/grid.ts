import {
  ColumnAndRowPosition,
  GridItemPosition,
  GridItemPositionsData,
  HandlePosition,
  PreviewRectangle,
  SelectedCellsList,
} from "../types/grid.ts";
import {
  isElementWithinBoundingRectangle,
  isElementWithinMidPointOfRectangle,
} from "./dom.ts";

export function getCellsInGridCount(gridElement: Element | null) {
  if (!gridElement) return 0;

  const { numberOfColumns, numberOfRows } =
    getGridRowsAndColumnsValue(gridElement);

  return numberOfRows * numberOfColumns;
}

export function getGridRowsAndColumnsValue(gridElement: Element) {
  // https://stackoverflow.com/questions/55204205/a-way-to-count-columns-in-a-responsive-grid
  // The browser calculates the columns and rows when creating the grid, regardless of the fancy css values provided to it
  // Just read them directly
  const { gridTemplateColumns, gridTemplateRows } =
    window.getComputedStyle(gridElement);

  const numberOfColumns = gridTemplateColumns.split(" ").length;

  const numberOfRows = gridTemplateRows.split(" ").length;

  return {
    numberOfColumns: numberOfColumns,
    numberOfRows: numberOfRows,
  };
}

export function getCellsWithinRectangle(
  selectedItemRectangle: PreviewRectangle
) {
  const containedCells: SelectedCellsList = {};
  const cellElements = document.querySelectorAll(
    ".visual-grid__cell"
  ) as NodeListOf<HTMLElement>;

  cellElements.forEach((e) => {
    if (!e.dataset.gridCellIndex) return;

    containedCells[e.dataset.gridCellIndex] = isElementWithinBoundingRectangle(
      selectedItemRectangle,
      e.getBoundingClientRect()
    );
  });

  return containedCells;
}

export function getCellsWithinRectangleMidpoint(
  selectedItemRectangle: PreviewRectangle,
  gap: number
) {
  const containedCells: SelectedCellsList = {};
  const cellElements = document.querySelectorAll(
    ".visual-grid__cell"
  ) as NodeListOf<HTMLElement>;

  cellElements.forEach((e) => {
    if (!e.dataset.gridCellIndex) return;

    containedCells[e.dataset.gridCellIndex] =
      isElementWithinMidPointOfRectangle(
        selectedItemRectangle,
        e.getBoundingClientRect(),
        gap
      );
  });

  return containedCells;
}

export function getSelectedCellsIndexes(selectedCells: SelectedCellsList) {
  // turn selected cells from {'1': true, '2': false, '3': true}.
  // into [1, 3]
  return Object.entries(selectedCells)
    .filter(([, value]) => value)
    .map(([key]) => parseInt(key));
}

function getColumnAndRowByCellIndex(gridElement: Element, index: number) {
  const { numberOfColumns } = getGridRowsAndColumnsValue(gridElement);

  // grid rows and columns start at 1 and not 0
  const rowPosition = Math.floor(index / numberOfColumns) + 1;
  const columnPosition = (index % numberOfColumns) + 1;

  return { row: rowPosition, column: columnPosition };
}

export function getStartAndEndPositionsForRowAndColumnsFromCells(
  gridElement: Element,
  selectedCells: SelectedCellsList
): ColumnAndRowPosition {
  const cellIndexes = getSelectedCellsIndexes(selectedCells);

  let rowStart: number | null = null;
  let rowEnd: number | null = null;
  let columnStart: number | null = null;
  let columnEnd: number | null = null;

  cellIndexes.forEach((cellIndexToDrop) => {
    const { row, column } = getColumnAndRowByCellIndex(
      gridElement,
      cellIndexToDrop
    );

    if (rowStart === null || row < rowStart) {
      rowStart = row;
    }

    if (rowEnd === null || row > rowEnd) {
      rowEnd = row;
    }

    if (columnStart === null || column < columnStart) {
      columnStart = column;
    }

    if (columnEnd === null || column > columnEnd) {
      columnEnd = column;
    }
  });

  return {
    rowStart: rowStart && `${rowStart}`,
    columnStart: columnStart && `${columnStart}`,
    // the cells end in the next position
    rowEnd: rowEnd && `${rowEnd + 1}`,
    columnEnd: columnEnd && `${columnEnd + 1}`,
  };
}

export function updatePreviewRectangleWhenResizing(
  clientX: number,
  clientY: number,
  draggingPreviewRectangle: PreviewRectangle,
  resizingFromPosition: HandlePosition | null
): PreviewRectangle {
  if (!resizingFromPosition) return draggingPreviewRectangle;

  const updatedDraggingPreviewRectangle = structuredClone(
    draggingPreviewRectangle
  );

  const previewRectanglePosition = {
    right:
      updatedDraggingPreviewRectangle.left +
      updatedDraggingPreviewRectangle.width,
    left: updatedDraggingPreviewRectangle.left,
    top: updatedDraggingPreviewRectangle.top,
    bottom:
      updatedDraggingPreviewRectangle.top +
      updatedDraggingPreviewRectangle.height,
  };

  const updatePreviewRectangleWhenDraggingLeft = () => {
    if (clientX < previewRectanglePosition.right) {
      const leftDelta = updatedDraggingPreviewRectangle.left - clientX;

      updatedDraggingPreviewRectangle.left = clientX;
      updatedDraggingPreviewRectangle.width += leftDelta;
    }
  };

  const updatePreviewRectangleWhenDraggingUp = () => {
    if (clientY < previewRectanglePosition.bottom) {
      const topDelta = updatedDraggingPreviewRectangle.top - clientY;

      updatedDraggingPreviewRectangle.top = clientY;
      updatedDraggingPreviewRectangle.height += topDelta;
    }
  };

  const updatePreviewRectangleWhenDraggingDown = () => {
    if (clientY > previewRectanglePosition.top) {
      updatedDraggingPreviewRectangle.height =
        clientY - updatedDraggingPreviewRectangle.top;
    }
  };

  const updatePreviewRectangleWhenDraggingRight = () => {
    if (clientX > previewRectanglePosition.left) {
      updatedDraggingPreviewRectangle.width =
        clientX - updatedDraggingPreviewRectangle.left;
    }
  };

  if (resizingFromPosition === "top-left") {
    updatePreviewRectangleWhenDraggingLeft();
    updatePreviewRectangleWhenDraggingUp();
  } else if (resizingFromPosition === "bottom-left") {
    updatePreviewRectangleWhenDraggingLeft();
    updatePreviewRectangleWhenDraggingDown();
  } else if (resizingFromPosition === "top-right") {
    updatePreviewRectangleWhenDraggingRight();
    updatePreviewRectangleWhenDraggingUp();
  } else if (resizingFromPosition === "bottom-right") {
    updatePreviewRectangleWhenDraggingRight();
    updatePreviewRectangleWhenDraggingDown();
  }

  return updatedDraggingPreviewRectangle;
}

/***** Start - Displacement logic *****/

// find out which element is within the column and row
function getItemsInCell(
  gridElement: Element,
  cellIndex: number,
  gridItemsPositionMap: GridItemPositionsData
): number[] {
  const columnAndRow = getColumnAndRowByCellIndex(gridElement, cellIndex);

  if (columnAndRow === null) {
    return [];
  }

  const { column, row } = columnAndRow;

  const itemsIndex = gridItemsPositionMap.map((item, itemIndex) => {
    const itemPosition = structuredClone(item.position);

    if (itemPosition === null) {
      return null;
    }

    if (
      (itemPosition.gridColumnStart === null ||
        itemPosition.gridColumnStart <= column) &&
      (itemPosition.gridColumnEnd === null ||
        itemPosition.gridColumnEnd > column) &&
      (itemPosition.gridRowStart === null ||
        itemPosition.gridRowStart <= row) &&
      (itemPosition.gridRowEnd === null || itemPosition.gridRowEnd > row)
    ) {
      return itemIndex;
    }

    return null;
  });

  return itemsIndex.filter((index): index is number => index !== null);
}

function getItemsIndexBeingDisplaced(
  gridElement: Element,
  selectedCells: number[],
  gridItemsPositionMap: GridItemPositionsData,
  currentlyMovingItemIndex: number
) {
  return [
    // unique items
    ...new Set(
      selectedCells
        .flatMap((cell) =>
          getItemsInCell(gridElement, cell, gridItemsPositionMap)
        )
        .filter((itemIndex) => itemIndex !== currentlyMovingItemIndex)
    ),
  ];
}

// Calculate the cells with math and not DOM rectangle like usual
// because we haven't committed these positions yet
function getCellsWithinItemPosition(
  itemPosition: GridItemPosition | null,
  totalColumns: number
) {
  if (
    !itemPosition ||
    itemPosition.gridRowStart === null ||
    itemPosition.gridColumnEnd === null ||
    itemPosition.gridColumnStart === null ||
    itemPosition.gridRowEnd === null
  ) {
    return [];
  }

  const cellsContainedByItem = [];

  for (
    let row = itemPosition.gridRowStart;
    row < itemPosition.gridRowEnd;
    row++
  ) {
    for (
      let col = itemPosition.gridColumnStart;
      col < itemPosition.gridColumnEnd;
      col++
    ) {
      // Subtract 1 from row and col to account for CSS grid starting at 1
      const index = (row - 1) * totalColumns + (col - 1);

      cellsContainedByItem.push(index);
    }
  }

  return cellsContainedByItem;
}

export function maybeDisplaceItemsAndGetNewPositions(
  gridElement: Element,
  selectedCells: number[],
  gridItemsPositionMapArg: GridItemPositionsData,
  currentlyMovingItemIndex: number,
  overlapItemsEnabled: boolean
): GridItemPositionsData {
  const gridItemsPositionMap = structuredClone(gridItemsPositionMapArg);

  if (overlapItemsEnabled) {
    return gridItemsPositionMap;
  }

  const itemsIndexBeingDisplaced = getItemsIndexBeingDisplaced(
    gridElement,
    selectedCells,
    gridItemsPositionMap,
    currentlyMovingItemIndex
  );

  if (!itemsIndexBeingDisplaced.length) {
    return gridItemsPositionMap;
  }

  const { numberOfColumns } = getGridRowsAndColumnsValue(gridElement);

  let newGridItemsPositionMap = structuredClone(gridItemsPositionMap);

  // Find a position where the displaced items won't interfere with the "moving item"
  itemsIndexBeingDisplaced.forEach((itemIndex) => {
    const newPosition = structuredClone(
      gridItemsPositionMap[itemIndex].position
    );

    if (itemIndex === currentlyMovingItemIndex || !newPosition) {
      return;
    }

    // Move the element down one row
    // Note: I tried more fancy algorithms. Moving the item to the right if it had space, otherwise down
    // it behaves nicely on *some* layouts and terribly on others. It can alter the layout of the grid, which is bad
    // Only moving them down makes it predictable
    newPosition.gridRowStart =
      newPosition.gridRowStart && newPosition.gridRowStart + 1;
    newPosition.gridRowEnd =
      newPosition.gridRowEnd && newPosition.gridRowEnd + 1;

    newGridItemsPositionMap[itemIndex] = {
      wasItemMoved: true,
      position: newPosition,
    };
  });

  const itemsIndexToStillDisplace = getItemsIndexBeingDisplaced(
    gridElement,
    selectedCells,
    newGridItemsPositionMap,
    currentlyMovingItemIndex
  );

  if (!itemsIndexToStillDisplace.length) {
    // After finishing displacing the "direct items", check if those need to displace other items in turn
    // This prevents moving items before we know the final positions of the "direct items"
    itemsIndexBeingDisplaced.forEach((itemIndex) => {
      if (itemIndex === currentlyMovingItemIndex) return;

      const cellsCurrentItemIsOver = getCellsWithinItemPosition(
        newGridItemsPositionMap[itemIndex].position,
        numberOfColumns
      );

      const newGridItemPositions = maybeDisplaceItemsAndGetNewPositions(
        gridElement,
        cellsCurrentItemIsOver,
        newGridItemsPositionMap,
        itemIndex,
        overlapItemsEnabled
      );

      if (newGridItemPositions) {
        newGridItemsPositionMap = newGridItemPositions;
      }
    });

    return newGridItemsPositionMap;
  }

  // keep displacing the item until it finds its correct position
  return maybeDisplaceItemsAndGetNewPositions(
    gridElement,
    selectedCells,
    newGridItemsPositionMap,
    currentlyMovingItemIndex,
    overlapItemsEnabled
  );
}

/***** END - Displacement logic *****/
