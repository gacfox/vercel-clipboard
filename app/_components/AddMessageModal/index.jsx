"use client";

import { useRouter } from "next/navigation";
import {
  Textarea,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";

const AddMessageModal = ({ fetchMessages }) => {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [content, setContent] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content) {
      setContentErrorMessage("Please enter your message");
      return;
    }
    setSubmitLoading(true);
    return await submitMessage();
  };

  const submitMessage = async () => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        type: "text",
        content,
      }),
    });
    const data = await response.json();
    setSubmitLoading(false);
    if (data?.code === "200") {
      onClose();
      fetchMessages();
    } else {
      if (data.code === "403") {
        router.push("/login");
      }
      setContentErrorMessage(data?.message);
    }
  };

  return (
    <>
      <Button color="primary" className="w-[110px]" onClick={onOpen}>
      <span className="icon-plus"></span> Message
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setContent("");
          onOpenChange();
        }}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Enter your message here</ModalHeader>
              <ModalBody>
                <Textarea
                  label="Text Message"
                  className="w-full"
                  onValueChange={setContent}
                  value={content}
                  errorMessage={contentErrorMessage}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" onClick={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  isLoading={submitLoading}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMessageModal;
