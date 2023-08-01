import { useGridStyles } from "../../hooks/grid-styles.ts";
import { useDataStore } from "../../store/store.ts";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FaCopy, FaCheck } from "react-icons/fa6";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import copyToClipboard from "copy-to-clipboard";

import "./styles.css";
import { useState } from "react";

SyntaxHighlighter.registerLanguage("css", css);

export function GridCss() {
  const gridStyles = useGridStyles();
  const itemsPositions = useDataStore((state) => state.gridItemsPositions);
  const isModalOpen = useDataStore((state) => state.flags.isModalOpen);
  const updateFlag = useDataStore((state) => state.updateFlag);

  const [isCopied, isCopiedSet] = useState(false);

  const gridCss = Object.entries(gridStyles).reduce((acc, [key, value]) => {
    acc = `${acc}
  ${key}: ${value};`;

    return acc;
  }, "");

  let itemIndex = 0;
  const itemsCss = itemsPositions.reduce((acc, itemPosition) => {
    itemIndex++;

    if (
      !itemPosition.position?.gridColumnStart &&
      !itemPosition.position?.gridColumnEnd &&
      !itemPosition.position?.gridRowStart &&
      !itemPosition.position?.gridRowEnd
    ) {
      return acc;
    }

    return `${acc}.grid-item-${itemIndex} {
  ${
    itemPosition.position?.gridColumnStart
      ? `grid-column-start: ${itemPosition.position.gridColumnStart};`
      : ""
  }
  ${
    itemPosition.position?.gridColumnEnd
      ? `grid-column-end: ${itemPosition.position.gridColumnEnd};`
      : ""
  }
  ${
    itemPosition.position?.gridRowStart
      ? `grid-row-start: ${itemPosition.position.gridRowStart};`
      : ""
  }
  ${
    itemPosition.position?.gridRowEnd
      ? `grid-row-end: ${itemPosition.position.gridRowEnd};`
      : ""
  }
}

`;
  }, "");

  // white space matters here
  const cssText = `/* Grid CSS */
.grid {${gridCss}
}

/* Items CSS */
${itemsCss}`;

  function copyCssToClipboard() {
    copyToClipboard(cssText);
    isCopiedSet(true);

    setTimeout(() => {
      isCopiedSet(false);
    }, 1000);
  }

  return (
    <>
      <Button
        colorScheme="teal"
        variant="outline"
        mt={4}
        onClick={() => {
          updateFlag("isModalOpen", true);
        }}
      >
        See CSS
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          updateFlag("isModalOpen", false);
        }}
        isCentered
        size={"xl"}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>CSS for Grid</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SyntaxHighlighter language="css" style={prism}>
              {cssText}
            </SyntaxHighlighter>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                updateFlag("isModalOpen", false);
              }}
              mr={3}
            >
              Close
            </Button>
            <Button
              colorScheme={"blue"}
              onClick={copyCssToClipboard}
              rightIcon={isCopied ? <FaCheck /> : <FaCopy />}
            >
              {isCopied ? "Copied" : "Copy styles"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
