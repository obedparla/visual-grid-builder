import { VisualGrid } from "./components/VisualGrid/VisualGrid.tsx";
import { Sidebar } from "./components/sidebar/Sidebar.tsx";

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
