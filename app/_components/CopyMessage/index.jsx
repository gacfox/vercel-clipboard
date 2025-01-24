"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

const CopyMessage = ({ messageContent }) => {
  const [buttonText, setButtonText] = useState("Copy");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setButtonText("Copied!");
      setTimeout(() => {
        setButtonText("Copy");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
        className="ml-2"
        onPress={copyToClipboard}
        isDisabled={buttonText === "Copied!"}
      >
        <span className="icon-files-empty"></span>
        <span className="hidden md:inline">{buttonText}</span>
      </Button>
    </>
  );
};

export default CopyMessage;
