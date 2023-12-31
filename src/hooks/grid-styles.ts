import { useDataStore } from "../store/store.ts";
import { getCellsInGridCount } from "../lib/grid.ts";
import { useEffect, useState } from "react";
import type * as CSS from "csstype";

export function useGridStyles(): CSS.Properties {
  const gridCss = useDataStore((store) => store.gridCss);

  return {
    display: "grid",
    gridTemplateColumns: `repeat(${gridCss.columnsNumber}, minmax(10px, 1fr))`,
    gridTemplateRows: `repeat(${gridCss.rowsNumber}, minmax(100px, 1fr))`,
    gap: `${gridCss.gap}px`,
  };
}

export function useGetCellsCount(gridElement: HTMLElement | null) {
  const gridStyles = useGridStyles();

  const [cellsCount, cellsCountSet] = useState(0);

  useEffect(() => {
    cellsCountSet(getCellsInGridCount(gridElement));
  }, [
    gridElement,
    gridStyles.gridTemplateColumns,
    gridStyles.gridTemplateRows,
  ]);

  return cellsCount;
}
