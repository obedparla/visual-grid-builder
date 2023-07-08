import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector, persist } from "zustand/middleware";
import { GridItemPositionsData } from "../types/grid.ts";
import { merge } from "lodash";

interface state {
  gridCss: {
    rowsNumber: number;
    columnsNumber: number;
    gap: number;
  };
  gridItemsPositions: GridItemPositionsData;
  flags: {
    removingItems: boolean;
  };
}

interface actions {
  updateGridCss: (gridCss: Store["gridCss"]) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateGridItemsPositions: (
    newGridItemsPositions: GridItemPositionsData
  ) => void;
  updateFlag: (flag: keyof state["flags"], newState: boolean) => void;
}

interface Store extends state, actions {}

const defaultState: state = {
  gridCss: {
    rowsNumber: 7,
    columnsNumber: 7,
    gap: 8,
  },
  gridItemsPositions: [],
  flags: {
    removingItems: false,
  },
};

export const useDataStore = create<Store>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        ...defaultState,

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
        removeItem: (index) => {
          set((state) => {
            state.gridItemsPositions.splice(index, 1);
          });
        },
        updateGridItemsPositions: (newGridItemsPositions) => {
          set((state) => {
            state.gridItemsPositions = newGridItemsPositions;
          });
        },
        updateFlag: (flag, newState) => {
          set((state) => {
            state.flags[flag] = newState;
          });
        },
      })),
      // default saving to localStorage as persistent store
      {
        name: "visual_grid_store",
        version: 1,
        // deep merge to avoid lossing data not saved in the persistent store
        merge: (persistedState, currentState) => {
          return merge(currentState, persistedState);
        },
        // https://docs.pmnd.rs/zustand/integrations/persisting-store-data#partialize
        partialize: (state) => {
          const keysFromStateToIgnore = ["flags"];

          return Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !keysFromStateToIgnore.includes(key)
            )
          );
        },
      }
    )
  )
);
