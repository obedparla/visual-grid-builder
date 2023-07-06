import {
  ColumnAndRowPosition,
  PreviewRectangle,
  SelectedCellsList,
} from "../types/grid.ts";
import { isElementWithinBoundingRectangle } from "./dom.ts";
export function getCountCellsInGrid(gridElement: Element | null) {
  if (!gridElement) return 0;
  const { columnWidths, rowHeights } = getGridRowsAndColumnsValue(gridElement);

  return columnWidths.length * rowHeights.length;
}

export function getGridRowsAndColumnsValue(gridElement: Element) {
  // https://stackoverflow.com/questions/55204205/a-way-to-count-columns-in-a-responsive-grid
  // The browser calculates the columns and rows when creating the grid, regardless of the fancy css values provided to it
  // Just read them directly
  const { gridTemplateColumns, gridTemplateRows } =
    window.getComputedStyle(gridElement);

  // The columns are returned as pure px values in a single string "100 250 300"
  const columnWidths = gridTemplateColumns
    .split(" ")
    .map((width) => parseFloat(width));

  const rowHeights = gridTemplateRows
    .split(" ")
    .map((height) => parseFloat(height));

  const totalColumnWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  const totalRowHeight = rowHeights.reduce((sum, height) => sum + height, 0);

  return {
    columnWidths,
    totalColumnWidth,
    rowHeights,
    totalRowHeight,
  };
}

export function getContainerCellsWithinRectangle(
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

export function getOnlySelectedCellsIndexesArray(
  selectedCells: SelectedCellsList
) {
  // turn selected cells from {'1': true, '2': false, '3': true}.
  // into [1, 3]
  return Object.entries(selectedCells)
    .filter(([, value]) => value)
    .map(([key]) => parseInt(key));
}

function getColumnAndRowByCellIndex(gridElement: Element, index: number) {
  const { columnWidths } = getGridRowsAndColumnsValue(gridElement);

  // grid rows and columns start at 1 and not 0
  const rowPosition = Math.floor(index / columnWidths.length) + 1;
  const columnPosition = (index % columnWidths.length) + 1;

  return { row: rowPosition, column: columnPosition };
}

export function getStartAndEndPositionsForRowAndColumnsFromCells(
  gridElement: Element,
  selectedCells: SelectedCellsList
): ColumnAndRowPosition {
  const cellIndexes = getOnlySelectedCellsIndexesArray(selectedCells);

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
