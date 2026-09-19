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
} from "@heroui/react";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AddFileModal = ({ fetchMessages, onAdded }) => {
  const router = useRouter();

  const [submitLoading, setSubmitLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const inputFileRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setErrorMessage("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleSelectFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleModalDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const submitMessage = async (blob) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": localStorage.getItem("token"),
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
      onAdded();
      await fetchMessages(false);
    } else {
      if (data.code === "403") {
        router.push("/login");
      }
      setErrorMessage(data?.message);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (!selectedFile) {
      setErrorMessage("Please select a file");
      return;
    }
    setSubmitLoading(true);
    try {
      const blob = await upload(selectedFile.name, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/files/upload",
        clientPayload: JSON.stringify({
          "X-Session-ID": localStorage.getItem("token"),
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
      <Button color="primary" className="w-[110px] ml-2" onPress={onOpen}>
        <span className="icon-plus"></span> File
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setSelectedFile(null);
          setErrorMessage("");
          setIsDragOver(false);
          onOpenChange();
        }}
        size="xl"
      >
        <ModalContent onDragOver={handleModalDrop} onDrop={handleModalDrop}>
          {(onClose) => (
            <>
              <ModalHeader>Upload your file here</ModalHeader>
              <ModalBody>
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputFileRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 h-44 px-4 border-2 border-dashed rounded-xl cursor-pointer select-none transition-all duration-200 ${
                    isDragOver
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-default-300 hover:border-primary-300 hover:bg-default-50"
                  }`}
                >
                  <input
                    name="file"
                    ref={inputFileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSelectFile(file);
                      e.target.value = "";
                    }}
                  />
                  {isDragOver ? (
                    <>
                      <span className="icon-files-empty text-4xl text-primary"></span>
                      <div className="text-sm font-medium text-primary">
                        Drop to select your file
                      </div>
                    </>
                  ) : selectedFile ? (
                    <>
                      <span className="icon-files-empty text-4xl text-primary"></span>
                      <div className="text-sm font-medium max-w-full truncate">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-default-400">
                        {formatFileSize(selectedFile.size)} · Click to
                        re-choose
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="icon-files-empty text-4xl text-default-400"></span>
                      <div className="text-sm font-medium text-default-500">
                        Drag & drop your file here
                      </div>
                      <div className="text-xs text-default-400">
                        or click to browse
                      </div>
                    </>
                  )}
                </div>
                <div className="text-red-500 text-sm">{errorMessage}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
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
