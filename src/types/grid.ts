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
  rowStart: string | null;
  rowEnd: string | null;
  columnStart: string | null;
  columnEnd: string | null;
};

export type SelectedCellsList = { [key: string]: boolean };
export type GridItemPositionsData = {
  position: GridItemPosition | null;
  wasItemMoved: boolean;
}[];

export type GridItemPosition = {
  gridColumnStart: number | null;
  gridColumnEnd: number | null;
  gridRowStart: number | null;
  gridRowEnd: number | null;
};
