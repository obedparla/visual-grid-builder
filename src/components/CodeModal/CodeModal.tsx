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
import prism from "react-syntax-highlighter/dist/esm/styles/prism/darcula";
import copyToClipboard from "copy-to-clipboard";

import "./styles.css";
import { useState } from "react";

SyntaxHighlighter.registerLanguage("css", css);

export function CodeModal() {
  const gridStyles = useGridStyles();
  const itemsPositions = useDataStore((state) => state.gridItemsPositions);
  const isModalOpen = useDataStore((state) => state.flags.isModalOpen);
  const updateFlag = useDataStore((state) => state.updateFlag);

  const [gridAreaShorthand, gridAreaShorthandSet] = useState(true);
  const [showHtml, showHtmlSet] = useState(false);

  const [isCopied, isCopiedSet] = useState(false);

  let itemIndex = 0;

  const itemsCss = itemsPositions.reduce((acc, itemPosition) => {
    itemIndex++;

    if (
      !itemPosition.position ||
      itemPosition.position.gridColumnStart === null ||
      itemPosition.position.gridColumnEnd === null ||
      itemPosition.position.gridRowStart === null ||
      itemPosition.position.gridRowEnd === null
    ) {
      return acc;
    }

    if (gridAreaShorthand) {
      return `${acc}.grid-item-${itemIndex} { grid-area: ${itemPosition.position.gridRowStart} / ${itemPosition.position.gridColumnStart} / ${itemPosition.position.gridRowEnd} / ${itemPosition.position.gridColumnEnd}; }
`;
    } else {
      return `${acc}.grid-item-${itemIndex} {
  grid-column-start: ${itemPosition.position.gridColumnStart};
  grid-column-end: ${itemPosition.position.gridColumnEnd};
  grid-row-start: ${itemPosition.position.gridRowStart};
  grid-row-end: ${itemPosition.position.gridRowEnd};
}

`;
    }
  }, "");

  // white space matters here
  const cssText = `/* Grid CSS */
.grid {
  display: grid;
  grid-template-columns: ${gridStyles.gridTemplateColumns};
  grid-template-rows: ${gridStyles.gridTemplateRows};
  gap: ${gridStyles.gap};
}

/* Items CSS */
.grid-item{
  background: #c8b6ff;
};

${itemsCss}`;

  const htmlCode = `<div class="grid">

 ${itemsPositions
   .map((_, itemIndex) => {
     return `<div class="grid-item grid-item-${itemIndex + 1}"> </div>
`;
   })
   .join(" ")}
</div>`;

  function copyCodeToClipboard() {
    if (showHtml) {
      copyToClipboard(htmlCode);
    } else {
      copyToClipboard(cssText);
    }

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
        Get the code
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
          <ModalHeader>CSS for your Grid</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Button
              onClick={() => showHtmlSet(!showHtml)}
              size={"sm"}
              colorScheme={"purple"}
              mr={3}
            >
              {showHtml ? "Show CSS" : "Show HTML"}
            </Button>

            {!showHtml ? (
              <Button
                onClick={() => gridAreaShorthandSet(!gridAreaShorthand)}
                size={"sm"}
                variant={"outline"}
                colorScheme={"purple"}
              >
                {gridAreaShorthand
                  ? "Use Column and Rows CSS"
                  : "Use Grid Area shorthand"}
              </Button>
            ) : null}

            {showHtml ? (
              <SyntaxHighlighter language="html" style={prism}>
                {htmlCode}
              </SyntaxHighlighter>
            ) : (
              <SyntaxHighlighter language="css" style={prism}>
                {cssText}
              </SyntaxHighlighter>
            )}
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
              onClick={copyCodeToClipboard}
              rightIcon={isCopied ? <FaCheck /> : <FaCopy />}
            >
              {isCopied ? "Copied" : "Copy to clipboard"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
