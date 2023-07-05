import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { GridItemPositionsData } from "../types/grid.ts";

interface Store {
  gridCss: {
    rowsNumber: number;
    columnsNumber: number;
    gap: number;
  };
  gridItemsPositions: GridItemPositionsData;

  updateGridCss: (gridCss: Store["gridCss"]) => void;
  addItem: () => void;
}

export const useDataStore = create<Store>()(
  subscribeWithSelector(
    immer((set) => ({
      gridCss: {
        rowsNumber: 3,
        columnsNumber: 3,
        gap: 8,
      },
      gridItemsPositions: [],

      // Actions
      updateGridCss: (newGridCss: Store["gridCss"]) =>
        set((state) => {
          state.gridCss = newGridCss;
        }),
      addItem: () =>
        set((state) => {
          state.gridItemsPositions.push({
            position: null,
            wasItemMoved: false,
          });
        }),
    }))
  )
);
