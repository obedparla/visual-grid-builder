import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function MobileWarning() {
  const [modalOpen, modalOpenSet] = useState(false);

  useEffect(() => {
    const windowWidth = window.innerWidth;

    console.log("windowWidth", windowWidth);

    if (windowWidth < 768) {
      modalOpenSet(true);
    }
  }, []);
  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => {
        modalOpenSet(false);
      }}
      isCentered
      size={"xs"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Better used on Desktop</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>
            The builder relies on mouse dragging to move and resize elements, so
            for now it's recommended to use a Desktop browser for the best
            experience.
          </Text>

          <Text mt={4}>Full mobile support is coming.</Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => modalOpenSet(false)} variant={"ghost"}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
