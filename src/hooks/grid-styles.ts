import { useDataStore } from "../store/store.ts";
import { getCountCellsInGrid } from "../utils/grid.ts";
import { useEffect, useState } from "react";
import type * as CSS from "csstype";

export function useGridStyles(): CSS.Properties {
  const gridCss = useDataStore((store) => store.gridCss);

  return {
    gridTemplateColumns: `repeat(${gridCss.columnsNumber}, minmax(auto, 1fr))`,
    gridTemplateRows: `repeat(${gridCss.rowsNumber}, minmax(100px, 1fr))`,
    gap: `${gridCss.gap}px`,
  };
}

export function useGetCellsCount(gridElement: HTMLElement | null) {
  const gridStyles = useGridStyles();

  const [cellsCount, cellsCountSet] = useState(0);

  useEffect(() => {
    cellsCountSet(getCountCellsInGrid(gridElement));
  }, [gridStyles.gridTemplateColumns, gridStyles.gridTemplateRows]);

  return cellsCount;
}
