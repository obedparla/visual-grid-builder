import { VisualGrid } from "./components/VisualGrid/VisualGrid.tsx";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar/Sidebar.tsx";
import { useDataStore } from "./store/store.ts";
import { grid } from "@chakra-ui/react";
import { repeat, template } from "lodash";
import { Grid } from "./components/Grid/Grid.tsx";

export function App() {
  return (
    <>
      <div className="app__container">
        <Sidebar />

        <div className={"visual-grid__container"}>
          <VisualGrid />
        </div>
      </div>
    </>
  );
}
