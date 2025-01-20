"use client";

import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ModalHeader,
} from "@nextui-org/react";

const AddFileModal = ({ fetchMessages }) => {
  const router = useRouter();

  const [submitLoading, setSubmitLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const inputFileRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const submitMessage = async (blob) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        type: "file",
        filename: blob.pathname.split("/").pop(),
        url: blob.url,
      }),
    });
    const data = await response.json();
    setSubmitLoading(false);
    if (data?.code === "200") {
      onClose();
      await fetchMessages();
    } else {
      if (data.code === "403") {
        router.push("/login");
      }
      setErrorMessage(data?.message);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSubmitLoading(true);
    try {
      const file = inputFileRef.current.files[0];
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/files/upload",
        clientPayload: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
      });
      await submitMessage(blob);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSubmitLoading(false);
  };

  return (
    <>
      <Button color="primary" className="w-[110px] ml-2" onClick={onOpen}>
        <span className="icon-plus"></span> File
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          inputFileRef.current.value = "";
          onOpenChange();
        }}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload your file here</ModalHeader>
              <ModalBody>
                <input name="file" ref={inputFileRef} type="file" required />
                <div className="text-red-500 text-sm">{errorMessage}</div>
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
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFileModal;
