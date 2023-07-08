import React, { MouseEvent } from "react";
import { ChevronIcon } from "./ChevronIcon.tsx";

interface GridResizingHandlesProps {
  onMouseDownTopLeft: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseDownTopRight: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseDownBottomLeft: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseDownBottomRight: (event: MouseEvent<HTMLDivElement>) => void;
}

const GridResizingHandles: React.FC<GridResizingHandlesProps> = ({
  onMouseDownTopLeft,
  onMouseDownTopRight,
  onMouseDownBottomLeft,
  onMouseDownBottomRight,
}) => (
  <div className="visual-grid__resizing-handles">
    <div
      className="visual-grid__resizing-handle__top-left"
      onMouseDown={onMouseDownTopLeft}
    >
      <ChevronIcon />
    </div>
    <div
      className="visual-grid__resizing-handle__top-right"
      onMouseDown={onMouseDownTopRight}
    >
      <ChevronIcon />
    </div>
    <div
      className="visual-grid__resizing-handle__bottom-left"
      onMouseDown={onMouseDownBottomLeft}
    >
      <ChevronIcon />
    </div>
    <div
      className="visual-grid__resizing-handle__bottom-right"
      onMouseDown={onMouseDownBottomRight}
    >
      <ChevronIcon />
    </div>
  </div>
);

export default GridResizingHandles;
