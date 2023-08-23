import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginModal() {
  const [modalOpen, modalOpenSet] = useState(true);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

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
      size={"sm"}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign in</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={3}>
            <Input placeholder={"Email"} type={"email"} />

            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
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
