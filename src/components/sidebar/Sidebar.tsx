import { Button, Flex, Text } from "@chakra-ui/react";

import "./styles.css";
import { NumberInputSlider } from "../../reusable-components/NumberInputSlider/NumberInputSlider.tsx";
import { useDataStore } from "../../store/store.ts";
import { GridCss } from "../GridCss/GridCss.tsx";

export function Sidebar() {
  const gridCss = useDataStore((state) => state.gridCss);
  const updateColumnsNumber = useDataStore((state) => state.updateGridCss);
  const updateFlag = useDataStore((state) => state.updateFlag);
  const removingItems = useDataStore((state) => state.flags.removingItems);

  const updateGridItemsPositionData = useDataStore(
    (state) => state.updateGridItemsPositions
  );

  function resetGrid() {
    updateGridItemsPositionData([]);
  }

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
              min={2}
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
              min={2}
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

        <Flex gap={4} flexWrap={"wrap"} mt={4}>
          <Button colorScheme="teal" variant="outline" onClick={resetGrid}>
            Reset grid
          </Button>

          <Button
            colorScheme="teal"
            variant={removingItems ? "solid" : "outline"}
            onClick={() => updateFlag("removingItems", !removingItems)}
          >
            {removingItems ? "Removing items" : "Remove Items"}
          </Button>
        </Flex>

        <GridCss />
      </div>
    </>
  );
}
