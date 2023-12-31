import { Button, ButtonGroup, Divider, Flex, Text } from "@chakra-ui/react";

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

        <Divider mt={4} />

        <ButtonGroup
          className={"sidebar__button-group"}
          colorScheme={"purple"}
          size={"sm"}
          mt={4}
          gap={3}
          spacing={0}
        >
          <Flex gap={3} className={"sidebar__action-buttons"}>
            <Button
              onClick={resetGrid}
              leftIcon={<MdOutlineCancel />}
              variant={"outline"}
            >
              Reset
            </Button>

            <Button
              variant={removingItems ? "solid" : "outline"}
              onClick={() => updateFlag("removingItems", !removingItems)}
              leftIcon={<BsEraserFill />}
            >
              {removingItems ? "Removing" : "Remove Items"}
            </Button>
          </Flex>

          <CodeModal />
        </ButtonGroup>
      </div>
    </>
  );
}
