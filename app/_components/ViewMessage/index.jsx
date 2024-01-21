"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalHeader,
} from "@nextui-org/react";

const ViewMessage = ({ messageContent }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button color="default" size="sm" onClick={onOpen}>
      <span className="icon-eye"></span> View
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>View</ModalHeader>
              <ModalBody className="max-h-96 overflow-auto">{messageContent}</ModalBody>
              <ModalFooter>
                <Button color="default" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewMessage;
