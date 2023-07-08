import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector, persist } from "zustand/middleware";
import { GridItemPositionsData } from "../types/grid.ts";
import { merge } from "lodash";

interface Store {
  gridCss: {
    rowsNumber: number;
    columnsNumber: number;
    gap: number;
  };
  gridItemsPositions: GridItemPositionsData;

  updateGridCss: (gridCss: Store["gridCss"]) => void;
  addItem: () => void;
  updateGridItemsPositions: (
    newGridItemsPositions: GridItemPositionsData
  ) => void;
}

export const useDataStore = create<Store>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        gridCss: {
          rowsNumber: 7,
          columnsNumber: 7,
          gap: 8,
        },
        gridItemsPositions: [],

        // Actions
        updateGridCss: (newGridCss: Store["gridCss"]) =>
          set((state) => {
            state.gridCss = newGridCss;
          }),
        addItem: () => {
          set((state) => {
            state.gridItemsPositions.push({
              position: null,
              wasItemMoved: false,
            });
          });
        },
        updateGridItemsPositions: (newGridItemsPositions) => {
          set((state) => {
            state.gridItemsPositions = newGridItemsPositions;
          });
        },
      })),
      // default saving to localStorage as persistent store
      {
        name: "visual_grid_store",
        version: 1,
        // deep merge to avoid lossing data not saved in the persistent store
        merge: (persistedState, currentState) =>
          merge(currentState, persistedState),
      }
    )
  )
);
