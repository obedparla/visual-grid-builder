import { Button, Text } from "@chakra-ui/react";

import "./sidebar.css";
import { NumberInputSlider } from "../../reusable-components/NumberInputSlider/NumberInputSlider.tsx";
import { useDataStore } from "../../store/store.ts";

export function Sidebar() {
  const gridCss = useDataStore((state) => state.gridCss);
  const updateColumnsNumber = useDataStore((state) => state.updateGridCss);
  const addItem = useDataStore((state) => state.addItem);

  return (
    <>
      <div className="sidebar__container">
        <div>
          <div>
            <Text fontSize={16}>Grid Columns Number</Text>

            <NumberInputSlider
              value={gridCss.columnsNumber}
              onChange={(columnsNumber: number) =>
                updateColumnsNumber({ ...gridCss, columnsNumber })
              }
              min={3}
              max={20}
            />
          </div>

          <div>
            <Text fontSize={16}>Grid Rows Number</Text>

            <NumberInputSlider
              value={gridCss.rowsNumber}
              onChange={(rowsNumber: number) =>
                updateColumnsNumber({ ...gridCss, rowsNumber: rowsNumber })
              }
              min={3}
              max={20}
            />
          </div>

          <div>
            <Text fontSize={16}>Gap</Text>

            <NumberInputSlider
              value={gridCss.gap}
              onChange={(gap: number) =>
                updateColumnsNumber({ ...gridCss, gap })
              }
              min={0}
              max={30}
            />
          </div>
        </div>

        <Button colorScheme="teal" variant="outline" mt={4} onClick={addItem}>
          Add Grid Item
        </Button>
      </div>
    </>
  );
}
