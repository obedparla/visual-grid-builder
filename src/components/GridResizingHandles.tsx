import React, { MouseEvent } from "react";

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
    ></div>
    <div
      className="visual-grid__resizing-handle__top-right"
      onMouseDown={onMouseDownTopRight}
    ></div>
    <div
      className="visual-grid__resizing-handle__bottom-left"
      onMouseDown={onMouseDownBottomLeft}
    ></div>
    <div
      className="visual-grid__resizing-handle__bottom-right"
      onMouseDown={onMouseDownBottomRight}
    ></div>
  </div>
);

export default GridResizingHandles;
