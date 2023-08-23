import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export function AboutModal() {
  const [modalOpen, modalOpenSet] = useState(true);
  const navigate = useNavigate();

  function closeModal() {
    modalOpenSet(false);
  }

  function navigateWhenCloseComplete() {
    navigate("/");
  }

  return (
    <Modal
      isOpen={modalOpen}
      onClose={closeModal}
      onCloseComplete={navigateWhenCloseComplete}
      isCentered
      size={"xl"}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About this project</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>
            CSS Grid is fantastic. However, using it can be difficult and time
            consuming, as you need to specify the position of each individual
            grid item.
          </Text>

          <Text mt={4}>
            I created Visual Grid Builder to make it easy to get the most out of
            CSS Grid. By dragging and resizing each individual item, you can
            quickly iterate and create complex layouts, then get the generated
            code to copy/paste it on your project.
          </Text>

          <Text mt={4}>
            Created by{" "}
            <Link href={"https://obedparla.com"} color={"blue.500"}>
              Obed Parlapiano
            </Link>
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={closeModal} variant={"ghost"}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
