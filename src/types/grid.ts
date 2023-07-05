export type PreviewRectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type HandlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

// the actual value in the store
export type ColumnAndRowPosition = {
  rowStart: string | undefined;
  rowEnd: string | undefined;
  columnStart: string | undefined;
  columnEnd: string | undefined;
};

export type SelectedCellsList = { [key: string]: boolean };
export type GridItemPositionsData = {
  position: GridItemPosition | null;
  wasItemMoved: boolean;
}[];

// the value in the UI
export type GridItemPosition = {
  gridColumnStart: number | null;
  gridColumnEnd: number | null;
  gridRowStart: number | null;
  gridRowEnd: number | null;
};
