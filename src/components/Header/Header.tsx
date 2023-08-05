import "./styles.css";
import {
  Button,
  ButtonGroup,
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

export function Header() {
  const [aboutModalOpen, aboutModalOpenSet] = useState(false);

  return (
    <>
      <header className={"header"}>
        <div className={"header__logo"}>
          <img src={"/logo.svg"} />
          <Text className={"header__name"} color={"#805ad5"}>
            Visual Grid Builder
          </Text>
        </div>
        <nav className={"header__links"}>
          <ButtonGroup size={"sm"} variant={"ghost"} colorScheme={"purple"}>
            <Button onClick={() => aboutModalOpenSet(true)}>About</Button>
          </ButtonGroup>
        </nav>
      </header>

      <Modal
        isOpen={aboutModalOpen}
        onClose={() => {
          aboutModalOpenSet(false);
        }}
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
              I created Visual Grid Builder to make it easy to get the most out
              of CSS Grid. By dragging and resizing each individual item, you
              can quickly iterate and create complex layouts, then get the
              generated code to copy/paste it on your project.
            </Text>

            <Text mt={4}>
              Created by{" "}
              <Link href={"https://obedparla.com"} color={"blue.500"}>
                Obed Parlapiano
              </Link>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => aboutModalOpenSet(false)} variant={"ghost"}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
