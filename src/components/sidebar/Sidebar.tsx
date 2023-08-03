import { Button, ButtonGroup, Text } from "@chakra-ui/react";

import "./styles.css";
import { NumberInputSlider } from "../../reusable-components/NumberInputSlider/NumberInputSlider.tsx";
import { useDataStore } from "../../store/store.ts";
import { CodeModal } from "../CodeModal/CodeModal.tsx";
import { BsEraserFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";

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
            <Text fontSize={16}>Columns Number</Text>

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
            <Text fontSize={16}>Rows Number</Text>

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

        <ButtonGroup
          variant={"outline"}
          colorScheme={"purple"}
          size={"sm"}
          mt={4}
          flexWrap={"wrap"}
          gap={3}
        >
          <Button onClick={resetGrid} leftIcon={<MdOutlineCancel />}>
            Reset grid
          </Button>

          <Button
            variant={removingItems ? "solid" : "outline"}
            onClick={() => updateFlag("removingItems", !removingItems)}
            leftIcon={<BsEraserFill />}
          >
            {removingItems ? "Removing items" : "Remove Items"}
          </Button>

          <CodeModal />
        </ButtonGroup>
      </div>
    </>
  );
}
