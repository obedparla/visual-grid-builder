import { useGridStyles } from "../../hooks/grid-styles.ts";

export function Grid() {
  const gridStyles = useGridStyles();

  return <div id="grid" style={gridStyles}></div>;
}
